import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
} from "react-native";
import HamBurger from "../../../../components/HamBurger";
import TildView from "../../../../components/tildView/TildView";
import { Colors } from "../../../../constants/Colors";
import {
  POP_MEDIUM,
  POP_REGULAR,
  ROBO_BOLD,
  ROBO_MEDIUM,
} from "../../../../constants/Fonts";
import i18n from "../../../../locale/i18n";
import AsyncStorage from "@react-native-community/async-storage";
import { StackActions, NavigationActions } from "react-navigation";
import { ProfileListData } from "../../data/ProfileData";
import Icon from "react-native-vector-icons/Entypo";
import {
  standardPostApi,
  standardPostApiJsonBased,
} from "../../../../api/ApiWrapper";
import PrimeImage from "../../../../components/PrimeImage";
import OneSignal from "react-native-onesignal";
import Spinnner from "../../../../components/Spinnner";
import { findSize } from "../../../../utils/helper";
import CustomButton from "../../../../components/customButton/CustomButton";
import { DEV_WIDTH } from "../../../../constants/DeviceDetails";
import moment from "moment";
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      profileLoading: true,
      coachSpec: null,
      logoutLoader: false,
    };
    this.fetchPickerData();
    this.fetchUserProfile();
  }

  fetchPickerData = async () => {
    try {
      const res = await standardPostApi(
        "pre_update_profile",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({ coachSpec: res.data.data.CoachSpecialization });
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchUserProfile = async () => {
    this.setState({ profileLoading: true });
    try {
      const res = await standardPostApi(
        "user_profile",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({
          userProfile: res.data.data,
          profileLoading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ profileLoading: false });
  };

  logoutUser = async () => {
    const deviceState = await OneSignal.getDeviceState();

    console.log("Devise state at logout", deviceState?.userId);

    this.setState({ logoutLoader: true });
    try {
      const res = await standardPostApiJsonBased(
        "logout",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          player_id: deviceState?.userId,
        },
        true,
        false
      );
      if (res.data.code === 200) {
        console.log("logout");
        await AsyncStorage.removeItem("@USER_ACCESS_TOKEN");
        await AsyncStorage.removeItem("@USER_ROLE");
        await AsyncStorage.removeItem("@CURRENT_WEEK");
        await AsyncStorage.removeItem("@CURRENT_PROGRAM");
        await AsyncStorage.removeItem("@IS_ADMIN");
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Welcome",
                params: {},
              }),
            ],
          })
        );
      }
    } catch (error) {
      console.error("error of logout", error);
    } finally {
      this.setState({ logoutLoader: false });
    }
  };

  renderSeparator = () => {
    return <View style={styles.seperator} />;
  };

  render() {
    const { profileLoading, userProfile } = this.state;
    console.log("user", userProfile);
    return (
      <HamBurger onMenuPress={() => this.props.navigation.openDrawer()}>
        {profileLoading ? (
          <ActivityIndicator
            size="large"
            color={Colors.ORANGE}
            style={{ marginTop: 150 }}
          />
        ) : (
          <View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginVertical: findSize(15),
              }}
            >
              <View
                style={{
                  height: findSize(103),
                  width: findSize(103),
                  borderRadius: findSize(52),
                  backgroundColor: Colors.VALHALLA,
                  elevation: 3,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    height: findSize(90),
                    width: findSize(90),
                    borderRadius: findSize(46),
                    borderWidth: findSize(6),
                    borderColor: Colors.VALHALLA,
                    elevation: 5,
                    overflow: "hidden",
                  }}
                >
                  {userProfile?.profile_image !== null ? (
                    <Image
                      source={{
                        uri: userProfile?.profile_image,
                      }}
                      style={{ flex: 1, height: null, width: null }}
                    />
                  ) : (
                    <Image
                      source={require("../../../../../assets/images/avtar.png")}
                      style={{ flex: 1, height: null, width: null }}
                    />
                  )}
                </View>
              </View>
              <Text
                style={{
                  fontSize: findSize(17),
                  fontFamily: POP_MEDIUM,
                  color: Colors.WHITE_COLOR,
                  marginTop: 10,
                }}
              >
                {`${userProfile?.first_name} ${userProfile?.last_name}`}
              </Text>
            </View>
            <TildView>
              <View style={{ padding: 15 }}>
                <Text
                  style={{
                    fontSize: findSize(15),
                    fontFamily: POP_MEDIUM,
                    color: Colors.WHITE_COLOR,
                    marginVertical: 5,
                  }}
                >
                  Personal Details
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: Colors.INPUT_PLACE,
                  }}
                />

                <Text style={styles.title}>EMAIL</Text>
                <Text style={styles.value}>{userProfile?.email}</Text>

                <Text style={styles.title}>PHONE</Text>
                <Text style={styles.value}>{userProfile?.phone}</Text>

                <Text style={styles.title}>DATE OF BIRTH</Text>
                <Text style={styles.value}>
                  {moment(userProfile?.dob, "YYYY-MM-DD").format("DD/MM/YYYY")}
                </Text>

                <Text style={styles.title}>SPECIALIZATION</Text>
                <Text style={styles.value}>{userProfile?.specialization}</Text>

                <Text style={styles.title}>ADDRESS</Text>
                <Text style={styles.value}>{userProfile?.address}</Text>
              </View>
            </TildView>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomButton
                type={2}
                isLoading={false}
                style={{
                  width: DEV_WIDTH * 0.44,
                  // borderColor: Colors?.RED_COLOR,
                }}
                loaderColor={Colors.ORANGE}
                // textStyle={{ color: Colors.RED_COLOR }}
                title={"Change Password"}
                onPress={() => {
                  this.props.navigation.navigate("EditPassword", {
                    coachSpec: this.state?.coachSpec,
                  });
                }}
              />
              <CustomButton
                type={1}
                isLoading={false}
                style={{
                  width: DEV_WIDTH * 0.44,
                }}
                loaderColor={Colors.BACKGROUND}
                title={"Edit Profile"}
                onPress={() => {
                  this.props.navigation.navigate("EditProfile", {
                    userProfile: userProfile,
                    coachSpec: this.state?.coachSpec,
                    refresh: () => this.fetchUserProfile(),
                  });
                }}
              />
            </View>
          </View>
        )}

        {/* <View style={styles.container}>
          <Text style={styles.profile}>{i18n.t('profile.profile')}</Text>
          {this.renderSeparator()}
          {profileLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.SKY_COLOR}
              style={{ marginTop: 150 }}
            />
          ) : (
            ProfileListData.map((item) => {
              return (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      item.isButton
                        ? Alert.alert('Logout', 'Are you sure ?', [
                            { text: 'Cancel' },
                            {
                              text: 'Yes',
                              onPress: () => this.logoutUser(),
                            },
                          ])
                        : item.redirect
                        ? Linking.openURL(item.redirectUrl)
                        : this.props.navigation.navigate(item.pageName, {
                            content: this.state.userProfile,
                            refreshFunc: () => {
                              this.fetchUserProfile();
                            },
                            coachSpec: this.state.coachSpec,
                          });
                    }}
                    style={{ paddingVertical: 5 }}
                  >
                    <View style={styles.mainRow}>
                      <Image style={styles.icon} source={item.img} />
                      <View style={styles.rowContainer}>
                        <Text style={styles.text}>{item.title}</Text>
                        <Icon
                          name="chevron-right"
                          size={25}
                          color={Colors.SKY_COLOR}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  {this.renderSeparator()}
                </View>
              );
            })
          )}
        </View> */}
      </HamBurger>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: findSize(12),
    fontFamily: POP_REGULAR,
    color: Colors.INPUT_PLACE,
    marginTop: 10,
  },
  value: {
    fontSize: findSize(13),
    fontFamily: POP_REGULAR,
    color: Colors.WHITE_COLOR,
  },
  container: {
    flex: 1,
    marginBottom: 25,
  },
  profile: {
    color: Colors.WHITE_COLOR,
    fontSize: 30,
    textAlign: "center",
    fontFamily: ROBO_BOLD,
    marginBottom: 10,
  },
  icon: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    tintColor: Colors.SKY_COLOR,
    marginRight: 15,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  text: {
    fontSize: 15,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_MEDIUM,
  },
  seperator: {
    borderBottomColor: Colors.BG_LIGHT,
    borderBottomWidth: 2,
    marginVertical: 5,
  },
});
