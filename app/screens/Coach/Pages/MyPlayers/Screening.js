import AsyncStorage from "@react-native-community/async-storage";
import React, { Component, createRef, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Svg from "react-native-svg";
import Icon from "react-native-vector-icons/AntDesign";
import IconChev from "react-native-vector-icons/FontAwesome5";
import WebView from "react-native-webview";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
} from "victory-native";
import {
  standardPostApi,
  standardPostApiJsonBased,
  uploadVideoOnServer,
} from "../../../../api/ApiWrapper";
import Container from "../../../../components/Container";
import CustomButton from "../../../../components/customButton/CustomButton";
import CustomInput from "../../../../components/customInput/CustomInput";
import CustomModal from "../../../../components/customModal/CustomModal";
import Loader from "../../../../components/Loader";
import PrimeButton from "../../../../components/PrimeButton";
import Select from "../../../../components/Select";
import Spinnner from "../../../../components/Spinnner";
import TildView from "../../../../components/tildView/TildView";
import { Toaster } from "../../../../components/Toaster";
import VideoComponent from "../../../../components/videoComponent/VideoComponent";
import { Colors } from "../../../../constants/Colors";
import { DEV_HEIGHT, DEV_WIDTH } from "../../../../constants/DeviceDetails";
import {
  POP_MEDIUM,
  POP_REGULAR,
  ROBO_BOLD,
  ROBO_MEDIUM,
  ROBO_REGULAR,
} from "../../../../constants/Fonts";
import i18n from "../../../../locale/i18n";
import { findHeight, findSize } from "../../../../utils/helper";
import { BUTTONS_BORDERED, BUTTONS_FILLED_SCREENING } from "../../data/Buttons";

