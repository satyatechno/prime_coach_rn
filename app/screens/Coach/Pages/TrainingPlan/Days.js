import React, { Component } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import Container from "../../../../components/Container";
import { Colors } from "../../../../constants/Colors";
import { standardPostApi } from "../../../../api/ApiWrapper";
import Spinnner from "../../../../components/Spinnner";
import AsyncStorage from "@react-native-community/async-storage";
import PrimeButton from "../../../../components/PrimeButton";
import { styles } from "./Weeks.styles";

import { Toaster } from "../../../../components/Toaster";
import TildView from "../../../../components/tildView/TildView";
import { findSize } from "../../../../utils/helper";
import { POP_MEDIUM } from "../../../../constants/Fonts";
import CustomButton from "../../../../components/customButton/CustomButton";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

const DAYS = [
  { value: "Day 1", id: 1 },
  { value: "Day 2", id: 2 },
  { value: "Day 3", id: 3 },
  { value: "Day 4", id: 4 },
  { value: "Day 5", id: 5 },
  { value: "Day 6", id: 6 },
  { value: "Day 7", id: 7 },
];

export function WeekDay(props) {
  return (
    <TildView
      degree="4deg"
      tildViewStyle={{
        borderRadius: findSize(15),
      }}
      mainViewStyle={{
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

export default class Days extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weekDays: [],
      updatingDays: false,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const WeekData = navigation.getParam("content").weekDetails;
    await this.setState({
      weekDays: WeekData.days,
      daysArray: WeekData.days,
    });
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

  refresher = async (value) => {
    await this.setState({ weekDays: value });
  };

  removeDayAlert = (dayToDelete) => {
    return Alert.alert(
      "Delete Period Day",
      "Are you sure you want to delete this period day, this change cannot be undone?",
      [
        { text: "Cancel" },
        {
          text: "Yes",
          onPress: () => this.addRemoveDayToWeek(dayToDelete),
        },
      ]
    );
  };

  addRemoveDayToWeek = async (day_number) => {
    const { navigation } = this.props;
    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekDetails;
    let current_week_id = WeekData.id;
    try {
      this.setState({ updatingDays: true });
      const res = await standardPostApi(
        "annual_training_program_week_days",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PlanData.planDetails.id,
          training_type: PlanData.training_type,
          annual_training_program_week_id: WeekData.id,
          annual_training_program_week_day: day_number,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        let weeks_array = res.data.data.weeks;
        let current_week = weeks_array.find((item) => {
          return item.id === current_week_id;
        });
        console.log("a new day added ", res.data.data);
        this.setState({
          weekDays: current_week.days,
          updatingDays: false,
        });
        Toaster(res.data.message, Colors.GREEN_COLOR);
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ updatingDays: false });
  };

  cloneDay = async (day_id) => {
    const { navigation } = this.props;
    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekDetails;
    let current_week_id = WeekData.id;
    try {
      this.setState({ updatingDays: true });
      const res = await standardPostApi(
        "clone_annual_training_program_day",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PlanData.planDetails.id,
          training_type: PlanData.training_type,
          annual_training_program_week_id: WeekData.id,
          annual_training_program_clone_day_id: day_id,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        let weeks_array = res.data.data.weeks;
        let current_week = weeks_array.find((item) => {
          return item.id === current_week_id;
        });
        this.setState({
          weekDays: current_week.days,
          updatingDays: false,
        });
        Toaster(res.data.message, Colors.GREEN_COLOR);
        console.log("day cloned ", res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ updatingDays: false });
  };

  render() {
    const { navigation } = this.props;
    const { weekDays } = this.state;
    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekDetails;
    return (
      <>
        <Container
          backFn={() => this.props.navigation.goBack()}
          title={WeekData.week_number}
        >
          <Spinnner visible={this.state.updatingDays} />
          <View>
            {/* <TouchableOpacity onPress={() => this.props.navigation.pop(3)}>
              <Text style={styles.planName}>
                {PlanData.planDetails.name}
                <Text style={styles.seasonName}>
                  {" > "}
                  {PlanData.displayName}
                  {" > "}
                  {WeekData.week_number}
                  {" >> "}
                </Text>
              </Text>
            </TouchableOpacity> */}

            {/* <View style={styles.weekRow}>
              <View>
              <IconArrow
              color={Colors.WHITE_COLOR}
              size={35}
              name="arrow-down-bold-circle"
              style={{ marginLeft: 15 }}
              />
              </View>
            </View> */}
            <Text style={styles.week}>Days</Text>
            <Text style={styles.daysText}>
              Add or remove a week day by selecting a day from the below
              buttons.
            </Text>
            <View style={styles.daysBtnContainer}>
              {DAYS.map((item) => {
                return (
                  // <PrimeButton
                  //   buttonProps={{
                  //     style: [
                  //       styles.borderedBtns,
                  //       { width: 100, marginTop: 0 },
                  //     ],
                  //     onPress: () => this.addRemoveDayToWeek(item.id),
                  //   }}
                  //   buttonText={item.value}
                  // />
                  <CustomButton
                    type={1}
                    isLoading={false}
                    style={{
                      width: findSize(68),
                      height: findSize(38),
                      backgroundColor: Colors.VALHALLA,
                      marginEnd: 10,
                    }}
                    textStyle={{
                      fontSize: findSize(11),
                      color: Colors.WHITE_COLOR,
                    }}
                    title={item.value}
                    onPress={() => {
                      this.addRemoveDayToWeek(item.id);
                    }}
                  />
                );
              })}
            </View>
            <View>
              {weekDays.map((item) => {
                return (
                  <WeekDay
                    onDeletePress={() =>
                      this.removeDayAlert(Number(item.day_number.split(" ")[1]))
                    }
                    onClone={() => this.cloneDay(item.id)}
                    onWeekDayPress={() =>
                      this.props.navigation.navigate("Workouts", {
                        content: {
                          planData: PlanData,
                          weekData: WeekData,
                          dayData: item,
                          weekDays: weekDays,
                        },
                        refreshFunc: (data) => this.refresher(data),
                      })
                    }
                    title={item.day_number}
                  />
                );
              })}
            </View>
          </View>
        </Container>
      </>
    );
  }
}
