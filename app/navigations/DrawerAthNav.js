import AsyncStorage from "@react-native-community/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { showNavigationBar } from "react-native-navigation-bar-color";
import OneSignal from "react-native-onesignal";
import { NavigationActions, StackActions } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { standardPostApiJsonBased } from "../api/ApiWrapper";
import CustomButton from "../components/customButton/CustomButton";
import Spinnner from "../components/Spinnner";
import { Colors } from "../constants/Colors";
import { DEV_WIDTH, IS_IOS } from "../constants/DeviceDetails";
import { POP_REGULAR } from "../constants/Fonts";
import Home from "../screens/Coach/Pages/Home/Home";
import FAQsPage from "../screens/EditProfile/FAQsPage";
import PrivacyPage from "../screens/EditProfile/PrivacyPage";
import ReferPage from "../screens/EditProfile/ReferPage";
import TermsPage from "../screens/EditProfile/TermsPage";
import { findHeight, findSize } from "../utils/helper";
import AdminStack, { CoachesStackNav } from "./AdminStack";
import { styles } from "./DrawerNav";
import HelpStack from "./HelpStack";
import MyTeamsStackNav from "./MyTeamsStack";
import ProfileStackAthleteNav from "./ProfileStackAthleteNav";
import TrainingPlanStackNav from "./TrainingPlanStack";
import AddActivity from "../screens/Athlete/Pages/AddActivity/AddActivity";
import HomeAthStack from "./HomeAthStack";
import NeedAnalysisStack from "./NeedAnalysisStack";
import WorkoutAthStackNav from "./WorkoutAthStackNav";
const SOCIAL = [
  {
    id: 1,
    logo: require("../../assets/images/facebook.png"),
    url: "https://www.facebook.com/",
  },
  {
    id: 2,
    logo: require("../../assets/images/twitter.png"),
    url: "https://twitter.com/explore",
  },
  {
    id: 3,
    logo: require("../../assets/images/instagram.png"),
    url: "https://www.instagram.com/",
  },
  {
    id: 4,
    logo: require("../../assets/images/message.png"),
    url: "https://medium.com/",
  },
];

const DRAWER_ITEMS = [
  {
    id: 21,
    icon: require("../../assets/images/home.png"),
    title: "Home",
    screen: "Home",
  },
  {
    id: 22,
    icon: require("../../assets/images/workout.png"),
    title: "Workout",
    screen: "AssignedWorkouts",
  },
  {
    id: 1,
    icon: require("../../assets/images/add-activity.png"),
    title: "Add Activity",
    screen: "AddActivity",
  },
  {
    id: 2,
    icon: require("../../assets/images/need-analysis.png"),
    title: "Need Analysis",
    screen: "NeedAnalysis",
  },

  // {
  //   id: 4,
  //   icon: require("../../assets/images/help.png"),
  //   title: "Help",
  //   screen: "HelpStack",
  // },
  {
    id: 5,
    icon: require("../../assets/images/privacy.png"),
    title: "Privacy Policy",
    screen: "PrivacyPage",
  },
  {
    id: 6,
    icon: require("../../assets/images/term.png"),
    title: "Terms & Condition",
    screen: "TermsPage",
  },
  {
    id: 7,
    icon: require("../../assets/images/ask-qns.png"),
    title: "Frequently Asked Questions",
    screen: "FAQsPage",
  },
  {
    id: 8,
    icon: require("../../assets/images/rate-us.png"),
    title: "Rate Us",
    screen: "MyTeams",
    url: IS_IOS
      ? "https://apps.apple.com/us/app/prime-coach/id1529593405"
      : "https://play.google.com/store/apps/details?id=com.primecoach",
  },
];

