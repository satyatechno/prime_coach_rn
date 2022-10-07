import React, { Component } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/Colors";
import { ROBO_BOLD, ROBO_REGULAR } from "../../constants/Fonts";
import i18n from "../../locale/i18n";
import PrimeButton from "../../components/PrimeButton";
import { standardPostApi } from "../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import RNPickerSelect from "react-native-picker-select";
import IconDown from "react-native-vector-icons/dist/Entypo";

export default class EditGender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updating: false,
      selectedGender: null,
      didUpdateGender: false,
    };
  }

  verifyPicker = () => {
    if (this.state.selectedGender === null) {
      return false;
    }
    return true;
  };

  updateGender = async () => {
    this.setState({ updating: true });
    if (this.verifyPicker()) {
      try {
        const res = await standardPostApi(
          "update_user_profile",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            gender: this.state.selectedGender,
          },
          true
        );
        if (res.data.code == 200) {
          alert("Your gender has been updated.");
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
    const { updating, didUpdateGender, selectedGender } = this.state;
    const { navigation } = this.props;
    const pickerItems = [
      { id: 1, label: "Male", value: "male" },
      { id: 2, label: "Female", value: "female" },
      { id: 3, label: "Other", value: "other" },
    ];
    const pickerValues = {
      male: "Male",
      female: "Female",
      other: "Other",
    };
    const placeholder = {
      value: null,
      label: "Select a Gender",
      color: "black",
    };
    const profile_data = navigation.getParam("content");
    return (
      <Container backFn={() => this.goBack()}>
        <Text style={styles.editName}>{i18n.t("profile.editGender")}</Text>
        <Text style={styles.heads}>{i18n.t("profile.newGender")}</Text>
        <RNPickerSelect
          Icon={() => <View />}
          items={pickerItems}
          onValueChange={async (value) => {
            await this.setState({
              selectedGender: value,
              didUpdateGender: true,
            });
          }}
          placeholder={placeholder}
        >
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownLbl}>
              {didUpdateGender
                ? pickerValues[selectedGender]
                : profile_data.gender}
            </Text>
            <IconDown name="chevron-down" size={25} color={Colors.SKY_COLOR} />
          </TouchableOpacity>
        </RNPickerSelect>
        <PrimeButton
          buttonProps={{
            style: styles.btn,
            onPress: () => {
              this.updateGender();
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
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
  },
  dropdownLbl: {
    fontSize: 15,
    fontFamily: ROBO_REGULAR,
    color: Colors.BLACK_COLOR,
  },
});
