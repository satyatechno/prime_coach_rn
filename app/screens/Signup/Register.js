import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/Colors";
import i18n from "../../locale/i18n";
import PrimeInput from "../../components/PrimeInput";
import { IS_IOS } from "../../constants/DeviceDetails";
import PrimeButton from "../../components/PrimeButton";
import moment from "moment";
import { StackActions, NavigationActions } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import { styles } from "./Register.styles";
import { standardPostApi } from "../../api/ApiWrapper";
import Picker from "../../components/Picker";
import Icon from "react-native-vector-icons/Feather";
import DatePicker from "../../components/DatePicker";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSecure: true,
      date: new Date(),
      show: false,
      hasSetDate: false,
      selectedLocation: null,
      selectedFrequency: null,
      selectedPeriod: null,
      selectedGender: null,
      selectedDiff: null,
      woLocation: [],
      locationPicker: null,
      locationPlaceholder: null,
      woFreq: [],
      freqPicker: null,
      freqPlaceholder: null,
      woPeriod: [],
      periodPicker: null,
      periodPlaceholder: null,
      woDiff: [],
      diffPicker: null,
      diffPlaceholder: null,
      roles: [],
      loading: false,
      pickerDataLoading: true,
      emailText: "",
      pass1: "",
      pass2: "",
      firstName: "",
      surName: "",
      phoneNumber: "",
      address: "",
      bodyWeight: "",
      height: "",
    };
    this.fetchPickerData();
  }

  fetchPickerData = async () => {
    try {
      const res = await standardPostApi("pre_register", undefined, {}, true);
      if (res.data.code == 200) {
        this.setState({
          pickerDataLoading: false,
          woLocation: res.data.data.WorkoutLocation.pickerArray,
          locationPicker: res.data.data.WorkoutLocation.pickerObject,
          locationPlaceholder: res.data.data.WorkoutLocation.pickerPlaceholder,
          woFreq: res.data.data.WorkoutFrequency.pickerArray,
          freqPicker: res.data.data.WorkoutFrequency.pickerObject,
          freqPlaceholder: res.data.data.WorkoutFrequency.pickerPlaceholder,
          woPeriod: res.data.data.WorkoutPeriod.pickerArray,
          periodPicker: res.data.data.WorkoutPeriod.pickerObject,
          periodPlaceholder: res.data.data.WorkoutPeriod.pickerPlaceholder,
          woDiff: res.data.data.WorkoutDifficulty.pickerArray,
          diffPicker: res.data.data.WorkoutDifficulty.pickerObject,
          diffPlaceholder: res.data.data.WorkoutDifficulty.pickerPlaceholder,
        });
      }
    } catch (error) {
      console.log(error);
    }
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

  phoneNumberVerify = (text) => {
    var regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    var isValid = regex.test(text);
    if (!isValid) {
      alert("Please enter a valid Phone number.");
      return false;
    }
    return isValid;
  };

  checkIfEmailAvailable = async () => {
    this.setState({ loading: true });
    if (this.validateEmail(this.state.emailText)) {
      try {
        const res = await standardPostApi(
          "check_email",
          undefined,
          { email: this.state.emailText },
          true
        );
        if (res.data.code == 200) {
          await this.registerUser();
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ loading: false });
  };

  toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
  };

  verifyPickers = () => {
    const {
      selectedLocation,
      selectedDiff,
      selectedFrequency,
      selectedPeriod,
      selectedGender,
    } = this.state;
    if (
      selectedLocation == null ||
      selectedFrequency == null ||
      selectedPeriod == null ||
      selectedDiff == null ||
      selectedGender == null
    ) {
      alert("Please pick a value for all pickers.");
      return false;
    }
    return true;
  };

  verifyHeightWeight = (weight, height) => {
    if (!weight.trim().length > 0 || !height.trim().length > 0) {
      alert("Please enter both your body weight and height.");
      return false;
    }
    if (Number(weight) < 1 || Number(height) < 1) {
      alert("Height or Weight can not be zero.");
      return false;
    }
    return true;
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

  registerUser = async () => {
    this.setState({ loading: true });
    const {
      pass1,
      pass2,
      firstName,
      surName,
      phoneNumber,
      address,
      selectedLocation,
      selectedDiff,
      selectedFrequency,
      selectedPeriod,
      emailText,
      date,
      selectedGender,
      bodyWeight,
      height,
    } = this.state;
    const { navigation } = this.props;
    const ids = navigation.getParam("ids");
    const DOB = moment(this.toTimestamp(date) * 1000)
      .format("YYYY-MM-DD")
      .toString();
    if (
      this.validateLength(pass1) &&
      this.validateLength(pass2) &&
      this.checkPassword(pass1, pass2) &&
      this.checkNonEmpty(firstName) &&
      this.checkNonEmpty(surName) &&
      this.isValidDOB() &&
      this.phoneNumberVerify(phoneNumber) &&
      this.checkNonEmpty(address) &&
      this.verifyHeightWeight(bodyWeight, height) &&
      this.verifyPickers()
    ) {
      try {
        const res = await standardPostApi(
          "register_final",
          undefined,
          {
            first_name: firstName,
            last_name: surName,
            email: emailText,
            password: pass1,
            role: 2, // 1 - Admin, 2 - Athlete, 3 - Coach
            sport: ids.sports_id,
            plan: ids.plan_id,
            dob: DOB,
            phone: phoneNumber,
            address: address,
            workout_location: selectedLocation,
            workout_frequency: selectedFrequency,
            workout_period: selectedPeriod,
            workout_difficulty: selectedDiff,
            device_token: "874874874874",
            device_type: IS_IOS ? "ios" : "android",
            login_type: "api",
            body_weight: bodyWeight,
            height: height,
            gender: selectedGender,
          },
          true
        );
        if (res.data.code == 200) {
          await AsyncStorage.setItem(
            "@USER_ACCESS_TOKEN",
            res.data.data.access_token
          );
          await AsyncStorage.setItem("@USER_ROLE", res.data.data.role);
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: "DrawerAthNav",
                  params: {},
                }),
              ],
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ loading: false });
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
            color={Colors.BLACK_COLOR}
          />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { isSecure, loading, pickerDataLoading } = this.state;
    return (
      <Container backFn={() => this.props.navigation.goBack()}>
        <Text style={styles.regTxt}>{i18n.t("signup.register")}</Text>
        <Text style={styles.createNew}>{i18n.t("signup.createNew")}</Text>
        <View>
          {pickerDataLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.SKY_COLOR}
              style={{ marginTop: 150 }}
            />
          ) : (
            <View>
              <Text style={styles.heads}>{i18n.t("signup.email")}</Text>
              <PrimeInput
                inputProps={{
                  style: {
                    marginBottom: 15,
                  },
                  onChangeText: (text) => {
                    this.setState({ emailText: text });
                  },
                  placeholder: `${i18n.t("signup.email")}`,
                  keyboardType: "email-address",
                }}
                noAnimation={true}
              />
              <Text style={styles.heads}>{i18n.t("signup.password")}</Text>
              <PrimeInput
                inputProps={{
                  style: {
                    marginBottom: 15,
                  },
                  onChangeText: (text) => {
                    this.setState({ pass1: text });
                  },
                  placeholder: `${i18n.t("signup.password")}`,
                  secureTextEntry: isSecure,
                }}
                noAnimation={true}
              />
              <Text style={styles.heads}>{i18n.t("signup.confirmPass")}</Text>
              <PrimeInput
                inputProps={{
                  style: {
                    marginBottom: 15,
                  },
                  onChangeText: (text) => {
                    this.setState({ pass2: text });
                  },
                  placeholder: `${i18n.t("signup.reenter")}`,
                  secureTextEntry: isSecure,
                }}
                noAnimation={true}
              />
              {this.toggleEye()}
              <Text style={styles.heads}>{i18n.t("signup.fName")}</Text>
              <PrimeInput
                inputProps={{
                  style: {
                    marginBottom: 15,
                  },
                  onChangeText: (text) => {
                    this.setState({ firstName: text });
                  },
                  placeholder: `${i18n.t("signup.fName")}`,
                  autoCapitalize: "words",
                }}
                noAnimation={true}
              />
              <Text style={styles.heads}>{i18n.t("signup.sName")}</Text>
              <PrimeInput
                inputProps={{
                  style: {
                    marginBottom: 15,
                  },
                  onChangeText: (text) => {
                    this.setState({ surName: text });
                  },
                  placeholder: `${i18n.t("signup.sName")}`,
                  autoCapitalize: "words",
                }}
                noAnimation={true}
              />
              <Text style={styles.heads}>{i18n.t("signup.dob")}</Text>
              <DatePicker
                dateTimeProps={{
                  onChange: async (date) => {
                    await this.setState({ hasSetDate: true, date: date });
                  },
                }}
                currentDate={this.state.date}
                minDate={new Date("1900-01-01")}
                maxDate={new Date()}
              />
              <Text style={styles.heads}>{i18n.t("signup.phone")}</Text>
              <PrimeInput
                inputProps={{
                  keyboardType: "number-pad",
                  style: {
                    marginBottom: 15,
                  },
                  onChangeText: (text) => {
                    this.setState({ phoneNumber: text });
                  },
                  placeholder: `${i18n.t("signup.xxx")}`,
                  maxLength: 10,
                }}
                noAnimation={true}
              />
              <Text style={styles.heads}>{i18n.t("signup.address")}</Text>
              <PrimeInput
                inputProps={{
                  style: {
                    marginBottom: 15,
                  },
                  onChangeText: (text) => {
                    this.setState({ address: text });
                  },
                  placeholder: `${i18n.t("signup.address")}`,
                  autoCapitalize: "words",
                }}
                noAnimation={true}
              />
              <Text style={styles.heads}>
                Body Weight
                <Text
                  style={[styles.heads, { fontSize: 10, fontWeight: "normal" }]}
                >
                  {" "}
                  (in lbs)
                </Text>
              </Text>
              <PrimeInput
                inputProps={{
                  style: {
                    marginBottom: 15,
                  },
                  onChangeText: (text) => {
                    this.setState({ bodyWeight: text });
                  },
                  placeholder: "Weight",
                  keyboardType: "number-pad",
                }}
                noAnimation={true}
              />
              <Text style={styles.heads}>
                Height
                <Text
                  style={[styles.heads, { fontSize: 10, fontWeight: "normal" }]}
                >
                  {" "}
                  (in cms)
                </Text>
              </Text>
              <PrimeInput
                inputProps={{
                  style: {
                    marginBottom: 15,
                  },
                  onChangeText: (text) => {
                    this.setState({ height: text });
                  },
                  placeholder: "Height",
                  keyboardType: "number-pad",
                }}
                noAnimation={true}
              />
              <Text style={styles.heads}>Gender</Text>
              <Picker
                pickerProps={{
                  onValueChange: async (value) => {
                    await this.setState({ selectedGender: value });
                  },
                }}
                pickerItems={[
                  { id: 1, label: "Male", value: "male" },
                  { id: 2, label: "Female", value: "female" },
                  { id: 3, label: "Other", value: "other" },
                ]}
                placeholder={{
                  value: null,
                  label: "Select a Gender",
                  color: "black",
                }}
                placeholderLabel={"Select a Gender"}
                pickerValues={{
                  male: "Male",
                  female: "Female",
                  other: "Other",
                }}
              />
              <Text style={styles.heads}>{i18n.t("signup.woLocation")}</Text>
              <Picker
                pickerProps={{
                  onValueChange: async (value) => {
                    await this.setState({ selectedLocation: value });
                  },
                }}
                pickerItems={this.state.woLocation}
                placeholder={this.state.locationPlaceholder}
                placeholderLabel={this.state.locationPlaceholder.label}
                pickerValues={this.state.locationPicker}
              />
              <Text style={styles.heads}>
                {i18n.t("signup.woFreq")}
                <Text
                  style={[styles.heads, { fontSize: 10, fontWeight: "normal" }]}
                >
                  {" "}
                  (per week)
                </Text>
              </Text>
              <Picker
                pickerProps={{
                  onValueChange: async (value) => {
                    await this.setState({ selectedFrequency: value });
                  },
                }}
                pickerItems={this.state.woFreq}
                placeholder={this.state.freqPlaceholder}
                placeholderLabel={this.state.freqPlaceholder.label}
                pickerValues={this.state.freqPicker}
              />
              <Text style={styles.heads}>{i18n.t("signup.woPeriod")}</Text>
              <Picker
                pickerProps={{
                  onValueChange: async (value) => {
                    await this.setState({ selectedPeriod: value });
                  },
                }}
                pickerItems={this.state.woPeriod}
                placeholder={this.state.periodPlaceholder}
                placeholderLabel={this.state.periodPlaceholder.label}
                pickerValues={this.state.periodPicker}
              />
              <Text style={styles.heads}>{i18n.t("signup.woDiff")}</Text>
              <Picker
                pickerProps={{
                  onValueChange: async (value) => {
                    await this.setState({ selectedDiff: value });
                  },
                }}
                pickerItems={this.state.woDiff}
                placeholder={this.state.diffPlaceholder}
                placeholderLabel={this.state.diffPlaceholder.label}
                pickerValues={this.state.diffPicker}
              />
              <PrimeButton
                buttonProps={{
                  style: styles.registerBtn,
                  onPress: () => {
                    this.checkIfEmailAvailable();
                  },
                }}
                buttonText={i18n.t("signup.register")}
                loading={loading}
                indiColor={Colors.SKY_COLOR}
              />
            </View>
          )}
        </View>
      </Container>
    );
  }
}
