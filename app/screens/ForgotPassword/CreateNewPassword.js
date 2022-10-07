import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  StatusBar,
} from "react-native";
import Container from "../../components/Container";
import i18n from "../../locale/i18n";
import { Colors } from "../../constants/Colors";
import PrimeInput from "../../components/PrimeInput";
import PrimeButton from "../../components/PrimeButton";
import Icon from "react-native-vector-icons/Feather";
import { StackActions, NavigationActions } from "react-navigation";
import { IS_IOS } from "../../constants/DeviceDetails";
import { ROBO_BOLD, ROBO_REGULAR } from "../../constants/Fonts";
import { standardPostApiJsonBased } from "../../api/ApiWrapper";
import { Toaster } from "../../components/Toaster";
import CustomInput from "../../components/customInput/CustomInput";
import CustomButton from "../../components/customButton/CustomButton";
import { findHeight, findSize } from "../../utils/helper";

export default class CreateNewPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passText1: "",
      passText2: "",
      isFocused1: false,
      isFocused2: false,
      isSecure: true,

      IFocused: false,
      IIFocused: false,
      IIIFocused: false,
      IVFocused: false,
      VFocused: false,
      VIFocused: false,
      first: "",
      second: "",
      third: "",
      fourth: "",
      fifth: "",
      sixth: "",

      loading: false,
    };
  }

  static navigationOptions = {
    headerShown: false,
  };

  // componentDidMount() {
  //   this.refs.inputOne.focus();
  // }

  validateOtp = (enteredOtp) => {
    // const { first, second, third, fourth, fifth, sixth } = this.state;
    // const enteredOtp = `${first}${second}${third}${fourth}${fifth}${sixth}`;
    if (!enteredOtp?.length) {
      Alert.alert("Required", "OTP is required.");
      return false;
    } else if (enteredOtp?.length < 6) {
      Alert.alert("Invalid OTP", "Please enter a valid OTP.");
      return false;
    } else {
      return true;
    }
  };

  validateLength = (text) => {
    if (!text.length) {
      Alert.alert("Required", "Password is required.");
    } else if (text.length > 16 || text.length < 8) {
      alert("Password does not meet our requirements.");
      return false;
    }
    return true;
  };

  resetPassword = async () => {
    const { passText1, passText2 } = this.state;
    const { first, second, third, fourth, fifth, sixth } = this.state;
    const enteredOtp = `${first}${second}${third}${fourth}${fifth}${sixth}`;

    const EMAIL = this.props.navigation.getParam("email");
    if (this.validateLength(passText2) && this.validateOtp(enteredOtp)) {
      this.setState({ loading: true });
      try {
        const res = await standardPostApiJsonBased(
          "update_password",
          undefined,
          {
            email: EMAIL,
            password: passText2,
            otp: enteredOtp,
          },
          true
        );
        if (res.data.code == 301) {
          Toaster(res?.data?.message, Colors.RED_COLOR);
        }
        if (res.data.code == 200) {
          // alert("You have successfully reset your password.");
          Toaster(res.data.message, Colors.GREEN_COLOR);
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: "Login",
                  params: {},
                }),
              ],
            })
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ loading: false });
      }
    }
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
    const {
      isFocused1,
      isFocused2,
      IFocused,
      IIFocused,
      IIIFocused,
      IVFocused,
      VFocused,
      VIFocused,
      loading,
    } = this.state;
    const EMAIL = this.props.navigation.getParam("email");
    return (
      <Container
        backFn={() => this.props.navigation.goBack()}
        title="Create New Password"
      >
        <StatusBar translucent={false} />
        <View>
          <Text style={styles.enterText}>
            Enter new password and 6 digit code {"\n"}sent to your email
            address.
          </Text>
          <Image
            source={require("../../../assets/images/newPass.png")}
            style={styles.img}
          />

          <CustomInput
            mainContainerStyle={{ marginVertical: 10 }}
            placeholder={"Email address"}
            inputStyle={{ fontSize: 11, paddingTop: 12 }}
            // onChangeText={(text) => {
            //   this.setState({ emailText: text });
            // }}
            keyboardType="email-address"
            value={EMAIL}
            editable={false}
          />
          <View>
            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              placeholder={"Create New Password"}
              inputStyle={{ fontSize: 11, paddingTop: 12 }}
              secureTextEntry={this.state.isSecure}
              onChangeText={(text) => {
                this.setState({ passText2: text });
              }}
              value={this.state.passText2}
            />
            <View
              style={{
                position: "absolute",

                alignSelf: "flex-end",
                justifyContent: "center",
                alignItems: "center",
                top: 0,
                bottom: 0,
              }}
            >
              {this.toggleEye()}
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.heads}>{i18n.t("forgot.enterOtp")}</Text>
          <View style={styles.otpContainer}>
            <TextInput
              ref="inputOne"
              keyboardType="numeric"
              maxLength={1}
              style={[
                styles.otpBox,
                {
                  borderColor: IFocused ? Colors.SKY_COLOR : Colors.WHITE_COLOR,
                },
              ]}
              onFocus={() => this.setState({ IFocused: true })}
              onBlur={() => this.setState({ IFocused: false })}
              onChangeText={async (text) => {
                await this.setState({ first: text });
                if (text.length == 1) this.refs.inputTwo.focus();
              }}
              selectionColor={Colors.SKY_COLOR}
            />
            <TextInput
              ref="inputTwo"
              keyboardType="numeric"
              maxLength={1}
              style={[
                styles.otpBox,
                {
                  borderColor: IIFocused
                    ? Colors.SKY_COLOR
                    : Colors.WHITE_COLOR,
                },
              ]}
              onFocus={() => this.setState({ IIFocused: true })}
              onBlur={() => this.setState({ IIFocused: false })}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  if (!this.state.second) {
                    this.refs.inputOne.focus();
                  }
                }
              }}
              onChangeText={async (text) => {
                await this.setState({ second: text });
                if (text.length == 1) this.refs.inputThree.focus();
              }}
              selectionColor={Colors.SKY_COLOR}
            />
            <TextInput
              ref="inputThree"
              keyboardType="numeric"
              maxLength={1}
              style={[
                styles.otpBox,
                {
                  borderColor: IIIFocused
                    ? Colors.SKY_COLOR
                    : Colors.WHITE_COLOR,
                },
              ]}
              onFocus={() => this.setState({ IIIFocused: true })}
              onBlur={() => this.setState({ IIIFocused: false })}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  if (!this.state.third) {
                    this.refs.inputTwo.focus();
                  }
                }
              }}
              onChangeText={async (text) => {
                await this.setState({ third: text });
                if (text.length == 1) this.refs.inputFour.focus();
              }}
              selectionColor={Colors.SKY_COLOR}
            />
            <TextInput
              ref="inputFour"
              keyboardType="numeric"
              maxLength={1}
              style={[
                styles.otpBox,
                {
                  borderColor: IVFocused
                    ? Colors.SKY_COLOR
                    : Colors.WHITE_COLOR,
                },
              ]}
              onFocus={() => this.setState({ IVFocused: true })}
              onBlur={() => this.setState({ IVFocused: false })}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  if (!this.state.fourth) {
                    this.refs.inputThree.focus();
                  }
                }
              }}
              onChangeText={async (text) => {
                await this.setState({ fourth: text });
                if (text.length == 1) this.refs.inputFive.focus();
              }}
              selectionColor={Colors.SKY_COLOR}
            />
            <TextInput
              ref="inputFive"
              keyboardType="numeric"
              maxLength={1}
              style={[
                styles.otpBox,
                {
                  borderColor: VFocused ? Colors.SKY_COLOR : Colors.WHITE_COLOR,
                },
              ]}
              onFocus={() => this.setState({ VFocused: true })}
              onBlur={() => this.setState({ VFocused: false })}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  if (!this.state.fifth) {
                    this.refs.inputFour.focus();
                  }
                }
              }}
              onChangeText={async (text) => {
                await this.setState({ fifth: text });
                if (text.length == 1) this.refs.inputSix.focus();
              }}
              selectionColor={Colors.SKY_COLOR}
            />
            <TextInput
              ref="inputSix"
              keyboardType="numeric"
              maxLength={1}
              style={[
                styles.otpBox,
                {
                  borderColor: VIFocused
                    ? Colors.SKY_COLOR
                    : Colors.WHITE_COLOR,
                },
              ]}
              onFocus={() => this.setState({ VIFocused: true })}
              onBlur={() => this.setState({ VIFocused: false })}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  if (!this.state.sixth) {
                    this.refs.inputFive.focus();
                  }
                }
              }}
              onChangeText={async (text) => {
                await this.setState({ sixth: text });
              }}
              selectionColor={Colors.SKY_COLOR}
            />
          </View>

          {/* <PrimeButton
            buttonProps={{
              style: styles.submitBtn,
              onPress: () => {
                this.resetPassword();
              },
            }}
            loading={loading}
            buttonText={i18n.t("forgot.submit")}
            indiColor={Colors.BLACK_COLOR}
          /> */}
          <CustomButton
            type={1}
            isLoading={loading}
            loaderColor={Colors.BACKGROUND}
            title={"Submit"}
            onPress={() => {
              this.resetPassword();
            }}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  enterText: {
    color: Colors.WHITE_COLOR,
    fontSize: findSize(14),
    fontFamily: ROBO_REGULAR,
    textAlign: "center",
    marginVertical: 25,
  },
  img: {
    height: findHeight(286),
    width: findHeight(286),
    alignSelf: "center",
    marginBottom: 10,
  },
  newTxt: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_BOLD,
    textAlign: "center",
    fontSize: 30,
    marginBottom: 25,
  },
  iconView: {},
  submitBtn: {
    width: 100,
    alignSelf: "center",
    backgroundColor: Colors.BG_COLOR,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
  },
  heads: {
    fontSize: findSize(14),
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    marginBottom: 10,
  },
  otpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  otpBox: {
    borderRadius: findSize(17),
    padding: 10,
    height: findSize(50),
    color: Colors.WHITE_COLOR,
    fontSize: 21,
    width: findSize(50),
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: Colors.VALHALLA,
    fontFamily: ROBO_REGULAR,
  },

  otpTxt: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_BOLD,
    textAlign: "center",
    fontSize: 30,
    marginBottom: 25,
  },
});
