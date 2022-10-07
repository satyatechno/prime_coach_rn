import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Video from "react-native-video-controls";
import { Colors } from "../../constants/Colors";

const VideoPlayer = ({ url, style }) => {
  let ref = useRef(null);
  const onBuffer = () => {};
  const videoError = () => {};

  const [isPaused, setIsPaused] = useState(true);
  // const navigation  = useNavigation()

  // React.useEffect(
  //   () =>
  //     navigation.addListener('beforeRemove', (e) => {
  //       e.preventDefault();
  //       handleClick(e)
  //   }),
  //   [navigation]
  // );

  // const handleClick = (e) => {
  //   Promise.resolve()
  //     .then(() => {
  //       setIsPaused(true);
  //     })
  //     .then(() => navigation.dispatch(e.data.action));
  // };
  // console.log({ isPaused });

  return (
    <View style={[{ borderRadius: 10, overflow: "hidden" }, style]}>
      {/* <CustomButton 
      title={isPaused ? "Play" : "Paused"}
      onPress={() => console.log("REFFF" , ref?.current)
      }
      /> */}
      <Video
        source={{ uri: url }} // Can be a URL or a local file.
        ref={ref} // Store reference
        onBuffer={onBuffer} // Callback when remote video is buffering
        onError={videoError} // Callback when video cannot be loaded
        style={styles.backgroundVideo}
        controls={false}
        //  muted
        paused={isPaused}
        //  pictureInPicture
        posterResizeMode={"cover"}
        playInBackground={false}
        resizeMode={"cover"}
        tapAnywhereToPause={true}
        toggleResizeModeOnFullscreen={false}
        disableBack
        disableVolume
        disableFullscreen
        // onEnterFullscreen={() => Alert.alert("Full")}
        // onExitFullscreen={() => Alert.alert("Exit")}
        fullscreenAutorotate={true}
        fullscreenOrientation="all"
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}

        //  onBack={() => }
      />
    </View>
  );
};

export default VideoPlayer;

var styles = StyleSheet.create({
  backgroundVideo: {
    height: 200,
    width: "100%",
    backgroundColor: Colors.BACKGROUND,
  },
});
