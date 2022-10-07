import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Colors } from "../constants/Colors";
import RNPickerSelect from "react-native-picker-select";
import IconDown from "react-native-vector-icons/dist/Entypo";
import { styles } from "../screens/Signup/Register.styles";
import { PropTypes } from "prop-types";

export default class Picker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: null,
    };
  }

  componentDidMount() {
    if (this.props.pickerProps && this.props.pickerProps.value) {
      this.setState({ selectedValue: this.props.pickerProps.value });
    } else {
      this.setState({ selectedValue: null });
    }
  }

  render() {
    const { selectedValue } = this.state;
    const { pickerProps, placeholderProps, pickerBtnProps } = this.props;
    return (
      <View>
        <RNPickerSelect
          {...pickerProps}
          Icon={() => <View />}
          items={this.props.pickerItems}
          onValueChange={(value) => {
            this.setState({ selectedValue: value });
            pickerProps.onValueChange(value);
          }}
          placeholder={this.props.placeholder}
          value={this.props.value}
        >
          <TouchableOpacity
            {...pickerBtnProps}
            style={[styles.dropdown, pickerBtnProps && pickerBtnProps.style]}
          >
            <Text
              {...placeholderProps}
              style={[
                styles.dropdownLbl,
                {
                  color:
                    selectedValue !== null
                      ? Colors.BLACK_COLOR
                      : Colors.PLACEHOLDER,
                },
                placeholderProps && placeholderProps.style,
              ]}
            >
              {selectedValue === null
                ? this.props.placeholderLabel
                : this.props.pickerValues[this.state.selectedValue]}
            </Text>
            <IconDown
              name="chevron-down"
              size={25}
              color={this.props.iconColor || Colors.SKY_COLOR}
            />
          </TouchableOpacity>
        </RNPickerSelect>
      </View>
    );
  }
}

Picker.propTypes = {
  pickerProps: PropTypes.object,
  placeholderProps: PropTypes.object,
  pickerBtnProps: PropTypes.object,
};
