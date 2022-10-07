import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../../constants/Colors";
import { ROBO_BOLD, ROBO_REGULAR } from "../../../constants/Fonts";
import Modall from "../../../components/Modall";
import PrimeInput from "../../../components/PrimeInput";
import { standardPostApi } from "../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import { Toaster } from "../../../components/Toaster";
import Icon from "react-native-vector-icons/Feather";
import { IS_IOS } from "../../../constants/DeviceDetails";

export default class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resettingPassword: false,
      pass1: "",
      pass2: "",
      isSecure: true,
    };
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc();
  }

  verifyPasswords = () => {
    const { pass1, pass2 } = this.state;
    if (pass1.length < 8) {
      Toaster(
        "New password should be of at least 8 characters.",
        Colors.LIGHT_RED
      );
      return false;
    } else if (pass1 !== pass2) {
      Toaster("Passwords do not match.", Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  resetUserPassword = async () => {
    const { navigation } = this.props;
    const user_details = navigation.getParam("content").userDetails;
    if (this.verifyPasswords()) {
      this.setState({ resettingPassword: true });
      try {
        const res = await standardPostApi(
          "admin_reset_password",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            user_id: user_details.id,
            password: this.state.pass1,
          },
          true,
          false
        );
        if (res.data.code == 301) {
          this.setState({ resettingPassword: false });
          Toaster(res.data.message, Colors.LIGHT_RED);
        }
        if (res.data.code == 200) {
          Toaster(
            `You have successfully reset the password for user ${user_details.email}`,
            Colors.GREEN_COLOR
          );
          this.setState({ resettingPassword: false });
          this.goBack();
        }
      } catch (error) {
        console.log(error);
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
            color={Colors.BLACK_COLOR}
          />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const user_details = navigation.getParam("content").userDetails;
    const { resettingPassword, isSecure } = this.state;
    console.log(user_details);
    return (
      <Modall
        crossPress={() => this.props.navigation.goBack()}
        savePress={() => this.resetUserPassword()}
        btnTxt={"Save"}
        title={"Reset User Password"}
        loading={resettingPassword}
        containerProps={{ style: { flex: 1 / 1.5 } }}
      >
        <Text style={styles.heads}>New Password</Text>
        <PrimeInput
          inputProps={{
            onChangeText: (text) => {
              this.setState({ pass1: text });
            },
            placeholder: "Enter a New Password",
            style: { marginBottom: 10 },
            secureTextEntry: isSecure,
          }}
          noAnimation={true}
        />
        <Text style={styles.heads}>Confirm New Password</Text>
        <PrimeInput
          inputProps={{
            onChangeText: (text) => {
              this.setState({ pass2: text });
            },
            placeholder: "Re enter the New Password",
            style: { marginBottom: 10 },
            secureTextEntry: isSecure,
          }}
          noAnimation={true}
        />
        {this.toggleEye()}
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
  iconView: {
    position: "absolute",
    left: "86%",
    top: IS_IOS ? 103 : 108,
    zIndex: 9999,
  },
});
