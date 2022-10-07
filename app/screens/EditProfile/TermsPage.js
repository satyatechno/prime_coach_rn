import React, { Component } from "react";
import { Text, StyleSheet, ActivityIndicator, Linking } from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/Colors";
import { ROBO_BOLD } from "../../constants/Fonts";
import i18n from "../../locale/i18n";
import HTML from "react-native-render-html";
import { standardPostApi } from "../../api/ApiWrapper";

export default class TermsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      termsLoading: true,
      termsData: [],
    };
    this.fetchTerms();
  }

  fetchTerms = async () => {
    try {
      const res = await standardPostApi(
        "list_terms_and_conditions_data",
        undefined,
        {},
        true
      );
      if (res.data.code == 200) {
        this.setState({
          termsData: res.data.data.TermsAndConditions[0].html,
          termsLoading: false,
        });
        console.log("The terms content is ", res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { termsLoading, termsData } = this.state;
    return (
      <Container
        backFn={() => this.props.navigation.goBack()}
        title={i18n.t("profile.terms")}
      >
        {/* <Text style={styles.editEmail}>{}</Text> */}
        {termsLoading ? (
          <ActivityIndicator
            size="large"
            color={Colors.SKY_COLOR}
            style={{ marginTop: 150 }}
          />
        ) : (
          <HTML
            html={termsData}
            onLinkPress={(event, href) => {
              Linking.openURL(href);
            }}
          />
        )}
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
  },
});
