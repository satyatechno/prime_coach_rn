import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../constants/Colors";
import Modall from "../../../components/Modall";
import Select from "../../../components/Select";
import Picker from "../../../components/Picker";
import { standardPostApi } from "../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import { Toaster } from "../../../components/Toaster";
import { styles } from "../Pages/TrainingPlan/Weeks.styles";
import { Table, Row, TableWrapper, Cell } from "react-native-table-component";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Loader from "../../../components/Loader";

export default class ExercisePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ["Name", ""],
      tableData: [],
      dataLoading: false,
      selectedExerGroup: null,
    };
  }

  fetchExercises = async (exer_grp_id) => {
    const { navigation } = this.props;
    const PlanData = navigation.getParam("content").planData;
    const WeekData = navigation.getParam("content").weekData;
    const DayData = navigation.getParam("content").dayData;
    const WorkoutData = navigation.getParam("content").workoutDetails;
    const WorkoutGroupData = navigation.getParam("content").workoutGroupData;
    this.setState({ dataLoading: true });
    try {
      const res = await standardPostApi(
        "pre_annual_training_program_workout_group_exercise",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: PlanData.planDetails.id,
          training_type: PlanData.training_type,
          annual_training_program_week_id: WeekData.id,
          annual_training_program_week_day_id: DayData.id,
          annual_training_program_workout_id: WorkoutData.id,
          annual_training_program_workout_group_id: WorkoutGroupData.id,
          exercise_group_id: exer_grp_id,
        },
        true,
        true
      );
      if (res.data.code == 301) {
        this.setState({ dataLoading: false });
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        let initial_data = res.data.data.WorkoutExercises;
        let table_data = [];
        initial_data.forEach((item) => {
          table_data.push([item.exercise, item.id]);
        });
        this.setState({
          dataLoading: false,
          tableData: table_data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  goBackWithData = (exercise, id) => {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc(exercise, id);
  };

  render() {
    const { navigation } = this.props;
    const { dataLoading, tableData, tableHead } = this.state;
    const PickerData = navigation.getParam("content").pickerData;
    const element = (data, index) => (
      <TouchableOpacity
        onPress={() => this.goBackWithData(data[0], data[1])}
        style={styles.assignBtn}
      >
        <Icon name="check-bold" color={Colors.WHITE_COLOR} size={20} />
      </TouchableOpacity>
    );
    return (
      <Modall
        btnTxt={"Save"}
        crossPress={() => this.props.navigation.goBack()}
        title={"Select Exercise"}
        hideSaveBtn={true}
      >
        <Text style={styles.exerGrpTxt}>Exercise Groups</Text>
        <Select
          pickerProps={{
            onValueChange: async (value) => {
              this.setState({ selectedExerGroup: value });
              await this.fetchExercises(value);
            },
          }}
          pickerItems={PickerData.pickerArray}
          pickerValue={this.state.selectedExerGroup}
        />
        {dataLoading ? (
          <Loader
            loaderProps={{
              style: {
                marginTop: 150,
              },
            }}
          />
        ) : (
          <View style={{ marginBottom: 25 }}>
            <Table
              borderStyle={{ borderColor: Colors.LIGHT_GREY, borderWidth: 1 }}
            >
              <Row
                data={tableHead}
                style={styles.head}
                textStyle={styles.text}
              />
              {tableData.map((rowData, index) => (
                <TableWrapper key={index} style={styles.row}>
                  {rowData.map((cellData, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      data={
                        cellIndex === 1 ? element(rowData, index) : cellData
                      }
                      textStyle={styles.text}
                    />
                  ))}
                </TableWrapper>
              ))}
            </Table>
          </View>
        )}
      </Modall>
    );
  }
}
