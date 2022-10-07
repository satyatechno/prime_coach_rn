import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/Colors";
import { ROBO_BOLD, ROBO_MEDIUM, ROBO_REGULAR } from "../../constants/Fonts";
import i18n from "../../locale/i18n";
import PrimeInput from "../../components/PrimeInput";
import PrimeButton from "../../components/PrimeButton";
import Icon from "react-native-vector-icons/Feather";
import { DEV_HEIGHT, DEV_WIDTH, IS_IOS } from "../../constants/DeviceDetails";
import { StackActions, NavigationActions } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import { standardPostApi } from "../../api/ApiWrapper";
import OneSignal from "react-native-onesignal";
import DeviceInfo from "react-native-device-info";
import { findHeight } from "../../utils/helper";
import CustomInput from "../../components/customInput/CustomInput";
import CustomButton from "../../components/customButton/CustomButton";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSecure: true,
      emailText: "",
      passwordText: "",
      loading: false,
    };
    // this.saveDeviceToServer();
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

  validatePassword = (text) => {
    if (text.length === 0 || text.length < 8) {
      alert("Please enter a valid password.");
      return false;
    } else {
      return true;
    }
  };

  loginUser = async () => {
    const { navigation } = this.props;
    const LogInAs = navigation.getParam("logInAs");
    this.setState({ loading: true });
    if (
      this.validateEmail(this.state.emailText) &&
      this.validatePassword(this.state.passwordText)
    ) {
      try {
        const res = await standardPostApi(
          "login",
          undefined,
          {
            email: this.state.emailText,
            password: this.state.passwordText,
            device_token: "874874874874",
            device_type: IS_IOS ? "ios" : "android",
            role: LogInAs === "coach" ? 3 : 2,
            login_type: "api",
          },
          true
        );
        if (res.data.code == 200) {
          await AsyncStorage.setItem(
            "@USER_ACCESS_TOKEN",
            res.data.data.access_token
          );
          await AsyncStorage.setItem("@USER_ROLE", res.data.data.role);
          await AsyncStorage.setItem(
            "@IS_ADMIN",
            JSON.stringify(res.data.data.is_admin)
          );
          await AsyncStorage.setItem("user", JSON.stringify(res.data.data));
          await this.saveDeviceToServer();
          console.log("is_admin ", res.data.data);
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName:
                    LogInAs === "coach"
                      ? res.data.data.is_admin == 1
                        ? "DrawerAdminNav"
                        : "DrawerNav"
                      : "DrawerAthNav",
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
  async saveDeviceToServer() {
    const deviceState = await OneSignal.getDeviceState();

    console.log("Devise state at Login", {
      access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
      player_id: deviceState?.userId,
      device_type: Platform.OS,
      device_id: DeviceInfo.getUniqueId(),
      device_model: DeviceInfo.getModel(),
    });

    try {
      const res = await standardPostApi(
        "save_device",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          player_id: deviceState?.userId,
          device_type: Platform.OS,
          device_id: DeviceInfo.getUniqueId(),
          device_model: DeviceInfo.getModel(),
        },
        true,
        false
      );
      if (res.data.status) {
        console.log("Push Notification connected");
      }
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    const { loading } = this.state;
    const { navigation } = this.props;
    const LogInAs = navigation.getParam("logInAs");
    const IMG =
      LogInAs === "coach"
        ? require("../../../assets/images/coach.png")
        : require("../../../assets/images/athlete.png");
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.container}
        >
          <View style={styles.container}>
            <StatusBar translucent backgroundColor={"transparent"} />
            <Image
              style={{ height: DEV_HEIGHT * 0.6, width: DEV_WIDTH }}
              source={IMG}
            />
            <View
              style={{
                position: "absolute",
                top: 0,
                height: DEV_HEIGHT * 0.6,
                width: DEV_WIDTH,
                backgroundColor: Colors.BACKGROUND,
                opacity: 0.5,
              }}
            />
            <View
              style={{ position: "absolute", top: 52, left: 20, zIndex: 10 }}
            >
              <CustomButton
                style={{
                  backgroundColor: Colors.VALHALLA,
                  borderRadius: 4,
                  padding: 2,
                }}
                onPress={() => {
                  this.props?.navigation?.goBack();
                }}
              >
                <Icon
                  name="chevron-left"
                  size={20}
                  color={Colors.WHITE_COLOR}
                />
              </CustomButton>
            </View>
            <Text style={styles.loginTxt}>
              {LogInAs === "coach" ? "Coach" : "Athlete"} Login
            </Text>
            <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
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
                    this.setState({ passwordText: text });
                  }}
                  value={this.state.passwordText}
                />
                <View
                  style={{
                    position: "absolute",
                    // height: findHeight(50),
                    // marginTop: 10,
                    alignSelf: "flex-end",
                    justifyContent: "center",
                    alignItems: "center",
                    bottom: 0,
                    top: 0,
                  }}
                >
                  {this.toggleEye()}
                </View>
              </View>
              <CustomButton
                onPress={() => {
                  this.props.navigation.navigate("InputEmail");
                }}
                style={{ alignSelf: "center", marginVertical: findHeight(8) }}
              >
                <Text style={styles.forgotTxt}>Forgot Password?</Text>
              </CustomButton>
              <CustomButton
                type={1}
                isLoading={this.state.loading}
                loaderColor={Colors.BACKGROUND}
                title={"Login"}
                onPress={() => {
                  this.loginUser();
                }}
              />
              {LogInAs === "athlete" ? (
                <CustomButton
                  onPress={() => {
                    this.props.navigation.navigate("SelectSport");
                  }}
                  style={{
                    alignSelf: "center",
                    marginVertical: findHeight(8),
                  }}
                >
                  <Text style={styles.forgotTxt}>Register as a new user</Text>
                </CustomButton>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },
  loginTxt: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_MEDIUM,
    textAlign: "center",
    fontSize: 25,
  },
  heads: {
    fontSize: 15,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    marginBottom: 5,
  },
  iconView: {
    // position: "absolute",
    // left: "86%",
    // top: IS_IOS ? 118 : 123,
    // zIndex: 9999,
  },
  forgotView: {
    alignSelf: "center",
    marginTop: -10,
  },
  forgotTxt: {
    color: Colors.ORANGE,
    fontFamily: ROBO_REGULAR,
    fontSize: 15,
    textAlign: "center",
  },
  loginBtn: {
    width: 100,
    alignSelf: "center",
    backgroundColor: Colors.BG_COLOR,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
  },
  img: {
    alignSelf: "center",
    tintColor: Colors.SKY_COLOR,
    resizeMode: "contain",
    height: 50,
    width: 50,
  },
});
