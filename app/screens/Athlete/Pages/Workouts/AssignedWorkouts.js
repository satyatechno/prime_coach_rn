import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  AppState,
  Dimensions,
  Image,
} from "react-native";
import HamBurger from "../../../../components/HamBurger";
import { Colors } from "../../../../constants/Colors";
import {
  POP_MEDIUM,
  POP_REGULAR,
  ROBO_BOLD,
  ROBO_MEDIUM,
  ROBO_REGULAR,
} from "../../../../constants/Fonts";
import { standardPostApi } from "../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../../../../components/Loader";
import PrimeButton from "../../../../components/PrimeButton";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Toaster } from "../../../../components/Toaster";
import IconArrow from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import FileViewer from "react-native-file-viewer";
import Spinnner from "../../../../components/Spinnner";
import Modal from "react-native-modal";
import Webview from "react-native-webview";
import { DEV_HEIGHT, DEV_WIDTH } from "../../../../constants/DeviceDetails";
import OneSignal from "react-native-onesignal";
import RNFetchBlob from "rn-fetch-blob";
import ActionSheet from "react-native-actionsheet";
import TildView from "../../../../components/tildView/TildView";
import { findHeight, findSize } from "../../../../utils/helper";
import CustomButton from "../../../../components/customButton/CustomButton";
import Select from "../../../../components/Select";
import CustomModal from "../../../../components/customModal/CustomModal";
import DatePicker from "../../../../components/DatePicker";
import { downloadFile } from "../../../../utils/downloadFile";

