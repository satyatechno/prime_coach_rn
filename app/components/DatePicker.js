import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import IconCal from "react-native-vector-icons/dist/Entypo";
import { Colors } from "../constants/Colors";
import { isIOS13 } from "../constants/DeviceDetails";
import { PropTypes } from "prop-types";
import moment from "moment";
import { ROBO_REGULAR } from "../constants/Fonts";
import CustomInput from "./customInput/CustomInput";
import { findHeight, findSize } from "../utils/helper";

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      show: false,
      hasSetDate: false,
      day: "",
      month: "",
      year: "",
      mode: "date",
    };
  }

  setDate = async (event, date) => {
    date = date || this.state.date;
    await this.setState({
      hasSetDate: true,
      show: Platform.OS === "ios" ? true : false,
      date: date,
    });
    try {
      this.props.dateTimeProps.onChange(date);
    } catch (ex) {}
  };

  render() {
    const { hasSetDate } = this.state;
    const CURR_DATE = new Date().valueOf();
    const { dateTimeProps, calenderBgProps, backgroundProps } = this.props;
    return (
      <View>
        {/* <TouchableOpacity
          disabled={this.props.disabled}
          onPress={() => this.setState({ show: !this.state.show })}
        >
          <View
            style={[
              styles.androidView,
              backgroundProps && backgroundProps.style,
            ]}
          >
            {hasSetDate ? (
              <View style={styles.dateView}>
                <Text style={styles.dateText}>
                  {moment(this.state.date.valueOf()).format("DD")}
                </Text>
                <Text style={styles.dateText}>
                  {moment(this.state.date.valueOf()).format("MMMM")}
                </Text>
                <Text style={styles.dateText}>
                  {moment(this.state.date.valueOf()).format("YYYY")}
                </Text>
              </View>
            ) : (
              <View style={styles.dateIconView}>
                <Text style={styles.dateText}>
                  {moment(
                    this.props.currentDate && this.props.currentDate.valueOf()
                  ).format("DD - MM - YYYY") ||
                    moment(CURR_DATE).format("DD - MM - YYYY")}
                </Text>
                <IconCal name="calendar" color={Colors.SKY_COLOR} size={25} />
              </View>
            )}
          </View>
        </TouchableOpacity> */}
        <View style={[this.props?.mainContainerStyle]}>
          <CustomInput
            mainContainerStyle={{
              marginVertical: 10,
            }}
            containerStyle={this.props?.containerStyle}
            placeholder={this.props?.placeholder ?? "Select Date"}
            inputStyle={{
              fontSize: findSize(11),
              paddingTop: findSize(12),
            }}
            onChangeText={(text) => {}}
            value={
              this.props.currentDate
                ? moment(this.props.currentDate.valueOf()).format("DD/MM/YYYY")
                : ""
            }
            isTouchable={true}
            onPress={() => {
              this.setState({ show: !this.state.show });
            }}
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
            <TouchableOpacity
              onPress={() => {
                this.setState({ show: !this.state.show });
              }}
            >
              <Image
                style={{ height: 24, width: 24, tintColor: Colors.WHITE_COLOR }}
                source={require("../../assets/images/cal-icon.png")}
              />
            </TouchableOpacity>
          </View>
        </View>

        {this.state.show && (
          <DateTimePicker
            {...dateTimeProps}
            value={
              this.props.currentDate
                ? new Date(this.props.currentDate)
                : this.state.date
            }
            mode={this.state.mode}
            is24Hour={true}
            display="calendar"
            onChange={this.setDate}
            maximumDate={this.props.maxDate}
            minimumDate={this.props.minDate}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dateView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  dateText: {
    color: Colors.BLACK_COLOR,
    fontFamily: ROBO_REGULAR,
  },
  dateIconView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  androidView: {
    height: 45,
    width: "100%",
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
  },
  iosBg: {
    backgroundColor: Colors.WHITE_COLOR,
    marginBottom: 15,
    borderRadius: 5,
  },
  iosDarkBg: {
    backgroundColor: Colors.BG_COLOR,
    marginBottom: 15,
    borderRadius: 5,
  },
});

DatePicker.propTypes = {
  dateTimeProps: PropTypes.object,
  calenderBgProps: PropTypes.object,
  backgroundProps: PropTypes.object,
};

export default DatePicker;
