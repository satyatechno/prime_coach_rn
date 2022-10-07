import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { DEV_HEIGHT, DEV_WIDTH } from "../../../../../constants/DeviceDetails";
import { Colors } from "../../../../../constants/Colors";
import Container from "../../../../../components/Container";
import { standardPostApi } from "../../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import Spinnner from "../../../../../components/Spinnner";
import Icon from "react-native-vector-icons/AntDesign";
import {
  POP_MEDIUM,
  POP_REGULAR,
  ROBO_MEDIUM,
  ROBO_REGULAR,
} from "../../../../../constants/Fonts";
import Modal from "react-native-modal";
import PrimeInput from "../../../../../components/PrimeInput";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Toaster } from "../../../../../components/Toaster";
import IconChev from "react-native-vector-icons/FontAwesome5";
import { findHeight, findSize } from "../../../../../utils/helper";
import CustomButton from "../../../../../components/customButton/CustomButton";
import TildView from "../../../../../components/tildView/TildView";
export class TeamEvent extends Component {
  state = {
    selectedDate: moment().format("YYYY-MM-DD"),
    markedDates: {},
    selectedWorkout: [],
    workoutData: [],
    isLoading: false,
    visible: false,
    description: "",
    eventName: "",
    showClock: false,
    time: new Date(),
    addEventLoading: false,
    eventId: null,
    selectedEvent: [],
    showWorkouts: false,
    showEvents: false,
    eventActionType: "add",
    endTime: new Date(),
    showEndClock: false,
  };
  onLoadData = async (month, year) => {
    this.setState({ isLoading: true });
    const { navigation } = this.props;
    try {
      const res = await standardPostApi(
        "assigned_workout_calender",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          calender_month: month,
          calender_year: year,
          access_team_id: navigation.getParam("teamData")?.id,
        },
        true
      );
      if (res.data.code == 200) {
        this.createMarkedDates(res.data.data);
        this.setState({ isLoading: false, workoutData: res.data.data });
        this.onDayPress({
          day: moment(this.state.selectedDate, "YYYY-MM-DD").toDate().getDate(),
          dateString: this.state.selectedDate,
        });
      }
    } catch (error) {
      this.setState({ isLoading: false });
      console.log(error);
    }
  };
  createMarkedDates = (data) => {
    let TempMark = {};
    for (var i = 0; i < data?.length; i++) {
      if (
        data[i]?.assigned_workout.length > 0 ||
        data[i]?.assigned_user_events.length > 0
      ) {
        TempMark = {
          ...TempMark,
          [data[i]?.date]: {
            marked: true,
          },
        };
      }
    }
    this.setState({ markedDates: TempMark });
  };
  componentDidMount() {
    let d = new Date();
    this.onLoadData(d.getMonth() + 1, d.getFullYear());
    console.log("TEAM DATA", this.props.navigation.getParam("teamData"));
  }
  onDayPress = (day) => {
    console.log("dateeeee", day);
    this.setState({ showEvents: false, showWorkouts: false });
    let selected_workout = this.state.workoutData.find(
      (x) => x.day_number === day.day && x.assigned_user_events?.length > 0
    );
    this.setState({
      selectedDate: day.dateString,

      selectedEvent: selected_workout?.assigned_user_events
        ? selected_workout?.assigned_user_events?.sort(function (a, b) {
            let x = moment(
              a?.event_date + " " + a?.event_time,
              "YYYY-MM-DD HH:mm:ss"
            )
              .toDate()
              .getTime();
            let y = moment(
              b?.event_date + " " + b?.event_time,
              "YYYY-MM-DD HH:mm:ss"
            )
              .toDate()
              .getTime();
            return x - y;
          })
        : [],
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
      eventName: "",
      description: "",
      time: new Date(),
      eventId: null,
      eventActionType: "add",
      endTime: new Date(),
    });
  };
  selectTime = () => {
    this.setState({ showClock: true });
  };
  selectEndTime = () => {
    this.setState({ showEndClock: true });
  };
  verifyDetails = () => {
    const {
      eventName,
      description,
      selectedDate,
      time,
      eventActionType,
      endTime,
    } = this.state;
    let Time = moment(time).format("HH:mm:ss");
    const StartTimeStamp = moment(
      selectedDate + " " + Time,
      "YYYY-MM-DD HH:mm:ss"
    )
      .toDate()
      .getTime();
    let EndTime = moment(endTime).format("HH:mm:ss");
    const EndTimeStamp = moment(
      selectedDate + " " + EndTime,
      "YYYY-MM-DD HH:mm:ss"
    )
      .toDate()
      .getTime();
    if (!eventName.trim().length > 0 && eventActionType !== "delete") {
      Toaster("Please provide a name for the event.", Colors.LIGHT_RED);
      return false;
    }

    if (!description.trim().length > 0 && eventActionType !== "delete") {
      Toaster("Please provide description.", Colors.LIGHT_RED);
      return false;
    }
    if (eventActionType !== "delete") {
      if (StartTimeStamp < moment().toDate().getTime()) {
        Toaster("You cannot add an event for an older time.", Colors.LIGHT_RED);
        return false;
      }
    }
    if (eventActionType !== "delete") {
      if (EndTimeStamp < StartTimeStamp) {
        Toaster("End time can not be older than start time.", Colors.LIGHT_RED);
        return false;
      }
    }

    return true;
  };
  onAddEvent = async (action) => {
    this.setState({ eventActionType: action });
    const {
      eventName,
      time,
      description,
      selectedDate,
      eventId,
      eventActionType,
      endTime,
    } = this.state;
    if (this.verifyDetails()) {
      this.setState({ addEventLoading: true });
      try {
        const res = await standardPostApi(
          "calendar_events_add_update",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            assigned_team_id: this.props.navigation.getParam("teamData")?.id,
            event_id: eventId,
            event_name: eventName,
            event_description: description,
            event_date: moment(selectedDate).format("YYYY-MM-DD"),
            event_time: moment(time).format("HH:mm:ss"),
            event_end_time: moment(endTime).format("HH:mm:ss"),
            api_action: action,
          },
          true,
          false
        );
        if (res.data.code == 301) {
          this.setState({
            addEventLoading: false,
            eventName: "",
            description: "",
            time: new Date(),
            endTime: new Date(),
            eventId: null,
          });
          Toaster(res.data.message, Colors.LIGHT_RED);
        }
        if (res.data.code == 200) {
          this.setState({
            addEventLoading: false,
            visible: false,
            eventName: "",
            description: "",
            time: new Date(),
            eventId: null,
            endTime: new Date(),
            eventActionType: "add",
          });
          Toaster(res.data.message, Colors.GREEN_COLOR);
          this.onLoadData(
            moment(selectedDate, "YYYY-MM-DD").toDate().getMonth() + 1,
            moment(selectedDate, "YYYY-MM-DD").toDate().getFullYear()
          );
        }
      } catch (error) {
        this.setState({ addEventLoading: false });
        console.log(error);
      }
    }
  };
  onViewEvent = (item) => {
    this.props?.navigation?.navigate("AddEvent", {
      date: this.state.selectedDate,
      teamId: this.props.navigation.getParam("teamData")?.id,
      onLoadData: this.onLoadData,
      event: item,
    });
    // this.setState({
    //   eventId: item?.id,
    //   eventName: item?.event_name,
    //   time: moment(item?.event_time, "HH:mm:ss").toDate(),
    //   endTime: moment(item?.event_end_time, "HH:mm:ss").toDate(),
    //   description: item?.event_description,
    //   visible: true,
    //   eventActionType: "update",
    // });
  };
  render() {
    const {
      selectedDate,
      markedDates,
      selectedWorkout,
      isLoading,
      addEventLoading,
      selectedEvent,
    } = this.state;

    const TeamData = this.props.navigation.getParam("teamData");
    const Role = this.props.navigation.getParam("role");
    let todayDate = moment(
      moment().format("YYYY-MM-DD"),
      "YYYY-MM-DD"
    ).toDate();
    return (
      <>
        <Container
          backFn={() => this.props.navigation.goBack()}
          title="Event"
          style={{ paddingHorizontal: 0 }}
        >
          <View style={styles.container}>
            {/* <TouchableOpacity onPress={() => this.props.navigation.pop(2)}>
              <Text style={styles.teamName}>{TeamData.team_name}</Text>
            </TouchableOpacity> */}
            <Calendar
              hideExtraDays={true}
              current={new Date()}
              markedDates={{
                ...markedDates,
                [selectedDate]: {
                  selected: true,
                },
              }}
              onDayPress={this.onDayPress}
              onMonthChange={(month) =>
                this.onLoadData(month?.month, month?.year)
              }
              renderArrow={(direction) => (
                <View
                  style={{
                    backgroundColor: Colors.VALHALLA,
                    height: findSize(28),
                    width: findSize(28),
                    borderRadius: findSize(15),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name={`arrow${direction}`}
                    color={Colors.WHITE_COLOR}
                    size={17}
                  />
                </View>
              )}
              style={styles.calendar}
              theme={{
                calendarBackground: Colors.BACKGROUND,
                selectedDayBackgroundColor: Colors.ORANGE,
                selectedDayTextColor: Colors.WHITE_COLOR,
                dayTextColor: Colors.WHITE_COLOR,

                dotColor: Colors.ORANGE,
                selectedDotColor: Colors.WHITE_COLOR,
                arrowColor: Colors.LIGHT_RED,
                disabledArrowColor: Colors.LIGHT_GREY,
                monthTextColor: Colors.WHITE_COLOR,
                textDayFontSize: findSize(13),
                textDayStyle: {
                  textAlignVertical: "center",
                  paddingTop: 4,
                },
                textDayFontFamily: POP_REGULAR,
                textMonthFontSize: findSize(21),
                textMonthFontFamily: POP_MEDIUM,
                "stylesheet.calendar.header": {
                  week: {
                    flexDirection: "row",
                    justifyContent: "space-around",
                    backgroundColor: Colors.VALHALLA,
                    alignItems: "center",
                    paddingTop: 5,
                    paddingBottom: 4,
                  },
                  dayHeader: {
                    color: Colors.INPUT_PLACE,
                    fontFamily: POP_REGULAR,
                    fontSize: findSize(13),
                  },
                },
                "stylesheet.calendar.main": {
                  container: {
                    paddingLeft: 0,
                    paddingRight: 0,
                  },
                },
              }}
              firstDay={1}
            />
            <View
              style={{
                backgroundColor: Colors.VALHALLA,
                borderRadius: findSize(25),
                marginHorizontal: 20,
                padding: 20,
                paddingTop: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: Colors.WHITE_COLOR,
                    fontFamily: POP_MEDIUM,
                    fontSize: findSize(19),
                  }}
                >
                  {moment(selectedDate, "YYYY-MM_DD").calendar(null, {
                    lastDay: "[Yesterday's]",
                    sameDay: "[Today's]",
                    nextDay: "[Tomorrow's]",
                    lastWeek: "MMMM Do",
                    nextWeek: "MMMM Do",
                    sameElse: "MMMM Do",
                  })}{" "}
                  Event
                </Text>
                <CustomButton
                  type={1}
                  style={{
                    backgroundColor: Colors.ORANGE,
                    width: findSize(130),
                    height: findHeight(40),
                  }}
                  title={"Add Event"}
                  textStyle={{
                    fontSize: findSize(15),
                  }}
                  onPress={() => {
                    this.props?.navigation?.navigate("AddEvent", {
                      date: selectedDate,
                      teamId: this.props.navigation.getParam("teamData")?.id,
                      onLoadData: this.onLoadData,
                    });
                    // this.setState({
                    //   visible: true,
                    //   eventName: "",
                    //   description: "",
                    //   time: new Date(),
                    //   endTime: new Date(),
                    //   eventId: null,
                    //   eventActionType: "add",
                    // });
                  }}
                />
              </View>

              {selectedWorkout.length === 0 && selectedEvent.length === 0 ? (
                <View>
                  <Image
                    source={require("../../../../../../assets/images/no-event.png")}
                    style={{
                      height: findSize(270),
                      width: findSize(270),
                      marginVertical: findSize(10),
                    }}
                  />
                  <Text
                    style={{
                      color: Colors.WHITE_COLOR,
                      fontFamily: POP_MEDIUM,
                      fontSize: findSize(19),
                      textAlign: "center",
                      marginTop: 5,
                    }}
                  >
                    No event on{" "}
                    {moment(selectedDate, "YYYY-MM_DD").format("MMMM Do")}
                  </Text>
                </View>
              ) : (
                <View>
                  {/* <Text style={styles.workoutText}>
                    Team Events on{" "}
                    {moment(selectedDate, "YYYY-MM_DD").format("MMMM Do")}
                  </Text> */}
                  {/* <View style={{ marginVertical: 15 }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          showEvents: !this.state.showEvents,
                        })
                      }
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <IconChev
                        name={
                          this.state.showEvents
                            ? "chevron-circle-up"
                            : "chevron-circle-down"
                        }
                        size={22}
                        color={Colors.SKY_COLOR}
                      />
                      <Text style={styles.weekChev}>Events</Text>
                    </TouchableOpacity>
                  </View> */}

                  <>
                    {/* {Role == "Assistant Coach" ? null : (
                        <View>
                          {todayDate.getTime() <=
                          moment(selectedDate, "YYYY-MM-DD")
                            .toDate()
                            .getTime() ? (
                            <TouchableOpacity
                              onPress={() =>
                                this.setState({
                                  visible: true,
                                  eventName: "",
                                  description: "",
                                  time: new Date(),
                                  endTime: new Date(),
                                  eventId: null,
                                  eventActionType: "add",
                                })
                              }
                            >
                              <Text style={styles.addEvent}>Add Event</Text>
                            </TouchableOpacity>
                          ) : (
                            <Text
                              style={{
                                color: Colors.WHITE_COLOR,
                                textAlign: "center",
                              }}
                            >
                              {" "}
                              You cannot add an event for an older date.
                            </Text>
                          )}
                        </View>
                      )} */}
                    {selectedEvent.length === 0 ? (
                      <View>
                        <Image
                          source={require("../../../../../../assets/images/no-event.png")}
                          style={{
                            height: findSize(270),
                            width: findSize(270),
                            marginVertical: findSize(10),
                          }}
                        />
                        <Text
                          style={{
                            color: Colors.WHITE_COLOR,
                            fontFamily: POP_MEDIUM,
                            fontSize: findSize(19),
                            textAlign: "center",
                            marginTop: 5,
                          }}
                        >
                          No event on{" "}
                          {moment(selectedDate, "YYYY-MM_DD").format("MMMM Do")}
                        </Text>
                      </View>
                    ) : (
                      <>
                        {selectedEvent.map((item, index) => (
                          <TildView
                            tildViewStyle={{
                              backgroundColor: Colors.BACKGROUND,
                              borderRadius: findSize(15),
                            }}
                            mainViewStyle={{
                              backgroundColor: Colors.TILD_VIEW,
                              borderRadius: findSize(15),
                            }}
                            degree={"5deg"}
                          >
                            <View style={styles.viewWorkout}>
                              <Text style={styles.workoutCountText}>
                                {item?.event_name}
                              </Text>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  marginTop: 5,
                                }}
                              >
                                <View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Image
                                      source={require("../../../../../../assets/images/clock.png")}
                                      style={{
                                        height: findSize(9),
                                        width: findSize(9),
                                        marginEnd: 3,
                                      }}
                                    />
                                    <Text
                                      style={{
                                        color: Colors.INPUT_PLACE,
                                        fontSize: 10,
                                        fontFamily: POP_REGULAR,
                                      }}
                                    >
                                      From
                                    </Text>
                                  </View>
                                  <Text
                                    style={{
                                      color: Colors.WHITE_COLOR,
                                      fontSize: 10,
                                      fontFamily: POP_REGULAR,
                                    }}
                                  >
                                    {moment(
                                      item?.event_time,
                                      "HH:mm:ss"
                                    ).format("hh:mm A")}
                                  </Text>
                                </View>

                                <View style={{ marginStart: 30 }}>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Image
                                      source={require("../../../../../../assets/images/clock.png")}
                                      style={{
                                        height: findSize(9),
                                        width: findSize(9),
                                        marginEnd: 3,
                                      }}
                                    />
                                    <Text
                                      style={{
                                        color: Colors.INPUT_PLACE,
                                        fontSize: 10,
                                        fontFamily: POP_REGULAR,
                                      }}
                                    >
                                      To
                                    </Text>
                                  </View>
                                  <Text
                                    style={{
                                      color: Colors.WHITE_COLOR,
                                      fontSize: 10,
                                      fontFamily: POP_REGULAR,
                                    }}
                                  >
                                    {moment(
                                      item?.event_end_time,
                                      "HH:mm:ss"
                                    ).format("hh:mm a")}
                                  </Text>
                                </View>
                              </View>
                              <Text
                                style={{
                                  color: Colors.INPUT_PLACE,
                                  fontFamily: POP_REGULAR,
                                  fontSize: 9,
                                  marginBottom: 7,
                                  marginTop: 2,
                                }}
                              >
                                {item?.event_description}
                              </Text>
                              <CustomButton
                                onPress={() => this.onViewEvent(item)}
                                title={"Edit Event"}
                                textStyle={{
                                  fontSize: findSize(10),
                                }}
                                type={2}
                                style={{
                                  width: findSize(80),
                                  height: findHeight(25),
                                  marginVertical: 0,
                                }}
                              ></CustomButton>
                            </View>
                          </TildView>
                        ))}
                      </>
                    )}
                  </>
                </View>
              )}
            </View>
            {selectedWorkout.length === 0 && selectedEvent.length === 0 ? (
              <>
                {/* <Text style={styles.workoutText}>
                  No Event on{" "}
                  {moment(selectedDate, "YYYY-MM_DD").format("MMMM Do")}
                </Text>
                {Role == "Assistant Coach" ? null : (
                  <View>
                    {todayDate.getTime() <=
                    moment(selectedDate, "YYYY-MM-DD").toDate().getTime() ? (
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            visible: true,
                            eventName: "",
                            description: "",
                            time: new Date(),
                            endTime: new Date(),
                            eventId: null,
                            eventActionType: "add",
                          })
                        }
                      >
                        <Text style={styles.addEvent}>Add Event</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text
                        style={{
                          color: Colors.WHITE_COLOR,
                          textAlign: "center",
                        }}
                      >
                        {" "}
                        You cannot add an event for an older date.
                      </Text>
                    )}
                  </View>
                )} */}
              </>
            ) : (
              <></>
            )}
          </View>

          <Spinnner loaderTxt={" "} visible={isLoading} />
        </Container>
        <Modal
          isVisible={this.state.visible}
          hasBackdrop={true}
          backdropOpacity={0.5}
          onBackButtonPress={() => this.onClose()}
          onBackdropPress={() => this.onClose()}
        >
          <View
            style={{
              backgroundColor: Colors.WHITE_COLOR,
              // height: DEV_HEIGHT * 0.5,
              width: "auto",
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
                borderBottomColor: Colors.LIGHT_GREY,
                borderBottomWidth: 1,
                paddingBottom: 10,
              }}
            >
              <Text
                style={{
                  color: Colors.BLACK_COLOR,
                  fontSize: 18,
                  fontFamily: ROBO_MEDIUM,
                }}
              >
                Add Event (
                {moment(selectedDate, "YYYY-MM_DD").format("DD-MM-YYYY")})
              </Text>
              <TouchableOpacity onPress={() => this.onClose()}>
                <Icon
                  name="close"
                  size={25}
                  color={Colors.LIGHT_GREY}
                  style={{ alignSelf: "flex-end", marginRight: 10 }}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ padding: 10 }}
              showsVerticalScrollIndicator={false}
            >
              <PrimeInput
                inputProps={{
                  onChangeText: async (text) => {
                    this.setState({ eventName: text });
                  },
                  value: this.state.eventName,
                  placeholder: "Event Name",
                }}
                placeColor={Colors.PLACEHOLDER}
                noAnimation={true}
              />
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 20,
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: Colors.BLACK_COLOR,
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    borderColor: Colors.LIGHT_GREY,

                    fontSize: 16,
                    textAlignVertical: "center",
                    width: "30%",
                  }}
                >
                  Start Time
                </Text>

                <TouchableOpacity
                  style={{ width: "50%" }}
                  onPress={this.selectTime}
                >
                  <Text
                    style={{
                      color: Colors.BLACK_COLOR,
                      paddingVertical: 8,
                      paddingHorizontal: 10,
                      borderColor: Colors.LIGHT_GREY,
                      borderRadius: 5,
                      borderWidth: 1,
                      fontSize: 16,
                      textAlignVertical: "center",
                      width: "100%",
                    }}
                  >
                    {moment(this.state.time).format("hh:mm a")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.selectTime}>
                  <Icon
                    name="clockcircleo"
                    size={22}
                    color={Colors.PLACEHOLDER}
                    style={{
                      padding: 8,
                      borderColor: Colors.LIGHT_GREY,
                      borderRadius: 5,
                      borderWidth: 1,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 20,
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: Colors.BLACK_COLOR,
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    borderColor: Colors.LIGHT_GREY,

                    fontSize: 16,
                    textAlignVertical: "center",
                    width: "30%",
                  }}
                >
                  End Time
                </Text>
                <TouchableOpacity
                  style={{ width: "50%" }}
                  onPress={this.selectEndTime}
                >
                  <Text
                    style={{
                      color: Colors.BLACK_COLOR,
                      paddingVertical: 8,
                      paddingHorizontal: 10,
                      borderColor: Colors.LIGHT_GREY,
                      borderRadius: 5,
                      borderWidth: 1,
                      fontSize: 16,
                      textAlignVertical: "center",
                      width: "100%",
                    }}
                  >
                    {moment(this.state.endTime).format("hh:mm a")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.selectEndTime}>
                  <Icon
                    name="clockcircleo"
                    size={22}
                    color={Colors.PLACEHOLDER}
                    style={{
                      padding: 8,
                      borderColor: Colors.LIGHT_GREY,
                      borderRadius: 5,
                      borderWidth: 1,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <PrimeInput
                inputProps={{
                  onChangeText: async (text) => {
                    this.setState({ description: text });
                  },
                  value: this.state.description,
                  placeholder: "Description",
                  multiline: true,
                  style: {
                    height: DEV_HEIGHT * 0.17,
                    textAlignVertical: "top",
                  },
                }}
                placeColor={Colors.PLACEHOLDER}
                noAnimation={true}
              />
              {this.state.eventActionType == "add" ? (
                <TouchableOpacity
                  onPress={() => this.onAddEvent("add")}
                  disabled={addEventLoading}
                  style={{
                    backgroundColor: Colors.SKY_COLOR,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 8,
                    paddingHorizontal: 20,
                    alignSelf: "center",
                    width: 120,
                  }}
                >
                  {addEventLoading && this.state.eventActionType === "add" ? (
                    <ActivityIndicator
                      color={Colors.WHITE_COLOR}
                      size="small"
                    />
                  ) : (
                    <Text style={{ color: Colors.WHITE_COLOR }}>Add</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    justifyContent: "space-around",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.onAddEvent("update");
                    }}
                    disabled={addEventLoading}
                    style={{
                      backgroundColor: Colors.SKY_COLOR,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 8,
                      paddingHorizontal: 20,
                      alignSelf: "center",
                      width: 120,
                    }}
                  >
                    {addEventLoading &&
                    this.state.eventActionType === "update" ? (
                      <ActivityIndicator
                        color={Colors.WHITE_COLOR}
                        size="small"
                      />
                    ) : (
                      <Text style={{ color: Colors.WHITE_COLOR }}>save</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Delete Event",
                        "Are you sure you want to delete this event?",
                        [
                          { text: "Cancel" },
                          {
                            text: "Yes",
                            onPress: () => this.onAddEvent("delete"),
                          },
                        ]
                      );
                    }}
                    disabled={addEventLoading}
                    style={{
                      backgroundColor: Colors.RED_COLOR,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 8,
                      paddingHorizontal: 20,
                      alignSelf: "center",
                      width: 120,
                    }}
                  >
                    {addEventLoading &&
                    this.state.eventActionType === "delete" ? (
                      <ActivityIndicator
                        color={Colors.WHITE_COLOR}
                        size="small"
                      />
                    ) : (
                      <Text style={{ color: Colors.WHITE_COLOR }}>Delete</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </Modal>
        {this.state.showClock && (
          <DateTimePicker
            value={this.state.time}
            onChange={(event, time) => {
              if (time !== undefined) {
                this.setState({ time: time, showClock: false });
              } else {
                this.setState({ showClock: false });
              }
            }}
            mode={"time"}
            is24Hour={true}
            display="clock"
          />
        )}
        {this.state.showEndClock && (
          <DateTimePicker
            value={this.state.endTime}
            onChange={(event, time) => {
              console.log("timeeee", time);
              if (time !== undefined) {
                this.setState({ endTime: time, showEndClock: false });
              } else {
                this.setState({ showEndClock: false });
              }
            }}
            mode={"time"}
            is24Hour={true}
            display="clock"
          />
        )}
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },

  workoutText: {
    color: Colors.WHITE_COLOR,
    fontSize: findSize(15),
  },
  calendar: {
    // height: DEV_HEIGHT / 2.5,
    overflow: "hidden",
  },
  viewWorkout: {
    padding: 15,
  },
  viewWorkoutText: {
    fontSize: findSize(15),
    color: Colors.WHITE_COLOR,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    borderColor: Colors.INDIGO_COLOR,
    borderWidth: 1,
  },
  addEvent: {
    fontSize: 14,
    color: Colors.WHITE_COLOR,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    borderColor: Colors.GREEN_COLOR,
    borderWidth: 1,
    marginHorizontal: 20,
    backgroundColor: Colors.BG_LIGHT,
    marginVertical: 10,
  },
  workoutCountText: {
    fontSize: findSize(15),
    color: Colors.WHITE_COLOR,
    fontFamily: POP_REGULAR,
  },
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
  weekChev: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    marginLeft: 15,
    fontSize: 16,
  },
});
export default TeamEvent;
