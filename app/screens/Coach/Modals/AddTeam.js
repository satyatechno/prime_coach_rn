import React, { Component } from "react";
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../../../constants/Colors";
import { ROBO_BOLD, ROBO_MEDIUM, ROBO_REGULAR } from "../../../constants/Fonts";
import Modall from "../../../components/Modall";
import PrimeInput from "../../../components/PrimeInput";
import i18n from "../../../locale/i18n";
import Select from "../../../components/Select";
import { standardPostApi } from "../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import { DEV_HEIGHT, DEV_WIDTH } from "../../../constants/DeviceDetails";
import {
  hideNavigationBar,
  showNavigationBar,
} from "react-native-navigation-bar-color";
import Icon from "react-native-vector-icons/Feather";
import CustomButton from "../../../components/customButton/CustomButton";
import CustomInput from "../../../components/customInput/CustomInput";
import { findSize } from "../../../utils/helper";
import BottomList from "../../../components/bottomList/BottomList";

export default class AddTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSport: null,
      teamName: "",
      teamAdding: false,
    };
  }

  componentDidMount() {
    hideNavigationBar();
  }
  componentWillUnmount() {
    showNavigationBar();
  }
  goBack() {
    const { navigation } = this.props;
    navigation.goBack();

    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc();
  }

  checkNonEmpty = (text) => {
    if (!text.trim().length > 0) {
      alert("Please enter a Team Name.");
      return false;
    } else {
      return true;
    }
  };

  verifyPickers = () => {
    const { selectedSport } = this.state;
    if (selectedSport == null) {
      alert("Please choose a sport to create a Team.");
      return false;
    }
    return true;
  };

  createNewTeam = async () => {
    this.setState({ teamAdding: true });
    if (this.checkNonEmpty(this.state.teamName) && this.verifyPickers()) {
      try {
        const res = await standardPostApi(
          "create_new_team",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            name: this.state.teamName,
            sport: this.state.selectedSport,
          },
          true
        );
        if (res.data.code == 200) {
          this.setState({
            teamsLoading: false,
          });
          this.goBack();
          console.log("New Team added ", res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ teamAdding: false });
  };

  render() {
    const { navigation } = this.props;
    const sports = navigation.getParam("sports");
    return (
      <>
        <View style={styles.safeView}>
          <StatusBar translucent backgroundColor={"transparent"} />
          <ImageBackground
            style={{
              height: DEV_HEIGHT + 32,
              width: DEV_WIDTH,
              justifyContent: "center",
            }}
            source={require("../../../../assets/images/add-team.png")}
          >
            <View
              style={{ position: "absolute", top: 52, left: 20, zIndex: 10 }}
            >
              <CustomButton
                style={{
                  backgroundColor: Colors.VALHALLA,
                  borderRadius: 4,
                  padding: 2,
                }}
                onPress={() => {
                  this.props?.navigation?.goBack();
                }}
              >
                <Icon
                  name="chevron-left"
                  size={20}
                  color={Colors.WHITE_COLOR}
                />
              </CustomButton>
            </View>
            <View style={styles.container}>
              <Text style={styles.heads}>Add Team</Text>
              <CustomInput
                mainContainerStyle={{ marginVertical: 10 }}
                placeholder={"Team Name"}
                inputStyle={{ fontSize: 11, paddingTop: 12 }}
                onChangeText={(text) => {
                  this.setState({ teamName: text });
                }}
                value={this.state.teamName}
              />

              <Select
                pickerProps={{
                  onValueChange: async (value) => {
                    await this.setState({ selectedSport: value });
                  },
                }}
                pickerItems={sports.pickerArray}
                pickerValue={this.state.selectedSport}
                placeholder={"Select A Sport"}
              />
              <CustomButton
                type={1}
                isLoading={this.state.teamAdding}
                loaderColor={Colors.BACKGROUND}
                title={"Save"}
                onPress={() => {
                  this.createNewTeam();
                }}
              />
            </View>
          </ImageBackground>
        </View>
        {/* <BottomList /> */}
      </>
    );
  }
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.BACKGROUND,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 20,
  },
  heads: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_MEDIUM,
    textAlign: "center",
    fontSize: findSize(21),
    marginBottom: 10,
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
    borderColor: Colors.LIGHT_GREY,
    borderWidth: 1,
  },
  dropdownLbl: {
    fontSize: 15,
    fontFamily: ROBO_REGULAR,
  },
});
