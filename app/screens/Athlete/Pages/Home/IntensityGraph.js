import { Text, TouchableOpacity, View } from "react-native";
import React, { Component } from "react";
import Container from "../../../../components/Container";
import Select from "../../../../components/Select";
import DatePicker from "../../../../components/DatePicker";
import { DEV_WIDTH } from "../../../../constants/DeviceDetails";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Colors } from "../../../../constants/Colors";
import { findSize } from "../../../../utils/helper";
import AsyncStorage from "@react-native-community/async-storage";
import Spinnner from "../../../../components/Spinnner";
import { standardPostApi } from "../../../../api/ApiWrapper";
import moment from "moment";
import BarGraph from "../../../../components/barGraph/BarGraph";
import { POP_REGULAR } from "../../../../constants/Fonts";

const LOCATION = [
  { label: "Home", value: 1 },
  { label: "Gym", value: 2 },
];
export default class IntensityGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphEndDate: "",
      graphStartDate: "",
      selectedData: 1,
      selectedLocation: 1,

      currentWeek: null,
      annualProgramDetails: null,
      graphData: [],
      updatingGraph: false,
      reportTypes: [],
    };
  }

  async componentDidMount() {
    const CURRENT_WEEK = JSON.parse(
      await AsyncStorage.getItem("@CURRENT_WEEK")
    );
    const CURRENT_PROGRAM = JSON.parse(
      await AsyncStorage.getItem("@CURRENT_PROGRAM")
    );

    await this.setState({
      currentWeek: CURRENT_WEEK,
      annualProgramDetails: CURRENT_PROGRAM,
      graphStartDate: CURRENT_PROGRAM ? CURRENT_PROGRAM.start_date : new Date(),
      graphEndDate: CURRENT_PROGRAM ? CURRENT_PROGRAM.end_date : new Date(),
    });

    this.loadChartData();
  }

  toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
  };

  loadChartData = async () => {
    const { graphStartDate, graphEndDate } = this.state;
    const start_date = moment(this.toTimestamp(graphStartDate) * 1000)
      .format("YYYY-MM-DD")
      .toString();
    const end_date = moment(this.toTimestamp(graphEndDate) * 1000)
      .format("YYYY-MM-DD")
      .toString();
    this.setState({ updatingGraph: true });
    try {
      const res = await standardPostApi(
        "weekly_assigned_intensity",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          week_start_date: start_date,
          week_end_date: end_date,
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({ graphData: res.data.data, updatingGraph: false });
        console.log("graph data ", this.state.graphData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {
      selectedData,
      selectedLocation,
      graphEndDate,
      graphStartDate,
      graphData,
      updatingGraph,
    } = this.state;
    return (
      <Container
        backFn={() => this.props.navigation.goBack()}
        title="Intensity Graph"
      >
        <Spinnner visible={updatingGraph} />
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
                },
              }}
              pickerItems={[{ label: "Assigned Intensity Average", value: 1 }]}
              pickerValue={selectedData}
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
                this.loadChartData();
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
                y={"average_intensity"}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.WHITE_COLOR,
                  textAlign: "center",
                  fontFamily: POP_REGULAR,
                }}
              >
                Weekly Assigned Average Intensity - Period -{" "}
                {this.state.selectedLocation == 1 ? "Home" : "Gym"}
              </Text>
            </>
          ) : null}
        </View>
      </Container>
    );
  }
}
