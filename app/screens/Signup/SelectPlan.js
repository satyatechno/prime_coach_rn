import React, { Component } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import Container from "../../components/Container";
import i18n from "../../locale/i18n";
import { Colors } from "../../constants/Colors";
import { ROBO_BOLD } from "../../constants/Fonts";
import Card from "./components/Card";
import { standardPostApi } from "../../api/ApiWrapper";

export default class SelectPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allPlans: [],
      plansLoading: true,
    };
    this.listPlans();
  }

  listPlans = async () => {
    try {
      const res = await standardPostApi(
        "list_subscription_plans",
        undefined,
        {},
        true
      );
      if (res.data.code == 200) {
        console.log(res.data.data.PLANS);
        this.setState({
          allPlans: res.data.data.PLANS,
          plansLoading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { plansLoading, allPlans } = this.state;
    const { navigation } = this.props;
    const sports_id = navigation.getParam("sports_id");
    return (
      <Container backFn={() => this.props.navigation.goBack()}>
        <Text style={styles.selectTxt}>{i18n.t("signup.selectPlan")}</Text>
        <View style={{ flex: 1 }}>
          {plansLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.SKY_COLOR}
              style={{ marginTop: 150 }}
            />
          ) : (
            allPlans.map((item) => (
              <Card
                dataArray={item.content}
                plan={item.planName}
                onSelect={() =>
                  this.props.navigation.navigate("Register", {
                    ids: {
                      sports_id: sports_id,
                      plan_id: item.planId,
                    },
                  })
                }
              />
            ))
          )}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  selectTxt: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_BOLD,
    textAlign: "center",
    fontSize: 30,
    marginBottom: 25,
  },
});
