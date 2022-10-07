import React, { Component } from "react";
import { Text, View, StyleSheet, Image, StatusBar } from "react-native";
import Container from "../../components/Container";
import PrimeInput from "../../components/PrimeInput";
import PrimeButton from "../../components/PrimeButton";
import i18n from "../../locale/i18n";
import { Colors } from "../../constants/Colors";
import { ROBO_REGULAR, ROBO_BOLD } from "../../constants/Fonts";
import { standardPostApiJsonBased } from "../../api/ApiWrapper";
import { Toaster } from "../../components/Toaster";
import { findHeight, findSize } from "../../utils/helper";
import CustomInput from "../../components/customInput/CustomInput";
import CustomButton from "../../components/customButton/CustomButton";
import { showNavigationBar } from "react-native-navigation-bar-color";

export default class InputEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailText: "",
      loading: false,
    };
  }
  componentDidMount() {
    showNavigationBar();
  }
  validateEmail = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      console.log("Email is Not Correct");
      alert("Please enter a valid email address.");
      // this.setState({ email: text });
      return false;
    } else {
      // this.setState({ email: text });
      console.log("Email is Correct");
      return true;
    }
  };

  verifyEmail = async () => {
    if (this.validateEmail(this.state.emailText)) {
      this.setState({ loading: true });
      try {
        const res = await standardPostApiJsonBased(
          "forgot_password",
          undefined,
          {
            email: this.state.emailText,
          },
          true
        );
        if (res.data.code == 301) {
          Toaster(res?.data?.message, Colors.RED_COLOR);
        }
        if (res.data.code == 200) {
          this.props.navigation.navigate("CreateNewPassword", {
            email: this.state.emailText,
          });
          Toaster(res.data.message, Colors.GREEN_COLOR);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ loading: false });
      }
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <Container
        backFn={() => this.props.navigation.goBack()}
        title={"Forgot Password"}
      >
        <StatusBar translucent={false} />
        <View>
          <Text style={styles.enterText}>
            Enter your registered email address to {"\n"}reset your password.
          </Text>
          <Image
            source={require("../../../assets/images/forgot-pass.png")}
            style={styles.img}
          />

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
          <CustomButton
            type={1}
            isLoading={this.state.loading}
            loaderColor={Colors.BACKGROUND}
            title={"Next"}
            onPress={() => {
              this.verifyEmail();
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
  forgotTxt: {
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
  nextBtn: {
    width: 100,
    alignSelf: "center",
    backgroundColor: Colors.BG_COLOR,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
  },
});
