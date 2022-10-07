import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import Container from "../../../../components/Container";
import Loader from "../../../../components/Loader";
import { Colors } from "../../../../constants/Colors";
import i18n from "../../../../locale/i18n";
import { ROBO_REGULAR, ROBO_MEDIUM } from "../../../../constants/Fonts";
import AsyncStorage from "@react-native-community/async-storage";
import { standardPostApi } from "../../../../api/ApiWrapper";
import { DEV_WIDTH } from "../../../../constants/DeviceDetails";
import TildView from "../../../../components/tildView/TildView";
import { findSize } from "../../../../utils/helper";

export default class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allPlayers: [],
      dataLoading: true,
    };
    this.listTeamReport();
  }

  listTeamReport = async () => {
    const { navigation } = this.props;
    const teamData = navigation.getParam("teamData");
    try {
      const res = await standardPostApi(
        "list_team_player_report",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          team: teamData.id,
        },
        true
      );
      if (res.data.code == 200) {
        let allAthletes = res.data.data.Athelete;
        this.setState({
          allPlayers: allAthletes,
          dataLoading: false,
        });
        console.log(allAthletes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { navigation } = this.props;
    const { allPlayers, dataLoading } = this.state;
    const teamData = navigation.getParam("teamData");
    return (
      <Container
        backFn={() => this.props.navigation.goBack()}
        title={`${teamData.team_name} Reports`}
      >
        {dataLoading ? (
          <Loader />
        ) : (
          <View>
            {allPlayers.map((item) => {
              let fullName = item.first_name + " " + item.last_name;
              return (
                <TildView>
                  <View style={styles.reportBg}>
                    <View style={styles.reportRow}>
                      <View style={styles.img}>
                        <Image
                          style={styles.img}
                          source={require("../../../../../assets/images/avtar.png")}
                        />
                      </View>
                      <Text style={styles.playerName}>{fullName}</Text>
                    </View>
                    <View>
                      {Object.keys(item.activities).map((key) => {
                        return (
                          <View style={styles.rowContainer}>
                            <View style={{ flexDirection: "row" }}>
                              <View
                                style={{
                                  height: 8,
                                  width: 8,
                                  borderRadius: 4,
                                  backgroundColor: Colors.INPUT_PLACE,
                                  marginEnd: 8,
                                }}
                              />
                              <Text style={styles.keys}>{key}</Text>
                            </View>
                            <Text style={styles.keys}>
                              {item?.activities?.[key]}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                    {/* <View style={styles.rowContainer}>
                      {Object.values(item.activities).map((value) => {
                        return (
                          <View>
                            <Text style={[styles.keys, { marginVertical: 0 }]}>
                              {value}
                            </Text>
                          </View>
                        );
                      })}
                    </View> */}
                  </View>
                </TildView>
              );
            })}
          </View>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  reports: {
    color: Colors.WHITE_COLOR,
    fontSize: 18,
    fontFamily: ROBO_REGULAR,
    marginBottom: 15,
  },
  reportBg: {
    padding: 20,
  },
  img: {
    resizeMode: "contain",
    height: 25,
    width: 25,
    borderRadius: 13,
    backgroundColor: Colors.WHITE_COLOR,

    overflow: "hidden",
    marginEnd: 10,
    marginBottom: 10,
  },
  reportTxt: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    fontSize: 16,
  },
  reportRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  regText: {
    color: Colors.WHITE_COLOR,
    fontSize: 16,
    fontFamily: ROBO_REGULAR,
  },
  playerName: {
    color: Colors.WHITE_COLOR,
    fontSize: 15,
    fontFamily: ROBO_MEDIUM,
  },
  keys: {
    color: Colors.INPUT_PLACE,
    fontSize: 10,
    fontFamily: ROBO_REGULAR,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
});
