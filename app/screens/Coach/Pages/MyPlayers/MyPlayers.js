import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  StatusBar,
} from "react-native";
import Container from "../../../../components/Container";
import { Colors } from "../../../../constants/Colors";
import { ROBO_BOLD, ROBO_REGULAR } from "../../../../constants/Fonts";
import i18n from "../../../../locale/i18n";
import PrimeButton from "../../../../components/PrimeButton";
import { standardPostApi } from "../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import Spinnner from "../../../../components/Spinnner";
import { BUTTONS, BUTTONS_ASST, BUTTONS_S_C } from "../../data/Buttons";
import Player from "../../components/Player";
import { DEV_HEIGHT } from "../../../../constants/DeviceDetails";
import CustomButton from "../../../../components/customButton/CustomButton";
import { findSize } from "../../../../utils/helper";
import { showNavigationBar } from "react-native-navigation-bar-color";

export default class MyPlayers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deletingTeam: false,
      dataLoading: true,
      memberAddPickerData: {},
      allAthletes: [],
    };
    this.fetchCoachPlayerData();
    this.listTeamPlayers();
  }
  componentDidMount() {
    showNavigationBar();
  }
  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc();
  }

  deleteTeamAlert = () => {
    return Alert.alert(
      "Delete Team",
      "Are you sure you want to delete this team, this cannot be undone?",
      [
        { text: "Cancel" },
        {
          text: "OK",
          onPress: () => this.deleteTeam(),
        },
      ]
    );
  };

  fetchCoachPlayerData = async () => {
    const { navigation } = this.props;
    const teamData = navigation.getParam("content").teamData;
    try {
      const res = await standardPostApi(
        "pre_add_coach_player_in_team",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          team: teamData.id,
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({
          memberAddPickerData: res.data.data,
          dataLoading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  listTeamPlayers = async () => {
    this.setState({ dataLoading: true });
    const { navigation } = this.props;
    const teamData = navigation.getParam("content").teamData;
    try {
      const res = await standardPostApi(
        "list_team_players",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          team: teamData.id,
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({
          allAthletes: res.data.data.Athelete,
          dataLoading: false,
        });
        console.log("allAthletes ", res.data);
      }
    } catch (error) {
      console.log("ggg", error?.response?.data);
    }
    this.setState({ dataLoading: false });
  };

  deleteTeam = async () => {
    const { navigation } = this.props;
    const teamData = navigation.getParam("content").teamData;
    this.setState({ deletingTeam: true });
    try {
      const res = await standardPostApi(
        "delete_team",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          team: teamData.id,
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({ deletingTeam: false });
        this.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { dataLoading, allAthletes } = this.state;
    const { navigation } = this.props;
    const coachData = navigation.getParam("content").pickerData;
    const teamData = navigation.getParam("content").teamData;
    const Role = navigation.getParam("content").role;
    return (
      <Container
        backFn={() => this.props.navigation.goBack()}
        title={teamData?.team_name}
      >
        <StatusBar translucent={false} backgroundColor={Colors.BACKGROUND} />
        <Spinnner visible={this.state.deletingTeam} />
        {dataLoading ? (
          <ActivityIndicator
            color={Colors.ORANGE}
            size="large"
            style={{ marginTop: DEV_HEIGHT / 3 }}
          />
        ) : (
          <View>
            {/* <Text style={styles.myPlayers}>{i18n.t("teams.myPlayers")}</Text> */}
            <View style={styles.container}>
              {BUTTONS?.filter((btn) => btn.role == Role).map((item) => {
                return (
                  <CustomButton
                    style={{
                      borderRadius: findSize(22),
                      backgroundColor: Colors.VALHALLA,
                      paddingHorizontal: findSize(15),
                      margin: findSize(5),

                      flexDirection: "row",
                      padding: 10,
                      alignItem: "center",
                      marginHorizontal: findSize(3),
                    }}
                    onPress={() => {
                      item.isButton
                        ? this.deleteTeamAlert()
                        : this.props.navigation.navigate(item.pageName, {
                            refreshFunc: () => {
                              this.listTeamPlayers();
                            },
                            coachData: coachData,
                            teamData: teamData,
                            pickerData: this.state.memberAddPickerData,
                            allAthletes: this.state.allAthletes,
                            role: Role,
                          });
                    }}
                  >
                    <Image
                      source={item?.icon}
                      style={{
                        height: findSize(20),
                        width: findSize(20),
                        marginEnd: 5,
                      }}
                    />
                    <Text
                      style={{
                        color: Colors.WHITE_COLOR,
                        fontSize: findSize(12),

                        textAlignVertical: "center",
                      }}
                    >
                      {item?.btnName}
                    </Text>
                  </CustomButton>
                );
              })}
            </View>
            {allAthletes !== undefined ? (
              allAthletes.map((item) => {
                return (
                  <View>
                    <Player
                      showPosition={true}
                      playerType={item.position}
                      playersArray={item.players}
                      onPlayerPress={(player) =>
                        this.props.navigation.navigate("PlayerDetails", {
                          refreshFunc: () => {
                            this.listTeamPlayers();
                          },
                          content: {
                            teamData: teamData,
                            player: player,
                            role: Role,
                          },
                        })
                      }
                    />
                  </View>
                );
              })
            ) : (
              <Text style={styles.noPlayers}>
                You have not added any players to this team.
              </Text>
            )}
          </View>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  myPlayers: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_BOLD,
    fontSize: 30,
    marginBottom: 25,
    textAlign: "center",
  },
  borderedBtns: {
    width: 100,
    alignSelf: "center",
    backgroundColor: Colors.BG_COLOR,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  noPlayers: {
    fontSize: 15,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    textAlign: "center",
    marginTop: 120,
  },
});
