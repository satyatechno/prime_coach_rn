import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { PropTypes } from "prop-types";
import { Colors } from "../constants/Colors";
import { ROBO_MEDIUM } from "../constants/Fonts";

class PrimeButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      containerProps,
      buttonProps,
      buttonTextProps,
      loading,
      isDisabled,
    } = this.props;
    return (
      <View {...containerProps} style={styles.container}>
        <TouchableOpacity
          disabled={loading || isDisabled}
          {...buttonProps}
          style={[styles.button, buttonProps.style && buttonProps.style]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={this.props.indiColor} />
          ) : (
            <Text
              {...buttonTextProps}
              style={[styles.text, buttonTextProps && buttonTextProps.style]}
            >
              {this.props.buttonText}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  button: {
    backgroundColor: Colors.BLACK_COLOR,
    width: "100%",
    borderRadius: 5,
    height: 45,
    justifyContent: "center",
    marginBottom: 20,
  },
  text: {
    color: Colors.WHITE_COLOR,
    textAlign: "center",
    fontSize: 15,
    padding: 5,
    fontFamily: ROBO_MEDIUM,
  },
  rowView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

PrimeButton.propTypes = {
  containerProps: PropTypes.object,
  buttonProps: PropTypes.object,
  buttonTextProps: PropTypes.object,
  loading: PropTypes.boolean,
};

export default PrimeButton;
