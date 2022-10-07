import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../../constants/Colors";
import { ROBO_MEDIUM, ROBO_REGULAR } from "../../../constants/Fonts";
import i18n from "../../../locale/i18n";

export default class Card extends Component {
  render() {
    return (
      <View style={{ marginBottom: 25 }}>
        <View style={styles.skyBg}>
          <Text style={styles.planName}>{this.props.plan}</Text>
        </View>
        <View style={styles.greyBg}>
          {this.props.dataArray &&
            this.props.dataArray.map((i) => (
              <Text style={styles.detailTxt}>- {i.desc}</Text>
            ))}
        </View>
        <View style={styles.whiteBg}>
          <TouchableOpacity
            onPress={this.props.onSelect}
            style={styles.selectBtn}
          >
            <Text style={styles.selectBtnTxt}>{i18n.t("signup.select")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  planName: {
    fontSize: 25,
    fontFamily: ROBO_MEDIUM,
    color: Colors.WHITE_COLOR,
    textAlign: "center",
    padding: 20,
  },
  skyBg: {
    backgroundColor: Colors.INDIGO_COLOR,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  greyBg: {
    backgroundColor: Colors.BG_LIGHT,
    padding: 15,
    justifyContent: "center",
  },
  detailTxt: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    marginBottom: 5,
  },
  whiteBg: {
    height: 55,
    backgroundColor: Colors.WHITE_COLOR,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  selectBtn: {
    backgroundColor: Colors.LIGHT_SKY,
    width: 75,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
  },
  selectBtnTxt: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_MEDIUM,
  },
});
