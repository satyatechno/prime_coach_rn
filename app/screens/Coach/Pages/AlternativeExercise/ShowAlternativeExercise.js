import React, { Component, createRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Modall from "../../../../components/Modall";
import { Colors } from "../../../../constants/Colors";
import Webview, { WebView } from "react-native-webview";
import { DEV_HEIGHT, DEV_WIDTH } from "../../../../constants/DeviceDetails";
import { styles } from "../TrainingPlan/Weeks.styles";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import PrimeInput from "../../../../components/PrimeInput";
import {
  POP_REGULAR,
  ROBO_BOLD,
  ROBO_MEDIUM,
} from "../../../../constants/Fonts";
import Container from "../../../../components/Container";
import { findSize } from "../../../../utils/helper";

function CheckBox(props) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View>
        <TouchableOpacity onPress={props.onPress}>
          <View
            style={[
              styles.emptyBox,
              {
                backgroundColor:
                  props.checked === "1" ? Colors.SKY_COLOR : Colors.WHITE_COLOR,
                borderColor:
                  props.checked === "1" ? Colors.SKY_COLOR : Colors.LIGHT_GREY,
              },
            ]}
          >
            {props.checked === "1" && (
              <Icons name="check-bold" color={Colors.WHITE_COLOR} size={25} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export class ShowAlternativeExercise extends Component {
  constructor(props) {
    super(props);

    this.webViewRef = createRef();
  }
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
  render() {
    const Param = this.props.navigation.getParam("content")?.data;
    return (
      // <Modall

      //   savePress={() => {
      //     this.webViewRef?.current?.stopLoading();
      //     // console.log("reffef",this.webViewRef?.current?.stopLoading())
      //     this.props.navigation.pop(1);
      //   }}
      //   btnTxt={'close'}
      //   title={''}
      //   containerProps={{ style: { flex: 3 / 4, marginVertical: 25 } }}
      //   loading={false}
      // >
      <Container
        backFn={() => {
          this.webViewRef?.current?.stopLoading();
          this.props.navigation.pop(1);
        }}
        title="View Alternative Exercise"
      >
        <Text style={stylesheet.title}>Group:</Text>
        <Text style={stylesheet.value}>
          {Param?.exercise_group?.exercise_group}
        </Text>

        <Text style={stylesheet.title}>Exercise:</Text>
        <Text style={stylesheet.value}>{Param?.exercise}</Text>

        {/* <Webview
          ref={this.webViewRef}
          allowsFullscreenVideo
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}
          style={stylesheet.webView}
          source={{
            html: this.convertToIframe(Param?.video),
          }}
        /> */}

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
              html: this.convertToIframe(Param?.video),
            }}
          />
        </View>
      </Container>
    );
  }
}
const stylesheet = StyleSheet.create({
  name: {
    color: Colors.BLACK_COLOR,
    fontSize: 20,
    marginBottom: 10,
  },

  webView: {
    height: DEV_HEIGHT / 4.5,
    width: DEV_WIDTH - 50,
    backgroundColor: Colors.BG_LIGHT,
    alignSelf: "center",
    flex: 1,
    marginBottom: 15,
  },
  exerciseText: {
    color: Colors.BLACK_COLOR,
    fontSize: 17,
    fontFamily: ROBO_BOLD,
  },
  title: {
    fontSize: findSize(12),
    fontFamily: POP_REGULAR,
    color: Colors.INPUT_PLACE,
    marginTop: 10,
  },
  value: {
    fontSize: findSize(13),
    fontFamily: POP_REGULAR,
    color: Colors.WHITE_COLOR,
  },
});
export default ShowAlternativeExercise;
