import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Container from "../../../../../components/Container";
import Modall from "../../../../../components/Modall";
import PrimeInput from "../../../../../components/PrimeInput";
import DatePicker from "../../../../../components/DatePicker";
import Select from "../../../../../components/Select";
import Loader from "../../../../../components/Loader";
import { ROBO_REGULAR } from "../../../../../constants/Fonts";
import { Colors } from "../../../../../constants/Colors";
import { standardPostApi } from "../../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import { DEV_HEIGHT } from "../../../../../constants/DeviceDetails";
import { Toaster } from "../../../../../components/Toaster";
import moment from "moment";
import CustomInput from "../../../../../components/customInput/CustomInput";
import CustomButton from "../../../../../components/customButton/CustomButton";
export default class EditUserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateOfBirth: new Date(),
      selectedPosition: null,
      firstName: "",
      surName: "",
      emailAddress: "",
      address: "",
      dataLoading: true,
      sportsPositions: [],
      updatingProfile: false,
    };
    this.fetchSportsPosition();
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const PlayerData = navigation.getParam("content").playerDetails.player;
    await this.setState({
      firstName: PlayerData.first_name,
      surName: PlayerData.last_name,
      emailAddress: PlayerData.email,
      address: PlayerData.address,
      dateOfBirth: PlayerData.dob,
    });
  }

  goBack() {
    const { navigation } = this.props;
    navigation.pop(2);
  }

  fetchSportsPosition = async () => {
    const { navigation } = this.props;
    const teamData = navigation.getParam("content").playerDetails.teamData;
    const PlayerData = navigation.getParam("content").playerDetails.player;
    console.log(PlayerData);
    try {
      const res = await standardPostApi(
        "pre_add_coach_player_in_team",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          team: teamData.id,
        },
        true
      );
      if (res.data.code == 200) {
        await this.setState({
          sportsPositions: res.data.data.SportPositions.pickerArray,
          dataLoading: false,
        });
        res.data.data.SportPositions.pickerArray.forEach((item) => {
          if (item.label == PlayerData.sport_position) {
            this.setState({ selectedPosition: item.value });
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ dataLoading: false });
  };

  toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
  };

  checkNonEmpty = (str, value) => {
    if (!str.trim().length > 0) {
      Toaster(`${value} can not be empty.`, Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  validatePosition = () => {
    const { selectedPosition, sportsPositions } = this.state;
    if (selectedPosition === null && sportsPositions?.length > 0) {
      Toaster("Please select a sport position.", Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  isValidDOB() {
    const dob = new Date(this.state.dateOfBirth);
    const today = new Date();
    if (today.getFullYear() - dob.getFullYear() < 16) {
      Toaster(
        "Invalid DOB!\nYou must be at least 16 year old.",
        Colors.LIGHT_RED
      );
      return false;
    }
    return true;
  }

  updateUserProfile = async () => {
    const { navigation } = this.props;
    const { dateOfBirth, firstName, surName } = this.state;
    const PlayerData = navigation.getParam("content").playerDetails.player;
    const date_of_birth = moment(this.toTimestamp(dateOfBirth) * 1000)
      .format("YYYY-MM-DD")
      .toString();
    if (
      this.checkNonEmpty(firstName, "First Name") &&
      this.checkNonEmpty(surName, "Surname") &&
      this.isValidDOB() &&
      this.validatePosition()
    ) {
      this.setState({ updatingProfile: true });
      try {
        const res = await standardPostApi(
          "update_user_profile",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            first_name: this.state.firstName,
            last_name: this.state.surName,
            dob: date_of_birth,
            address: this.state.address?.trim(),
            access_user_id: PlayerData.id,
            access_sport_position: this.state.selectedPosition,
          },
          true,
          false
        );
        if (res.data.code == 200) {
          this.goBack();
          console.log("user profile updated ", res.data.data);
          Toaster(res.data.message, Colors.GREEN_COLOR);
          this.setState({ updatingProfile: false });
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ updatingProfile: false });
  };

  render() {
    const { sportsPositions, dataLoading, updatingProfile } = this.state;
    return (
      <Container
        backFn={() => this.props.navigation.goBack()}
        title="Edit User Details"
      >
        {/* <Modall
          crossPress={() => this.goBack()}
          savePress={() => this.updateUserProfile()}
          btnTxt={'Save'}
          title={'Update User Details'}
          removePadding={true}
          loading={updatingProfile}
          containerProps={{ style: { flex: 6 / 7, marginVertical: 25 } }}
        > */}
        {dataLoading ? (
          <Loader
            loaderProps={{ style: { marginBottom: (DEV_HEIGHT * 25) / 100 } }}
          />
        ) : (
          <View>
            {/* <Text style={styles.heads}>First Name</Text>
            <PrimeInput
              inputProps={{
                onChangeText: (text) => {
                  this.setState({ firstName: text });
                },
                style: { marginBottom: 15 },
                value: this.state.firstName,
              }}
              noAnimation={true}
            />
           
            <Text style={styles.heads}>Surname</Text>
            <PrimeInput
              inputProps={{
                onChangeText: (text) => {
                  this.setState({ surName: text });
                },
                style: { marginBottom: 15 },
                value: this.state.surName,
              }}
              noAnimation={true}
            />*/}

            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              placeholder={"First Name"}
              inputStyle={{ fontSize: 11, paddingTop: 12 }}
              onChangeText={(text) => {
                this.setState({ firstName: text });
              }}
              value={this.state.firstName}
            />
            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              placeholder={"Last Name"}
              inputStyle={{ fontSize: 11, paddingTop: 12 }}
              onChangeText={(text) => {
                this.setState({ surName: text });
              }}
              value={this.state.surName}
            />
            {/* <Text style={styles.heads}>Email</Text>
            <PrimeInput
              inputProps={{
                // onChangeText: (text) => {
                //   this.setState({ emailAddress: text });
                // },
                style: { marginBottom: 15 },
                value: this.state.emailAddress,
                keyboardType: "email-address",
              }}
              noAnimation={true}
            /> */}
            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              placeholder={"Email address"}
              inputStyle={{ fontSize: 11, paddingTop: 12 }}
              onChangeText={(text) => {
                this.setState({ emailAddress: text });
              }}
              keyboardType="email-address"
              value={this.state.emailAddress}
            />
            {/* <Text style={styles.heads}>DOB</Text> */}
            <DatePicker
              dateTimeProps={{
                onChange: async (date) => {
                  await this.setState({ dateOfBirth: date });
                },
              }}
              showDarkBg
              currentDate={this.state.dateOfBirth}
              minDate={new Date("1900-01-01")}
              maxDate={new Date()}
            />
            {/* <Text style={styles.heads}>Address</Text>
            <PrimeInput
              inputProps={{
                onChangeText: (text) => {
                  this.setState({ address: text });
                },
                value: this.state.address,
                style: { marginBottom: 15 },
              }}
              noAnimation={true}
            /> */}
            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              placeholder={"Address"}
              inputStyle={{ fontSize: 11, paddingTop: 12 }}
              onChangeText={(text) => {
                this.setState({ address: text });
              }}
              value={this.state.address}
            />
            {/* <Text style={styles.heads}>Sport Position</Text> */}
            <Select
              pickerProps={{
                onValueChange: async (value) => {
                  await this.setState({ selectedPosition: value });
                },
              }}
              pickerItems={sportsPositions}
              pickerValue={this.state.selectedPosition}
              placeholder={
                !sportsPositions?.length ? "No sport position avalable" : false
              }
            />
            <CustomButton
              type={1}
              isLoading={updatingProfile}
              loaderColor={Colors.BACKGROUND}
              title={"Save"}
              onPress={() => {
                this.updateUserProfile();
              }}
            />
          </View>
        )}
        {/* </Modall> */}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  heads: {
    fontSize: 15,
    fontFamily: ROBO_REGULAR,
    color: Colors.BLACK_COLOR,
    marginBottom: 5,
  },
});
