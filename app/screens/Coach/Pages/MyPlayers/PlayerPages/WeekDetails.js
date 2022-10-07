import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Container from "../../../../../components/Container";
import PrimeButton from "../../../../../components/PrimeButton";
import Loader from "../../../../../components/Loader";
import { Toaster } from "../../../../../components/Toaster";
import { Colors } from "../../../../../constants/Colors";
import { DEV_WIDTH, DEV_HEIGHT } from "../../../../../constants/DeviceDetails";
import {
  ROBO_REGULAR,
  ROBO_BOLD,
  POP_REGULAR,
  POP_MEDIUM,
} from "../../../../../constants/Fonts";
import { standardPostApi } from "../../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import { Day } from "../../../../Athlete/Pages/Workouts/AssignedWorkouts";
import Select from "../../../../../components/Select";
import TildView from "../../../../../components/tildView/TildView";
import { findSize } from "../../../../../utils/helper";
import CustomButton from "../../../../../components/customButton/CustomButton";

export default class WeekDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weeksLoading: true,
      allWeeks: [],
      pickerArray: [],
      selectedPickerValue: null,
      selectedWeek: null,
    };
    this.fetchAlleeks();
  }

  fetchAlleeks = async () => {
    const { navigation } = this.props;
    const PlayerData = navigation.getParam("content").playerDetails;
    const PageDetails = navigation.getParam("content").buttonDetails;
    this.setState({ weeksLoading: true });
    try {
      const res = await standardPostApi(
        "list_athlete_workout",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          access_user_id: PlayerData.id,
          access_training_type: PageDetails.training_type,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        this.setState({ currentWeek: undefined });
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        let plans_array = res.data.data;
        let current_plan =
          plans_array && plans_array.length > 1
            ? plans_array.find((item) => {
                return item.annual_program_completed === false;
              })
            : plans_array.find((item) => {
                return item;
              });
        let all_complete_plans = plans_array.filter((item) => {
          return item.annual_program_completed == true;
        });
        all_complete_plans.length === plans_array.length
          ? (current_plan = plans_array[plans_array.length - 1])
          : null;
        current_plan === undefined ? (current_plan = null) : current_plan;
        // let weeks_array = current_plan.weeks && current_plan.weeks;
        // let current_week =
        //   weeks_array && weeks_array.length > 1
        //     ? weeks_array.find((item) => {
        //         return item.week_completed === false;
        //       })
        //     : weeks_array.find((item) => {
        //         return item;
        //       });
        // let all_complete_weeks = weeks_array.filter((item) => {
        //   return item.week_completed == true;
        // });
        // all_complete_weeks.length === weeks_array.length
        //   ? (current_week = weeks_array[weeks_array.length - 1])
        //   : null;
        // current_week === undefined ? (current_week = null) : current_week;
        await this.setState({
          weeksLoading: false,
          allWeeks: current_plan.weeks,
          // plans_array: current_plan.weeks?.,
          selectedWeek: current_plan?.weeks?.[0]?.id ?? null,
          selectedWeek: current_plan?.weeks?.[0],
        });
        console.log("all weeks ", this.state.allWeeks);
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ weeksLoading: false });
  };

  render() {
    const { navigation } = this.props;
    const {
      allWeeks,
      weeksLoading,
      selectedWeek,
      pickerArray,
      selectedPickerValue,
    } = this.state;
    const PlayerData = navigation.getParam("content").playerDetails;
    const TeamData = navigation.getParam("content").teamDetails;
    const PageDetails = navigation.getParam("content").buttonDetails;
    console.log("picke array", pickerArray, selectedPickerValue);
    return (
      <Container
        backFn={() => this.props.navigation.goBack()}
        title={PageDetails.displayName}
      >
        {weeksLoading ? (
          <Loader />
        ) : (
          <View>
            <Select
              containerStyle={{
                borderColor: Colors.WHITE_COLOR,
                borderWidth: 1,
                backgroundColor: Colors.BACKGROUND,
              }}
              pickerProps={{
                onValueChange: async (value) => {
                  this.setState({
                    selectedPickerValue: value,
                    selectedWeek: allWeeks?.find((x) => x.id == value),
                  });
                },
              }}
              pickerItems={allWeeks?.map((x) => ({
                label: x?.week_number,
                value: x?.id,
                id: x?.id,
              }))}
              pickerValue={this.state.selectedPickerValue}
              placeholder={"Select Week"}
            />
            {selectedWeek?.days?.length > 0 ? (
              selectedWeek?.days?.map((day) => {
                return (
                  // <PrimeButton
                  //   buttonProps={{
                  //     style: {
                  //       backgroundColor: "#5c8ac3",
                  //     },
                  //     onPress: () => {
                  //       this.props.navigation.navigate("DayDetails", {
                  //         content: {
                  //           playerDetails: PlayerData,
                  //           teamDetails: TeamData,
                  //           buttonDetails: PageDetails,
                  //           weekDetails: item,
                  //         },
                  //       });
                  //     },
                  //   }}
                  //   buttonText={item.day_number}
                  //   indiColor={Colors.SKY_COLOR}
                  // />

                  // <Day
                  //   dayWorkCompleted={day.day_workout_complete}
                  //   day_title={day.day_number}
                  //   hideStartBtn={true}

                  //   onView={() =>
                  //     this.props.navigation.navigate("ViewWorkout", {
                  //       exportBtn: true,
                  //       content: {
                  //         dayDetails: day,
                  //         weekDetails: selectedWeek,
                  //         programDetails: {
                  //           id: selectedWeek?.annual_training_program_id,
                  //         },
                  //       },
                  //     })
                  //   }
                  // />
                  <TildView
                    key={day?.id}
                    degree="4deg"
                    mainViewStyle={{ borderRadius: 10 }}
                    tildViewStyle={{ borderRadius: 10 }}
                    containerStyle={{ marginVertical: 1 }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 15,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontSize: findSize(15),
                          fontFamily: POP_MEDIUM,
                          color: Colors.WHITE_COLOR,
                        }}
                      >
                        {day?.day_number}
                      </Text>

                      <CustomButton
                        onPress={() => {
                          this.props.navigation.navigate("ViewWorkout", {
                            exportBtn: true,
                            content: {
                              dayDetails: day,
                              weekDetails: selectedWeek,
                              programDetails: {
                                id: selectedWeek?.annual_training_program_id,
                              },
                            },
                          });
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.ORANGE,
                            fontFamily: POP_REGULAR,
                            fontSize: findSize(16),
                            padding: 10,
                          }}
                        >
                          View Workout
                        </Text>
                      </CustomButton>
                    </View>
                  </TildView>
                );
              })
            ) : (
              <Text style={styles.noWorkouts}>
                You do not have any workouts assigned in{" "}
                {PageDetails.displayName}.
              </Text>
            )}
          </View>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  teamName: {
    color: Colors.SKY_COLOR,
    fontFamily: ROBO_REGULAR,
    fontSize: 18,
  },
  playerName: {
    color: Colors.WHITE_COLOR,
    fontSize: 18,
    fontFamily: ROBO_REGULAR,
  },
  noWorkouts: {
    marginTop: 50,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    textAlign: "center",
    fontSize: 16,
  },
});
