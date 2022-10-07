import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import React, { Component } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { standardPostApi } from "../../../../api/ApiWrapper";
import Container from "../../../../components/Container";
import Loader from "../../../../components/Loader";
import Spinnner from "../../../../components/Spinnner";
import { Colors } from "../../../../constants/Colors";
import {
  POP_MEDIUM,
  POP_REGULAR,
  ROBO_BOLD,
  ROBO_REGULAR,
} from "../../../../constants/Fonts";
import Select from "../../../../components/Select";
import { findSize } from "../../../../utils/helper";
import TildView from "../../../../components/tildView/TildView";

export class DayWiseReport extends Component {
  state = {
    isloading: false,
    report: [],
    selectedDay: undefined,
    weekArray: [],
    pickerArray: [],
    selectedWeek: {},
    selectedPickerValue: "",
  };
  componentDidMount() {
    this.onLoadWeekData();
  }
  onLoadWeekData = async () => {
    const { navigation } = this.props;
    this.setState({ isloading: true });
    const PlayerData = navigation.getParam("player");
    try {
      const res = await standardPostApi(
        "athlete_program_view",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          access_user_id: PlayerData?.id,
        },
        true,
        false
      );
      if (res.data.code === 301) {
        this.setState({
          isloading: false,
        });
        console.log("Error ", JSON.stringify(res.data, null, 2));
      }
      let temp = [];
      res.data.data.map((x, i) => {
        temp.push({
          label: `${x.week_number} (${moment(
            x?.week_start,
            "YYYY-MM-DD"
          ).format("Do MMM")} - ${moment(x?.week_end, "YYYY-MM-DD").format(
            "Do MMM"
          )})`,
          value: x.id,
        });
      });
      if (res.data.code === 200) {
        this.setState({
          weekArray: res.data.data,
          pickerArray: temp,
          selectedPickerValue: temp[0]?.value,
          selectedWeek: res.data.data[0],
          isloading: false,
        });
        if (res.data.data[0]?.days?.length > 0) {
          this.setState({ selectedDay: res.data.data[0]?.days[0].id });
          this.onLoad(res.data.data[0]?.days[0].id);
        }
        console.log("list Data ", JSON.stringify(res.data.data, null, 2));
      }
    } catch (error) {
      this.setState({ isloading: false });
      console.log(error);
    }
  };
  onLoad = async (dayId) => {
    const { navigation } = this.props;
    this.setState({ isloading: true });
    const PlayerData = navigation.getParam("player");
    const { selectedWeek } = this.state;

    try {
      const res = await standardPostApi(
        "training_session_day_wise_report_v3",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: selectedWeek?.annual_training_program_id,
          annual_training_program_week_id: selectedWeek?.id,
          annual_training_program_week_day_id: dayId,
          access_user_id: PlayerData?.id,
        },
        true,
        false
      );
      if (res.data.code === 301) {
        this.setState({
          report: res.data.data,
          isloading: false,
        });
        console.log("Error ", JSON.stringify(res.data, null, 2));
      }
      if (res.data.code === 200) {
        console.log("dattttt", JSON.stringify(res.data.data, null, 2));
        let Temp = res.data.data;
        let Final = [];
        for (var i = 0; Temp.length; i++) {
          let SELECTED = Temp.filter(
            (x) => x.exercise_name === Temp[0]?.exercise_name
          );
          let REMAIN = Temp.filter(
            (x) => x.exercise_name !== Temp[0]?.exercise_name
          );
          Final.push({
            name: SELECTED[0]?.exercise_name,
            totalSet: SELECTED?.length,
            data: SELECTED,
          });
          Temp = REMAIN;
        }
        this.setState({
          report: Final,
          isloading: false,
        });
        console.log("Final", JSON.stringify(Final, null, 2));
      }
    } catch (error) {
      this.setState({ isloading: false });
      console.log(error);
    }
  };
  render() {
    const { selectedWeek } = this.state;
    return (
      <Container
        backFn={() => this.props.navigation?.goBack()}
        title="Analysis Workout"
      >
        <Spinnner loaderTxt={" "} visible={this.state.isloading} />

        {/* <Text
          style={{
            color: Colors.WHITE_COLOR,
            fontSize: 18,
            textAlign: "center",
            fontFamily: ROBO_REGULAR,
            marginBottom: 20,
          }}
        >
          Analyse Workout
        </Text> */}
        {this.state.weekArray.length == 0 ? (
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              textAlign: "center",
              fontSize: 17,
            }}
          >
            No workout assigned{" "}
          </Text>
        ) : (
          <>
            <Select
              containerStyle={{
                borderColor: Colors.WHITE_COLOR,
                borderWidth: 1,
                backgroundColor: Colors.BACKGROUND,
              }}
              pickerProps={{
                onValueChange: async (value) => {
                  let tempWeek = this.state.weekArray?.find(
                    (x) => x.id === value
                  );
                  await this.setState({
                    selectedPickerValue: value,
                    selectedWeek: tempWeek,
                  });
                  if (tempWeek?.days?.length > 0) {
                    this.setState({ selectedDay: tempWeek?.days[0].id });
                    this.onLoad(tempWeek?.days[0].id);
                  }
                  // this.listActivityReport(value);
                },
              }}
              pickerItems={this.state.pickerArray}
              pickerValue={this.state.selectedPickerValue}
              placeholder={"Select Week"}
            />
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            >
              {selectedWeek?.days?.length ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {selectedWeek?.days?.map((item, index) => (
                    <TouchableOpacity
                      disabled={item.id === this.state.selectedDay}
                      onPress={() => {
                        this.onLoad(item.id);
                        this.setState({ selectedDay: item?.id });
                      }}
                      style={[styles.day]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          this.state.selectedDay === item?.id && {
                            color: Colors.ORANGE,
                          },
                        ]}
                      >
                        {item?.day_number}
                      </Text>
                      {this.state.selectedDay === item?.id && (
                        <View
                          style={{
                            height: 2,
                            width: 2,
                            borderRadius: 1,
                            backgroundColor: Colors.ORANGE,
                            alignSelf: "center",
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text
                  style={{
                    color: Colors.WHITE_COLOR,
                    textAlign: "center",
                    fontSize: 17,
                  }}
                >
                  No day workout assigned{" "}
                </Text>
              )}
            </ScrollView>
            {/* <View style={styles.hr} /> */}
            <Text style={styles.workoutReport}>
              Workout Report :{" "}
              {
                selectedWeek?.days?.find((x) => x.id === this.state.selectedDay)
                  ?.day_number
              }
            </Text>

            {this.state.report.length > 0 ? (
              <>
                {[...this.state.report].map((item) => (
                  <TildView degree="5deg">
                    <View style={styles.ExerciseCard}>
                      <View style={{}}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.exerciseName}>{item?.name}</Text>
                          <View
                            style={{
                              paddingVertical: 6,
                              paddingHorizontal: 16,
                              justifyContent: "center",
                              backgroundColor: Colors.BACKGROUND,
                              borderRadius: 5,
                            }}
                          >
                            <Text style={styles.setTotal}>
                              Sets: {item?.totalSet}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                          }}
                        >
                          {item?.data?.map((x, i) => (
                            <View style={styles.setTile}>
                              <Text style={styles.load}>
                                {x.load_completed} kg
                              </Text>

                              <Text style={styles.reps}>
                                {x.reps_completed} Reps
                              </Text>
                              <Text style={styles.setNo}>{i + 1}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  </TildView>
                ))}
              </>
            ) : (
              <Text style={styles.noReport}>
                You did not complete{" "}
                {
                  selectedWeek?.days?.find(
                    (x) => x.id === this.state.selectedDay
                  )?.day_number
                }{" "}
                workout
              </Text>
            )}
          </>
        )}
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  noReport: { color: Colors.WHITE_COLOR, fontSize: 17, textAlign: "center" },
  workoutReport: {
    color: Colors.WHITE_COLOR,
    fontSize: findSize(15),
    fontFamily: POP_MEDIUM,
    marginBottom: 15,
  },
  hr: {
    backgroundColor: Colors.WHITE_COLOR,
    height: 1,
    marginVertical: 10,
  },
  dayText: {
    color: Colors.INPUT_PLACE,
    fontSize: 11,
    textAlign: "center",
    fontFamily: POP_REGULAR,
  },
  day: {
    justifyContent: "center",
    padding: 10,
    paddingHorizontal: 15,
    margin: 5,

    borderColor: Colors.SKY_COLOR,
  },
  ExerciseCard: {
    padding: 20,
  },
  exerciseName: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_REGULAR,
    fontSize: findSize(18),
  },
  setTotal: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_REGULAR,
    fontSize: findSize(11),
  },
  setNo: {
    color: Colors.ORANGE,
    fontSize: findSize(11),
    fontFamily: POP_REGULAR,
    textAlign: "right",
    lineHeight: findSize(12),
  },
  load: {
    color: Colors.INPUT_PLACE,
    fontSize: findSize(11),
    fontFamily: POP_REGULAR,
  },
  reps: {
    color: Colors.WHITE_COLOR,
    fontSize: findSize(11),
    fontFamily: POP_REGULAR,
    lineHeight: findSize(12),
  },
  setTile: {
    backgroundColor: Colors.VALHALLA,
    borderRadius: findSize(7),
    padding: findSize(12),
    paddingBottom: 0,
    elevation: 5,
    width: findSize(105),
    height: findSize(60),
    marginVertical: 5,
  },
});
export default DayWiseReport;
