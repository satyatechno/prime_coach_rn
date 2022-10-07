import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import HamBurger from "../../../../components/HamBurger";
import i18n from "../../../../locale/i18n";
import { Colors } from "../../../../constants/Colors";
import { ROBO_BOLD } from "../../../../constants/Fonts";

export default class Home extends Component {
  render() {
    return (
      <HamBurger onMenuPress={() => this.props.navigation.openDrawer()}>
        <Text style={styles.home}>{i18n.t("home.home")}</Text>
      </HamBurger>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    color: Colors.WHITE_COLOR,
    fontSize: 30,
    textAlign: "center",
    fontFamily: ROBO_BOLD,
    marginBottom: 10,
  },
});
