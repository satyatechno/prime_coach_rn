import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import HamBurger from "../../../../components/HamBurger";
import { Colors } from "../../../../constants/Colors";
import Modall from "../../../../components/Modall";
import { standardPostApi } from "../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../../../../components/Loader";
import Select from "../../../../components/Select";
import DatePicker from "../../../../components/DatePicker";
import PrimeInput from "../../../../components/PrimeInput";
import Icon from "react-native-vector-icons/AntDesign";
import moment from "moment";
import {
  DEV_HEIGHT,
  IS_IOS,
  DEV_WIDTH,
} from "../../../../constants/DeviceDetails";
import {
  ROBO_BOLD,
  ROBO_MEDIUM,
  ROBO_ITALIC,
  POP_MEDIUM,
  POP_REGULAR,
} from "../../../../constants/Fonts";
import { Toaster } from "../../../../components/Toaster";
import CustomInput from "../../../../components/customInput/CustomInput";
import { findSize } from "../../../../utils/helper";
import CustomButton from "../../../../components/customButton/CustomButton";

function TimeChanger(props) {
  return (
    <View style={styles.iconsView}>
      <TouchableOpacity onPress={props.onIncrease} style={{ padding: 4 }}>
        <Icon name="caretup" size={20} color={Colors.PLACEHOLDER} />
      </TouchableOpacity>
      <TouchableOpacity style={{ padding: 4 }} onPress={props.onDecrease}>
        <Icon name="caretdown" size={20} color={Colors.PLACEHOLDER} />
      </TouchableOpacity>
    </View>
  );
}

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoading: true,
      activityPicker: [],
      selectedActivity: null,
      activityDuration: "",
      date: "",
      hasSetDate: false,
      selectedIntensity: 1,
      savingActivity: false,
      currentWeek: null,
      currentProgram: null,
      customActivity: "",
    };
    this.fetchPickerData();
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  async componentDidMount() {
    const current_week = await AsyncStorage.getItem("@CURRENT_WEEK");
    const current_program = await AsyncStorage.getItem("@CURRENT_PROGRAM");
    await this.setState({
      currentWeek: JSON.parse(current_week),
      currentProgram: JSON.parse(current_program),
    });
  }

  fetchPickerData = async () => {
    this.setState({ dataLoading: true });
    try {
      const res = await standardPostApi(
        "pre_add_user_activity",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
        },
        true
      );
      console.log("data===>", JSON.stringify(res.data, null, 2));
      if (res.data.code == 200) {
        this.setState({
          activityPicker: res.data.data?.user_activity_type,
          dataLoading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
  };

  verifyPicker = () => {
    if (this.state.selectedActivity === null) {
      Toaster("Please choose an Activity Type.", Colors.LIGHT_RED);
      return false;
    } else if (
      this.state.selectedActivity == 0 &&
      !this.state.customActivity?.trim()?.length
    ) {
      Toaster("Custom activity type is required.", Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  verifyDuration = () => {
    if (this.state.activityDuration <= 0) {
      Toaster(
        "Activity duration can not be zero or less then zero.",
        Colors.LIGHT_RED
      );
      return false;
    }
    return true;
  };

  verifyDate = () => {
    if (!this.state.date) {
      Toaster("Please select a date for the Activity.", Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  verifyIntensity = () => {
    if (!this.state.selectedIntensity) {
      Toaster("Please select an Activity Intensity.", Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  checkWeekProgram = () => {
    const { currentWeek, currentProgram } = this.state;
    if (currentProgram === null || currentWeek === null) {
      Toaster("There are no workouts assgined to you yet.", Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  addAthleteActivity = async () => {
    const {
      selectedActivity,
      date,
      selectedIntensity,
      activityDuration,
      customActivity,
    } = this.state;
    const _DATE = moment(this.toTimestamp(date) * 1000)
      .format("YYYY-MM-DD")
      .toString();
    if (
      this.checkWeekProgram() &&
      this.verifyPicker() &&
      this.verifyDuration() &&
      this.verifyDate() &&
      this.verifyIntensity()
    ) {
      this.setState({ savingActivity: true });
      try {
        const res = await standardPostApi(
          "add_user_activity",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            annual_training_program_id: this.state.currentProgram.id,
            annual_training_program_week_id: this.state.currentWeek.id,
            activity_type: selectedActivity,
            activity_duration: activityDuration,
            activity_date: moment(date).format("YYYY-MM-DD"),
            activity_intensity: selectedIntensity,
            customize_activity: customActivity,
          },
          true
        );
        if (res.data.code == 200) {
          this.setState({
            savingActivity: false,
            activityDuration: 1,
            selectedIntensity: null,
          });
          this.fetchPickerData();
          Toaster("A new activity has been added.", Colors.GREEN_COLOR);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  selectionOnPress = async (intensity) => {
    await this.setState({ selectedIntensity: intensity });
  };

  render() {
    const {
      dataLoading,
      activityPicker,
      activityDuration,
      selectedIntensity,
      savingActivity,
      selectedActivity,
      date,
    } = this.state;
    console.log("cccccc", this.state.customActivity);
    return (
      <HamBurger onMenuPress={() => this.props.navigation.openDrawer()}>
        {dataLoading ? (
          <Loader loaderProps={{ style: { marginVertical: DEV_HEIGHT / 4 } }} />
        ) : (
          <View>
            <Select
              pickerProps={{
                onValueChange: async (value) => {
                  await this.setState({ selectedActivity: value });
                },
              }}
              pickerItems={activityPicker ?? []}
              pickerValue={this.state.selectedActivity}
              placeholder={"Select avtivity"}
            />
            {selectedActivity == 0 ? (
              <CustomInput
                mainContainerStyle={{ marginVertical: 10 }}
                placeholder={"Custom activity type"}
                inputStyle={{ fontSize: 11, paddingTop: 12 }}
                onChangeText={(text) => {
                  this.setState({ customActivity: text });
                }}
                value={this.state.customActivity}
              />
            ) : null}
            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              placeholder={"Duration (in minutes)"}
              inputStyle={{ fontSize: 11, paddingTop: 12 }}
              onChangeText={(text) => {
                this.setState({ activityDuration: text });
              }}
              value={activityDuration}
            />
            <DatePicker
              dateTimeProps={{
                onChange: async (date) => {
                  await this.setState({ date: date });
                },
              }}
              showDarkBg
              placeholder="Select Date"
              currentDate={date}
            />
            <Text
              style={{
                color: Colors.WHITE_COLOR,
                fontFamily: POP_MEDIUM,
                marginVertical: 10,
                fontSize: findSize(15),
              }}
            >
              Intensity
            </Text>
            <NumberSelect
              onChange={(value) => this.setState({ selectedIntensity: value })}
              seleted={selectedIntensity}
            />
            <CustomButton
              title={"Save"}
              type={1}
              isLoading={savingActivity}
              onPress={() => {
                this.addAthleteActivity();
              }}
            />
          </View>
        )}

        {/* <Modall
          crossPress={() => this.goBack()}
          savePress={() => this.addAthleteActivity()}
          btnTxt={'Save'}
          title={'Add Activity'}
          removePadding={true}
          containerProps={{ style: { flex: 6 / 7, marginVertical: 25 } }}
          loading={savingActivity}
        >
          {dataLoading ? (
            <Loader
              loaderProps={{ style: { marginVertical: DEV_HEIGHT / 4 } }}
            />
          ) : (
            <View>
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.heads}>Activity Type</Text>
                <Select
                  pickerProps={{
                    onValueChange: async (value) => {
                      await this.setState({ selectedActivity: value });
                    },
                  }}
                  pickerItems={activityPicker.pickerArray}
                  pickerValue={this.state.selectedActivity}
                />
                <Text style={styles.heads}>
                  Duration{' '}
                  <Text
                    style={[
                      styles.heads,
                      { fontSize: 13, fontWeight: 'normal' },
                    ]}
                  >
                    (in minutes)
                  </Text>
                </Text>
                <PrimeInput
                  inputProps={{
                    onChangeText: (text) => {
                      this.setState({ activityDuration: Number(text) });
                    },
                    keyboardType: 'number-pad',
                    value: this.state.activityDuration.toString(),
                  }}
                  noAnimation={true}
                />
                <TimeChanger
                  onIncrease={() =>
                    this.setState({ activityDuration: activityDuration + 1 })
                  }
                  onDecrease={() =>
                    this.setState({ activityDuration: activityDuration - 1 })
                  }
                />
                <Text style={[styles.heads, { marginTop: -10 }]}>Date</Text>
                <DatePicker
                  dateTimeProps={{
                    onChange: async (date) => {
                      await this.setState({ hasSetDate: true, date: date });
                    },
                  }}
                  showDarkBg
                  currentDate={date}
                  // minDate={new Date()}
                  maxDate={new Date('2050-01-01')}
                />
                <Text style={[styles.heads, { marginBottom: 3 }]}>
                  Intensity
                </Text>
                <View style={styles.intensityLevel}>
                  <Text style={styles.intensityName}>low</Text>
                  <Text style={styles.intensityName}>medium</Text>
                  <Text style={styles.intensityName}>high</Text>
                </View>
                <View style={styles.intensityContainer}>
                  {Array.from(Array(10).keys()).map((index) => (
                    <View>
                      <TouchableOpacity
                        onPress={() => this.selectionOnPress(index + 1)}
                        style={[
                          styles.scaleBtn,
                          selectedIntensity === index + 1 && {
                            backgroundColor: '#172f44',
                          },
                        ]}
                        disabled={selectedIntensity === index + 1}
                      >
                        <Text
                          style={[
                            styles.scaleTxt,
                            selectedIntensity === index + 1 && {
                              color: Colors.GREEN_COLOR,
                            },
                          ]}
                        >
                          {index + 1}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </Modall> */}
      </HamBurger>
    );
  }
}

const NumberSelect = ({ count = 10, seleted, onChange }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
      }}
    >
      {Array(count)
        .fill(" ")
        .map((i, index) => {
          return (
            <CustomButton
              onPress={() => {
                onChange(index + 1);
              }}
            >
              <View
                style={{
                  height: findSize(30),
                  width: findSize(30),
                  borderRadius: findSize(16),
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor:
                    seleted == index + 1 ? Colors.ORANGE : Colors.VALHALLA,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: POP_REGULAR,
                    color:
                      seleted == index + 1
                        ? Colors.WHITE_COLOR
                        : Colors.INPUT_PLACE,
                    marginTop: 2,
                  }}
                >
                  {index + 1}
                </Text>
              </View>
            </CustomButton>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  home: {
    color: Colors.WHITE_COLOR,
    fontSize: 30,
    textAlign: "center",
    fontFamily: ROBO_BOLD,
    marginBottom: 10,
  },
  heads: {
    fontSize: 15,
    fontFamily: ROBO_BOLD,
    color: Colors.BLACK_COLOR,
    marginBottom: 5,
  },
  iconsView: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: "78%",
    top: IS_IOS ? 118 : 125,
    zIndex: 9999,
  },
  scaleBtn: {
    height: DEV_HEIGHT * 0.038,
    width: DEV_WIDTH * 0.07,
    backgroundColor: Colors.BLACK_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  scaleTxt: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_MEDIUM,
    fontSize: 13,
  },
  intensityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  intensityLevel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  intensityName: {
    fontFamily: ROBO_ITALIC,
    marginBottom: 1,
  },
});
