import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/Colors";
import { ROBO_BOLD, ROBO_REGULAR } from "../../constants/Fonts";
import i18n from "../../locale/i18n";
import PrimeButton from "../../components/PrimeButton";
import Picker from "../../components/Picker";
import { standardPostApi } from "../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";

export default class CoachSpacl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updating: false,
      selectedSpcl: null,
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

  updateSpcl = async () => {
    this.setState({ updating: true });
    if (this.state.selectedSpcl !== null) {
      try {
        const res = await standardPostApi(
          "update_user_profile",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            specialization: this.state.selectedSpcl,
          },
          true
        );
        if (res.data.code == 200) {
          alert("Your specialisation has been updated.");
          this.goBack();
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ updating: false });
  };

  render() {
    const { updating, selectedSpcl } = this.state;
    const { navigation } = this.props;
    const coachSpec = navigation.getParam("coachSpec");
    const profile_data = navigation.getParam("content");
    return (
      <Container backFn={() => this.goBack()}>
        <Text style={styles.editEmail}>{i18n.t("profile.editSpcl")}</Text>
        <Text style={styles.heads}>{i18n.t("profile.newSpcl")}</Text>
        <Picker
          pickerProps={{
            onValueChange: async (value) => {
              await this.setState({ selectedSpcl: value });
              console.log("The selectedSpcl is ", this.state.selectedSpcl);
            },
          }}
          placeholderProps={{
            style: {
              color: Colors.BLACK_COLOR,
            },
          }}
          pickerItems={coachSpec.pickerArray}
          placeholder={coachSpec.pickerPlaceholder}
          placeholderLabel={
            profile_data.specialization
              ? profile_data.specialization
              : coachSpec.pickerPlaceholder.label
          }
          pickerValues={coachSpec.pickerObject}
        />
        <PrimeButton
          buttonProps={{
            style: styles.btn,
            onPress: () => {
              this.updateSpcl();
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
  dropdown: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.WHITE_COLOR,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  dropdownLbl: {
    fontSize: 15,
    fontFamily: ROBO_REGULAR,
  },
});
