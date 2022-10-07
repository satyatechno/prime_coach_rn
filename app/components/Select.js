import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "./customButton/CustomButton";
import { findHeight, findSize } from "../utils/helper";
import { Colors } from "../constants/Colors";
import { POP_REGULAR } from "../constants/Fonts";
import IconDown from "react-native-vector-icons/dist/Entypo";
import ReactNativeModal from "react-native-modal";
import { DEV_HEIGHT, DEV_WIDTH } from "../constants/DeviceDetails";
import CustomInput from "./customInput/CustomInput";

function CheckBoxComponent({ item, selected, onChange }) {
  return (
    <CustomButton style={{ marginVertical: 5 }} onPress={onChange}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <Text
          style={{
            color: Colors.WHITE_COLOR,
            fontFamily: POP_REGULAR,
            fontSize: findSize(14),
            flex: 1,

            marginStart: 8,
          }}
        >
          {item?.label}
        </Text>

        <View
          style={{
            height: 22,
            width: 22,
            borderRadius: 11,
            borderWidth: 1,
            borderColor: selected ? Colors.ORANGE : Colors.INPUT_PLACE,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 5,
          }}
        >
          {selected ? (
            <View
              style={{
                height: 14,
                width: 14,
                borderRadius: 7,
                backgroundColor: Colors.ORANGE,
              }}
            />
          ) : null}
        </View>
      </View>
    </CustomButton>
  );
}

const Select = ({
  pickerItems,
  pickerValue,
  placeholder = "Select an item...",
  pickerProps: { onValueChange, value, style },
  containerStyle,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  // useEffect(() => {
  //   if (pickerItems.length == 0) {
  //     onValueChange(null);
  //   }
  // }, []);
  return (
    <View>
      <CustomButton
        style={[styles.container, containerStyle]}
        onPress={() => setIsVisible(true)}
      >
        <CustomInput
          inputStyle={[
            styles.title,
            {
              color:
                pickerValue == null || pickerItems.length == 0
                  ? Colors.INPUT_PLACE
                  : Colors.WHITE_COLOR,
            },
          ]}
          onChangeText={(text) => {}}
          value={
            pickerValue == null || pickerItems.length == 0
              ? placeholder
              : pickerItems?.find((x) => x.value == pickerValue)?.label
          }
          editable={false}
          isTouchable={false}
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            top: 0,
            alignSelf: "flex-end",
            justifyContent: "center",
            alignItems: "center",
            end: 10,
          }}
        >
          <IconDown
            name="chevron-down"
            size={20}
            color={
              pickerValue == null ? Colors.INPUT_PLACE : Colors.WHITE_COLOR
            }
          />
        </View>
      </CustomButton>
      <ReactNativeModal
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        isVisible={isVisible}
        style={{
          margin: 0,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
        hasBackdrop={true}
        onBackdropPress={() => setIsVisible(false)}
        onBackButtonPress={() => setIsVisible(false)}
      >
        <View
          style={{
            backgroundColor: Colors.BACKGROUND,
            minHeight: findSize(170),

            width: DEV_WIDTH - 40,
            borderTopEndRadius: 15,
            borderTopStartRadius: 15,
            padding: findSize(20),
          }}
        >
          <CustomButton
            onPress={() => {
              setIsVisible(false);
            }}
          >
            <View
              style={{
                backgroundColor: Colors.VALHALLA,
                width: 65,
                height: 3,
                borderRadius: 3,
                alignSelf: "center",
                marginBottom: findSize(20),
              }}
            />
          </CustomButton>
          <View
            style={{
              backgroundColor: Colors.INPUT_PLACE,
              width: "100%",
              height: 1,
            }}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              maxHeight: DEV_HEIGHT * 0.6,
            }}
          >
            {pickerItems?.length ? (
              <View>
                {pickerItems?.map((item, index) => (
                  <CheckBoxComponent
                    item={item}
                    index={index}
                    selected={item?.value == pickerValue}
                    onChange={() => {
                      onValueChange(item?.value);
                      setIsVisible(false);
                    }}
                  />
                ))}
              </View>
            ) : (
              <Text
                style={{
                  color: Colors.WHITE_COLOR,
                  fontSize: findSize(17),
                  fontFamily: POP_REGULAR,
                  textAlign: "center",
                  marginTop: findSize(40),
                }}
              >
                No data found.
              </Text>
            )}
          </ScrollView>
        </View>
      </ReactNativeModal>
    </View>
  );
};

