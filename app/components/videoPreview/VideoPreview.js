import { Text, View } from "react-native";
import React, { useRef } from "react";
import Container from "../Container";
import { DEV_HEIGHT, DEV_WIDTH } from "../../constants/DeviceDetails";
import { Colors } from "../../constants/Colors";
import WebView from "react-native-webview";
import Video from "react-native-video";

const VideoPreview = ({ navigation }) => {
  const data = navigation.getParam("data");
  console.log("dddd", data);
  const webViewRef = useRef();
  convertToIframe = (url) => {
    return (
      '<video width="100%" height="100%" controls><source src="' +
      url +
      '" type="video/mp4" /></video>'
    );
  };
  return (
    <Container
      backFn={() => {
        webViewRef?.current?.stopLoading();
        navigation?.goBack();
      }}
    >
      <View
        style={{
          paddingTop: 30,
        }}
      >
        {data?.isLocal ? (
          <Video
            source={{ uri: data?.url }}
            controls={true}
            paused={true}
            style={{
              height: DEV_HEIGHT * 0.25,
              backgroundColor: Colors.BG_LIGHT,
              overflow: "hidden",
              width: "100%",
            }}
            resizeMode="cover"
          />
        ) : (
          <WebView
            ref={webViewRef}
            startInLoadingState={true}
            allowsFullscreenVideo
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            bounces={false}
            style={{
              height: DEV_HEIGHT * 0.25,
              backgroundColor: Colors.BACKGROUND,
              overflow: "hidden",
              width: DEV_WIDTH - 40,
            }}
            source={{
              html: convertToIframe(data?.url),
            }}
          />
        )}
      </View>
    </Container>
  );
};

export default VideoPreview;
