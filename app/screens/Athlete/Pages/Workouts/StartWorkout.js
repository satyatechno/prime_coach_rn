import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modall from "../../../../components/Modall";
import { Colors } from "../../../../constants/Colors";
import PrimeButton from "../../../../components/PrimeButton";
import { Toaster } from "../../../../components/Toaster";
import { standardPostApi } from "../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import { styles } from "./Workouts.styles";
import { WebView } from "react-native-webview";
import * as Animatable from "react-native-animatable";
import PrimeInput from "../../../../components/PrimeInput";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Body from "react-native-body-highlighter";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { POP_MEDIUM, ROBO_ITALIC } from "../../../../constants/Fonts";
import {
  Hr,
  Questionnaire1,
  Questionnaire2,
  RateIntensity,
  FINAL_WELL,
  RoundOff,
  Deload,
} from "../../components/WorkoutComps";
import { arr } from "./output-3";
import { DEV_HEIGHT, DEV_WIDTH } from "../../../../constants/DeviceDetails";
import Sound from "react-native-sound";
import { AlternativeExerciseModal } from "./WorkoutView";
import Container from "../../../../components/Container";
import { capitalizeFirstLetter, findSize } from "../../../../utils/helper";
import CustomButton from "../../../../components/customButton/CustomButton";
import CustomInput from "../../../../components/customInput/CustomInput";
import TildView from "../../../../components/tildView/TildView";

const WELLNESS_ERR =
  'Please complete the "Well Being Questionnaire" to continue.';

const INTENSE_ERR = "The field Intensity must be between 1 and 10.";