export default Select;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.VALHALLA,
    // height: findHeight(50),
    width: "100%",
    borderRadius: findHeight(28),
    justifyContent: "center",

    // justifyContent: "space-between",
    marginVertical: 10,
  },

  title: {
    color: Colors.WHITE_COLOR,
    fontSize: findSize(14),
    fontFamily: POP_REGULAR,
  },
});

// import React, { Component } from "react";
// import { View, StyleSheet } from "react-native";
// import { Colors } from "../constants/Colors";
// import RNPickerSelect from "react-native-picker-select";
// import IconDown from "react-native-vector-icons/dist/Entypo";
// import { PropTypes } from "prop-types";
// import { ROBO_REGULAR } from "../constants/Fonts";
// import { IS_IOS } from "../constants/DeviceDetails";
// import { findHeight, findSize } from "../utils/helper";

// export default class Select extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       selectedValue: null,
//     };
//   }

//   componentDidMount() {
//     if (this.props.pickerProps && this.props.pickerProps.value) {
//       this.setState({ selectedValue: this.props.pickerProps.value });
//     } else {
//       this.setState({ selectedValue: null });
//     }
//   }

//   render() {
//     const { pickerProps } = this.props;
//     return (
//       <View
//         style={
//           !IS_IOS
//             ? [
//                 styles.androidContainer,
//                 {
//                   backgroundColor: this.props.androidBgColor || Colors.VALHALLA,
//                   borderColor:
//                     this.props.androidBorderColor || Colors.LIGHT_GREY,
//                   width: this.props.widthAndroid || "100%",
//                 },
//                 { ...this.props.containerStyle },
//               ]
//             : null
//         }
//       >
//         <RNPickerSelect
//           {...pickerProps}
//           items={this.props.pickerItems}
//           onValueChange={(value) => {
//             // this.setState({ selectedValue: value });
//             pickerProps.onValueChange(value);
//           }}
//           placeholder={
//             this.props.placeholder === null
//               ? {}
//               : {
//                   label: this.props.placeholder || "Select an item...",
//                 }
//           }
//           style={{
//             placeholder: {
//               color: Colors.INPUT_PLACE,
//               ...this.props?.placeholderStyle,
//             },

//             viewContainer: [styles.container, pickerProps.style],
//             inputIOS: [
//               styles.iosLabel,
//               { color: this.props.iosLabel || Colors.WHITE_COLOR },
//             ],
//             inputAndroid: [
//               styles.androidLabel,
//               { color: this.props.androidLabel || Colors.WHITE_COLOR },
//             ],
//           }}
//           value={this.props.pickerValue}
//           useNativeAndroidPickerStyle={false}
//           Icon={() => {
//             return (
//               <IconDown
//                 style={!IS_IOS ? styles.chevron : null}
//                 name="chevron-down"
//                 size={22}
//                 color={this.props.iconColor || Colors.WHITE_COLOR}
//               />
//             );
//           }}
//         />
//       </View>
//     );
//   }
// }

// Select.propTypes = {
//   pickerProps: PropTypes.object,
// };

// const styles = StyleSheet.create({
//   iosLabel: {
//     marginTop: 5,
//     fontFamily: ROBO_REGULAR,
//     fontSize: findSize(12),
//   },
//   androidLabel: {
//     fontFamily: ROBO_REGULAR,
//     fontSize: findSize(12),
//     marginLeft: 8,
//   },
//   container: {
//     backgroundColor: Colors.VALHALLA,
//     flexDirection: "column",
//     height: findHeight(50),
//     borderRadius: findSize(20),
//     padding: 10,
//     marginBottom: 15,
//     // borderWidth: 1,
//     borderColor: Colors.LIGHT_GREY,
//   },
//   androidContainer: {
//     borderRadius: 5,
//     height: 45,
//     marginBottom: 10,
//     height: findHeight(50),
//     borderRadius: findSize(25),
//     // borderWidth: 1,
//   },
//   chevron: {
//     marginTop: findHeight(12),
//     marginRight: 5,
//   },
// });
