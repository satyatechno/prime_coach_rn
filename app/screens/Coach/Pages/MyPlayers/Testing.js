import AsyncStorage from "@react-native-community/async-storage";
import React, { Component, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg from "react-native-svg";
import Icon from "react-native-vector-icons/AntDesign";
import IconChev from "react-native-vector-icons/FontAwesome5";
import {
  LineSegment,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
} from "victory-native";
import { standardPostApi } from "../../../../api/ApiWrapper";
import Container from "../../../../components/Container";
import CustomButton from "../../../../components/customButton/CustomButton";
import CustomInput from "../../../../components/customInput/CustomInput";
import CustomModal from "../../../../components/customModal/CustomModal";
import Loader from "../../../../components/Loader";
import Select from "../../../../components/Select";
import Spinnner from "../../../../components/Spinnner";
import TildView from "../../../../components/tildView/TildView";
import { Toaster } from "../../../../components/Toaster";
import { Colors } from "../../../../constants/Colors";
import { DEV_WIDTH } from "../../../../constants/DeviceDetails";
import {
  POP_MEDIUM,
  POP_REGULAR,
  ROBO_MEDIUM,
  ROBO_REGULAR,
} from "../../../../constants/Fonts";
import { findSize } from "../../../../utils/helper";
import { BUTTONS_FILLED } from "../../data/Buttons";

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
                  {item.exercise}{" "}
                  {item.units !== null && "(" + item.units + ")"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (props?.Role === "Assistant Coach") {
                      Toaster(
                        "You are not authorized to perform this operation."
                      );
                    } else {
                      props.onValuePress(props.protocolExercises, item);
                    }
                  }}
                  style={{ padding: 3 }}
                >
                  {item.result !== 0 ? (
                    <Text
                      style={[
                        styles.exerciseDetailTxt,
                        item?.color !== "#1e8bc3" && { color: item?.color },
                      ]}
                    >
                      {item.result}
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

function Chart(props) {
  console.log("dataaaaGrafff", props?.graphData);
  let DATA = [...props?.graphData];
  DATA.map((x) => {
    if (x?.name?.length > 10) x.name = x.name.slice(0, 8) + "...";
  });
  const [index, setIndex] = useState(0);
  let GraphData = DATA.slice(index, index + 10);
  const changeData = (type) => {
    if (type === "next") {
      setIndex(index + 10);
    } else {
      setIndex(index - 10);
    }
  };
  const fill = Colors.ORANGE;
  const chartTheme = {
    axis: {
      style: {
        tickLabels: {
          fill: Colors.GRAY,
          padding: 5,
        },
      },
    },
  };

  return (
    <View
      style={{
        marginBottom: 20,
      }}
    >
      <Svg>
        <VictoryChart
          style={{
            parent: {},
          }}
          domainPadding={0}
          width={DEV_WIDTH}
          height={350}
          theme={chartTheme}
        >
          <VictoryAxis
            domain={[0, 30]}
            // label={props.yAxisLabel}
            tickFormat={(t) => t}
            dependentAxis
            style={{
              axis: { stroke: Colors.BACKGROUND },
              grid: {
                stroke: Colors.BACKGROUND,
              },

              axisLabel: {
                stroke: Colors.GRAY,
                fontSize: 12,
                fontFamily: POP_REGULAR,
              },
              tickLabels: {
                fill: Colors.GRAY,
                padding: 20,
                fontFamily: POP_REGULAR,
                fontSize: findSize(16),
              },
            }}
          />
          <VictoryAxis
            tickFormat={(t) => t}
            style={{
              axis: { stroke: Colors.BACKGROUND },

              grid: {
                stroke: Colors.VALHALLA,
                strokeWidth: 8,
              },

              tickLabels: { fontSize: findSize(16) },
            }}
            tickLabelComponent={
              <VictoryLabel
                // angle={GraphData.length > 5 ? 45 : 0}
                // textAnchor={GraphData.length > 5 ? "start" : "middle"}
                // verticalAnchor={GraphData.length > 5 ? "middle" : "start"}
                angle={90}
                textAnchor={"start"}
                verticalAnchor={"middle"}
                style={{ fontSize: findSize(12), fill: Colors.GRAY }}
                backgroundPadding={{ top: 0 }}
              />
            }
          />
          <VictoryBar
            cornerRadius={{ top: 4, bottom: 4 }}
            style={{
              data: {
                // fill: ({ datum }) => Colors.ORANGE,
                fill: ({ datum }) => datum.color ?? Colors.ORANGE,
                fillOpacity: 1,
                strokeWidth: 0,
              },
            }}
            data={GraphData}
            x="name"
            y="result"
            animate={true}
            barWidth={8}
          />
        </VictoryChart>
      </Svg>
      <Text style={styles.graphTitle}>
        {`Team Testing Results for "${props?.exercise}" exercise`}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <CustomButton
          disabled={index == 0}
          style={{
            opacity: index !== 0 ? 1 : 0.6,
            backgroundColor: Colors.VALHALLA,
            height: findSize(28),
            width: findSize(28),
            borderRadius: findSize(14),
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 5,
          }}
          onPress={() => changeData("back")}
        >
          <IconChev
            name={"chevron-left"}
            size={15}
            color={Colors.WHITE_COLOR}
          />
        </CustomButton>
        <CustomButton
          disabled={index + 10 > DATA.length}
          style={{
            opacity: index + 10 < DATA.length ? 1 : 0.6,
            backgroundColor: Colors.VALHALLA,
            height: findSize(28),
            width: findSize(28),
            borderRadius: findSize(14),
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 5,
          }}
          onPress={() => changeData("next")}
        >
          <IconChev
            name={"chevron-right"}
            size={15}
            color={Colors.WHITE_COLOR}
          />
        </CustomButton>
      </View>
    </View>
  );
}
export default class Testing extends Component {
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
      testingResultUser: "",
      testingProtocolExercisesResults: [],
      savingValue: false,
      playerExerciseData: [],
      playerExerciseResultData: {},
      user: "",
    };
    this.showAllTestingProtocols();
  }

  showAllTestingProtocols = async () => {
    const { navigation } = this.props;
    const teamData = navigation.getParam("teamData");
    this.setState({ protocolsLoading: true });
    try {
      const res = await standardPostApi(
        "show_all_testing_protocol",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          team_id: teamData.id,
        },
        true
      );
      console.log("lengthh", res.data.data.pickerArray[0]);
      if (res.data.code == 200) {
        this.setState({
          protocolPicker: res.data.data,
          protocolsLoading: false,
        });
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

    const teamData = navigation.getParam("teamData");
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
          this.createUpdateTestingProtocolResultset(protocolId, "callMessage");
        } else {
          this.setState({ resultCount: res.data?.data?.resultset_count });
          this.testingProtocolDetails(this.state.currentPage);
        }
      }
    } catch (ex) {
      console.error(ex);
    }
  };
  createUpdateTestingProtocolResultset = async (protocolId, message) => {
    const { navigation } = this.props;

    const teamData = navigation.getParam("teamData");

    try {
      const res = await standardPostApi(
        "create_update_testing_protocol_resultset",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          testing_protocol_id: protocolId,
          team_id: teamData.id,
        },
        true
      );
      if (res.data.code === 200) {
        console.log("Response Of Create Result set", res.data.data);
        this.setState({
          resultCount: res.data?.data?.resultset_count,
          currentPage: res.data?.data?.resultset_count,
          // toggleCreateModal: false,
        });
        this.testingProtocolDetails(this.state.currentPage);
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

  testingProtocolDetails = async (page, msg) => {
    const { navigation } = this.props;
    const { selectedProtocol, currentPage } = this.state;
    const teamData = navigation.getParam("teamData");
    this.setState({ updatingProtocol: true });
    console.log("hhhhhh", page);
    try {
      const res = await standardPostApi(
        "testing_protocol_details",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          testing_protocol_id: selectedProtocol,
          team_id: teamData.id,
          resultset_no: page,
        },
        true
      );
      console.log("details", res.data);
      if (res.data.code === 200) {
        this.setState({
          exercisePicker: res.data.data.testing_protocol_exercise_selectpicker,
          protocolName: res.data.data.testing_protocol,
          allPlayers: [...res.data.data.user_testing_protocol_result],
          testingProtocolExercises: [
            ...res.data.data.testing_protocol_exercises,
          ],
          // updatingProtocol: false,
        });
        if (msg) {
        } else {
          this.setState({
            selectedExercise: res.data.data.testing_protocol_exercises?.[0]?.id,
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
    this.loadChartData(page);
    // this.setState({ updatingProtocol: false });
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

  deleteTestingProtocol = async () => {
    const { selectedProtocol } = this.state;
    this.setState({ updatingProtocol: true });
    try {
      const res = await standardPostApi(
        "delete_testing_protocol",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          testing_protocol_id: selectedProtocol,
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({ updatingProtocol: false, selectedProtocol: 1 });
        this.showAllTestingProtocols();
        // this.testingProtocolDetails(this.state.currentPage);
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
    this.setState({ savingValue: true });
    if (this.checkNonNegative()) {
      try {
        const res = await standardPostApi(
          "save_user_testing_protocol",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            testing_protocol_id: this.state.selectedProtocol,
            user_id: this.state?.user?.id,
            testing_protocol_exercise: JSON.stringify(
              testingProtocolExercisesResults
            ),
            team_id: navigation.getParam("teamData")?.id,
            resultset_no: this.state.currentPage,
          },
          true
        );
        if (res.data.code == 200) {
          this.setState({
            modalVisible: false,
            savingValue: false,
            testingResultUser: "",
          });
          await this.testingProtocolDetails(this.state.currentPage, true);
        }
      } catch (error) {
        console.log(error);
      }
      this.setState({ savingValue: false });
    }
  };

  setTestResults = async (text) => {
    await this.setState({ testingResultUser: text });
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
    await this.setState({
      testingProtocolExercisesResults: [..._exercisesArray],
    });
  };

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
    } = this.state;
    console.log("dddddd", exercisePicker?.pickerArray);
    return (
      <>
        <Container
          backFn={() => this.props.navigation.goBack()}
          title={"Testing"}
        >
          <Spinnner visible={updatingProtocol} />
          {protocolsLoading ? (
            <Loader />
          ) : (
            <View>
              <TildView>
                <View style={{ padding: 20 }}>
                  <Select
                    containerStyle={{
                      borderColor: Colors.WHITE_COLOR,
                      borderWidth: 1,
                    }}
                    pickerProps={{
                      onValueChange: async (value) => {
                        await this.setState({ selectedProtocol: value });
                        await this.testingProtocolDetails(
                          this.state.currentPage
                        );
                      },
                      style: {
                        backgroundColor: Colors.VALHALLA,
                      },
                    }}
                    iosLabel={Colors.WHITE_COLOR}
                    androidBorderColor={Colors.SKY_COLOR}
                    androidLabel={Colors.WHITE_COLOR}
                    androidBgColor={Colors.VALHALLA}
                    pickerItems={protocolPicker.pickerArray}
                    pickerValue={this.state.selectedProtocol}
                    iconColor={Colors.WHITE_COLOR}
                  />
                  {Role === "Assistant Coach" ? null : (
                    <View style={styles.btnRowOne}>
                      {BUTTONS_FILLED.map((item) => {
                        return (
                          <CustomButton
                            style={{
                              justifyContent: "center",
                              alignItem: "center",
                            }}
                            onPress={() => {
                              item.isButton
                                ? Alert.alert(
                                    "Delete Testing Protocol",
                                    `Are you sure you want to delete the protocol "${protocolName}" ? This change cannot be undone!`,
                                    [
                                      { text: "Cancel" },
                                      {
                                        text: "OK",
                                        onPress: () =>
                                          this.deleteTestingProtocol(),
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
                                        this.showAllTestingProtocols();
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
              {protocolPicker?.pickerArray?.length == 0 ? (
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
                  <Text style={styles.testing}>
                    {teamData.team_name} Testing Result Page{" "}
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
                            (await this.testingProtocolDetails(
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
                      pickerItems={exercisePicker?.pickerArray ?? []}
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
                          await this.testingProtocolDetails(
                            this.state.currentPage - 1,
                            true
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
                          await this.testingProtocolDetails(
                            this.state.currentPage + 1,
                            true
                          );
                          this.setState({
                            currentPage: this.state.currentPage + 1,
                          });
                        }
                      }}
                    />
                  </View>

                  <View style={{}}>
                    {chartData !== null && testingProtocolExercises.length > 0 && (
                      <View>
                        <Chart
                          graphData={chartData?.user_data}
                          // graphData={TempData}
                          yAxisLabel={`Result (${
                            chartData?.units !== null
                              ? chartData?.units
                              : "units"
                          })`}
                          exercise={chartData?.exercise}
                        />
                      </View>
                    )}
                  </View>
                  <View style={{ marginBottom: 25 }}>
                    {allPlayers &&
                      allPlayers.map((item) => {
                        const playerExerciseData = item?.exercise?.find(
                          (x) => x?.id == this.state.selectedExercise
                        );
                        console.log(
                          "playerexeeee",
                          JSON.stringify(playerExerciseData)
                        );
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
                                  {item.name}
                                </Text>
                                {playerExerciseData?.result > 0 ? (
                                  <Text
                                    style={{
                                      color: Colors.WHITE_COLOR,
                                      fontFamily: POP_REGULAR,
                                      fontSize: findSize(16),
                                      padding: 10,
                                    }}
                                  >
                                    {playerExerciseData?.result}
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
                                          playerExerciseData: item.exercise,
                                          playerExerciseResultData:
                                            playerExerciseData,
                                          user: item,
                                          modalVisible: true,
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
                            {/*  <Player
                             onPress={async () =>
                              await this.toggleExpand(item.id)
                            }
                            playerName={item.name}
                            isExpanded={IS_EXPANDED}
                            protocolExercises={item.exercise}
                            onValuePress={(exerciseData, exerciseResult) =>
                              this.props.navigation.navigate(
                                "AddTestingResult",
                                {
                                  content: {
                                    teamData: teamData,
                                    playerData: item,
                                    exerciseData: exerciseData,
                                    exerciseResult: exerciseResult,
                                    selectedProtocol: selectedProtocol,
                                    currentPage: this.state.currentPage,
                                  },
                                  refreshFunc: async () => {
                                    await this.testingProtocolDetails(
                                      this.state.currentPage
                                    );
                                    // await this.loadChartData(
                                    //   this.state.currentPage
                                    // );
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
    marginTop: 10,
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
    fontSize: findSize(12),
    color: Colors.WHITE_COLOR,
    textAlign: "center",
    fontFamily: POP_REGULAR,
    marginTop: 20,
  },
});
