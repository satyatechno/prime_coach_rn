import React, { Component } from "react";
import { Text, TouchableOpacity, View, Image, Alert } from "react-native";
import Container from "../../../../components/Container";
import { Colors } from "../../../../constants/Colors";
import IconArrow from "react-native-vector-icons/MaterialCommunityIcons";
import { standardPostApi } from "../../../../api/ApiWrapper";
import DatePicker from "../../../../components/DatePicker";
import AsyncStorage from "@react-native-community/async-storage";
import PrimeButton from "../../../../components/PrimeButton";
import Loader from "../../../../components/Loader";
import { styles } from "./Weeks.styles";
import { Toaster } from "../../../../components/Toaster";
import Spinnner from "../../../../components/Spinnner";
import moment from "moment";
import CustomButton from "../../../../components/customButton/CustomButton";
import { findSize } from "../../../../utils/helper";
import TildView from "../../../../components/tildView/TildView";
import { POP_MEDIUM } from "../../../../constants/Fonts";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
const BUTTONS = [
  // { btnName: "Update Period Dates", btnType: "update" },
  { btnName: "Add New Week", btnType: "add" },
];

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

export function Hr(props) {
  return <View style={[styles.line, props && props.style]} />;
}

export function WeekDay(props) {
  return (
    // <View style={styles.container}>
    //   <View style={styles.boxContainer}>
    //     <PrimeButton
    //       buttonProps={{
    //         style: styles.weekButton,
    //         onPress: props.onWeekDayPress,
    //       }}
    //       buttonText={props.title}
    //     />
    //     <View style={styles.iconsContainer}>
    //       <TouchableOpacity onPress={props.onClone} style={styles.iconBtn}>
    //         <Image
    //           source={require("./img/clone.png")}
    //           style={styles.copyIconImg}
    //         />
    //       </TouchableOpacity>
    //       <TouchableOpacity
    //         onPress={props.onDeletePress}
    //         style={[styles.iconBtn, { backgroundColor: Colors.LIGHT_RED }]}
    //       >
    //         <IconTrash name="delete" color={Colors.WHITE_COLOR} size={25} />
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    // </View>
    <TildView
      degree="4deg"
      tildViewStyle={{
        backgroundColor: Colors.BACKGROUND,
        borderRadius: findSize(15),
      }}
      mainViewStyle={{
        backgroundColor: Colors.TILD_VIEW,
        borderRadius: findSize(15),
      }}
      containerStyle={{ marginVertical: 1 }}
    >
      <TouchableOpacity
        onPress={() => {
          props.onWeekDayPress();
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: findSize(80),
            paddingHorizontal: 15,
          }}
        >
          <Text
            style={{
              fontSize: findSize(17),
              fontFamily: POP_MEDIUM,
              color: Colors.WHITE_COLOR,
              flex: 1,
            }}
          >
            {props.title}
          </Text>
          <CustomButton
            onPress={() => {
              props.onClone();
            }}
            style={{ marginEnd: 15 }}
          >
            <MaterialIcon
              name="content-copy"
              color={Colors.GREEN_COLOR}
              size={20}
            />
          </CustomButton>
          <CustomButton
            onPress={() => {
              props.onDeletePress();
            }}
          >
            <AntDesign name="delete" color={Colors.RED_COLOR} size={20} />
          </CustomButton>
        </View>
      </TouchableOpacity>
    </TildView>
  );
}

