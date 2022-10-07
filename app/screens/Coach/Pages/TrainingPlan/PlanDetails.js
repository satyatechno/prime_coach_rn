import React, { Component } from "react";
import { Text, StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import Container from "../../../../components/Container";
import { Colors } from "../../../../constants/Colors";
import {
  ROBO_REGULAR,
  ROBO_MEDIUM,
  ROBO_BOLD,
  POP_REGULAR,
  POP_MEDIUM,
} from "../../../../constants/Fonts";
import PrimeInput from "../../../../components/PrimeInput";
import { standardPostApi } from "../../../../api/ApiWrapper";
import DatePicker from "../../../../components/DatePicker";
import Spinnner from "../../../../components/Spinnner";
import AsyncStorage from "@react-native-community/async-storage";
import PrimeButton from "../../../../components/PrimeButton";
import { DEV_WIDTH } from "../../../../constants/DeviceDetails";
import IconTrash from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import Select from "../../../../components/Select";
import Loader from "../../../../components/Loader";
import { Table, Row, TableWrapper, Cell } from "react-native-table-component";
import { findSize, FONT_SIZE } from "../../../../utils/helper";
import CustomButton from "../../../../components/customButton/CustomButton";
import CustomModal from "../../../../components/customModal/CustomModal";
import CustomInput from "../../../../components/customInput/CustomInput";

export const BUTTONS = [
  {
    btnName: "In Season",
    themeColor: "#02A8EF",
    training_type: "in_season",
    displayName: "In Season",
  },
  {
    btnName: "Off Season",
    themeColor: "#5BB85D",
    training_type: "off_season",
    displayName: "Off Season",
  },
  {
    btnName: "Pre Season",
    themeColor: "#E81E16",
    training_type: "pre_season",
    displayName: "Pre Season",
  },
  {
    btnName: "Transition",
    themeColor: "#EFAD4D",
    training_type: "transition",
    displayName: "Transition",
  },
];

const LOCATION_PICKER = {
  pickerArray: [
    { label: "HOME", value: 1 },
    { label: "GYM", value: 2 },
  ],
};

function Hr(props) {
  return <View style={[styles.line, props && props.style]} />;
}

function RemoveBtn(props) {
  return (
    <View style={{ alignSelf: "flex-end" }}>
      <TouchableOpacity onPress={props.onRemove} style={styles.removeBtn}>
        <View style={styles.btnRow}>
          <Text style={styles.btnText}>Delete Program</Text>
          <IconTrash name="delete" color={Colors.RED_COLOR} size={25} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default class PlanDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      planName: "",
      startDate: new Date(),
      endDate: new Date(),
      hasSetEndDate: false,
      hasSetStartDate: false,
      selectedLocation: null,
      updatedLocation: false,
      updatingProgram: false,
      favSport4: 2,
      teamsLoading: true,
      teamPickerData: null,
      tableHead: ["User", ""],
      tableData: [],
      selectedTeam: null,
      modalVisible: false,
    };
    this.showAllTeams();
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc();
  }

  removeProgramAlert = () => {
    Alert.alert(
      "Delete Program",
      "Are you sure you want to delete this program, this cannot be undone?",
      [
        { text: "Cancel" },
        {
          text: "OK",
          onPress: () => this.deleteProgram(),
        },
      ]
    );
  };

  deleteProgram = async () => {
    const { navigation } = this.props;
    const plan_details = navigation.getParam("content");
    this.setState({ updatingProgram: true });
    try {
      const res = await standardPostApi(
        "delete_annual_training_program",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: plan_details.id,
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({ updatingProgram: false });
        this.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
  };

  updateProgram = async () => {
    const { navigation } = this.props;
    const plan_details = navigation.getParam("content");
    const {
      startDate,
      endDate,
      selectedLocation,
      planName,
      hasSetStartDate,
      hasSetEndDate,
      updatedLocation,
    } = this.state;
    const start_date = moment(this.toTimestamp(startDate) * 1000)
      .format("YYYY-MM-DD")
      .toString();
    const end_date = moment(this.toTimestamp(endDate) * 1000)
      .format("YYYY-MM-DD")
      .toString();
    this.setState({ updatingProgram: true });
    if (
      planName.trim().length > 0 ||
      hasSetStartDate ||
      hasSetEndDate ||
      updatedLocation
    ) {
      try {
        const res = await standardPostApi(
          "update_annual_training_program",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            annual_training_program_id: plan_details.id,
            name: planName.trim().length > 0 ? planName : plan_details.name,
            start_date: hasSetStartDate ? start_date : plan_details.start_date,
            end_date: hasSetEndDate ? end_date : plan_details.end_date,
            location: selectedLocation,
          },
          true
        );
        if (res.data.code == 200) {
          this.setState({ updatingProgram: false });
          this.goBack();
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ updatingProgram: false });
  };

  showAllTeams = async () => {
    const { navigation } = this.props;
    const plan_details = navigation.getParam("content");
    this.setState({ teamsLoading: true });
    try {
      const res = await standardPostApi(
        "pre_user_assign_annual_training_program",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: plan_details.id,
        },
        true
      );
      if (res.data.code == 200) {
        let ID =
          res.data.data.Teams.pickerArray.length > 0
            ? res.data.data.Teams.pickerArray[0].id
            : null;
        await this.setState({
          teamsLoading: false,
          teamPickerData: res.data.data.Teams,
          selectedTeam: ID,
        });
        this.listTeamPlayers(this.state.selectedTeam);
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ teamsLoading: false });
  };

  listTeamPlayers = async (teamId) => {
    const { navigation } = this.props;
    const plan_details = navigation.getParam("content");
    this.setState({ updatingProgram: true });
    try {
      const res = await standardPostApi(
        "pre_user_assign_annual_training_program",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: plan_details.id,
          team_id: teamId,
        },
        true
      );
      if (res.data.code == 200) {
        let initial_data = res.data.data.TeamPlayers;
        let table_data = [];
        if (initial_data !== undefined) {
          initial_data.forEach((item) => {
            table_data.push([item.email, item.id, item.already_assigned]);
          });
        }
        this.setState({
          tableData: initial_data !== undefined ? table_data : [],
          updatingProgram: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ updatingProgram: false });
  };

  assignUserToATP = async (userId) => {
    const { navigation } = this.props;
    const plan_details = navigation.getParam("content");
    this.setState({ updatingProgram: true });
    try {
      const res = await standardPostApi(
        "user_assign_annual_training_program",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          annual_training_program_id: plan_details.id,
          user_id: userId,
        },
        true
      );
      if (res.data.code == 200) {
        await this.listTeamPlayers(this.state.selectedTeam);
        this.setState({
          updatingProgram: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ updatingProgram: false });
  };

  render() {
    const { navigation } = this.props;
    const plan_details = navigation.getParam("content");
    console.log("PLAN DETAIL", plan_details);
    const curr_start_date = moment(
      plan_details.start_date,
      "YYYY-MM-DD"
    ).format("DD/MM/YYYY");
    const curr_end_date = moment(plan_details.end_date, "YYYY-MM-DD").format(
      "DD/MM/YYYY"
    );
    const {
      hasSetStartDate,
      hasSetEndDate,
      startDate,
      endDate,
      planName,
      teamsLoading,
      teamPickerData,
      updatingProgram,
      modalVisible,
      selectedLocation,
    } = this.state;
    const element = (data, index) => (
      <TouchableOpacity
        onPress={() => {
          this.assignUserToATP(data[1]);
        }}
        style={[
          styles.assignBtn,
          {
            borderColor: data[2] === 1 ? Colors.LIGHT_RED : Colors.SKY_COLOR,
            backgroundColor: data[2] === 1 ? Colors.LIGHT_RED : Colors.BG_COLOR,
          },
        ]}
      >
        <Text style={styles.btnAssignText}>
          {data[2] === 1 ? "Remove" : "Assign"}
        </Text>
      </TouchableOpacity>
    );
    return (
      <>
        <Container
          backFn={() => this.props.navigation.goBack()}
          title={plan_details?.name}
        >
          <Spinnner visible={updatingProgram} />
          {teamsLoading ? (
            <Loader />
          ) : (
            <View>
              <Text style={styles.title}>NAME</Text>
              <Text style={styles.value}>{plan_details?.name}</Text>
              <Text style={styles.title}>START DATE</Text>
              <Text style={styles.value}>{curr_start_date}</Text>
              <Text style={styles.title}>END DATE</Text>
              <Text style={styles.value}>{curr_end_date}</Text>
              <Text style={styles.title}>LOCATION</Text>
              <Text style={styles.value}>
                {
                  LOCATION_PICKER.pickerArray?.find(
                    (x) => x?.value == plan_details?.location
                  )?.label
                }
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginVertical: 20,
                }}
              >
                <CustomButton
                  type={2}
                  isLoading={false}
                  style={{
                    width: DEV_WIDTH * 0.44,
                    // borderColor: Colors?.RED_COLOR,
                  }}
                  loaderColor={Colors.ORANGE}
                  // textStyle={{ color: Colors.RED_COLOR }}
                  title={"Update Program"}
                  onPress={() => {
                    this.setState({
                      planName: plan_details?.name,
                      startDate: moment(curr_start_date, "DD/MM/YYYY").toDate(),
                      endDate: moment(curr_end_date, "DD/MM/YYYY").toDate(),
                      selectedLocation: parseInt(plan_details?.location),
                      modalVisible: true,
                    });
                  }}
                />
                <CustomButton
                  type={1}
                  isLoading={false}
                  style={{
                    width: DEV_WIDTH * 0.44,
                  }}
                  loaderColor={Colors.BACKGROUND}
                  title={"Delete Program"}
                  onPress={() => {
                    this.removeProgramAlert();
                  }}
                />
              </View>

              <View
                style={{
                  padding: findSize(10),
                  backgroundColor: Colors.VALHALLA,
                  borderRadius: findSize(20),
                  paddingVertical: 30,
                }}
              >
                <View style={styles.btnRowContainer}>
                  {BUTTONS.map((item) => {
                    return (
                      <CustomButton
                        type={1}
                        isLoading={false}
                        style={{
                          width: findSize(85),
                          height: findSize(38),
                          backgroundColor: item.themeColor,
                        }}
                        textStyle={{ fontSize: findSize(11) }}
                        title={item.btnName}
                        onPress={() => {
                          this.props.navigation.navigate("Weeks", {
                            content: {
                              training_type: item.training_type,
                              displayName: item.displayName,
                              planDetails: plan_details,
                            },
                          });
                        }}
                      />
                      // <PrimeButton
                      //   buttonProps={{
                      //     style: [
                      //       styles.borderedBtns,
                      //       {
                      //         borderColor: item.themeColor,
                      //         width: (DEV_WIDTH * 29) / 100,
                      //         marginBottom: 10,
                      //       },
                      //     ],
                      //     onPress: () =>
                      //       this.props.navigation.navigate("Weeks", {
                      //         content: {
                      //           training_type: item.training_type,
                      //           displayName: item.displayName,
                      //           planDetails: plan_details,
                      //         },
                      //       }),
                      //   }}
                      //   buttonText={item.btnName}
                      //   buttonTextProps={{
                      //     style: {
                      //       color: item.themeColor,
                      //     },
                      //   }}
                      // />
                    );
                  })}
                </View>

                <View>
                  <Text style={styles.assignTxt}>Assign Teams / Users</Text>
                  <View
                    style={{
                      height: 1.5,
                      width: "100%",
                      backgroundColor: Colors.WHITE_COLOR,
                      marginBottom: 20,
                    }}
                  />

                  <Select
                    containerStyle={{
                      borderColor: Colors.WHITE_COLOR,
                      borderWidth: 1,
                    }}
                    pickerProps={{
                      onValueChange: async (value) => {
                        await this.setState({ selectedTeam: value });
                        this.listTeamPlayers(value);
                      },
                      style: {
                        backgroundColor: Colors.VALHALLA,
                      },
                    }}
                    pickerItems={teamPickerData?.pickerArray ?? []}
                    pickerValue={this.state.selectedTeam}
                    iosLabel={Colors.WHITE_COLOR}
                    androidBorderColor={Colors.SKY_COLOR}
                    androidLabel={Colors.WHITE_COLOR}
                    androidBgColor={Colors.VALHALLA}
                    iconColor={Colors.WHITE_COLOR}
                  />
                </View>

                <View
                  style={{
                    paddingVertical: 10,
                  }}
                >
                  {this.state.tableData.map((rowData, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        this.assignUserToATP(rowData?.[1]);
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: 5,
                      }}
                    >
                      <View
                        style={{
                          height: 22,
                          width: 22,
                          borderRadius: 11,
                          borderWidth: 1,
                          borderColor:
                            rowData?.[2] == 1
                              ? Colors.ORANGE
                              : Colors.INPUT_PLACE,
                          justifyContent: "center",
                          alignItems: "center",
                          marginHorizontal: 5,
                        }}
                      >
                        {rowData?.[2] == 1 ? (
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
                      <Text style={styles.user}>{rowData?.[0]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* <View style={{ marginBottom: 15 }}>
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
                  {this.state.tableData.map((rowData, index) => {
                    console.log("row data", rowData);

                    return (
                      <TableWrapper key={index} style={styles.row}>
                        {rowData.map((cellData, cellIndex) => (
                          <Cell
                            style={cellIndex === 2 && { width: 0 }}
                            key={cellIndex}
                            data={
                              cellIndex === 1
                                ? element(rowData, index)
                                : cellData
                            }
                            textStyle={styles.text}
                          />
                        ))}
                      </TableWrapper>
                    );
                  })}
                </Table>
              </View> */}
              </View>
            </View>
          )}
        </Container>
        <CustomModal
          isVisible={modalVisible}
          onClose={() => {
            this.setState({
              modalVisible: false,
            });
          }}
        >
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              fontFamily: POP_MEDIUM,
              fontSize: findSize(21),
              textAlign: "center",
            }}
          >
            Update Annual Training Plan
          </Text>
          <CustomInput
            mainContainerStyle={{ marginVertical: 10 }}
            placeholder={"ATP Name"}
            inputStyle={{ fontSize: 11, paddingTop: 12 }}
            onChangeText={(text) => {
              this.setState({ planName: text });
            }}
            value={planName}
          />
          <DatePicker
            dateTimeProps={{
              onChange: async (date) => {
                this.setState({ startDate: date, hasSetStartDate: true });
              },
            }}
            showDarkBg
            currentDate={startDate}
            minDate={new Date("2020-01-01")}
            maxDate={new Date("2050-01-01")}
          />
          <DatePicker
            dateTimeProps={{
              onChange: async (date) => {
                this.setState({ endDate: date, hasSetEndDate: true });
              },
            }}
            showDarkBg
            currentDate={endDate}
            minDate={startDate}
            maxDate={new Date("2050-01-01")}
          />
          <Select
            pickerProps={{
              onValueChange: async (value) => {
                this.setState({ selectedLocation: value });
              },
            }}
            pickerItems={LOCATION_PICKER.pickerArray}
            pickerValue={this.state.selectedLocation}
          />
          <CustomButton
            type={1}
            isLoading={false}
            loaderColor={Colors.BACKGROUND}
            title={"Save"}
            onPress={() => {
              this.updateProgram();
            }}
          />
        </CustomModal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  user: {
    fontSize: findSize(15),
    fontFamily: POP_REGULAR,
    color: Colors.WHITE_COLOR,
  },
  annualTraining: {
    color: Colors.SKY_COLOR,
    fontFamily: ROBO_REGULAR,
    fontSize: 18,
  },
  title: {
    fontSize: findSize(12),
    fontFamily: POP_REGULAR,
    color: Colors.INPUT_PLACE,
    marginTop: 10,
  },
  value: {
    fontSize: findSize(13),
    fontFamily: POP_REGULAR,
    color: Colors.WHITE_COLOR,
  },
  planName: {
    color: Colors.WHITE_COLOR,
    fontSize: 18,
    fontFamily: ROBO_REGULAR,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.WHITE_COLOR,
    marginVertical: 10,
  },
  heads: {
    fontSize: 15,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    marginBottom: 5,
  },
  borderedBtns: {
    // width: (DEV_WIDTH * 40) / 100,
    alignSelf: "center",
    backgroundColor: Colors.BG_COLOR,
    marginTop: 5,
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
  },
  removeBtn: {
    borderWidth: 2,
    borderColor: Colors.RED_COLOR,
    padding: 8,
    width: 160,
    borderRadius: 5,
    marginTop: 10,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btnText: {
    color: Colors.RED_COLOR,
    fontFamily: ROBO_MEDIUM,
    fontSize: FONT_SIZE(16),
  },
  btnRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  assignTxt: {
    fontSize: findSize(15),

    color: Colors.WHITE_COLOR,
    fontFamily: POP_MEDIUM,

    marginTop: 10,
  },
  head: {
    height: 45,
    backgroundColor: Colors.BG_COLOR,
  },
  text: {
    margin: 12,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    backgroundColor: Colors.BG_COLOR,
  },
  assignBtn: {
    width: 80,
    borderRadius: 2,
    alignSelf: "center",
    padding: 5,
    borderWidth: 1,
  },
  btnAssignText: {
    textAlign: "center",
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
  },
});
