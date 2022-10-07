import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { DEV_HEIGHT, DEV_WIDTH } from "../../constants/DeviceDetails";
import { Colors } from "../../constants/Colors";
import CustomButton from "../../components/customButton/CustomButton";
import { POP_REGULAR } from "../../constants/Fonts";
import { findSize } from "../../utils/helper";

const Choices = ({ navigation }) => {
  return (
    <View style={styles.safeView}>
      <StatusBar translucent backgroundColor={"transparent"} />
      <ImageBackground
        style={{ height: DEV_HEIGHT + 32, width: DEV_WIDTH }}
        source={require("../../../assets/images/choise.png")}
      >
        <View
          style={{
            height: "50%",

            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <CustomButton
            onPress={() => {
              navigation.navigate("Login", {
                logInAs: "coach",
              });
            }}
            style={styles.coachBtn}
          >
            <Text style={styles.coachBtnText}>Sign In As Coach</Text>
          </CustomButton>
        </View>
        <View
          style={{
            height: "50%",

            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <CustomButton
            onPress={() => {
              navigation.navigate("Login", {
                logInAs: "athlete",
              });
            }}
            style={[
              styles.coachBtn,
              {
                transform: [
                  { rotateZ: "270deg" },
                  { translateY: -90 },
                  { translateX: -15 },
                ],
              },
            ]}
          >
            <Text style={styles.coachBtnText}>Sign In As Athlete</Text>
          </CustomButton>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Choices;

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  coachBtn: {
    borderWidth: 1,
    borderColor: Colors.WHITE_COLOR,
    height: 60,
    width: 276,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotateZ: "270deg" }, { translateY: 90 }, { translateX: 15 }],
  },
  coachBtnText: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_REGULAR,
    fontSize: findSize(25),
  },
});
