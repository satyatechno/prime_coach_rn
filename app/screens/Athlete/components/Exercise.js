import React, { Component } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../../../constants/Colors";
import { ROBO_REGULAR } from "../../../constants/Fonts";
import { DEV_WIDTH } from "../../../constants/DeviceDetails";
import Icon from "react-native-vector-icons/FontAwesome5";

export default class Exercise extends Component {
  render() {
    const { isCorrectExercise } = this.props;
    return (
      <View>
        <View
          style={[styles.row, isCorrectExercise && { alignItems: "center" }]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.exercisesTxt,
              isCorrectExercise
                ? { width: DEV_WIDTH / 1.3 }
                : { width: DEV_WIDTH / 2 },
            ]}
          >
            {this.props.exerciseName}
          </Text>
          <TouchableOpacity
            onPress={this.props.onPress}
            style={isCorrectExercise ? styles.playBtn : styles.btn}
          >
            {isCorrectExercise ? (
              <Icon name="play" size={20} color={Colors.SKY_COLOR} />
            ) : (
              <Text style={styles.btnTxt}>{this.props.btnTxt}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  btn: {
    backgroundColor: Colors.BG_LIGHT,
    padding: 8,
    borderColor: Colors.SKY_COLOR,
    borderWidth: 1,
    borderRadius: 5,
  },
  exercisesTxt: {
    color: Colors.WHITE_COLOR,
    fontSize: 15,
    fontFamily: ROBO_REGULAR,
  },
  btnTxt: {
    color: Colors.WHITE_COLOR,
    fontSize: 15,
    fontFamily: ROBO_REGULAR,
  },
  playBtn: {
    padding: 5,
  },
});
