import React, { Component } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import Modall from "../../../../components/Modall";
import Webview from "react-native-webview";
import { DEV_WIDTH, DEV_HEIGHT } from "../../../../constants/DeviceDetails";
import { Colors } from "../../../../constants/Colors";
import { ROBO_MEDIUM } from "../../../../constants/Fonts";
import Icon from "react-native-vector-icons/FontAwesome5";
import { standardPostApi } from "../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import PrimeImage from "../../../../components/PrimeImage";

function Hr(props) {
  return <View style={[styles.line, props && props.style]} />;
}

function CheckBox(props) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ width: DEV_WIDTH / 3 }}>
        <Text>{props.dysfunction}</Text>
        <PrimeImage source={{ uri: props.image }} style={styles.dysfunctionImg} />
      </View>
      <View>
        <TouchableOpacity onPress={props.onPress}>
          <View
            style={[
              styles.emptyBox,
              {
                backgroundColor: props.checked
                  ? Colors.SKY_COLOR
                  : Colors.WHITE_COLOR,
                borderColor: props.checked ? Colors.SKY_COLOR : Colors.BG_LIGHT,
              },
            ]}
          >
            {props.checked && (
              <Icon name="check" color={Colors.WHITE_COLOR} size={25} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default class SelfScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDysfunctions: [],
      savingSelfScreening: false,
    };
    this.initiateDysFunctionsArray();
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc();
  }

  saveSelfScreeningDetails = async () => {
    const { selectedDysfunctions } = this.state;
    const { navigation } = this.props;
    const Exercise = navigation.getParam("content");
    this.setState({ savingSelfScreening: true });
    try {
      const res = await standardPostApi(
        "save_self_screening",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          screening_id: Exercise.id,
          dysfunctions: JSON.stringify(selectedDysfunctions),
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({ savingSelfScreening: false });
        this.goBack();
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ savingSelfScreening: false });
  };

  getId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  initiateDysFunctionsArray = async () => {
    const { selectedDysfunctions } = this.state;
    const { navigation } = this.props;
    const Exercise = navigation.getParam("content");
    for (let i = 0; i < Exercise.dysfunction.length; i++) {
      selectedDysfunctions.push({ id: Exercise.dysfunction[i].id, status: 0 });
    }
  };

  toggleCheckBox = async (id, index) => {
    const { selectedDysfunctions } = this.state;
    const { navigation } = this.props;
    const DYS_ARR = navigation.getParam("content").dysfunction;
    const changedCheckbox = DYS_ARR.find((cb) => cb.id === id);
    changedCheckbox.checked = !changedCheckbox.checked;
    if (changedCheckbox.checked === true) {
      selectedDysfunctions[index].status = 1;
    } else if (changedCheckbox.checked === false) {
      selectedDysfunctions[index].status = 0;
    }
    const checkboxes = Object.assign({}, DYS_ARR, changedCheckbox);
    this.setState({ checkboxes });
  };

  render() {
    const { savingSelfScreening } = this.state;
    const { navigation } = this.props;
    const Exercise = navigation.getParam("content");
    const videoId = this.getId(Exercise.video);
    const iframeMarkup =
      '<iframe width="100%" height="500" src="https://www.youtube.com/embed/' +
      videoId +
      '" frameborder="0" allowFullScreen></iframe>';
    var result;
    result = Exercise.dysfunction.map(function (el) {
      var o = Object.assign({}, el);
      o.checked = false;
      return o;
    });
    return (
      <Modall
        crossPress={() => this.goBack()}
        savePress={() => this.saveSelfScreeningDetails()}
        btnTxt={"Save"}
        title={Exercise.name}
        loading={savingSelfScreening}
        containerProps={{ style: { flex: 4 / 5 } }}
      >
        <Webview
          allowsFullscreenVideo
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}
          style={styles.webView}
          source={{ html: iframeMarkup }}
        />
        <View style={styles.dysfunctionView}>
          <Text style={styles.dysfunctionTxt}>Dysfunction</Text>
          <Text style={styles.dysfunctionTxt}>Applies?</Text>
        </View>
        <Hr />
        {Exercise.dysfunction &&
          Exercise.dysfunction.map((item, index) => {
            return (
              <CheckBox
                dysfunction={item.name}
                image={item.image}
                checked={item.checked}
                onPress={() => this.toggleCheckBox(item.id, index)}
              />
            );
          })}
      </Modall>
    );
  }
}

const styles = StyleSheet.create({
  webView: {
    height: DEV_HEIGHT / 4.3,
    width: DEV_WIDTH - 50,
    backgroundColor: Colors.BG_LIGHT,
    alignSelf: "center",
  },
  dysfunctionTxt: {
    fontSize: 15,
    fontFamily: ROBO_MEDIUM,
    color: Colors.BLACK_COLOR,
  },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.LIGHT_GREY,
    marginVertical: 8,
  },
  dysfunctionView: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dysfunctionImg: {
    height: DEV_HEIGHT / 6,
    width: DEV_WIDTH / 3,
    resizeMode: "contain",
    marginTop: -10,
  },
  emptyBox: {
    height: 35,
    width: 35,
    borderWidth: 1.3,
    alignItems: "center",
    justifyContent: "center",
  },
});
