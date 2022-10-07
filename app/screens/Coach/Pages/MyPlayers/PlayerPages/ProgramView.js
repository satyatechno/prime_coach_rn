import React, { Component, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Container from "../../../../../components/Container";
import Loader from "../../../../../components/Loader";
import {
  ROBO_REGULAR,
  ROBO_BOLD,
  POP_MEDIUM,
} from "../../../../../constants/Fonts";
import { Colors } from "../../../../../constants/Colors";
import { standardPostApi } from "../../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import { Day } from "../../../../Athlete/Pages/Workouts/AssignedWorkouts";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
} from "victory-native";
import { DEV_WIDTH } from "../../../../../constants/DeviceDetails";
import Svg from "react-native-svg";
import IconChev from "react-native-vector-icons/FontAwesome5";
import BarGraph from "../../../../../components/barGraph/BarGraph";
import TildView from "../../../../../components/tildView/TildView";
import { findSize } from "../../../../../utils/helper";
import CustomButton from "../../../../../components/customButton/CustomButton";
import Select from "../../../../../components/Select";

// function Chart(props) {
//   const fill = '#2F4857';
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
//   return (
//     <View style={{ flex: 1 }}>
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
//           label={props.yAxisLabel}
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
//               fontFamily: ROBO_REGULAR,
//             },
//           }}
//         />
//         <VictoryBar
//           style={{ data: { fill: fill, stroke: '#D82110' } }}
//           alignment="middle"
//           data={props.graphData ? props.graphData : []}
//           x="week_number"
//           y="week_total_volume"
//           events={[
//             {
//               target: 'data',
//               eventHandlers: {
//                 onPress: (evt, clickedProps) => {
//                   props.onBarPress(evt, clickedProps);
//                 },
//               },
//             },
//           ]}
//         />
//       </VictoryChart>
//     </View>
//   );
// }

function Chart(props) {
  // console.log('dataaaaGrafff', props?.graphData);
  let DATA = [...props?.graphData];
  DATA.map((x) => {
    if (x?.name?.length > 10) x.name = x.name.slice(0, 10) + "...";
  });
  const [index, setIndex] = useState(0);
  let GraphData = DATA.slice(index, index + 8);
  const changeData = (type) => {
    if (type === "next") {
      setIndex(index + 8);
    } else {
      setIndex(index - 8);
    }
  };
  const fill = "#2F4857";
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
      <Svg>
        <VictoryChart
          style={{
            parent: {
              marginTop: -30,
              // marginRight: 10,
              // marginLeft: 20,
              marginBottom: 30,
            },
          }}
          domainPadding={20}
          width={DEV_WIDTH}
          theme={chartTheme}
        >
          <VictoryAxis
            tickFormat={(t) => t}
            style={{
              grid: {
                stroke: "none",
              },
              tickLabels: { fontSize: 10 },
            }}
            tickLabelComponent={
              <VictoryLabel
                angle={GraphData.length > 5 ? 45 : 0}
                textAnchor={GraphData.length > 5 ? "start" : "middle"}
                verticalAnchor={GraphData.length > 5 ? "middle" : "start"}
                style={{ fontSize: 10, fill: "#807d77" }}
                backgroundPadding={{ top: 5 }}
              />
            }
          />
          <VictoryAxis
            domain={[0, 10]}
            label={props.yAxisLabel}
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
                fontFamily: ROBO_REGULAR,
              },
            }}
          />
          <VictoryBar
            style={{
              data: {
                stroke: ({ datum }) => "#D82110",
                fill: ({ datum }) => fill,
                fillOpacity: 1,
                strokeWidth: 1,
              },
            }}
            data={GraphData}
            x="week_number"
            y="week_total_volume"
            animate={true}
            barWidth={25}
            events={[
              {
                target: "data",
                eventHandlers: {
                  onPress: (evt, clickedProps) => {
                    props.onBarPress(evt, clickedProps);
                  },
                },
              },
            ]}
          />
        </VictoryChart>
      </Svg>
      {index !== 0 && (
        <View
          style={{
            position: "absolute",
            alignSelf: "flex-start",
            top: "50%",
            start: -15,
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
            top: "50%",
            end: -15,
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
export default class ProgramView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoading: true,
      weeks: [],
      currentWeek: null,
      pickerData: [],
      selectedWeek: null,
      modalVisible: false,
    };
    this.listProgramData();
  }

  listProgramData = async () => {
    const { navigation } = this.props;
    const PlayerData = navigation.getParam("content").playerDetails.player;
    this.setState({ dataLoading: true });
    try {
      const res = await standardPostApi(
        "athlete_program_view",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          access_user_id: PlayerData.id,
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({
          dataLoading: false,
          weeks: res.data.data,
          currentWeek: res.data.data[0],
        });
        console.log("listProgramData ", res.data.data);
        let temp = [];
        res.data.data?.map((x) => {
          temp?.push({
            id: x?.id,
            label: x?.week_number,
            value: x?.id,
          });
        });
        this.setState({
          pickerData: temp,
          selectedWeek: res.data.data[0]?.id,
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ dataLoading: false });
  };

  render() {
    const { navigation } = this.props;
    const { dataLoading, weeks, currentWeek } = this.state;
    const PlayerData = navigation.getParam("content").playerDetails.player;
    const TeamData = navigation.getParam("content").playerDetails.teamData;
    const PageDetails = navigation.getParam("content").pageDetails;
    return (
      <Container
        backFn={() => this.props.navigation.goBack()}
        title={"Program View"}
      >
        {dataLoading ? (
          <Loader />
        ) : (
          <View>
            {weeks.length > 0 && (
              <View>
                <BarGraph
                  graphData={this.state.weeks}
                  x="week_number"
                  y="week_total_volume"
                />

                <Select
                  containerStyle={{
                    borderColor: Colors.WHITE_COLOR,
                    borderWidth: 1,
                    backgroundColor: Colors.BACKGROUND,
                  }}
                  pickerProps={{
                    onValueChange: async (value) => {
                      this.setState({
                        selectedWeek: value,
                        currentWeek: this.state.weeks?.find(
                          (x) => x.id === value
                        ),
                      });
                    },
                  }}
                  pickerItems={this.state.pickerData}
                  pickerValue={this.state.selectedWeek}
                  placeholder={"Select Week"}
                />

                {currentWeek &&
                  currentWeek.days &&
                  currentWeek.days.map((day) => {
                    return (
                      <View>
                        <TildView
                          degree="4deg"
                          containerStyle={{ marginVertical: 1 }}
                          mainViewStyle={{
                            borderRadius: 10,
                          }}
                          tildViewStyle={{
                            borderRadius: 10,
                          }}
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
                              {day.day_number}
                            </Text>

                            <CustomButton
                              style={{ padding: 10 }}
                              onPress={() => {
                                this.props.navigation.navigate("ViewWorkout", {
                                  content: {
                                    dayDetails: day,
                                    weekDetails: currentWeek,
                                    programDetails: {
                                      id: currentWeek?.annual_training_program_id,
                                    },
                                  },
                                });
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: findSize(15),
                                  fontFamily: POP_MEDIUM,
                                  color: Colors.ORANGE,
                                }}
                              >
                                View Workout
                              </Text>
                            </CustomButton>
                          </View>
                        </TildView>
                      </View>
                    );
                  })}
              </View>
            )}
          </View>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
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
  weekTxt: {
    fontSize: 30,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_BOLD,
    textAlign: "center",
  },
});