export default class Weeks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programDetailsLoading: true,
      startDate: new Date(),
      endDate: new Date().addDays(7),
      exerciseWeeks: [],
      updatingWeeks: false,
      cloneWeekData: "",
    };
    this.annualTrainingProgramDetails();
  }

  annualTrainingProgramDetails = async () => {
    const { navigation } = this.props;
    const PlanData = navigation.getParam("content");
    this.setState({ programDetailsLoading: true });
    try {
      const res = await standardPostApi(
        "annual_training_program_details",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PlanData.planDetails.id,
          training_type: PlanData.training_type,
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({
          startDate: res.data.data.next_start_date,
          endDate: res.data.data.next_end_date,
          exerciseWeeks: res.data.data.weeks,
          programDetailsLoading: false,
          cloneWeekData: res.data.data,
        });
        console.log("annual_training_program_details", res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ programDetailsLoading: false });
  };

  updatePeriodDates = async () => {
    const { startDate } = this.state;
    await this.setState({ endDate: startDate.addDays(7) });
  };

  toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
  };

  convertDate = (date) => {
    return moment(this.toTimestamp(date) * 1000)
      .format("YYYY-MM-DD")
      .toString();
  };

  addNewWeek = async () => {
    const { navigation } = this.props;
    const { startDate, endDate } = this.state;
    const start_date = this.convertDate(startDate);
    const end_date = this.convertDate(endDate);
    const PlanData = navigation.getParam("content");
    try {
      this.setState({ updatingWeeks: true });
      const res = await standardPostApi(
        "annual_training_program_week",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PlanData.planDetails.id,
          training_type: PlanData.training_type,
          annual_training_program_week_start_date: start_date,
          annual_training_program_week_end_date: end_date,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        console.log("new week added ", res.data.data);
        console.log("NextWeekStart ", res.data.data.NextWeekStart);
        this.setState({
          updatingWeeks: false,
          startDate: res.data.data.NextWeekStart,
          endDate: res.data.data.NextWeekEnd,
        });
        this.annualTrainingProgramDetails();
        Toaster(res.data.message, Colors.GREEN_COLOR);
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ updatingWeeks: false });
  };

  cloneWeek = async (week_id) => {
    const { navigation } = this.props;
    const { startDate, endDate, cloneWeekData } = this.state;
    const start_date = this.convertDate(startDate);
    const end_date = this.convertDate(endDate);
    const PlanData = navigation.getParam("content");
    try {
      this.setState({ updatingWeeks: true });
      const res = await standardPostApi(
        "clone_annual_training_program_week",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PlanData.planDetails.id,
          training_type: PlanData.training_type,
          annual_training_program_clone_week_id: week_id,
          annual_training_program_week_start_date:
            cloneWeekData.next_start_date,
          annual_training_program_week_end_date: cloneWeekData.next_end_date,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        console.log("week cloned ", res.data.data);
        this.setState({
          updatingWeeks: false,
          startDate: res.data.data.NextWeekStart,
          endDate: res.data.data.NextWeekEnd,
        });
        this.annualTrainingProgramDetails();
        Toaster(res.data.message, Colors.GREEN_COLOR);
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ updatingWeeks: false });
  };

  removeWeekAlert = (week_id) => {
    return Alert.alert(
      "Delete Period Week",
      "Are you sure you want to delete this period week, this change cannot be undone?",
      [
        { text: "Cancel" },
        {
          text: "Yes",
          onPress: () => this.removeWeek(week_id),
        },
      ]
    );
  };

  removeWeek = async (week_id) => {
    const { navigation } = this.props;
    const PlanData = navigation.getParam("content");
    try {
      this.setState({ updatingWeeks: true });
      const res = await standardPostApi(
        "annual_training_program_week",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PlanData.planDetails.id,
          training_type: PlanData.training_type,
          annual_training_program_week_id: week_id,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        this.setState({ updatingWeeks: false });
        this.annualTrainingProgramDetails();
        Toaster(res.data.message, Colors.GREEN_COLOR);
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ updatingWeeks: false });
  };

  render() {
    const { navigation } = this.props;
    const PlanData = navigation.getParam("content");
    const { programDetailsLoading, startDate, endDate, exerciseWeeks } =
      this.state;
    return (
      <Container
        backFn={() => this.props.navigation.goBack()}
        title={PlanData.displayName}
      >
        <Spinnner visible={this.state.updatingWeeks} />
        {programDetailsLoading ? (
          <Loader />
        ) : (
          <View>
            {/* <View style={styles.weekRow}>
              <Text style={styles.week}>Weeks</Text>
              <View>
                <IconArrow
                  color={Colors.WHITE_COLOR}
                  size={35}
                  name="arrow-down-bold-circle"
                  style={{ marginLeft: 15 }}
                />
              </View>
            </View> */}
            {/* <Text style={styles.heads}>Start Date</Text> */}
            <DatePicker
              dateTimeProps={{
                onChange: async (date) => {
                  await this.setState({
                    startDate: date,
                    endDate: date.addDays(7),
                  });
                },
              }}
              currentDate={startDate}
              minDate={new Date("2020-01-01")}
              maxDate={new Date("2050-01-01")}
            />
            {/* <Text style={styles.heads}>End Date</Text> */}
            <DatePicker
              disabled
              currentDate={endDate}
              minDate={new Date("2020-01-01")}
              maxDate={new Date("2050-01-01")}
            />
            <View style={styles.btnRowContainer}>
              {BUTTONS.map((item) => {
                return (
                  // <PrimeButton
                  //   buttonProps={{
                  //     style: styles.borderedBtns,
                  //     onPress: () => this.addNewWeek(),
                  //   }}
                  //   buttonText={item.btnName}
                  // />
                  <CustomButton
                    type={1}
                    isLoading={false}
                    title={item.btnName}
                    onPress={() => {
                      this.addNewWeek();
                    }}
                  />
                );
              })}
            </View>
            {exerciseWeeks?.length ? (
              <View
                style={{
                  padding: findSize(15),
                  backgroundColor: Colors.VALHALLA,
                  borderRadius: findSize(20),
                  paddingVertical: 30,
                  marginTop: 12,
                }}
              >
                {exerciseWeeks.map((item) => {
                  return (
                    <WeekDay
                      title={item.week_number}
                      onWeekDayPress={() =>
                        this.props.navigation.navigate("Days", {
                          content: {
                            planData: PlanData,
                            weekDetails: item,
                          },
                          refreshFunc: () => {
                            this.annualTrainingProgramDetails();
                          },
                        })
                      }
                      onDeletePress={() => this.removeWeekAlert(item.id)}
                      onClone={() => this.cloneWeek(item.id)}
                    />
                  );
                })}
              </View>
            ) : null}
          </View>
        )}
      </Container>
    );
  }
}
