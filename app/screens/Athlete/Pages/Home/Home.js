import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import React, { Component } from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { standardPostApi } from "../../../../api/ApiWrapper";
import BarGraph from "../../../../components/barGraph/BarGraph";
import CustomButton from "../../../../components/customButton/CustomButton";
import DatePicker from "../../../../components/DatePicker";
import HamBurger from "../../../../components/HamBurger";
import Select from "../../../../components/Select";
import Spinnner from "../../../../components/Spinnner";
import TildView from "../../../../components/tildView/TildView";
import { Toaster } from "../../../../components/Toaster";
import { Colors } from "../../../../constants/Colors";
import { DEV_WIDTH } from "../../../../constants/DeviceDetails";
import { POP_REGULAR } from "../../../../constants/Fonts";
import { findSize } from "../../../../utils/helper";

const DATA = [
  { title: "Intensity Graph", screen: "IntensityGraph" },
  { title: "Weekly Report", screen: "WeeklyReport" },
  { title: "Self Screening", screen: "SelfScreening" },
  { title: "Corrective Exercises", screen: "CorrectiveExercise" },
];
const LOCATION = [
  { label: "Home", value: 1 },
  { label: "Gym", value: 2 },
];
export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      graphEndDate: "",
      graphStartDate: "",
      selectedData: 1,
      selectedLocation: 1,
      activities: [],
      fetchingData: false,
      currentWeek: null,
      annualProgramDetails: null,
      graphData: [],
      updatingGraph: false,
      reportTypes: [],
      reportName: "",
    };
  }
  async componentDidMount() {
    const CURRENT_WEEK = JSON.parse(
      await AsyncStorage.getItem("@CURRENT_WEEK")
    );
    const CURRENT_PROGRAM = JSON.parse(
      await AsyncStorage.getItem("@CURRENT_PROGRAM")
    );

    this.setState({
      currentWeek: CURRENT_WEEK,
      annualProgramDetails: CURRENT_PROGRAM,
      graphStartDate: CURRENT_PROGRAM ? CURRENT_PROGRAM.start_date : new Date(),
      graphEndDate: CURRENT_PROGRAM ? CURRENT_PROGRAM.end_date : new Date(),
    });

    this.listActivityReport(1);
  }

  setLocationReportName = (value) => {
    const { reportTypes } = this.state;
    reportTypes.forEach(async (item) => {
      if (item.value === value) {
        this.setState({ reportName: item.label });
      }
    });
  };

  listActivityReport = async (report_id) => {
    const { graphEndDate, graphStartDate } = this.state;
    const start_date = moment(graphStartDate).format("YYYY-MM-DD").toString();
    const end_date = moment(graphEndDate).format("YYYY-MM-DD").toString();
    this.setState({ updatingGraph: true });
    try {
      const res = await standardPostApi(
        "athlete_workout_activity_reports",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          report_type_id: report_id,
          week_start_date: start_date ?? moment().format("YYYY-MM-DD"),
          week_end_date: end_date ?? moment().format("YYYY-MM-DD"),
        },
        true,
        false
      );
      if (res.data.code == 301) {
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        console.log("first---------", res.data.data.WeekDetails);
        await this.setState({
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
        // console.log(
        //   "listActivityReport ",
        //   JSON.stringify(res.data.data, null, 2)
        // );
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ updatingGraph: false });
  };

  render() {
    const {
      graphEndDate,
      graphStartDate,
      selectedData,
      selectedLocation,
      updatingGraph,
      isLoading,
      reportTypes,
      graphData,
      reportName,
    } = this.state;
    console.log(reportTypes);
    return (
      <>
        <HamBurger onMenuPress={() => this.props.navigation.openDrawer()}>
          <Spinnner visible={updatingGraph} />
          <TildView>
            <View style={{ padding: 15 }}>
              {DATA.map((item, index) => (
                <View key={index?.toString()}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate(item.screen);
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.WHITE_COLOR,
                          fontFamily: POP_REGULAR,
                          fontSize: findSize(18),
                        }}
                      >
                        {item.title}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={21}
                        color={Colors.WHITE_COLOR}
                      />
                    </View>
                  </TouchableOpacity>
                  {DATA.length - 1 > index && (
                    <View
                      style={{
                        height: 1,
                        width: "100%",
                        backgroundColor: Colors.INPUT_PLACE,
                      }}
                    />
                  )}
                </View>
              ))}
            </View>
          </TildView>
          <View style={{ marginTop: 30 }}>
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
                    this.listActivityReport(value);
                  },
                }}
                pickerItems={reportTypes}
                pickerValue={selectedData}
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
                  onValueChange: (value) => {
                    this.setState({ selectedLocation: value });
                  },
                }}
                pickerItems={LOCATION}
                pickerValue={selectedLocation}
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
                currentDate={graphStartDate}
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
                currentDate={graphEndDate}
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
                  this.listActivityReport(selectedData);
                }}
              >
                <AntDesign name="check" size={22} color={Colors.WHITE_COLOR} />
              </TouchableOpacity>
            </View>

            {graphData?.length ? (
              <>
                <BarGraph
                  graphData={this.state.graphData}
                  x={"week_number"}
                  y={"final_result"}
                  angle={0}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: Colors.WHITE_COLOR,
                    textAlign: "center",
                    fontFamily: POP_REGULAR,
                  }}
                >
                  {`Weekly ${reportName} - ${
                    selectedLocation == 1 ? "Home" : "Gym"
                  }`}
                </Text>
              </>
            ) : null}

            <CustomButton
              title={"Analyse Workout"}
              onPress={() => {
                this.props.navigation.navigate("DayWiseReport");
              }}
              type={1}
              style={{
                marginVertical: 15,
              }}
            />
          </View>
        </HamBurger>
      </>
    );
  }
}

export default Home;
