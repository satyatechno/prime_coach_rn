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
import { ROBO_REGULAR } from "../../../constants/Fonts";
import { findHeight, findSize } from "../../../utils/helper";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

export default class ProgramView extends Component {
  render() {
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
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: "100%",
                  justifyContent: "center",
                  // alignItems: "center",
                  paddingHorizontal: "12%",
                }}
              >
                <Text style={styles.teamTxt}>{this.props.programName}</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <CustomButton
                    onPress={() => {
                      this.props.onClone();
                    }}
                    style={{ marginEnd: 15 }}
                  >
                    <MaterialIcon
                      name="content-copy"
                      color={Colors.GREEN_COLOR}
                      size={20}
                    />
                  </CustomButton>
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
                      this.props.onProgramPress();
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  position: "absolute",
                  top: 5,
                  end: findSize(20),
                }}
              >
                <Image
                  source={require("../../../../assets/images/program.png")}
                  style={styles.img}
                />
              </View>
            </View>
          </ImageBackground>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  teamTxt: {
    fontSize: findSize(17),
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    marginVertical: 10,
    textAlign: "left",
  },
  img: {
    width: findSize(125),
    height: findSize(125),
  },
});
