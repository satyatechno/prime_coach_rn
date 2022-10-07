import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import { Colors } from "../../../constants/Colors";
import { ROBO_BOLD, ROBO_REGULAR } from "../../../constants/Fonts";
import Modall from "../../../components/Modall";
import PrimeInput from "../../../components/PrimeInput";
import i18n from "../../../locale/i18n";
import DatePicker from "../../../components/DatePicker";
import Select from "../../../components/Select";
import { standardPostApi } from "../../../api/ApiWrapper";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import { IS_IOS } from "../../../constants/DeviceDetails";
import Container from "../../../components/Container";
import CustomInput from "../../../components/customInput/CustomInput";
import { findHeight } from "../../../utils/helper";
import CustomButton from "../../../components/customButton/CustomButton";
export default class AddPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      show: false,
      hasSetDate: false,
      emailText: "",
      password1: "",
      password2: "",
      fName: "",
      sName: "",
      selectedPosition: null,
      addingPlayer: false,
      isSecure: true,
    };
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc();
  }

  toggleEye = () => {
    return (
      <View style={styles.iconView}>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => this.setState({ isSecure: !this.state.isSecure })}
        >
          <Icon
            name={this.state.isSecure ? "eye-off" : "eye"}
            size={20}
            color={Colors.INPUT_PLACE}
          />
        </TouchableOpacity>
      </View>
    );
  };

  validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      alert("Please enter a valid email address.");
      this.setState({ email: text });
      return false;
    } else {
      this.setState({ email: text });
      return true;
    }
  };

  validateLength = (text) => {
    if (text.length == 0 || text.length < 8) {
      alert("Password should be at least 8 characters long.");
      return false;
    }
    return true;
  };

  checkPassword = (pass1, pass2) => {
    if (pass1 !== pass2) {
      alert("Passwords do not match.");
      return false;
    }
    return true;
  };

  checkNonEmpty = (text) => {
    if (!text.trim().length > 0) {
      alert("Input fields can not be empty.");
      return false;
    } else {
      return true;
    }
  };

  isValidDOB() {
    const dob = new Date(this.state.date);
    const today = new Date();
    if (!this.state.hasSetDate) {
      alert("Please select a Date of Birth.");
      return false;
    }
    if (today.getFullYear() - dob.getFullYear() < 16) {
      Alert.alert(
        "Invalid DOB",
        "You must be at least 16 year old, in order to sign up."
      );
      return false;
    }
    return true;
  }

  verifyPickers = () => {
    const { selectedPosition } = this.state;
    const { navigation } = this.props;
    const pickerData = navigation.getParam("pickerData");
    if (
      selectedPosition == null &&
      pickerData.SportPositions.pickerArray?.length > 0
    ) {
      alert("Please pick a Sport Position.");
      return false;
    }
    return true;
  };

  toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
  };

  addNewPlayerToTeam = async () => {
    const { navigation } = this.props;
    const teamData = navigation.getParam("teamData");
    this.setState({ addingPlayer: true });
    const {
      emailText,
      password1,
      password2,
      fName,
      sName,
      date,
      selectedPosition,
    } = this.state;
    const DOB = moment(this.toTimestamp(date) * 1000)
      .format("YYYY-MM-DD")
      .toString();
    if (
      this.validateEmail(emailText) &&
      this.validateLength(password1) &&
      this.validateLength(password2) &&
      this.checkPassword(password1, password2) &&
      this.checkNonEmpty(fName) &&
      this.checkNonEmpty(sName) &&
      this.isValidDOB() &&
      this.verifyPickers()
    ) {
      try {
        const res = await standardPostApi(
          "add_coach_player_in_team",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            first_name: fName,
            last_name: sName,
            email: emailText,
            password: password1,
            dob: DOB,
            sport_position: selectedPosition,
            team: teamData.id,
          },
          true
        );
        if (res.data.code == 200) {
          this.setState({ addingPlayer: false });
          console.log("res", res.data);
          this.goBack();
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ addingPlayer: false });
  };

  render() {
    const { isSecure } = this.state;
    const { navigation } = this.props;
    const pickerData = navigation.getParam("pickerData");
    console.log("picker data", JSON.stringify(pickerData, null, 2));
    return (
      <Container backFn={() => this.goBack()} title={"Add New Player"}>
        <View>
          <CustomInput
            mainContainerStyle={{ marginVertical: 10 }}
            placeholder={"Email address"}
            inputStyle={{ fontSize: 11, paddingTop: 12 }}
            onChangeText={(text) => {
              this.setState({ emailText: text });
            }}
            keyboardType="email-address"
            value={this.state.emailText}
          />
          <View>
            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              placeholder={"Password"}
              inputStyle={{ fontSize: 11, paddingTop: 12 }}
              secureTextEntry={this.state.isSecure}
              onChangeText={(text) => {
                this.setState({ password1: text });
              }}
              value={this.state.password1}
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                top: 0,
                alignSelf: "flex-end",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {this.toggleEye()}
            </View>
          </View>
          <View>
            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              placeholder={"Confirm Password"}
              inputStyle={{ fontSize: 11, paddingTop: 12 }}
              secureTextEntry={this.state.isSecure}
              onChangeText={(text) => {
                this.setState({ password2: text });
              }}
              value={this.state.password2}
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                top: 0,
                alignSelf: "flex-end",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {this.toggleEye()}
            </View>
          </View>
          <CustomInput
            mainContainerStyle={{ marginVertical: 10 }}
            placeholder={"First Name"}
            inputStyle={{ fontSize: 11, paddingTop: 12 }}
            onChangeText={(text) => {
              this.setState({ fName: text });
            }}
            value={this.state.fName}
          />
          <CustomInput
            mainContainerStyle={{ marginVertical: 10 }}
            placeholder={"Last Name"}
            inputStyle={{ fontSize: 11, paddingTop: 12 }}
            onChangeText={(text) => {
              this.setState({ sName: text });
            }}
            value={this.state.sName}
          />

          <DatePicker
            dateTimeProps={{
              onChange: async (date) => {
                await this.setState({ hasSetDate: true, date: date });
              },
            }}
            placeholder="Date Of Birth"
            showDarkBg
            currentDate={this.state.date}
            minDate={new Date("1900-01-01")}
            maxDate={new Date()}
          />

          {pickerData?.SportPositions?.pickerArray?.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Select
                pickerProps={{
                  onValueChange: async (value) => {
                    await this.setState({ selectedPosition: value });
                  },
                }}
                pickerItems={pickerData.SportPositions.pickerArray}
                pickerValue={this.state.selectedPosition}
                placeholder={
                  !pickerData?.SportPositions?.pickerArray?.length
                    ? "No sport position avalable"
                    : "Sport Position"
                }
              />
            </View>
          )}
          <CustomButton
            type={1}
            isLoading={this.state.addingPlayer}
            loaderColor={Colors.BACKGROUND}
            title={"Save"}
            onPress={() => {
              this.addNewPlayerToTeam();
            }}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR,
    justifyContent: "center",
    paddingHorizontal: "4%",
  },
  heads: {
    fontSize: 15,
    color: Colors.BLACK_COLOR,
    fontFamily: ROBO_REGULAR,
    marginBottom: 5,
  },
  iconView: {},
});
