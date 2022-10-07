import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/Colors";
import { ROBO_BOLD } from "../../constants/Fonts";
import i18n from "../../locale/i18n";

export default class ReferPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container backFn={() => this.props.navigation.goBack()}>
        <Text style={styles.editEmail}>{i18n.t("profile.refer")}</Text>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  editEmail: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_BOLD,
    textAlign: "center",
    fontSize: 30,
    marginBottom: 25,
  },
});
