import React, { Component } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import PrimeImage from "../../../components/PrimeImage";
import { Colors } from "../../../constants/Colors";
import { ROBO_MEDIUM } from "../../../constants/Fonts";

export default class Poster extends Component {
  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={this.props.posterPress}
          style={{ marginBottom: 25 }}
        >
          <View style={styles.backgrnd}>
            <Text style={styles.title}>{this.props.title}</Text>
            <PrimeImage style={styles.image} source={{ uri: this.props.coverUrl }} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgrnd: {
    backgroundColor: Colors.WHITE_COLOR,
    alignItems: "center",
    borderRadius: 3,
  },
  title: {
    fontSize: 15,
    fontFamily: ROBO_MEDIUM,
    color: Colors.BLACK_COLOR,
    paddingVertical: 5,
  },
  image: {
    resizeMode: "contain",
    width: "100%",
    height: 295,
  },
});
