import React, { Component, useState } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import HamBurger from '../../../components/HamBurger';
import { Colors } from '../../../constants/Colors';
import AsyncStorage from '@react-native-community/async-storage';
import { standardPostApi } from '../../../api/ApiWrapper';
import { Toaster } from '../../../components/Toaster';
import Loader from '../../../components/Loader';
import { Table, Row, TableWrapper, Cell } from 'react-native-table-component';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconChev from 'react-native-vector-icons/FontAwesome5';
import PrimeInput from '../../../components/PrimeInput';
import PrimeButton from '../../../components/PrimeButton';
import DatePicker from '../../../components/DatePicker';
import * as Animatable from 'react-native-animatable';
import Spinnner from '../../../components/Spinnner';
import Select from '../../../components/Select';
import { styles } from '../Admin/Admin.styles';
import IconPM from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import Modal from 'react-native-modal';
import Webview from 'react-native-webview';

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
            <Icon name="check" size={22} color={Colors.WHITE_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onDelete} style={styles.iconsBtn}>
            <Icon name="delete" size={22} color={Colors.WHITE_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onView} style={styles.iconsBtn}>
            <IconPM name="eyeo" size={22} color={Colors.WHITE_COLOR} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.iconRow, { marginBottom: 5 }]}>
          <TouchableOpacity onPress={props.onAdd} style={styles.iconsBtn}>
            <Icon name="add" size={22} color={Colors.WHITE_COLOR} />
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
export default class ExerciseSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: '0',
      dataLoading: true,
      tableHead: ['Exercise Group', ''],
      tableData: [],
      showexerGroup: false,
      showExercises: false,
      showUserSearch: false,
      firstName: '',
      lastName: '',
      email: '',
      exerciseGroupName: '',
      searchingUsers: false,
      userResults: [],
      showingSpinner: false,
      selectedExerciseGroup: null,
      exerciseGroupItems: [],
      exerciseGroups: [],
      allExercises: [],
      selectToAddExerGroup: null,
      exerciseName: '',
      descriptionText: '',
      videoLink: '',
      expanded: [],
      selectedGroupExercises: [],
      couponName: '',
      creatingForType: 'all',
      couponDuration: 'once',
      couponValidMonths: '',
      couponType: 'amount_off',
      couponCurrency: 'gbp',
      maxRedemptions: null,
      expiryDate: new Date(),
      creatingCoupon: false,
      couponAmount: '',
      couponPercent: '',
      isChecked: false,
      modalVisible: false,
      currentVideo: '',
    };
    this.listExerciseGroupSetting();
  }

  listExerciseGroupSetting = async () => {
    try {
      const res = await standardPostApi(
        'admin_exercise_settings',
        undefined,
        {
          access_token: await AsyncStorage.getItem('@USER_ACCESS_TOKEN'),
          type: 'coach',
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
        await this.setState({
          exerciseGroupItems:
            res.data.data.ExerciseGroupsSelectpicker.pickerArray,
          tableData: table_data,
          exerciseGroups: initial_data,
          allExercises: all_exercises,
          dataLoading: false,
        });

        console.log('admin_exercise_settings response ', res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  verifyExerciseName = (string) => {
    if (!string.trim().length > 0) {
      Toaster('Please provide a name for exercise group.', Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  cudWorkoutExerciseGroup = async (action, exerciseId, exerciseName) => {
    if (this.verifyExerciseName(exerciseName)) {
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
            type: 'coach',
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

  verifyExerciseDetails = (action, data) => {
    const { videoLink, selectToAddExerGroup } = this.state;
    if (action !== 'delete') {
      if (!data?.exerciseName.trim().length > 0) {
        Toaster('Please provide a name for the exercise.', Colors.LIGHT_RED);
        return false;
      }
      if (data?.video.trim().length > 0) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
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

  cudWorkoutExercise = async (action, exerciseId, data) => {
    if (this.verifyExerciseDetails(action, data)) {
      this.setState({ showingSpinner: true });
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
            type: 'coach',
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
            descriptionText: '',
            videoLink: '',
            showingSpinner: false,
          });

          console.log('exercise cud ', res.data.data);
          await this.listExerciseGroupSetting();
          this.setSelectedExercises(this.state.selectedExerciseGroup);
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
          onPress: () => this.cudWorkoutExerciseGroup(action, id, name),
        },
      ]
    );
  };

  toggleExpand = (index) => {
    this.setState({ expanded: [index] });
  };

  setSelectedExercises = async (value) => {
    this.setState({ showingSpinner: true });
    const { exerciseGroups } = this.state;
    exerciseGroups.forEach(async (item) => {
      if (item.id == value) {
        await this.setState({
          selectedGroupExercises: item.exercises,
          showingSpinner: false,
        });
      }
    });
  };

  updateExerciseGroupValues = async (index, field, value) => {
    const { selectedGroupExercises } = this.state;

    selectedGroupExercises[index][field] = value;

    await this.setState({ selectedGroupExercises });
  };

  getId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  convertToIframe = (url) => {
    const videoId = this.getId(url);
    return (
      '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' +
      videoId +
      '" frameborder="0" ></iframe>'
    );
  };
  render() {
    const Buttons = (data, index) => (
      <View>
        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() => {
              this.cudWorkoutExerciseGroup('update', data[1], data[0]);
            }}
            style={styles.iconsBtn}
          >
            <Icon name="check" size={22} color={Colors.WHITE_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.deleteExerciseGroupAlert('delete', data[1], data[0]);
            }}
            style={styles.iconsBtn}
          >
            <Icon name="delete" size={22} color={Colors.WHITE_COLOR} />
          </TouchableOpacity>
        </View>
      </View>
    );
    // const Input = ({ data, index, onChangeText }) => {
    //   var input = data[0];
    //   return (
    //     <View style={{ marginVertical: 5 }}>
    //       <PrimeInput
    //         inputProps={{
    //           onChangeText: (text) => {
    //             onChangeText(text);
    //           },
    //           style: styles.exerGroupInput,
    //           value: data[0],
    //         }}
    //         noAnimation={true}
    //       />
    //     </View>
    //   );
    // };
    const {
      showExercises,
      showexerGroup,
      tableData,
      showUserSearch,
    } = this.state;
    return (
      <HamBurger onMenuPress={() => this.props.navigation.openDrawer()}>
        <Spinnner visible={this.state.showingSpinner} />
        <Text style={styles.home}>Exercise Setting</Text>
        {this.state.dataLoading ? (
          <Loader />
        ) : (
          <View>
            {/* <Text
              style={[styles.home, { fontSize: 18, alignSelf: 'flex-start' }]}
            >
              Exercise Settings
            </Text> */}
            <Chevron
              title={'Exercise Groups'}
              onToggle={() =>
                this.setState({ showexerGroup: !this.state.showexerGroup })
              }
              isExpanded={showexerGroup}
            />
            {showexerGroup && (
              <View>
                <View style={styles.skyBg}>
                  <Text style={styles.skyBoxTitle}>Exercise Groups</Text>
                </View>
                <View style={styles.greyBg}>
                  <View style={{ marginBottom: 0 }}>
                    <View style={styles.addNewGrpRow}>
                      <PrimeInput
                        inputProps={{
                          onChangeText: (text) => {
                            this.setState({ exerciseGroupName: text });
                          },
                          style: styles.addGroupInput,
                          placeholder: 'Add a new Exercise Group',
                          value: this.state.exerciseGroupName,
                        }}
                        noAnimation={true}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          this.cudWorkoutExerciseGroup(
                            'add',
                            null,
                            this.state.exerciseGroupName
                          )
                        }
                        style={[styles.iconsBtn, styles.addIconBtn]}
                      >
                        <Icon name="add" size={22} color={Colors.WHITE_COLOR} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View>
                    <Table
                      borderStyle={{
                        borderColor: Colors.WHITE_COLOR,
                        borderWidth: 1,
                      }}
                    >
                      <Row
                        data={this.state.tableHead}
                        style={styles.head}
                        textStyle={styles.text}
                      />
                      {tableData.map((rowData, index) => (
                        <TableWrapper key={index} style={styles.row}>
                          {/* {tableData[index].map((cellData, cellIndex) => ( */}
                          <Cell
                            // style={cellIndex === 2 && { width: 0 }}
                            key={0}
                            data={
                              <Input
                                data={rowData}
                                index={index}
                                onChangeText={(text) => {
                                  rowData[0] = text;
                                  this.render();
                                }}
                              />
                            }
                            textStyle={styles.text}
                          />
                          <Cell
                            // style={cellIndex === 2 && { width: 0 }}
                            key={1}
                            data={Buttons(rowData, index)}
                            textStyle={styles.text}
                          />
                          {/* )
                          )} */}
                        </TableWrapper>
                      ))}
                    </Table>
                  </View>
                </View>
              </View>
            )}
            <Chevron
              title={'Exercises'}
              onToggle={() =>
                this.setState({ showExercises: !this.state.showExercises })
              }
              isExpanded={showExercises}
            />
            {showExercises && (
              <View>
                <Text style={styles.exrGrpTxt}>Exercise Groups</Text>
                <Select
                  pickerProps={{
                    onValueChange: async (value) => {
                      await this.setState({ selectedExerciseGroup: value });
                      this.setSelectedExercises(value);
                    },
                  }}
                  pickerItems={this.state.exerciseGroupItems}
                  pickerValue={this.state.selectedExerciseGroup}
                />
                <View>
                  <ExerciseGroup
                    pickerItems={this.state.exerciseGroupItems}
                    pickerValue={this.state.selectToAddExerGroup}
                    onAdd={() =>
                      this.cudWorkoutExercise('add', null, {
                        exerciseName: this.state.exerciseName,
                        description: this.state.descriptionText,
                        video: this.state.videoLink,
                        exerciseGroupId: this.state.selectToAddExerGroup,
                      })
                    }
                    exerName={this.state.exerciseName}
                    descriptionValue={this.state.descriptionText}
                    youtubeLink={this.state.videoLink}
                    onValueChange={async (value) => {
                      await this.setState({ selectToAddExerGroup: value });
                    }}
                    onNameChange={async (text) => {
                      await this.setState({ exerciseName: text });
                    }}
                    onDescChange={async (text) =>
                      await this.setState({ descriptionText: text })
                    }
                    onVideoChange={async (text) =>
                      await this.setState({ videoLink: text })
                    }
                  />
                  <Hr />
                  {this.state.selectedGroupExercises.length > 0 &&
                    this.state.selectedGroupExercises.map((item, index) => {
                      const IS_EXPANDED =
                        this.state.expanded.indexOf(item.id) >= 0;
                      return (
                        <Animatable.View animation="fadeIn">
                          <TouchableOpacity
                            style={{ marginBottom: 7 }}
                            onPress={async () =>
                              await this.toggleExpand(item.id)
                            }
                          >
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <IconPM
                                name={
                                  IS_EXPANDED ? 'minuscircleo' : 'pluscircleo'
                                }
                                size={20}
                                color={Colors.SKY_COLOR}
                              />
                              <Text style={styles.exerciseName}>
                                {item.exercise}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          {IS_EXPANDED && (
                            <View>
                              <ExerciseGroup
                                insideList
                                onDelete={() =>
                                  this.deleteExerciseAlert('delete', item.id, {
                                    exerciseName: item?.exercise,
                                    description: item?.description,
                                    video: item?.video,
                                    exerciseGroupId: this.state
                                      .selectedExerciseGroup,
                                  })
                                }
                                onView={() =>
                                  this.setState({
                                    currentVideo: item?.video,
                                    modalVisible: true,
                                  })
                                }
                                exerName={item.exercise}
                                onNameChange={async (text) => {
                                  await this.updateExerciseGroupValues(
                                    index,
                                    'exercise',
                                    text
                                  );
                                }}
                                descriptionValue={item.description}
                                onDescChange={async (text) => {
                                  await this.updateExerciseGroupValues(
                                    index,
                                    'description',
                                    text
                                  );
                                }}
                                youtubeLink={item.video}
                                onVideoChange={async (text) => {
                                  await this.updateExerciseGroupValues(
                                    index,
                                    'video',
                                    text
                                  );
                                }}
                                pickerItems={this.state.exerciseGroupItems}
                                pickerValue={this.state.selectedExerciseGroup}
                                onValueChange={async (value) => {
                                  // await this.updateExerciseGroupValues(
                                  //   index,
                                  //   'video',
                                  //   value
                                  // );
                                  this.setState({
                                    selectedExerciseGroup: value,
                                  });
                                }}
                                onCheck={() =>
                                  this.cudWorkoutExercise('update', item?.id, {
                                    exerciseName: item?.exercise,
                                    description: item?.description,
                                    video: item?.video,
                                    exerciseGroupId: this.state
                                      .selectedExerciseGroup,
                                  })
                                }
                              />
                            </View>
                          )}
                        </Animatable.View>
                      );
                    })}
                </View>
              </View>
            )}
          </View>
        )}
        <Modal
          isVisible={this.state.modalVisible}
          animationIn="slideInUp"
          animationInTiming={800}
          animationOut="slideOutDown"
          animationOutTiming={800}
          hasBackdrop={true}
          swipeDirection="down"
          backdropOpacity={0.5}
          onBackdropPress={() => this.setState({ modalVisible: false })}
          onSwipeComplete={() => this.setState({ modalVisible: false })}
        >
          <View style={styles.errorModalView}>
            <TouchableOpacity
              onPress={() => this.setState({ modalVisible: false })}
            >
              <Icon
                name="close"
                size={25}
                color={Colors.LIGHT_GREY}
                style={{ alignSelf: 'flex-end', marginRight: 10 }}
              />
            </TouchableOpacity>
            <Webview
              allowsFullscreenVideo
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              bounces={false}
              style={styles.webView}
              source={{
                html: this.convertToIframe(this.state.currentVideo),
              }}
            />
          </View>
        </Modal>
      </HamBurger>
    );
  }
}
