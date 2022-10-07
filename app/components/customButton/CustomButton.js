import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { POP_MEDIUM } from "../../constants/Fonts";
import { findSize, findHeight } from "../../utils/helper";

const CustomButton = ({
  onPress,
  title,
  type,
  style,
  isLoading,
  disabled,
  loaderSize = findSize(30),
  loaderColor,
  textStyle,
  children,
  activeOpacity = 0.6,
  ...rest
}) => {
  const [multiTab, setMultiTab] = useState(false);

  const btnStyle = (value) => {
    switch (value) {
      case 1:
        return styles.fillButton;
      case 2:
        return styles.borderButton;
      case 3:
        return styles?.fillButton;
      default:
        return {};
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={isLoading || multiTab || disabled}
      onPress={() => {
        setMultiTab(true);
        onPress();
      }}
      style={[btnStyle(type), style]}
      onPressOut={() => {
        setTimeout(() => {
          setMultiTab(false);
        }, 200);
      }}
      {...rest}
    >
      {[1, 2, 3].includes(type) ? (
        isLoading ? (
          <ActivityIndicator
            size={loaderSize}
            color={
              loaderColor
                ? loaderColor
                : type == 1
                ? Colors.BACKGROUND
                : Colors.WHITE_COLOR
            }
          />
        ) : (
          <Text
            style={[
              styles.titleStyle,
              {
                color:
                  type == 2
                    ? Colors.WHITE_COLOR
                    : type == 3
                    ? Colors?.BACKGROUND
                    : Colors.BACKGROUND,
                marginTop: 2,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )
      ) : null}
      {!type && children}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  fillButton: {
    backgroundColor: Colors.ORANGE,
    height: findHeight(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: findHeight(30),
    width: "100%",
    marginVertical: findSize(10),
  },
  borderButton: {
    height: findHeight(52),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: findHeight(30),
    width: "100%",
    marginVertical: findSize(10),
    borderWidth: 1.5,
    borderColor: Colors.WHITE_COLOR,
  },
  titleStyle: {
    fontSize: findSize(15),
    color: Colors.BACKGROUND,
    textAlign: "center",
    fontFamily: POP_MEDIUM,
  },
});
