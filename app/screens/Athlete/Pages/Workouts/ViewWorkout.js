/*
iOS Simulator File Download Location - 
/Users/pairroxz/Library/Developer/CoreSimulator/Devices/B9CC6D44-6B11-4CB4-8C27-C03C3D0F3BAE/data/Containers/Data/Application/2894DD72-167C-488C-8593-53A17326EEE6/Documents
*/

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Modall from '../../../../components/Modall';
import PrimeButton from '../../../../components/PrimeButton';
import { Colors } from '../../../../constants/Colors';
import { ROBO_MEDIUM, ROBO_REGULAR } from '../../../../constants/Fonts';
import Spinnner from '../../../../components/Spinnner';
import { standardPostApi } from '../../../../api/ApiWrapper';
import AsyncStorage from '@react-native-community/async-storage';
import { Toaster } from '../../../../components/Toaster';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Loader from '../../../../components/Loader';
import { DEV_HEIGHT } from '../../../../constants/DeviceDetails';
import FileViewer from 'react-native-file-viewer';
import ActionSheet from 'react-native-actionsheet';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
function Hr(props) {
  return <View style={[styles.line, props && props.style]} />;
}
export default class ViewWorkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadingPdf: false,
      loadingPdfData: true,
      htmlData: '<h3>No Data Available</h3>',
      exerciseData: [],
      downloadingCSV: false,
    };
    this.exportToPdf();
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  exportToPdf = async () => {
    const { navigation } = this.props;
    const DAY_DETAILS = navigation.getParam('content').dayDetails;
    const PROGRAM_DETAILS = navigation.getParam('content').programDetails;
    const WEEK_DETAILS = navigation.getParam('content').weekDetails;
    await this.setState({ loadingPdfData: true });
    try {
      const res = await standardPostApi(
        'export_workout_to_pdf',
        undefined,
        {
          access_token: await AsyncStorage.getItem('@USER_ACCESS_TOKEN'),
          annual_training_program_id: PROGRAM_DETAILS.id,
          annual_training_program_week_id: WEEK_DETAILS.id,
          annual_training_program_day_id: DAY_DETAILS.id,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        this.setState({ loadingPdfData: false });
        // Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        this.setState({ loadingPdfData: false, htmlData: res.data.data });
      }
    } catch (error) {
      console.log('Error', error);
    }
    this.setState({ loadingPdfData: false });
  };

  // askPermission() {
  //   var that = this;
  //   async function requestExternalWritePermission() {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //         {
  //           title: 'Prime Coach Storage Permission Access Request.',
  //           message: 'Prime Coach needs access to store data in your device.',
  //         }
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         that.createPDF();
  //       } else {
  //         Alert.alert(
  //           'Permission Denied',
  //           'We do not have the permission to download this file to your device.'
  //         );
  //       }
  //     } catch (err) {
  //       that.setState({ downloadingPdf: false });
  //       Alert.alert('Error', 'An Unexpected error occurred, please try again.');
  //       console.warn(err);
  //     }
  //   }
  //   if (Platform.OS === 'android') {
  //     requestExternalWritePermission();
  //   } else {
  //     this.createPDF();
  //   }
  // }

  
  askPermission(index) {
    var that = this;
    async function requestExternalWritePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Prime Coach Storage Permission Access Request.',
            message: 'Prime Coach needs access to store data in your device.',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if (index === 0) {
            that.createPDF();
          } else if (index === 1) {
            that.exportCSV();
          }
        } else {
          Alert.alert(
            'Permission Denied',
            'We do not have the permission to download this file to your device.'
          );
        }
      } catch (err) {
        that.setState({ downloadingPdf: false });
        Alert.alert('Error', 'An Unexpected error occurred, please try again.');
        console.warn(err);
      }
    }
    if (Platform.OS === 'android') {
      requestExternalWritePermission();
    } else {
      console.log('index', index);
      if (index === 0) {
        this.createPDF();
      } else if (index === 1) {
        this.exportCSV();
      }
    }
  }
  async createPDF() {
    await this.setState({ downloadingPdf: true });
    const { navigation } = this.props;
    const DAY_DETAILS = navigation.getParam('content').dayDetails;
    let options = {
      html: this.state.htmlData,
      fileName: `${DAY_DETAILS.day_number} Workout`,
      directory: 'Documents',
    };
    let file = await RNHTMLtoPDF.convert(options);
    await this.setState({ downloadingPdf: false });
    Toaster('Your file has been downloaded.', Colors.GREEN_COLOR);
    console.log(file.filePath);
    setTimeout(() => {
      FileViewer.open(file.filePath)
        .then(() => {
          // success
        })
        .catch((error) => {
          // error
        });
    }, 1000);
  }


  exportCSV = async () => {
    this.setState({ downloadingCSV: true });
    let VALUES = [];
    const { exerciseData } = this.state;

    const { navigation } = this.props;
    const DAY_DETAILS = navigation.getParam('content').dayDetails;

    exerciseData.map((item) => {
      VALUES.push(['', item.group_name, item.group_set_type, '']);
      item?.workout_group_exercise?.map((exer) => {
        VALUES.push([
          exer.workout_exercise_name,
          exer.workout_sets,
          `${exer.workout_reps} ${exer.workout_repetition_type}`,
          exer.workout_rest,
        ]);
      });
    });
    let header_string = 'Exercise,Sets,Reps,Rest\n';
    const rowString = VALUES.map(
      (d) => `${d[0]},${d[1]},${d[2]},${d[3]}\n`
    ).join('');
    const csvString = `${header_string}${rowString}`;
    const pathToWrite = `${RNFetchBlob.fs.dirs.DocumentDir}/${
      DAY_DETAILS.day_number
    } Workout_${moment().format('DD_MM_YYYY_hh_mm_ss')}.csv`;
    console.log('pathToWrite', pathToWrite);
    // pathToWrite /storage/emulated/0/Download/data.csv
    RNFetchBlob.fs
      .writeFile(pathToWrite, csvString, 'utf8')
      .then(() => {
        Toaster('Your file has been downloaded.', Colors.GREEN_COLOR);
        this.setState({ downloadingCSV: false });
        console.log(`wrote file ${pathToWrite}`);

        setTimeout(() => {
          FileViewer.open(pathToWrite)
            .then(() => {
              // success
            })
            .catch((error) => {
              // error
            });
        }, 1000);
        // wrote file /storage/emulated/0/Download/data.csv
      })
      .catch((error) => {
        this.setState({ downloadingCSV: false });
        console.error(error);
      });
  };

  componentDidMount() {
    this.onLoadData();
  }
  onLoadData = async () => {
    const { navigation } = this.props;
    const DAY_DETAILS = navigation.getParam('content').dayDetails;
    const PROGRAM_DETAILS = navigation.getParam('content').programDetails;
    const WEEK_DETAILS = navigation.getParam('content').weekDetails;
    this.setState({ loadingPdfData: true });
    try {
      const res = await standardPostApi(
        'assigned_day_workout_calender',
        undefined,
        {
          access_token: await AsyncStorage.getItem('@USER_ACCESS_TOKEN'),
          annual_training_program_id: PROGRAM_DETAILS.id,
          annual_training_program_week_id: WEEK_DETAILS.id,
          annual_training_program_day_id: DAY_DETAILS.id,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        this.setState({ loadingPdfData: false, exerciseData: res.data.data });
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        this.setState({
          loadingPdfData: false,
          exerciseData: res.data.data[0]?.workout_group,
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({ loadingPdfData: false });
    }
  };
  render() {
    const { navigation } = this.props;
    const { downloadingPdf, loadingPdfData, exerciseData,downloadingCSV } = this.state;
    const DAY_DETAILS = navigation.getParam('content').dayDetails;
    const EXPORT_BTN = navigation.getParam('exportBtn');

    return (
      <>
      <Modall
        containerProps={{ style: { flex: 1 / 1.5 } }}
        title={DAY_DETAILS.day_number}
        hideSaveBtn
        crossPress={() => this.goBack()}
      >
        <Spinnner loaderTxt={'Downloading PDF'} visible={downloadingPdf} />
        <Spinnner loaderTxt={'Downloading CSV'} visible={downloadingCSV} />

        {loadingPdfData ? (
          <Loader
            loaderProps={{ style: { marginTop: (DEV_HEIGHT * 20) / 100 } }}
          />
        ) : (
          <View style={styles.outerBox}>
            {exerciseData?.length !== 0 ? (
              <>
                {EXPORT_BTN==true?<PrimeButton
                  buttonProps={{
                    style: styles.exportBtn,
                    onPress: () => {
                      this.ExportActionSheet.show();
                    },
                  }}
                  buttonText={'Export'}
                  indiColor={Colors.WHITE_COLOR}
                />:null}
                {exerciseData.map((item) => {
                  return (
                    <View style={{ marginVertical: 15 }}>
                      <Text style={styles.groupNamesnTypes}>
                        {item.group_name} - {item.group_set_type}
                        {item.group_set_type !== 'Procedural' && (
                          <Text> - REST {item.group_rest} secs</Text>
                        )}
                      </Text>
                      <Hr />
                      <View style={styles.headRow}>
                        <Text style={styles.tableRow}>Exercise</Text>
                        <Text style={styles.tableRow}>Reps</Text>
                        <Text style={styles.tableRow}>Sets</Text>
                        {item.group_set_type === 'Procedural' && (
                          <Text style={styles.tableRow}>Rest</Text>
                        )}
                      </View>
                      <Hr />
                      <View>
                        {item.workout_group_exercise &&
                          item.workout_group_exercise.map((exer) => {
                            return (
                              <View>
                                <View style={styles.headRow}>
                                  <Text style={styles.exerciseDetailTxt}>
                                    {exer.workout_exercise_name}
                                  </Text>
                                  <Text style={styles.exerciseDetailTxt}>
                                    {exer.workout_reps +
                                      ' ' +
                                      exer.workout_repetition_type.toLowerCase()}
                                    {exer.workout_reps_each_side === 1 && ' ES'}
                                  </Text>
                                  <Text style={styles.exerciseDetailTxt}>
                                    {exer.workout_sets}
                                  </Text>
                                  {item.group_set_type === 'Procedural' && (
                                    <Text style={styles.exerciseDetailTxt}>
                                      {exer.workout_rest} secs
                                    </Text>
                                  )}
                                </View>
                                <Hr />
                              </View>
                            );
                          })}
                      </View>
                    </View>
                  );
                })}
              </>
            ) : (
              <Text
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                No wrokout assigned
              </Text>
            )}
          </View>
        )}
      </Modall>
      <ActionSheet
      ref={(o) => (this.ExportActionSheet = o)}
      options={['PDF', 'CSV', 'Cancel']}
      title={'Export Workout'}
      // destructiveButtonIndex={0}
      cancelButtonIndex={2}
      onPress={(index) => {
        if (index !== 2) {
          this.askPermission(index);
        }
      }}
    />
  </>
    );
  }
}

const styles = StyleSheet.create({
  exportBtn: {
    width: 130,
    alignSelf: 'center',
    backgroundColor: Colors.ORANGE_COLOR,
    height: 38,
    alignSelf: 'flex-start',
    marginVertical: 5,
  },
  outerBox: {
    borderWidth: 1,
    padding: 15,
    borderColor: Colors.LIGHT_GREY,
  },
  groupNamesnTypes: {
    fontSize: 16,
    fontFamily: ROBO_MEDIUM,
    color: Colors.BLACK,
    textAlign: 'center',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#C0C0C0',
    marginVertical: 5,
  },
  tableRow: {
    fontSize: 15,
    color: Colors.BLACK_COLOR,
    fontFamily: ROBO_REGULAR,
    width: 73,
  },
  exerciseDetailTxt: {
    fontSize: 15,
    color: Colors.BLACK_COLOR,
    fontFamily: ROBO_REGULAR,
    marginVertical: 5,
    width: 73,
  },
  headRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
