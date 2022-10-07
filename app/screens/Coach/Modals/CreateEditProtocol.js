import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Colors } from "../../../constants/Colors";
import Modall from "../../../components/Modall";
import PrimeInput from "../../../components/PrimeInput";
import { POP_REGULAR, ROBO_BOLD } from "../../../constants/Fonts";
import { DEV_WIDTH, DEV_HEIGHT } from "../../../constants/DeviceDetails";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import { standardPostApi } from "../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../../../components/Loader";
import { findSize, FONT_SIZE } from "../../../utils/helper";
import Container from "../../../components/Container";
import CustomInput from "../../../components/customInput/CustomInput";
import CustomButton from "../../../components/customButton/CustomButton";
import Icon from "react-native-vector-icons/AntDesign";

function Hr(props) {
  return <View style={[styles.line, props && props.style]} />;
}

export function CheckBox(props) {
  return (
    <CustomButton disabled={props?.disabled} onPress={props.onPress}>
      <View
        style={[
          styles.emptyBox,
          { backgroundColor: props?.color ?? Colors.VALHALLA },
        ]}
      >
        {props.checked == "1" && (
          <Icons name="check" color={Colors.WHITE_COLOR} size={18} />
        )}
      </View>
    </CustomButton>
  );
}

function Exercise(props) {
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <CustomInput
          containerStyle={{ width: DEV_WIDTH * 0.44 }}
          mainContainerStyle={{ marginVertical: 10 }}
          placeholder={"Exercise"}
          inputStyle={{ fontSize: 11, paddingTop: 12 }}
          onChangeText={props.exerciseTextChange}
          value={props.exerciseName}
        />
        <CustomInput
          containerStyle={{ width: DEV_WIDTH * 0.44 }}
          mainContainerStyle={{ marginVertical: 10 }}
          placeholder={"Units"}
          inputStyle={{ fontSize: 11, paddingTop: 12 }}
          onChangeText={props.unitsTextChange}
          value={props.unitsValue}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <CheckBox checked={props.smaller_better} onPress={props.onCbPress} />
          <Text
            style={{
              color: Colors?.WHITE_COLOR,
              fontSize: 10,
              fontFamily: POP_REGULAR,
              marginStart: findSize(10),
            }}
          >
            Smaller is better?
          </Text>
        </View>
        {props.showAddBtn ? (
          <CustomButton
            style={{
              height: findSize(30),
              width: findSize(30),
              borderRadius: findSize(16),
              justifyContent: "center",
              alignItems: "center",

              backgroundColor: Colors.ORANGE,
            }}
            onPress={props.onAddPress}
          >
            <Icon name="plus" size={18} color={Colors.WHITE_COLOR} />
          </CustomButton>
        ) : (
          <CustomButton
            style={{
              height: findSize(30),
              width: findSize(30),
              borderRadius: findSize(16),
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={props.onRemovePress}
          >
            <Icon name="delete" size={20} color={Colors.RED_COLOR} />
          </CustomButton>
        )}
      </View>
      {/* <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <PrimeInput
          inputProps={{
            onChangeText: props.exerciseTextChange,
            style: styles.inputs,
            value: props.exerciseName,
          }}
          noAnimation={true}
        />
        <PrimeInput
          inputProps={{
            onChangeText: props.unitsTextChange,
            style: styles.inputs,
            value: props.unitsValue,
          }}
          noAnimation={true}
        />
        <CheckBox checked={props.smaller_better} onPress={props.onCbPress} />
        <View>
          <TouchableOpacity
            disabled={!props.showAddBtn}
            onPress={props.onAddPress}
            style={[
              styles.btn,
              {
                backgroundColor: !props.showAddBtn
                  ? Colors.WHITE_COLOR
                  : Colors.SKY_COLOR,
              },
            ]}
          >
            <Icons name="plus" size={25} color={Colors.WHITE_COLOR} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={props.onRemovePress}
            disabled={!props.hasBeenAdded}
            style={[
              styles.btn,
              {
                backgroundColor: !props.hasBeenAdded
                  ? Colors.WHITE_COLOR
                  : Colors.LIGHT_RED,
              },
            ]}
          >
            <Icons name="delete" size={25} color={Colors.WHITE_COLOR} />
          </TouchableOpacity>
        </View>
      </View> */}
    </View>
  );
}

export default class CreateEditProtocol extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addingPlan: false,
      protocolName: "",
      exerciseName: "",
      units: "",
      smaller_better: "0",
      testingProtocolExercises: [],
      protocolsLoading: true,
    };
    this.testingProtocolDetails();
  }

  toggleCheckBox = async () => {
    await this.setState({
      smaller_better: this.state.smaller_better === "1" ? "0" : "1",
    });
  };

  toggleCreatedCheckBox = async (exercise, index) => {
    const { testingProtocolExercises } = this.state;
    const changedCheckbox = testingProtocolExercises.find(
      (cb) => cb.exercise === exercise
    );
    if (changedCheckbox.smaller_better === "1") {
      testingProtocolExercises[index].smaller_better = "0";
    } else {
      testingProtocolExercises[index].smaller_better = "1";
    }
    await this.setState({ testingProtocolExercises });
    console.log("toggleCreatedCheckBox ", this.state.testingProtocolExercises);
  };
  updateExercise = async (exercise, index) => {
    const { testingProtocolExercises } = this.state;

    testingProtocolExercises[index].exercise = exercise;

    await this.setState({ testingProtocolExercises });
    console.log("update exercise ", this.state.testingProtocolExercises);
  };
  updateUnit = async (unit, index) => {
    const { testingProtocolExercises } = this.state;

    testingProtocolExercises[index].units = unit;

    await this.setState({ testingProtocolExercises });
    console.log("update exercise ", this.state.testingProtocolExercises);
  };

  validateProtocolName = () => {
    const { protocolName } = this.state;
    if (!protocolName.trim().length > 0) {
      alert("Please enter a Testing Protocol Name.");
      return false;
    }
    return true;
  };

  checkNonEmptyFields = () => {
    const { exerciseName, units } = this.state;
    if (!exerciseName.trim().length > 0 || !units.trim().length > 0) {
      alert("Please provide a value in both Exercise and Units inputs.");
      return false;
    }
    return true;
  };
  checkValidation = () => {
    const { testingProtocolExercises } = this.state;
    let RETURN = true;
    if (testingProtocolExercises.length == 0) {
      alert("Please add a test");
      RETURN = false;
    }
    for (var i = 0; i < testingProtocolExercises.length; i++) {
      if (
        testingProtocolExercises[i].exercise?.trim().length == 0 ||
        testingProtocolExercises[i].units?.trim().length == 0
      ) {
        alert("Please provide a value in both Exercise and Units inputs.");
        RETURN = false;
        break;
      }
    }
    return RETURN;
  };
  addToTestingProtocolExercises = async () => {
    const { testingProtocolExercises, exerciseName, units, smaller_better } =
      this.state;
    if (this.checkNonEmptyFields()) {
      testingProtocolExercises.push({
        exercise: exerciseName,
        units: units,
        smaller_better: smaller_better,
      });
      await this.setState({
        testingProtocolExercises,
        exerciseName: "",
        units: "",
        smaller_better: "0",
      });
    }
  };

  removeTestingProtocolExercise = async (index) => {
    const { testingProtocolExercises } = this.state;
    testingProtocolExercises.splice(index, 1);
    await this.setState({ testingProtocolExercises });
  };

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.refreshFunc &&
      navigation.state.params.refreshFunc();
  }

  createTestingProtocol = async () => {
    const { navigation } = this.props;
    const { protocolName, testingProtocolExercises } = this.state;
    const teamData = navigation.getParam("content").teamData;
    this.setState({ addingPlan: true });
    if (this.validateProtocolName() && this.checkValidation()) {
      try {
        const res = await standardPostApi(
          "create_testing_protocol",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            testing_protocol: protocolName,
            team_id: teamData.id,
            testing_protocol_exercise: JSON.stringify(testingProtocolExercises),
          },
          true
        );
        if (res.data.code == 200) {
          this.setState({ addingPlan: false });
          this.goBack();
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ addingPlan: false });
  };

  testingProtocolDetails = async () => {
    const { navigation } = this.props;
    const ProtocolData = navigation.getParam("content");
    const teamData = navigation.getParam("content").teamData;
    const protocol_id = navigation.getParam("content").protocol_id;
    if (!ProtocolData.isCreatePage) {
      try {
        const res = await standardPostApi(
          "testing_protocol_details",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            testing_protocol_id: protocol_id,
            team_id: teamData.id,
          },
          true
        );
        if (res.data.code == 200) {
          this.setState({
            testingProtocolExercises: res.data.data.testing_protocol_exercises,
            protocolName: res.data.data.testing_protocol,
            protocolsLoading: false,
          });
          // console.log("testing_protocol_details ", res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ protocolsLoading: false });
  };

  updateTestingProtocol = async () => {
    const { navigation } = this.props;
    const protocol_id = navigation.getParam("content").protocol_id;
    const { testingProtocolExercises, protocolName } = this.state;
    this.setState({ addingPlan: true });
    if (this.validateProtocolName() && this.checkValidation()) {
      try {
        const res = await standardPostApi(
          "update_testing_protocol",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            testing_protocol_id: protocol_id,
            testing_protocol_name: protocolName,
            testing_protocol_exercise: JSON.stringify(testingProtocolExercises),
          },
          true
        );
        if (res.data.code == 200) {
          this.setState({ addingPlan: false });
          this.goBack();
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ addingPlan: false });
  };

  render() {
    const {
      smaller_better,
      testingProtocolExercises,
      exerciseName,
      units,
      addingPlan,
      protocolsLoading,
    } = this.state;
    const { navigation } = this.props;
    const ProtocolData = navigation.getParam("content");
    return (
      <Container
        backFn={() => this.goBack()}
        title={
          ProtocolData.isCreatePage
            ? "Create Testing Protocol"
            : "Edit Testing Protocol"
        }
      >
        <View>
          <CustomInput
            mainContainerStyle={{ marginVertical: 10 }}
            placeholder={"Name"}
            inputStyle={{ fontSize: 11, paddingTop: 12 }}
            onChangeText={(text) => {
              this.setState({ protocolName: text });
            }}
            value={this.state.protocolName}
          />
          <Exercise
            onCbPress={() => this.toggleCheckBox()}
            exerciseTextChange={(text) => this.setState({ exerciseName: text })}
            unitsTextChange={(text) => this.setState({ units: text })}
            onAddPress={() => this.addToTestingProtocolExercises()}
            showAddBtn={true}
            exerciseName={exerciseName}
            unitsValue={units}
            smaller_better={smaller_better}
          />
          {testingProtocolExercises.map((item, index) => {
            return (
              <View>
                <Exercise
                  // smaller_better={smaller_better}
                  onCbPress={() =>
                    this.toggleCreatedCheckBox(item.exercise, index)
                  }
                  exerciseTextChange={(text) =>
                    this.updateExercise(text, index)
                  }
                  unitsTextChange={(text) => this.updateUnit(text, index)}
                  onRemovePress={() => {
                    Alert.alert(
                      "Delete Testing Protocol Test",
                      `Are you sure you want to delete the Exercise "${item?.exercise}" ? This change can be reflect after clicking on save button`,
                      [
                        { text: "Cancel" },
                        {
                          text: "OK",
                          onPress: () =>
                            this.removeTestingProtocolExercise(index),
                        },
                      ]
                    );
                  }}
                  hasBeenAdded={true}
                  showAddBtn={false}
                  exerciseName={item.exercise}
                  unitsValue={item.units}
                  smaller_better={item.smaller_better.toString()}
                />
              </View>
            );
          })}
          <CustomButton
            type={1}
            isLoading={this.state.addingPlan}
            loaderColor={Colors.BACKGROUND}
            title={"Save"}
            onPress={() => {
              ProtocolData.isCreatePage
                ? this.createTestingProtocol()
                : this.updateTestingProtocol();
            }}
          />
        </View>
      </Container>
      // <Modall
      //   crossPress={() => this.goBack()}
      //   savePress={() =>
      //     ProtocolData.isCreatePage
      //       ? this.createTestingProtocol()
      //       : this.updateTestingProtocol()
      //   }
      //   btnTxt={'Save'}
      //   title={
      //     ProtocolData.isCreatePage
      //       ? 'Create Testing Protocol'
      //       : 'Edit Testing Protocol'
      //   }
      //   loading={addingPlan}
      // >
      //   {protocolsLoading && !ProtocolData.isCreatePage ? (
      //     <Loader
      //       loaderProps={{ style: { marginTop: (DEV_HEIGHT * 15) / 100 } }}
      //     />
      //   ) : (
      //     <View>
      //       <Text style={styles.heads}>Name</Text>
      //       <PrimeInput
      //         inputProps={{
      //           onChangeText: (text) => {
      //             this.setState({ protocolName: text });
      //           },
      //           value: this.state.protocolName,
      //           style: {
      //             marginBottom: 15,
      //           },
      //         }}
      //         noAnimation={true}
      //       />
      //       <View style={styles.row}>
      //         <Text style={[styles.colName, { fontSize: FONT_SIZE(13) }]}>
      //           Exercise
      //         </Text>
      //         <Text style={[styles.colName, { fontSize: FONT_SIZE(13) }]}>
      //           Units
      //         </Text>
      //         <Text style={[styles.colName, { fontSize: FONT_SIZE(13) }]}>
      //           Smaller is Better?
      //         </Text>
      //         <View style={{ width: DEV_WIDTH / 5 }} />
      //         <View style={{ width: DEV_WIDTH / 5 }} />
      //         <View style={{ width: DEV_WIDTH / 5 }} />
      //       </View>
      //       <Hr />
      //       <Exercise
      //         onCbPress={() => this.toggleCheckBox()}
      //         exerciseTextChange={(text) =>
      //           this.setState({ exerciseName: text })
      //         }
      //         unitsTextChange={(text) => this.setState({ units: text })}
      //         onAddPress={() => this.addToTestingProtocolExercises()}
      //         showAddBtn={true}
      //         exerciseName={exerciseName}
      //         unitsValue={units}
      //         smaller_better={smaller_better}
      //       />
      //       {testingProtocolExercises.length > 0 && <Hr />}
      //       {testingProtocolExercises.map((item, index) => {
      //         return (
      //           <View>
      //             <Exercise
      //               smaller_better={smaller_better}
      //               onCbPress={() =>
      //                 this.toggleCreatedCheckBox(item.exercise, index)
      //               }
      //               exerciseTextChange={(text) =>
      //                 this.updateExercise(text, index)
      //               }
      //               unitsTextChange={(text) => this.updateUnit(text, index)}
      //               onRemovePress={() => {
      //                 Alert.alert(
      //                   'Delete Testing Protocol Test',
      //                   `Are you sure you want to delete the Exercise "${item?.exercise}" ? This change can be reflect after clicking on save button`,
      //                   [
      //                     { text: 'Cancel' },
      //                     {
      //                       text: 'OK',
      //                       onPress: () =>
      //                         this.removeTestingProtocolExercise(index),
      //                     },
      //                   ]
      //                 );
      //               }}
      //               hasBeenAdded={true}
      //               showAddBtn={false}
      //               exerciseName={item.exercise}
      //               unitsValue={item.units}
      //               smaller_better={item.smaller_better.toString()}
      //             />
      //           </View>
      //         );
      //       })}
      //     </View>
      //   )}
      // </Modall>
    );
  }
}

const styles = StyleSheet.create({
  heads: {
    fontSize: 15,
    fontFamily: ROBO_BOLD,
    marginBottom: 5,
  },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.LIGHT_GREY,
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  colName: {
    fontFamily: ROBO_BOLD,
    width: DEV_WIDTH / 5,
  },
  emptyBox: {
    height: findSize(24),
    width: findSize(24),

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    backgroundColor: Colors.VALHALLA,
  },
  btn: {
    backgroundColor: Colors.INDIGO_COLOR,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 3,
  },
  inputs: {
    width: DEV_WIDTH / 7,
    height: DEV_WIDTH / 7,
    marginBottom: 5,
  },
});
