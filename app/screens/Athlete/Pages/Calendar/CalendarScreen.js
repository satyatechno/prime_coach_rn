import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { DEV_HEIGHT, DEV_WIDTH } from "../../../../constants/DeviceDetails";
import { Colors } from "../../../../constants/Colors";
import Container from "../../../../components/Container";
import { standardPostApi } from "../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../../../../components/Loader";
import Spinnner from "../../../../components/Spinnner";
import IconChev from "react-native-vector-icons/FontAwesome5";
import {
  POP_MEDIUM,
  POP_REGULAR,
  ROBO_MEDIUM,
  ROBO_REGULAR,
} from "../../../../constants/Fonts";
import Icon from "react-native-vector-icons/AntDesign";
import Modal from "react-native-modal";
import { findHeight, findSize } from "../../../../utils/helper";
import TildView from "../../../../components/tildView/TildView";
import CustomButton from "../../../../components/customButton/CustomButton";
export class CalendarScreen extends Component {
  state = {
    selectedDate: moment().format("YYYY-MM-DD"),
    markedDates: {},
    selectedWorkout: [],
    workoutData: [],
    isLoading: false,
    visible: false,
    selectedEvent: [],
    showWorkouts: false,
    showEvents: false,
    currentEvent: {},
    show: 1,
  };
  onLoadData = async (month, year) => {
    this.setState({ isLoading: true });
    try {
      const res = await standardPostApi(
        "assigned_workout_calender",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          calender_month: month,
          calender_year: year,
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
  }
  onDayPress = (day) => {
    console.log("dateeeee", day);
    this.setState({ showEvents: false, showWorkouts: false });
    let selected_workout = this.state.workoutData.find(
      (x) =>
        x.day_number === day.day &&
        (x.assigned_workout?.length > 0 || x.assigned_user_events?.length > 0)
    );
    this.setState({
      selectedDate: day.dateString,
      selectedWorkout: selected_workout?.assigned_workout
        ? selected_workout?.assigned_workout
        : [],
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
  onViewWorkout = async (workout) => {
    this.props.navigation.navigate("WorkoutView", {
      content: {
        dayDetails: {
          id: workout?.atp_day_id,
          day_number: "Day " + workout?.day_number,
        },
        programDetails: { id: workout?.atp_id },
        weekDetails: { id: workout?.atp_week_id },
      },
    });
  };

  onViewEvent = (item) => {
    this.setState({
      currentEvent: item,
      visible: true,
    });
  };
  onClose = () => {
    this.setState({
      currentEvent: {},
      visible: false,
    });
  };
  render() {
    const {
      selectedDate,
      markedDates,
      selectedWorkout,
      isLoading,
      showEvents,
      showWorkouts,
      selectedEvent,
      currentEvent,
      visible,
    } = this.state;
    return (
      <>
        <Container
          backFn={() => this.props.navigation.goBack()}
          title={"Event"}
        >
          <View style={styles.container}>
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
              {selectedWorkout.length === 0 && selectedEvent.length === 0 ? (
                <View>
                  <Image
                    source={require("../../../../../assets/images/no-event.png")}
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
                    No workout & event on{" "}
                    {moment(selectedDate, "YYYY-MM_DD").format("MMMM Do")}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.workoutText}>
                    Workout & Events on{" "}
                    {moment(selectedDate, "YYYY-MM_DD").format("MMMM Do")}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 5,
                      backgroundColor: Colors.BACKGROUND,
                      borderRadius: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          show: 1,
                        })
                      }
                      style={{
                        height: 40,
                        width: "47%",
                        borderRadius: 10,
                        backgroundColor:
                          this.state.show == 1
                            ? Colors.ORANGE
                            : Colors.VALHALLA,
                        justifyContent: "center",
                        alignItems: "center",
                        marginHorizontal: 5,
                      }}
                    >
                      <Text style={styles.weekChev}>Workouts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          show: 2,
                        })
                      }
                      style={{
                        height: 40,
                        width: "47%",
                        borderRadius: 10,
                        backgroundColor:
                          this.state.show == 2
                            ? Colors.ORANGE
                            : Colors.VALHALLA,
                        justifyContent: "center",
                        alignItems: "center",
                        marginHorizontal: 5,
                      }}
                    >
                      <Text style={styles.weekChev}>Events</Text>
                    </TouchableOpacity>
                  </View>

                  {this.state.show == 1 ? (
                    <>
                      {selectedWorkout.length === 0 ? (
                        <View>
                          <Image
                            source={require("../../../../../assets/images/no-event.png")}
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
                            No Workouts on{" "}
                            {moment(selectedDate, "YYYY-MM_DD").format(
                              "MMMM Do"
                            )}
                          </Text>
                        </View>
                      ) : (
                        <>
                          {selectedWorkout.map((item, index) => (
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
                                  Workout {index + 1}
                                </Text>

                                <CustomButton
                                  onPress={() => this.onViewWorkout(item)}
                                  title={"View Workout"}
                                  textStyle={{
                                    fontSize: findSize(10),
                                  }}
                                  type={2}
                                  style={{
                                    width: findSize(95),
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
                  ) : (
                    <>
                      {selectedEvent.length === 0 ? (
                        <View>
                          <Image
                            source={require("../../../../../assets/images/no-event.png")}
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
                            No Events on{" "}
                            {moment(selectedDate, "YYYY-MM_DD").format(
                              "MMMM Do"
                            )}
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
                                        source={require("../../../../../assets/images/clock.png")}
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
                                        source={require("../../../../../assets/images/clock.png")}
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
                              </View>
                            </TildView>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </View>
              )}
            </View>
          </View>

          <Spinnner loaderTxt={" "} visible={isLoading} />
        </Container>
        {visible && (
          <ShowEventDetails event={currentEvent} onClose={this.onClose} />
        )}
      </>
    );
  }
}
export function ShowEventDetails({ event, onClose }) {
  return (
    <Modal
      isVisible={true}
      hasBackdrop={true}
      backdropOpacity={0.5}
      onBackButtonPress={() => onClose()}
      onBackdropPress={() => onClose()}
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
            {event?.event_name}
          </Text>
          <TouchableOpacity onPress={() => onClose()}>
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
          <Text>
            Event Date:{" "}
            {moment(event?.event_date, "YYYY-MM-DD").format("MMMM Do YYYY")}
          </Text>
          <Text>
            Event Time:{" "}
            {moment(event?.event_time, "HH:mm:ss").format("hh:mm a")}
            {"-"}
            {moment(event?.event_end_time, "HH:mm:ss").format("hh:mm a")}
          </Text>
          <Text
            style={{
              color: Colors.PLACEHOLDER,
              borderTopColor: Colors.PLACEHOLDER,
              borderTopWidth: 1,
            }}
          >
            Description:{" "}
          </Text>
          <Text>{event?.event_description}</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  workoutText: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_MEDIUM,
    fontSize: findSize(19),
    textAlign: "center",
    marginTop: 5,
  },
  calendar: {
    // height: DEV_HEIGHT / 2.5,
    overflow: "hidden",
    // margin: 10,
  },
  viewWorkout: {
    padding: 15,
  },
  viewWorkoutText: {
    fontSize: 14,
    color: Colors.WHITE_COLOR,
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    borderColor: Colors.INDIGO_COLOR,
    borderWidth: 1,
  },
  workoutCountText: {
    fontSize: findSize(15),
    color: Colors.WHITE_COLOR,
    fontFamily: POP_REGULAR,
  },
  weekChev: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_REGULAR,

    fontSize: 16,
  },
});
export default CalendarScreen;