export default class StartWorkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFreshness: null,
      selectedSoreness: null,
      selectedFatigue: null,
      selectedSleep: null,
      selectedIntensity: null,
      savingQues: false,
      savingQues2: false,
      hasSubmittedQues: false,
      hasCompletedWorkouts: false,
      groupIndex: 0,
      groupExerIndex: 0,
      setNumber: 1,
      completedReps: "0",
      completedLoad: "0",
      restTime: 0,
      currentWorkGroup: null,
      currentGroupExercise: null,
      savingRepsLoads: false,
      totalSets: 0,
      workoutGroups: [],
      workoutGroupExercises: [],
      lastSetComplete: false,
      showResults: false,
      submittingIntensity: false,
      showAccomps: false,
      accompsResult: null,
      wellBeingResult: null,
      showingBodyChart: false,
      showingSecondQuiz: false,
      selectedMuscles: [],
      bodyWeight: "0",
      sleepHours: "0",
      waterContent: "0",
      selectedMuscleIds: [],
      savingBodyChart: false,
      preExercises: [],
      skippingAllWorkouts: false,
      workoutVideo: "",
      hasPreExercises: false,
      preExerciseIndex: 0,
      showingPreExercises: false,
      considerDeload: false,
      exercisesArr: [],
      index: 0,
      allSurveyDone: false,
      previousIndex: 0,
      modalVisible: false,
      selectExeForAlternative: null,
      oldExerciseId: null,
      weigthplaceholder: "in pound",
      selectedTabIndex: 0,
      isCompleteloading: false,
    };
  }

  skipRestTime = async () => {
    const { index, exercisesArr } = this.state;
    clearInterval(this.interval);
    await this.setState({
      index:
        index !== exercisesArr.length - 1
          ? index + 1
          : this.setState({
              hasCompletedWorkouts: true,
              allSurveyDone: false,
            }),
    });
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const DAY_DETAILS = navigation.getParam("content").dayDetails;
    let output = DAY_DETAILS.groups.reduce((result, group) => {
      if (group.workout_group_exercise.length > 0) {
        const { workout_sets, workout_rest } = group.workout_group_exercise[0];
        for (let set = 1; set <= Number(workout_sets); set++) {
          group.workout_group_exercise.forEach((workout) => {
            result.push({
              type: "EXERCISE",
              data: {
                ...workout,
                setNumber: set,
                group_name: group.group_name,
                workout_type: group.workout_type,
                old_exercise_id: null,
              },
            });
            result.push({
              type: "INPUT",
              data: {
                workout_load_required: workout.workout_load_required,
                restTime: Number(workout_rest),
                setNumber: set,
                id: workout.id,
                old_exercise_id: null,
              },
            });
          });
          result.push({
            type: "REST",
            data: {},
          });
        }
      }
      return result;
    }, []);
    await this.setState({ exercisesArr: output });
    console.log("exercisesArr ", JSON.stringify(DAY_DETAILS, null, 2));
  }

  startInterval = async () => {
    if (this.state.restTime > 0) {
      if (this.state.restTime < 6) this.PlayLocalSoundFile();
      this.interval = setInterval(async () => {
        this.setState((prevState) => ({
          restTime: prevState.restTime - 1,
        }));
        if (this.state.restTime < 6 && this.state.restTime > 0)
          this.PlayLocalSoundFile();
      }, 1000);
    }
  };
  PlayLocalSoundFile = () => {
    Sound.setCategory("Playback");
    var mySound = new Sound("beep.mpeg", Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log("Error loading sound: " + error);
        return;
      } else {
        mySound.play((success) => {
          if (success) {
            console.log("Sound playing");
          } else {
            console.log("Issue playing file");
          }
        });
      }
    });
  };
  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc();
  }

  async componentDidUpdate() {
    const ELEMENT = this.state.exercisesArr[this.state.index];
    const { index, exercisesArr } = this.state;
    if (this.state.restTime === 0 && ELEMENT?.type === "REST") {
      clearInterval(this.interval);
      await this.setState({
        index:
          index !== exercisesArr.length - 1
            ? index + 1
            : this.setState({
                hasCompletedWorkouts: true,
                allSurveyDone: false,
              }),
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.goBack();
  }

  selectionOnFresh = async (intensity) => {
    await this.setState({ selectedFreshness: intensity });
  };

  selectionOnSoreness = async (intensity) => {
    await this.setState({ selectedSoreness: intensity });
  };

  selectionOnFatigue = async (intensity) => {
    await this.setState({ selectedFatigue: intensity });
  };

  selectionOnSleep = async (intensity) => {
    await this.setState({ selectedSleep: intensity });
  };

  selectionOnIntensity = async (intensity) => {
    await this.setState({ selectedIntensity: intensity });
  };

  verifyWellBeingQues = () => {
    const {
      selectedFreshness,
      selectedSoreness,
      selectedFatigue,
      selectedSleep,
    } = this.state;
    if (
      selectedFreshness === null ||
      selectedSoreness === null ||
      selectedFatigue === null ||
      selectedSleep === null
    ) {
      Toaster(WELLNESS_ERR, Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  completeWorkoutExercise = async () => {
    const { navigation } = this.props;
    const { currentGroupExercise, index, exercisesArr } = this.state;
    const DAY_DETAILS = navigation.getParam("content").dayDetails;
    const PROGRAM_DETAILS = navigation.getParam("content").programDetails;
    const WEEK_DETAILS = navigation.getParam("content").weekDetails;
    const ELEMENT = this.state.exercisesArr[this.state.index];
    const NEXT_ELEMENT = this.state.exercisesArr[this.state.index + 1];
    await this.setState({ savingRepsLoads: true });
    try {
      const res = await standardPostApi(
        "complete_single_day_workout_exercise",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PROGRAM_DETAILS.id,
          annual_training_program_week_id: WEEK_DETAILS.id,
          annual_training_program_day_id: DAY_DETAILS.id,
          annual_training_program_exercise_id: ELEMENT?.data.id,
          annual_training_program_exercise_set_number: ELEMENT?.data.setNumber,
          annual_training_program_reps_completed: this.state.completedReps,
          annual_training_program_load_completed: this.state.completedLoad,
          annual_training_program_replaced_alternate_id:
            ELEMENT?.data?.old_exercise_id,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        await this.setState({
          savingRepsLoads: false,
          completedReps: "0",
          completedLoad: "0",
          restTime: ELEMENT?.data?.restTime,
          index: index !== exercisesArr.length - 1 ? index + 1 : 0,
          // oldExerciseId: null,
        });
        if (NEXT_ELEMENT?.type == "REST") this.startInterval();
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        await this.setState({
          savingRepsLoads: false,
          completedReps: "0",
          completedLoad: "0",
          restTime: ELEMENT?.data.restTime,
          index: index !== exercisesArr.length - 1 ? index + 1 : 0,
          // oldExerciseId: null,
        });
        if (NEXT_ELEMENT?.type == "REST") this.startInterval();
        Toaster(res.data.message, Colors.GREEN_COLOR);
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ savingRepsLoads: false });
  };

  verifyIntensity = () => {
    const { selectedIntensity } = this.state;
    if (selectedIntensity === null) {
      Toaster(INTENSE_ERR, Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  completeSingleDayWorkout = async () => {
    const { navigation } = this.props;
    const { skippingAllWorkouts } = this.state;
    const DAY_DETAILS = navigation.getParam("content").dayDetails;
    const PROGRAM_DETAILS = navigation.getParam("content").programDetails;
    const WEEK_DETAILS = navigation.getParam("content").weekDetails;
    this.setState({ submittingIntensity: true });
    if (this.verifyIntensity()) {
      try {
        const res = await standardPostApi(
          "complete_single_day_workout",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            annual_training_program_id: PROGRAM_DETAILS.id,
            annual_training_program_week_id: WEEK_DETAILS.id,
            annual_training_program_day_id: DAY_DETAILS.id,
            workout_direct_complete: skippingAllWorkouts ? 1 : 0,
            workout_intensity: this.state.selectedIntensity,
          },
          true,
          false
        );
        if (res.data.code == 301) {
          await this.setState({ submittingIntensity: false });
          Toaster(res.data.message, Colors.LIGHT_RED);
        }
        if (res.data.code == 200) {
          console.log("workout completed ", res.data.data);
          await this.setState({
            accompsResult: res.data.data.WorkoutAccomplishments,
            wellBeingResult: res.data.data.WorkoutWellBeingQuestonnaire,
            submittingIntensity: false,
            showAccomps: true,
          });
          Toaster(res.data.message, Colors.GREEN_COLOR);
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ submittingIntensity: false });
  };

  considerDeloadCheck = async (isComplete) => {
    const {
      selectedFreshness,
      selectedSoreness,
      selectedFatigue,
      selectedSleep,
    } = this.state;
    const TOTAL = Number(
      selectedFreshness + selectedSoreness + selectedFatigue + selectedSleep
    );
    if (this.verifyWellBeingQues()) {
      if (TOTAL <= 12) {
        await this.setState({
          considerDeload: true,
          hasSubmittedQues: true,
        });
      } else {
        this.submitWellBeingQues(isComplete);
      }
    }
  };

  submitWellBeingQues = async (isComplete) => {
    const { navigation } = this.props;
    const DAY_DETAILS = navigation.getParam("content").dayDetails;
    const PROGRAM_DETAILS = navigation.getParam("content").programDetails;
    const WEEK_DETAILS = navigation.getParam("content").weekDetails;
    if (isComplete) this.setState({ isCompleteloading: true });
    else this.setState({ savingQues: true });
    try {
      const res = await standardPostApi(
        "save_workout_well_being_questionnaire",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PROGRAM_DETAILS.id,
          annual_training_program_week_id: WEEK_DETAILS.id,
          annual_training_program_day_id: DAY_DETAILS.id,
          freshness_level: this.state.selectedFreshness,
          soreness_level: this.state.selectedSoreness,
          fatigue_level: this.state.selectedFatigue,
          sleep_level: this.state.selectedSleep,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        this.setState({ savingQues: false, isCompleteloading: false });
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        if (isComplete) {
          this.setState({
            hasSubmittedQues: true,
            hasCompletedWorkouts: true,
            skippingAllWorkouts: true,
            isCompleteloading: false,
          });
        } else {
          this.setState({
            considerDeload: false,
            savingQues: false,
            hasSubmittedQues: true,
            showingSecondQuiz: true,
          });
        }
        Toaster(res.data.message, Colors.GREEN_COLOR);
      }
    } catch (error) {
      console.log(error);
    }
  };

  saveWaterSleepWeight = async () => {
    const { navigation } = this.props;
    const { bodyWeight, waterContent, sleepHours } = this.state;
    const DAY_DETAILS = navigation.getParam("content").dayDetails;
    const PROGRAM_DETAILS = navigation.getParam("content").programDetails;
    const WEEK_DETAILS = navigation.getParam("content").weekDetails;
    this.setState({ savingQues2: true });
    try {
      const res = await standardPostApi(
        "workout_sleep_water_level",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PROGRAM_DETAILS.id,
          annual_training_program_week_id: WEEK_DETAILS.id,
          annual_training_program_day_id: DAY_DETAILS.id,
          body_weight: bodyWeight,
          sleep_level: sleepHours,
          water_level: waterContent,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        this.setState({ savingQues2: false });
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        this.setState({
          savingQues2: false,
          showingSecondQuiz: false,
          showingBodyChart: true,
        });
        Toaster(res.data.message, Colors.GREEN_COLOR);
      }
    } catch (error) {
      console.log(error);
    }
  };

  saveBodyMuscles = async () => {
    const { navigation } = this.props;
    const { selectedMuscleIds } = this.state;
    const DAY_DETAILS = navigation.getParam("content").dayDetails;
    const PROGRAM_DETAILS = navigation.getParam("content").programDetails;
    const WEEK_DETAILS = navigation.getParam("content").weekDetails;
    if (selectedMuscleIds.length > 0) {
      this.setState({ savingBodyChart: true });
      try {
        const res = await standardPostApi(
          "workout_soreness_muscle_exercise",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            annual_training_program_id: PROGRAM_DETAILS.id,
            annual_training_program_week_id: WEEK_DETAILS.id,
            annual_training_program_day_id: DAY_DETAILS.id,
            soreness_muscle: JSON.stringify(selectedMuscleIds),
          },
          true,
          false
        );
        if (res.data.code == 301) {
          this.setState({ savingBodyChart: false });
          Toaster(res.data.message, Colors.LIGHT_RED);
        }
        if (res.data.code == 200) {
          let response = res.data.data;
          let pre_exercises = [];
          response.forEach((item) => {
            pre_exercises.push(...item.Exercises);
          });
          this.setState({
            preExercises: pre_exercises,
            savingBodyChart: false,
          });
          if (pre_exercises.length > 0) {
            this.setState({
              hasPreExercises: true,
              showingBodyChart: false,
              showingPreExercises: true,
            });
          }
          if (pre_exercises.length === 0) {
            this.setState({
              showingBodyChart: false,
              allSurveyDone: true,
            });
            Toaster(
              "There are no pre exercises for you to perform, kindly continue with the Workouts.",
              Colors.GREEN_COLOR
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      this.setState({
        showingBodyChart: false,
        allSurveyDone: true,
      });
    }
  };

  addMuscleToArray = async (muscle) => {
    const { selectedMuscles, selectedMuscleIds } = this.state;
    const Index = selectedMuscles.findIndex((el) => el.slug == muscle?.slug);
    if (Index == -1) {
      this.setState({
        selectedMuscles: [...selectedMuscles, muscle],
        selectedMuscleIds: [...selectedMuscleIds, muscle.slug],
      });
    } else {
      this.setState({
        selectedMuscles: selectedMuscles.filter((x) => x.slug !== muscle.slug),
        selectedMuscleIds: selectedMuscleIds.filter(
          (x) => x.slug !== muscle.slug
        ),
      });
    }
  };

  clearSelectedMuscles = async () => {
    await this.setState({ selectedMuscles: [], selectedMuscleIds: [] });
  };

  skipAllWorkouts = async () => {
    await this.setState({
      hasSubmittedQues: true,
      hasCompletedWorkouts: true,
      skippingAllWorkouts: true,
    });
  };

  getId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  convertToIframe = (url) => {
    const videoId = this.getId(url);
    return (
      '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' +
      videoId +
      '" frameborder="0" allowFullScreen></iframe>'
    );
  };

  nextExercise = async () => {
    const { preExercises, preExerciseIndex } = this.state;
    if (preExerciseIndex !== preExercises.length - 1) {
      await this.setState({ preExerciseIndex: preExerciseIndex + 1 });
    } else {
      Toaster(
        "You have completed the pre workout exercises, now you may continue with the Workouts.",
        Colors.GREEN_COLOR
      );
      await this.setState({ showingPreExercises: false, allSurveyDone: true });
    }
  };

  goNext = async () => {
    const { index, exercisesArr } = this.state;
    console.log(
      "gggg",
      index,
      "\n",
      JSON.stringify(exercisesArr[index], null, 2)
    );
    if (index !== exercisesArr.length - 1) {
      await this.setState({
        index: index + 1,
      });
    }
  };
  goPrevious = async () => {
    const { index, exercisesArr, previousIndex } = this.state;

    if (index > 0) {
      if (exercisesArr[index - 3]?.type === "EXERCISE")
        this.setState({
          index: index - 3,
          previousIndex: previousIndex + 1,
        });
      else if (exercisesArr[index - 2]?.type === "EXERCISE")
        this.setState({
          index: index - 2,
          previousIndex: previousIndex + 1,
        });
    }
  };

  onAlternativeSelect = (item) => {
    const { exercisesArr, index } = this.state;
    // console.log('element', item);
    let Temp = exercisesArr[index];
    let TempExercises = [...exercisesArr];
    for (var i = 0; TempExercises.length > i; i++) {
      if (
        TempExercises[i].type === "EXERCISE" &&
        TempExercises[i].data.id === Temp?.data?.id
      ) {
        TempExercises[i].data.workout_exercise_name = item?.exercise;
        TempExercises[i].data.workout_exercise_video = item?.video;
        TempExercises[i].data.old_exercise_id = item?.id;
      } else if (
        TempExercises[i].type === "INPUT" &&
        TempExercises[i].data.id === Temp?.data?.id
      ) {
        TempExercises[i].data.old_exercise_id = item?.id;
      } else if (TempExercises[i].type === "REST") {
      }
    }
    this.setState({ exercisesArr: [...TempExercises] });
  };
  render() {
    const { navigation } = this.props;
    const {
      savingQues,
      hasSubmittedQues,
      hasCompletedWorkouts,
      restTime,
      wellBeingResult,
      accompsResult,
      preExercises,
      preExerciseIndex,
      allSurveyDone,
    } = this.state;
    const currentPreExercise = preExercises[preExerciseIndex];
    const DAY_DETAILS = navigation.getParam("content").dayDetails;
    const ELEMENT = allSurveyDone && this.state.exercisesArr[this.state.index];
    console.log("renderrr", JSON.stringify(this.state.bodyWeight, null, 2));
    return (
      <>
        <Container
          title={"Start Workout"}
          backFn={() => this.props.navigation.goBack()}
        >
          <Text
            style={{
              fontSize: findSize(21),
              color: Colors.WHITE_COLOR,
              fontFamily: POP_MEDIUM,
            }}
          >
            {this.state.considerDeload
              ? "Well Being Warning"
              : hasCompletedWorkouts
              ? "Workout Completed"
              : hasSubmittedQues
              ? DAY_DETAILS.day_number
              : "Well Being Questionnaire"}
          </Text>

          {!hasSubmittedQues && (
            <Animatable.View
              animation={hasSubmittedQues && "fadeOut"}
              iterationDelay={500}
            >
              <Questionnaire1
                onFreshPress={(index) => this.selectionOnFresh(index + 1)}
                onSorePress={(index) => this.selectionOnSoreness(index + 1)}
                onFatiguePress={(index) => this.selectionOnFatigue(index + 1)}
                onSleepPress={(index) => this.selectionOnSleep(index + 1)}
                selectedFreshness={this.state.selectedFreshness}
                selectedSoreness={this.state.selectedSoreness}
                selectedFatigue={this.state.selectedFatigue}
                selectedSleep={this.state.selectedSleep}
                savingQues={savingQues}
                completedLoading={this.state.isCompleteloading}
                onSubmit={() => this.considerDeloadCheck(false)}
                onCompletePress={() => this.considerDeloadCheck(true)}
              />
            </Animatable.View>
          )}
          {this.state.considerDeload && (
            <Deload
              saveDeload={savingQues}
              onSubmit={() => this.submitWellBeingQues()}
            />
          )}
          {this.state.showingSecondQuiz && (
            <Questionnaire2
              savingQues2={this.state.savingQues2}
              onSubmit={() => this.saveWaterSleepWeight()}
              onWeightChange={async (text) => {
                this.setState({ bodyWeight: text });
                this.state.selectedTabIndex === 0
                  ? this.setState({
                      bodyWeight: text,
                    })
                  : this.setState({
                      bodyWeight: (parseFloat(text) * 2.20462).toString(),
                    });
              }}
              weigthplaceholder={this.state.weigthplaceholder}
              selectedTabIndex={this.state.selectedTabIndex}
              onWeightTypeChange={(index) => {
                index === 0
                  ? this.setState({
                      selectedTabIndex: index,
                      weigthplaceholder: "in pounds",
                    })
                  : this.setState({
                      selectedTabIndex: index,
                      weigthplaceholder: "in kg",
                    });
              }}
              onSleepChange={async (text) => {
                await this.setState({ sleepHours: text });
              }}
              onWaterChange={async (text) => {
                await this.setState({ waterContent: text });
              }}
            />
          )}
          {this.state.showingBodyChart && (
            <View>
              <View style={{ alignItems: "center", marginTop: 25 }}>
                <Text style={styles.chooseBelowTxt}>
                  Please choose the sore body muscles from the below Body Chart.
                </Text>
                <Body
                  onMusclePress={(muscle) => this.addMuscleToArray(muscle)}
                  colors={[Colors.LIGHT_RED]}
                  scale={1.1}
                  data={this.state.selectedMuscles}
                />
              </View>
              <View>
                {this.state.selectedMuscles.length > 0 && (
                  <View style={{ marginVertical: 10 }}>
                    <Text style={styles.followingSelected}>
                      You have selected the following muscles
                    </Text>

                    <View style={styles.selctedMuscleContainer}>
                      {this.state.selectedMuscles.map((muscle, index) => {
                        return (
                          <Text style={styles.selectedMuscle}>
                            {capitalizeFirstLetter(muscle?.slug ?? "")}
                            {index !== this.state.selectedMuscles?.length - 1 &&
                              ", "}
                          </Text>
                        );
                      })}
                    </View>
                  </View>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: this.state.selectedMuscles.length > 0 ? 10 : 40,
                  }}
                >
                  <CustomButton
                    type={2}
                    style={{
                      width: DEV_WIDTH * 0.44,
                    }}
                    loaderColor={Colors.WHITE_COLOR}
                    title={"Clear Selection"}
                    onPress={() => {
                      this.clearSelectedMuscles();
                    }}
                  />
                  <CustomButton
                    type={1}
                    isLoading={this.state.savingBodyChart}
                    style={{
                      width: DEV_WIDTH * 0.44,
                    }}
                    loaderColor={Colors.BACKGROUND}
                    title={"Submit"}
                    onPress={() => {
                      this.saveBodyMuscles();
                    }}
                  />
                </View>
              </View>
            </View>
          )}
          {this.state.hasPreExercises && this.state.showingPreExercises && (
            <View style={styles.preExercisesContainer}>
              <Text style={styles.exerciseAndType}>
                Below are some exercises which you should perform based upon
                your muscle soreness, before proceeding with the workouts.
              </Text>
              <Text style={[styles.groupExercise]}>
                {currentPreExercise.exercise_type}
              </Text>
              {/* <Webview
                allowsFullscreenVideo
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                bounces={false}
                style={styles.webView}
                source={{
                  html: this.convertToIframe(currentPreExercise.exercise_video),
                }}
              /> */}

              {currentPreExercise.exercise_video ? (
                <View
                  style={{
                    height: findSize(280),
                    backgroundColor: Colors.VALHALLA,
                    overflow: "hidden",
                    width: DEV_WIDTH - 40,
                    marginVertical: 15,
                  }}
                >
                  <WebView
                    ref={(o) => (this.webViewRef = o)}
                    startInLoadingState={true}
                    allowsFullscreenVideo
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    bounces={false}
                    style={{
                      height: findSize(280),
                      backgroundColor: Colors.VALHALLA,
                      overflow: "hidden",
                      width: DEV_WIDTH - 40,
                    }}
                    source={{
                      html: this.convertToIframe(
                        currentPreExercise.exercise_video
                      ),
                    }}
                  />
                </View>
              ) : null}

              {/* <PrimeButton
                buttonProps={{
                  style: [
                    styles.nextBtn,
                    { backgroundColor: Colors.SKY_COLOR },
                  ],
                  onPress: () => this.nextExercise(),
                }}
                buttonTextProps={{ style: { color: Colors.WHITE_COLOR } }}
                buttonText={"Next"}
                indiColor={Colors.WHITE_COLOR}
              /> */}
              <CustomButton
                type={1}
                onPress={() => {
                  this.nextExercise();
                }}
                title={"Next"}
              />
            </View>
          )}
          {ELEMENT?.type == "EXERCISE" && (
            <View>
              <View
              // style={styles.outerBox}
              >
                <Text style={styles.exerciseAndType}>
                  {ELEMENT?.data.group_name} {ELEMENT?.data.workout_type}
                </Text>
                <Text style={styles.groupExercise}>
                  {ELEMENT?.data.workout_exercise_name}
                </Text>
                {/* <Hr /> */}
                {/* <View style={[styles.headRow, { marginBottom: 4 }]}>
                  <Text style={styles.tableRow}>Sets</Text>
                  <Text style={styles.tableRow}>Reps</Text>
                  <Text style={styles.tableRow}>Load</Text>
                </View>
                <View style={[styles.headRow, { marginTop: 0 }]}>
                  <Text style={styles.tableRow}>
                    {ELEMENT?.data.setNumber} / {ELEMENT?.data.workout_sets}
                  </Text>
                  <Text style={styles.tableRow}>
                    {ELEMENT?.data.workout_reps}{" "}
                    {ELEMENT?.data.workout_repetition_type.toLowerCase()}
                    {ELEMENT?.data.workout_reps_each_side === "1" && " ES"}
                  </Text>
                  <Text style={styles.tableRow}>
                    {ELEMENT?.data.workout_load} kg
                  </Text>
                </View> */}
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={[
                      styles.setTile,
                      { backgroundColor: Colors.BACKGROUND, elevation: 5 },
                    ]}
                  >
                    <Text style={styles.load}>SETS</Text>

                    <Text style={styles.reps}>
                      {ELEMENT?.data.setNumber} / {ELEMENT?.data.workout_sets}
                    </Text>
                    {/* <Text style={styles.setNo}>
                                                {i + 1}
                                              </Text> */}
                  </View>
                  <View
                    style={[
                      styles.setTile,
                      { backgroundColor: Colors.BACKGROUND, elevation: 5 },
                    ]}
                  >
                    <Text style={styles.load}>REPS</Text>

                    <Text style={styles.reps}>
                      {ELEMENT?.data.workout_reps}{" "}
                      {ELEMENT?.data.workout_repetition_type.toLowerCase()}
                      {ELEMENT?.data.workout_reps_each_side === "1" && " ES"}
                    </Text>
                    {/* <Text style={styles.setNo}>
                                                {i + 1}
                                              </Text> */}
                  </View>
                  <View
                    style={[
                      styles.setTile,
                      { backgroundColor: Colors.BACKGROUND, elevation: 5 },
                    ]}
                  >
                    <Text style={styles.load}>LOAD</Text>

                    <Text style={styles.reps}>
                      {ELEMENT?.data.workout_load} kg
                    </Text>
                  </View>
                </View>
                {/* <Webview
                  allowsFullscreenVideo
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  bounces={false}
                  style={styles.webView}
                  source={{
                    html: this.convertToIframe(
                      ELEMENT?.data.workout_exercise_video
                    ),
                  }}
                /> */}
                {ELEMENT?.data?.workout_exercise_video ? (
                  <View
                    style={{
                      height: findSize(280),
                      backgroundColor: Colors.VALHALLA,
                      overflow: "hidden",
                      width: DEV_WIDTH - 40,
                      marginVertical: 15,
                    }}
                  >
                    <WebView
                      ref={(o) => (this.webViewRef = o)}
                      startInLoadingState={true}
                      allowsFullscreenVideo
                      showsVerticalScrollIndicator={false}
                      scrollEnabled={false}
                      bounces={false}
                      style={{
                        height: findSize(280),
                        backgroundColor: Colors.VALHALLA,
                        overflow: "hidden",
                        width: DEV_WIDTH - 40,
                      }}
                      source={{
                        html: this.convertToIframe(
                          ELEMENT?.data.workout_exercise_video
                        ),
                      }}
                    />
                  </View>
                ) : null}
              </View>
              <View
                style={
                  // this.state.index !== 0 &&
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }
                }
              >
                {this.state.index !== 0 && (
                  // <PrimeButton
                  //   buttonProps={{
                  //     style: [
                  //       styles.nextBtn,
                  //       { backgroundColor: Colors.GREEN_COLOR },
                  //     ],
                  //     onPress: () => this.goPrevious(),
                  //   }}
                  //   buttonTextProps={{
                  //     style: {
                  //       color: Colors.WHITE_COLOR,
                  //     },
                  //   }}
                  //   buttonText={"Previous"}
                  // />
                  <CustomButton
                    style={{
                      width: findSize(150),
                    }}
                    type={2}
                    title={"Previous"}
                    onPress={() => {
                      this.goPrevious();
                    }}
                  />
                )}
                {ELEMENT?.data?.setNumber === 1 && (
                  <TouchableOpacity
                    onPress={() => {
                      // console.log('pppppppp', ELEMENT?.data);
                      this.setState({
                        modalVisible: true,
                        selectExeForAlternative: ELEMENT?.data?.id,
                      });
                    }}
                    style={{
                      width: findSize(50),
                      height: findSize(50),
                      borderRadius: findSize(26),
                      borderWidth: 1,
                      borderColor: Colors.WHITE_COLOR,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      name="paperclip"
                      color={Colors.WHITE_COLOR}
                      size={25}
                    />
                  </TouchableOpacity>
                )}
                {/* <PrimeButton
                  buttonProps={{
                    style: [
                      styles.nextBtn,
                      { backgroundColor: Colors.SKY_COLOR },
                    ],
                    onPress: () => this.goNext(),
                  }}
                  buttonTextProps={{
                    style: {
                      color: Colors.WHITE_COLOR,
                    },
                  }}
                  buttonText={"Next"}
                  // indiColor={Colors.WHITE_COLOR}
                /> */}
                <CustomButton
                  style={{
                    width:
                      this.state.index !== 0 ? findSize(150) : findSize(320),
                  }}
                  type={1}
                  title={"Next"}
                  onPress={() => {
                    this.goNext();
                  }}
                />
              </View>
            </View>
          )}
          {ELEMENT?.type == "INPUT" && (
            <View style={{ marginTop: 10 }}>
              {/* <Text style={[styles.heads, { marginVertical: 3 }]}>
                Completed Reps
              </Text>
              <PrimeInput
                inputProps={{
                  onChangeText: (text) => {
                    this.setState({ completedReps: text });
                  },
                  keyboardType: "numeric",
                  placeholder: "0",
                }}
                noAnimation={true}
              /> */}

              <CustomInput
                mainContainerStyle={{ marginVertical: 10 }}
                placeholder={"Completed Reps"}
                inputStyle={{ fontSize: 11, paddingTop: 12 }}
                onChangeText={(text) => {
                  this.setState({ completedReps: text });
                }}
                keyboardType="numeric"
                // value={this.state.teamName}
              />

              {ELEMENT?.data.workout_load_required == "1" && (
                <View>
                  {/* <Text style={[styles.heads, { marginVertical: 3 }]}>
                    Completed Load
                  </Text>
                  <PrimeInput
                    inputProps={{
                      onChangeText: (text) => {
                        this.setState({ completedLoad: text });
                      },
                      keyboardType: "numeric",
                      placeholder: "0",
                    }}
                    noAnimation={true}
                  /> */}
                  <CustomInput
                    mainContainerStyle={{ marginVertical: 10 }}
                    placeholder={"Completed Load"}
                    inputStyle={{ fontSize: 11, paddingTop: 12 }}
                    onChangeText={(text) => {
                      this.setState({ completedLoad: text });
                    }}
                    keyboardType="numeric"
                    // value={this.state.teamName}
                  />
                </View>
              )}
              {/* <PrimeButton
                buttonProps={{
                  style: [
                    styles.nextBtn,
                    { backgroundColor: Colors.SKY_COLOR },
                  ],
                  onPress: () => {
                    if (this.state.previousIndex > 0) {
                      this.setState({
                        previousIndex: this.state.previousIndex - 1,
                        index: this.state.index + 1,
                      });
                    } else {
                      this.completeWorkoutExercise();
                    }
                  },
                }}
                buttonTextProps={{
                  style: {
                    color: Colors.WHITE_COLOR,
                  },
                }}
                buttonText={"Next"}
                loading={this.state.savingRepsLoads}
                indiColor={Colors.BLACK_COLOR}
              /> */}
              <CustomButton
                title={"Next"}
                type={1}
                isLoading={this.state.savingRepsLoads}
                onPress={() => {
                  if (this.state.previousIndex > 0) {
                    this.setState({
                      previousIndex: this.state.previousIndex - 1,
                      index: this.state.index + 1,
                    });
                  } else {
                    this.completeWorkoutExercise();
                  }
                }}
              />
            </View>
          )}
          {ELEMENT?.type == "REST" && (
            <View style={{ paddingTop: DEV_HEIGHT * 0.24 }}>
              <Text style={styles.groupExercise}>Rest</Text>
              <Text style={styles.timerTxt}>{Number(restTime)}</Text>
              <Text style={styles.exerciseAndType}>Seconds remaining</Text>
              {/* <TouchableOpacity
                style={{ alignSelf: "flex-end", marginTop: DEV_HEIGHT / 4 }}
                onPress={() => this.skipRestTime()}
              >
                <Text
                  style={{
                    color: Colors.WHITE_COLOR,
                    fontSize: 14,
                    // fontFamily: ROBO_ITALIC,
                    // textDecorationLine: 'underline',
                    padding: 10,
                    paddingHorizontal: 20,
                    backgroundColor: Colors.SKY_COLOR,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: Colors.LIGHT_GREY,
                  }}
                >
                  Skip Rest
                </Text>
              </TouchableOpacity> */}
              <CustomButton
                style={{ marginTop: 100 }}
                type={1}
                title="Skip Rest"
                onPress={() => this.skipRestTime()}
              />
            </View>
          )}
          {hasCompletedWorkouts && (
            <View>
              <RateIntensity
                selectedIntensity={this.state.selectedIntensity}
                onIntensityPress={(index) =>
                  this.selectionOnIntensity(index + 1)
                }
                submittingIntensity={this.state.submittingIntensity}
                onSubmit={() => this.completeSingleDayWorkout()}
                showAccomps={this.state.showAccomps}
              />
              {this.state.showAccomps && (
                <View>
                  {/* <Text style={styles.wellInfo}>Well-Being Information</Text>
                  <View style={styles.wellTxtRow}>
                    {FINAL_WELL.map((item) => {
                      return (
                        <View>
                          <Text style={styles.heads}>{item.name}</Text>
                        </View>
                      );
                    })}
                  </View>
                  <View style={styles.wellRow}>
                    <View style={styles.wellBg}>
                      <Text style={styles.wellTxt}>
                        {RoundOff(wellBeingResult.freshness_level_avg)}
                      </Text>
                    </View>
                    <View style={styles.wellBg}>
                      <Text style={styles.wellTxt}>
                        {RoundOff(wellBeingResult.soreness_level_avg)}
                      </Text>
                    </View>
                    <View style={styles.wellBg}>
                      <Text style={styles.wellTxt}>
                        {RoundOff(wellBeingResult.fatigue_level_avg)}
                      </Text>
                    </View>
                    <View style={styles.wellBg}>
                      <Text style={styles.wellTxt}>
                        {RoundOff(wellBeingResult.sleep_level_avg)}
                      </Text>
                    </View>
                  </View> */}

                  <TildView degree={"5deg"}>
                    <View
                      style={{
                        padding: 15,
                      }}
                    >
                      <Text style={styles.heads}>Well-Being Information</Text>
                      <View
                        style={{
                          backgroundColor: Colors.INPUT_PLACE,
                          height: 1,
                          width: "100%",
                          marginBottom: 15,
                        }}
                      />

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.intensityName}>Fresh</Text>
                          <View style={styles.scaleBtn1}>
                            <Text style={[styles.scaleTxt]}>
                              {RoundOff(wellBeingResult.freshness_level_avg)}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.intensityName}>Sore</Text>
                          <View style={styles.scaleBtn1}>
                            <Text style={[styles.scaleTxt]}>
                              {RoundOff(wellBeingResult.soreness_level_avg)}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.intensityName}>Fatigue</Text>
                          <View style={styles.scaleBtn1}>
                            <Text style={[styles.scaleTxt]}>
                              {RoundOff(wellBeingResult.fatigue_level_avg)}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.intensityName}>Sleep</Text>
                          <View style={styles.scaleBtn1}>
                            <Text style={[styles.scaleTxt]}>
                              {RoundOff(wellBeingResult.sleep_level_avg)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TildView>

                  <TildView degree={"5deg"}>
                    <View
                      style={{
                        padding: 15,
                      }}
                    >
                      <Text style={styles.heads}>Accomplishments</Text>
                      <View
                        style={{
                          backgroundColor: Colors.INPUT_PLACE,
                          height: 1,
                          width: "100%",
                          marginBottom: 15,
                        }}
                      />

                      <View style={styles.circularRow}>
                        <View
                          style={{
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={[
                              styles.intensityName,
                              {
                                marginBottom: 8,
                              },
                            ]}
                          >
                            Sets
                          </Text>
                          <AnimatedCircularProgress
                            size={100}
                            width={7}
                            fill={
                              accompsResult.workout_accomplishments_sets_percent
                            }
                            tintColor={Colors.GREEN_COLOR}
                            backgroundColor={Colors.BACKGROUND}
                            style={{ elevation: 5 }}
                          >
                            {(fill) => (
                              <Text style={styles.percent}>
                                {
                                  accompsResult.workout_accomplishments_sets_percent
                                }
                                %
                              </Text>
                            )}
                          </AnimatedCircularProgress>
                        </View>
                        <View
                          style={{
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={[
                              styles.intensityName,
                              {
                                marginBottom: 8,
                              },
                            ]}
                          >
                            Reps
                          </Text>
                          <AnimatedCircularProgress
                            size={100}
                            width={7}
                            fill={
                              accompsResult.workout_accomplishments_reps_percent
                            }
                            tintColor={Colors.YELLOW_COLOR}
                            backgroundColor={Colors.BACKGROUND}
                            style={{ elevation: 5 }}
                          >
                            {(fill) => (
                              <Text style={styles.percent}>
                                {accompsResult.workout_accomplishments_reps_percent >
                                100
                                  ? ">100"
                                  : accompsResult.workout_accomplishments_reps_percent}
                                %
                              </Text>
                            )}
                          </AnimatedCircularProgress>
                        </View>
                        <View
                          style={{
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={[
                              styles.intensityName,
                              {
                                marginBottom: 8,
                              },
                            ]}
                          >
                            Load
                          </Text>

                          <AnimatedCircularProgress
                            size={100}
                            width={7}
                            fill={
                              accompsResult.workout_accomplishments_load_percent
                            }
                            tintColor={Colors.RED_COLOR}
                            backgroundColor={Colors.BACKGROUND}
                            style={{ elevation: 5 }}
                          >
                            {(fill) => (
                              <Text style={styles.percent}>
                                {accompsResult.workout_accomplishments_load_percent >
                                100
                                  ? ">100"
                                  : accompsResult.workout_accomplishments_load_percent}
                                %
                              </Text>
                            )}
                          </AnimatedCircularProgress>
                        </View>
                      </View>
                    </View>
                  </TildView>

                  <CustomButton
                    title={"Done"}
                    onPress={() => {
                      this.props.navigation?.goBack();
                    }}
                    type={1}
                  />
                </View>
              )}
            </View>
          )}
        </Container>
        <AlternativeExerciseModal
          visible={this.state.modalVisible}
          onClose={() =>
            this.setState({
              modalVisible: false,
              selectExeForAlternative: null,
            })
          }
          onSelect={(item) => this.onAlternativeSelect(item)}
          navigation={this.props.navigation}
          select={true}
          alternativeId={this.state.selectExeForAlternative}
        />
      </>
    );
  }
}
