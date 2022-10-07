import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Container from '../../../../../components/Container';
import { Colors } from '../../../../../constants/Colors';
import { ROBO_REGULAR } from '../../../../../constants/Fonts';
import { Day } from '../../../../Athlete/Pages/Workouts/AssignedWorkouts';

export default class DayDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigation } = this.props;
    const PlayerData = navigation.getParam('content').playerDetails;
    const TeamData = navigation.getParam('content').teamDetails;
    const PageDetails = navigation.getParam('content').buttonDetails;
    const WeekDetails = navigation.getParam('content').weekDetails;
    const WeekDays = WeekDetails.days;
    console.log("fgdshgfjhgsdjf",WeekDetails)
    return (
      <Container backFn={() => this.props.navigation.goBack()}>
        <View>
          <View style={{ marginBottom: 15 }}>
            <TouchableOpacity onPress={() => this.props.navigation.pop(5)}>
              <Text style={styles.teamName}>
                {TeamData.team_name}
                <Text style={styles.playerName}>
                  {' > '}
                  {PlayerData.first_name + ' ' + PlayerData.last_name}
                  {' > '}
                  Program Plan {'>'} {PageDetails.displayName}
                  {' > '}
                  {WeekDetails.week_number} {'>'} Days
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
          {WeekDays.map((day) => {
            return (
              <Day
                dayWorkCompleted={day.day_workout_complete}
                day_title={day.day_number}
                hideStartBtn={true}
                // hideViewBtn={true}
                // onStart={() =>
                //   this.props.navigation.navigate("StartWorkout", {
                //     content: {
                //       dayDetails: day,
                //       weekDetails: WeekDetails,
                //     },
                //   })
                // }
                onView={() =>
                  this.props.navigation.navigate('ViewWorkout', {
                    exportBtn:true,
                    content: {
                      dayDetails: day,
                      weekDetails: WeekDetails,
                      programDetails: {
                        id: WeekDetails?.annual_training_program_id,
                      },
                    },
                  })
                }
              />
            );
          })}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  teamName: {
    color: Colors.SKY_COLOR,
    fontFamily: ROBO_REGULAR,
    fontSize: 18,
  },
  playerName: {
    color: Colors.WHITE_COLOR,
    fontSize: 18,
    fontFamily: ROBO_REGULAR,
  },
});
