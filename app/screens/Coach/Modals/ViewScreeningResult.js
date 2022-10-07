import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';

import Webview from 'react-native-webview';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modall from '../../../components/Modall';
import { DEV_HEIGHT, DEV_WIDTH } from '../../../constants/DeviceDetails';
import Video from 'react-native-video';
import Loader from '../../../components/Loader';
import Spinnner from '../../../components/Spinnner';
import { Colors } from '../../../constants/Colors';

export class ViewScreeningResult extends Component {
  state = {
    loading: false,
  };
  getId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };
  convertToIframe = (url) => {
    return (
      '<video width="100%" height="100%" controls><source src="' +
      url +
      '" type="video/mp4" /></video>'
    );
    // return (
    //   '<iframe width="100%" height="500" src="https://www.youtube.com/embed/' +
    //   videoId +
    //   '" frameborder="0" allowFullScreen></iframe>'
    // );
  };
  render() {
    const { navigation } = this.props;
    // const teamData = navigation.getParam('teamData');
    // const playerData = navigation.getParam('playerData');
    // const selectedProtocol = navigation.getParam('selectedProtocol');
    // const currentPage = navigation.getParam('currentPage');
    const screeningTest = navigation.getParam('screeningTest');

    return (
      <Modall
        crossPress={() => this.props.navigation.goBack()}
        savePress={() => this.props.navigation.goBack()}
        btnTxt={'close'}
        title={screeningTest?.name}
        containerProps={{ style: { flex: 3 / 4, marginVertical: 25 } }}
        loading={false}
      >
        {screeningTest?.screening_protocol_test_result?.[0]?.user_video.startsWith(
          'http'
        ) ? (
          <Webview
            allowsFullscreenVideo
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            bounces={false}
            style={styles.webView}
            source={{
              html: this.convertToIframe(
                screeningTest?.screening_protocol_test_result?.[0]?.user_video
              ),
            }}
          />
        ) : null}
        <Text style={styles.description}>
          {screeningTest?.screening_protocol_test_result?.[0]?.user_comment}
        </Text>
      </Modall>
    );
  }
}
const styles = StyleSheet.create({
  description: {
    color: Colors.BLACK_COLOR,
    fontSize: 15,
    marginVertical: 10,
  },

  webView: {
    height: DEV_HEIGHT * 0.3,
    backgroundColor: Colors.BG_LIGHT,

    marginBottom: 10,
    overflow: 'hidden',
    width: '100%',
  },
});
export default ViewScreeningResult;
