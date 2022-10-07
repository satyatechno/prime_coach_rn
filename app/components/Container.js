import React, { Component } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Colors } from '../constants/Colors';
import CustomButton from './customButton/CustomButton';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { findSize } from '../utils/helper';
import {
  POP_REGULAR,
  ROBO_BOLD,
  ROBO_MEDIUM,
  ROBO_REGULAR,
} from '../constants/Fonts';

const KEYBOARD_VIEW = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

export default class Container extends Component {
  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: this.props?.backgroundColor || Colors.BACKGROUND,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
          }}>
          <CustomButton
            style={{
              backgroundColor: Colors.VALHALLA,
              borderRadius: 4,
              padding: 2,
              height: findSize(28),
              width: findSize(28),
            }}
            onPress={() => {
              this.props?.backFn();
            }}>
            <FeatherIcon
              name='chevron-left'
              size={20}
              color={Colors.WHITE_COLOR}
            />
          </CustomButton>
          <Text
            style={{
              fontFamily: POP_REGULAR,
              fontSize: findSize(18),
              color: Colors.WHITE_COLOR,
              flex: 1,
              textAlign: 'center',
            }}>
            {this.props?.title}
          </Text>
          <View
            style={{
              height: findSize(30),
              width: findSize(30),
            }}
          />
        </View>

        <ScrollView style={Platform.OS === 'android' ? { flex: 1 } : {}}>
          <KEYBOARD_VIEW
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            behavior='padding'>
            <View
              style={{
                paddingHorizontal: findSize(20),
                ...this?.props?.style,
              }}>
              {this.props.children}
            </View>
          </KEYBOARD_VIEW>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
