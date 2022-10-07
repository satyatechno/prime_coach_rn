import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { Colors } from "../../constants/Colors";
import { POP_BOLD, POP_REGULAR, POP_MEDIUM } from "../../constants/Fonts";
import i18n from "../../locale/i18n";
import AsyncStorage from "@react-native-community/async-storage";
import { StackActions, NavigationActions } from "react-navigation";
import { findSize, FONT_SIZE } from "../../utils/helper";
import { DEV_HEIGHT, DEV_WIDTH } from "../../constants/DeviceDetails";
import CustomButton from "../../components/customButton/CustomButton";

import {
  hideNavigationBar,
  showNavigationBar,
} from "react-native-navigation-bar-color";

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.checkAuth();
  }
  componentDidMount() {
    hideNavigationBar();
    // showNavigationBar();
  }

  async checkAuth() {
    const ROLE = await AsyncStorage.getItem("@USER_ROLE");
    const TOKEN = await AsyncStorage.getItem("@USER_ACCESS_TOKEN");
    if (TOKEN) {
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName:
                ROLE === "Athlete"
                  ? "DrawerAthNav"
                  : ROLE === "Admin"
                  ? "DrawerAdminNav"
                  : "DrawerNav",
              params: {},
            }),
          ],
        })
      );
    }
  }

  render() {
    return (
      <View style={styles.safeView}>
        <StatusBar translucent backgroundColor={"transparent"} />
        <ImageBackground
          style={{
            height: DEV_HEIGHT + StatusBar.currentHeight,
            width: DEV_WIDTH,
          }}
          // resizeMode="contain"
          source={require("../../../assets/images/welcome.png")}
        >
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={require("../../../assets/images/logo.png")}
              />

              <Text style={styles.primeTxt}>
                <Text style={{ color: Colors.ORANGE }}>Prime</Text> Coach
              </Text>
            </View>
            <Text style={styles.primeTxt}>
              Smart online strength & conditioning coach
            </Text>
            <View>
              <CustomButton
                onPress={() => this.props.navigation.navigate("SelectSport")}
                style={styles.startBtn}
                children={<Text style={styles.startTxt}>Start Now</Text>}
              />

              <View style={styles.alrdyContainer}>
                <Text style={styles.alrdyTxt}>Already have an account?</Text>
                <CustomButton
                  onPress={() => this.props.navigation.navigate("Choices")}
                  style={{ paddingVertical: 5 }}
                >
                  <Text style={styles.login}> Login Now</Text>
                </CustomButton>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  container: {
    // marginTop: DEV_HEIGHT * 0.7 + 30,
    position: "absolute",
    bottom: 45,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    height: 30,
    width: 37,
    resizeMode: "contain",
    marginRight: 7,
  },

  primeTxt: {
    fontSize: findSize(23),
    color: Colors.WHITE_COLOR,
    fontFamily: POP_MEDIUM,
    fontWeight: "600",
  },

  overlay: {
    flex: 1,
  },
  startBtn: {
    borderRadius: 25,
    height: findSize(50),
    backgroundColor: Colors.ORANGE,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    marginVertical: 10,
  },

  startTxt: {
    fontSize: findSize(16),
    fontFamily: POP_MEDIUM,
    color: Colors.BACKGROUND,
    marginTop: 2,
  },
  alrdyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  alrdyTxt: {
    fontSize: 16,
    fontFamily: POP_REGULAR,
    paddingVertical: 5,
    color: Colors.WHITE_COLOR,
  },
  login: {
    fontSize: 16,
    fontFamily: POP_MEDIUM,
    color: Colors.ORANGE,
  },
});
