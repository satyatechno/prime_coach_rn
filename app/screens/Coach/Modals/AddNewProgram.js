import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import Modall from "../../../components/Modall";
import PrimeInput from "../../../components/PrimeInput";
import Select from "../../../components/Select";
import DatePicker from "../../../components/DatePicker";
import { ROBO_BOLD } from "../../../constants/Fonts";
import { standardPostApi } from "../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
export default class AddNewProgram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      hasSetEndDate: false,
      hasSetStartDate: false,
      selectedLocation: null,
      planName: "",
      addingPlan: false,
    };
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc();
  }

  checkNonEmpty = (text) => {
    if (!text.trim().length > 0) {
      alert("Please enter a Plan Name.");
      return false;
    } else {
      return true;
    }
  };

  verifyPickers = () => {
    const { selectedLocation } = this.state;
    if (selectedLocation == null) {
      alert("Please choose a location to create a Plan.");
      return false;
    }
    return true;
  };

  toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
  };

  addNewPlan = async () => {
    const START_DATE = moment(this.toTimestamp(this.state.startDate) * 1000)
      .format("YYYY-MM-DD")
      .toString();
    const END_DATE = moment(this.toTimestamp(this.state.endDate) * 1000)
      .format("YYYY-MM-DD")
      .toString();
    if (this.checkNonEmpty(this.state.planName) && this.verifyPickers()) {
      this.setState({ addingPlan: true });
      try {
        const res = await standardPostApi(
          "add_annual_training_program",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            name: this.state.planName,
            start_date: START_DATE,
            end_date: END_DATE,
            location: this.state.selectedLocation,
          },
          true
        );
        if (res.data.code == 200) {
          this.setState({ addingPlan: false });
          this.goBack();
          console.log("New plan added ", res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  render() {
    const { navigation } = this.props;
    const pickerData = navigation.getParam("content");
    return (
      <Modall
        crossPress={() => this.goBack()}
        savePress={() => this.addNewPlan()}
        btnTxt={"Save"}
        title={"Add New Program"}
        loading={this.state.addingPlan}
        containerProps={{ style: { flex: 1 / 1.3 } }}
      >
        <Text style={styles.heads}>Name</Text>
        <PrimeInput
          inputProps={{
            onChangeText: (text) => {
              this.setState({ planName: text });
            },
            placeholder: `Program Name`,
            style: { marginBottom: 10 },
          }}
          noAnimation={true}
        />
        <Text style={styles.heads}>Start Date</Text>
        <DatePicker
          dateTimeProps={{
            onChange: async (date) => {
              await this.setState({ hasSetStartDate: true, startDate: date });
            },
          }}
          showDarkBg
          currentDate={this.state.startDate}
          minDate={new Date("2020-01-01")}
          maxDate={new Date("2050-01-01")}
        />
        <Text style={styles.heads}>End Date</Text>
        <DatePicker
          dateTimeProps={{
            onChange: async (date) => {
              await this.setState({ hasSetEndDate: true, endDate: date });
            },
          }}
          showDarkBg
          currentDate={this.state.endDate}
          minDate={new Date("2020-01-01")}
          maxDate={new Date("2050-01-01")}
        />
        <Text style={styles.heads}>Location</Text>
        <Select
          pickerProps={{
            onValueChange: async (value) => {
              await this.setState({ selectedLocation: value });
            },
          }}
          pickerItems={pickerData.pickerArray}
          pickerValue={this.state.selectedLocation}
        />
      </Modall>
    );
  }
}

const styles = StyleSheet.create({
  heads: {
    fontSize: 15,
    fontFamily: ROBO_BOLD,
    marginBottom: 5,
  },
});
