import React, { Component } from "react";
import { Text, StyleSheet, Linking, ActivityIndicator } from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/Colors";
import { ROBO_BOLD } from "../../constants/Fonts";
import i18n from "../../locale/i18n";
import HTML from "react-native-render-html";
import { standardPostApi } from "../../api/ApiWrapper";

export default class PrivacyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privacyLoading: true,
      privacyData: "",
    };
    this.fetchPrivacy();
  }

  fetchPrivacy = async () => {
    try {
      const res = await standardPostApi(
        "list_privacy_policy_data",
        undefined,
        {},
        true
      );
      if (res.data.code == 200) {
        this.setState({
          privacyData: res.data.data.PrivacyPolicy[0].html,
          privacyLoading: false,
        });
        console.log("The privacy content is ", res.data.data.PrivacyPolicy);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { privacyData, privacyLoading } = this.state;
    return (
      <Container
        backFn={() => this.props.navigation.goBack()}
        title={i18n.t("profile.privacy")}
      >
        {/* <Text style={styles.editEmail}>{}</Text> */}
        {privacyLoading ? (
          <ActivityIndicator
            size="large"
            color={Colors.SKY_COLOR}
            style={{ marginTop: 150 }}
          />
        ) : (
          <HTML
            html={privacyData}
            onLinkPress={(event, href) => {
              console.log("the event ", event);
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
