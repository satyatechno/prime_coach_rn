import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from "react-native";
import CustomButton from "../../../components/customButton/CustomButton";
import PrimeImage from "../../../components/PrimeImage";
import TildView from "../../../components/tildView/TildView";
import { Colors } from "../../../constants/Colors";
import { DEV_WIDTH } from "../../../constants/DeviceDetails";
import { ROBO_MEDIUM, ROBO_REGULAR } from "../../../constants/Fonts";
import { findHeight, findSize } from "../../../utils/helper";

const TeamView = ({ teamName, teamPress, hideDetailButton, poster }) => {
  return (
    <TildView
      isLeftTild={true}
      children={
        <ImageBackground
          source={require("../../../../assets/images/circles.png")}
          style={{
            height: findHeight(127),
            width: DEV_WIDTH - 39,
          }}
          resizeMode="cover"
        >
          <View
            style={{
              flexDirection: "row",
              // alignItems: "center",
              height: "100%",
            }}
          >
            <View
              style={{
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: "12%",
                width: DEV_WIDTH * 0.6,
              }}
            >
              <Text
                style={[
                  styles.teamTxt,
                  hideDetailButton && {
                    alignSelf: "center",
                  },
                ]}
                numberOfLines={2}
              >
                {teamName}
              </Text>
              {!hideDetailButton ? (
                <CustomButton
                  type={1}
                  style={{
                    backgroundColor: Colors.ORANGE,
                    width: findSize(100),
                    height: findHeight(30),
                  }}
                  title={"View Details"}
                  textStyle={{
                    fontSize: findSize(12),
                  }}
                  onPress={() => {
                    teamPress();
                  }}
                />
              ) : null}
            </View>
            <View
              style={{
                position: "absolute",
                top: -findHeight(20),
                end: 0,
              }}
            >
              <Image
                // source={require('../../../../assets/images/athletics.png')}
                source={
                  poster
                    ? { uri: poster }
                    : require("../../../../assets/images/athletics.png")
                }
                resizeMode="contain"
                style={styles.img}
              />
            </View>
          </View>
        </ImageBackground>
      }
    />
  );
};
export default TeamView;
const styles = StyleSheet.create({
  teamTxt: {
    fontSize: findSize(17),
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    marginVertical: 10,
  },
  img: {
    width: findSize(130),
    height: findSize(130),
    // backgroundColor: Colors.VALHALLA,
  },
});
