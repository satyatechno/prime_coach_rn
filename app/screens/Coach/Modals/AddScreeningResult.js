import React, { Component, createRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Platform,
} from "react-native";

import Webview from "react-native-webview";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import Modall from "../../../components/Modall";
import { DEV_HEIGHT, DEV_WIDTH } from "../../../constants/DeviceDetails";
import Video from "react-native-video";
import Loader from "../../../components/Loader";
import Spinnner from "../../../components/Spinnner";
import { Colors } from "../../../constants/Colors";
import AsyncStorage from "@react-native-community/async-storage";
import { Toaster } from "../../../components/Toaster";
// import DocumentPicker from 'react-native-document-picker';
import {
  standardPostApiJsonBased,
  uploadVideoOnServer,
} from "../../../api/ApiWrapper";
import { launchImageLibrary } from "react-native-image-picker";

export class AddScreeningResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      uploadLoading: false,
      description: "",
      video: "",
    };
    this.webViewRef = createRef();
  }

  getId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };
  // convertToIframe = (url) => {
  //   return (
  //     '<video width="100%" height="100%" controls src="' +
  //     url +
  //     '" type="video/mp4" ></video>'
  //   );
  // };

  convertToIframe = (url) => {
    return `<video width="100%" height="100%" controls src="${url}" type="video/mp4" ></video>`;
  };
  convertToIframe1 = (url) => {
    return (
      '<video width="100%" height="100%" controls><source src="' +
      url +
      '" type="video/mp4" /></video>'
    );
  };

  onSelectVideo = async () => {
    try {
      // const { p, csv, plainText } = DocumentPicker.types;
      // const results = await DocumentPicker.pick({
      //   type: ['.mp4', 'video/*'],
      // });
      const results = await launchImageLibrary({
        mediaType: "video",
      });
      const file = results?.assets?.[0];

      this.setState({
        video: {
          name: file?.name ?? "",
          uri:
            Platform.OS === "ios" ? file.uri?.replace("file://", "") : file.uri,
          type: file.type,
          size: file.size,
        },
      });
    } catch (err) {
      //   if (DocumentPicker.isCancel(err)) {
      //     console.log('User cancelled the picker,');
      //   } else {
      //     throw err;
      //   }
    }
  };

  onSave = async () => {
    const { navigation } = this.props;
    const refreshFunc = navigation.getParam("refreshFunc");
    const playerData = navigation.getParam("playerData");
    const screeningTest = navigation.getParam("screeningTest");
    const currentPage = navigation.getParam("currentPage");
    const teamData = navigation.getParam("teamData");

    const { description, video } = this.state;

    this.setState({ loading: true });

    const data = new FormData();

    data.append(
      "access_token",
      await AsyncStorage.getItem("@USER_ACCESS_TOKEN")
    );
    data.append("user_id", playerData?.user_id);
    data.append("screening_protocol_test_id", screeningTest?.id);
    if (video?.uri) {
      data.append("video", video);
    }
    if (description?.length) {
      data.append("user_comment", description);
    }
    data.append("team_id", teamData?.id);
    data.append("resultset_no", currentPage);
    const isValid = this.validationAddResultTest();

    if (isValid) {
      uploadVideoOnServer("add_user_screening_protocol_test_result", data)
        .then((res) => {
          console.log("This is response of Add Result", res.data);
          if (res.data.code === 200) {
            this.webViewRef?.stopLoading();
            Toaster(res.data.message, Colors.GREEN_COLOR);
            refreshFunc();
            setTimeout(() => {
              this.props.navigation?.goBack();
            }, 800);
          }
        })
        .catch((err) => {
          console.log("errorrrrr", err);
        })
        .finally(() => this.setState({ loading: false }));

      // try {
      //   const res = await standardPostApiJsonBased(
      //     'add_user_screening_protocol_test_result',
      //     undefined,
      //     data,
      //     true
      //   );

      //   console.log('This is response of Add Result', res);
      //   if (res.data.code === 200) {
      //     this.setState({ loading: false });
      //     Toaster(res.data.message, Colors.GREEN_COLOR);
      //     refreshFunc();
      //     this.props.navigation.goBack();
      //   }
      // } catch (error) {
      //   console.error(error);
      //   this.setState({ loading: false });
      // }
    }
  };
  validationAddResultTest() {
    const { video, description } = this.state;
    const { navigation } = this.props;
    const screeningTest = navigation.getParam("screeningTest");

    if (screeningTest?.comment_allowed == "0") {
      if (!video?.uri?.length) {
        Toaster("Please upload viedio.", Colors.RED_COLOR);

        this.setState({ loading: false });
        return false;
      } else {
        return true;
      }
    } else {
      if (!description?.length) {
        Toaster("Comment Field is required.", Colors.RED_COLOR);

        this.setState({ loading: false });
        return false;
      } else {
        return true;
      }
    }
  }

  render() {
    const { navigation } = this.props;
    const teamData = navigation.getParam("teamData");
    const playerData = navigation.getParam("playerData");
    // const selectedProtocol = navigation.getParam('selectedProtocol');
    // const currentPage = navigation.getParam('currentPage');
    const screeningTest = navigation.getParam("screeningTest");
    const { loading, uploadLoading, description, video } = this.state;
    console.log("Player Data", screeningTest?.video_ref);

    return (
      <Modall
        crossPress={() => {
          this.webViewRef?.stopLoading();
          this.props.navigation.goBack();
        }}
        savePress={() => this.onSave()}
        btnTxt={"Save"}
        title={"Add Screening Result"}
        loading={loading}
      >
        <View
          style={{
            borderWidth: 2,
            borderColor: Colors.SKY_COLOR,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 5,
            marginBottom: 10,
          }}
        >
          <Text style={styles.name}>{screeningTest?.name}</Text>
        </View>
        <Webview
          ref={(o) => (this.webViewRef = o)}
          startInLoadingState={true}
          allowsFullscreenVideo
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}
          style={styles.webView}
          source={{
            html: this.convertToIframe1(screeningTest?.video_ref),
          }}
        />
        <Text style={styles.description}>{screeningTest?.description}</Text>
        <View style={styles.hr} />
        {screeningTest?.comment_allowed == "1" ? (
          <TextInput
            value={description}
            onChangeText={(text) => this.setState({ description: text })}
            style={styles.textInput}
            multiline={true}
            numberOfLines={4}
            placeholderTextColor={"grey"}
            placeholder="Comments..."
            editable={!loading}
          />
        ) : null}
        {video?.uri ? (
          <>
            <Text
              style={{ color: Colors.BLACK_COLOR, fontSize: 16, marginTop: 10 }}
            >
              User Video
            </Text>
            <Video
              source={{ uri: video?.uri }}
              controls={true}
              paused={true}
              style={styles.webView}
              resizeMode="cover"
            />
            {/* <Webview
              allowsFullscreenVideo
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              bounces={false}
              style={styles.webView}
              source={{
                // uri: video?.uri,
                html: this.convertToIframe(video?.uri),
              }}
            /> */}
          </>
        ) : null}
        <TouchableOpacity
          disabled={loading}
          style={styles.btn}
          onPress={() => this.onSelectVideo()}
        >
          <Text style={styles.name}>Upload Video</Text>
          {uploadLoading ? (
            <ActivityIndicator color={Colors.SKY_COLOR} size={25} />
          ) : null}
        </TouchableOpacity>
      </Modall>
    );
  }
}
const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
  },

  name: {
    color: Colors.SKY_COLOR,
    fontSize: 22,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
    height: 90,
    textAlignVertical: "top",
    paddingHorizontal: 7,
  },
  description: {
    color: Colors.BLACK_COLOR,
    fontSize: 15,
    marginVertical: 10,
  },
  webView: {
    height: DEV_HEIGHT * 0.3,
    backgroundColor: Colors.BG_LIGHT,
    overflow: "hidden",
    width: "100%",
  },
  hr: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.LIGHT_GREY,
    marginBottom: 10,
  },
});
export default AddScreeningResult;
