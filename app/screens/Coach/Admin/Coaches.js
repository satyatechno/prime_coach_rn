import AsyncStorage from "@react-native-community/async-storage";
import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Switch,
} from "react-native";
import { standardPostApiJsonBased } from "../../../api/ApiWrapper";
import HamBurger from "../../../components/HamBurger";
import Spinnner from "../../../components/Spinnner";
import Select from "../../../components/Select";
import { Colors } from "../../../constants/Colors";
import { DEV_WIDTH } from "../../../constants/DeviceDetails";
import {
  POP_REGULAR,
  ROBO_BOLD,
  ROBO_MEDIUM,
  ROBO_REGULAR,
} from "../../../constants/Fonts";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Entypo";
import { NavigationEvents } from "react-navigation";
import TildView from "../../../components/tildView/TildView";
import CustomButton from "../../../components/customButton/CustomButton";
import { findHeight, findSize } from "../../../utils/helper";
const COACH_TYPES = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
];
export class Coaches extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLoading: false,
      activeId: null,
      coachesData: [],
      loading: true,
      teamsLoading: true,
      pickerData: null,
      selectedType: "active",
    };

    this.showAllCoach();
  }

  showAllCoach = async () => {
    try {
      const res = await standardPostApiJsonBased(
        "coaches",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
        },
        true
      );
      if (res.data.code == 200) {
        // console.log('response', res.data);
        this.setState({
          coachesData: [...res.data.data?.coaches],
          loading: false,
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  };
  activeInactiveCoach = async (coachId) => {
    this.setState({ activeId: coachId, activeLoading: true });
    let temp = this.state.coachesData;
    let idx = temp?.findIndex((x) => x.id == coachId);
    try {
      temp[idx].status = temp[idx]?.status === "active" ? "inactive" : "active";
      this.setState({ activeLoading: true, coachesData: temp });
      const res = await standardPostApiJsonBased(
        "coach/action",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          coach_id: coachId,
        },
        true
      );
      if (res.data.code == 200) {
        // temp[idx].status =
        //   temp[idx]?.status === 'active' ? 'inactive' : 'active';
        // await this.showAllCoach();
        this.setState({
          activeLoading: false,
          // coachesData: temp,
          activeId: null,
        });
      }
    } catch (error) {
      console.log(error);
      temp[idx].status = temp[idx]?.status === "active" ? "inactive" : "active";
      this.setState({ activeLoading: false, coachesData: temp });
    }
  };

  render() {
    const { loading, coachesData, activeLoading, activeId, selectedType } =
      this.state;
    let ListData = coachesData?.filter((x) => x.status === selectedType);
    // console.log("\nselected",ListData?.length)
    return (
      <HamBurger onMenuPress={() => this.props.navigation.openDrawer()}>
        <NavigationEvents
          onWillFocus={(payload) => {
            this.setState({ loading: true });
            this.showAllCoach();
          }}
        />
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          <Spinnner visible={loading} />
          <Text style={styles.coaches}>Coaches</Text>
          <Select
            pickerProps={{
              onValueChange: (value) => {
                console.log("value", value);
                this.setState({
                  selectedType: value,
                });
              },
              // style: {
              //   backgroundColor: Colors.BACKGROUND,
              //   borderColor: Colors.SKY_COLOR,
              // },
            }}
            // iosLabel={Colors.WHITE_COLOR}
            // androidBorderColor={Colors.SKY_COLOR}
            // androidLabel={Colors.WHITE_COLOR}
            // androidBgColor={Colors.BG_LIGHT}
            pickerItems={COACH_TYPES}
            pickerValue={this.state.selectedType}
            // iconColor={Colors.WHITE_COLOR}
            placeholder={null}
          />

          <FlatList
            data={ListData}
            contentContainerStyle={{
              paddingVertical: findHeight(20),
            }}
            keyExtractor={(item, index) => item?.id?.toString()}
            renderItem={({ item: coach, index }) => (
              <TildView
                degree="7.15deg"
                containerStyle={{
                  paddingVertical: 0,
                  marginBottom: 30,
                }}
              >
                <View
                  style={{
                    // borderRadius: 5,
                    // borderColor: Colors.SKY_COLOR,
                    // borderWidth: 1,
                    padding: 15,
                    // backgroundColor: Colors?.BACKGROUND,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.coachName}>
                      {coach?.first_name + " " + coach?.last_name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color:
                            coach?.status === "active"
                              ? Colors.ORANGE
                              : Colors.WHITE_COLOR,
                        }}
                      >
                        Active
                      </Text>

                      <Switch
                        onChange={() => {
                          this.activeInactiveCoach(coach?.id);
                        }}
                        trackColor={{
                          false: Colors.ORANGE,
                          true: Colors.YELLOW_COLOR,
                        }}
                        thumbColor={Colors.WHITE_COLOR}
                        style={{ marginHorizontal: 9 }}
                        value={coach?.status !== "active"}
                      />
                      <Text
                        style={{
                          color:
                            coach?.status !== "active"
                              ? Colors.YELLOW_COLOR
                              : Colors.WHITE_COLOR,
                        }}
                      >
                        Inactive
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                      marginTop: 10,
                    }}
                  >
                    <Text style={styles.noAsignText}>No. of Assigned Team</Text>
                    <View
                      style={{
                        height: 28,
                        width: 28,
                        borderRadius: 4,
                        backgroundColor: Colors.BACKGROUND,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.teamCount}>{coach?.team_count}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <CustomButton
                      onPress={() => {
                        this.props.navigation.navigate("CoachTeam", {
                          data: coach,
                        });
                      }}
                      title="View Detail"
                      type={1}
                      style={{
                        width: "auto",
                        alignSelf: "baseline",
                        height: findSize(34),
                        paddingHorizontal: 15,
                        // marginTop: 20,
                      }}
                    />
                    {/* <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('CoachTeam', {
                          data: coach,
                        })
                      }
                      style={styles.btn}>
                      <Text style={styles.btnText}>View</Text>
                      <Icons
                        name='eye'
                        style={{ marginLeft: 20 }}
                        color={Colors.WHITE_COLOR}
                        size={20}
                      />
                      <Icons />
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity
                      onPress={() => this.activeInactiveCoach(coach?.id)}
                      disabled={activeLoading}
                      style={[
                        styles.btn,
                        {
                          borderColor:
                            coach?.status === 'active'
                              ? Colors.SKY_COLOR
                              : Colors.RED_COLOR,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.btnText,
                          {
                            color:
                              coach?.status === 'active'
                                ? Colors.WHITE_COLOR
                                : Colors.RED_COLOR,
                          },
                        ]}>
                        {coach?.status === 'active' ? 'Active' : 'Inactive'}
                      </Text>
                      {activeLoading && activeId === coach?.id ? (
                        <ActivityIndicator
                          size='small'
                          color={Colors.SKY_COLOR}
                        />
                      ) : coach?.status === 'active' ? (
                        <Icons
                          name='check-bold'
                          color={Colors.WHITE_COLOR}
                          size={20}
                        />
                      ) : (
                        <Ionicons
                          name='cross'
                          color={Colors.RED_COLOR}
                          size={25}
                        />
                      )}
                    </TouchableOpacity> */}
                  </View>
                </View>
              </TildView>
            )}
          />
        </View>
      </HamBurger>
    );
  }
}
const styles = StyleSheet.create({
  coaches: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_BOLD,
    fontSize: findSize(30),
    marginBottom: 25,
  },
  coachName: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_REGULAR,
    fontSize: findSize(17),
    marginBottom: 10,
    textTransform: "capitalize",
    flex: 1,
  },
  noAsignText: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_REGULAR,
    fontSize: findSize(12),
  },
  teamCount: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_REGULAR,
    fontSize: 12,
  },

  btnText: {
    color: Colors.WHITE_COLOR,
    fontSize: findSize(17),
  },
  btn: {
    width: 100,
    flexDirection: "row",
    borderColor: Colors.SKY_COLOR,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    padding: 8,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
});
export default Coaches;
