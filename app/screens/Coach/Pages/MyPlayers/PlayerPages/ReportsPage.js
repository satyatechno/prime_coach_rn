import React, { Component, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Container from "../../../../../components/Container";
import Loader from "../../../../../components/Loader";
import Select from "../../../../../components/Select";
import Spinnner from "../../../../../components/Spinnner";
import DatePicker from "../../../../../components/DatePicker";
import PrimeButton from "../../../../../components/PrimeButton";
import {
  ROBO_REGULAR,
  ROBO_BOLD,
  POP_REGULAR,
} from "../../../../../constants/Fonts";
import { Colors } from "../../../../../constants/Colors";
import { standardPostApi } from "../../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryScatter,
} from "victory-native";
import { DEV_WIDTH } from "../../../../../constants/DeviceDetails";
import moment from "moment";
import IconChev from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import Svg from "react-native-svg";
import BarGraph from "../../../../../components/barGraph/BarGraph";
import CustomButton from "../../../../../components/customButton/CustomButton";
import { findSize } from "../../../../../utils/helper";

const LOCATION = [
  { label: "Home", value: 1 },
  { label: "Gym", value: 2 },
];

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
              y="final_result"
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
            y="final_result"
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
export default class ReportsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoading: true,
      selectedReportType: 1,
      reportTypes: [],
      graphStartDate: new Date(),
      graphEndDate: new Date(),
      selectedLocation: 1,
      updatingGraph: false,
      locationName: "Home",
      reportName: "",
      graphData: [],
      hasSetStartDate: false,
      hasSetEndDate: false,
    };
    this.listActivityReport(1);
  }

  toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
  };

  listActivityReport = async (report_id) => {
    const { navigation } = this.props;
    const { graphStartDate, graphEndDate, hasSetStartDate, hasSetEndDate } =
      this.state;
    const start_date = moment(this.toTimestamp(graphStartDate) * 1000)
      .format("YYYY-MM-DD")
      .toString();
    const end_date = moment(this.toTimestamp(graphEndDate) * 1000)
      .format("YYYY-MM-DD")
      .toString();
    const PlayerData = navigation.getParam("content").playerDetails.player;
    this.setState({ updatingGraph: true });
    try {
      const res = await standardPostApi(
        "athlete_workout_activity_reports",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          access_user_id: PlayerData.id,
          report_type_id: report_id,
          week_start_date: hasSetStartDate
            ? start_date
            : moment().format("YYYY-MM-DD"),
          week_enddate: hasSetEndDate
            ? end_date
            : moment().format("YYYY-MM-DD"),
        },
        true
      );

      if (res.data.code == 200) {
        await this.setState({
          dataLoading: false,
          reportTypes: res.data.data.ReportTypeSelect.pickerArray,
          updatingGraph: false,
          graphData: res.data.data.WeekDetails?.map((item) => {
            let temp = item.week_number?.split(" - ");
            let newDate = `${moment(temp[0], "YYYY-MM-DD").format(
              "Do MMM"
            )} - ${moment(temp[1], "YYYY-MM-DD").format("Do MMM")}`;
            return {
              ...item,
              week_number: newDate,
            };
          }),
        });
        this.setLocationReportName(report_id);
        console.log("listActivityReport ", res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ dataLoading: false, updatingGraph: false });
  };

  setLocationReportName = (value) => {
    const { reportTypes } = this.state;
    reportTypes.forEach(async (item) => {
      if (item.value === value) {
        await this.setState({ reportName: item.label });
      }
    });
  };

  render() {
    const { navigation } = this.props;
    const { dataLoading, reportName, locationName, selectedReportType } =
      this.state;
    const PlayerData = navigation.getParam("content").playerDetails.player;
    const TeamData = navigation.getParam("content").playerDetails.teamData;
    const PageDetails = navigation.getParam("content").pageDetails;
    return (
      <Container
        backFn={() => this.props.navigation.goBack()}
        title={"Reports"}
      >
        <Spinnner visible={this.state.updatingGraph} />

        {dataLoading ? (
          <Loader />
        ) : (
          <View>
            <View style={{ marginTop: 15 }}>
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
                      await this.setState({ selectedReportType: value });
                      this.listActivityReport(value);
                    },
                  }}
                  pickerItems={this.state.reportTypes}
                  pickerValue={this.state.selectedReportType}
                  placeholder={"Report Type Select"}
                />
                <Select
                  containerStyle={{
                    borderColor: Colors.WHITE_COLOR,
                    borderWidth: 1,
                    backgroundColor: Colors.BACKGROUND,
                    width: DEV_WIDTH * 0.44,
                  }}
                  pickerProps={{
                    onValueChange: async (value) => {
                      await this.setState({ selectedLocation: value });
                      if (value == 1) {
                        this.setState({ locationName: "Home" });
                      } else {
                        this.setState({ locationName: "Gym" });
                      }
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
                      await this.setState({
                        hasSetStartDate: true,
                        graphStartDate: date,
                      });
                    },
                  }}
                  showDarkBg
                  currentDate={this.state.graphStartDate}
                  minDate={new Date("2000-01-01")}
                  maxDate={new Date("2050-01-01")}
                  placeholder={"Graph range start date"}
                />

                <DatePicker
                  placeholder={"Graph range end date"}
                  mainContainerStyle={{ width: DEV_WIDTH * 0.38 }}
                  containerStyle={{
                    borderColor: Colors.WHITE_COLOR,
                    borderWidth: 1,
                    backgroundColor: Colors.BACKGROUND,
                    width: DEV_WIDTH * 0.38,
                  }}
                  dateTimeProps={{
                    onChange: async (date) => {
                      await this.setState({
                        hasSetEndDate: true,
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
                    this.listActivityReport(selectedReportType);
                  }}
                >
                  <AntDesign
                    name="check"
                    size={22}
                    color={Colors.WHITE_COLOR}
                  />
                </TouchableOpacity>
              </View>
              {/* <PrimeButton
                buttonProps={{
                  style: styles.submitBtn,
                  onPress: () => this.listActivityReport(selectedReportType),
                }}
                buttonText={"Submit Dates"}
                indiColor={Colors.WHITE_COLOR}
              /> */}
            </View>

            <BarGraph
              graphData={this.state.graphData}
              x="week_number"
              y="final_result"
              angle={0}
            />
            <Text style={styles.graphTitle}>
              {`Weekly ${reportName} - ${locationName}`}
            </Text>
            {/* <Chart
              onDotPress={(evt, clickedProps) => {}}
              graphData={this.state.graphData}
            /> */}
            {/* <PrimeButton
              buttonProps={{
                style: styles.submitBtn,
                onPress: () => {
                  this.props.navigation.navigate("AnalyseDayWorkout", {
                    player: PlayerData,
                  });
                },
              }}
              buttonText={"Analyse Workout"}
              indiColor={Colors.WHITE_COLOR}
            /> */}
            <CustomButton
              type={1}
              isLoading={this.state.loading}
              loaderColor={Colors.BACKGROUND}
              title={"Analysis Workout "}
              onPress={() => {
                this.props.navigation.navigate("AnalyseDayWorkout", {
                  player: PlayerData,
                });
              }}
            />
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
  submitBtn: {
    width: 130,
    alignSelf: "center",
    marginVertical: 0,
    height: 38,
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
    backgroundColor: Colors.BG_LIGHT,
  },
  graphTitle: {
    fontSize: 12,
    color: Colors.WHITE_COLOR,
    textAlign: "center",
    fontFamily: POP_REGULAR,
  },
  heads: {
    fontSize: 15,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    marginBottom: 5,
  },
});
