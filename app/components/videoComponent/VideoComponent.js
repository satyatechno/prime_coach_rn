import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { findHeight, findSize } from "../../utils/helper";
import { Colors } from "../../constants/Colors";
import { POP_REGULAR } from "../../constants/Fonts";
import CustomButton from "../customButton/CustomButton";
import Icon from "react-native-vector-icons/AntDesign";

const VideoComponent = ({
  name = "video.mp4",
  url,
  onPreview,
  onEdit,
  onDelete,
  style = {},
}) => {
  return (
    <View
      style={{
        backgroundColor: Colors.BACKGROUND,
        height: findHeight(50),
        width: "100%",
        borderRadius: findHeight(28),
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 15,
        marginVertical: 10,
        ...style,
      }}
    >
      <View style={{ flexDirection: "row", width: "55%" }}>
        <Image
          source={require("../../../assets/images/youtube.png")}
          style={{
            height: findSize(16),
            width: findSize(21),
          }}
        />
        <Text
          style={{
            fontSize: findSize(11),
            fontFamily: POP_REGULAR,
            color: Colors.WHITE_COLOR,
            marginStart: 5,
            flex: 1,
            marginEnd: 5,
          }}
          numberOfLines={1}
        >
          {url?.split("/")?.pop() ?? "video.mp4"}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "45%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CustomButton
          onPress={onPreview}
          type={2}
          style={{ height: findSize(25), width: findSize(72) }}
          title="Preview"
          textStyle={{ fontSize: findSize(11), fontFamily: POP_REGULAR }}
        />
        <CustomButton onPress={onEdit}>
          <Image
            source={require("../../../assets/images/video-edit.png")}
            style={{
              height: findSize(18),
              width: findSize(18),
            }}
          />
        </CustomButton>
        <CustomButton onPress={onDelete}>
          <Icon name="delete" size={20} color={Colors.RED_COLOR} />
        </CustomButton>
      </View>
    </View>
  );
};

export default VideoComponent;

const styles = StyleSheet.create({});
