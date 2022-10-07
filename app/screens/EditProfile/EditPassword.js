import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/Colors";
import { ROBO_BOLD, ROBO_REGULAR } from "../../constants/Fonts";
import i18n from "../../locale/i18n";
import PrimeInput from "../../components/PrimeInput";
import PrimeButton from "../../components/PrimeButton";
import Icon from "react-native-vector-icons/Feather";
import { IS_IOS } from "../../constants/DeviceDetails";
import { standardPostApi } from "../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import CustomInput from "../../components/customInput/CustomInput";
import CustomButton from "../../components/customButton/CustomButton";
import { findHeight } from "../../utils/helper";

const ToggleEye = ({ toggle, isSecure }) => {
  return (
    <View style={styles.iconView}>
      <TouchableOpacity style={{ padding: 10 }} onPress={() => toggle()}>
        <Icon
          name={isSecure ? "eye-off" : "eye"}
          size={20}
          color={Colors.INPUT_PLACE}
        />
      </TouchableOpacity>
    </View>
  );
};
export default class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updating: false,
      isSecure: true,
      isSecure1: true,
      isSecure2: true,
      oldPassword: "",
      newPass1: "",
      newPass2: "",
    };
  }

  verifyPasswds = () => {
    const { oldPassword, newPass1, newPass2 } = this.state;
    if (oldPassword.length < 8) {
      alert("Please enter a valid old password.");
      return false;
    } else if (newPass1.length < 8 || newPass2.length < 8) {
      alert("New password should be of at least 8 characters.");
      return false;
    } else if (newPass1 !== newPass2) {
      alert("New passwords do not match.");
      return false;
    }
    return true;
  };

  updatePassword = async () => {
    this.setState({ updating: true });
    if (this.verifyPasswds()) {
      try {
        const res = await standardPostApi(
          "change_password",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            old_password: this.state.oldPassword,
            new_password: this.state.newPass1,
          },
          true
        );
        if (res.data.code == 200) {
          alert("Your password has been updated.");
          this.props.navigation.goBack();
          console.log("password update ", res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ updating: false });
  };

  render() {
    const { updating } = this.state;
    return (
      <Container
        backFn={() => this.props.navigation.goBack()}
        title={"Change Password"}
      >
        {/* <Text style={styles.editPass}>{i18n.t("profile.editPass")}</Text>
        <Text style={[styles.heads]}>{i18n.t("profile.oldPass")}</Text> */}
        <View>
          <CustomInput
            mainContainerStyle={{ marginVertical: 10 }}
            placeholder={"Old Password"}
            inputStyle={{ fontSize: 11, paddingTop: 12 }}
            secureTextEntry={this.state.isSecure}
            onChangeText={(text) => {
              this.setState({ oldPassword: text });
            }}
            value={this.state.oldPassword}
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
            <ToggleEye
              isSecure={this.state.isSecure}
              toggle={() => {
                this.setState({ isSecure: !this.state.isSecure });
              }}
            />
          </View>
        </View>
        <View>
          <CustomInput
            mainContainerStyle={{ marginVertical: 10 }}
            placeholder={"New Password"}
            inputStyle={{ fontSize: 11, paddingTop: 12 }}
            secureTextEntry={this.state.isSecure1}
            onChangeText={(text) => {
              this.setState({ newPass1: text });
            }}
            value={this.state.newPass1}
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
            <ToggleEye
              isSecure={this.state.isSecure1}
              toggle={() => {
                this.setState({ isSecure1: !this.state.isSecure1 });
              }}
            />
          </View>
        </View>
        <View>
          <CustomInput
            mainContainerStyle={{ marginVertical: 10 }}
            placeholder={"Confirm Password"}
            inputStyle={{ fontSize: 11, paddingTop: 12 }}
            secureTextEntry={this.state.isSecure2}
            onChangeText={(text) => {
              this.setState({ newPass2: text });
            }}
            value={this.state.newPass2}
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
            <ToggleEye
              isSecure={this.state.isSecure2}
              toggle={() => {
                this.setState({ isSecure2: !this.state.isSecure2 });
              }}
            />
          </View>
        </View>

        <CustomButton
          type={1}
          onPress={() => {
            this.updatePassword();
          }}
          title={i18n.t("profile.submit")}
          isLoading={updating}
        />
        {/* <PrimeInput
          inputProps={{
            onChangeText: (text) => {
              this.setState({ oldPassword: text });
            },
            placeholder: `${i18n.t("profile.oldPass")}`,
            secureTextEntry: this.state.isSecure,
          }}
          noAnimation={true}
        />
        <Text style={[styles.heads]}>{i18n.t("profile.newPass")}</Text>
        <PrimeInput
          inputProps={{
            onChangeText: (text) => {
              this.setState({ newPass1: text });
            },
            placeholder: `${i18n.t("profile.newPass")}`,
            secureTextEntry: this.state.isSecure,
          }}
          noAnimation={true}
        />
        <Text style={[styles.heads]}>{i18n.t("profile.confirmNew")}</Text>
        <PrimeInput
          inputProps={{
            onChangeText: (text) => {
              this.setState({ newPass2: text });
            },
            placeholder: `${i18n.t("profile.confirmNew")}`,
            secureTextEntry: this.state.isSecure,
          }}
          noAnimation={true}
        />
        {this.toggleEye()}
        <PrimeButton
          buttonProps={{
            style: styles.btn,
            onPress: () => {
              this.updatePassword();
            },
          }}
          buttonText={i18n.t("profile.submit")}
          loading={updating}
          indiColor={Colors.SKY_COLOR}
        /> */}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  editPass: {
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
  iconView: {
    // position: "absolute",
    // left: "91%",
    // bottom: IS_IOS ? 97 : 98,
    // zIndex: 9999,
  },
  btn: {
    width: 100,
    alignSelf: "center",
    backgroundColor: Colors.BG_COLOR,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
  },
});
