import React, { Component, useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import Container from "../../../../components/Container";
import { Colors } from "../../../../constants/Colors";
import IconArrow from "react-native-vector-icons/MaterialCommunityIcons";
import PrimeInput from "../../../../components/PrimeInput";
import { standardPostApi } from "../../../../api/ApiWrapper";
import Spinnner from "../../../../components/Spinnner";
import AsyncStorage from "@react-native-community/async-storage";
import PrimeButton from "../../../../components/PrimeButton";
import { DEV_HEIGHT, DEV_WIDTH } from "../../../../constants/DeviceDetails";
import Select from "../../../../components/Select";
import { styles } from "./Weeks.styles";
import { Hr } from "./Weeks";
import * as Animatable from "react-native-animatable";
import IconTrash from "react-native-vector-icons/MaterialCommunityIcons";
import IconEdit from "react-native-vector-icons/Feather";
import { Toaster } from "../../../../components/Toaster";
import Icon from "react-native-vector-icons/AntDesign";
import Modal from "react-native-modal";
import { ROBO_MEDIUM } from "../../../../constants/Fonts";
import CustomInput from "../../../../components/customInput/CustomInput";
import CustomButton from "../../../../components/customButton/CustomButton";
import { findSize } from "../../../../utils/helper";
import TildView from "../../../../components/tildView/TildView";
import { POP_MEDIUM } from "../../../../constants/Fonts";
import AntDesign from "react-native-vector-icons/AntDesign";
import CustomModal from "../../../../components/customModal/CustomModal";

const WorkoutGrpArray = [
  { label: "Procedural", value: "procedural" },
  { label: "Super Set", value: "super_set" },
  { label: "Triset", value: "triset" },
  { label: "Quarter Set", value: "quarter_set" },
];

const DESCRIPTION_ERROR = "Please enter a description of the workout group.";
const PICKER_ERROR = "Please choose a value for Sets Type.";

function WorkoutGroupBox(props) {
  return (
    // <View style={styles.container}>
    //   <View style={styles.boxContainer}>
    //     <PrimeButton
    //       buttonProps={{
    //         style: styles.weekButton,
    //         onPress: props.onWrkGrpPress,
    //       }}
    //       buttonText={props.title}
    //     />
    //     <View
    //       style={[styles.iconsContainer, { justifyContent: "space-between" }]}
    //     >
    //       <TouchableOpacity
    //         onPress={props?.onEditPress}
    //         style={[styles.iconBtn, { backgroundColor: Colors.ORANGE_COLOR }]}
    //       >
    //         <IconEdit name="edit" color={Colors.WHITE_COLOR} size={22} />
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
          props.onWrkGrpPress();
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

export default class WorkoutGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptionTxt: "",
      selectedSetType: "procedural",
      sets: "",
      rest: "",
      updatingWrkoutGrp: false,
      workoutGroups: [],
      workouts: [],
      modalVisible: false,
      editData: {},
      loading: false,
      setTypeArray: [],
      customSetType: "",
      numberOfExercise: "",
    };
  }
  fetchPreWorkoutData = async () => {
    try {
      this.setState({ loading: true });
      const res = await standardPostApi(
        "pre_add_annual_training_program_workout_groups",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
        },
        true,
        false
      );

      if (res.data.code == 301) {
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200 || res.data?.status) {
        console.log("Data ress", JSON.stringify(res.data, null, 2));
        this.setState({ setTypeArray: res.data.data?.sets_type });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
  async componentDidMount() {
    const { navigation } = this.props;
    const Workouts = navigation.getParam("content").workouts;
    await this.setState({
      workoutGroups: Workouts[0].workout_group,
      workouts: Workouts,
    });
    this.fetchPreWorkoutData();
  }

  refresher = async (value) => {
    await this.setState({ workoutGroups: value });
  };

  checkNonEmpty = (action, text) => {
    if (action !== "delete") {
      if (!text.trim().length > 0) {
        Toaster(DESCRIPTION_ERROR, Colors.LIGHT_RED);
        return false;
      }
    }
    return true;
  };

  verifyPickers = (action, setType, customType, exerciseCount) => {
    if (action !== "delete") {
      if (setType === null) {
        Toaster(PICKER_ERROR, Colors.LIGHT_RED);
        return false;
      } else if (setType == 0) {
        if (!customType?.trim()?.length) {
          Toaster("Custom set type field  is required.", Colors.LIGHT_RED);
          return false;
        } else if (!exerciseCount) {
          Toaster("Number of Exercises field is required.", Colors.LIGHT_RED);
          return false;
        }
      }
    }
    return true;
  };

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc(this.state.workouts);
  }

  componentWillUnmount() {
    this.goBack();
  }

  removeWorkoutGroupAlert = async (action, workoutGroupId) => {
    return Alert.alert(
      "Delete Workout Group",
      "Are you sure you want to delete this workout group, it will delete all the child exercises, this cannot be undone?",
      [
        { text: "Cancel" },
        {
          text: "Yes",
          onPress: () => this.addRemoveWorkoutGroup(action, workoutGroupId),
        },
      ]
    );
  };

  addRemoveWorkoutGroup = async (action, workoutGroupId) => {
    const { navigation } = this.props;
    const {
      descriptionTxt,
      selectedSetType,
      sets,
      rest,
      numberOfExercise,
      customSetType,
    } = this.state;
    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekData;
    const DayData = navigation.getParam("content").dayData;
    const WorkoutData = navigation.getParam("content").workoutDetails;
    let current_week_id = WeekData.id;
    let current_day_id = DayData.id;
    if (
      this.checkNonEmpty(action, descriptionTxt) &&
      this.verifyPickers(
        action,
        selectedSetType,
        customSetType,
        numberOfExercise
      )
    ) {
      this.setState({ updatingWrkoutGrp: true });
      try {
        const res = await standardPostApi(
          "annual_training_program_workout_group",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            annual_training_program_id: PlanData.planDetails.id,
            training_type: PlanData.training_type,
            annual_training_program_week_id: WeekData.id,
            annual_training_program_week_day_id: DayData.id,
            annual_training_program_workout_id: WorkoutData.id,
            annual_training_program_workout_group_id: workoutGroupId,
            workout_group_description: descriptionTxt,
            workout_group_set_type_id: selectedSetType,
            workout_group_sets: Number(sets),
            workout_group_rest: Number(rest),
            customize_group_set_type:
              selectedSetType == 0 ? customSetType : null,
            number_of_exercise: numberOfExercise,
            api_action: action,
          },
          true,
          false
        );
        if (res.data.code == 301) {
          this.setState({ updatingWrkoutGrp: false });
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
          if (selectedSetType == 0) {
            this.fetchPreWorkoutData();
          }
          Toaster(res.data.message, Colors.GREEN_COLOR);
          this.setState({
            workoutGroups: current_day.workout[0].workout_group,
            updatingWrkoutGrp: false,
            descriptionTxt: "",
            sets: "",
            rest: "",
            workouts: current_day.workout,
          });
          console.log("new wrkGrp added ", res.data.data);
        }
      } catch (error) {
        this.setState({
          updatingWrkoutGrp: false,
        });
        console.log(error);
      }
    }
  };

  render() {
    const { navigation } = this.props;
    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekData;
    const DayData = navigation.getParam("content").dayData;
    const WorkoutData = navigation.getParam("content").workoutDetails;
    const {
      selectedSetType,
      updatingWrkoutGrp,
      workoutGroups,
      loading,
      setTypeArray,
      customSetType,
      numberOfExercise,
    } = this.state;
    return (
      <>
        <Container
          backFn={() => this.props.navigation.goBack()}
          title={WorkoutData.name}
        >
          <Spinnner visible={updatingWrkoutGrp || loading} />
          <View>
            <Text style={styles.week}>Workouts Groups</Text>

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
                  await this.setState({ selectedSetType: value });
                },
              }}
              pickerItems={this.state.setTypeArray}
              pickerValue={this.state.selectedSetType}
              placeholder="Sets type"
            />
            {selectedSetType == 0 && (
              <>
                <CustomInput
                  mainContainerStyle={{ marginVertical: 10 }}
                  placeholder={"Custom sets type"}
                  inputStyle={{ fontSize: 11 }}
                  onChangeText={(text) => {
                    this.setState({ customSetType: text });
                  }}
                  value={customSetType}
                />
                <CustomInput
                  mainContainerStyle={{ marginVertical: 10 }}
                  placeholder={"Number of exercises"}
                  inputStyle={{ fontSize: 11 }}
                  onChangeText={(text) => {
                    this.setState({
                      numberOfExercise: isNaN(Number(text)) ? "" : Number(text),
                    });
                  }}
                  value={numberOfExercise?.toString()}
                />
              </>
            )}
            {Number(
              setTypeArray?.find((x) => x.value == selectedSetType)
                ?.number_of_excercise
            ) > 1 ||
            (selectedSetType == 0 && Number(numberOfExercise) > 1) ? (
              <>
                <CustomInput
                  mainContainerStyle={{ marginVertical: 10 }}
                  placeholder={"Sets"}
                  inputStyle={{ fontSize: 11 }}
                  onChangeText={(text) => {
                    this.setState({ sets: text });
                  }}
                  value={this.state.sets}
                  VALHALLA
                />
                <CustomInput
                  mainContainerStyle={{ marginVertical: 10 }}
                  placeholder={"Rest"}
                  inputStyle={{ fontSize: 11 }}
                  onChangeText={(text) => {
                    this.setState({ rest: text });
                  }}
                  value={this.state.rest}
                />
              </>
            ) : null}

            <CustomButton
              type={1}
              title="Add New Workout Group"
              onPress={() => {
                this.addRemoveWorkoutGroup("add", null);
              }}
            />
            {workoutGroups?.length ? (
              <View
                style={{
                  padding: findSize(15),
                  backgroundColor: Colors.VALHALLA,
                  borderRadius: findSize(20),
                  paddingVertical: 30,
                  marginTop: 12,
                }}
              >
                {workoutGroups.map((item) => {
                  return (
                    <WorkoutGroupBox
                      onWrkGrpPress={() =>
                        this.props.navigation.navigate("WorkoutGroupExercise", {
                          content: {
                            workoutGroupData: item,
                            planData: PlanData,
                            setType: selectedSetType,
                            dayData: DayData,
                            workoutDetails: WorkoutData,
                            weekData: WeekData,
                            workoutGroups: workoutGroups,
                          },
                          refreshFunc: (data) => this.refresher(data),
                        })
                      }
                      onDeletePress={() =>
                        this.removeWorkoutGroupAlert("delete", item.id)
                      }
                      title={item.group_name}
                      onEditPress={() =>
                        this.setState({ editData: item, modalVisible: true })
                      }
                    />
                  );
                })}
              </View>
            ) : null}
          </View>
          {this.state.modalVisible && (
            <WorkoutGroupModal
              onClose={() => this.setState({ modalVisible: false })}
              data={this.state.editData}
              navigation={this.props.navigation}
              checkNonEmpty={this.checkNonEmpty}
              verifyPickers={this.verifyPickers}
              onSubmitDone={(workout_data) => {
                this.setState({
                  ...workout_data,
                });
              }}
              setTypeArray={setTypeArray}
            />
          )}
        </Container>
      </>
    );
  }
}

