import React, { Component, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Container from "../../../../../components/Container";
import PrimeButton from "../../../../../components/PrimeButton";
import Select from "../../../../../components/Select";
import DatePicker from "../../../../../components/DatePicker";
import Spinnner from "../../../../../components/Spinnner";
import { Colors } from "../../../../../constants/Colors";
import { BUTTONS } from "../../TrainingPlan/PlanDetails";
import { DEV_WIDTH } from "../../../../../constants/DeviceDetails";
import {
  ROBO_REGULAR,
  ROBO_BOLD,
  POP_REGULAR,
} from "../../../../../constants/Fonts";
import IconChev from "react-native-vector-icons/FontAwesome5";
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryScatter,
} from "victory-native";
import AsyncStorage from "@react-native-community/async-storage";
import { standardPostApi } from "../../../../../api/ApiWrapper";
import moment from "moment";

import Svg from "react-native-svg";
import { Toaster } from "../../../../../components/Toaster";
import { findSize } from "../../../../../utils/helper";
import AntDesign from "react-native-vector-icons/AntDesign";
import BarGraph from "../../../../../components/barGraph/BarGraph";
import CustomButton from "../../../../../components/customButton/CustomButton";
const LOCATION = [
  { label: "Home", value: 1 },
  { label: "Gym", value: 2 },
];

const DATA = [{ label: "Assigned Intensity Average", value: 1 }];

// function Chart(props) {
//   const chartTheme = {
//     axis: {
//       style: {
//         tickLabels: {
//           fill: '#807d77',
//           padding: 5,
//         },
//       },
//     },
//   };
//   console.log('graph data', props?.graphData);
//   return (
//     <View>
//       <VictoryChart
//         style={{ parent: { marginTop: -30 } }}
//         domainPadding={20}
//         width={DEV_WIDTH}
//         theme={chartTheme}
//       >
//         <VictoryAxis
//           style={{
//             grid: {
//               stroke: 'none',
//             },
//           }}
//         />
//         <VictoryAxis
//           domain={[0, 10]}
//           tickFormat={(t) => t}
//           dependentAxis
//           style={{
//             axis: { stroke: '#3E8498' },
//             grid: {
//               stroke: '#3E8498',
//             },
//             axisLabel: {
//               stroke: '#807d77',
//               fontSize: 12,
//             },
//           }}
//         />
//         {props?.graphData?.length > 1 && (
//           <VictoryLine
//             style={{ data: { stroke: '#f00' } }}
//             data={props.graphData.length ? props.graphData : []}
//             interpolation="catmullRom"
//             x="week_number"
//             y="average_intensity"
//           />
//         )}
//         <VictoryScatter
//           data={props.graphData.length ? props.graphData : []}
//           size={5}
//           style={{ data: { fill: '#c43a31' } }}
//           events={[
//             {
//               target: 'data',
//               eventHandlers: {
//                 onPress: (evt, clickedProps) => {
//                   props.onDotPress(evt, clickedProps);
//                 },
//               },
//             },
//           ]}
//           x="week_number"
//           y="average_intensity"
//         />
//       </VictoryChart>
//     </View>
//   );
// }

