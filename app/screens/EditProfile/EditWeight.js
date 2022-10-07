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

export default class EditWeight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updating: false,
      bodyWeight: "",
    };
  }

  verifyWeight = (weight) => {
    if (!weight.trim().length > 0) {
      return false;
    }
    if (Number(weight) < 1) {
      return false;
    }
    return true;
  };

  updateWeight = async () => {
    this.setState({ updating: true });
    if (this.verifyWeight(this.state.bodyWeight)) {
      try {
        const res = await standardPostApi(
          "update_user_profile",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            body_weight: this.state.bodyWeight,
          },
          true
        );
        if (res.data.code == 200) {
          alert("Your body weight has been updated.");
          this.goBack();
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ updating: false });
  };

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc();
  }

  componentWillUnmount() {
    this.goBack();
  }

  render() {
    const { updating } = this.state;
    const { navigation } = this.props;
    const profile_data = navigation.getParam("content");
    return (
      <Container backFn={() => this.goBack()}>
        <Text style={styles.editName}>{i18n.t("profile.editWeight")}</Text>
        <Text style={styles.heads}>
          {i18n.t("profile.newWeight")}
          <Text
            style={[styles.editName, { fontSize: 9, fontWeight: "normal" }]}
          >
            {" "}
            (in lbs)
          </Text>
        </Text>
        <PrimeInput
          inputProps={{
            onChangeText: (text) => {
              this.setState({ bodyWeight: text });
            },
            placeholder:
              profile_data.body_weight !== null
                ? profile_data.body_weight.toString()
                : "",
            keyboardType: "numeric",
          }}
          placeColor={Colors.BLACK_COLOR}
          noAnimation={true}
        />
        <PrimeButton
          buttonProps={{
            style: styles.btn,
            onPress: () => {
              this.updateWeight();
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
  editName: {
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