export function Day(props) {
  return (
    // <View style={styles.dayBg}>
    //   <View
    //     style={{
    //       flexDirection: "row",
    //       alignItems: "center",
    //       justifyContent: "space-between",
    //     }}
    //   >
    //     <View style={{ flexDirection: "row", alignItems: "center" }}>
    //       <Text style={styles.dayTxt}>{props.day_title}</Text>
    //       {props.dayWorkCompleted && (
    //         <>
    //           <Icon name="check" size={22} color={"green"} />
    //         </>
    //       )}
    //     </View>
    //     {props.dayWorkCompleted && props?.showExportButton && (
    //       <TouchableOpacity onPress={() => props.onExport()}>
    //         <IconArrow
    //           name="file-export-outline"
    //           size={22}
    //           color={Colors.WHITE_COLOR}
    //           style={{
    //             borderWidth: 1,
    //             borderRadius: 5,
    //             borderColor: Colors.SKY_COLOR,
    //             padding: 5,
    //           }}
    //         />
    //       </TouchableOpacity>
    //     )}
    //   </View>
    //   <View style={styles.btnsContainer}>
    //     {props?.hideStartBtn === true ? (
    //       <></>
    //     ) : (
    //       <PrimeButton
    //         buttonProps={{
    //           style: styles.loginBtn,
    //           onPress: props.onStart,
    //         }}
    //         buttonText="Start Workout"
    //         indiColor={Colors.SKY_COLOR}
    //         // isDisabled={props.dayWorkCompleted}
    //       />
    //     )}
    //     {props?.hideViewBtn === true ? (
    //       <></>
    //     ) : (
    //       <PrimeButton
    //         buttonProps={{
    //           style: styles.loginBtn,
    //           onPress: props.onView,
    //         }}
    //         buttonText="View Workout"
    //         indiColor={Colors.SKY_COLOR}
    //       />
    //     )}
    //   </View>
    // </View>
    <TildView
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
            fontSize: findSize(15),
            fontFamily: POP_MEDIUM,
            color: Colors.WHITE_COLOR,
          }}
        >
          {props.day_title}
        </Text>
        <View
          style={{
            flexDirection: "row",

            justifyContent: "space-between",
          }}
        >
          <CustomButton
            onPress={() => {
              props.onStart();
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
              Start Workout
            </Text>
          </CustomButton>

          <CustomButton
            onPress={() => {
              props.onView();
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
      </View>
    </TildView>
  );
}

export default class AssignedWorkouts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      workoutsLoading: true,
      currentWeek: null,
      allWeeks: [],
      annualProgramDetails: null,
      weekIndex: 0,
      downloadingPdf: false,
      htmlData: "<h3>No Data Available</h3>",
      modalVisible: false,
      modalVisible1: false,
      dayDetails: {},
      creatingPdf: false,
      exportData: {},
      graphStartDate: new Date(),
      graphEndDate: new Date(),
    };
    this.checkNotification();
    this.fetchAthleteWorkouts();
  }
  async checkNotification() {
    OneSignal.setNotificationOpenedHandler((notification) => {
      console.log(
        "OneSignal: notification opened:",
        JSON.stringify(notification, null, 2)
      );
      if (notification?.notification?.additionalData?.type === "event") {
        this.props.navigation.navigate("CalendarScreen");
      }
    });
    OneSignal.setInAppMessageClickHandler((event) => {
      console.log("OneSignal IAM clicked:", event);
    });
  }
  async componentDidMount() {
    const deviceState = await OneSignal.getDeviceState();

    console.log("Devise state at Assigned Workout", deviceState?.userId);
  }
  exportToPdf = async (data) => {
    await this.setState({ creatingPdf: true, exportData: data });
    const DAY_DETAILS = data?.dayDetails;
    const PROGRAM_DETAILS = data?.programDetails;
    const WEEK_DETAILS = data?.weekDetails;
    try {
      const res = await standardPostApi(
        "training_session_specific_report",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PROGRAM_DETAILS.id,
          annual_training_program_week_id: WEEK_DETAILS.id,
          annual_training_program_week_day_id: DAY_DETAILS.id,
          access_user_id: null,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        this.setState({ creatingPdf: false });
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        console.log("object");
        this.setState({ creatingPdf: false });
        this.setState({
          htmlData: res.data.data,
          dayDetails: DAY_DETAILS,
          modalVisible: true,
        });
        console.log("object", res.data.data);
        // this.askPermission(res.data.data, DAY_DETAILS);
      }
    } catch (error) {
      console.log("ErrorMessage", error);
      this.setState({ creatingPdf: false });
    }
  };

  askPermission(htmlData, day, index) {
    this.setState({ downloadingPdf: true });
    var that = this;
    async function requestExternalWritePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Prime Coach Storage Permission Access Request.",
            message: "Prime Coach needs access to store data in your device.",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if (index === 0) {
            that.createPDF(htmlData, day);
          } else if (index === 1) {
            that.createCSV();
          }
        } else {
          that.setState({ downloadingPdf: false });
          Alert.alert(
            "Permission Denied",
            "We do not have the permission to download this file to your device."
          );
        }
      } catch (err) {
        that.setState({ downloadingPdf: false });
        Alert.alert("Error", "An Unexpected error occurred, please try again.");
        console.warn(err);
      }
    }
    if (Platform.OS === "android") {
      requestExternalWritePermission();
    } else {
      if (index === 0) {
        this.createPDF(htmlData, day);
      } else if (index === 1) {
        this.createCSV();
      }
    }
  }

  async createPDF(htmlData, day) {
    this.setState({ downloadingPdf: true });
    const { navigation } = this.props;
    let options = {
      html: htmlData,
      fileName: `${day.day_number} Workout_Report_${moment().format(
        "DD_MM_YYYY_hh_mm_ss"
      )}`,
      directory: "Documents",
    };
    let file = await RNHTMLtoPDF.convert(options);
    this.setState({ downloadingPdf: false });
    Toaster("Your file has been downloaded.", Colors.GREEN_COLOR);
    console.log(file.filePath);
    setTimeout(() => {
      FileViewer.open(file.filePath)
        .then(() => {
          // success
        })
        .catch((error) => {
          // error
        });
    }, 1000);
  }

  createCSV = async () => {
    const { exportData } = this.state;
    this.setState({ downloadingPdf: true });
    const DAY_DETAILS = exportData?.dayDetails;
    const PROGRAM_DETAILS = exportData?.programDetails;
    const WEEK_DETAILS = exportData?.weekDetails;
    try {
      const res = await standardPostApi(
        "training_session_day_wise_report_v3",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PROGRAM_DETAILS?.id,
          annual_training_program_week_id: WEEK_DETAILS?.id,
          annual_training_program_week_day_id: DAY_DETAILS?.id,
          access_user_id: null,
        },
        true,
        false
      );
      if (res.data.code === 301) {
        this.setState({
          downloadingPdf: false,
        });
        console.log("Error ", JSON.stringify(res.data, null, 2));
      }
      if (res.data.code === 200) {
        let VALUES = [];
        res.data.data?.map((item) => {
          VALUES.push([
            item.exercise_name,
            item.set_number,
            item.load_completed,
            item.reps_completed,
          ]);
        });
        let header_string =
          "Exercise,Set-Number,Completed Load,Completed Reps\n";
        const rowString = VALUES.map(
          (d) => `${d[0]},${d[1]},${d[2]},${d[3]}\n`
        ).join("");
        const csvString = `${header_string}${rowString}`;
        const pathToWrite = `${RNFetchBlob.fs.dirs.DocumentDir}/${
          DAY_DETAILS?.day_number
        } Workout_Report_${moment().format("DD_MM_YYYY_hh_mm_ss")}.csv`;
        console.log("pathToWrite", pathToWrite);
        // pathToWrite /storage/emulated/0/Download/data.csv
        RNFetchBlob.fs
          .writeFile(pathToWrite, csvString, "utf8")
          .then(() => {
            Toaster("Your file has been downloaded.", Colors.GREEN_COLOR);
            this.setState({ downloadingPdf: false });
            console.log(`wrote file ${pathToWrite}`);
            setTimeout(() => {
              FileViewer.open(pathToWrite);
            }, 1000);
            // wrote file /storage/emulated/0/Download/data.csv
          })
          .catch((error) => {
            this.setState({ downloadingPdf: false });
            console.error(error);
          });
      }
    } catch (error) {
      this.setState({ downloadingPdf: false });
      console.log(error);
    }
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchAthleteWorkouts();
    this.setState({ refreshing: false });
  };

  fetchAthleteWorkouts = async () => {
    this.setState({ workoutsLoading: true });
    try {
      const res = await standardPostApi(
        "list_athlete_workout",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
        },
        true,
        false
      );
      if (res.data.code == 301) {
        this.setState({ currentWeek: undefined });
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        // console.log("All Plans ", res.data.data);
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
        // console.log('current_plan ', current_plan);
        let weeks_array = current_plan.weeks && current_plan.weeks;
        let current_week =
          weeks_array && weeks_array.length > 1
            ? weeks_array.find((item) => {
                return item.week_completed === false;
              })
            : weeks_array.find((item) => {
                return item;
              });
        let all_complete_weeks = weeks_array.filter((item) => {
          return item.week_completed == true;
        });
        all_complete_weeks.length === weeks_array.length
          ? (current_week = weeks_array[weeks_array.length - 1])
          : null;
        current_week === undefined ? (current_week = null) : current_week;
        await AsyncStorage.setItem(
          "@CURRENT_WEEK",
          JSON.stringify(current_week)
        );
        await AsyncStorage.setItem(
          "@CURRENT_PROGRAM",
          JSON.stringify(current_plan)
        );
        await this.setState({
          workoutsLoading: false,
          allWeeks: weeks_array,
          currentWeek: current_week,
          selectedPickerValue: current_week?.id,
          annualProgramDetails: current_plan,
        });
        console.log(
          "allWeeks ",
          JSON.stringify(this.state.currentWeek, null, 2)
        );
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ workoutsLoading: false });
  };

  nextWeek = async () => {
    const { allWeeks, weekIndex } = this.state;
    if (weekIndex !== allWeeks.length - 1) {
      await this.setState({ weekIndex: weekIndex + 1 });
    } else {
      await this.setState({ weekIndex: 0 });
    }
  };

  prevWeek = async () => {
    const { allWeeks, weekIndex } = this.state;
    if (weekIndex === 0) {
      await this.setState({ weekIndex: allWeeks.length - 1 });
    } else if (weekIndex > 0) {
      await this.setState({ weekIndex: weekIndex - 1 });
    }
  };
  downloadFile = async (type) => {
    // downloadFile({
    //   path: "https://prime-coach.co.uk/staging/prime-coach-backend/storage/pdf/446729.pdf",
    //   name: "sssss.pdf",
    //   type: "pdf",
    // });
    this.setState({ creatingPdf: true });
    try {
      const res = await standardPostApi(
        "export_atp_workout",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          start_date: moment(this.state.graphStartDate).format("YYYY-MM-DD"),
          end_date: moment(this.state.graphEndDate).format("YYYY-MM-DD"),
          format: type,
        },
        true,
        false
      );
      console.log("export workout", res.data);
      if (res.data.code == 301) {
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        let path = res.data?.data;
        downloadFile({
          path: path,
          name: path.split("/")?.pop(),
          type: path.split(".")?.pop(),
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ creatingPdf: false, modalVisible1: false });
    }
  };
  render() {
    const {
      refreshing,
      workoutsLoading,
      allWeeks,
      weekIndex,
      downloadingPdf,
      creatingPdf,
      currentWeek,
      selectedPickerValue,
    } = this.state;
    // const currentWeek = allWeeks[weekIndex];
    console.log("WEEK", Dimensions.get("screen"));
    return (
      <>
        <HamBurger
          pullToRefresh={true}
          refreshing={refreshing}
          onPullToRefresh={() => this.onRefresh()}
          onMenuPress={() => this.props.navigation.openDrawer()}
          onCalendarPress={() => {
            this.props.navigation.navigate("CalendarScreen");
          }}
          showCalendar={true}
        >
          <Spinnner
            loaderTxt={"Downloading Training Session Specific Report"}
            visible={downloadingPdf}
          />
          <Spinnner loaderTxt={" "} visible={creatingPdf} />
          <View style={{ paddingTop: 15 }}>
            {workoutsLoading ? (
              <Loader />
            ) : (
              <View>
                {currentWeek !== undefined ? (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <Text style={styles.plan}>{"Workout"}</Text>

                      <CustomButton
                        type={1}
                        style={{
                          backgroundColor: Colors.ORANGE,
                          width: findSize(130),
                          height: findHeight(40),
                        }}
                        title={"Export Workout"}
                        textStyle={{
                          fontSize: findSize(12),
                        }}
                        onPress={() => {
                          this.setState({ modalVisible1: true });
                        }}
                      />
                    </View>
                    {/* <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate("CalendarScreen");
                          }}
                        >
                          <Icon
                            name="calendar"
                            color={Colors.WHITE_COLOR}
                            size={25}
                          />
                        </TouchableOpacity>
                        <Navigators
                          onNext={() => this.nextWeek()}
                          onPrev={() => this.prevWeek()}
                        />
                      </View> */}
                    {/* {currentWeek && (
                        <Text style={styles.weekTxt}>
                          {currentWeek.week_number}
                          <Text style={styles.dateTxt}>
                            (
                            {moment(
                              currentWeek?.week_start,
                              "YYYY-MM-DD"
                            ).format("MMMM Do")}
                            )
                          </Text>
                        </Text>
                      )} */}

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
                              currentWeek: allWeeks?.find((x) => x.id == value),
                            });
                          },
                        }}
                        pickerItems={allWeeks?.map((x) => ({
                          label: `${x?.week_number} (${moment(
                            x?.week_start,
                            "YYYY-MM-DD"
                          ).format("Do MMM YYYY")} - ${moment(
                            x?.week_end,
                            "YYYY-MM-DD"
                          ).format("Do MMM YYYY")})`,
                          value: x?.id,
                          id: x?.id,
                        }))}
                        pickerValue={this.state.selectedPickerValue}
                        placeholder={"Select Week"}
                      />
                    </View>

                    <View>
                      {currentWeek &&
                        currentWeek.days &&
                        currentWeek.days.map((day) => {
                          return (
                            <View>
                              <Day
                                dayWorkCompleted={day.day_workout_complete}
                                day_title={day.day_number}
                                onStart={() =>
                                  this.props.navigation.navigate(
                                    "WorkoutView",
                                    {
                                      content: {
                                        dayDetails: day,
                                        programDetails:
                                          this.state.annualProgramDetails,
                                        weekDetails: currentWeek,
                                        startWorkout: true,
                                      },
                                    }
                                  )
                                }
                                onView={() =>
                                  this.props.navigation.navigate(
                                    "WorkoutView",
                                    {
                                      content: {
                                        dayDetails: day,
                                        programDetails:
                                          this.state.annualProgramDetails,
                                        weekDetails: currentWeek,
                                      },
                                    }
                                  )
                                }
                                onExport={() => {
                                  this.exportToPdf({
                                    dayDetails: day,
                                    programDetails:
                                      this.state.annualProgramDetails,
                                    weekDetails: currentWeek,
                                  });
                                }}
                                showExportButton={true}
                              />
                            </View>
                          );
                        })}
                    </View>
                  </View>
                ) : (
                  <>
                    {/* <TouchableOpacity
                                        onPress={() => {
                                          this.props.navigation.navigate("CalendarScreen");
                                        }}
                                      >
                                        <Icon
                                          name="calendar"
                                          color={Colors.WHITE_COLOR}
                                          size={25}
                                        />
                                      </TouchableOpacity> */}
                    <Text style={styles.noWorkout}>
                      You have not been assigned a workout yet.
                    </Text>
                  </>
                )}
              </View>
            )}
          </View>
        </HamBurger>
        <CustomModal
          isVisible={this.state.modalVisible1}
          onClose={() => this.setState({ modalVisible1: false })}
        >
          <Text
            style={{
              fontSize: findSize(17),
              fontFamily: POP_MEDIUM,
              color: Colors.WHITE_COLOR,
              textAlign: "center",
            }}
          >
            Export Workout
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DatePicker
              mainContainerStyle={{ width: DEV_WIDTH * 0.38 }}
              containerStyle={{
                borderColor: Colors.WHITE_COLOR,
                borderWidth: 1,
                backgroundColor: Colors.BACKGROUND,
                width: DEV_WIDTH * 0.38,
              }}
              dateTimeProps={{
                onChange: async (date) => {
                  this.setState({
                    graphStartDate: date,
                  });
                },
              }}
              showDarkBg
              currentDate={this.state.graphStartDate}
              minDate={new Date("2000-01-01")}
              maxDate={new Date("2050-01-01")}
              placeholder={"Start date"}
            />

            <DatePicker
              placeholder={"End date"}
              mainContainerStyle={{ width: DEV_WIDTH * 0.38 }}
              containerStyle={{
                borderColor: Colors.WHITE_COLOR,
                borderWidth: 1,
                backgroundColor: Colors.BACKGROUND,
                width: DEV_WIDTH * 0.38,
              }}
              dateTimeProps={{
                onChange: async (date) => {
                  this.setState({
                    graphEndDate: date,
                  });
                },
              }}
              showDarkBg
              currentDate={this.state.graphEndDate}
              minDate={new Date("2000-01-01")}
              maxDate={new Date("2050-01-01")}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingVertical: 20,
            }}
          >
            <CustomButton
              onPress={() => {
                this.downloadFile("pdf");
              }}
            >
              <Image
                source={require("../../../../../assets/images/pdf.png")}
                style={{ height: 100, width: 100 }}
              />
              <Text
                style={{
                  color: Colors.WHITE_COLOR,
                  fontSize: findSize(14),
                  fontFamily: POP_REGULAR,
                }}
              >
                Download PDF
              </Text>
            </CustomButton>
            <CustomButton
              onPress={() => {
                this.downloadFile("exel");
              }}
            >
              <Image
                source={require("../../../../../assets/images/csv.png")}
                style={{ height: 100, width: 100 }}
              />
              <Text
                style={{
                  color: Colors.WHITE_COLOR,
                  fontSize: findSize(14),
                  fontFamily: POP_REGULAR,
                }}
              >
                Download CSV
              </Text>
            </CustomButton>
          </View>
        </CustomModal>

        <ShowSpecificReport
          modalVisible={this.state.modalVisible}
          html={this.state.htmlData}
          onClose={() => this.setState({ modalVisible: false })}
          onExport={() => this.ExportActionSheet.show()}
        />
        <ActionSheet
          ref={(o) => (this.ExportActionSheet = o)}
          options={["PDF", "CSV", "Cancel"]}
          title={"Export"}
          // destructiveButtonIndex={0}
          cancelButtonIndex={2}
          onPress={(index) => {
            if (index !== 2) {
              this.askPermission(
                this.state.htmlData,
                this.state.dayDetails,
                index
              );
            }
          }}
        />
      </>
    );
  }
}
export const ShowSpecificReport = ({
  modalVisible,
  html,
  onClose,
  onExport,
}) => {
  return (
    <Modal
      isVisible={modalVisible}
      // animationIn="slideInUp"
      animationInTiming={800}
      // animationOut="slideOutDown"
      animationOutTiming={800}
      hasBackdrop={true}
      // swipeDirection="down"
      backdropOpacity={0.5}
      onBackdropPress={() => onClose()}
      onSwipeComplete={() => onClose()}
      onBackButtonPress={() => onClose()}
    >
      <View style={styles.errorModalView}>
        <TouchableOpacity onPress={() => onClose()}>
          <IconArrow
            name="close"
            size={25}
            color={Colors.LIGHT_GREY}
            style={{ alignSelf: "flex-end", marginRight: 10 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.ORANGE_COLOR,
            borderRadius: 5,
            paddingVertical: 5,
            paddingHorizontal: 15,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "flex-start",
            margin: 10,
          }}
          onPress={() => onExport()}
        >
          <Text>Export</Text>
        </TouchableOpacity>
        <Webview
          allowsFullscreenVideo
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}
          style={styles.webView}
          source={{
            html: html,
          }}
        />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  plan: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_MEDIUM,
    fontSize: findSize(21),
    marginEnd: 10,
    flex: 1,
  },
  weekTxt: {
    fontSize: 30,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_BOLD,
    textAlign: "center",
  },
  dateTxt: {
    fontSize: 18,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_BOLD,
    textAlign: "center",
  },
  loginBtn: {
    width: 120,
    alignSelf: "center",
    backgroundColor: Colors.BG_LIGHT,
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
    height: 38,
  },
  dayBg: {
    backgroundColor: Colors.BG_LIGHT,
    marginVertical: 10,
    padding: 15,
    paddingBottom: 0,
    borderRadius: 5,
  },
  dayTxt: {
    fontSize: 25,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_MEDIUM,
    marginBottom: 7,
    marginRight: 25,
  },
  btnsContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-around",
  },
  noWorkout: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: ROBO_REGULAR,
    color: Colors.WHITE_COLOR,
    marginTop: 125,
  },
  selfScreen: {
    color: Colors.WHITE_COLOR,
    fontSize: 30,
    fontFamily: ROBO_BOLD,
    marginBottom: 10,
  },
  weekChev: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    marginLeft: 15,
    fontSize: 16,
  },
  navigatorsContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  webView: {
    height: DEV_HEIGHT * 0.55,
    width: DEV_WIDTH * 0.85,
    backgroundColor: Colors.WHITE_COLOR,
    alignSelf: "center",
    // flex: 1,
    margin: 10,
  },
  errorModalView: {
    backgroundColor: Colors.WHITE_COLOR,
    height: DEV_HEIGHT * 0.6,
    width: DEV_WIDTH * 0.88,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