export function Player(props) {
  return (
    <View>
      <TouchableOpacity onPress={props.onPress} style={styles.playerBtn}>
        <Icon
          name={props.isExpanded ? "minuscircleo" : "pluscircleo"}
          size={20}
          color={Colors.SKY_COLOR}
        />
        <Text style={styles.playerName}>{props.playerName}</Text>
      </TouchableOpacity>
      {props.isExpanded &&
        props.protocolExercises &&
        props.protocolExercises.map((item) => {
          return (
            <View style={styles.exerciseDetailBg}>
              <View style={styles.exerciseRow}>
                <Text
                  style={[
                    styles.exerciseDetailTxt,
                    { width: (DEV_WIDTH * 78) / 100 },
                  ]}
                >
                  {item.name}
                </Text>
                <TouchableOpacity
                  onPress={
                    item.screening_protocol_test_result?.length == 0
                      ? () => props.onAddPress(item)
                      : () => props.onViewPress(item)
                  }
                  style={{ padding: 3 }}
                >
                  {item.screening_protocol_test_result?.length !== 0 ? (
                    <Text
                      style={{
                        color: Colors.SKY_COLOR,
                        textDecorationLine: "underline",
                      }}
                    >
                      View
                    </Text>
                  ) : (
                    <Icon name="plus" size={18} color={Colors.SKY_COLOR} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
    </View>
  );
}

export default class Screening extends Component {
  constructor(props) {
    super(props);
    this.state = {
      protocolsLoading: true,
      expanded: [],
      protocolPicker: {},
      selectedProtocol: 1,
      protocolName: "",
      updatingProtocol: false,
      allPlayers: [],
      exercisePicker: null,
      chartData: null,
      testingProtocolExercises: [],
      selectedExercise: null,
      currentPage: 1,
      resultCount: 0,
      modalVisible: false,
      playerTestData: {},
      modalVisible1: false,
      loading: false,
      uploadLoading: false,
      description: "",
      video: "",
      playerId: "",
    };
    this.webViewRef = createRef();
    this.showAllScreeningProtocols();
  }

  convertToIframe = (url) => {
    return (
      '<video width="100%" height="100%" controls><source src="' +
      url +
      '" type="video/mp4" /></video>'
    );
  };

  showAllScreeningProtocols = async () => {
    const { navigation } = this.props;
    const teamData = navigation.getParam("teamData");
    this.setState({ protocolsLoading: true });
    try {
      const res = await standardPostApi(
        "screening_protocols_with_tests",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          team_id: teamData.id,
        },
        true
      );
      if (res.data.code == 404) {
        console.log("ress data", res.data);

        this.setState({ protocolsLoading: false, protocolPicker: [] });
      }
      if (res.data.code == 200) {
        const SelectedPicker = res.data.data.screening_protocols[0];
        const pickerData = res.data.data?.screening_protocols?.map((item) => {
          return {
            id: item?.id,
            value: item?.id,
            label: item?.name,
          };
        });
        this.setState({
          protocolPicker: pickerData,
          protocolsLoading: false,
          protocolName: SelectedPicker?.name,
          selectedProtocol: SelectedPicker?.id,
        });
        // await this.displayProtocolResult();
        // await this.loadChartData();
        this.screeningProtocolResultCount(SelectedPicker.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  screeningProtocolResultCount = async (protocolId) => {
    const { navigation } = this.props;

    const teamData = navigation.getParam("teamData");
    try {
      const res = await standardPostApi(
        "screening_protocol_resultset_count",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          screening_protocol_id: protocolId,
          team_id: teamData.id,
        },
        true
      );
      if (res.data.code === 200) {
        if (res.data.data.resultset_count === 0) {
          // console.log('aaaaaaaaaaaaaa');
          this.createUpdateScreeningProtocolResultset(
            protocolId,
            "callMessage"
          );
        } else {
          this.setState({ resultCount: res.data?.data?.resultset_count });
          this.displayProtocolResult(this.state.currentPage);
        }
      }
    } catch (ex) {
      console.error(ex);
    }
  };
  createUpdateScreeningProtocolResultset = async (protocolId, message) => {
    const { navigation } = this.props;

    const teamData = navigation.getParam("teamData");

    try {
      const res = await standardPostApi(
        "create_update_screening_protocol_resultset",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          screening_protocol_id: protocolId,
          team_id: teamData.id,
        },
        true
      );
      if (res.data.code === 200) {
        // console.log('Response Of Create Result set', res.data.data);
        this.setState({
          resultCount: res.data?.data?.resultset_count,
          currentPage: res.data?.data?.resultset_count,
          // toggleCreateModal: false,
        });
        this.displayProtocolResult(this.state.currentPage);
        if (message === "callMessage") {
        } else {
          Toaster(res.data.message, Colors.GREEN_COLOR);
          // alert(res.data.message);
        }
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  displayProtocolResult = async (page, msg) => {
    const { navigation } = this.props;
    const { selectedProtocol, currentPage } = this.state;
    const teamData = navigation.getParam("teamData");
    this.setState({ updatingProtocol: true });
    try {
      const res = await standardPostApi(
        "user_based_screening_protocol_test_result_data",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          protocol_id: selectedProtocol,
          team_id: teamData.id,
          resultset_no: page,
        },
        true
      );
      if (res.data.code === 200) {
        console.log("details", res.data.data.players[0]);
        this.setState({
          exercisePicker: res.data.data.screening_protocol_tests,

          // protocolName: res.data.data.screening_protocol_tests?.[0]?.name,
          allPlayers: [...res.data.data.players],
          // testingProtocolExercises: [
          //   ...res.data.data.testing_protocol_exercises,
          // ],
          updatingProtocol: false,
        });
        if (msg) {
        } else {
          this.setState({
            selectedExercise: res.data.data.screening_protocol_tests?.[0]?.id,
          });
        }
        // console.log(
        //   'all players ',
        //   JSON.stringify(this.state.allPlayers, null, 2)
        // );
      }
    } catch (error) {
      console.log("Error", error);
    }
    // this.loadChartData(page);
    this.setState({ updatingProtocol: false });
  };

  loadChartData = async (page) => {
    const { navigation } = this.props;
    const { selectedExercise, currentPage } = this.state;
    const teamData = navigation.getParam("teamData");
    this.setState({ updatingProtocol: true });
    try {
      const res = await standardPostApi(
        "list_user_testing_protocol_result",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          testing_protocol_exercise_id: selectedExercise,
          team_id: teamData.id,
          resultset_no: page,
        },
        true
      );
      if (res.data.code !== 200) {
      }
      if (res.data.code == 200) {
        this.setState({
          // updatingProtocol: false,
          chartData: res.data.data.UserResult,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
    setTimeout(() => {
      this.setState({ updatingProtocol: false });
    }, 1000);
  };

  deleteScreeningProtocol = async () => {
    const { selectedProtocol } = this.state;
    this.setState({ updatingProtocol: true });
    try {
      const res = await standardPostApiJsonBased(
        "delete_screening_protocol",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          protocol_id: selectedProtocol,
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({ updatingProtocol: false, selectedProtocol: 1 });
        this.showAllScreeningProtocols();
        // this.displayProtocolResult(this.state.currentPage);
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ updatingProtocol: false });
  };

  toggleExpand = (index) => {
    if (this.state.expanded?.includes(index))
      this.setState({
        expanded: this.state.expanded?.filter((x) => x !== index),
      });
    else this.setState({ expanded: [index] });
  };

  onSelectVideo = async () => {
    try {
      // const { p, csv, plainText } = DocumentPicker.types;
      // const results = await DocumentPicker.pick({
      //   type: ['.mp4', 'video/*'],
      // });
      const results = await launchImageLibrary({
        mediaType: "video",
      });
      const file = results?.assets?.[0];

      this.setState({
        video: {
          name: file?.name ?? "",
          uri:
            Platform.OS === "ios" ? file.uri?.replace("file://", "") : file.uri,
          type: file.type,
          size: file.size,
        },
      });
    } catch (err) {
      //   if (DocumentPicker.isCancel(err)) {
      //     console.log('User cancelled the picker,');
      //   } else {
      //     throw err;
      //   }
    }
  };

  onSave = async () => {
    const teamData = this.props.navigation.getParam("teamData");

    const { description, video } = this.state;

    this.setState({ loading: true });

    const data = new FormData();

    data.append(
      "access_token",
      await AsyncStorage.getItem("@USER_ACCESS_TOKEN")
    );
    data.append("user_id", this.state.playerId);
    data.append("screening_protocol_test_id", this.state.playerTestData?.id);
    if (video?.uri) {
      data.append("video", video);
    }
    if (description?.length) {
      data.append("user_comment", this.state.description);
    }
    data.append("team_id", teamData?.id);
    data.append("resultset_no", this.state.currentPage);
    const isValid = this.validationAddResultTest();

    if (isValid) {
      uploadVideoOnServer("add_user_screening_protocol_test_result", data)
        .then((res) => {
          console.log("This is response of Add Result", res.data);
          if (res.data.code === 200) {
            this.webViewRef?.stopLoading();
            Toaster(res.data.message, Colors.GREEN_COLOR);
            this.displayProtocolResult(this.state.currentPage);
            this.setState({
              modalVisible1: false,
              playerId: "",
              playerTestData: {},
            });
          }
        })
        .catch((err) => {
          console.log("errorrrrr", err);
        })
        .finally(() => this.setState({ loading: false }));

      // try {
      //   const res = await standardPostApiJsonBased(
      //     'add_user_screening_protocol_test_result',
      //     undefined,
      //     data,
      //     true
      //   );

      //   console.log('This is response of Add Result', res);
      //   if (res.data.code === 200) {
      //     this.setState({ loading: false });
      //     Toaster(res.data.message, Colors.GREEN_COLOR);
      //     refreshFunc();
      //     this.props.navigation.goBack();
      //   }
      // } catch (error) {
      //   console.error(error);
      //   this.setState({ loading: false });
      // }
    }
  };
  validationAddResultTest() {
    const { video, description, playerTestData } = this.state;
    const { navigation } = this.props;

    if (playerTestData?.comment_allowed == "0") {
      if (!video?.uri?.length) {
        Toaster("Please upload viedio.", Colors.RED_COLOR);

        this.setState({ loading: false });
        return false;
      } else {
        return true;
      }
    } else {
      if (!description?.length) {
        Toaster("Comment Field is required.", Colors.RED_COLOR);

        this.setState({ loading: false });
        return false;
      } else {
        return true;
      }
    }
  }

  render() {
    const { navigation } = this.props;
    const teamData = navigation.getParam("teamData");
    const Role = navigation.getParam("role");

    const {
      protocolsLoading,
      selectedProtocol,
      protocolPicker,
      protocolName,
      updatingProtocol,
      allPlayers,
      exercisePicker,
      chartData,
      testingProtocolExercises,
      modalVisible,
      playerTestData,
      modalVisible1,
      loading,
      uploadLoading,
      description,
      video,
    } = this.state;

    return (
      <>
        <Container
          backFn={() => this.props.navigation.goBack()}
          title="Screening"
        >
          <Spinnner visible={updatingProtocol} />
          {protocolsLoading ? (
            <Loader />
          ) : (
            <View>
              {/* <Text style={styles.testing}>
              Screening Protocol {'>'} {protocolName}
            </Text> */}
              <TildView>
                <View style={{ padding: 20 }}>
                  <Select
                    containerStyle={{
                      borderColor: Colors.WHITE_COLOR,
                      borderWidth: 1,
                    }}
                    pickerProps={{
                      onValueChange: async (value) => {
                        await this.setState(() => ({
                          selectedProtocol: value,
                          protocolName: protocolPicker.find(
                            (x) => x.value === value
                          )?.label,
                        }));
                        await this.displayProtocolResult(
                          this.state.currentPage
                        );
                        // await this.loadChartData();
                      },
                      style: {
                        backgroundColor: Colors.VALHALLA,
                      },
                    }}
                    iosLabel={Colors.WHITE_COLOR}
                    androidBorderColor={Colors.SKY_COLOR}
                    androidLabel={Colors.WHITE_COLOR}
                    androidBgColor={Colors.VALHALLA}
                    pickerItems={protocolPicker}
                    pickerValue={this.state.selectedProtocol}
                    iconColor={Colors.WHITE_COLOR}
                  />
                  {Role === "Assistant Coach" ? null : (
                    <View style={styles.btnRowOne}>
                      {BUTTONS_FILLED_SCREENING.map((item) => {
                        return (
                          // <PrimeButton
                          //   buttonProps={{
                          //     style: [
                          //       styles.filledBtns,
                          //       { backgroundColor: item.themeColor },
                          //     ],
                          //     onPress: () => {
                          //       item.isButton
                          //         ? Alert.alert(
                          //             "Delete Screening Protocol",
                          //             `Are you sure you want to delete the protocol "${protocolName}" ? This change cannot be undone!`,
                          //             [
                          //               { text: "Cancel" },
                          //               {
                          //                 text: "OK",
                          //                 onPress: () =>
                          //                   this.deleteScreeningProtocol(),
                          //               },
                          //             ]
                          //           )
                          //         : this.props.navigation.navigate(
                          //             item.pageName,
                          //             {
                          //               content: {
                          //                 isCreatePage:
                          //                   item.btnName === "Create"
                          //                     ? true
                          //                     : false,
                          //                 teamData: teamData,
                          //                 protocol_id:
                          //                   this.state.selectedProtocol,
                          //               },
                          //               refreshFunc: () => {
                          //                 this.showAllScreeningProtocols();
                          //               },
                          //             }
                          //           );
                          //     },
                          //   }}
                          //   buttonText={item.btnName}
                          //   buttonTextProps={{
                          //     style: {
                          //       color: Colors.WHITE_COLOR,
                          //     },
                          //   }}
                          // />
                          <CustomButton
                            style={{
                              justifyContent: "center",
                              alignItem: "center",
                            }}
                            onPress={() => {
                              item.isButton
                                ? Alert.alert(
                                    "Delete Screening Protocol",
                                    `Are you sure you want to delete the protocol "${protocolName}" ? This change cannot be undone!`,
                                    [
                                      { text: "Cancel" },
                                      {
                                        text: "OK",
                                        onPress: () =>
                                          this.deleteScreeningProtocol(),
                                      },
                                    ]
                                  )
                                : this.props.navigation.navigate(
                                    item.pageName,
                                    {
                                      content: {
                                        isCreatePage:
                                          item.btnName === "Create"
                                            ? true
                                            : false,
                                        teamData: teamData,
                                        protocol_id:
                                          this.state.selectedProtocol,
                                      },
                                      refreshFunc: () => {
                                        this.showAllScreeningProtocols();
                                      },
                                    }
                                  );
                            }}
                          >
                            <Image
                              style={{
                                height: findSize(80),
                                width: findSize(80),
                              }}
                              source={item?.icon}
                            />
                            <Text
                              style={{
                                fontSize: findSize(15),
                                fontFamily: POP_REGULAR,
                                color: item?.themeColor,
                                textAlign: "center",
                              }}
                            >
                              {item.btnName}
                            </Text>
                          </CustomButton>
                        );
                      })}
                    </View>
                  )}
                </View>
              </TildView>
              {protocolPicker?.length == 0 ? (
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.WHITE_COLOR,
                    fontSize: 16,
                  }}
                >
                  No Screening Protocol Found
                </Text>
              ) : (
                <View>
                  {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation?.pop(1)}
                  >
                    <Text style={[styles.testing, { color: Colors.SKY_COLOR }]}>
                      {teamData.team_name}
                    </Text>
                  </TouchableOpacity>
                  <Text style={[styles.testing]}>
                    {" > "}Screening Results
                    {this.state.currentPage}/{this.state.resultCount}
                  </Text>
                </View> */}
                  <Text style={styles.testing}>
                    {teamData.team_name} Screening Result Page{" "}
                    {this.state.currentPage}/{this.state.resultCount}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 5,
                      justifyContent: "space-between",
                    }}
                  >
                    <Select
                      containerStyle={{
                        borderColor: Colors.WHITE_COLOR,
                        borderWidth: 1,
                        width: Role !== "Assistant Coach" ? "83%" : "100%",
                        marginBottom: 0,
                      }}
                      pickerProps={{
                        onValueChange: async (value) => {
                          this.setState({ selectedExercise: value });
                          value &&
                            (await this.displayProtocolResult(
                              this.state.currentPage,
                              true
                            ));
                        },
                        style: {
                          backgroundColor: Colors.VALHALLA,
                        },
                      }}
                      iosLabel={Colors.WHITE_COLOR}
                      androidLabel={Colors.WHITE_COLOR}
                      androidBgColor={Colors.VALHALLA}
                      pickerItems={
                        exercisePicker?.map((i) => ({
                          id: i?.id,
                          label: i?.name,
                          value: i?.id,
                        })) ?? []
                      }
                      pickerValue={this.state.selectedExercise}
                      iconColor={Colors.WHITE_COLOR}
                    />
                    {Role !== "Assistant Coach" ? (
                      <CustomButton
                        style={{
                          height: findSize(50),
                          width: findSize(50),
                          borderRadius: findSize(26),
                          justifyContent: "center",
                          alignItems: "center",

                          backgroundColor: Colors.ORANGE,
                        }}
                        onPress={() => {
                          Alert.alert(
                            "Create New Screening Results Page",
                            "Are you sure you want to add new screening results page?",
                            [
                              {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                              },
                              {
                                text: "OK",
                                onPress: () =>
                                  this.createUpdateScreeningProtocolResultset(
                                    this.state.selectedProtocol,
                                    ""
                                  ),
                              },
                            ]
                          );
                        }}
                      >
                        <Icon
                          name="plus"
                          size={25}
                          color={Colors.WHITE_COLOR}
                        />
                      </CustomButton>
                    ) : null}
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
                          await this.displayProtocolResult(
                            this.state.currentPage - 1
                          );
                          this.setState({
                            currentPage: this.state.currentPage - 1,
                          });
                        }
                      }}
                    />
                    <CustomButton
                      disabled={
                        this.state.currentPage >= this.state.resultCount
                      }
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
                          await this.displayProtocolResult(
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
                  {BUTTONS_BORDERED.map((item) => {
                    if (
                      (item?.id == 1 && this.state.currentPage > 1) ||
                      (item?.id == 3 &&
                        this.state.currentPage < this.state.resultCount) ||
                      (item.id == 2 && Role !== "Assistant Coach")
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
                                  await this.displayProtocolResult(
                                    this.state.currentPage - 1
                                  );
                                  this.setState({
                                    currentPage: this.state.currentPage - 1,
                                  });
                                }
                              } else if (item.id == 2) {
                                Alert.alert(
                                  "Create New Screening Results Page",
                                  "Are you sure you want to add new screening results page?",
                                  [
                                    {
                                      text: "Cancel",
                                      onPress: () =>
                                        console.log("Cancel Pressed"),
                                    },
                                    {
                                      text: "OK",
                                      onPress: () =>
                                        this.createUpdateScreeningProtocolResultset(
                                          this.state.selectedProtocol,
                                          ""
                                        ),
                                    },
                                  ]
                                );
                              }
                              if (item.id == 3) {
                                if (
                                  this.state.currentPage <
                                  this.state.resultCount
                                ) {
                                  await this.displayProtocolResult(
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
                  {/*                
              <Select
                pickerProps={{
                  onValueChange: async (value) => {
                    value &&
                      (await this.displayProtocolResult(
                        this.state.currentPage,
                        true
                      ));
                    this.setState({ selectedExercise: value });
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
                pickerItems={exercisePicker?.pickerArray ?? []}
                pickerValue={this.state.selectedExercise}
                iconColor={Colors.WHITE_COLOR}
              />
              <View>
                {chartData !== null && testingProtocolExercises.length > 0 && (
                  <View>
                    <Text style={styles.graphTitle}>
                      {`Team Testing Results for "${chartData?.exercise}" exercise`}
                    </Text>
                    <Chart
                      graphData={chartData?.user_data}
                      // graphData={TempData}
                      yAxisLabel={`Result (${
                        chartData?.units !== null ? chartData?.units : 'units'
                      })`}
                    />
                  </View>
                )}
              </View> */}
                  {/* <Text
                  style={{
                    color: Colors.WHITE_COLOR,
                    fontSize: 16,
                    fontFamily: ROBO_MEDIUM,
                    textDecorationLine: "underline",
                  }}
                >
                  Players
                </Text> */}
                  <View style={{ marginBottom: 25 }}>
                    {allPlayers &&
                      allPlayers.map((item) => {
                        const playerExerciseData =
                          item?.screening_protocol_test?.find(
                            (x) => x?.id == this.state.selectedExercise
                          );
                        console.log("ddddd", item?.user_id);
                        const IS_EXPANDED =
                          this.state.expanded.indexOf(item.id) >= 0;
                        return (
                          <View>
                            <TildView
                              degree="4deg"
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
                                  {item?.user_first_name +
                                    " " +
                                    item?.user_last_name}
                                </Text>
                                {playerExerciseData
                                  ?.screening_protocol_test_result?.length ? (
                                  <CustomButton
                                    style={{ padding: 10 }}
                                    onPress={() => {
                                      this.setState({
                                        playerTestData: playerExerciseData,
                                        playerId: item?.user_id,
                                        modalVisible: true,
                                      });
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: Colors.ORANGE,
                                        fontFamily: POP_REGULAR,
                                        fontSize: findSize(16),
                                      }}
                                    >
                                      View
                                    </Text>
                                  </CustomButton>
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
                                          playerTestData: playerExerciseData,
                                          playerId: item?.user_id,
                                          modalVisible1: true,
                                        });
                                      }
                                    }}
                                  >
                                    <Icon
                                      name="plus"
                                      size={23}
                                      color={Colors.ORANGE}
                                    />
                                  </CustomButton>
                                )}
                              </View>
                            </TildView>

                            {/* <Player
                            onPress={async () =>
                              await this.toggleExpand(item.id)
                            }
                            playerName={
                              item?.user_first_name + " " + item?.user_last_name
                            }
                            isExpanded={IS_EXPANDED}
                            protocolExercises={item.screening_protocol_test}
                            onViewPress={(screening_test) =>
                              this.props.navigation.navigate(
                                "ViewScreeningResult",
                                {
                                  teamData: teamData,
                                  playerData: item,
                                  screeningTest: screening_test,
                                  selectedProtocol: selectedProtocol,
                                  currentPage: this.state.currentPage,

                                  refreshFunc: async () => {
                                    await this.displayProtocolResult(
                                      this.state.currentPage
                                    );
                                  },
                                }
                              )
                            }
                            onAddPress={(screening_protocol_test) =>
                              this.props.navigation.navigate(
                                "AddScreeningResult",
                                {
                                  teamData: teamData,
                                  playerData: item,
                                  screeningTest: screening_protocol_test,
                                  selectedProtocol: selectedProtocol,
                                  currentPage: this.state.currentPage,

                                  refreshFunc: async () => {
                                    await this.displayProtocolResult(
                                      this.state.currentPage
                                    );
                                  },
                                }
                              )
                            }
                            Role={Role}
                          /> */}
                          </View>
                        );
                      })}
                  </View>
                </View>
              )}
            </View>
          )}
        </Container>

        <CustomModal
          isVisible={modalVisible}
          onClose={() => {
            this.webViewRef?.current?.stopLoading();
            this.setState({
              playerTestData: {},

              modalVisible: false,
            });
          }}
        >
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              fontFamily: POP_MEDIUM,
              fontSize: findSize(21),
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {playerTestData?.name}
          </Text>
          {playerTestData?.screening_protocol_test_result?.[0]?.user_video ? (
            <View
              style={{
                height: DEV_HEIGHT * 0.25,
                backgroundColor: Colors.VALHALLA,
                overflow: "hidden",
                width: DEV_WIDTH - 80,
              }}
            >
              <WebView
                ref={(o) => (this.webViewRef = o)}
                startInLoadingState={true}
                allowsFullscreenVideo
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                bounces={false}
                style={{
                  height: DEV_HEIGHT * 0.25,
                  backgroundColor: Colors.VALHALLA,
                  overflow: "hidden",
                  width: DEV_WIDTH - 80,
                }}
                source={{
                  html: this.convertToIframe(
                    playerTestData?.screening_protocol_test_result?.[0]
                      ?.user_video
                  ),
                }}
              />
            </View>
          ) : null}
          <Text
            style={{
              color: Colors.INPUT_PLACE,
              fontFamily: POP_REGULAR,
              fontSize: findSize(15),

              marginTop: 15,
              marginBottom: 5,
            }}
          >
            {playerTestData?.screening_protocol_test_result?.[0]?.user_comment}
          </Text>
        </CustomModal>

        <CustomModal
          isVisible={modalVisible1}
          onClose={() => {
            this.webViewRef?.current?.stopLoading();
            this.setState({
              playerTestData: {},

              modalVisible1: false,
            });
          }}
        >
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              fontFamily: POP_MEDIUM,
              fontSize: findSize(21),
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Add Screening Result
          </Text>
          <View
            style={{
              height: findSize(50),
              borderRadius: findSize(26),
              borderWidth: 1,
              borderColor: Colors.WHITE_COLOR,
              justifyContent: "center",
              paddingHorizontal: 15,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: findSize(13),
                fontFamily: POP_REGULAR,
                color: Colors.WHITE_COLOR,
              }}
            >
              {playerTestData?.name}
            </Text>
          </View>
          {playerTestData?.video_ref?.length ? (
            <View
              style={{
                height: DEV_HEIGHT * 0.25,
                backgroundColor: Colors.BACKGROUND,
                overflow: "hidden",
                width: DEV_WIDTH - 80,
              }}
            >
              <WebView
                ref={(o) => (this.webViewRef = o)}
                startInLoadingState={true}
                allowsFullscreenVideo
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                bounces={false}
                style={{
                  height: DEV_HEIGHT * 0.25,
                  backgroundColor: Colors.BACKGROUND,
                  overflow: "hidden",
                  width: DEV_WIDTH - 80,
                }}
                source={{
                  html: this.convertToIframe(playerTestData?.video_ref),
                }}
              />
            </View>
          ) : null}
          <Text
            style={{
              color: Colors.INPUT_PLACE,
              fontFamily: POP_REGULAR,
              fontSize: findSize(15),

              marginTop: 15,
              marginBottom: 5,
            }}
          >
            {playerTestData?.description}
          </Text>

          <View
            style={{
              backgroundColor: Colors.VALHALLA,
              padding: findSize(20),
              borderRadius: findSize(22),
            }}
          >
            {playerTestData?.comment_allowed == "1" ? (
              <CustomInput
                mainContainerStyle={{
                  marginVertical: 10,
                }}
                containerStyle={{
                  backgroundColor: Colors.BACKGROUND,
                }}
                placeholder={"Comment"}
                inputStyle={{
                  fontSize: 11,
                  paddingTop: 12,
                }}
                onChangeText={(text) => {
                  this.setState({ description: text });
                }}
                value={this.state.description}
              />
            ) : null}
            {video?.uri ? (
              <VideoComponent
                url={video?.uri}
                style={{}}
                onEdit={() => {
                  this.onSelectVideo();
                }}
                onDelete={() => {
                  alert("Coming Soon...");
                }}
                onPreview={() => {
                  console.log("first");
                  this.props.navigation.navigate("VideoPreview", {
                    data: {
                      url: video?.uri,
                      isLocal: true,
                    },
                  });
                }}
              />
            ) : (
              <CustomButton
                onPress={() => {
                  this.onSelectVideo();
                }}
                style={{
                  backgroundColor: Colors.BACKGROUND,
                  height: findHeight(50),
                  width: "100%",
                  borderRadius: findHeight(28),
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: 5,
                  marginBottom: 7,
                }}
              >
                <Image
                  source={require("../../../../../assets/images/upload.png")}
                  style={{
                    height: findSize(24),
                    width: findSize(24),
                  }}
                />
                <Text
                  style={{
                    fontSize: findSize(11),
                    fontFamily: POP_REGULAR,
                    color: Colors.INPUT_PLACE,
                    marginStart: 5,
                  }}
                >
                  Select Video
                </Text>
              </CustomButton>
            )}

            <CustomButton
              type={1}
              isLoading={this.state.loading}
              loaderColor={Colors.BACKGROUND}
              title={"Save"}
              onPress={() => {
                this.onSave();
              }}
            />
          </View>
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
  pickerBtn: {
    backgroundColor: Colors.BG_LIGHT,
    borderColor: Colors.SKY_COLOR,
  },
  pickerLabel: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_MEDIUM,
    fontSize: 16,
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
  playerBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  playerName: {
    fontSize: 16,
    fontFamily: ROBO_REGULAR,
    marginLeft: 10,
    color: Colors.WHITE_COLOR,
  },
  exerciseDetailTxt: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
  },
  exerciseDetailBg: {
    backgroundColor: Colors.BG_LIGHT,
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
  },
  exerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  graphTitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    fontFamily: ROBO_BOLD,
  },
});