function Chart(props) {
  let DATA = [...props?.graphData];
  const [index, setIndex] = useState(0);
  let GraphData = DATA.slice(index, index + 8);
  const changeData = (type) => {
    if (type === "next") {
      setIndex(index + 8);
    } else {
      setIndex(index - 8);
    }
  };
  const chartTheme = {
    axis: {
      style: {
        tickLabels: {
          fill: "#807d77",
          padding: 5,
        },
      },
    },
  };

  return (
    <View>
      <Svg
        width={DEV_WIDTH}
        // height={400}
        style={{ marginTop: -30, marginStart: -20 }}
      >
        <VictoryChart domainPadding={20} width={DEV_WIDTH} theme={chartTheme}>
          <VictoryAxis
            style={{
              grid: {
                stroke: "none",
              },
              tickLabels: {
                angle: GraphData.length > 5 ? 45 : 0,
                verticalAnchor: GraphData.length > 5 ? "middle" : "start",
                textAnchor: GraphData.length > 5 ? "start" : "middle",
                fontSize: 10,
              },
            }}
          />
          <VictoryAxis
            domain={[0, 10]}
            tickFormat={(t) => t}
            dependentAxis
            style={{
              axis: { stroke: "#3E8498" },
              grid: {
                stroke: "#3E8498",
              },
              axisLabel: {
                stroke: "#807d77",
                fontSize: 12,
              },
            }}
          />

          {GraphData.length > 1 && (
            <VictoryLine
              name="line"
              style={{ data: { stroke: "#f00" } }}
              // data={props.graphData ? props.graphData : []}
              data={GraphData}
              interpolation="catmullRom"
              x="week_number"
              y="average_intensity"
            />
          )}
          <VictoryScatter
            standalone={false}
            name="scatter"
            eventKey="scatter"
            // data={props.graphData ? props.graphData : []}
            data={GraphData}
            size={5}
            style={{ data: { fill: "#c43a31" } }}
            events={[
              {
                target: "data",

                eventHandlers: {
                  onPressIn: () => {
                    return {
                      target: "data",
                      mutation: (p) => props?.onDotPress(p),
                    };
                  },
                },
              },
            ]}
            x="week_number"
            y="average_intensity"
          />
        </VictoryChart>
      </Svg>
      {index !== 0 && (
        <View
          style={{
            position: "absolute",
            alignSelf: "flex-start",
            top: "30%",
            start: -10,
          }}
        >
          <TouchableOpacity onPress={() => alert("LLLL")}>
            <IconChev
              name={"chevron-circle-left"}
              size={22}
              color={Colors.SKY_COLOR}
              onPress={() => changeData("back")}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 11, color: Colors.SKY_COLOR }}>Prev</Text>
        </View>
      )}
      {index + 8 < DATA.length && (
        <View
          style={{
            position: "absolute",
            alignSelf: "flex-end",
            top: "30%",
          }}
        >
          <TouchableOpacity onPress={() => alert("LLLL")}>
            <IconChev
              name={"chevron-circle-right"}
              size={22}
              color={Colors.SKY_COLOR}
              onPress={() => changeData("next")}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 11, color: Colors.SKY_COLOR }}>Next</Text>
        </View>
      )}
    </View>
  );
}