const CustomDrawerComponent = (props) => {
  useEffect(() => {
    showNavigationBar();
    getUserData();
  }, []);

  useEffect(() => {
    EventRegister.on("refreshUserData", () => {
      getUserData();
    });
    return () => {
      EventRegister.rm("refreshUserData");
    };
  }, []);

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData !== null) {
        const userDataJson = JSON.parse(userData);
        setUserData(userDataJson);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const [logoutLoader, setLogoutLoader] = useState(false);
  const [userData, setUserData] = useState({});
  const logoutUser = async () => {
    const deviceState = await OneSignal.getDeviceState();

    setLogoutLoader(true);
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
        await AsyncStorage.removeItem("user");
        props.navigation.dispatch(
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
      setLogoutLoader(false);
    }
  };
  console.log("userData", userData);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.BACKGROUND,
        width: DEV_WIDTH - 60,
      }}
    >
      <Spinnner visible={logoutLoader} loaderTxt={"Logging Out..."} />
      <StatusBar translucent={false} backgroundColor={Colors.BACKGROUND} />

      <ScrollView
        style={{
          borderRightWidth: 1,
          borderRightColor: Colors.VALHALLA,
          borderStyle: "dashed",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",

            paddingVertical: 25,
            paddingHorizontal: 20,
            minWidth: DEV_WIDTH * 0.6,
            paddingTop: 20,
            backgroundColor: Colors.VALHALLA,
            alignSelf: "flex-start",

            borderBottomEndRadius: 50,
            marginBottom: 20,
          }}
        >
          <View style={styles.img}>
            {userData?.profile_image ? (
              <Image
                style={styles.img}
                source={{ uri: userData?.profile_image }}
                resizeMode="contain"
              />
            ) : (
              <Image
                style={styles.img}
                source={require("../../assets/images/avtar.png")}
                resizeMode="contain"
              />
            )}
          </View>
          <View style={{ paddingStart: 20 }}>
            <Text
              style={styles.playerName}
            >{`${userData?.first_name} ${userData?.last_name}`}</Text>

            <CustomButton
              type={1}
              style={{
                backgroundColor: Colors.ORANGE,
                width: findSize(65),
                height: findHeight(22),
              }}
              title={"View Profile"}
              textStyle={{
                fontSize: findSize(8),
              }}
              onPress={() => {
                props?.navigation?.navigate("Profile");
              }}
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {DRAWER_ITEMS?.map((item) => (
            <CustomButton
              onPress={() => {
                if (item?.id === 8) {
                  Linking.openURL(item?.url);
                } else {
                  props?.navigation?.navigate(item?.screen);
                }
              }}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: 5,
                paddingVertical: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={[
                    {
                      height: findSize(24),
                      width: findSize(24),
                      marginEnd: 8,
                    },
                  ]}
                  source={item.icon}
                />
                <Text
                  style={{
                    fontSize: findSize(15),
                    fontFamily: POP_REGULAR,
                    color: Colors.WHITE_COLOR,
                  }}
                >
                  {item?.title}
                </Text>
              </View>
            </CustomButton>
          ))}
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ marginVertical: 15 }}>
              <Text style={styles.follow}>Follow Us</Text>
              <View style={styles.socialContainer}>
                {SOCIAL.map((item) => {
                  return (
                    <View key={item?.id?.toString()}>
                      <CustomButton
                        onPress={() => Linking.openURL(item.url)}
                        style={{ alignItems: "center" }}
                      >
                        <Image
                          style={[
                            styles.socialIcon,
                            item?.id === 4 && {
                              height: findSize(20),
                              width: findSize(20),
                              marginStart: 0,
                            },
                          ]}
                          source={item.logo}
                        />
                      </CustomButton>
                    </View>
                  );
                })}
              </View>
            </View>
            <CustomButton
              title={"Contact Us"}
              type={2}
              style={{
                height: findSize(45),
                width: findSize(140),
              }}
              textStyle={{ fontSize: findSize(17) }}
              onPress={() => Linking.openURL("mailto:info@primecoach.co")}
            />
          </View>
          <CustomButton
            style={{ marginTop: 20 }}
            type={1}
            title={"Logout"}
            onPress={() => {
              Alert.alert("Logout", "Are you sure, You want to logout?", [
                { text: "Cancel" },
                {
                  text: "Yes",
                  onPress: () => logoutUser(),
                },
              ]);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DrawerAthNav = createDrawerNavigator(
  {
    Home: HomeAthStack,

    AssignedWorkouts: WorkoutAthStackNav,

    AddActivity: AddActivity,
    NeedAnalysis: NeedAnalysisStack,
    HelpStack: HelpStack,

    Profile: ProfileStackAthleteNav,
    PrivacyPage: PrivacyPage,
    TermsPage: TermsPage,
    FAQsPage: FAQsPage,
    ReferPage: ReferPage,
  },
  {
    drawerWidth: DEV_WIDTH - 60,
    drawerType: "back",
    overlayColor: "transparent",
    backBehavior: "initialRoute",
    initialRouteName: "AssignedWorkouts",
    contentComponent: CustomDrawerComponent,
    screenContainerStyle: {
      height: 25,
    },
    defaultNavigationOptions: ({ navigation }) => ({}),
    contentOptions: {},
    // statusBarAnimation: "slide",
    // hideStatusBar: true,
  }
);

// import React from 'react';
// import {
//   Image, Linking, SafeAreaView, ScrollView,
//   Text,
//   TouchableOpacity, TouchableWithoutFeedback, View
// } from 'react-native';
// import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
// import { Colors } from '../constants/Colors';
// import { APP_VERSION } from '../constants/DeviceDetails';
// import { styles } from './DrawerNav';
// import AddActivity from '../screens/Athlete/Pages/AddActivity/AddActivity';
// import HomeAthStack from './HomeAthStack';
// import NeedAnalysisStack from './NeedAnalysisStack';
// import WorkoutAthStackNav from './WorkoutAthStackNav';
// import ProfileStackAthleteNav from './ProfileStackAthleteNav';
// const INACTIVE_TAB_COLOR = 'rgba(255,255,255,0.5)';

// const SOCIAL = [
//   {
//     title: 'Newsletter',
//     logo: require('./img/newsletter.png'),
//     url: 'https://medium.com/',
//   },
//   {
//     title: 'Facebook',
//     logo: require('./img/fb.png'),
//     url: 'https://www.facebook.com/',
//   },
//   {
//     title: 'Twitter',
//     logo: require('./img/twitter.png'),
//     url: 'https://twitter.com/explore',
//   },
//   {
//     title: 'Instagram',
//     logo: require('./img/insta.png'),
//     url: 'https://www.instagram.com/',
//   },
// ];

// const CustomDrawerComponent = (props) => {
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View style={styles.logoContainer}>
//         <TouchableWithoutFeedback onPress={() => null}>
//           <Image source={require('./img/logo.png')} style={styles.logo} />
//         </TouchableWithoutFeedback>
//         <Text style={styles.version}>{APP_VERSION}</Text>
//       </View>
//       <ScrollView>
//         <DrawerItems {...props} />

//         <View>
//           <Text style={styles.follow}>Follow us</Text>
//           <View style={styles.socialContainer}>
//             {SOCIAL.map((item) => {
//               return (
//                 <View>
//                   <TouchableOpacity
//                     onPress={() => Linking.openURL(item.url)}
//                     style={{ alignItems: 'center' }}
//                   >
//                     <Image style={styles.socialIcon} source={item.logo} />
//                     <Text style={styles.socialTxt}>{item.title}</Text>
//                   </TouchableOpacity>
//                 </View>
//               );
//             })}
//           </View>
//           <View>
//             <Text style={styles.follow}>Get in Touch</Text>
//             <TouchableOpacity
//               onPress={() => Linking.openURL('mailto:info@primecoach.co')}
//               style={styles.contactBtn}
//             >
//               <View style={styles.contactRow}>
//                 <Text style={styles.contactTxt}>Contact Us</Text>
//                 <Image
//                   style={styles.mailIcon}
//                   source={require('./img/mail.png')}
//                 />
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default DrawerAthNav = createDrawerNavigator(
//   {
//     Home: HomeAthStack,
//     AssignedWorkouts: {
//       screen: WorkoutAthStackNav,
//       navigationOptions: {
//         drawerLabel: "Workout",
//       },
//     },
//     NeedAnalysis: {
//       screen: NeedAnalysisStack,
//       navigationOptions: {
//         drawerLabel: "Needs Analysis",
//       },
//     },
//     AddActivity: {
//       screen: AddActivity,
//       navigationOptions: {
//         drawerLabel: "Add Activity",
//       },
//     },
//     Profile: ProfileStackAthleteNav,
//   },
//   {
//     drawerBackgroundColor: Colors.BG_LIGHT,
//     drawerType: "back",
//     overlayColor: "transparent",
//     backBehavior: "initialRoute",
//     initialRouteName: "AssignedWorkouts",
//     contentComponent: CustomDrawerComponent,
//     screenContainerStyle: {
//       height: 25,
//     },
//     defaultNavigationOptions: ({ navigation }) => ({}),
//     contentOptions: {},
//     statusBarAnimation: "slide",
//     hideStatusBar: true,
//   }
// );
