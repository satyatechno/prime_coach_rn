import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";
import { Colors } from "../../../constants/Colors";
import { ROBO_BOLD, ROBO_REGULAR } from "../../../constants/Fonts";
import Modall from "../../../components/Modall";
import PrimeInput from "../../../components/PrimeInput";
import Select from "../../../components/Select";
import { standardPostApi } from "../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import { TimeChanger } from "../Pages/TrainingPlan/Workouts";
import { Toaster } from "../../../components/Toaster";

const DESCRIPTION_ERROR = "Please enter a description of the workout.";
const PICKER_ERROR =
  "Please choose a value for both Workout Location and Workout Type.";
const INTENSITY_ERROR = "Intensity field has to be between 1 - 10";

export default class AddTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intensity: 0,
      descriptionTxt: "",
      updatingWorkout: false,
      selectedLocation: null,
      selectedWrkoutType: null,
      workouts: [],
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const WorkoutData = navigation.getParam("content").workoutDetails;
    const Workouts = navigation.getParam("content").workouts;
    await this.setState({
      selectedLocation: WorkoutData.location === "Gym" ? 2 : 1,
      selectedWrkoutType: WorkoutData.type.toLowerCase(),
      intensity: WorkoutData.intensity,
      descriptionTxt: WorkoutData.name,
      workouts: Workouts,
    });
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc(this.state.workouts);
  }

  checkNonEmpty = () => {
    const { descriptionTxt } = this.state;
    if (!descriptionTxt.trim().length > 0) {
      Toaster(DESCRIPTION_ERROR, Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  verifyPickers = () => {
    const { selectedLocation, selectedWrkoutType } = this.state;
    if (selectedLocation === null || selectedWrkoutType === null) {
      Toaster(PICKER_ERROR, Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  verifyIntensity = () => {
    const { intensity } = this.state;
    if (intensity <= 0 || intensity > 10) {
      Toaster(INTENSITY_ERROR, Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  updateWorkout = async () => {
    const { navigation } = this.props;
    const {
      descriptionTxt,
      selectedLocation,
      selectedWrkoutType,
      intensity,
    } = this.state;
    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekData;
    const DayData = navigation.getParam("content").dayData;
    const WorkoutData = navigation.getParam("content").workoutDetails;
    let current_week_id = WeekData.id;
    let current_day_id = DayData.id;
    if (
      this.checkNonEmpty() &&
      this.verifyPickers() &&
      this.verifyIntensity()
    ) {
      this.setState({ updatingWorkout: true });
      try {
        const res = await standardPostApi(
          "annual_training_program_workout",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            annual_training_program_id: PlanData.planDetails.id,
            training_type: PlanData.training_type,
            annual_training_program_week_id: WeekData.id,
            annual_training_program_week_day_id: DayData.id,
            annual_training_program_workout_id: WorkoutData.id,
            workout_description: descriptionTxt,
            workout_location: selectedLocation,
            workout_intensity: intensity,
            workout_type: selectedWrkoutType,
            api_action: "update",
          },
          true,
          false
        );
        if (res.data.code == 301) {
          this.setState({ updatingWorkout: false });
          Toaster(res.data.message, Colors.LIGHT_RED);
        }
        if (res.data.code == 200) {
          let weeks_array = res.data.data.weeks;
          let current_week = weeks_array.find((item) => {
            return item.id === current_week_id;
          });
          let days_array = current_week.days;
          let current_day = days_array.find((item) => {
            return item.id === current_day_id;
          });
          Toaster(res.data.message, Colors.GREEN_COLOR);
          this.setState({
            workouts: current_day.workout,
            updatingWorkout: false,
          });
          this.goBack();
          console.log("wrk updated ", res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  render() {
    const { navigation } = this.props;
    const WorkoutLocation = navigation.getParam("content").wrkoutLocation
      .pickerArray;
    const WorkoutType = navigation.getParam("content").wrkoutType.pickerArray;
    const { intensity, selectedLocation, selectedWrkoutType } = this.state;
    return (
      <Modall
        crossPress={() => this.goBack()}
        savePress={() => this.updateWorkout()}
        btnTxt={"Save"}
        title={"Workout Edit Window"}
        loading={this.state.updatingWorkout}
      >
        <Text style={styles.heads}>Description</Text>
        <PrimeInput
          inputProps={{
            onChangeText: (text) => {
              this.setState({ descriptionTxt: text });
            },
            style: { marginBottom: 15 },
            value: this.state.descriptionTxt,
          }}
          noAnimation={true}
        />
        <Text style={styles.heads}>Workout Location</Text>
        <Select
          pickerProps={{
            onValueChange: async (value) => {
              await this.setState({ selectedLocation: value });
            },
          }}
          pickerItems={WorkoutLocation}
          pickerValue={selectedLocation}
        />
        <Text style={styles.heads}>Intensity</Text>
        <PrimeInput
          inputProps={{
            onChangeText: (text) => {
              this.setState({ intensity: Number(text) });
            },
            style: { marginBottom: 15 },
            keyboardType: "number-pad",
            value: this.state.intensity.toString(),
          }}
          noAnimation={true}
        />
        <TimeChanger
          style={{ top: 197 }}
          onIncrease={() => this.setState({ intensity: intensity + 1 })}
          onDecrease={() => this.setState({ intensity: intensity - 1 })}
        />
        <Text style={styles.heads}>Workout Type</Text>
        <Select
          pickerProps={{
            onValueChange: async (value) => {
              await this.setState({ selectedWrkoutType: value });
            },
          }}
          pickerItems={WorkoutType}
          pickerValue={selectedWrkoutType}
        />
      </Modall>
    );
  }
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR,
    justifyContent: "center",
    paddingHorizontal: "4%",
  },
  heads: {
    fontSize: 15,
    fontFamily: ROBO_BOLD,
    marginBottom: 5,
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
