import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/Colors";
import { ROBO_BOLD, ROBO_REGULAR } from "../../constants/Fonts";
import i18n from "../../locale/i18n";
import PrimeInput from "../../components/PrimeInput";

export default class EditEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigation } = this.props;
    const profile_data = navigation.getParam("content");
    return (
      <Container backFn={() => this.props.navigation.goBack()}>
        <Text style={styles.editEmail}>{i18n.t("profile.email")}</Text>
        <Text style={styles.heads}>{i18n.t("profile.emailNoUpdate")}</Text>
        <PrimeInput
          inputProps={{
            value: profile_data.email,
            editable: false,
          }}
          noAnimation={true}
        />
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
  heads: {
    fontSize: 15,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    marginBottom: 5,
  },
  btn: {
    width: 100,
    alignSelf: "center",
    backgroundColor: Colors.BG_COLOR,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
  },
});
