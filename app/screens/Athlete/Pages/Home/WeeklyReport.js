import { Text, TouchableOpacity, View } from "react-native";
import React, { Component } from "react";
import Container from "../../../../components/Container";
import AsyncStorage from "@react-native-community/async-storage";
import { standardPostApi } from "../../../../api/ApiWrapper";
import { Colors } from "../../../../constants/Colors";
import { findSize } from "../../../../utils/helper";
import { POP_MEDIUM, POP_REGULAR } from "../../../../constants/Fonts";
import Spinnner from "../../../../components/Spinnner";
import CustomButton from "../../../../components/customButton/CustomButton";
import CustomModal from "../../../../components/customModal/CustomModal";
import CustomInput from "../../../../components/customInput/CustomInput";
import AntDesign from "react-native-vector-icons/AntDesign";
import { DEV_WIDTH } from "../../../../constants/DeviceDetails";
import { Toaster } from "../../../../components/Toaster";
import DatePicker from "../../../../components/DatePicker";
import moment from "moment";
export class WeeklyReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphEndDate: moment().format("YYYY-MM-DD"),
      graphStartDate: moment().format("YYYY-MM-DD"),
      currentWeek: null,
      annualProgramDetails: null,
      fetchingData: false,
      activities: [],
      modalVisible: false,
      emailText: "",
      recipients: [],
    };
  }

  async componentDidMount() {
    const CURRENT_WEEK = JSON.parse(
      await AsyncStorage.getItem("@CURRENT_WEEK")
    );
    const CURRENT_PROGRAM = JSON.parse(
      await AsyncStorage.getItem("@CURRENT_PROGRAM")
    );

    await this.setState({
      currentWeek: CURRENT_WEEK,
      annualProgramDetails: CURRENT_PROGRAM,
      // graphStartDate: CURRENT_PROGRAM ? CURRENT_PROGRAM.start_date : new Date(),
      // graphEndDate: CURRENT_PROGRAM ? CURRENT_PROGRAM.end_date : new Date(),
    });
    this.fetchUserActivities();
  }

  fetchUserActivities = async (weekId) => {
    const { currentWeek, annualProgramDetails, graphEndDate, graphStartDate } =
      this.state;
    this.setState({ fetchingData: true });
    if (currentWeek && annualProgramDetails) {
      try {
        const res = await standardPostApi(
          "list_user_activity",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            annual_training_program_id: annualProgramDetails.id,
            annual_training_program_week_id: weekId || currentWeek.id,
            start_date: graphStartDate ?? null,
            end_date: graphEndDate ?? null,
          },
          true
        );
        if (res.data.code == 200) {
          this.setState({
            activities: res.data.data.activities,
            fetchingData: false,
          });
          console.log("activities ", this.state.activities);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  validate = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const { emailText } = this.state;
    if (!emailText?.trim().length) {
      Toaster("Email required.", Colors.LIGHT_RED);
      return false;
    } else if (!reg.test(emailText)) {
      Toaster("Please enter a valid email.", Colors.LIGHT_RED);
      return false;
    }
    return true;
  };
  addRecipients = () => {
    if (this.validate()) {
      const { recipients, emailText } = this.state;

      if (recipients.includes(emailText)) {
        Toaster("Recipient already added.", Colors.LIGHT_RED);
      } else {
        this.setState({ recipients: recipients.concat([emailText]) });
      }
    }
  };
  render() {
    const { graphEndDate, graphStartDate } = this.state;
    return (
      <>
        <Container
          backFn={() => this.props.navigation.goBack()}
          title="Weekly Report"
        >
          <Spinnner visible={this.state.fetchingData} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DatePicker
              mainContainerStyle={{ width: DEV_WIDTH * 0.38 }}
              containerStyle={{
                borderColor: Colors.WHITE_COLOR,
                borderWidth: 1,
                backgroundColor: Colors.BACKGROUND,
                width: DEV_WIDTH * 0.38,
              }}
              dateTimeProps={{
                onChange: async (date) => {
                  this.setState({
                    graphStartDate: date,
                  });
                },
              }}
              showDarkBg
              currentDate={graphStartDate}
              minDate={new Date("2000-01-01")}
              maxDate={new Date("2050-01-01")}
              placeholder={"Start date"}
            />

            <DatePicker
              placeholder={"End date"}
              mainContainerStyle={{ width: DEV_WIDTH * 0.38 }}
              containerStyle={{
                borderColor: Colors.WHITE_COLOR,
                borderWidth: 1,
                backgroundColor: Colors.BACKGROUND,
                width: DEV_WIDTH * 0.38,
              }}
              dateTimeProps={{
                onChange: async (date) => {
                  this.setState({
                    graphEndDate: date,
                  });
                },
              }}
              showDarkBg
              currentDate={graphEndDate}
              minDate={new Date("2000-01-01")}
              maxDate={new Date("2050-01-01")}
            />
            <TouchableOpacity
              style={{
                height: findSize(48),
                width: findSize(48),
                borderRadius: 25,
                backgroundColor: Colors.ORANGE,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                this.fetchUserActivities();
              }}
            >
              <AntDesign name="check" size={22} color={Colors.WHITE_COLOR} />
            </TouchableOpacity>
          </View>

          <View style={{ paddingVertical: 15 }}>
            {this.state.activities?.map((item, index) => (
              <View key={index}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 15,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.WHITE_COLOR,
                      fontFamily: POP_REGULAR,
                      fontSize: findSize(16),
                    }}
                  >
                    {item?.key}
                  </Text>
                  <Text
                    style={{
                      color: Colors.WHITE_COLOR,
                      fontFamily: POP_REGULAR,
                      fontSize: findSize(16),
                    }}
                  >
                    {item?.value}
                  </Text>
                </View>
                {this.state.activities?.length - 1 > index && (
                  <View
                    style={{
                      height: 1,
                      width: "100%",
                      backgroundColor: Colors.VALHALLA,
                    }}
                  />
                )}
              </View>
            ))}
          </View>
          <CustomButton
            title={"Manage Recipients"}
            onPress={() => {
              this.setState({ modalVisible: true });
            }}
            type={2}
          />
        </Container>
        <CustomModal
          isVisible={this.state.modalVisible}
          onClose={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              fontFamily: POP_MEDIUM,
              fontSize: findSize(21),
              modalVisible: 15,
              alignSelf: "center",
            }}
          >
            Report Email Recipients
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              containerStyle={{ width: DEV_WIDTH * 0.65 }}
              placeholder={"Email"}
              inputStyle={{ fontSize: 11, paddingTop: 12 }}
              onChangeText={(text) => {
                this.setState({ emailText: text });
              }}
              keyboardType="email-address"
              value={this.state.emailText}
            />
            <TouchableOpacity
              style={{
                height: findSize(48),
                width: findSize(48),
                borderRadius: 25,
                backgroundColor: Colors.ORANGE,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                this.addRecipients();
              }}
            >
              <AntDesign name="plus" size={22} color={Colors.WHITE_COLOR} />
            </TouchableOpacity>
          </View>
          {this.state.recipients.map((recipient) => {
            return (
              <View style={{ paddingVertical: 15 }}>
                <Text
                  style={{
                    color: Colors.WHITE_COLOR,
                    fontFamily: POP_REGULAR,
                    fontSize: findSize(16),
                    modalVisible: 15,
                  }}
                >
                  {recipient}
                </Text>
              </View>
            );
          })}
          <CustomButton
            type={1}
            title={"Send"}
            onPress={() => {
              if (this.state.recipients.length > 0) {
                Toaster(
                  "Will send Email to the Recipients.",
                  Colors.GREEN_COLOR
                );
                this.setState({ modalVisible: false, emailText: "" });
              } else {
                Toaster("Please add a recipient.", Colors.LIGHT_RED);
              }
            }}
          />
        </CustomModal>
      </>
    );
  }
}

export default WeeklyReport;
