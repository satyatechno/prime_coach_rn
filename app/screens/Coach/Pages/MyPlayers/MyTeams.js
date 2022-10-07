import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import HamBurger from "../../../../components/HamBurger";
import {
  POP_MEDIUM,
  ROBO_BOLD,
  ROBO_MEDIUM,
  ROBO_REGULAR,
} from "../../../../constants/Fonts";
import { Colors } from "../../../../constants/Colors";
import i18n from "../../../../locale/i18n";
import TeamView from "../../components/TeamView";
import { DEV_HEIGHT, DEV_WIDTH } from "../../../../constants/DeviceDetails";
import { standardPostApi } from "../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import AddBtn from "../../../../components/AddBtn";
import Spinnner from "../../../../components/Spinnner";
import { NavigationEvents } from "react-navigation";
import CustomButton from "../../../../components/customButton/CustomButton";
import { findHeight, findSize } from "../../../../utils/helper";
import { showNavigationBar } from "react-native-navigation-bar-color";

export default class MyTeams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalDataLoading: false,
      modalData: null,
      teams: [],
      loading: false,
      teamsLoading: false,
      pickerData: null,
      Role: "",
    };
  }
  componentDidMount() {
    const getRole = async () => {
      let role = await AsyncStorage.getItem("@USER_ROLE");
      this.setState({ Role: role });
    };
    getRole();
    this.showAllTeams();
    this.loadModalData();
  }
  loadModalData = async () => {
    try {
      const res = await standardPostApi(
        "pre_create_new_team",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({
          pickerData: res.data.data,
          modalDataLoading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  showAllTeams = async () => {
    this.setState({ teamsLoading: true });
    console.log("object", await AsyncStorage.getItem("@USER_ACCESS_TOKEN"));
    try {
      const res = await standardPostApi(
        "show_all_teams",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({
          teamsLoading: false,
          teams: res.data.data,
        });
      }
    } catch (error) {
      console.log("error", error?.response?.data);
    }
  };

  render() {
    const { modalDataLoading, loading, teams, teamsLoading, Role } = this.state;
    // console.log('Testing', Role);
    return (
      <HamBurger
        navigation={this.props?.navigation}
        onMenuPress={() => this.props.navigation.openDrawer()}
      >
        <NavigationEvents
          onWillFocus={(payload) => {
            this.showAllTeams();
          }}
        />
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.myTeams}>{i18n.t("teams.myTeams")}</Text>
            {modalDataLoading ? null : Role == "Coach" || Role == "Admin" ? (
              <CustomButton
                type={1}
                style={{
                  backgroundColor: Colors.ORANGE,
                  width: findSize(130),
                  height: findHeight(40),
                }}
                title={"Add New Team"}
                textStyle={{
                  fontSize: findSize(12),
                }}
                onPress={() => {
                  this.props.navigation.navigate("AddTeam", {
                    refreshFunc: () => {
                      this.showAllTeams();
                    },
                    sports: this.state.pickerData.Sports,
                  });
                }}
              />
            ) : null}
          </View>
          {teamsLoading ? (
            <View
              style={{
                height: DEV_HEIGHT * 0.8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={Colors.WHITE_COLOR} />
            </View>
          ) : teams.length > 0 ? (
            teams.map((item) => {
              return (
                <TeamView
                  teamName={item.team_name}
                  poster={item.sport_image}
                  teamPress={() =>
                    this.props.navigation.navigate("MyPlayers", {
                      refreshFunc: () => {
                        this.showAllTeams();
                      },
                      content: {
                        pickerData: this.state.pickerData,
                        teamData: item,
                        role: Role,
                      },
                    })
                  }
                />
              );
            })
          ) : (
            <Text style={styles.noTeams}>{i18n.t("teams.noAddedTeams")}</Text>
          )}
        </View>
      </HamBurger>
    );
  }
}

const styles = StyleSheet.create({
  myTeams: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_MEDIUM,
    fontSize: 21,
  },
  startBtn: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 8,
    borderColor: Colors.SKY_COLOR,
    justifyContent: "center",
    width: 190,
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  startCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  startTxt: {
    fontSize: 18,
    fontFamily: ROBO_MEDIUM,
    color: Colors.WHITE_COLOR,
  },
  noTeams: {
    fontSize: 15,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    textAlign: "center",
    marginTop: 120,
  },
});
