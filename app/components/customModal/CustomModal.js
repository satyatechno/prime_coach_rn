import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import { Colors } from "../../constants/Colors";
import { findHeight, findSize } from "../../utils/helper";
import { POP_MEDIUM } from "../../constants/Fonts";
import Icon from "react-native-vector-icons/Feather";
import CustomButton from "../customButton/CustomButton";

const CustomModal = ({ isVisible, onClose, children }) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      hasBackdrop={true}
      onBackdropPress={() => {}}
      style={{ flex: 1 }}
      animationInTiming={300}
      animationOutTiming={300}

      // customBackdrop={}
    >
      <View
        style={{
          backgroundColor: Colors.BACKGROUND,
          borderRadius: findSize(35),

          padding: 20,
        }}
      >
        <View style={{ position: "absolute", top: -7, end: -7 }}>
          <CustomButton
            style={{
              backgroundColor: Colors.VALHALLA,
              height: 30,
              width: 30,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              onClose();
            }}
          >
            <Icon name="x" color={Colors.WHITE_COLOR} size={20} />
          </CustomButton>
        </View>
        {children}
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({});
