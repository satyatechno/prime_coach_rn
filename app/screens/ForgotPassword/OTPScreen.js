import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import Container from "../../components/Container";
import i18n from "../../locale/i18n";
import { Colors } from "../../constants/Colors";
import PrimeButton from "../../components/PrimeButton";
import { ROBO_REGULAR, ROBO_BOLD } from "../../constants/Fonts";

export default class OTPScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
  }

  static navigationOptions = {
    headerShown: false,
  };

  componentDidMount() {
    this.refs.inputOne.focus();
  }

  validateOtp = () => {
    const { first, second, third, fourth, fifth, sixth } = this.state;
    const enteredOtp = `${first}${second}${third}${fourth}${fifth}${sixth}`;
    const sentOtp = "000000";
    if (enteredOtp !== sentOtp) {
      Alert.alert("Invalid OTP", "Please enter a valid OTP.");
      return false;
    } else {
      this.props.navigation.navigate("CreateNewPassword");
    }
  };

  render() {
    const { IFocused, IIFocused, IIIFocused, IVFocused, VFocused, VIFocused } =
      this.state;
    return (
      <Container backFn={() => this.props.navigation.goBack()}>
        <Text style={styles.otpTxt}>{i18n.t("forgot.enterOtp")}</Text>
        <Text style={styles.heads}>{i18n.t("forgot.otpHead")}</Text>
        <View style={styles.otpContainer}>
          <TextInput
            ref="inputOne"
            keyboardType="numeric"
            maxLength={1}
            style={[
              styles.otpBox,
              { borderColor: IFocused ? Colors.SKY_COLOR : Colors.WHITE_COLOR },
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
                borderColor: IIFocused ? Colors.SKY_COLOR : Colors.WHITE_COLOR,
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
                borderColor: IIIFocused ? Colors.SKY_COLOR : Colors.WHITE_COLOR,
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
                borderColor: IVFocused ? Colors.SKY_COLOR : Colors.WHITE_COLOR,
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
              { borderColor: VFocused ? Colors.SKY_COLOR : Colors.WHITE_COLOR },
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
                borderColor: VIFocused ? Colors.SKY_COLOR : Colors.WHITE_COLOR,
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
        <PrimeButton
          buttonProps={{
            style: styles.nextBtn,
            onPress: () => {
              this.validateOtp();
            },
          }}
          buttonText={i18n.t("forgot.next")}
          indiColor={Colors.BLACK_COLOR}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  otpBox: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    height: 50,
    color: Colors.BLACK_COLOR,
    fontSize: 21,
    width: "16%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
  },
  nextBtn: {
    width: 100,
    alignSelf: "center",
    backgroundColor: Colors.BG_COLOR,
    marginTop: 25,
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
  },
  otpTxt: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_BOLD,
    textAlign: "center",
    fontSize: 30,
    marginBottom: 25,
  },
  heads: {
    fontSize: 15,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    marginBottom: 5,
  },
});
