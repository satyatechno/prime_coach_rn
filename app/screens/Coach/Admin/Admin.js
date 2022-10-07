import React, { Component, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import IconPM from 'react-native-vector-icons/AntDesign';
import IconChev from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HamBurger from '../../../components/HamBurger';
import PrimeInput from '../../../components/PrimeInput';
import Select from '../../../components/Select';
import TildView from '../../../components/tildView/TildView';
import { Colors } from '../../../constants/Colors';
import { POP_MEDIUM } from '../../../constants/Fonts';
import { styles } from './Admin.styles';

const CREATING_FOR = [
  { label: 'All', value: 'all' },
  { label: 'Coaches', value: 'coach' },
];

const COUPON_DURATION = [
  { label: 'Once', value: 'once' },
  { label: 'Repeating', value: 'repeating' },
  { label: 'Forever', value: 'forever' },
];

const COUPON_TYPE = [
  { label: 'Amount Off', value: 'amount_off' },
  { label: 'Percent Off', value: 'percent_off' },
];

const COUPON_CURRENCY = [
  { label: 'Pounds (£)', value: 'gbp' },
  { label: 'Dollars ($)', value: 'usd' },
];

function Hr(props) {
  return <View style={[styles.line, props && props.style]} />;
}

function Chevron(props) {
  return (
    <View>
      <TouchableOpacity style={styles.exerGrpChecvBtn} onPress={props.onToggle}>
        <IconChev
          name={props.isExpanded ? 'chevron-circle-up' : 'chevron-circle-down'}
          size={25}
          color={Colors.SKY_COLOR}
        />
        <Text style={styles.exerGrpChev}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
}

function SeachResult(props) {
  return (
    <View>
      <View style={styles.userResultBg}>
        <View style={styles.userDetailsRow}>
          <Text style={styles.userResultTxt}>{props.firstName}</Text>
          <Text style={styles.userResultTxt}>{props.lastName}</Text>
          <Text style={styles.userResultTxt}>{props.email}</Text>
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity onPress={props.onReset} style={styles.resetPassBtn}>
            <Text style={styles.btnTxt}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={props.onDelete}
            style={styles.deleteUserBtn}>
            <Text style={styles.btnTxt}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function ExerciseGroup(props) {
  return (
    <View>
      <View style={styles.groupRows}>
        <Text style={styles.groupLabels}>Name</Text>
        <PrimeInput
          inputProps={{
            onChangeText: (text) => {
              props.onNameChange(text);
            },
            style: styles.groupInputs,
            placeholder: 'Name (Required)',
            value: props.exerName,
          }}
          noAnimation={true}
        />
      </View>
      <View style={styles.groupRows}>
        <Text style={styles.groupLabels}>Description</Text>
        <PrimeInput
          inputProps={{
            onChangeText: (text) => {
              props.onDescChange(text);
            },
            style: styles.groupInputs,
            placeholder: 'Description (Optional)',
            value: props.descriptionValue,
          }}
          noAnimation={true}
        />
      </View>
      <View style={styles.groupRows}>
        <Text style={styles.groupLabels}>Video Link</Text>
        <PrimeInput
          inputProps={{
            onChangeText: (text) => {
              props.onVideoChange(text);
            },
            style: styles.groupInputs,
            placeholder: 'YouTube Link (Optional)',
            value: props.youtubeLink,
          }}
          noAnimation={true}
        />
      </View>
      <View style={styles.groupRows}>
        <Text style={styles.groupLabels}>Exercise Group</Text>
        <Select
          pickerProps={{
            onValueChange: async (value) => {
              props.onValueChange(value);
            },
            style: {
              width: 175,
              height: 40,
            },
          }}
          widthAndroid={175}
          pickerItems={props.pickerItems}
          pickerValue={props.pickerValue}
        />
      </View>
      {props.insideList ? (
        <View style={[styles.iconRow, { marginBottom: 10 }]}>
          <TouchableOpacity onPress={props.onCheck} style={styles.iconsBtn}>
            <Icon name='check' size={22} color={Colors.WHITE_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onDelete} style={styles.iconsBtn}>
            <Icon name='delete' size={22} color={Colors.WHITE_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onView} style={styles.iconsBtn}>
            <IconPM name='eyeo' size={22} color={Colors.WHITE_COLOR} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.iconRow, { marginBottom: 5 }]}>
          <TouchableOpacity onPress={props.onAdd} style={styles.iconsBtn}>
            <Icon name='add' size={22} color={Colors.WHITE_COLOR} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const Input = ({ data, index, onChangeText }) => {
  const [input, setInput] = useState(data[0]);
  return (
    <View style={{ marginVertical: 5 }}>
      <PrimeInput
        inputProps={{
          onChangeText: (text) => {
            onChangeText(text);
            setInput(text);
          },
          style: styles.exerGroupInput,
          value: input,
        }}
        noAnimation={true}
      />
    </View>
  );
};
export default class Admin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <HamBurger onMenuPress={() => this.props.navigation.openDrawer()}>
        <Text style={styles.home}>Admin Panel</Text>

        <View>
          <>
            <TildView degree='7.15deg'>
              <View style={{ minHeight: 100, padding: 20 }}>
                <Text
                  style={{
                    fontFamily: POP_MEDIUM,
                    color: Colors.INPUT_PLACE,
                    fontSize: 21,
                    marginBottom: 10,
                  }}>
                  Exercise Settings
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('AdminExerciseGroup')
                  }
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: 10,

                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: POP_MEDIUM,
                      color: Colors.WHITE_COLOR,
                      fontSize: 18,
                    }}>
                    Exercise Groups
                  </Text>
                  <Ionicons
                    name='chevron-forward'
                    size={22}
                    color={Colors.WHITE_COLOR}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    height: 1,

                    backgroundColor: Colors.COMET,
                  }}
                />
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('AdminExercises')
                  }
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',

                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: POP_MEDIUM,
                      color: Colors.WHITE_COLOR,
                      fontSize: 18,
                      paddingTop: 15,
                    }}>
                    Exercises
                  </Text>
                  <Ionicons
                    name='chevron-forward'
                    size={22}
                    color={Colors.WHITE_COLOR}
                  />
                </TouchableOpacity>
              </View>
            </TildView>
            <TildView degree='7.15deg'>
              <View style={{ minHeight: 100, padding: 20 }}>
                <Text
                  style={{
                    fontFamily: POP_MEDIUM,
                    color: Colors.INPUT_PLACE,
                    fontSize: 21,
                    marginBottom: 10,
                  }}>
                  Users
                </Text>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('AdminUsers')}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: 10,

                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: POP_MEDIUM,
                      color: Colors.WHITE_COLOR,
                      fontSize: 18,
                    }}>
                    Users
                  </Text>
                  <Ionicons
                    name='chevron-forward'
                    size={22}
                    color={Colors.WHITE_COLOR}
                  />
                </TouchableOpacity>
              </View>
            </TildView>
          </>
        </View>
      </HamBurger>
    );
  }
}
