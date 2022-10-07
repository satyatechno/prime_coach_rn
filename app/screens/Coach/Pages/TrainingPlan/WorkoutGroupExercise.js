import React, { Component } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import Container from "../../../../components/Container";
import { Colors } from "../../../../constants/Colors";
import IconArrow from "react-native-vector-icons/MaterialCommunityIcons";
import { standardPostApi } from "../../../../api/ApiWrapper";
import Spinnner from "../../../../components/Spinnner";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../../../../components/Loader";
import { styles } from "./Weeks.styles";
import { Hr } from "./Weeks";
import { ExerciseSelector } from "../../components/ExerciseSelector";
import { Toaster } from "../../../../components/Toaster";
import Icon from "react-native-vector-icons/AntDesign";
import IconWarn from "react-native-vector-icons/Ionicons";
import IconCheck from "react-native-vector-icons/MaterialCommunityIcons";
import {
  ROBO_BOLD,
  ROBO_REGULAR,
  ROBO_ITALIC,
  POP_REGULAR,
  POP_MEDIUM,
} from "../../../../constants/Fonts";
import Select from "../../../../components/Select";
import CustomInput from "../../../../components/customInput/CustomInput";
import { CheckBox } from "../../Modals/CreateEditProtocol";
import { findSize } from "../../../../utils/helper";
import { DEV_WIDTH } from "../../../../constants/DeviceDetails";
import CustomButton from "../../../../components/customButton/CustomButton";
import CustomModal from "../../../../components/customModal/CustomModal";

