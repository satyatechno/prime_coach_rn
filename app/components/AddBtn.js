import React, { Component } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../constants/Colors";
import { ROBO_MEDIUM } from "../constants/Fonts";

export default class AddBtn extends Component {
  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={this.props.onAddPress}
          style={styles.startBtn}
        >
          <View style={styles.startCont}>
            <Text style={styles.startTxt}>{this.props.btnText}</Text>
            <Icon name="md-add" size={25} color={Colors.WHITE_COLOR} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  startBtn: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 8,
    borderColor: Colors.SKY_COLOR,
    justifyContent: "center",
    width: 190,
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  startCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  startTxt: {
    fontSize: 18,
    fontFamily: ROBO_MEDIUM,
    color: Colors.WHITE_COLOR,
  },
});
