import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import { standardPostApi } from '../../../../api/ApiWrapper';
import ContainerWithoutScrollView from '../../../../components/ContainerWithoutScrollView';
import CustomInput from '../../../../components/customInput/CustomInput';
import Loader from '../../../../components/Loader';
import Spinnner from '../../../../components/Spinnner';
import { Toaster } from '../../../../components/Toaster';
import { Colors } from '../../../../constants/Colors';
import { findSize } from '../../../../utils/helper';
export class AdminExerciseGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      dataLoading: true,
      showingSpinner: false,
      exerciseGroupName: '',
    };
  }
  componentDidMount() {
    this.listExerciseGroupSetting();
  }

  listExerciseGroupSetting = async () => {
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
          tableData: table_data,

          dataLoading: false,
        });
        console.log('admin_exercise_settings response ', res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  handleExerciseDataInputChange = (text, index) => {
    let temp = [...this.state.tableData];
    temp[index][0] = text;
    this.setState({ tableData: temp });
  };

  verifyExerciseName = (string) => {
    if (!string.trim().length > 0) {
      Toaster('Please provide a name for exercise group.', Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  updateExerciseGroup = async (action, exerciseId, exerciseName) => {
    if (this.verifyExerciseName(exerciseName)) {
      Keyboard.dismiss();
      this.setState({ showingSpinner: true });
      try {
        const res = await standardPostApi(
          'create_workout_exercise_group',
          undefined,
          {
            access_token: await AsyncStorage.getItem('@USER_ACCESS_TOKEN'),
            exercise_group_id: exerciseId,
            exercise_group_name: exerciseName,
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
          this.setState({ exerciseGroupName: '' });
          this.listExerciseGroupSetting();
          Toaster(res.data.message, Colors.GREEN_COLOR);
        }
      } catch (error) {
        console.log(error);
      }
      this.setState({ showingSpinner: false });
    }
  };

  deleteExerciseGroupAlert = (action, id, name) => {
    return Alert.alert(
      'Delete Exercise Group',
      'Are you sure you want to delete this exercise group, it will delete all the child exercises, this cannot be undone?',
      [
        { text: 'Cancel' },
        {
          text: 'Yes',
          onPress: () => this.updateExerciseGroup(action, id, name),
        },
      ]
    );
  };

  render() {
    return (
      <ContainerWithoutScrollView
        backFn={() => this.props.navigation.goBack()}
        title='Exercise Groups'>
        <Spinnner visible={this.state.showingSpinner} />
        {this.state.dataLoading ? (
          <Loader />
        ) : (
          <FlatList
            keyboardShouldPersistTaps='handled'
            bounces={false}
            bouncesZoom={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 20 }}
            data={this.state.tableData}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 30,
                  backgroundColor: Colors.BACKGROUND,
                }}>
                <CustomInput
                  mainContainerStyle={{ marginVertical: 10, flex: 1 }}
                  placeholder='Add New Exercise Group'
                  inputStyle={{ fontSize: 11, paddingTop: 12 }}
                  onChangeText={(text) => {
                    this.setState({ exerciseGroupName: text });
                  }}
                  value={this.state.exerciseGroupName}
                />
                <TouchableOpacity
                  onPress={() =>
                    this.updateExerciseGroup(
                      'add',
                      null,
                      this.state.exerciseGroupName
                    )
                  }
                  style={{
                    backgroundColor: Colors.ORANGE,
                    borderRadius: 49 / 2,
                    padding: 2,
                    height: findSize(49),
                    width: findSize(49),
                    marginLeft: 14,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Octicons name='plus' size={32} color={Colors.WHITE_COLOR} />
                </TouchableOpacity>
              </View>
            }
            renderItem={({ item, index }) => (
              <View style={{ marginBottom: 20 }}>
                <ExerciseData
                  item={item}
                  handleExerciseDataInputChange={(text) =>
                    this.handleExerciseDataInputChange(text, index)
                  }
                  onUpdate={(value) => {
                    this.updateExerciseGroup('update', value[1], value[0]);
                  }}
                  onDelete={(value) => {
                    this.deleteExerciseGroupAlert('delete', value[1], value[0]);
                  }}
                />
              </View>
            )}
          />
        )}
      </ContainerWithoutScrollView>
    );
  }
}

export default AdminExerciseGroup;

const ExerciseData = ({
  item,
  handleExerciseDataInputChange,
  onUpdate,
  onDelete,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <CustomInput
        mainContainerStyle={{ flex: 1 }}
        placeholder='Add New Exercise Group'
        inputStyle={{ fontSize: 11, paddingTop: 12 }}
        onChangeText={(text) => {
          handleExerciseDataInputChange(text);
        }}
        value={item[0]}
      />
      <TouchableOpacity
        onPress={() => onUpdate(item)}
        style={{
          backgroundColor: Colors.ORANGE,
          borderRadius: 25 / 2,

          height: findSize(25),
          width: findSize(25),
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 8,
        }}>
        <Ionicons name='checkmark' size={16} color={Colors.WHITE_COLOR} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete(item)}
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
  );
};