export function WorkoutGroupModal(props) {
  const { setTypeArray } = props;

  console.log("item====", props.data);
  const [description, setdescription] = useState("");
  const [workoutType, setWorkoutType] = useState("");
  const [sets, setSets] = useState("");
  const [rest, setRest] = useState("");
  const [loading, setloading] = useState(false);
  const [customSetType, setCustomSetType] = useState("");
  const [numberOfExercise, setNumberOfExecises] = useState("");
  useEffect(() => {
    setdescription(props.data?.group_name);
    setRest(props.data?.group_rest);
    setSets(props.data?.group_sets);
    setWorkoutType(props.data?.group_set_type_id);
  }, []);

  const onSave = async (action, workoutGroupId) => {
    const { navigation } = props;
    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekData;
    const DayData = navigation.getParam("content").dayData;
    const WorkoutData = navigation.getParam("content").workoutDetails;
    let current_week_id = WeekData.id;
    let current_day_id = DayData.id;
    if (
      props.checkNonEmpty(action, description) &&
      props.verifyPickers(action, workoutType, customSetType, numberOfExercise)
    ) {
      setloading(true);
      try {
        const res = await standardPostApi(
          "annual_training_program_workout_group",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            annual_training_program_id: PlanData.planDetails.id,
            training_type: PlanData.training_type,
            annual_training_program_week_id: WeekData.id,
            annual_training_program_week_day_id: DayData.id,
            annual_training_program_workout_id: WorkoutData.id,
            annual_training_program_workout_group_id: workoutGroupId,
            workout_group_description: description,
            workout_group_set_type_id: workoutType,
            customize_group_set_type:
              selectedSetType == 0 ? customSetType : null,
            number_of_exercise: numberOfExercise,
            workout_group_sets: Number(sets),
            workout_group_rest: Number(rest),
            api_action: action,
          },
          true,
          false
        );
        if (res.data.code == 301) {
          setloading(false);
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
          setloading(false);
          console.log("new wrkGrp added ", res.data.data);
          props.onSubmitDone({
            workoutGroups: current_day.workout[0].workout_group,
            workouts: current_day.workout,
          });
          props.onClose();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <CustomModal isVisible={true} onClose={() => props?.onClose()}>
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
            setdescription(text);
          }}
          value={description}
        />

        <Select
          pickerProps={{
            onValueChange: async (value) => {
              setWorkoutType(value);
            },
          }}
          pickerItems={setTypeArray}
          pickerValue={workoutType}
          placeholder="Sets Type"
        />

        {workoutType == 0 && (
          <>
            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              placeholder={"Sets Type"}
              inputStyle={{ fontSize: 11 }}
              onChangeText={(text) => {
                setCustomSetType(text);
              }}
              value={customSetType}
            />
            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              placeholder={"No. of Exercises"}
              inputStyle={{ fontSize: 11 }}
              onChangeText={(text) => {
                setNumberOfExecises(Number(text));
              }}
              value={numberOfExercise?.toString()}
            />
          </>
        )}
        {Number(
          setTypeArray?.find((x) => x.value == workoutType)?.number_of_excercise
        ) > 1 ||
        (workoutType == 0 && Number(numberOfExercise) > 1) ? (
          <>
            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              placeholder={"Sets"}
              inputStyle={{ fontSize: 11 }}
              onChangeText={(text) => {
                setSets(text);
              }}
              value={sets}
            />
            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              placeholder={"Rest"}
              inputStyle={{ fontSize: 11 }}
              onChangeText={(text) => {
                setRest(text);
              }}
              value={rest}
            />
          </>
        ) : null}

        <CustomButton
          type={1}
          isLoading={loading}
          title={"Save"}
          onPress={() => {
            onSave("update", props?.data?.id);
          }}
        />
      </CustomModal>
    </>
  );
}
