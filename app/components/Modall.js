import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Colors } from "../constants/Colors";
import { ROBO_MEDIUM, ROBO_REGULAR } from "../constants/Fonts";
import { PropTypes } from "prop-types";
import { DEV_HEIGHT, DEV_WIDTH } from "../constants/DeviceDetails";

const KEYBOARD_VIEW = Platform.OS === "ios" ? KeyboardAvoidingView : View;

class Modall extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  render() {
    const { loading, containerProps, hideSaveBtn, removePadding } = this.props;
    return (
      <SafeAreaView
        style={[
          styles.safeView,
          removePadding
            ? { paddingHorizontal: 0 }
            : { paddingHorizontal: "4%" },
        ]}
      >
        <KEYBOARD_VIEW
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
          behavior="padding"
        >
          <View
            {...containerProps}
            style={[styles.whiteBg, containerProps && containerProps.style]}
          >
            <View style={styles.row}>
              <Text style={styles.title}>{this.props.title}</Text>
              <TouchableOpacity
                onPress={this.props.crossPress}
                style={{ padding: 15 }}
              >
                <Icon name="cross" color={Colors.LIGHT_GREY} size={30} />
              </TouchableOpacity>
            </View>
            <View style={[styles.line, { marginBottom: 12 }]} />
            <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
              {this.props.children}
            </ScrollView>
            {!hideSaveBtn && (
              <View>
                <View style={styles.line} />
                <View style={styles.saveContainer}>
                  <TouchableOpacity
                    onPress={this.props.savePress}
                    style={styles.saveBtn}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.WHITE_COLOR} />
                    ) : (
                      <Text style={styles.saveTxt}>{this.props.btnTxt}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </KEYBOARD_VIEW>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR,
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    color: Colors.BLACK_COLOR,
    fontFamily: ROBO_REGULAR,
    padding: 15,
    width: 235,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GREY,
  },
  whiteBg: {
    flex:DEV_WIDTH>DEV_HEIGHT?1: 3 / 4,
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 5,
  },
  saveBtn: {
    backgroundColor: Colors.LIGHT_SKY,
    width: 75,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  saveContainer: {
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
  },
  saveTxt: {
    fontFamily: ROBO_MEDIUM,
    color: Colors.WHITE_COLOR,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

Modall.propTypes = {
  containerProps: PropTypes.object,
};

export default Modall;
