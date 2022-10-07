import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../constants/Colors";
import { findSize } from "../utils/helper";

const KEYBOARD_VIEW = Platform.OS === "ios" ? KeyboardAvoidingView : View;

export default class HamBurger extends Component {
  render() {
    // console.log('drawer', this?.props?.navigation);
    return (
      <SafeAreaView style={styles.safeView}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ padding: 15 }}
            onPress={this.props.onMenuPress}
          >
            {/* <Icon name="md-menu" size={30} color={Colors.SKY_COLOR} /> */}
            <Image
              source={require("../../assets/images/hamburger.png")}
              style={{ height: 30, width: 30 }}
            />
          </TouchableOpacity>
          {this.props?.showCalendar && (
            <TouchableOpacity
              style={{ padding: 15 }}
              onPress={this.props.onCalendarPress}
            >
              {/* <Icon name="md-menu" size={30} color={Colors.SKY_COLOR} /> */}
              <Image
                style={{ height: 24, width: 24, tintColor: Colors.ORANGE }}
                source={require("../../assets/images/cal-icon.png")}
              />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          refreshControl={
            this.props.pullToRefresh && (
              <RefreshControl
                refreshing={this.props.refreshing}
                onRefresh={this.props.onPullToRefresh}
                title="Loading..."
              />
            )
          }
          style={Platform.OS === "android" ? { flex: 1 } : {}}
          bounces={false}
        >
          <KEYBOARD_VIEW
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
            behavior="padding"
          >
            <View style={{ paddingHorizontal: findSize(20) }}>
              {this.props.children}
            </View>
          </KEYBOARD_VIEW>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
});
