/*
iOS Simulator File Download Location - 
/Users/pairroxz/Library/Developer/CoreSimulator/Devices/B9CC6D44-6B11-4CB4-8C27-C03C3D0F3BAE/data/Containers/Data/Application/2894DD72-167C-488C-8593-53A17326EEE6/Documents
*/

import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Modall from "../../../../components/Modall";
import PrimeButton from "../../../../components/PrimeButton";
import { Colors } from "../../../../constants/Colors";
import {
  POP_BOLD,
  POP_MEDIUM,
  POP_REGULAR,
  ROBO_ITALIC,
  ROBO_MEDIUM,
  ROBO_REGULAR,
} from "../../../../constants/Fonts";
import Spinnner from "../../../../components/Spinnner";
import { standardPostApi } from "../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import { Toaster } from "../../../../components/Toaster";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Loader from "../../../../components/Loader";
import { DEV_HEIGHT, DEV_WIDTH } from "../../../../constants/DeviceDetails";
import FileViewer from "react-native-file-viewer";
import Icon from "react-native-vector-icons/AntDesign";
import Container from "../../../../components/Container";
import Modal from "react-native-modal";
import Webview, { WebView } from "react-native-webview";
import IconFont from "react-native-vector-icons/Fontisto";
import ActionSheet from "react-native-actionsheet";
import RNFetchBlob from "rn-fetch-blob";
import moment from "moment";
import { findSize, FLEX_WIDTH, FONT_SIZE } from "../../../../utils/helper";
import CustomButton from "../../../../components/customButton/CustomButton";
import TildView from "../../../../components/tildView/TildView";
import CustomModal from "../../../../components/customModal/CustomModal";
function Hr(props) {
  return <View style={[styles.line, props && props.style]} />;
}
const COLOR = [
  Colors.SKY_COLOR,
  Colors.ORANGE_COLOR,
  Colors.GREEN_COLOR,
  Colors.LIGHT_RED,
];

