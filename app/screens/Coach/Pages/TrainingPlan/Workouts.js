import React, { Component } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import Container from "../../../../components/Container";
import { Colors } from "../../../../constants/Colors";
import IconArrow from "react-native-vector-icons/MaterialCommunityIcons";
import PrimeInput from "../../../../components/PrimeInput";
import { standardPostApi } from "../../../../api/ApiWrapper";
import Spinnner from "../../../../components/Spinnner";
import AsyncStorage from "@react-native-community/async-storage";
import PrimeButton from "../../../../components/PrimeButton";
import { DEV_WIDTH } from "../../../../constants/DeviceDetails";
import Loader from "../../../../components/Loader";
import Select from "../../../../components/Select";
import { styles } from "./Weeks.styles";
import Icon from "react-native-vector-icons/AntDesign";
import { Hr } from "./Weeks";
import { Toaster } from "../../../../components/Toaster";
import CustomInput from "../../../../components/customInput/CustomInput";
import CustomButton from "../../../../components/customButton/CustomButton";
import TildView from "../../../../components/tildView/TildView";
import { findSize } from "../../../../utils/helper";
import { POP_MEDIUM } from "../../../../constants/Fonts";
import AntDesign from "react-native-vector-icons/AntDesign";
import CustomModal from "../../../../components/customModal/CustomModal";

const DESCRIPTION_ERROR = "Please enter a description of the workout.";
const PICKER_ERROR =
  "Please choose a value for both Workout Location and Workout Type.";
const INTENSITY_ERROR = "Intensity field has to be between 1 - 10";

export function TimeChanger(props) {
  return (
    <View style={[styles.iconsView, props && props.style]}>
      <TouchableOpacity onPress={props.onIncrease} style={{ padding: 4 }}>
        <Icon name="caretup" size={20} color={Colors.PLACEHOLDER} />
      </TouchableOpacity>
      <TouchableOpacity style={{ padding: 4 }} onPress={props.onDecrease}>
        <Icon name="caretdown" size={20} color={Colors.PLACEHOLDER} />
      </TouchableOpacity>
    </View>
  );
}

function Workout(props) {
  return (
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
          props.onWorkoutPress();
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
              props.onEditPress();
            }}
            style={{ marginEnd: 15 }}
          >
            <AntDesign name="edit" color={Colors.YELLOW_COLOR} size={20} />
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

