import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { standardPostApi } from '../../../../api/ApiWrapper';
import ContainerWithoutScrollView from '../../../../components/ContainerWithoutScrollView';
import CustomButton from '../../../../components/customButton/CustomButton';
import CustomInput from '../../../../components/customInput/CustomInput';
import CustomModal from '../../../../components/customModal/CustomModal';
import Loader from '../../../../components/Loader';
import Select from '../../../../components/Select';
import Spinnner from '../../../../components/Spinnner';
import TildView from '../../../../components/tildView/TildView';
import { Toaster } from '../../../../components/Toaster';
import { Colors } from '../../../../constants/Colors';
import { POP_MEDIUM } from '../../../../constants/Fonts';
import { findSize } from '../../../../utils/helper';

export class AdminExercises extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exerciseName: '',
      exerciseDesc: '',
      videoLink: '',
      sportsArray: [],
      isModalVisible: false,
      modalData: null,
      exerciseGroupItems: [],
      selectedExerciseGroup: null,
      selectedGroupExercises: [],
      selectToAddExerGroup: null,
      dataLoading: true,
      showingSpinner: false,
      exerciseGroups: [],
    };
  }

  componentDidMount() {
    this.listExerciseGroupSetting('selectPickerInitialValue');
  }

  listExerciseGroupSetting = async (selectPickerInitialValue) => {
    try {
      const res = await standardPostApi(
        'admin_exercise_settings',
        undefined,
        {
          access_token: await AsyncStorage.getItem('@USER_ACCESS_TOKEN'),
          type: 'admin',
        },
        true,
        false
      );
      if (res.data.code == 301) {
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        let initial_data = res.data.data.ExerciseGroups;
        let table_data = [];
        let all_exercises = [];
        initial_data.forEach((item) => {
          table_data.push([item.exercise_group, item.id]);
        });
        initial_data.forEach((item) => {
          all_exercises.push([item.exercises]);
        });
        this.setState({
          exerciseGroupItems:
            res.data.data.ExerciseGroupsSelectpicker.pickerArray,
          exerciseGroups: initial_data,
          selectToAddExerGroup: selectPickerInitialValue
            ? res.data.data.ExerciseGroupsSelectpicker.pickerArray?.[0]?.value
            : this.state.selectToAddExerGroup,
          dataLoading: false,
        });
        this.setSelectedExercises(
          selectPickerInitialValue
            ? res.data.data.ExerciseGroupsSelectpicker.pickerArray?.[0]?.value
            : this.state.selectToAddExerGroup
        );
        console.log('admin_exercise_settings response ', res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  setSelectedExercises = (value) => {
    this.setState({ showingSpinner: true });
    const { exerciseGroups } = this.state;
    exerciseGroups?.forEach((item) => {
      if (item.id == value) {
        this.setState({
          selectedGroupExercises: item.exercises,
          showingSpinner: false,
        });
      }
    });
  };
  verifyExerciseDetails = (action, data) => {
    if (action !== 'delete') {
      if (!data?.exerciseName.trim().length > 0) {
        Toaster('Please provide a name for the exercise.', Colors.LIGHT_RED);
        return false;
      }
      if (data?.video.trim().length > 0) {
        var regExp =
          /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        if (!regExp.test(data?.video)) {
          Toaster('Please enter a valid YouTube URL.', Colors.LIGHT_RED);
          return false;
        }
      }
      if (data?.exerciseGroupId === null) {
        Toaster('Please select an Exercise Group.', Colors.LIGHT_RED);
        return false;
      }
      return true;
    } else {
      console.log('gtg');
      return true;
    }
  };

  cudWorkoutExercise = async (action, exerciseId, data) => {
    if (this.verifyExerciseDetails(action, data)) {
      Keyboard.dismiss();
      this.setState({ isModalVisible: false, showingSpinner: true });
      try {
        const res = await standardPostApi(
          'create_workout_exercise',
          undefined,
          {
            access_token: await AsyncStorage.getItem('@USER_ACCESS_TOKEN'),
            exercise_id: exerciseId,
            exercise_group_id: data?.exerciseGroupId,
            exercise_name: data?.exerciseName,
            exercise_description: data?.description,
            exercise_video: data?.video,
            api_action: action,
            type: 'admin',
          },
          true,
          false
        );
        if (res.data.code == 301) {
          this.setState({ showingSpinner: false });
          Toaster(res.data.message, Colors.LIGHT_RED);
        }
        if (res.data.code == 200) {
          this.setState({
            exerciseName: '',
            exerciseDesc: '',
            videoLink: '',
            showingSpinner: false,
          });

          await this.listExerciseGroupSetting();
          Toaster(res.data.message, Colors.GREEN_COLOR);
        }
      } catch (error) {
        console.log(error);
      }
      this.setState({ showingSpinner: false });
    }
  };

  deleteExerciseAlert = (action, id, name) => {
    return Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise, this cannot be undone?',
      [
        { text: 'Cancel' },
        {
          text: 'Yes',
          onPress: () => this.cudWorkoutExercise(action, id, name),
        },
      ]
    );
  };

  render() {
    const { modalData } = this.state;
    return (
      <>
        <ContainerWithoutScrollView
          backFn={() => this.props.navigation.goBack()}
          title='Exercises'>
          <Spinnner visible={this.state.showingSpinner} />
          {this.state.dataLoading ? (
            <Loader />
          ) : (
            <FlatList
              keyboardShouldPersistTaps='handled'
              ListHeaderComponent={
                <View style={{ marginTop: 20 }}>
                  <Select
                    pickerProps={{
                      onValueChange: (value) => {
                        this.setState({ selectToAddExerGroup: value });
                        this.setSelectedExercises(value);
                      },
                    }}
                    pickerItems={this.state.exerciseGroupItems}
                    pickerValue={this.state.selectToAddExerGroup}
                    placeholder={'Select A Sport'}
                  />
                  <CustomInput
                    mainContainerStyle={{ marginVertical: 10 }}
                    placeholder='Exercise Name'
                    inputStyle={{ fontSize: 11, paddingTop: 12 }}
                    onChangeText={(text) => {
                      this.setState({ exerciseName: text });
                    }}
                    value={this.state.exerciseName}
                  />
                  <CustomInput
                    mainContainerStyle={{ marginVertical: 10 }}
                    placeholder='Description (Optional)'
                    inputStyle={{ fontSize: 11, paddingTop: 12 }}
                    onChangeText={(text) => {
                      this.setState({ exerciseDesc: text });
                    }}
                    value={this.state.exerciseDesc}
                  />
                  <CustomInput
                    mainContainerStyle={{ marginVertical: 10 }}
                    placeholder='Video Link (Optional)'
                    inputStyle={{ fontSize: 11, paddingTop: 12 }}
                    onChangeText={(text) => {
                      this.setState({ videoLink: text });
                    }}
                    value={this.state.videoLink}
                  />
                  <CustomButton
                    onPress={() => {
                      this.cudWorkoutExercise('add', null, {
                        exerciseName: this.state.exerciseName,
                        description: this.state.exerciseDesc,
                        video: this.state.videoLink,
                        exerciseGroupId: this.state.selectToAddExerGroup,
                      });
                    }}
                    title='Save'
                    type={1}
                    style={{
                      marginTop: 20,
                    }}
                  />
                </View>
              }
              showsVerticalScrollIndicator={false}
              data={this.state.selectedGroupExercises}
              contentContainerStyle={{ paddingTop: 20 }}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 10 }}>
                  <ExerciseCard
                    item={item}
                    onEditPress={(value) => {
                      this.setState({ modalData: value, isModalVisible: true });
                    }}
                    onDeletePress={(value) => {
                      this.deleteExerciseAlert('delete', value.id, {
                        exerciseName: value?.exercise,
                        description: value?.description,
                        video: value?.video,
                        exerciseGroupId: this.state.selectToAddExerGroup,
                      });
                    }}
                  />
                </View>
              )}
            />
          )}
        </ContainerWithoutScrollView>
        <CustomModal
          isVisible={this.state.isModalVisible}
          onClose={() =>
            this.setState({ isModalVisible: false, modalData: null })
          }>
          <View
            style={{
              backgroundColor: Colors.BACKGROUND,
              paddingTop: 20,
            }}>
            <Text
              style={{
                fontFamily: POP_MEDIUM,
                color: Colors.WHITE_COLOR,
                textAlign: 'center',
                fontSize: 21,
                paddingBottom: 10,
              }}>
              {modalData?.exercise}
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: Colors.COMET,
                marginBottom: 30,
              }}
            />
            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              placeholder='Exercise Name'
              inputStyle={{ fontSize: 11, paddingTop: 12 }}
              onChangeText={(text) => {
                this.setState({
                  modalData: {
                    ...modalData,
                    exercise: text,
                  },
                });
              }}
              value={modalData?.exercise}
            />
            <CustomInput
              mainContainerStyle={{ marginVertical: 10 }}
              placeholder='Description (Optional)'
              inputStyle={{ fontSize: 11, paddingTop: 12 }}
              onChangeText={(text) => {
                this.setState({
                  modalData: {
                    ...modalData,
                    description: text,
                  },
                });
              }}
              value={modalData?.description}
            />
            <CustomInput
              mainContainerStyle={{ marginVertical: 10, marginBottom: 20 }}
              placeholder='Video Link (Optional)'
              inputStyle={{ fontSize: 11, paddingTop: 12 }}
              onChangeText={(text) => {
                this.setState({
                  modalData: {
                    ...modalData,
                    video: text,
                  },
                });
              }}
              value={modalData?.video}
            />

            <Select
              pickerProps={{
                onValueChange: (value) => {
                  this.setState({
                    modalData: {
                      ...modalData,
                      exercise_group_id: value,
                    },
                  });
                },
              }}
              pickerItems={this.state.exerciseGroupItems}
              pickerValue={Number(modalData?.exercise_group_id)}
              placeholder={'Select A Sport'}
            />
            <CustomButton
              onPress={() => {
                this.cudWorkoutExercise('update', modalData?.id, {
                  exerciseName: modalData?.exercise,
                  description: modalData?.description,
                  video: modalData?.video,
                  exerciseGroupId: modalData?.exercise_group_id,
                });
              }}
              title='Save'
              type={1}
              style={{
                marginTop: 20,
              }}
            />
          </View>
        </CustomModal>
      </>
    );
  }
}

const ExerciseCard = ({ item, onEditPress, onDeletePress }) => {
  return (
    <TildView
      degree='4.15deg'
      containerStyle={{
        paddingVertical: 0,
      }}>
      <View
        style={{
          minHeight: 90,
          padding: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: POP_MEDIUM,
            color: Colors.WHITE_COLOR,
            fontSize: findSize(17),
            flex: 1,
          }}>
          {item?.exercise ?? ''}
        </Text>
        <TouchableOpacity
          onPress={() => onEditPress(item)}
          style={{
            height: findSize(25),
            width: findSize(25),
            //   marginLeft: 14,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
          }}>
          <EvilIcons name='pencil' size={26} color={Colors.YELLOW_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDeletePress(item)}
          style={{
            borderRadius: 25 / 2,

            height: findSize(25),
            width: findSize(25),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesign name='delete' size={18} color={Colors.RED_COLOR} />
        </TouchableOpacity>
      </View>
    </TildView>
  );
};

export default AdminExercises;
