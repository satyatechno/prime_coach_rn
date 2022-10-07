import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Container from "../../../../../components/Container";
import Select from "../../../../../components/Select";
import Loader from "../../../../../components/Loader";
import PrimeButton from "../../../../../components/PrimeButton";
import {
  POP_MEDIUM,
  POP_REGULAR,
  ROBO_REGULAR,
} from "../../../../../constants/Fonts";
import { Colors } from "../../../../../constants/Colors";
import { standardPostApi } from "../../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import { BUTTONS_BORDERED, BUTTONS_FILLED } from "../../../data/Buttons";
import { Player } from "../Testing";
import CustomButton from "../../../../../components/customButton/CustomButton";
import { findSize } from "../../../../../utils/helper";
import TildView from "../../../../../components/tildView/TildView";
import { Toaster } from "../../../../../components/Toaster";
import Icon from "react-native-vector-icons/AntDesign";
import CustomModal from "../../../../../components/customModal/CustomModal";
import CustomInput from "../../../../../components/customInput/CustomInput";

export default class TestingResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      protocolPicker: {},
      selectedProtocol: 1,
      protocolsLoading: true,
      protocolName: "",
      allPlayers: [],
      expanded: [],
      resultCount: 0,
      currentPage: 1,
      modalVisible: false,
      testingResultUser: "",
      testingProtocolExercisesResults: [],
      savingValue: false,
      playerExerciseData: [],
      playerExerciseResultData: {},
    };
    this.showAllTestingProtocols();
  }

  showAllTestingProtocols = async () => {
    const { navigation } = this.props;
    const TeamData = navigation.getParam("content").playerDetails.teamData;
    this.setState({ protocolsLoading: true });
    try {
      const res = await standardPostApi(
        "show_all_testing_protocol",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          team_id: TeamData.id,
        },
        true
      );
      if (res.data.code == 200) {
        // await this.testingProtocolDetails();
        this.setState({
          protocolPicker: res.data.data,
          protocolsLoading: false,
        });
        console.log("picker ", res.data.data);
        if (res.data.data.pickerArray?.length) {
          const SelectedPicker = res.data.data.pickerArray[0];
          this.setState({
            selectedProtocol: res.data.data.pickerArray[0]?.value,
          });

          // await this.testingProtocolDetails();
          // await this.loadChartData();
          this.testingProtocolResultCount(SelectedPicker.id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  testingProtocolResultCount = async (protocolId) => {
    const { navigation } = this.props;

    const teamData = navigation.getParam("content").playerDetails.teamData;
    try {
      const res = await standardPostApi(
        "testing_protocol_resultset_count",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          testing_protocol_id: protocolId,
          team_id: teamData.id,
        },
        true
      );
      if (res.data.code === 200) {
        // console.log('aaaaaaaaaaaaaa',res.data);
        if (res.data.data.resultset_count === 0) {
          // this.createUpdateTestingProtocolResultset(protocolId, 'callMessage');
        } else {
          this.setState({ resultCount: res.data?.data?.resultset_count });
          this.testingProtocolDetails(this.state.currentPage);
        }
      }
    } catch (ex) {
      console.error(ex);
    }
  };
  testingProtocolDetails = async (page) => {
    const { navigation } = this.props;
    const PlayerData = navigation.getParam("content").playerDetails.player;
    const TeamData = navigation.getParam("content").playerDetails.teamData;
    const { selectedProtocol, testingProtocolExercises } = this.state;
    this.setState({ updatingProtocol: true });
    try {
      const res = await standardPostApi(
        "testing_protocol_details",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          testing_protocol_id: selectedProtocol,
          team_id: TeamData.id,
          access_user_id: PlayerData.id,
          resultset_no: page,
        },
        true
      );
      if (res.data.code == 200) {
        await this.setState({
          exercisePicker: res.data.data.testing_protocol_exercise_selectpicker,
          protocolName: res.data.data.testing_protocol,
          allPlayers: res.data.data.user_testing_protocol_result,
          testingProtocolExercises: res.data.data.testing_protocol_exercises,
          updatingProtocol: false,
        });
        this.setState({
          selectedExercise: this.state.testingProtocolExercises[0].id,
        });
        console.log("testingProtocolDetails ", res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ updatingProtocol: false });
  };

  toggleExpand = (index) => {
    this.setState({ expanded: [index] });
  };

  checkNonNegative = () => {
    const { testingResultUser } = this.state;
    if (testingResultUser.trim().length === 0 || testingResultUser < 0) {
      alert("This value can not be empty or negative.");
      this.setState({ savingValue: false });
      return false;
    }
    return true;
  };

  save_user_testing_protocol = async () => {
    const { testingProtocolExercisesResults } = this.state;
    const { navigation } = this.props;
    const PlayerData = navigation.getParam("content").playerDetails.player;
    const TeamData = navigation.getParam("content").playerDetails.teamData;
    this.setState({ savingValue: true });
    if (this.checkNonNegative()) {
      try {
        const res = await standardPostApi(
          "save_user_testing_protocol",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            testing_protocol_id: this.state.selectedProtocol,
            user_id: PlayerData?.id,
            testing_protocol_exercise: JSON.stringify(
              testingProtocolExercisesResults
            ),
            team_id: TeamData?.id,
            resultset_no: this.state.currentPage,
          },
          true
        );
        if (res.data.code == 200) {
          this.setState({ modalVisible: false, savingValue: false });
          await this.testingProtocolDetails(this.state.currentPage);
        }
      } catch (error) {
        console.log(error);
      }
      this.setState({ savingValue: false });
    }
  };

  setTestResults = async (text) => {
    this.setState({ testingResultUser: text });
    const { navigation } = this.props;
    const { testingResultUser, playerExerciseData, playerExerciseResultData } =
      this.state;
    let _exercisesArray = [];
    playerExerciseData.forEach((item) => {
      _exercisesArray.push({
        testing_protocol_exercise_id: item.id.toString(),
        testing_protocol_result: item.result.toString(),
      });
    });
    _exercisesArray.forEach((i) => {
      if (
        i.testing_protocol_exercise_id ===
        playerExerciseResultData.id.toString()
      ) {
        i.testing_protocol_result = text;
      }
    });
    this.setState({
      testingProtocolExercisesResults: [..._exercisesArray],
    });
    console.log("exercise data", _exercisesArray);
  };

  render() {
    const { navigation } = this.props;
    const {
      protocolsLoading,
      protocolName,
      allPlayers,
      selectedProtocol,
      protocolPicker,
      modalVisible,
      playerExerciseData,
      playerExerciseResultData,
      currentPage,
      testingResultUser,
      expanded,
      resultCount,
      savingValue,
      testingProtocolExercisesResults,
    } = this.state;
    const PlayerData = navigation.getParam("content").playerDetails.player;
    const TeamData = navigation.getParam("content").playerDetails.teamData;
    const Role = navigation.getParam("content").playerDetails?.role;
    let PLAYER_EXERCISES = allPlayers?.find(
      (x) => x?.id === PlayerData?.id
    )?.exercise;
    console.log("first", JSON.stringify(Role));
    return (
      <>
        <Container
          backFn={() => this.props.navigation.goBack()}
          title="Testing Results"
        >
          {protocolsLoading ? (
            <Loader />
          ) : protocolPicker?.pickerArray?.length == 0 ? (
            <Text
              style={{
                textAlign: "center",
                color: Colors.WHITE_COLOR,
                fontSize: 16,
              }}
            >
              No Testing Protocol Found
            </Text>
          ) : (
            <View>
              {/* <Text style={styles.testing}>
              Testing Results {">"} {protocolName}
            </Text> */}
              {/* <Select
              pickerProps={{
                onValueChange: async (value) => {
                  await this.setState({ selectedProtocol: value });
                  await this.testingProtocolDetails(
                    this.state.selectedProtocol
                  );
                },
                style: {
                  backgroundColor: Colors.BG_LIGHT,
                  borderColor: Colors.SKY_COLOR,
                },
              }}
              iosLabel={Colors.WHITE_COLOR}
              androidBorderColor={Colors.SKY_COLOR}
              androidLabel={Colors.WHITE_COLOR}
              androidBgColor={Colors.BG_LIGHT}
              pickerItems={this.state.protocolPicker.pickerArray}
              pickerValue={this.state.selectedProtocol}
              iconColor={Colors.WHITE_COLOR}
            /> */}
              <Select
                containerStyle={{
                  borderColor: Colors.WHITE_COLOR,
                  borderWidth: 1,
                  backgroundColor: Colors.BACKGROUND,
                }}
                pickerProps={{
                  onValueChange: async (value) => {
                    await this.setState({ selectedProtocol: value });
                    await this.testingProtocolDetails(this.state.currentPage);
                  },
                  style: {
                    backgroundColor: Colors.VALHALLA,
                  },
                }}
                iosLabel={Colors.WHITE_COLOR}
                androidBorderColor={Colors.SKY_COLOR}
                androidLabel={Colors.WHITE_COLOR}
                androidBgColor={Colors.VALHALLA}
                pickerItems={this.state.protocolPicker.pickerArray}
                pickerValue={this.state.selectedProtocol}
                iconColor={Colors.WHITE_COLOR}
              />
              {/* <View style={styles.btnRowOne}>
              {BUTTONS_FILLED.map((item) => {
                return (
                  <PrimeButton
                    buttonProps={{
                      style: [
                        styles.filledBtns,
                        { backgroundColor: item.themeColor },
                      ],
                      onPress: () => {
                        item.isButton
                          ? Alert.alert(
                              'Delete Testing Protocol',
                              `Are you sure you want to delete the protocol "${protocolName}" ? This change cannot be undone!`,
                              [
                                { text: 'Cancel' },
                                {
                                  text: 'OK',
                                  onPress: () => this.deleteTestingProtocol(),
                                },
                              ]
                            )
                          : this.props.navigation.navigate(item.pageName, {
                              content: {
                                isCreatePage:
                                  item.btnName === 'Create' ? true : false,
                                teamData: TeamData,
                                protocol_id: this.state.selectedProtocol,
                              },
                              refreshFunc: () => {
                                this.showAllTestingProtocols();
                              },
                            });
                      },
                    }}
                    buttonText={item.btnName}
                    buttonTextProps={{
                      style: {
                        color: Colors.WHITE_COLOR,
                      },
                    }}
                  />
                );
              })}
            </View> */}
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.testing}>
                  {`${PlayerData?.first_name} ${PlayerData?.last_name}`} Testing
                  Result Page {this.state.currentPage}/{this.state.resultCount}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CustomButton
                  disabled={this.state.currentPage < 2}
                  type={1}
                  style={{
                    width: findSize(90),
                    backgroundColor: Colors.VALHALLA,
                    margin: 10,
                    opacity: this.state.currentPage < 2 ? 0.5 : 1,
                  }}
                  title="Prev"
                  textStyle={{ color: Colors.WHITE_COLOR }}
                  onPress={async () => {
                    if (this.state.currentPage > 1) {
                      await this.testingProtocolDetails(
                        this.state.currentPage - 1
                      );
                      this.setState({
                        currentPage: this.state.currentPage - 1,
                      });
                    }
                  }}
                />
                <CustomButton
                  disabled={this.state.currentPage >= this.state.resultCount}
                  type={1}
                  style={{
                    width: findSize(90),
                    backgroundColor: Colors.VALHALLA,
                    margin: 10,
                    opacity:
                      this.state.currentPage >= this.state.resultCount
                        ? 0.5
                        : 1,
                  }}
                  title="Next"
                  textStyle={{ color: Colors.WHITE_COLOR }}
                  onPress={async () => {
                    if (this.state.currentPage < this.state.resultCount) {
                      await this.testingProtocolDetails(
                        this.state.currentPage + 1
                      );
                      this.setState({
                        currentPage: this.state.currentPage + 1,
                      });
                    }
                  }}
                />
              </View>
              {/* <View style={styles.btnRowOne}>
              {BUTTONS_BORDERED?.filter((btn) => btn?.id !== 2)?.map((item) => {
                if (
                  (item?.id == 1 && this.state.currentPage > 1) ||
                  (item?.id == 3 &&
                    this.state.currentPage < this.state.resultCount) ||
                  item.id == 2
                )
                  return (
                    <PrimeButton
                      buttonProps={{
                        style: [
                          styles.filledBtns,
                          { borderColor: item.themeColor, borderWidth: 1 },
                        ],
                        onPress: async () => {
                          if (item.id == 1) {
                            if (this.state.currentPage > 1) {
                              await this.testingProtocolDetails(
                                this.state.currentPage - 1
                              );
                              this.setState({
                                currentPage: this.state.currentPage - 1,
                              });
                            }
                          } else if (item.id == 2) {
                            Alert.alert(
                              "Create New Testing Results Page",
                              "Are you sure you want to add new testing results page?",
                              [
                                {
                                  text: "Cancel",
                                  onPress: () => console.log("Cancel Pressed"),
                                },
                                {
                                  text: "OK",
                                  onPress: () =>
                                    this.createUpdateTestingProtocolResultset(
                                      this.state.selectedProtocol,
                                      ""
                                    ),
                                },
                              ]
                            );
                          }
                          if (item.id == 3) {
                            if (
                              this.state.currentPage < this.state.resultCount
                            ) {
                              await this.testingProtocolDetails(
                                this.state.currentPage + 1
                              );
                              this.setState({
                                currentPage: this.state.currentPage + 1,
                              });
                            }
                          }
                        },
                      }}
                      buttonText={item.btnName}
                      buttonTextProps={{
                        style: {
                          color: Colors.WHITE_COLOR,
                        },
                      }}
                    />
                  );
              })}
            </View> */}
              <View>
                {PLAYER_EXERCISES?.map((item) => (
                  <TildView
                    key={item?.id}
                    degree="4deg"
                    mainViewStyle={{ borderRadius: 10 }}
                    tildViewStyle={{ borderRadius: 10 }}
                    containerStyle={{ marginVertical: 1 }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 15,
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontSize: findSize(15),
                          fontFamily: POP_MEDIUM,
                          color: Colors.WHITE_COLOR,
                        }}
                      >
                        {item?.exercise}
                      </Text>

                      {item?.result > 0 ? (
                        <Text
                          style={{
                            color: Colors.WHITE_COLOR,
                            fontFamily: POP_REGULAR,
                            fontSize: findSize(16),
                            padding: 10,
                          }}
                        >
                          {item?.result}
                        </Text>
                      ) : (
                        <CustomButton
                          style={{ padding: 10 }}
                          onPress={() => {
                            if (Role === "Assistant Coach") {
                              Toaster(
                                "You are not authorized to perform this operation."
                              );
                            } else {
                              this.setState({
                                playerExerciseData: PLAYER_EXERCISES,
                                playerExerciseResultData: item,
                                user: item,
                                modalVisible: true,
                              });
                            }
                          }}
                        >
                          <Icon name="plus" size={23} color={Colors.ORANGE} />
                        </CustomButton>
                      )}
                    </View>
                  </TildView>
                ))}
              </View>
              {/* <View style={{ marginBottom: 25 }}>
                {allPlayers &&
                  allPlayers.map((item) => {
                    const IS_EXPANDED =
                      this.state.expanded.indexOf(item.id) >= 0;
                    return (
                      <View>
                        <Player
                          onPress={async () => await this.toggleExpand(item.id)}
                          playerName={item.name}
                          isExpanded={IS_EXPANDED}
                          protocolExercises={item.exercise}
                          onValuePress={(exerciseData, exerciseResult) =>
                            this.props.navigation.navigate("AddTestingResult", {
                              content: {
                                teamData: TeamData,
                                playerData: item,
                                exerciseData: exerciseData,
                                exerciseResult: exerciseResult,
                                selectedProtocol: selectedProtocol,
                              },
                              refreshFunc: () => {
                                this.testingProtocolDetails(
                                  this.state.currentPage
                                );
                                // this.loadChartData();
                              },
                            })
                          }
                        />
                      </View>
                    );
                  })}
              </View> */}
            </View>
          )}
        </Container>
        <CustomModal
          isVisible={modalVisible}
          onClose={() => {
            this.setState({
              playerExerciseData: [],
              playerExerciseResultData: {},
              modalVisible: false,
              testingResultUser: "",
            });
          }}
        >
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              fontFamily: POP_MEDIUM,
              fontSize: findSize(21),
              textAlign: "center",
            }}
          >
            Add Testing Result
          </Text>
          <CustomInput
            mainContainerStyle={{ marginVertical: 10 }}
            placeholder={"Enter Testing Result"}
            inputStyle={{ fontSize: 11, paddingTop: 12 }}
            onChangeText={(text) => {
              this.setTestResults(text);
            }}
            value={this.state.testingResultUser}
          />
          <CustomButton
            type={1}
            isLoading={this.state.savingValue}
            loaderColor={Colors.BACKGROUND}
            title={"Save"}
            onPress={() => {
              this.save_user_testing_protocol();
            }}
          />
        </CustomModal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  testing: {
    color: Colors.ORANGE,
    fontSize: 10,
    fontFamily: POP_REGULAR,
    textAlign: "center",
    marginVertical: 8,
  },
  teamName: {
    color: Colors.SKY_COLOR,
    fontFamily: ROBO_REGULAR,
    fontSize: 18,
  },
  playerName: {
    color: Colors.WHITE_COLOR,
    fontSize: 18,
    fontFamily: ROBO_REGULAR,
  },

  filledBtns: {
    width: 100,
    alignSelf: "center",
    marginBottom: 25,
    backgroundColor: Colors.BG_LIGHT,
  },
  btnRowOne: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
