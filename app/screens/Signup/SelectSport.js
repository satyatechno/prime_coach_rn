import React, { Component } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/Colors";
import { ROBO_BOLD } from "../../constants/Fonts";
import i18n from "../../locale/i18n";
import Poster from "./components/Poster";
import { standardPostApi } from "../../api/ApiWrapper";

export default class SelectSport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allSports: [],
      sportsLoading: true,
    };
    this.listSports();
  }

  listSports = async () => {
    try {
      const res = await standardPostApi("list_all_sports", undefined, {}, true);
      if (res.data.code == 200) {
        this.setState({
          allSports: res.data.data.AllSports,
          sportsLoading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { sportsLoading, allSports } = this.state;
    return (
      <Container backFn={() => this.props.navigation.goBack()}>
        <Text style={styles.selectTxt}>{i18n.t("signup.selectSport")}</Text>
        <View style={{ flex: 1 }}>
          {sportsLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.SKY_COLOR}
              style={{ marginTop: 150 }}
            />
          ) : (
            allSports.map((i) => (
              <Poster
                posterPress={() =>
                  this.props.navigation.navigate("SelectPlan", {
                    sports_id: i.id,
                  })
                }
                coverUrl={i.sport_image}
                title={i.sport_name}
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
