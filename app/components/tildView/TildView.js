import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { findSize } from "../../utils/helper";

const TildView = ({
  children,
  isLeftTild = false,
  degree = "8deg",
  containerStyle,
  mainViewStyle = {},
  tildViewStyle = {},
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.tildView,
          tildViewStyle,
          { transform: [{ rotateZ: isLeftTild ? degree : "-" + degree }] },
        ]}
      >
        <View
          style={[
            styles.mainView,
            mainViewStyle,
            { transform: [{ rotateZ: isLeftTild ? "-" + degree : degree }] },
          ]}
        >
          {children}
        </View>
      </View>
    </View>
  );
};

export default TildView;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    marginVertical: 10,
  },
  mainView: {
    backgroundColor: Colors.VALHALLA,
    borderRadius: findSize(24),
    transform: [{ rotateZ: "-8deg" }],
  },
  tildView: {
    backgroundColor: Colors.TILD_VIEW,
    borderRadius: findSize(24),
    zIndex: -99,
    transform: [{ rotateZ: "8deg" }],
  },
});