export default class TrainingPlanPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLocation: 1,
      selectedData: 1,
      graphData: [],
      fetchingData: true,
      graphStartDate: "",
      graphEndDate: "",
    };
    this.loadChartData();
  }

  toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
  };

  loadChartData = async () => {
    const { graphStartDate, graphEndDate } = this.state;
    const { navigation } = this.props;
    const PlayerData = navigation.getParam("content").playerDetails.player;
    const start_date = graphStartDate
      ? moment(graphStartDate).format("YYYY-MM-DD").toString()
      : "";
    const end_date = graphEndDate
      ? moment(graphEndDate).format("YYYY-MM-DD").toString()
      : "";
    this.setState({ fetchingData: true });
    try {
      const res = await standardPostApi(
        "weekly_assigned_intensity",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          week_start_date: start_date,
          week_end_date: end_date,
          access_user_id: PlayerData.id,
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({ graphData: res.data.data, fetchingData: false });
        if (!res.data.data?.length)
          Toaster(res.data.message, Colors.GREEN_COLOR);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { navigation } = this.props;
    const PlayerData = navigation.getParam("content").playerDetails.player;
    const TeamData = navigation.getParam("content").playerDetails.teamData;
    const PageDetails = navigation.getParam("content").pageDetails;
    return (
      <Container backFn={() => this.props.navigation.goBack()}>
        <Spinnner visible={this.state.fetchingData} />
        <View>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Select
                containerStyle={{
                  borderColor: Colors.WHITE_COLOR,
                  borderWidth: 1,
                  backgroundColor: Colors.BACKGROUND,
                  width: DEV_WIDTH * 0.44,
                }}
                pickerProps={{
                  onValueChange: async (value) => {
                    this.setState({ selectedData: value });
                  },
                }}
                pickerItems={DATA}
                pickerValue={this.state.selectedData}
                // placeholder={"Report Type Select"}
              />
              <Select
                containerStyle={{
                  borderColor: Colors.WHITE_COLOR,
                  borderWidth: 1,
                  backgroundColor: Colors.BACKGROUND,
                  width: DEV_WIDTH * 0.44,
                }}
                pickerProps={{
                  onValueChange: (value) => {
                    this.setState({ selectedLocation: value });
                  },
                }}
                pickerItems={LOCATION}
                pickerValue={this.state.selectedLocation}
                placeholder={"Workout Location"}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <DatePicker
                mainContainerStyle={{ width: DEV_WIDTH * 0.38 }}
                containerStyle={{
                  borderColor: Colors.WHITE_COLOR,
                  borderWidth: 1,
                  backgroundColor: Colors.BACKGROUND,
                  width: DEV_WIDTH * 0.38,
                }}
                dateTimeProps={{
                  onChange: async (date) => {
                    this.setState({
                      graphStartDate: date,
                    });
                  },
                }}
                showDarkBg
                currentDate={this.state.graphStartDate}
                minDate={new Date("2000-01-01")}
                maxDate={new Date("2050-01-01")}
                placeholder={"Graph start date"}
              />

              <DatePicker
                placeholder={"Graph end date"}
                mainContainerStyle={{ width: DEV_WIDTH * 0.38 }}
                containerStyle={{
                  borderColor: Colors.WHITE_COLOR,
                  borderWidth: 1,
                  backgroundColor: Colors.BACKGROUND,
                  width: DEV_WIDTH * 0.38,
                }}
                dateTimeProps={{
                  onChange: async (date) => {
                    this.setState({
                      graphEndDate: date,
                    });
                  },
                }}
                showDarkBg
                currentDate={this.state.graphEndDate}
                minDate={new Date("2000-01-01")}
                maxDate={new Date("2050-01-01")}
              />
              <TouchableOpacity
                style={{
                  height: findSize(48),
                  width: findSize(48),
                  borderRadius: 25,
                  backgroundColor: Colors.ORANGE,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  this.loadChartData();
                }}
              >
                <AntDesign name="check" size={22} color={Colors.WHITE_COLOR} />
              </TouchableOpacity>
            </View>

            {this.state?.graphData?.length > 0 && (
              <BarGraph
                graphData={this.state.graphData}
                x="week_number"
                y="average_intensity"
              />
            )}
            <Text style={styles.graphTitle}>
              Weekly Assigned Average Intensity - Period -{" "}
              {this.state.selectedLocation == 1 ? "Home" : "Gym"}
            </Text>
          </View>
        </View>

        {/* <View style={styles.btnRowContainer}>
          {BUTTONS.map((item) => {
            return (
              <PrimeButton
                buttonProps={{
                  style: [
                    styles.borderedBtns,
                    {
                      borderColor: item.themeColor,
                      width: (DEV_WIDTH * 29) / 100,
                      marginBottom: 10,
                    },
                  ],
                  onPress: () =>
                    this.props.navigation.navigate("WeekDetails", {
                      content: {
                        buttonDetails: item,
                        playerDetails: PlayerData,
                        teamDetails: TeamData,
                      },
                    }),
                }}
                buttonText={item.btnName}
                buttonTextProps={{
                  style: {
                    color: item.themeColor,
                  },
                }}
              />
            );
          })}
        </View> */}
        <View style={styles.btnRowContainer}>
          {BUTTONS.map((item) => {
            return (
              <CustomButton
                type={1}
                isLoading={false}
                style={{
                  width: findSize(185),
                  height: findSize(49),
                  backgroundColor: item.themeColor,
                }}
                textStyle={{ fontSize: findSize(11) }}
                title={item.btnName}
                onPress={() => {
                  this.props.navigation.navigate("WeekDetails", {
                    content: {
                      buttonDetails: item,
                      playerDetails: PlayerData,
                      teamDetails: TeamData,
                    },
                  });
                }}
              />
            );
          })}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  btnRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  borderedBtns: {
    width: (DEV_WIDTH * 40) / 100,
    alignSelf: "center",
    backgroundColor: Colors.BG_COLOR,
    marginTop: 5,
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
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
  weekChev: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    marginLeft: 15,
    fontSize: 16,
  },
  heads: {
    fontSize: 15,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    marginBottom: 5,
  },
  graphTitle: {
    fontSize: 12,
    color: Colors.WHITE_COLOR,
    textAlign: "center",
    fontFamily: POP_REGULAR,
  },
  loginBtn: {
    width: 120,
    alignSelf: "center",
    backgroundColor: Colors.BG_LIGHT,
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
    height: 38,
  },
});
