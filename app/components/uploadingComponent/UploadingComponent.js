import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { DEV_HEIGHT, DEV_WIDTH } from "../../constants/DeviceDetails";
import * as Progress from "react-native-progress";
import { Colors } from "../../constants/Colors";

const UploadingComponent = ({ value = 0 }) => {
  return (
    <View
      style={{
        height: DEV_HEIGHT,
        width: DEV_WIDTH,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(20, 18, 35, 0.8)",
        // backgroundColor: Colors.RED_COLOR,
        zIndex: 9999,
      }}
    >
      <Progress.Circle
        progress={parseFloat(value / 100)}
        size={80}
        color={Colors.ORANGE}
        showsText
      />
    </View>
  );
};

export default UploadingComponent;

const styles = StyleSheet.create({});
