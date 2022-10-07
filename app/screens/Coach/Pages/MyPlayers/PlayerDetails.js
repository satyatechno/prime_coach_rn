import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Image,
} from "react-native";
import Container from "../../../../components/Container";
import { ROBO_REGULAR, ROBO_MEDIUM } from "../../../../constants/Fonts";
import { Colors } from "../../../../constants/Colors";
import Player from "../../components/Player";
import IconTrash from "react-native-vector-icons/MaterialCommunityIcons";
import PrimeButton from "../../../../components/PrimeButton";
import { PLAYER_BUTTONS } from "../../data/Buttons";
import AsyncStorage from "@react-native-community/async-storage";
import { standardPostApi } from "../../../../api/ApiWrapper";
import Spinnner from "../../../../components/Spinnner";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import FileViewer from "react-native-file-viewer";
import { Toaster } from "../../../../components/Toaster";
import Icon from "react-native-vector-icons/FontAwesome5";
import { ShowSpecificReport } from "../../../Athlete/Pages/Workouts/AssignedWorkouts";
import RNFetchBlob from "rn-fetch-blob";
import ActionSheet from "react-native-actionsheet";
import moment from "moment";
import { findHeight, findSize } from "../../../../utils/helper";
import CustomButton from "../../../../components/customButton/CustomButton";
function RemoveBtn(props) {
  return (
    // <CustomButton onPress={props.onRemove} style={styles.removeBtn}>
    //   <View style={styles.btnRow}>
    //     <Text style={styles.btnText}>Remove Player</Text>
    //     <IconTrash name="delete" color={Colors.RED_COLOR} size={25} />
    //   </View>
    // </CustomButton>
    <CustomButton
      type={1}
      style={{
        backgroundColor: Colors.ORANGE,
        width: findSize(130),
        height: findHeight(40),
      }}
      title={"Remove Player"}
      textStyle={{
        fontSize: findSize(12),
      }}
      onPress={props.onRemove}
    />
  );
}

