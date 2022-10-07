import React, { Component } from "react";
import { Text, StyleSheet, Alert } from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/Colors";
import { ROBO_BOLD, ROBO_REGULAR } from "../../constants/Fonts";
import i18n from "../../locale/i18n";
import PrimeButton from "../../components/PrimeButton";
import moment from "moment";
import { standardPostApi } from "../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import DatePicker from "../../components/DatePicker";

export default class EditDOB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updating: false,
      date: new Date(),
      hasSetDate: false,
    };
  }

  isValidDOB() {
    const dob = new Date(this.state.date);
    const today = new Date();
    if (!this.state.hasSetDate) {
      alert("Please select a Date of Birth.");
      return false;
    }
    if (today.getFullYear() - dob.getFullYear() < 16) {
      Alert.alert("Invalid DOB", "You must be at least 16 year old.");
      return false;
    }
    return true;
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

  updateDOB = async () => {
    const { navigation } = this.props;
    const { date, hasSetDate } = this.state;
    const profile_data = navigation.getParam("content");
    this.setState({ updating: true });
    if (hasSetDate && this.isValidDOB()) {
      try {
        const res = await standardPostApi(
          "update_user_profile",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            dob: hasSetDate
              ? moment(date).format("YYYY-MM-DD").toString()
              : profile_data.dob,
          },
          true
        );
        if (res.data.code == 200) {
          alert("Your Date of Birth has been updated.");
          this.goBack();
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ updating: false });
  };

  render() {
    const { updating, hasSetDate, date } = this.state;
    const { navigation } = this.props;
    const profile_data = navigation.getParam("content");
    console.log(new Date(profile_data.dob).valueOf());
    return (
      <Container backFn={() => this.goBack()}>
        <Text style={styles.editEmail}>{i18n.t("profile.editDOB")}</Text>
        <Text style={styles.heads}>{i18n.t("profile.newDOB")}</Text>
        <DatePicker
          dateTimeProps={{
            onChange: async (date) => {
              await this.setState({ hasSetDate: true, date: date });
            },
          }}
          currentDate={hasSetDate ? date : profile_data.dob}
          minDate={new Date("1900-01-01")}
          maxDate={new Date()}
        />
        <PrimeButton
          buttonProps={{
            style: styles.btn,
            onPress: () => {
              this.updateDOB();
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
  editEmail: {
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
  androidView: {
    height: 45,
    width: "100%",
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: "center",
  },
  dateView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  dateText: {
    color: Colors.BLACK_COLOR,
    fontFamily: ROBO_REGULAR,
  },
  dateIconView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});