const RenderItem = ({ item, onClose, onSelect, navigation, select }) => {
  return (
    <TildView degree="4deg" containerStyle={{ marginVertical: 0 }}>
      <View
        style={{
          flexDirection: "row",
          padding: 10,

          justifyContent: "space-between",
          alignItems: "center",
          minHeight: findSize(65),
        }}
      >
        <View
          style={{
            // backgroundColor: Colors.WHITE_COLOR,

            width: "50%",
          }}
        >
          <Text style={{ fontFamily: POP_REGULAR, color: Colors.WHITE_COLOR }}>
            {item?.exercise}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "50%",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              onClose();
              navigation.navigate("AlternativeExerciseDetails", {
                content: {
                  data: item,
                },
              });
            }}
          >
            <Icon color={Colors.ORANGE} name={"play"} size={20} />
          </TouchableOpacity>
          {select && (
            <TouchableOpacity
              onPress={() => {
                onClose();
                onSelect(item);
              }}
              style={{
                marginStart: findSize(20),
              }}
            >
              <Icon
                name="check"
                size={20}
                color={Colors.GREEN_COLOR}
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TildView>
  );
};
export default class WorkoutView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadingPdf: false,
      loadingPdfData: false,
      htmlData: "<h3>No Data Available</h3>",
      exerciseData: [],
      modalVisible: false,
      modalVisible1: false,
      selectAlternativeExer: null,
      currentVideo: "",
      downloadingCSV: false,
    };

    // this.exportToPdf();
  }
  componentDidMount() {
    this.onLoadData();
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  exportToPdf = async () => {
    const { navigation } = this.props;
    const DAY_DETAILS = navigation.getParam("content").dayDetails;
    const PROGRAM_DETAILS = navigation.getParam("content").programDetails;
    const WEEK_DETAILS = navigation.getParam("content").weekDetails;
    await this.setState({ loadingPdfData: true });
    try {
      const res = await standardPostApi(
        "export_workout_to_pdf",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PROGRAM_DETAILS.id,
          annual_training_program_week_id: WEEK_DETAILS.id,
          annual_training_program_day_id: DAY_DETAILS.id,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        this.setState({ loadingPdfData: false });
        // Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        this.setState({ loadingPdfData: false, htmlData: res.data.data });
      }
    } catch (error) {
      console.log("Error", error);
    }
    this.setState({ loadingPdfData: false });
  };

  askPermission(index) {
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
            that.createPDF();
          } else if (index === 1) {
            that.exportCSV();
          }
        } else {
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
      console.log("index", index);
      if (index === 0) {
        this.createPDF();
      } else if (index === 1) {
        this.exportCSV();
      }
    }
  }

  async createPDF() {
    await this.setState({ downloadingPdf: true });
    const { navigation } = this.props;
    const DAY_DETAILS = navigation.getParam("content").dayDetails;
    let options = {
      html: this.state.htmlData,
      fileName: `${DAY_DETAILS.day_number} Workout_${moment().format(
        "DD_MM_YYYY_hh_mm_ss"
      )}`,
    };
    let file = await RNHTMLtoPDF.convert(options);
    await this.setState({ downloadingPdf: false });
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
  //   componentDidMount() {
  //     this.onLoadData();
  //   }
  onLoadData = async () => {
    this.setState({ loadingPdfData: true });
    const { navigation } = this.props;
    const DAY_DETAILS = navigation.getParam("content").dayDetails;
    console.log("ssssss", DAY_DETAILS);
    const PROGRAM_DETAILS = navigation.getParam("content").programDetails;
    const WEEK_DETAILS = navigation.getParam("content").weekDetails;
    try {
      const res = await standardPostApi(
        "assigned_day_workout_calender",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PROGRAM_DETAILS.id,
          annual_training_program_week_id: WEEK_DETAILS.id,
          annual_training_program_day_id: DAY_DETAILS.id,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        this.setState({ loadingPdfData: false, exerciseData: res.data.data });
        // Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        this.setState({
          exerciseData: [...res.data.data[0]?.workout_group],
          loadingPdfData: false,
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({ loadingPdfData: false });
    }
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
      '" frameborder="0" ></iframe>'
    );
  };
  exportCSV = async () => {
    this.setState({ downloadingCSV: true });
    let VALUES = [];
    const { exerciseData } = this.state;

    const { navigation } = this.props;
    const DAY_DETAILS = navigation.getParam("content").dayDetails;

    exerciseData.map((item) => {
      VALUES.push(["", item.group_name, item.group_set_type, ""]);
      item?.workout_group_exercise?.map((exer) => {
        VALUES.push([
          exer.workout_exercise_name,
          exer.workout_sets,
          `${exer.workout_reps} ${exer.workout_repetition_type}`,
          exer.workout_rest,
        ]);
      });
    });
    let header_string = "Exercise,Sets,Reps,Rest\n";
    const rowString = VALUES.map(
      (d) => `${d[0]},${d[1]},${d[2]},${d[3]}\n`
    ).join("");
    const csvString = `${header_string}${rowString}`;
    const pathToWrite = `${RNFetchBlob.fs.dirs.DocumentDir}/${
      DAY_DETAILS.day_number
    } Workout_${moment().format("DD_MM_YYYY_hh_mm_ss")}.csv`;
    console.log("pathToWrite", pathToWrite);
    // pathToWrite /storage/emulated/0/Download/data.csv
    RNFetchBlob.fs
      .writeFile(pathToWrite, csvString, "utf8")
      .then(() => {
        Toaster("Your file has been downloaded.", Colors.GREEN_COLOR);
        this.setState({ downloadingCSV: false });
        console.log(`wrote file ${pathToWrite}`);

        setTimeout(() => {
          FileViewer.open(pathToWrite)
            .then(() => {
              // success
            })
            .catch((error) => {
              // error
            });
        }, 1000);
        // wrote file /storage/emulated/0/Download/data.csv
      })
      .catch((error) => {
        this.setState({ downloadingCSV: false });
        console.error(error);
      });
  };
  render() {
    const { navigation } = this.props;
    const { downloadingPdf, loadingPdfData, exerciseData, downloadingCSV } =
      this.state;
    const DAY_DETAILS = navigation.getParam("content").dayDetails;
    const PROGRAM_DETAILS = navigation.getParam("content").programDetails;
    const WEEK_DETAILS = navigation.getParam("content").weekDetails;
    const REFRESH_FUNCTION = navigation.getParam("content").refreshFunc;
    const START_WORKOUT = navigation.getParam("content")?.startWorkout ?? false;
    console.log("dayDetails: ", DAY_DETAILS);
    return (
      <>
        <Container
          backFn={() => this.props.navigation.goBack()}
          title={START_WORKOUT ? "Start Workout" : "View Workout"}
        >
          <Spinnner loaderTxt={"Downloading PDF"} visible={downloadingPdf} />
          <Spinnner loaderTxt={"Downloading CSV"} visible={downloadingCSV} />
          {loadingPdfData ? (
            <Loader
              loaderProps={{ style: { marginTop: (DEV_HEIGHT * 20) / 100 } }}
            />
          ) : (
            <View style={styles.outerBox}>
              {exerciseData.length > 0 ? (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.WHITE_COLOR,
                        fontFamily: POP_MEDIUM,
                        fontSize: findSize(21),
                      }}
                    >
                      {DAY_DETAILS?.day_number}
                    </Text>

                    <CustomButton
                      style={{
                        height: 40,
                        width: START_WORKOUT ? 110 : 70,
                      }}
                      type={1}
                      title={START_WORKOUT ? "Start Workout" : "Export "}
                      textStyle={{
                        fontSize: findSize(12),
                      }}
                      onPress={() => {
                        START_WORKOUT
                          ? this.props.navigation.navigate("StartWorkout", {
                              content: {
                                dayDetails: DAY_DETAILS,
                                programDetails: PROGRAM_DETAILS,
                                weekDetails: WEEK_DETAILS,
                              },
                              refreshFunc: REFRESH_FUNCTION,
                            })
                          : this.ExportActionSheet.show();
                      }}
                    />
                  </View>
                  <View>
                    {exerciseData.map((item, i) => {
                      if (item.workout_group_exercise?.length)
                        return (
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
                                  <Text style={styles.exerciseName}>
                                    {item.group_name} - {item.group_set_type}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    borderTopColor: Colors.INPUT_PLACE,
                                    borderTopWidth: 1,
                                  }}
                                >
                                  {item.workout_group_exercise &&
                                    item.workout_group_exercise.map(
                                      (exer, j) => {
                                        return (
                                          <View
                                            style={{
                                              marginVertical: 2,
                                              padding: 5,
                                            }}
                                          >
                                            <View style={styles.headRow}>
                                              <View
                                                style={{ flexDirection: "row" }}
                                              >
                                                <Text
                                                  style={[
                                                    styles.exerciseDetailTxt,
                                                  ]}
                                                >
                                                  {exer.workout_exercise_name}
                                                </Text>
                                                <View
                                                  style={{
                                                    flexDirection: "row",
                                                    justifyContent:
                                                      "space-around",
                                                  }}
                                                >
                                                  <TouchableOpacity
                                                    onPress={() => {
                                                      this.setState({
                                                        currentVideo:
                                                          exer?.workout_exercise_video,
                                                        modalVisible: true,
                                                      });
                                                    }}
                                                    style={{
                                                      marginEnd: 20,
                                                    }}
                                                  >
                                                    <Icon
                                                      color={Colors.ORANGE}
                                                      name={"play"}
                                                      size={20}
                                                    />
                                                  </TouchableOpacity>
                                                  <TouchableOpacity
                                                    onPress={() => {
                                                      this.setState({
                                                        modalVisible1: true,
                                                        selectAlternativeExer:
                                                          exer?.workout_exercise,
                                                      });
                                                    }}
                                                  >
                                                    <Icon
                                                      name={"paperclip"}
                                                      size={20}
                                                      color={Colors.ORANGE}
                                                    />
                                                  </TouchableOpacity>
                                                </View>
                                              </View>
                                              <View
                                                style={{
                                                  flexDirection: "row",
                                                  marginTop: 5,
                                                  justifyContent:
                                                    "space-between",
                                                }}
                                              >
                                                <View style={styles.setTile}>
                                                  <Text style={styles.load}>
                                                    Reps
                                                  </Text>

                                                  <Text style={styles.reps}>
                                                    {exer.workout_reps +
                                                      " " +
                                                      exer.workout_repetition_type.toLowerCase()}
                                                    {exer.workout_reps_each_side ===
                                                      1 && " ES"}
                                                  </Text>
                                                  {/* <Text style={styles.setNo}>
                                                {i + 1}
                                              </Text> */}
                                                </View>

                                                <View style={styles.setTile}>
                                                  <Text style={styles.load}>
                                                    Sets
                                                  </Text>

                                                  <Text style={styles.reps}>
                                                    {exer.workout_sets}
                                                  </Text>
                                                </View>
                                                <View style={styles.setTile}>
                                                  <Text style={styles.load}>
                                                    Rest
                                                  </Text>

                                                  <Text style={styles.reps}>
                                                    {exer.workout_rest} secs
                                                  </Text>
                                                </View>
                                              </View>
                                            </View>
                                          </View>
                                        );
                                      }
                                    )}
                                </View>
                              </View>
                            </View>
                          </TildView>
                        );
                    })}
                  </View>
                </>
              ) : (
                <Text
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  No workout assigned
                </Text>
              )}
            </View>
          )}
        </Container>
        <CustomModal
          isVisible={this.state.modalVisible}
          onClose={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <View
            style={{
              height: DEV_HEIGHT * 0.25,
              backgroundColor: Colors.VALHALLA,
              overflow: "hidden",
              width: DEV_WIDTH - 80,
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
                height: DEV_HEIGHT * 0.25,
                backgroundColor: Colors.VALHALLA,
                overflow: "hidden",
                width: DEV_WIDTH - 80,
              }}
              source={{
                html: this.convertToIframe(this.state.currentVideo),
              }}
            />
          </View>
        </CustomModal>

        <AlternativeExerciseModal
          visible={this.state.modalVisible1}
          onClose={() =>
            this.setState({ modalVisible1: false, selectAlternativeExer: null })
          }
          navigation={this.props.navigation}
          select={false}
          alternativeId={this.state.selectAlternativeExer}
        />
        <ActionSheet
          ref={(o) => (this.ExportActionSheet = o)}
          options={["PDF", "CSV", "Cancel"]}
          title={"Export Workout"}
          // destructiveButtonIndex={0}
          cancelButtonIndex={2}
          onPress={(index) => {
            if (index !== 2) {
              this.askPermission(index);
            }
          }}
        />
      </>
      //   </Modall>
    );
  }
}
export const AlternativeExerciseModal = ({
  visible,
  onClose,
  onSelect,
  navigation,
  select,
  alternativeId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseData, setExerciseData] = useState([]);
  useEffect(() => {
    onLoad();
  }, [alternativeId]);
  const onLoad = async () => {
    // console.log('gjgdghjgjh', alternativeId);
    setIsLoading(true);
    try {
      const res = await standardPostApi(
        "exercise/get_alternate_exercises",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          exercise_id: alternativeId,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        setIsLoading(false);
        // Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        setIsLoading(false);
        setExerciseData(res.data.data?.alternate_exercises);
        console.log("res data alternative ", res.data.data);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  return (
    <CustomModal isVisible={visible} onClose={() => onClose()}>
      <View
        style={{
          height: DEV_HEIGHT * 0.7,
        }}
      >
        <Text
          style={{
            color: Colors.WHITE_COLOR,
            fontFamily: POP_MEDIUM,
            fontSize: findSize(21),
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Alternative Exercise
        </Text>

        {isLoading ? (
          <Loader />
        ) : exerciseData?.length == 0 ? (
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              textAlign: "center",
              marginVertical: "40%",
            }}
          >
            No Alternative Exercise{" "}
          </Text>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {exerciseData.map((item) => (
              <RenderItem
                item={item}
                onClose={() => onClose()}
                onSelect={onSelect}
                navigation={navigation}
                key={item?.id?.toString()}
                select={select}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </CustomModal>
  );
};
const styles = StyleSheet.create({
  icon: {
    padding: 10,
    borderRadius: 10,
  },
  exportBtn: {
    width: 130,
    alignSelf: "center",
    backgroundColor: Colors.ORANGE_COLOR,
    height: 38,
    alignSelf: "flex-start",
    marginVertical: 5,
  },
  outerBox: {
    // borderWidth: 1,
    // padding: 15,
  },
  groupNamesnTypes: {
    fontSize: 16,
    fontFamily: ROBO_MEDIUM,
    color: Colors.BLACK,
    textAlign: "left",
    paddingHorizontal: 10,
    paddingBottom: 1,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#C0C0C0",
    marginVertical: 5,
  },
  tableRow: {
    fontSize: 15,
    color: Colors.BLACK_COLOR,
    fontFamily: ROBO_REGULAR,
    width: 70,
    backgroundColor: Colors.SKY_COLOR,
    color: Colors.WHITE_COLOR,
    paddingStart: 5,
    marginHorizontal: 1,
  },
  exerciseDetailTxt: {
    fontSize: 15,
    color: Colors.WHITE_COLOR,
    fontFamily: POP_REGULAR,
    marginVertical: 1,
    width: FLEX_WIDTH(220),
    marginHorizontal: 1,
  },
  exerciseDetailTxt1: {
    fontSize: 14,
    color: Colors.BLACK_COLOR,
    // fontFamily: ROBO_REGULAR,
    marginVertical: 0,
    width: FLEX_WIDTH(310) / 3,
    // backgroundColor: Colors.PLACEHOLDER,
    // paddingStart: 5,
    marginHorizontal: 2,
    borderWidth: 1,
    textAlign: "center",
    alignSelf: "center",
  },
  headRow: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    marginVertical: 2,
  },
  errorModalView: {
    backgroundColor: Colors.WHITE_COLOR,
    height: DEV_HEIGHT / 3.3,
    width: "auto",
    paddingVertical: 10,
    borderRadius: 10,
  },
  webView: {
    height: DEV_HEIGHT / 4.2,
    width: DEV_WIDTH - 70,
    backgroundColor: Colors.BACKGROUND,
    alignSelf: "center",
    // flex: 1,
    margin: 10,
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
