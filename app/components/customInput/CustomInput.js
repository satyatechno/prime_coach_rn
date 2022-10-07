import React, { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Colors } from "../../constants/Colors";
import { DEV_WIDTH } from "../../constants/DeviceDetails";
import { POP_MEDIUM, POP_REGULAR } from "../../constants/Fonts";
import { findHeight, findSize } from "../../utils/helper";
import Icon from "react-native-vector-icons/Feather";

const CustomInput = forwardRef(
  (
    {
      containerStyle,
      onChangeText,
      value,
      inputStyle,
      title,
      titleStyle,
      placeholder,
      keyboardType,
      error,
      errorStyle,
      mainContainerStyle,
      icon,
      isTouchable = false,
      onPress = () => {},
      editable = true,
      placeholderTextColor,
      arrow,
      ...rest
    },
    ref
  ) => {
    return (
      <View style={mainContainerStyle}>
        {title ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
          </View>
        ) : null}
        <TouchableOpacity
          activeOpacity={1}
          disabled={!isTouchable}
          onPress={onPress}
          style={[styles.container, containerStyle]}
        >
          {editable ? (
            <TextInput
              ref={ref}
              value={value}
              onChangeText={onChangeText}
              style={[styles.input, inputStyle]}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor ?? Colors.INPUT_PLACE}
              keyboardType={keyboardType ?? "default"}
              editable={!isTouchable && editable}
              selectionColor={Colors.BACKGROUND}
              {...rest}
            />
          ) : (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <TextInput
                ref={ref}
                value={value}
                onChangeText={onChangeText}
                style={[styles.input, inputStyle]}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor ?? Colors.LIGHT_GREY}
                keyboardType={keyboardType ?? "default"}
                editable={!isTouchable && editable}
                selectionColor={Colors.BACKGROUND}
                {...rest}
              />
            </ScrollView>
          )}
          {arrow ? (
            <View style={{}}>
              <Icon
                name="chevron-down"
                size={findSize(20)}
                color={Colors.WHITE_COLOR}
              />
            </View>
          ) : null}
          {icon ? <>{icon()}</> : null}
        </TouchableOpacity>
        {error ? (
          <View style={{ overflow: "hidden" }}>
            <Animatable.Text
              animation={"shake"}
              numberOfLines={1}
              style={[styles.error, errorStyle]}
            >
              {error}
            </Animatable.Text>
          </View>
        ) : null}
      </View>
    );
  }
);

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.VALHALLA,
    // height: findHeight(50),
    width: "100%",
    borderRadius: findHeight(35),
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    alignSelf: "center",
  },

  input: {
    color: Colors.WHITE_COLOR,
    fontSize: findSize(14),
    flex: 1,
    fontFamily: POP_REGULAR,
  },
  title: {
    color: Colors.WHITE_COLOR,
    fontSize: findSize(14),

    fontFamily: POP_REGULAR,
  },
  error: {
    fontSize: findSize(12),
    color: Colors.ORANGE_COLOR,
    marginLeft: 5,
    maxWidth: DEV_WIDTH * 0.82,
    fontFamily: POP_REGULAR,
  },
});
