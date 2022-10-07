import React, { Component } from "react";
import { View, ActivityIndicator } from "react-native";
import { PropTypes } from "prop-types";
import { DEV_HEIGHT } from "../constants/DeviceDetails";
import { Colors } from "../constants/Colors";

class Loader extends Component {
  render() {
    const { loaderProps } = this.props;
    return (
      <View>
        <ActivityIndicator
          {...loaderProps}
          color={Colors.ORANGE}
          size="large"
          style={[
            { marginTop: (DEV_HEIGHT * 25) / 100 },
            loaderProps && loaderProps.style,
          ]}
        />
      </View>
    );
  }
}

Loader.propTypes = {
  loaderProps: PropTypes.object,
};

export default Loader;