const RepetitionPicker = [
  { label: "Repetition", value: "repetition" },
  { label: "Minutes", value: "minutes" },
  { label: "Seconds", value: "seconds" },
];
export default class WorkoutGroupExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoading: true,
      workoutExercisePickerData: null,
      sets: "",
      rest: "",
      reps: "",
      load: "",
      exerciseName: "",
      selectedRepetitionType: null,
      repsEachSide: "0",
      loadRequired: "0",
      updating: false,
      workoutExerciseId: null,
      workoutGroupExercises: [],
      workoutGroups: [],
      expanded: [],
      exerciseLimit: 0,
      exerciseLoading: false,

      exercisePickerData: [],
      selectedExerciseGroup: null,
      selectedExercise: null,
      modalVisible: false,

      selectedExerciseGroupEdit: null,
      selectedExerciseEdit: null,
      setsEdit: "",
      restEdit: "",
      repsEdit: "",
      loadEdit: "",
      exerciseNameEdit: "",
      selectedRepetitionTypeEdit: null,
      repsEachSideEdit: "0",
      loadRequiredEdit: "0",
      editId: null,
    };
    this.fetchExerciseData();
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc(this.state.workoutGroups);
  }

  componentWillUnmount() {
    this.goBack();
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const WorkoutGroupData = navigation.getParam("content").workoutGroupData;
    const WorkoutGroups = navigation.getParam("content").workoutGroups;
    const SET_TYPE = WorkoutGroupData.group_set_type;
    console.log("workout data", JSON.stringify(WorkoutGroupData, null, 2));
    await this.setState({
      workoutGroupExercises: WorkoutGroupData.workout_group_exercise,
      workoutGroups: WorkoutGroups,
      exerciseLimit: WorkoutGroupData?.number_of_exercise,
      // exerciseLimit:
      //   SET_TYPE === "Procedural"
      //     ? 1
      //     : SET_TYPE === "Super Set"
      //     ? 2
      //     : SET_TYPE === "Triset"
      //     ? 3
      //     : 4,
    });
    if (Number(WorkoutGroupData.number_of_exercise) > 1) {
      await this.setState({
        sets: WorkoutGroupData.group_sets.toString(),
        rest: WorkoutGroupData.group_rest.toString(),
      });
    }
  }

  toggleRepsEachSide = async () => {
    await this.setState({
      repsEachSide: this.state.repsEachSide === "0" ? "1" : "0",
    });
  };

  toggleLoadRequired = async () => {
    await this.setState({
      loadRequired: this.state.loadRequired === "0" ? "1" : "0",
    });
  };

  refresher = async (value, id) => {
    await this.setState({ exerciseName: value, workoutExerciseId: id });
  };

  fetchExerciseData = async () => {
    const { navigation } = this.props;
    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekData;
    const DayData = navigation.getParam("content").dayData;
    const WorkoutData = navigation.getParam("content").workoutDetails;
    const WorkoutGroupData = navigation.getParam("content").workoutGroupData;
    this.setState({ dataLoading: true });
    try {
      const res = await standardPostApi(
        "pre_annual_training_program_workout_group_exercise",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PlanData.planDetails.id,
          training_type: PlanData.training_type,
          annual_training_program_week_id: WeekData.id,
          annual_training_program_week_day_id: DayData.id,
          annual_training_program_workout_id: WorkoutData.id,
          annual_training_program_workout_group_id: WorkoutGroupData.id,
          exercise_group_id: null,
        },
        true,
        true
      );
      if (res.data.code == 200) {
        this.setState({
          workoutExercisePickerData: res.data.data.WorkoutExerciseGroup,
          dataLoading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ dataLoading: false });
  };

  validateExerciseName = (action, name) => {
    const { selectedExercise, selectedExerciseGroup } = this.state;
    if (action !== "delete") {
      if (!selectedExerciseGroup || selectedExerciseGroup == null) {
        Toaster("Please select an Exercise Group.", Colors.LIGHT_RED);
        return false;
      } else if (!selectedExercise || selectedExercise == null) {
        Toaster("Please select an Exercise.", Colors.LIGHT_RED);
        return false;
      }
    }
    return true;
  };
  validateExerciseNameEdit = (action) => {
    const { selectedExerciseEdit, selectedExerciseGroupEdit } = this.state;
    if (action !== "delete") {
      if (!selectedExerciseGroupEdit || selectedExerciseGroupEdit == null) {
        Toaster("Please select an Exercise Group.", Colors.LIGHT_RED);
        return false;
      } else if (!selectedExerciseEdit || selectedExerciseEdit == null) {
        Toaster("Please select an Exercise.", Colors.LIGHT_RED);
        return false;
      }
    }
    return true;
  };
  checkNonEmpty = (action, text, field) => {
    if (action !== "delete") {
      if (!text.trim().length > 0) {
        Toaster(
          `Please fill in a value for ${field}. or fill 0 for no value.`,
          Colors.LIGHT_RED
        );
        return false;
      }
    }
    return true;
  };
  checkLoadEmpty = (action, text, field, required) => {
    if (action !== "delete") {
      if (!text.trim().length > 0 && required === "1") {
        Toaster(
          `Please fill in a value for ${field}. or fill 0 for no value.`,
          Colors.LIGHT_RED
        );
        return false;
      }
    }
    return true;
  };
  verifyPicker = (action) => {
    const { selectedRepetitionType } = this.state;
    if (action !== "delete") {
      if (selectedRepetitionType === null) {
        Toaster(
          "Please select a value for Repetiotion Type.",
          Colors.LIGHT_RED
        );
        return false;
      }
    }
    return true;
  };
  verifyPickerEdit = () => {
    const { selectedRepetitionTypeEdit } = this.state;

    if (selectedRepetitionTypeEdit === null) {
      Toaster("Please select a value for Repetiotion Type.", Colors.LIGHT_RED);
      return false;
    }

    return true;
  };

  removeWorkoutGroupExerciseAlert = async (action, workoutGrpExerId) => {
    return Alert.alert(
      "Delete Workout Exercise",
      "Are you sure you want to delete this workout exercise?",
      [
        { text: "Cancel" },
        {
          text: "Yes",
          onPress: () => this.cudWorkoutGroupExercise(action, workoutGrpExerId),
        },
      ]
    );
  };

  cudWorkoutGroupExercise = async (action, workoutGrpExerId) => {
    const { navigation } = this.props;
    const {
      workoutExerciseId,
      reps,
      load,
      sets,
      rest,
      selectedRepetitionType,
      repsEachSide,
      loadRequired,
      exerciseName,
      selectedExercise,
      selectedExerciseGroup,
    } = this.state;
    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekData;
    const DayData = navigation.getParam("content").dayData;
    const WorkoutData = navigation.getParam("content").workoutDetails;
    const WorkoutGroupData = navigation.getParam("content").workoutGroupData;
    let current_week_id = WeekData.id;
    let current_day_id = DayData.id;
    let current_workout_group_id = WorkoutGroupData.id;
    if (
      this.validateExerciseName(action) &&
      this.checkNonEmpty(action, reps, "Reps") &&
      this.checkLoadEmpty(action, load, "Load", loadRequired) &&
      this.verifyPicker(action) &&
      this.checkNonEmpty(action, sets, "Sets") &&
      this.checkNonEmpty(action, rest, "Rest")
    ) {
      this.setState({ updating: true });
      try {
        const res = await standardPostApi(
          "annual_training_program_workout_group_exercise",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            annual_training_program_id: PlanData.planDetails.id,
            training_type: PlanData.training_type,
            annual_training_program_week_id: WeekData.id,
            annual_training_program_week_day_id: DayData.id,
            annual_training_program_workout_id: WorkoutData.id,
            annual_training_program_workout_group_id: WorkoutGroupData.id,
            annual_training_program_workout_group_exercise_id:
              selectedExerciseGroup,
            workout_exercise: selectedExercise,
            workout_reps: reps,
            workout_load: loadRequired === "1" ? load : "0",
            workout_load_required: loadRequired,
            workout_reps_each_side: repsEachSide,
            workout_repetition_type: selectedRepetitionType,
            workout_sets: sets,
            workout_rest: rest,
            api_action: action,
          },
          true,
          false
        );
        console.log("res", res.data);
        if (res.data.code == 301) {
          this.setState({ updating: false });
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
          let workout_group_array = current_day.workout[0].workout_group;
          console.log("workout group exercise cud ", res.data.data);
          let current_workout_group = workout_group_array.find((item) => {
            return item.id === current_workout_group_id;
          });
          Toaster(res.data.message, Colors.GREEN_COLOR);
          this.setState({
            exerciseName: "",
            reps: "",
            load: "",
            sets:
              Number(WorkoutGroupData.number_of_exercise) > 1
                ? WorkoutGroupData.group_sets.toString()
                : "",
            rest:
              Number(WorkoutGroupData.number_of_exercise) > 1
                ? WorkoutGroupData.group_rest.toString()
                : "",
            workoutGroupExercises: current_workout_group.workout_group_exercise,
            workoutGroups: workout_group_array,
            updating: false,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  updateWorkoutGroupExercise = async (action = "update") => {
    const { navigation } = this.props;
    const {
      workoutGroupExercises,
      selectedExerciseGroupEdit,
      selectedExerciseEdit,
      setsEdit,
      restEdit,
      repsEdit,
      loadEdit,
      exerciseNameEdit,
      selectedRepetitionTypeEdit,
      repsEachSideEdit,
      loadRequiredEdit,
      editId,
    } = this.state;

    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekData;
    const DayData = navigation.getParam("content").dayData;
    const WorkoutData = navigation.getParam("content").workoutDetails;
    const WorkoutGroupData = navigation.getParam("content").workoutGroupData;
    let current_week_id = WeekData.id;
    let current_day_id = DayData.id;
    let current_workout_group_id = WorkoutGroupData.id;
    if (
      this.validateExerciseNameEdit(action) &&
      this.checkNonEmpty(action, repsEdit, "Reps") &&
      this.checkLoadEmpty(action, loadEdit, "Load", loadRequiredEdit) &&
      this.checkNonEmpty(action, setsEdit, "Sets") &&
      this.checkNonEmpty(action, restEdit, "Rest") &&
      this.verifyPickerEdit()
    ) {
      this.setState({ updating: true });

      try {
        const res = await standardPostApi(
          "annual_training_program_workout_group_exercise",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            annual_training_program_id: PlanData.planDetails.id.toString(),
            training_type: PlanData.training_type,
            annual_training_program_week_id: WeekData.id.toString(),
            annual_training_program_week_day_id: DayData.id.toString(),
            annual_training_program_workout_id: WorkoutData.id.toString(),
            annual_training_program_workout_group_id:
              WorkoutGroupData.id.toString(),
            annual_training_program_workout_group_exercise_id:
              editId.toString(),
            workout_exercise: selectedExerciseEdit,
            workout_reps: repsEdit,
            workout_load: loadRequiredEdit === "1" ? loadEdit : 0,
            workout_load_required: loadRequiredEdit,
            workout_reps_each_side: repsEachSideEdit,
            workout_repetition_type: selectedRepetitionTypeEdit.toLowerCase(),
            workout_sets: setsEdit,
            workout_rest: restEdit,
            api_action: "update",
          },
          true,
          false
        );
        if (res.data.code == 301) {
          this.setState({ updating: false });
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
          let workout_group_array = current_day.workout[0].workout_group;
          console.log("workout group exercise cud ", res.data.data);
          let current_workout_group = workout_group_array.find((item) => {
            return item.id === current_workout_group_id;
          });
          Toaster(res.data.message, Colors.GREEN_COLOR);
          this.setState({
            exerciseName: "",
            reps: "",
            load: "",
            sets:
              Number(WorkoutGroupData.number_of_exercise) > 1
                ? WorkoutGroupData.group_sets.toString()
                : "",
            rest:
              Number(WorkoutGroupData.number_of_exercise) > 1
                ? WorkoutGroupData.group_rest.toString()
                : "",
            workoutGroupExercises: current_workout_group.workout_group_exercise,
            workoutGroups: workout_group_array,
            updating: false,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ updating: false, modalVisible: false });
      }
    }
  };

  toggleExpand = (index) => {
    this.setState({ expanded: [index] });
  };
  updateValues = async (index, field, value) => {
    const { workoutGroupExercises } = this.state;

    workoutGroupExercises[index][field] = value;

    await this.setState({ workoutGroupExercises });
  };

  fetchExercises = async (exer_grp_id) => {
    const { navigation } = this.props;
    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekData;
    const DayData = navigation.getParam("content").dayData;
    const WorkoutData = navigation.getParam("content").workoutDetails;
    const WorkoutGroupData = navigation.getParam("content").workoutGroupData;
    try {
      this.setState({ exerciseLoading: true });
      const res = await standardPostApi(
        "pre_annual_training_program_workout_group_exercise",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PlanData.planDetails.id,
          training_type: PlanData.training_type,
          annual_training_program_week_id: WeekData.id,
          annual_training_program_week_day_id: DayData.id,
          annual_training_program_workout_id: WorkoutData.id,
          annual_training_program_workout_group_id: WorkoutGroupData.id,
          exercise_group_id: exer_grp_id,
        },
        true,
        true
      );

      if (res.data.code == 301) {
        this.setState({ exerciseLoading: false });
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        let initial_data = res.data.data.WorkoutExercises;
        let table_data = [];

        this.setState({
          exerciseLoading: false,
          exercisePickerData: res.data.data.WorkoutExercises.map((item) => ({
            ...item,
            label: item?.exercise,
            value: item?.id,
          })),
        });
      }
    } catch (error) {
      this.setState({ exerciseLoading: false });
      console.log(error);
    }
  };

  render() {
    const { navigation } = this.props;
    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekData;
    const DayData = navigation.getParam("content").dayData;
    const WorkoutData = navigation.getParam("content").workoutDetails;
    const WorkoutGroupData = navigation.getParam("content").workoutGroupData;
    // console.log("WorkoutGroupData", WorkoutGroupData);

    const {
      workoutGroupExercises,
      dataLoading,
      workoutExercisePickerData,
      exerciseName,
      selectedRepetitionType,
      repsEachSide,
      loadRequired,
      updating,
      reps,
      load,
      sets,
      rest,
      selectedExerciseGroup,
      exercisePickerData,
      exerciseLoading,
      selectedExercise,
      modalVisible,
      selectedExerciseGroupEdit,
      selectedExerciseEdit,
      setsEdit,
      restEdit,
      repsEdit,
      loadEdit,
      exerciseNameEdit,
      selectedRepetitionTypeEdit,
      repsEachSideEdit,
      loadRequiredEdit,
    } = this.state;
    return (
      <>
        <Container
          backFn={() => this.props.navigation.goBack()}
          title={WorkoutData.name}
        >
          <Spinnner visible={updating || exerciseLoading} />
          {dataLoading ? (
            <Loader />
          ) : (
            <View>
              <View style={styles.warningContainer}>
                {workoutGroupExercises.length == this.state.exerciseLimit ? (
                  <>
                    <IconCheck
                      name="check-decagram"
                      color={Colors.GREEN_COLOR}
                      size={25}
                    />
                    <Text
                      style={[styles.warningTxt, { color: Colors.GREEN_COLOR }]}
                    >
                      You have added the required number of exercises in this
                      group. You can not add more to it.
                    </Text>
                  </>
                ) : (
                  <>
                    <IconWarn
                      name="ios-warning"
                      color={Colors.LIGHT_RED}
                      size={25}
                    />
                    <Text style={styles.warningTxt}>
                      Please add{" "}
                      <Text
                        style={{
                          fontFamily: ROBO_BOLD,
                          fontSize: 18,
                        }}
                      >
                        {this.state.exerciseLimit}
                      </Text>{" "}
                      exercise in this exercise group.
                    </Text>
                  </>
                )}
              </View>
              <View>
                <Text style={styles.week}>
                  {WorkoutGroupData.group_name} -{" "}
                  {WorkoutGroupData.group_set_type}
                </Text>
              </View>
              {Number(WorkoutGroupData.number_of_exercise) > 1 && (
                <Text style={styles.setsRest}>
                  Sets {WorkoutGroupData.group_sets} Rest{" "}
                  {WorkoutGroupData.group_rest} sec
                </Text>
              )}

              <Select
                pickerProps={{
                  onValueChange: async (value) => {
                    if (value) {
                      this.fetchExercises(value);
                    } else {
                      this.setState;
                    }
                    this.setState({
                      selectedExerciseGroup: value,
                      selectedExercise: null,
                    });
                  },
                }}
                placeholder={"Select Exercise Group"}
                pickerItems={workoutExercisePickerData?.pickerArray ?? []}
                pickerValue={selectedExerciseGroup}
              />
              <View
                style={{
                  marginVertical: 10,
                }}
              >
                <Select
                  pickerProps={{
                    onValueChange: async (value) => {
                      this.setState({ selectedExercise: value });
                    },
                  }}
                  placeholder={"Select Exercise"}
                  pickerItems={exercisePickerData ?? []}
                  pickerValue={selectedExercise}
                />
              </View>
              <CustomInput
                mainContainerStyle={{}}
                placeholder={"Reps"}
                inputStyle={{ fontSize: 11 }}
                onChangeText={(text) => {
                  this.setState({ reps: text });
                }}
                value={this.state.reps}
              />
              <View
                style={{
                  paddingVertical: 20,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <CheckBox
                    checked={loadRequired == "1"}
                    onPress={() => {
                      this.setState({
                        loadRequired: loadRequired == "0" ? "1" : "0",
                      });
                    }}
                    color={Colors.VALHALLA}
                  />
                  <Text
                    style={{
                      color: Colors?.WHITE_COLOR,
                      fontSize: 10,
                      fontFamily: POP_REGULAR,
                      marginStart: findSize(10),
                    }}
                  >
                    Load Required?
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <CheckBox
                    checked={repsEachSide == "1"}
                    onPress={() => {
                      this.setState({
                        repsEachSide: repsEachSide == "0" ? "1" : "0",
                      });
                    }}
                    color={Colors.VALHALLA}
                  />
                  <Text
                    style={{
                      color: Colors?.WHITE_COLOR,
                      fontSize: 10,
                      fontFamily: POP_REGULAR,
                      marginStart: findSize(10),
                    }}
                  >
                    Reps Each Side?
                  </Text>
                </View>
              </View>

              {loadRequired == 1 ? (
                <CustomInput
                  mainContainerStyle={{ marginBottom: 20 }}
                  placeholder={"Load"}
                  inputStyle={{ fontSize: 11 }}
                  onChangeText={(text) => {
                    this.setState({ load: text });
                  }}
                  value={this.state.load}
                />
              ) : null}
              <Select
                pickerProps={{
                  onValueChange: async (value) => {
                    this.setState({ selectedRepetitionType: value });
                  },
                }}
                placeholder={"Select Repetition Type"}
                pickerItems={RepetitionPicker ?? []}
                pickerValue={selectedRepetitionType}
              />

              {Number(WorkoutGroupData.number_of_exercise) == 1 ? (
                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                >
                  <CustomInput
                    mainContainerStyle={{ width: DEV_WIDTH * 0.44 }}
                    placeholder={"Sets"}
                    inputStyle={{ fontSize: 11 }}
                    onChangeText={(text) => {
                      this.setState({ sets: text });
                    }}
                    value={sets}
                  />
                  <CustomInput
                    mainContainerStyle={{ width: DEV_WIDTH * 0.44 }}
                    placeholder={"Rest"}
                    inputStyle={{ fontSize: 11 }}
                    onChangeText={(text) => {
                      this.setState({ rest: text });
                    }}
                    value={rest}
                  />
                </View>
              ) : null}
              <CustomButton
                type={1}
                title={"Save"}
                onPress={() => {
                  this.cudWorkoutGroupExercise("add", null);
                }}
              />
              {workoutGroupExercises?.length > 0 ? (
                <View
                  style={{
                    borderBottomColor: Colors.VALHALLA,
                    borderBottomWidth: 2,
                    paddingHorizontal: 12,
                    marginHorizontal: 15,
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: findSize(24),
                      fontFamily: POP_REGULAR,
                      color: Colors.WHITE_COLOR,
                    }}
                  >
                    Exercises
                  </Text>
                </View>
              ) : null}
              {workoutGroupExercises?.map((item) => {
                // console.log("item", item);
                return (
                  <View
                    style={{
                      padding: findSize(15),
                      backgroundColor: Colors.VALHALLA,
                      borderRadius: findSize(20),
                      paddingVertical: 20,
                      marginVertical: 10,
                    }}
                  >
                    <Text style={styles.title}>Exercise Group</Text>
                    <Text style={styles.value}>
                      {item?.exercise_group_name}
                    </Text>
                    <Text style={styles.title}>Exercise</Text>
                    <Text style={styles.value}>
                      {item?.workout_exercise_name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      <View
                        style={{
                          width: DEV_WIDTH * 0.4,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <CheckBox
                            disabled={true}
                            checked={item?.workout_load_required == "1"}
                            onPress={() => {}}
                            color={Colors.BACKGROUND}
                          />
                          <Text
                            style={{
                              color: Colors?.WHITE_COLOR,
                              fontSize: 10,
                              fontFamily: POP_REGULAR,
                              marginStart: findSize(10),
                            }}
                          >
                            Load Required?
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: DEV_WIDTH * 0.4,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <CheckBox
                            checked={item?.workout_reps_each_side == "1"}
                            disabled={true}
                            onPress={() => {}}
                            color={Colors.BACKGROUND}
                          />
                          <Text
                            style={{
                              color: Colors?.WHITE_COLOR,
                              fontSize: 10,
                              fontFamily: POP_REGULAR,
                              marginStart: findSize(10),
                            }}
                          >
                            Reps Each Side?
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: DEV_WIDTH * 0.4,
                        }}
                      >
                        <Text style={styles.title}>Load</Text>
                        <Text style={styles.value}>{item?.workout_load}</Text>
                      </View>
                      <View
                        style={{
                          width: DEV_WIDTH * 0.4,
                        }}
                      >
                        <Text style={styles.title}>Rep</Text>
                        <Text style={styles.value}>{item?.workout_reps}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: DEV_WIDTH * 0.4,
                        }}
                      >
                        <Text style={styles.title}>Sets</Text>
                        <Text style={styles.value}>{item?.workout_sets}</Text>
                      </View>
                      <View
                        style={{
                          width: DEV_WIDTH * 0.4,
                        }}
                      >
                        <Text style={styles.title}>Rest</Text>
                        <Text style={styles.value}>{item?.workout_rest}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <CustomButton
                        type={2}
                        isLoading={false}
                        style={{
                          width: DEV_WIDTH * 0.4,
                          // borderColor: Colors?.RED_COLOR,
                        }}
                        loaderColor={Colors.WHITE_COLOR}
                        // textStyle={{ color: Colors.RED_COLOR }}
                        title={"Edit"}
                        onPress={async () => {
                          await this.fetchExercises(
                            Number(item?.exercise_group_id)
                          );
                          this.setState({
                            editId: item?.id,

                            selectedExerciseGroupEdit: Number(
                              item?.exercise_group_id
                            ),
                            selectedExerciseEdit: Number(
                              item?.workout_exercise
                            ),
                            setsEdit: item?.workout_sets,
                            restEdit: item?.workout_rest,
                            repsEdit: item?.workout_reps,
                            loadEdit: item?.workout_load,
                            exerciseNameEdit: item?.workout_exercise_name,
                            selectedRepetitionTypeEdit:
                              item?.workout_repetition_type?.toLowerCase(),
                            repsEachSideEdit: item?.workout_reps_each_side,
                            loadRequiredEdit: item?.workout_load_required,

                            modalVisible: true,
                          });
                        }}
                      />
                      <CustomButton
                        type={1}
                        isLoading={false}
                        style={{
                          width: DEV_WIDTH * 0.4,
                        }}
                        loaderColor={Colors.BACKGROUND}
                        title={"Delete"}
                        onPress={() => {
                          this.removeWorkoutGroupExerciseAlert(
                            "delete",
                            item.id
                          );
                        }}
                      />
                    </View>
                  </View>
                );
              })}
              {/* <ExerciseSelector
                showSetReps={WorkoutGroupData.group_set_type === "Procedural"}
                onValueChange={async (value) => {
                  await this.setState({ selectedRepetitionType: value });
                }}
                onRepsChange={async (text) =>
                  await this.setState({ reps: text })
                }
                onLoadChange={async (text) =>
                  await this.setState({ load: text })
                }
                onSetsChange={async (text) =>
                  await this.setState({ sets: text })
                }
                onRestChange={async (text) =>
                  await this.setState({ rest: text })
                }
                repetitionType={selectedRepetitionType}
                onLoadCbPress={() => this.toggleLoadRequired()}
                onRepsCbPress={() => this.toggleRepsEachSide()}
                isLoad={loadRequired}
                isReps={repsEachSide}
                exerciseName={exerciseName}
                repsValue={reps}
                loadValue={load}
                setsValue={sets}
                restValue={rest}
                onRightPress={() => this.cudWorkoutGroupExercise("add", null)}
                onDumbbellPress={() =>
                  this.props.navigation.navigate("ExercisePicker", {
                    content: {
                      pickerData: workoutExercisePickerData,
                      planData: PlanData,
                      weekData: WeekData,
                      dayData: DayData,
                      workoutDetails: WorkoutData,
                      workoutGroupData: WorkoutGroupData,
                    },
                    refreshFunc: (data, id) => this.refresher(data, id),
                  })
                }
                isDisabled={
                  workoutGroupExercises.length == this.state.exerciseLimit
                }
              />
              <Hr style={{ marginTop: 10, marginBottom: 15 }} />
              <View style={{ marginBottom: 15 }}>
                {workoutGroupExercises.map((item, index) => {
                  const IS_EXPANDED = this.state.expanded.indexOf(item.id) >= 0;
                  return (
                    <View style={{ marginBottom: 7 }}>
                      <TouchableOpacity
                        onPress={async () => await this.toggleExpand(item.id)}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Icon
                            name={IS_EXPANDED ? "minuscircleo" : "pluscircleo"}
                            size={20}
                            color={Colors.SKY_COLOR}
                          />
                          <Text style={styles.exerciseName}>
                            {item.workout_exercise_name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {IS_EXPANDED && (
                        <View style={{ marginTop: 10 }}>
                          <ExerciseSelector
                            showDelete
                            showSetReps={
                              WorkoutGroupData.group_set_type === "Procedural"
                            }
                            onValueChange={async (value) => {
                              await this.updateValues(
                                index,
                                "workout_repetition_type",
                                value
                              );
                            }}
                            onRepsChange={async (text) => {
                              await this.updateValues(
                                index,
                                "workout_reps",
                                text
                              );
                            }}
                            onLoadChange={async (text) => {
                              await this.updateValues(
                                index,
                                "workout_load",
                                text
                              );
                            }}
                            onSetsChange={async (text) => {
                              await this.updateValues(
                                index,
                                "workout_sets",
                                text
                              );
                            }}
                            onRestChange={async (text) => {
                              await this.updateValues(
                                index,
                                "workout_rest",
                                text
                              );
                            }}
                            repetitionType={item.workout_repetition_type.toLowerCase()}
                            onLoadCbPress={async () => {
                              let value =
                                item.workout_load_required === "0" ? "1" : "0";
                              await this.updateValues(
                                index,
                                "workout_load_required",
                                value
                              );
                            }}
                            onRepsCbPress={async () => {
                              let value =
                                item.workout_reps_each_side === "0" ? "1" : "0";
                              await this.updateValues(
                                index,
                                "workout_reps_each_side",
                                value
                              );
                            }}
                            isLoad={item.workout_load_required.toString()}
                            isReps={item.workout_reps_each_side.toString()}
                            exerciseName={item.workout_exercise_name}
                            repsValue={item.workout_reps.toString()}
                            loadValue={item.workout_load.toString()}
                            setsValue={item.workout_sets.toString()}
                            restValue={item.workout_rest.toString()}
                            onRightPress={() =>
                              this.updateWorkoutGroupExercise("update", item.id)
                            }
                            onDeletePress={() =>
                              this.removeWorkoutGroupExerciseAlert(
                                "delete",
                                item.id
                              )
                            }
                            onDumbbellPress={() =>
                              this.props.navigation.navigate("ExercisePicker", {
                                content: {
                                  pickerData: workoutExercisePickerData,
                                  planData: PlanData,
                                  weekData: WeekData,
                                  dayData: DayData,
                                  workoutDetails: WorkoutData,
                                  workoutGroupData: WorkoutGroupData,
                                },
                                refreshFunc: async (data, id) => {
                                  // this.refresher(data, id),
                                  await this.updateValues(
                                    index,
                                    "workout_exercise_name",
                                    data
                                  );
                                  await this.updateValues(
                                    index,
                                    "workout_exercise",
                                    id.toString()
                                  );
                                },
                              })
                            }
                          />
                        </View>
                      )}
                    </View>
                  );
                })}
              </View> */}
            </View>
          )}
        </Container>
        <CustomModal
          isVisible={modalVisible}
          onClose={() => {
            this.setState({ modalVisible: false, exercisePickerData: [] });
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
          <Select
            pickerProps={{
              onValueChange: async (value) => {
                if (value) {
                  this.fetchExercises(value);
                } else {
                  this.setState;
                }
                this.setState({
                  selectedExerciseGroupEdit: value,
                  selectedExerciseEdit: null,
                });
              },
            }}
            placeholder={"Select Exercise Group"}
            pickerItems={workoutExercisePickerData?.pickerArray ?? []}
            pickerValue={selectedExerciseGroupEdit}
          />
          <View
            style={{
              marginVertical: 10,
            }}
          >
            <Select
              pickerProps={{
                onValueChange: async (value) => {
                  this.setState({ selectedExerciseEdit: value });
                },
              }}
              placeholder={"Select Exercise"}
              pickerItems={exercisePickerData ?? []}
              pickerValue={selectedExerciseEdit}
            />
          </View>
          <CustomInput
            mainContainerStyle={{}}
            placeholder={"Reps"}
            inputStyle={{ fontSize: 11 }}
            onChangeText={(text) => {
              this.setState({ repsEdit: text });
            }}
            value={this.state.repsEdit}
          />
          <View
            style={{
              paddingVertical: 20,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <CheckBox
                checked={loadRequiredEdit == "1"}
                onPress={() => {
                  this.setState({
                    loadRequiredEdit: loadRequiredEdit == "0" ? "1" : "0",
                  });
                }}
                color={Colors.VALHALLA}
              />
              <Text
                style={{
                  color: Colors?.WHITE_COLOR,
                  fontSize: 10,
                  fontFamily: POP_REGULAR,
                  marginStart: findSize(10),
                }}
              >
                Load Required?
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <CheckBox
                checked={repsEachSideEdit == "1"}
                onPress={() => {
                  this.setState({
                    repsEachSideEdit: repsEachSideEdit == "0" ? "1" : "0",
                  });
                }}
                color={Colors.VALHALLA}
              />
              <Text
                style={{
                  color: Colors?.WHITE_COLOR,
                  fontSize: 10,
                  fontFamily: POP_REGULAR,
                  marginStart: findSize(10),
                }}
              >
                Reps Each Side?
              </Text>
            </View>
          </View>

          {loadRequiredEdit == 1 ? (
            <CustomInput
              mainContainerStyle={{ marginBottom: 20 }}
              placeholder={"Load"}
              inputStyle={{ fontSize: 11 }}
              onChangeText={(text) => {
                this.setState({ loadEdit: text });
              }}
              value={this.state.loadEdit}
            />
          ) : null}
          <Select
            pickerProps={{
              onValueChange: async (value) => {
                this.setState({ selectedRepetitionTypeEdit: value });
              },
            }}
            placeholder={"Select Repetition Type"}
            pickerItems={RepetitionPicker ?? []}
            pickerValue={selectedRepetitionTypeEdit}
          />

          {Number(WorkoutGroupData.number_of_exercise) == 1 ? (
            <View
              style={{
                flexDirection: "row",

                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <CustomInput
                mainContainerStyle={{ width: DEV_WIDTH * 0.44 }}
                placeholder={"Sets"}
                inputStyle={{ fontSize: 11 }}
                onChangeText={(text) => {
                  this.setState({ setsEdit: text });
                }}
                value={setsEdit}
              />
              <CustomInput
                mainContainerStyle={{ width: DEV_WIDTH * 0.44 }}
                placeholder={"Rest"}
                inputStyle={{ fontSize: 11 }}
                onChangeText={(text) => {
                  this.setState({ restEdit: text });
                }}
                value={restEdit}
              />
            </View>
          ) : null}
          <CustomButton
            type={1}
            title={"Save"}
            isLoading={this.state.updating}
            onPress={() => {
              this.updateWorkoutGroupExercise();
            }}
          />
        </CustomModal>
      </>
    );
  }
}
