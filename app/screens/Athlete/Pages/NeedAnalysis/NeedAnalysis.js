import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import HamBurger from '../../../../components/HamBurger';
import { Colors } from '../../../../constants/Colors';
import {
  ROBO_BOLD,
  ROBO_MEDIUM,
  ROBO_REGULAR,
  ROBO_ITALIC,
} from '../../../../constants/Fonts';
import { DEV_WIDTH } from '../../../../constants/DeviceDetails';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { standardPostApi } from '../../../../api/ApiWrapper';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../../components/Loader';
import { Toaster } from '../../../../components/Toaster';
import HTML from 'react-native-render-html';
import { NavigationEvents } from 'react-navigation';
const _JSON = require('./Need.json');

function Analysis(props) {
  return (
    <View>
      <TouchableOpacity onPress={props.onToggle} style={styles.chevRow}>
        <Icon
          name={props.isExpanded ? 'chevron-circle-up' : 'chevron-circle-down'}
          size={22}
          color={Colors.SKY_COLOR}
        />
        <Text style={styles.titleText}>{props.title}</Text>
      </TouchableOpacity>
      {props.isExpanded && (
        <View style={{ marginVertical: 10 }}>
          {props.points &&
            props.points.map((i) => {
              return (
                <View>
                  <Text style={styles.pointTxt}>
                    {'\u2022 ' + i.point}
                    {i.video_url && (
                      <Text onPress={props.onWatch} style={styles.watchTxt}>
                        {' Watch Video'}
                      </Text>
                    )}
                  </Text>
                </View>
              );
            })}
          {props.subPoints &&
            props.subPoints.map((i) => {
              return (
                <View>
                  <Text style={[styles.pointTxt, { marginLeft: 20 }]}>
                    {'- ' + i.point}
                  </Text>
                </View>
              );
            })}
        </View>
      )}
    </View>
  );
}

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysis_array: _JSON.analysis_data,
      fetchingData: true,
      htmlData: null,
    };
    this.fetchNeedAnalysis();
  }

  toggleCheckBox = async (id) => {
    const { analysis_array } = this.state;
    const changedChev = analysis_array.find((cv) => cv.id === id);
    changedChev.isExpanded = !changedChev.isExpanded;
    const chevrons = Object.assign({}, analysis_array, changedChev);
    this.setState({ chevrons });
  };

  fetchNeedAnalysis = async () => {
    try {
      const res = await standardPostApi(
        'sport_need_analysis',
        undefined,
        {
          access_token: await AsyncStorage.getItem('@USER_ACCESS_TOKEN'),
        },
        true,
        false
      );
      if (res.data.code === 301) {
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        console.log('Need Analysys');
        this.setState({ fetchingData: false, htmlData: res.data.data });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ fetchingData: false });
  };

  render() {
    const { fetchingData, htmlData } = this.state;
    return (
      <>
        <NavigationEvents onWillFocus={() => this.fetchNeedAnalysis()} />
        <HamBurger onMenuPress={() => this.props.navigation.openDrawer()}>
          {/* <Text style={styles.home}>Need Analysis</Text> */}
          {fetchingData ? (
            <Loader />
          ) : (
            <HTML
              html={htmlData}
              onLinkPress={(event, href) => {
                this.props.navigation.navigate('ViewExercise', {
                  content: {
                    exerciseUrl: href,
                  },
                });
              }}
            />
          )}
          {/* <Text style={styles.sportsName}>{_JSON.sport_name}</Text>
        {this.state.analysis_array.map((item) => {
          return (
            <Analysis
              isExpanded={item.isExpanded}
              title={item.title}
              points={item.points}
              subPoints={item.subPoints}
              onToggle={() => this.toggleCheckBox(item.id)}
            />
          );
        })} */}
        </HamBurger>
      </>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    color: Colors.WHITE_COLOR,
    fontSize: 30,
    textAlign: 'center',
    fontFamily: ROBO_BOLD,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 16,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_MEDIUM,
    marginLeft: 15,
    width: DEV_WIDTH - 75,
    textAlign: 'justify',
  },
  chevRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  sportsName: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_MEDIUM,
    marginVertical: 7,
  },
  pointTxt: {
    color: Colors.WHITE_COLOR,
    fontSize: 16,
    fontFamily: ROBO_REGULAR,
    marginVertical: 7,
    textAlign: 'justify',
  },
  watchTxt: {
    color: Colors.INDIGO_COLOR,
    fontSize: 13,
    fontFamily: ROBO_ITALIC,
  },
});
