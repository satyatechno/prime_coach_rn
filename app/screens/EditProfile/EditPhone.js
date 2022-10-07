import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/Colors";
import { ROBO_BOLD, ROBO_REGULAR } from "../../constants/Fonts";
import i18n from "../../locale/i18n";
import PrimeInput from "../../components/PrimeInput";
import PrimeButton from "../../components/PrimeButton";
import { standardPostApi } from "../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";

export default class EditPhone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updating: false,
      phoneNumber: "",
    };
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc();
  }

  componentWillUnmount() {
    this.goBack();
  }

  checkNonEmpty = (text) => {
    if (text.trim().length === 0) {
      return false;
    }
    return true;
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

  updatePhone = async () => {
    this.setState({ updating: true });
    if (
      this.checkNonEmpty(this.state.phoneNumber) &&
      this.phoneNumberVerify(this.state.phoneNumber)
    ) {
      try {
        const res = await standardPostApi(
          "update_user_profile",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            phone: this.state.phoneNumber,
          },
          true
        );
        if (res.data.code == 200) {
          alert("Your phone number has been updated.");
          this.goBack();
          console.log("phone update ", res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ updating: false });
  };

  render() {
    const { updating } = this.state;
    const { navigation } = this.props;
    const profile_data = navigation.getParam("content");
    return (
      <Container backFn={() => this.goBack()}>
        <Text style={styles.editPhone}>{i18n.t("profile.editPhone")}</Text>
        <Text style={styles.heads}>{i18n.t("profile.newPhone")}</Text>
        <PrimeInput
          inputProps={{
            onChangeText: (text) => {
              this.setState({ phoneNumber: text });
            },
            keyboardType: "numeric",
            placeholder: profile_data.phone,
            maxLength: 10,
          }}
          noAnimation={true}
          placeColor={Colors.BLACK_COLOR}
        />
        <PrimeButton
          buttonProps={{
            style: styles.btn,
            onPress: () => {
              this.updatePhone();
            },
          }}
          buttonText={i18n.t("profile.submit")}
          loading={updating}
          indiColor={Colors.SKY_COLOR}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  editPhone: {
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
  btn: {
    width: 100,
    alignSelf: "center",
    backgroundColor: Colors.BG_COLOR,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
  },
});