export default class PlayerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deletingPlayer: false,
      downloadingPdf: false,
      htmlData: "<h3>No Data Available</h3>",
      modalVisible: false,
      creatingPdf: false,
    };
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc();
  }

  removePlayer = async () => {
    const { navigation } = this.props;
    const Data = navigation.getParam("content");
    this.setState({ deletingPlayer: true });
    try {
      const res = await standardPostApi(
        "delete_player_from_team",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          player: Data.player.id,
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({ deletingPlayer: false });
        this.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  removePlayerAlert = () => {
    return Alert.alert(
      "Delete Player",
      "Are you sure you want to delete this team member, this cannot be undone?",
      [
        { text: "Cancel" },
        {
          text: "OK",
          onPress: () => this.removePlayer(),
        },
      ]
    );
  };
  exportToPdf = async () => {
    await this.setState({ creatingPdf: true });
    const { navigation } = this.props;
    const PlayerData = navigation.getParam("content").player;
    try {
      const res = await standardPostApi(
        "training_session_specific_report",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),

          access_user_id: PlayerData?.id,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        this.setState({ creatingPdf: false });
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        this.setState({ creatingPdf: false });
        this.setState({ htmlData: res.data.data, modalVisible: true });
      }
    } catch (error) {
      console.log("ErrorMessage", error);
      this.setState({ creatingPdf: false });
    }
  };

  askPermission(htmlData, index) {
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
          if (index == 0) {
            that.createPDF(htmlData);
          } else if (index == 1) {
            that.createCSV();
          }
        } else {
          Alert.alert(
            "Permission Denied",
            "We do not have the permission to download this file to your device."
          );
        }
      } catch (err) {
        Alert.alert("Error", "An Unexpected error occurred, please try again.");
        console.warn(err);
      }
    }
    if (Platform.OS === "android") {
      requestExternalWritePermission();
    } else {
      if (index == 0) {
        this.createPDF(htmlData);
      } else if (index == 1) {
        this.createCSV();
      }
    }
  }

  async createPDF(htmlData) {
    this.setState({ downloadingPdf: true });
    const { navigation } = this.props;
    const PlayerData = navigation.getParam("content").player;
    let options = {
      html: htmlData,
      fileName: `${PlayerData?.first_name} ${
        PlayerData?.last_name
      } Workout Report_${moment().format("DD_MM_YYYY_hh_mm_ss")}`,
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
    // alert('This functionality is in under process.');
    this.setState({ downloadingPdf: true });
    const { navigation } = this.props;
    const PlayerData = navigation.getParam("content").player;
    try {
      const res = await standardPostApi(
        "training_session_day_wise_report_v2",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),

          access_user_id: PlayerData?.id,
        },
        true,
        false
      );
      console.log("resssssssss", res.data);
      // if (res.data.code === 301) {
      //   this.setState({
      //     downloadingPdf: false,
      //   });
      // Toaster(
      //   res.data.,
      //   Colors.LIGHT_RED
      // );
      console.log("Error ", JSON.stringify(res.data, null, 2));
      // }
      if (res.data.length > 0) {
        console.log("ress", res.data);
        let VALUES = [];
        res.data?.map((x) => {
          VALUES.push([x?.name, "  ", " ", " "]);
          x?.week_days?.map((y) => {
            VALUES.push([
              `Day ${y?.day_number}`,
              "Session completed on:",
              `${moment(y?.updated_at).format("DD/MM/YYYY")}`,
              `${moment(y?.updated_at).format("hh:mm a")}`,
            ]);
            VALUES.push([
              "Exercise",
              "Set-Number",
              "Completed Load",
              "Completed Reps",
            ]);
            y?.completed_exercises?.map((z) => {
              VALUES.push([
                `${z?.exercise?.exercise}`,
                `${z?.annual_training_program_exercise_set_number}`,
                `${z?.annual_training_program_reps_completed}`,
                `${z?.annual_training_program_load_completed}`,
              ]);
            });
          });
        });

        // res.data.data?.map((item) => {
        //   VALUES.push([
        //     item.exercise_name,
        //     item.set_number,
        //     item.load_completed,
        //     item.reps_completed,
        //   ]);
        // });
        // let header_string =
        //   'Exercise,Set-Number,Completed Load,Completed Reps\n';
        const rowString = VALUES.map(
          (d) => `${d[0]},${d[1]},${d[2]},${d[3]}\n`
        ).join("");
        const csvString = `${rowString}`;
        const pathToWrite = `${RNFetchBlob.fs.dirs.DocumentDir}/${
          PlayerData?.first_name
        } ${PlayerData?.last_name} Workout Report_${moment().format(
          "DD_MM_YYYY_hh_mm_ss"
        )}.csv`;
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

  render() {
    const { navigation } = this.props;
    const Data = navigation.getParam("content");
    console.log("received player is ", Data);
    return (
      <>
        <Container backFn={() => this.goBack()} title={"Player Detail"}>
          <Spinnner visible={this.state.deletingPlayer} />
          <Spinnner
            loaderTxt={"Downloading Training Session Specific Report"}
            visible={this.state.downloadingPdf}
          />
          <Spinnner loaderTxt={" "} visible={this.state.creatingPdf} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 10,
              marginBottom: 20,
            }}
          >
            <View style={styles.img}>
              <Image
                style={styles.img}
                source={require("../../../../../assets/images/avtar.png")}
                resizeMode="contain"
              />
            </View>
            <View style={{ flex: 1, paddingStart: 20 }}>
              <Text style={styles.playerName}>
                {Data.player.first_name + " " + Data.player.last_name}
              </Text>
              {Data?.role == "Assistant Coach" ? null : (
                <RemoveBtn onRemove={() => this.removePlayerAlert()} />
              )}
            </View>
            <CustomButton
              onPress={() => {
                this.props.navigation.navigate("CalendarWorkout", {
                  content: { playerDetails: Data },
                });
              }}
              style={{ padding: 10 }}
            >
              <Image
                style={{
                  height: findSize(35),
                  width: findSize(35),
                }}
                source={require("../../../../../assets/images/calendar.png")}
              />
            </CustomButton>
          </View>

          <View>
            {PLAYER_BUTTONS.map((item) => {
              if (Data?.role == "Assistant Coach" && item?.id == 5) return null;
              else
                return (
                  <CustomButton
                    style={styles.playerBtns}
                    onPress={() => {
                      this.props.navigation.navigate(item.pageName, {
                        refreshFunc: navigation.state.params.refreshFunc(),
                        content: {
                          playerDetails: Data,
                          pageDetails: item,
                        },
                      });
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.WHITE_COLOR,
                        fontFamily: ROBO_REGULAR,
                        fontSize: findSize(18),
                        flex: 1,
                      }}
                    >
                      {item?.title}
                    </Text>
                    <Icon
                      name="chevron-right"
                      color={Colors.WHITE_COLOR}
                      size={17}
                    />
                  </CustomButton>
                );
            })}
            <Text
              style={{
                color: Colors.WHITE_COLOR,
              }}
            ></Text>

            <CustomButton
              type={1}
              isLoading={false}
              loaderColor={Colors.BACKGROUND}
              title={"View Report"}
              onPress={() => this.exportToPdf()}
              style={{ height: findHeight(60) }}
            />
          </View>
        </Container>
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
          cancelButtonIndex={2}
          onPress={(index) => {
            if (index !== 2) {
              this.askPermission(
                this.state.htmlData,

                index
              );
            }
          }}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  teamName: {
    color: Colors.SKY_COLOR,
    fontFamily: ROBO_REGULAR,
    fontSize: 18,
  },
  img: {
    height: findSize(90),
    width: findSize(90),
    borderRadius: findSize(46),
    backgroundColor: Colors.WHITE_COLOR,
    overflow: "hidden",
  },
  playerName: {
    color: Colors.WHITE_COLOR,
    fontSize: 18,
    fontFamily: ROBO_REGULAR,
    marginStart: 2,
  },
  removeBtn: {
    backgroundColor: Colors.ORANGE,
    height: findSize(),
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btnText: {
    color: Colors.RED_COLOR,
    fontFamily: ROBO_MEDIUM,
    fontSize: 16,
  },
  playerBtns: {
    backgroundColor: Colors.VALHALLA,
    height: findSize(67),
    borderRadius: findSize(15),
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    flexDirection: "row",
    marginTop: 12,
  },
  playerBtnsTxt: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    fontSize: 16,
  },
});
