import React, { Component, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Platform,
  Image,
} from "react-native";
import { Colors } from "../../../constants/Colors";
import Modall from "../../../components/Modall";
import PrimeInput from "../../../components/PrimeInput";
import { POP_REGULAR, ROBO_BOLD, ROBO_REGULAR } from "../../../constants/Fonts";
import { DEV_WIDTH, DEV_HEIGHT } from "../../../constants/DeviceDetails";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  standardPostApi,
  standardPostApiJsonBased,
  uploadVideoOnServer,
} from "../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../../../components/Loader";
import Webview from "react-native-webview";
// import DocumentPicker from 'react-native-document-picker';
import { launchImageLibrary } from "react-native-image-picker";
import { Toaster } from "../../../components/Toaster";
import * as Progress from "react-native-progress";
import { findHeight, findSize, FONT_SIZE } from "../../../utils/helper";
import CustomButton from "../../../components/customButton/CustomButton";
import CustomInput from "../../../components/customInput/CustomInput";
import Container from "../../../components/Container";
import Icon from "react-native-vector-icons/AntDesign";
import VideoComponent from "../../../components/videoComponent/VideoComponent";
import UploadingComponent from "../../../components/uploadingComponent/UploadingComponent";

function Hr(props) {
  return <View style={[styles.line, props && props.style]} />;
}

function CheckBox(props) {
  return (
    <CustomButton onPress={props.onPress}>
      <View style={styles.emptyBox}>
        {props.checked == "1" && (
          <Icons name="check" color={Colors.WHITE_COLOR} size={18} />
        )}
      </View>
    </CustomButton>
  );
}

function Exercise(props) {
  const convertToIframe = (url) => {
    return (
      '<video width="100%" height="100%" controls><source src="' +
      url +
      '" type="video/mp4" /></video>'
    );
  };

  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedDesc, setIsFocusedDesc] = useState(false);
  const webViewRef = useRef();
  useEffect(() => {
    if (props?.stopLoading) {
      webViewRef.current?.stopLoading();
    }
  }, [props?.stopLoading]);

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <CustomInput
          containerStyle={{ width: DEV_WIDTH * 0.44 }}
          mainContainerStyle={{ marginVertical: 10 }}
          placeholder={"Test Name"}
          inputStyle={{ fontSize: 11, paddingTop: 12 }}
          onChangeText={props.exerciseTextChange}
          value={props.testName}
        />
        <CustomInput
          containerStyle={{ width: DEV_WIDTH * 0.44 }}
          mainContainerStyle={{ marginVertical: 10 }}
          placeholder={"Description"}
          inputStyle={{ fontSize: 11, paddingTop: 12 }}
          onChangeText={props.descriptionTextChange}
          value={props.descriptionValue}
        />
      </View>

      <View>
        {props?.video ? (
          <VideoComponent
            url={props?.video}
            style={{
              backgroundColor: Colors.VALHALLA,
            }}
            onEdit={() => {
              props?.onSelectVideo();
            }}
            onDelete={() => {
              alert("Coming Soon...");
            }}
            onPreview={() => {
              console.log("first", props);
              props.navigation.navigate("VideoPreview", {
                data: {
                  url: props?.video,
                  isLocal: false,
                },
              });
            }}
          />
        ) : props?.showUploadBtn ? (
          <CustomButton
            disabled={props?.uploading}
            onPress={props?.onSelectVideo}
            style={{
              backgroundColor: Colors.VALHALLA,
              height: findHeight(50),
              width: "100%",
              borderRadius: findHeight(28),
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              marginTop: 5,
              marginBottom: 7,
            }}
          >
            <Image
              source={require("../../../../assets/images/upload.png")}
              style={{
                height: findSize(24),
                width: findSize(24),
              }}
            />
            <Text
              style={{
                fontSize: findSize(11),
                fontFamily: POP_REGULAR,
                color: Colors.INPUT_PLACE,
                marginStart: 5,
              }}
            >
              Upload Video
            </Text>
          </CustomButton>
        ) : null}
        {/* {props?.video ? (
          <>
            <Text
              style={{
                color: Colors.BLACK_COLOR,
                fontSize: 16,
                marginVertical: 10,
              }}
            >
              User Video
            </Text>
            <Webview
              ref={webViewRef}
              startInLoadingState={true}
              allowsFullscreenVideo
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              bounces={false}
              style={{
                height: DEV_HEIGHT * 0.25,
                backgroundColor: Colors.BG_LIGHT,
                overflow: "hidden",
                width: "100%",
              }}
              source={{
                html: convertToIframe(props?.video),
              }}
            />
          </>
        ) : null} */}

        {/* {props?.showUploadBtn ? (
          <TouchableOpacity
            style={{
              justifyContent: "space-around",
              borderWidth: 1,
              borderColor: Colors.SKY_COLOR,

              alignItems: "center",
              paddingVertical: 5,
              marginVertical: 10,
              borderRadius: 10,
              flexDirection: "row",
              width: 150,
            }}
            disabled={props?.uploading}
            onPress={props?.onSelectVideo}
          >
            <View>
              <Text style={{ color: Colors.SKY_COLOR, marginHorizontal: 5 }}>
                Upload Video
              </Text>
            
              {props?.uploading &&
              props?.uploadPercentage !== null &&
              props?.uploadPercentage !== undefined ? (
                <Progress.Bar
                  progress={parseFloat(props?.uploadPercentage / 100)}
                  // size={30}
                  color={Colors.SKY_COLOR}
                  // indeterminate={true}
                  width={100}
                  height={2}
                />
              ) : null}
            </View>
            {props?.uploading &&
            props?.uploadPercentage !== null &&
            props?.uploadPercentage !== undefined ? (
              <Text style={{ color: Colors.SKY_COLOR, fontSize: 12 }}>
                {props?.uploadPercentage}%
              </Text>
            ) : null}
          </TouchableOpacity>
        ) : null} */}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CheckBox checked={props.commentAllow} onPress={props.onCbPress} />
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              fontSize: findSize(11),
              fontFamily: POP_REGULAR,
              marginStart: 5,
            }}
          >
            Add Comment
          </Text>
        </View>

        {props.showAddBtn ? (
          <CustomButton
            style={{
              height: findSize(30),
              width: findSize(30),
              borderRadius: findSize(16),
              justifyContent: "center",
              alignItems: "center",

              backgroundColor: Colors.ORANGE,
            }}
            disabled={!props.showAddBtn || props?.uploading}
            onPress={props.onAddPress}
          >
            <Icon name="plus" size={18} color={Colors.WHITE_COLOR} />
          </CustomButton>
        ) : (
          <CustomButton
            style={{
              height: findSize(30),
              width: findSize(30),
              borderRadius: findSize(16),
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={props.onRemovePress}
            disabled={!props.hasBeenAdded}
          >
            <Icon name="delete" size={20} color={Colors.RED_COLOR} />
          </CustomButton>
        )}
      </View>
    </View>
  );
}

