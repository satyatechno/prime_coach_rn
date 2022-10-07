import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  standardPostApi,
  standardPostApiJsonBased,
} from '../../../api/ApiWrapper';
import Container from '../../../components/Container';
import CustomButton from '../../../components/customButton/CustomButton';
import CustomModal from '../../../components/customModal/CustomModal';
import PrimeImage from '../../../components/PrimeImage';
import { Toaster } from '../../../components/Toaster';
import { Colors } from '../../../constants/Colors';
import {
  POP_MEDIUM,
  ROBO_BOLD,
  ROBO_MEDIUM,
  ROBO_REGULAR,
} from '../../../constants/Fonts';
import { findSize } from '../../../utils/helper';
import TeamView from '../components/TeamView';

export default class CoachTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [],
      loading: false,
      teamsLoading: true,
      modalVisible: false,
      assign: [],
    };

    this.showAllTeams();
  }

  assignTeamToCoach = async () => {
    this.setState({
      loading: true,
    });
    const coachData = this.props.navigation?.getParam('data');
    const { assign } = this.state;
    try {
      const res = await standardPostApiJsonBased(
        'assign_coach_to_teams',
        undefined,
        {
          access_token: await AsyncStorage.getItem('@USER_ACCESS_TOKEN'),
          coach_id: coachData?.id,
          team_ids: JSON.stringify(assign),
        },
        true
      );
      console.log('res', JSON.stringify(res, null, 2));

      if (res.data.code == 200) {
        this.setState({
          loading: false,
          modalVisible: false,
        });
        Toaster(res.data.message, Colors.GREEN_COLOR);
        this.props.navigation?.pop(1);
      }
    } catch (error) {
      console.log(error);
      this.setState({
        loading: false,
      });
    }
  };

  showAllTeams = async () => {
    this.setState({ teamsLoading: true });
    try {
      const res = await standardPostApi(
        'show_all_teams',
        undefined,
        {
          access_token: await AsyncStorage.getItem('@USER_ACCESS_TOKEN'),
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({
          teamsLoading: false,
          teams: res.data.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleCheck = (id) => {
    const { assign } = this.state;
    if (assign.includes(id)) {
      this.setState({ assign: assign.filter((x) => x !== id) });
    } else {
      this.setState({ assign: [...assign, id] });
    }
  };

  render() {
    const { assign, loading, teams, teamsLoading } = this.state;
    const coachData = this.props.navigation?.getParam('data');
    return (
      <>
        <Container backFn={() => this.props.navigation.pop(1)}>
          <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <Text style={styles.myTeams}>
              {coachData?.first_name + ' ' + coachData?.last_name}
            </Text>
            <View style={{ alignSelf: 'flex-end' }}>
              <CustomButton
                onPress={() => {
                  this.setState({ modalVisible: true });
                }}
                title='Assign New Team'
                type={1}
                style={{
                  width: 'auto',
                  alignSelf: 'baseline',
                  height: findSize(34),
                  paddingHorizontal: 15,
                  flexDirection: 'row-reverse',
                }}
              />
            </View>

            {coachData?.teams?.length > 0 ? (
              coachData?.teams?.map((item) => {
                return (
                  <TeamView
                    hideDetailButton
                    teamName={item.team_name}
                    poster={item?.sport?.sport_image}
                  />
                );
              })
            ) : (
              <Text style={styles.noTeams}>No Teams Assigned</Text>
            )}
          </View>
        </Container>
        <CustomModal
          isVisible={this.state.modalVisible}
          onClose={() => this.setState({ modalVisible: false })}>
          <View style={styles.errorModalView}>
            <Text
              style={{
                color: Colors.WHITE_COLOR,
                fontSize: 21,
                fontFamily: POP_MEDIUM,
                textAlign: 'center',
                paddingBottom: 10,
              }}>
              Assign team
            </Text>

            <View
              style={{
                height: 1,
                backgroundColor: Colors.COMET,
                marginBottom: 30,
              }}
            />
            {teamsLoading ? (
              <ActivityIndicator
                size='large'
                color={Colors.SKY_COLOR}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
              />
            ) : !teams.length ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ color: Colors.WHITE_COLOR }}>
                  No teams available to assign
                </Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {teams.map((team, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      this.handleCheck(team?.id);
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        alignItems: 'center',
                        marginVertical: 5,
                        // borderBottomWidth: 1,
                        paddingBottom: 10,
                        // borderBottomColor: Colors.LIGHT_GREY,
                      }}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <PrimeImage
                          source={{ uri: team?.sport_image }}
                          style={{ height: 50, width: 50 }}
                          resizeMode='contain'
                        />
                        <Text
                          style={{
                            color: Colors.WHITE_COLOR,
                            fontFamily: POP_MEDIUM,
                            marginHorizontal: 10,
                            fontSize: 15,
                          }}>
                          {team?.team_name}
                        </Text>
                      </View>

                      <View
                        style={{
                          height: 22,
                          width: 22,
                          borderRadius: 11,
                          borderWidth: 1,
                          borderColor: assign.includes(team?.id)
                            ? Colors.ORANGE
                            : Colors.INPUT_PLACE,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginHorizontal: 5,
                        }}>
                        {assign.includes(team?.id) ? (
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
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {teams.length > 0 ? (
              <CustomButton
                isLoading={loading}
                onPress={() => {
                  if (!assign?.length) {
                    alert('Please Select a team to assign.');
                  } else {
                    this.assignTeamToCoach();
                  }
                }}
                title='Save'
                type={1}
                style={{
                  marginTop: 20,
                }}
              />
            ) : null}
          </View>
        </CustomModal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  myTeams: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_BOLD,
    fontSize: 30,
    marginBottom: 25,
  },
  startBtn: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 8,
    borderColor: Colors.SKY_COLOR,
    justifyContent: 'center',
    width: 190,
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  startCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  startTxt: {
    fontSize: 18,
    fontFamily: ROBO_MEDIUM,
    color: Colors.WHITE_COLOR,
  },
  noTeams: {
    fontSize: 15,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    textAlign: 'center',
    marginTop: 120,
  },
  errorModalView: {
    // backgroundColor: Colors.WHITE_COLOR,
    width: 'auto',
    paddingVertical: 10,
    borderRadius: 5,
    // flex: 0.7,
  },
});
