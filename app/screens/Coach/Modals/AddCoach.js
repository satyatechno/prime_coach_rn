import React, { Component } from "react";
import { StyleSheet, Text, Alert, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../constants/Colors";
import { ROBO_BOLD } from "../../../constants/Fonts";
import Modall from "../../../components/Modall";
import PrimeInput from "../../../components/PrimeInput";
import i18n from "../../../locale/i18n";
import DatePicker from "../../../components/DatePicker";
import Select from "../../../components/Select";
import { standardPostApi } from "../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import Icon from "react-native-vector-icons/Feather";
import { IS_IOS } from "../../../constants/DeviceDetails";
import Container from "../../../components/Container";
import CustomButton from "../../../components/customButton/CustomButton";
import CustomInput from "../../../components/customInput/CustomInput";
import { findHeight } from "../../../utils/helper";

export default class AddCoach extends Component {
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
      selectedSpec: null,
      selectedRole: null,
      addingCoach: false,
      isSecure: true,
    };
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
  }

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
    const { selectedRole, selectedSpec } = this.state;
    if (selectedSpec == null || selectedRole === null) {
      alert("Please pick a value for both pickers.");
      return false;
    }
    return true;
  };

  toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
  };

  addNewCoachToTeam = async () => {
    const { navigation } = this.props;
    const teamData = navigation.getParam("teamData");
    this.setState({ addingCoach: true });
    const { emailText, password1, password2, fName, sName, date } = this.state;
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
            first_name: this.state.fName,
            last_name: this.state.sName,
            email: this.state.emailText,
            password: this.state.password1,
            dob: DOB,
            specialization: this.state.selectedSpec,
            role: this.state.selectedRole,
            team: teamData.id,
          },
          true
        );
        if (res.data.code == 200) {
          this.setState({ addingCoach: false });
          this.goBack();
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ addingCoach: false });
  };

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
  render() {
    const { navigation } = this.props;
    const { isSecure } = this.state;
    const coachData = navigation.getParam("coachData");
    const pickerData = navigation.getParam("pickerData");
    return (
      // <Modall
      //   crossPress={() => this.goBack()}
      //   savePress={() => this.addNewCoachToTeam()}
      //   btnTxt={'Save'}
      //   title={'Add New Coach'}
      //   loading={this.state.addingCoach}
      // >
      //   <Text style={styles.heads}>{i18n.t('addNewPC.email')}</Text>
      //   <PrimeInput
      //     inputProps={{
      //       onChangeText: (text) => {
      //         this.setState({ emailText: text });
      //       },
      //       keyboardType: 'email-address',
      //       placeholder: `${i18n.t('addNewPC.email')}`,
      //     }}
      //     noAnimation={true}
      //   />
      //   <Text style={styles.heads}>{i18n.t('addNewPC.password')}</Text>
      //   <PrimeInput
      //     inputProps={{
      //       onChangeText: (text) => {
      //         this.setState({ password1: text });
      //       },
      //       placeholder: `${i18n.t('addNewPC.password')}`,
      //       secureTextEntry: isSecure,
      //     }}
      //     noAnimation={true}
      //   />
      //   <Text style={styles.heads}>{i18n.t('addNewPC.confirmPass')}</Text>
      //   <PrimeInput
      //     inputProps={{
      //       onChangeText: (text) => {
      //         this.setState({ password2: text });
      //       },
      //       placeholder: `${i18n.t('addNewPC.confirmPass')}`,
      //       secureTextEntry: isSecure,
      //     }}
      //     noAnimation={true}
      //   />
      //   {this.toggleEye()}
      //   <Text style={styles.heads}>{i18n.t('addNewPC.fName')}</Text>
      //   <PrimeInput
      //     inputProps={{
      //       onChangeText: (text) => {
      //         this.setState({ fName: text });
      //       },
      //       placeholder: `${i18n.t('addNewPC.fName')}`,
      //     }}
      //     noAnimation={true}
      //   />
      //   <Text style={styles.heads}>{i18n.t('addNewPC.sName')}</Text>
      //   <PrimeInput
      //     inputProps={{
      //       onChangeText: (text) => {
      //         this.setState({ sName: text });
      //       },
      //       placeholder: `${i18n.t('addNewPC.sName')}`,
      //     }}
      //     noAnimation={true}
      //   />
      //   <Text style={styles.heads}>{i18n.t('addNewPC.dob')}</Text>
      //   <DatePicker
      //     dateTimeProps={{
      //       onChange: async (date) => {
      //         await this.setState({ hasSetDate: true, date: date });
      //       },
      //     }}
      //     showDarkBg
      //     currentDate={this.state.date}
      //     minDate={new Date('1900-01-01')}
      //     maxDate={new Date()}
      //   />
      //   <Text style={styles.heads}>Coach Specialisation</Text>
      //   <Select
      //     pickerProps={{
      //       onValueChange: async (value) => {
      //         await this.setState({ selectedSpec: value });
      //       },
      //     }}
      //     pickerItems={pickerData.CoachSpecialization.pickerArray}
      //     pickerValue={this.state.selectedSpec}
      //   />
      //   <Text style={styles.heads}>Role</Text>
      //   <Select
      //     pickerProps={{
      //       onValueChange: async (value) => {
      //         await this.setState({ selectedRole: value });
      //       },
      //     }}
      //     pickerItems={coachData.Roles.pickerArray?.filter(
      //       (role) => role?.id !== 1
      //     )}
      //     pickerValue={this.state.selectedRole}
      //   />
      // </Modall>
      <Container backFn={() => this.goBack()} title={"Add New Coach"}>
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
            showDarkBg
            placeholder="Date Of Birth"
            currentDate={this.state.date}
            minDate={new Date("1900-01-01")}
            maxDate={new Date()}
          />

          <Select
            pickerProps={{
              onValueChange: async (value) => {
                await this.setState({ selectedSpec: value });
              },
            }}
            placeholder="Coach Specialisation"
            pickerItems={pickerData.CoachSpecialization.pickerArray}
            pickerValue={this.state.selectedSpec}
          />
          <Select
            pickerProps={{
              onValueChange: async (value) => {
                await this.setState({ selectedRole: value });
              },
            }}
            placeholder="Role"
            pickerItems={coachData.Roles.pickerArray?.filter(
              (role) => role?.id !== 1
            )}
            pickerValue={this.state.selectedRole}
          />
          <CustomButton
            type={1}
            isLoading={this.state.addingCoach}
            loaderColor={Colors.BACKGROUND}
            title={"Save"}
            onPress={() => {
              this.addNewCoachToTeam();
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
    fontFamily: ROBO_BOLD,
    color: Colors.BLACK_COLOR,
    marginBottom: 5,
  },
  iconView: {},
  calBg: {
    backgroundColor: Colors.BG_COLOR,
    borderRadius: 5,
    marginBottom: 15,
  },
});