export default class CreateEditScreeningProtocol extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addingPlan: false,
      protocolName: "",
      testName: "",
      description: "",
      commentAllow: false,
      screeningProtocolTest: [],
      protocolsLoading: true,
      video: "",
      uploading: false,
      updatingIndex: undefined,
      uploadPercentage: null,
      videoUploadProgress: [],
      stopLoading: false,
    };
    this.screeningProtocolDetails();
  }

  onSelectVideo = async (index) => {
    try {
      // const { p, csv, plainText, images } = DocumentPicker.types;
      // const results = await DocumentPicker.pick({
      //   type: ['.mp4', 'video/*'],
      // });
      const results = await launchImageLibrary({
        mediaType: "video",
      });
      const file = results?.assets?.[0];
      console.log("vedio", results);
      this.uploadVideo(
        {
          name: file?.name ?? Math.random()?.toString(),
          uri:
            Platform.OS === "ios" ? file.uri?.replace("file://", "") : file.uri,
          type: file.type,
          size: file.fileSize,
        },
        index
      );
    } catch (err) {
      // if (DocumentPicker.isCancel(err)) {
      //   console.log('User cancelled the picker,');
      // } else {
      //   throw err;
      // }
      console.log(err);
    }
  };

  validationViedioUpload(video) {
    if (video?.size > 20000000) {
      Toaster("Please Upload upto 20MB video");
      this.setState({
        uploading: false,
      });
      return false;
    } else {
      return true;
    }
  }
  uploadVideo = async (video, index) => {
    this.setState({ uploading: true });

    console.log("vedkkkkk", video);
    const data = new FormData();
    data.append(
      "access_token",
      await AsyncStorage.getItem("@USER_ACCESS_TOKEN")
    );
    data.append("video", video);

    const isValid = this.validationViedioUpload(video);
    console.log("hhhhh", data);

    if (isValid) {
      const config = {
        onUploadProgress: (progressEvent) => {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log("uploadeee", percentCompleted);
          if (index !== undefined) {
            let tempUpload = [...this.state.videoUploadProgress];
            tempUpload[index] = percentCompleted;
            this.setState({
              videoUploadProgress: tempUpload,
            });
          } else {
            this.setState({ uploadPercentage: percentCompleted });
          }
        },
      };
      uploadVideoOnServer("upload_screening_protocol_test_video", data, config)
        .then(async (res) => {
          console.log("response video upload", res.data);
          if (res.data.code === 200) {
            if (index == undefined) {
              console.log("undefiend index");
              this.setState({
                video: res.data.data,
              });
            } else {
              console.log("index", index);
              await this.updateValues(index, "video_ref", res.data.data?.path);
              await this.updateValues(
                index,
                "full_path",
                res.data.data?.full_path
              );
            }
          } else if (res.data.code === 301) {
            alert("Invailid video, Please upload another video.");
          }
          this.setState({ uploading: false });
        })
        .catch((err) => {
          console.log("errorrrrr", err);
          if (err?.response?.message) {
            Toaster(err?.response?.message, Colors.RED_COLOR);
          }
        })
        .finally(() => this.setState({ uploading: false }));
    }
  };

  toggleCheckBox = async () => {
    await this.setState({
      commentAllow: this.state.commentAllow === true ? false : true,
    });
  };

  toggleCreatedCheckBox = async (name, index) => {
    const { screeningProtocolTest } = this.state;
    const changedCheckbox = screeningProtocolTest.find(
      (cb) => cb.name === name
    );
    if (changedCheckbox.comment_allowed === true) {
      screeningProtocolTest[index].comment_allowed = false;
    } else {
      screeningProtocolTest[index].comment_allowed = true;
    }
    await this.setState({ screeningProtocolTest });
    console.log("toggleCreatedCheckBox ", this.state.screeningProtocolTest);
  };
  // updateExercise = async (name, index) => {
  //   const { screeningProtocolTest } = this.state;

  //   screeningProtocolTest[index].name = name;

  //   await this.setState({ screeningProtocolTest });
  //   console.log('update exercise ', this.state.screeningProtocolTest);
  // };
  // updateUnit = async (unit, index) => {
  //   const { screeningProtocolTest } = this.state;

  //   screeningProtocolTest[index].description = unit;

  //   await this.setState({ screeningProtocolTest });
  //   console.log('update exercise ', this.state.screeningProtocolTest);
  // };

  updateValues = async (index, field, value) => {
    const { screeningProtocolTest } = this.state;
    screeningProtocolTest[index][field] = value;
    await this.setState({ screeningProtocolTest });
  };

  validateProtocolName = () => {
    const { protocolName } = this.state;
    if (!protocolName.trim().length > 0) {
      alert("Please enter a Screening Protocol Name.");
      return false;
    }
    return true;
  };

  checkNonEmptyFields = () => {
    const { testName, description, video } = this.state;
    if (!testName.trim().length > 0 || !description.trim().length > 0) {
      alert("Please provide a value in both Name and description inputs.");
      return false;
    } else if (!video?.path?.length) {
      alert("Please upload a video ");
      return false;
    }
    return true;
  };
  checkValidation = () => {
    const { screeningProtocolTest } = this.state;
    let RETURN = true;
    if (screeningProtocolTest.length == 0) {
      alert("Please add atleast one test.");
      return false;
    }
    for (var i = 0; i < screeningProtocolTest.length; i++) {
      if (
        screeningProtocolTest[i].name?.trim().length == 0 ||
        screeningProtocolTest[i].description?.trim().length == 0
      ) {
        alert("Please provide a value in both Name and description inputs.");
        RETURN = false;
        break;
      }
    }
    return RETURN;
  };
  addToScreeningProtocolExercises = async () => {
    const {
      screeningProtocolTest,
      testName,
      description,
      commentAllow,
      video,
    } = this.state;
    if (this.checkNonEmptyFields()) {
      if (video?.path?.length)
        screeningProtocolTest.push({
          name: testName,
          description: description,
          comment_allowed: commentAllow,
          video_ref: video?.path,
          full_path: video?.full_path,
        });
      else
        screeningProtocolTest.push({
          name: testName,
          description: description,
          comment_allowed: commentAllow,
        });

      await this.setState({
        screeningProtocolTest,
        testName: "",
        description: "",
        commentAllow: false,
        video: "",
      });
    }
  };

  removeScreeningProtocolExercise = async (index) => {
    const { screeningProtocolTest } = this.state;
    screeningProtocolTest.splice(index, 1);
    await this.setState({ screeningProtocolTest });
  };

  goBack() {
    this.setState({ stopLoading: true });

    const { navigation } = this.props;
    const refresh = navigation.getParam("refreshFunc");
    // navigation.state.params.refreshFunc &&
    // navigation.state.params.refreshFunc();
    refresh();
    navigation.pop(1);
    // navigation?.navigate("Screening")
  }

  createScreeningProtocol = async () => {
    const { navigation } = this.props;
    const { protocolName, screeningProtocolTest } = this.state;
    const teamData = navigation.getParam("content").teamData;
    this.setState({ addingPlan: true });
    // console.log(
    //   'data=========',
    //   JSON.stringify(screeningProtocolTest, null, 2)
    // );
    if (this.validateProtocolName() && this.checkValidation()) {
      const data = {
        access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
        protocol_name: protocolName,
        protocol_tests: screeningProtocolTest,
        team_id: teamData.id,
      };
      try {
        const res = await standardPostApiJsonBased(
          "create_screening_protocol",
          undefined,
          data,
          true
        );
        // console.log('ressssss', res.data);
        if (res.data.code == 200) {
          this.setState({ addingPlan: false });
          this.goBack();
        }
      } catch (error) {
        console.log(error);
        this.setState({ addingPlan: false });
      }
    }
    this.setState({ addingPlan: false });
  };

  screeningProtocolDetails = async () => {
    const { navigation } = this.props;
    const ProtocolData = navigation.getParam("content");
    const teamData = navigation.getParam("content").teamData;
    const protocol_id = navigation.getParam("content").protocol_id;
    if (!ProtocolData.isCreatePage) {
      // this.setState((pre) => ({ protocolsLoading: true }));
      try {
        const res = await standardPostApi(
          "screening_protocols_with_tests",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            team_id: teamData.id,
            // screening_protocol_id: protocol_id,
            // resultset_no: page,
          },
          true
        );
        if (res.data.code == 200) {
          let temp = res.data.data?.screening_protocols?.find(
            (x) => x?.id == protocol_id
          );
          temp?.screening_protocol_tests?.map((y) => {
            if (y?.comment_allowed == "1") y.comment_allowed = true;
            else y.comment_allowed = false;
          });
          this.setState({
            screeningProtocolTest: temp?.screening_protocol_tests,
            protocolName: temp?.name,
            protocolsLoading: false,
          });
          console.log(
            "Screening_protocol_details==================== ",
            res.data.data?.screening_protocols?.find(
              (x) => x?.id == protocol_id
            )?.screening_protocol_tests
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ protocolsLoading: false });
  };

  updateScreeningProtocol = async () => {
    const { navigation } = this.props;
    const protocol_id = navigation.getParam("content").protocol_id;
    const { screeningProtocolTest, protocolName } = this.state;
    this.setState({ addingPlan: true });
    if (this.validateProtocolName() && this.checkValidation()) {
      try {
        let Temp = [];
        Temp = screeningProtocolTest?.map((item) => {
          if (item?.id !== undefined)
            return {
              id: item.id,
              name: item.name,
              description: item.description,
              comment_allowed: item.comment_allowed,
              video_ref: item.video_ref,
            };
          else
            return {
              name: item.name,
              description: item.description,
              comment_allowed: item.comment_allowed,
              video_ref: item.video_ref,
            };
        });
        const res = await standardPostApiJsonBased(
          "update_screening_protocol",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            protocol_id: protocol_id,
            protocol_name: protocolName,
            protocol_tests: Temp,
          },
          true
        );
        if (res.data.code == 200) {
          Toaster(res.data.message, Colors.GREEN_COLOR);
          this.setState({ addingPlan: false });
          this.goBack();
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ addingPlan: false });
  };

  render() {
    const {
      commentAllow,
      screeningProtocolTest,
      testName,
      description,
      addingPlan,
      protocolsLoading,
      video,
      uploadPercentage,
    } = this.state;
    const { navigation } = this.props;
    const ProtocolData = navigation.getParam("content");

    return (
      <View style={{ height: DEV_HEIGHT }}>
        {this.state.uploading &&
        this.state.updatingIndex == undefined &&
        uploadPercentage !== null &&
        uploadPercentage !== undefined ? (
          <UploadingComponent value={uploadPercentage} />
        ) : null}
        <Container
          backFn={() => this.goBack()}
          title={
            ProtocolData.isCreatePage
              ? "Create Screening Protocol"
              : "Edit Screening Protocol"
          }
        >
          <View>
            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              placeholder={"Name"}
              inputStyle={{ fontSize: 11, paddingTop: 12 }}
              onChangeText={(text) => {
                this.setState({ protocolName: text });
              }}
              value={this.state.protocolName}
            />
            <Exercise
              navigation={this.props.navigation}
              stopLoading={this.state.stopLoading}
              onCbPress={() => this.toggleCheckBox()}
              exerciseTextChange={(text) => this.setState({ testName: text })}
              descriptionTextChange={(text) =>
                this.setState({ description: text })
              }
              onAddPress={() => this.addToScreeningProtocolExercises()}
              showAddBtn={true}
              testName={testName}
              descriptionValue={description}
              commentAllow={commentAllow}
              video={video?.full_path}
              onSelectVideo={() => {
                this.setState({ updatingIndex: undefined });
                this.onSelectVideo(undefined);
              }}
              uploading={
                this.state.uploading && this.state.updatingIndex == undefined
              }
              showUploadBtn={true}
              uploadPercentage={this.state.uploadPercentage}
            />
            {screeningProtocolTest.map((item, index) => {
              return (
                <View>
                  <Exercise
                    navigation={this.props.navigation}
                    stopLoading={this.state.stopLoading}
                    onCbPress={() =>
                      this.toggleCreatedCheckBox(item?.name, index)
                    }
                    exerciseTextChange={async (text) => {
                      await this.updateValues(index, "name", text);
                    }}
                    descriptionTextChange={async (text) => {
                      await this.updateValues(index, "description", text);
                    }}
                    onRemovePress={() => {
                      Alert.alert(
                        "Delete Screening Protocol Test",
                        `Are you sure you want to delete this Test "${item?.name}" ? This change will only be reflected after clicking on save button`,
                        [
                          { text: "Cancel" },
                          {
                            text: "OK",
                            onPress: () =>
                              this.removeScreeningProtocolExercise(index),
                          },
                        ]
                      );
                    }}
                    hasBeenAdded={true}
                    showAddBtn={false}
                    testName={item.name}
                    descriptionValue={item.description}
                    commentAllow={item.comment_allowed}
                    onSelectVideo={() => {
                      this.setState({ updatingIndex: index });
                      this.onSelectVideo(index);
                    }}
                    uploading={
                      this.state.uploading && index === this.state.updatingIndex
                    }
                    video={
                      item?.video_ref?.startsWith("http")
                        ? item?.video_ref
                        : item?.full_path
                    }
                    showUploadBtn={true}
                    uploadPercentage={this.state.videoUploadProgress[index]}
                  />
                </View>
              );
            })}
            <CustomButton
              type={1}
              isLoading={this.state.addingPlan}
              loaderColor={Colors.BACKGROUND}
              title={"Save"}
              onPress={() => {
                ProtocolData.isCreatePage
                  ? this.createScreeningProtocol()
                  : this.updateScreeningProtocol();
              }}
            />
          </View>
        </Container>
      </View>

      // <Modall
      //   crossPress={() => this.goBack()}
      //   savePress={() =>
      //     ProtocolData.isCreatePage
      //       ? this.createScreeningProtocol()
      //       : this.updateScreeningProtocol()
      //   }
      //   btnTxt={"Save"}
      //   title={
      //     ProtocolData.isCreatePage
      //       ? "Create Screening Protocol"
      //       : "Edit Screening Protocol"
      //   }
      //   loading={addingPlan}
      // >
      //   {protocolsLoading && !ProtocolData.isCreatePage ? (
      //     <Loader
      //       loaderProps={{ style: { marginTop: (DEV_HEIGHT * 15) / 100 } }}
      //     />
      //   ) : (
      //     <View>
      //       <Text style={styles.heads}>Name</Text>
      //       <PrimeInput
      //         inputProps={{
      //           onChangeText: (text) => {
      //             this.setState({ protocolName: text });
      //           },
      //           value: this.state.protocolName,
      //           style: {
      //             marginBottom: 15,
      //           },
      //         }}
      //         noAnimation={true}
      //       />
      //       <View style={styles.row}>
      //         <Text style={[styles.colName, { fontSize: FONT_SIZE(13) }]}>
      //           Name of Test
      //         </Text>
      //         <Text style={[styles.colName, { fontSize: FONT_SIZE(13) }]}>
      //           Description
      //         </Text>
      //         <Text style={[styles.colName, { fontSize: FONT_SIZE(13) }]}>
      //           Comment
      //         </Text>
      //         <View style={{ width: DEV_WIDTH * 0.03 }} />
      //         {/* <View style={{ width: DEV_WIDTH / 5 }} />
      //         <View style={{ width: DEV_WIDTH / 5 }} /> */}
      //       </View>
      //       <Hr />
      //       <Exercise
      //         stopLoading={this.state.stopLoading}
      //         onCbPress={() => this.toggleCheckBox()}
      //         exerciseTextChange={(text) => this.setState({ testName: text })}
      //         descriptionTextChange={(text) =>
      //           this.setState({ description: text })
      //         }
      //         onAddPress={() => this.addToScreeningProtocolExercises()}
      //         showAddBtn={true}
      //         testName={testName}
      //         descriptionValue={description}
      //         commentAllow={commentAllow}
      //         video={video?.full_path}
      //         onSelectVideo={() => {
      //           this.setState({ updatingIndex: undefined });
      //           this.onSelectVideo(undefined);
      //         }}
      //         uploading={
      //           this.state.uploading && this.state.updatingIndex == undefined
      //         }
      //         showUploadBtn={true}
      //         uploadPercentage={this.state.uploadPercentage}
      //       />
      //       {screeningProtocolTest.length > 0 && <Hr />}
      //       {screeningProtocolTest.map((item, index) => {
      //         return (
      //           <View>
      //             <Exercise
      //               stopLoading={this.state.stopLoading}
      //               onCbPress={() =>
      //                 this.toggleCreatedCheckBox(item?.name, index)
      //               }
      //               exerciseTextChange={async (text) => {
      //                 await this.updateValues(index, "name", text);
      //               }}
      //               descriptionTextChange={async (text) => {
      //                 await this.updateValues(index, "description", text);
      //               }}
      //               onRemovePress={() => {
      //                 Alert.alert(
      //                   "Delete Screening Protocol Test",
      //                   `Are you sure you want to delete this Test "${item?.name}" ? This change will only be reflected after clicking on save button`,
      //                   [
      //                     { text: "Cancel" },
      //                     {
      //                       text: "OK",
      //                       onPress: () =>
      //                         this.removeScreeningProtocolExercise(index),
      //                     },
      //                   ]
      //                 );
      //               }}
      //               hasBeenAdded={true}
      //               showAddBtn={false}
      //               testName={item.name}
      //               descriptionValue={item.description}
      //               commentAllow={item.comment_allowed}
      //               onSelectVideo={() => {
      //                 this.setState({ updatingIndex: index });
      //                 this.onSelectVideo(index);
      //               }}
      //               uploading={
      //                 this.state.uploading && index === this.state.updatingIndex
      //               }
      //               video={
      //                 item?.video_ref?.startsWith("http")
      //                   ? item?.video_ref
      //                   : item?.full_path
      //               }
      //               showUploadBtn={true}
      //               uploadPercentage={this.state.videoUploadProgress[index]}
      //             />
      //           </View>
      //         );
      //       })}
      //     </View>
      //   )}
      // </Modall>
    );
  }
}

const styles = StyleSheet.create({
  heads: {
    fontSize: 15,
    fontFamily: ROBO_BOLD,
    marginBottom: 5,
  },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.LIGHT_GREY,
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  colName: {
    fontFamily: ROBO_BOLD,
    width: DEV_WIDTH / 5,
  },
  emptyBox: {
    height: findSize(24),
    width: findSize(24),

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    backgroundColor: Colors.VALHALLA,
  },
  btn: {
    backgroundColor: Colors.INDIGO_COLOR,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 3,
  },
  inputs: {
    width: DEV_WIDTH * 0.25,
    height: 50,
    marginBottom: 5,
    marginRight: 10,
  },
});