export default class Workouts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptionTxt: "",
      intensity: "",
      wrkoutLocation: [],
      wrkoutType: [],
      selectedLocation: null,
      selectedWrkoutType: null,
      pickersLoading: true,
      updatingWorkout: false,
      workouts: [],
      weekDays: [],
      modalVisible: false,
      descriptionTxtEdit: "",
      intensityEdit: "",

      selectedLocationEdit: null,
      selectedWrkoutTypeEdit: null,
      editId: null,
      updating: false,
      customWorkoutType: "",
      customWorkoutTypeEdit: "",
    };
    this.preAtpWrkoutData();
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const DayData = navigation.getParam("content").dayData;
    const WeekDays = navigation.getParam("content").weekDays;
    await this.setState({ workouts: DayData.workout, weekDays: WeekDays });
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc(this.state.weekDays);
  }

  componentWillUnmount() {
    this.goBack();
  }

  refresher = async (value) => {
    await this.setState({ workouts: value });
  };

  preAtpWrkoutData = async () => {
    const { navigation } = this.props;
    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekData;
    const DayData = navigation.getParam("content").dayData;
    try {
      const res = await standardPostApi(
        "pre_add_annual_training_program_workout",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PlanData.planDetails.id,
          training_type: PlanData.training_type,
          annual_training_program_week_id: WeekData.id,
          annual_training_program_week_day_id: DayData.id,
        },
        true,
        false
      );

      if (res.data.code == 301) {
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200 || res.data?.status) {
        // console.log("Data ress", JSON.stringify(res.data, null, 2));
        this.setState({
          wrkoutLocation: res.data.data?.atp_workout?.workout_location,
          wrkoutType: res.data.data?.atp_workout?.workout_type,
          pickersLoading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ pickersLoading: false });
  };

  checkNonEmpty = (action) => {
    const { descriptionTxt } = this.state;
    if (action !== "delete") {
      if (!descriptionTxt.trim().length > 0) {
        Toaster(DESCRIPTION_ERROR, Colors.LIGHT_RED);
        return false;
      }
    }
    return true;
  };

  verifyPickers = (action) => {
    const { selectedLocation, selectedWrkoutType, customWorkoutType } =
      this.state;
    if (action !== "delete") {
      if (selectedLocation === null || selectedWrkoutType === null) {
        Toaster(PICKER_ERROR, Colors.LIGHT_RED);
        return false;
      } else if (selectedWrkoutType == 0 && !customWorkoutType?.trim().length) {
        Toaster("Workout type is required.", Colors.LIGHT_RED);
        return false;
      }
    }
    return true;
  };

  verifyIntensity = (action) => {
    const { intensity } = this.state;
    if (action !== "delete") {
      if (intensity <= 0 || intensity > 10) {
        Toaster(INTENSITY_ERROR, Colors.LIGHT_RED);
        return false;
      }
    }
    return true;
  };

  addRemoveWorkout = async (action, workoutId) => {
    const { navigation } = this.props;
    const {
      descriptionTxt,
      selectedLocation,
      selectedWrkoutType,
      intensity,
      customWorkoutType,
    } = this.state;
    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekData;
    const DayData = navigation.getParam("content").dayData;
    let current_week_id = WeekData.id;
    let current_day_id = DayData.id;
    if (
      (this.checkNonEmpty(action) &&
        this.verifyPickers(action) &&
        this.verifyIntensity(action)) ||
      action === "delete"
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
            annual_training_program_workout_id: workoutId, // Workout id, if workout is to be deleted/updated
            workout_description: action === "delete" ? null : descriptionTxt,
            workout_location: action === "delete" ? null : selectedLocation,
            workout_intensity: action === "delete" ? null : intensity,
            workout_type_id: action === "delete" ? null : selectedWrkoutType,
            customize_workout:
              selectedWrkoutType == 0 ? customWorkoutType : null,
            api_action: action, // Required. Allowed Values : add, update, delete
          },
          true,
          false
        );
        console.log("res data add", JSON.stringify(res.data, null, 2));
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
          if (selectedWrkoutType == 0) {
            this.preAtpWrkoutData();
          }
          Toaster(res.data.message, Colors.GREEN_COLOR);
          this.setState({
            updatingWorkout: false,
            descriptionTxt: "",
            selectedLocation: null,
            selectedWrkoutType: null,
            intensity: 0,
            customWorkoutType: "",
            workouts: current_day.workout,
            weekDays: current_week.days,
          });
          console.log("new wrk added ", res.data.data);
        }
      } catch (error) {
        this.setState({
          updatingWorkout: false,
        });
        console.log(error?.response?.data);
      }
    }
  };

  removeWorkoutAlert = (action, workoutId) => {
    return Alert.alert(
      "Delete Period Workout",
      "Are you sure you want to delete this period workout, this change cannot be undone?",
      [
        { text: "Cancel" },
        {
          text: "Yes",
          onPress: () => this.addRemoveWorkout(action, workoutId),
        },
      ]
    );
  };

  checkNonEmptyEdit = () => {
    const { descriptionTxtEdit } = this.state;
    if (!descriptionTxtEdit.trim().length > 0) {
      Toaster(DESCRIPTION_ERROR, Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  verifyPickersEdit = () => {
    const {
      selectedLocationEdit,
      selectedWrkoutTypeEdit,
      customWorkoutTypeEdit,
    } = this.state;
    if (selectedLocationEdit === null || selectedWrkoutTypeEdit === null) {
      Toaster(PICKER_ERROR, Colors.LIGHT_RED);
      return false;
    } else if (
      selectedWrkoutTypeEdit == 0 &&
      !customWorkoutTypeEdit?.trim().length
    ) {
      Toaster("Workout type is required.", Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  verifyIntensityEdit = () => {
    const { intensityEdit } = this.state;
    if (intensityEdit <= 0 || intensityEdit > 10) {
      Toaster(INTENSITY_ERROR, Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  updateWorkout = async () => {
    const { navigation } = this.props;
    const {
      descriptionTxtEdit,
      selectedLocationEdit,
      selectedWrkoutTypeEdit,
      intensityEdit,
      editId,
      customWorkoutTypeEdit,
    } = this.state;

    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekData;
    const DayData = navigation.getParam("content").dayData;

    let current_week_id = WeekData.id;
    let current_day_id = DayData.id;
    if (
      this.checkNonEmptyEdit() &&
      this.verifyPickersEdit() &&
      this.verifyIntensityEdit()
    ) {
      this.setState({ updating: true });
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
            annual_training_program_workout_id: editId,
            workout_description: descriptionTxtEdit,
            workout_location: selectedLocationEdit,
            workout_intensity: intensityEdit,
            workout_type_id: selectedWrkoutTypeEdit,
            customize_workout:
              selectedWrkoutTypeEdit == 0 ? customWorkoutTypeEdit : null,
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
          if (selectedWrkoutTypeEdit == 0) {
            this.preAtpWrkoutData();
          }
          Toaster(res.data.message, Colors.GREEN_COLOR);
          this.setState({
            workouts: current_day.workout,
            updating: false,
            modalVisible: false,
          });

          console.log("wrk updated ", res.data.data);
        }
      } catch (error) {
        console.log(error);
        this.setState({
          updating: false,
        });
      }
    }
  };

  render() {
    const { navigation } = this.props;
    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekData;
    const DayData = navigation.getParam("content").dayData;
    const {
      intensity,
      wrkoutLocation,
      wrkoutType,
      pickersLoading,
      updatingWorkout,
      workouts,
      modalVisible,
      updating,
      customWorkoutType,
    } = this.state;
    console.log({ wrkoutLocation, wrkoutType });
    return (
      <>
        <Container
          backFn={() => this.props.navigation.goBack()}
          title={DayData.day_number}
        >
          <Spinnner visible={updatingWorkout} />
          {pickersLoading ? (
            <Loader />
          ) : (
            <View>
              <Text style={styles.week}>Workouts</Text>

              <CustomInput
                mainContainerStyle={{ marginVertical: 20 }}
                placeholder={"Description"}
                inputStyle={{ fontSize: 11 }}
                onChangeText={(text) => {
                  this.setState({ descriptionTxt: text });
                }}
                value={this.state.descriptionTxt}
              />

              <Select
                pickerProps={{
                  onValueChange: async (value) => {
                    await this.setState({ selectedLocation: value });
                  },
                }}
                placeholder={"Workout Location"}
                pickerItems={wrkoutLocation}
                pickerValue={this.state.selectedLocation}
              />

              <CustomInput
                mainContainerStyle={{ marginBottom: 20, marginTop: 10 }}
                placeholder={"Intensity"}
                inputStyle={{ fontSize: 11 }}
                onChangeText={(text) => {
                  this.setState({ intensity: Number(text) });
                }}
                value={intensity.toString()}
              />

              <Select
                pickerProps={{
                  onValueChange: async (value) => {
                    await this.setState({ selectedWrkoutType: value });
                  },
                }}
                pickerItems={wrkoutType}
                pickerValue={this.state.selectedWrkoutType}
                placeholder={"Workout Type"}
              />
              {this.state.selectedWrkoutType == 0 ? (
                <CustomInput
                  mainContainerStyle={{ marginBottom: 20, marginTop: 10 }}
                  placeholder={"Workout Type"}
                  inputStyle={{ fontSize: 11 }}
                  onChangeText={(text) => {
                    this.setState({ customWorkoutType: text });
                  }}
                  value={customWorkoutType}
                />
              ) : null}
              <CustomButton
                type={1}
                title={"Add New Workout"}
                onPress={() => {
                  if (workouts?.length == 0) {
                    this.addRemoveWorkout("add", null);
                  } else {
                    Toaster(
                      "You can add only single workout for a single day.",
                      Colors.LIGHT_RED
                    );
                  }
                }}
              />
              {workouts?.length ? (
                <View
                  style={{
                    padding: findSize(15),
                    backgroundColor: Colors.VALHALLA,
                    borderRadius: findSize(20),
                    paddingVertical: 30,
                    marginTop: 12,
                  }}
                >
                  {workouts.map((item) => {
                    return (
                      <Workout
                        title={item.name}
                        onEditPress={() => {
                          console.log("workout Item", item);
                          // this.props.navigation.navigate("EditWorkout", {
                          //   content: {
                          //     workoutDetails: item,
                          //     planData: PlanData,
                          //     weekData: WeekData,
                          //     dayData: DayData,
                          //     wrkoutLocation: wrkoutLocation,
                          //     wrkoutType: wrkoutType,
                          //     workouts: workouts,
                          //   },
                          //   refreshFunc: (data) => this.refresher(data),
                          // });
                          this.setState({
                            editId: item?.id,
                            descriptionTxtEdit: item?.name,
                            intensityEdit: item?.intensity,
                            selectedLocationEdit: wrkoutLocation?.find(
                              (x) => x?.label == item?.location
                            )?.value,
                            selectedWrkoutTypeEdit: wrkoutType?.find(
                              (x) => x?.label == item?.type
                            )?.value,
                            modalVisible: true,
                          });
                        }}
                        onDeletePress={() => {
                          this.removeWorkoutAlert("delete", item.id);
                        }}
                        onWorkoutPress={() =>
                          this.props.navigation.navigate("WorkoutGroup", {
                            content: {
                              workoutDetails: item,
                              planData: PlanData,
                              weekData: WeekData,
                              dayData: DayData,
                              workouts: workouts,
                            },
                            refreshFunc: (data) => this.refresher(data),
                          })
                        }
                      />
                    );
                  })}
                </View>
              ) : null}
            </View>
          )}
        </Container>
        <CustomModal
          isVisible={modalVisible}
          onClose={() => {
            this.setState({
              modalVisible: false,
            });
          }}
        >
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              fontFamily: POP_MEDIUM,
              fontSize: findSize(21),
              textAlign: "center",
            }}
          >
            Edit Workout
          </Text>
          <CustomInput
            mainContainerStyle={{ marginVertical: 20 }}
            placeholder={"Description"}
            inputStyle={{ fontSize: 11 }}
            onChangeText={(text) => {
              this.setState({ descriptionTxtEdit: text });
            }}
            value={this.state.descriptionTxtEdit}
          />

          <Select
            pickerProps={{
              onValueChange: async (value) => {
                this.setState({ selectedLocationEdit: value });
              },
            }}
            placeholder={"Workout Location"}
            pickerItems={wrkoutLocation}
            pickerValue={this.state.selectedLocationEdit}
          />

          <CustomInput
            mainContainerStyle={{ marginBottom: 20, marginTop: 10 }}
            placeholder={"Intensity"}
            inputStyle={{ fontSize: 11 }}
            onChangeText={(text) => {
              this.setState({ intensityEdit: Number(text) });
            }}
            value={this.state.intensityEdit.toString()}
          />

          <Select
            pickerProps={{
              onValueChange: async (value) => {
                this.setState({ selectedWrkoutTypeEdit: value });
              },
            }}
            pickerItems={wrkoutType}
            pickerValue={this.state.selectedWrkoutTypeEdit}
            placeholder={"Workout Type"}
          />

          {this.state.selectedWrkoutTypeEdit == 0 ? (
            <CustomInput
              mainContainerStyle={{ marginBottom: 20, marginTop: 10 }}
              placeholder={"Workout Type"}
              inputStyle={{ fontSize: 11 }}
              onChangeText={(text) => {
                this.setState({ customWorkoutTypeEdit: text });
              }}
              value={this.state.customWorkoutTypeEdit}
            />
          ) : null}
          <CustomButton
            isLoading={updating}
            type={1}
            title={"Save"}
            onPress={() => {
              this.updateWorkout();
            }}
          />
        </CustomModal>
      </>
    );
  }
}
