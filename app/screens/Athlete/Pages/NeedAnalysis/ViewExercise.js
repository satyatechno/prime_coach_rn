import React, { Component } from "react";
import { StyleSheet } from "react-native";
import Modall from "../../../../components/Modall";
import Webview from "react-native-webview";
import { Colors } from "../../../../constants/Colors";
import { DEV_WIDTH, DEV_HEIGHT } from "../../../../constants/DeviceDetails";

export default class ViewExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  getId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  render() {
    const { navigation } = this.props;
    const Exercise = navigation.getParam("content");
    const videoId = this.getId(Exercise.exerciseUrl);
    const iframeMarkup =
      '<iframe width="100%" height="570" src="https://www.youtube.com/embed/' +
      videoId +
      '" frameborder="0" allowFullScreen ></iframe>';
    return (
      <Modall
        crossPress={() => this.goBack()}
        savePress={() => null}
        btnTxt={"Save"}
        hideSaveBtn={true}
        containerProps={{ style: { flex: 1 / 2.5 } }}
      >
        <Webview
          allowsFullscreenVideo
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}
          style={styles.webView}
          source={{ html: iframeMarkup }}
        />
      </Modall>
    );
  }
}

const styles = StyleSheet.create({
  webView: {
    height: DEV_HEIGHT / 4,
    width: DEV_WIDTH,
    backgroundColor: Colors.BG_LIGHT,
  },
});
