import React, { Component } from 'react';
import Modall from '../../../components/Modall';
import PrimeInput from '../../../components/PrimeInput';
import { Colors } from '../../../constants/Colors';
import { standardPostApi } from '../../../api/ApiWrapper';
import AsyncStorage from '@react-native-community/async-storage';

export default class AddTestingResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savingValue: false,
      testValue: '',
      testingProtocolExercises: [],
    };
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc();
  }

  checkNonNegative = () => {
    const { testValue } = this.state;
    if (testValue.trim().length === 0 || testValue < 0) {
      alert('This value can not be empty or negative.');
      this.setState({ savingValue: false });
      return false;
    }
    return true;
  };

  save_user_testing_protocol = async () => {
    const { testingProtocolExercises } = this.state;
    const { navigation } = this.props;
    const _content = navigation.getParam('content');
    this.setState({ savingValue: true });
    if (this.checkNonNegative()) {
      try {
        const res = await standardPostApi(
          'save_user_testing_protocol',
          undefined,
          {
            access_token: await AsyncStorage.getItem('@USER_ACCESS_TOKEN'),
            testing_protocol_id: _content.selectedProtocol,
            user_id: _content.playerData.id,
            testing_protocol_exercise: JSON.stringify(testingProtocolExercises),
            team_id: _content.teamData.id,
            resultset_no: _content?.currentPage,
          },
          true
        );
        if (res.data.code == 200) {
          this.setState({ savingValue: false });
          this.goBack();
        }
      } catch (error) {
        console.log(error);
      }
      this.setState({ savingValue: false });
    }
  };

  setTestResults = async (text) => {
    await this.setState({ testValue: text });
    const { navigation } = this.props;
    const { testValue } = this.state;
    const _exercises = navigation.getParam('content').exerciseData;
    const _exerciseResult = navigation.getParam('content').exerciseResult;
    let _exercisesArray = [];
    _exercises.forEach((item) => {
      _exercisesArray.push({
        testing_protocol_exercise_id: item.id.toString(),
        testing_protocol_result: item.result.toString(),
      });
    });
    _exercisesArray.forEach((i) => {
      if (i.testing_protocol_exercise_id === _exerciseResult.id.toString()) {
        i.testing_protocol_result = testValue;
      }
    });
    await this.setState({ testingProtocolExercises: [..._exercisesArray] });
  };

  render() {
    const { savingValue } = this.state;
    const { navigation } = this.props;
    const _content = navigation.getParam('content');
    return (
      <Modall
        crossPress={() => this.goBack()}
        savePress={() => this.save_user_testing_protocol()}
        btnTxt={'Save'}
        title={'Add New Testing Result'}
        containerProps={{ style: { flex: 3 / 4, marginVertical: 25 } }}
        loading={savingValue}
      >
        <PrimeInput
          inputProps={{
            onChangeText: async (text) => {
              await this.setTestResults(text);
            },
            keyboardType: 'numeric',
            placeholder: _content.exerciseResult.result.toString(),
          }}
          placeColor={Colors.BLACK_COLOR}
          noAnimation={true}
        />
      </Modall>
    );
  }
}
