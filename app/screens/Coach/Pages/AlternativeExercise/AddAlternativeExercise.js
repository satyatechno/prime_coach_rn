import AsyncStorage from "@react-native-community/async-storage";
import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  standardPostApi,
  standardPostApiJsonBased,
} from "../../../../api/ApiWrapper";
import Modall from "../../../../components/Modall";
import { Toaster } from "../../../../components/Toaster";
import { Colors } from "../../../../constants/Colors";
import Select from "../../../../components/Select";
import Spinnner from "../../../../components/Spinnner";
import { POP_REGULAR, ROBO_BOLD } from "../../../../constants/Fonts";
import MultiSelect from "react-native-multiple-select";
import Modal from "react-native-modal";
import { DEV_HEIGHT } from "../../../../constants/DeviceDetails";
import Container from "../../../../components/Container";
import { findSize } from "../../../../utils/helper";
import CustomButton from "../../../../components/customButton/CustomButton";

export class AddAlternativeExercise extends Component {
  state = {
    relatedExerciseGroup: null,
    isLoading: false,
    addLoading: false,
    selectedItems: [],
    isVisible: false,
    exerciseData: [],
  };
  goBack = () => {
    const Param = this.props.navigation.getParam("content");
    this.props.navigation.goBack();
    Param?.refreshFnc();
  };
  // componentDidMount() {
  //   const Param = this.props.navigation.getParam('content');
  //   if (Param?.type === 'edit') {
  //     this.setState({
  //       exerciseName: Param?.data?.exercise,
  //       description: Param?.data?.description,
  //       videoLink: Param?.data?.video,
  //       exerciseId: Param?.data?.id,
  //       reps: Param?.data?.alt_repetition,
  //       load: Param?.data?.alt_load,
  //       eachSideReps: Param?.data?.alt_repetition_each_side,
  //       loadRequired: Param?.data?.alt_load_required,
  //       repetitionType: Param?.data?.alt_repetition_type,
  //       sets: Param?.data?.alt_sets,
  //       rest: Param?.data?.alt_rest,
  //     });
  //   }
  // }
  componentDidMount() {
    const Param = this.props.navigation.getParam("content");

    this.setState({ relatedExerciseGroup: Param?.group?.id });
  }
  verifyExerciseDetails = () => {
    const { selectedItems } = this.state;

    if (!selectedItems?.length) {
      Toaster("Please select an exercise.", Colors.LIGHT_RED);
      return false;
    }

    return true;
  };
  onSave = async () => {
    const { selectedItems } = this.state;
    const Param = this.props.navigation.getParam("content");
    if (this.verifyExerciseDetails()) {
      this.setState({ addLoading: true });
      try {
        const res = await standardPostApiJsonBased(
          "exercise/create_alternate_exercises",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            exercise_id: Param?.exercise?.id,
            alternate_exercise_ids: selectedItems,
          },
          true,
          false
        );
        if (res.data.code == 301) {
          this.setState({ addLoading: false });
          Toaster(res.data.message, Colors.LIGHT_RED);
        }
        if (res.data.code == 200) {
          console.log("res data", res.data.data);
          this.setState({ addLoading: false });
          Toaster(res.data.message, Colors.GREEN_COLOR);
          this.goBack();
        }
      } catch (error) {
        this.setState({ addLoading: false });
        console.log(error);
      }
    }
  };
  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
  };
  getExercise = async (id) => {
    const Param = this.props.navigation.getParam("content");

    this.setState({ isLoading: true });
    try {
      const res = await standardPostApi(
        "exercise/get_exercises",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          exercise_id: Param?.exercise?.id,
          exercise_group_id: id,
        },
        true,
        false
      );

      if (res.data.code == 301) {
        this.setState({ isLoading: false });
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        this.setState({
          exerciseData: res.data?.data?.exercises,

          isLoading: false,
        });
      }
    } catch (error) {
      this.setState({ isLoading: false });
      console.log(error);
    }
  };
  render() {
    const {
      isLoading,
      relatedExerciseGroup,
      selectedItems,
      exerciseData,
      addLoading,
    } = this.state;
    const Param = this.props.navigation.getParam("content");
    console.log("idsss", Param?.exercise?.id, selectedItems);
    return (
      <>
        <Spinnner visible={isLoading} />
        <Container
          backFn={() => this.props.navigation.goBack()}
          title="Add Alternative Exercise"
          // crossPress={() => this.props.navigation.goBack()}
          // savePress={() => this.onSave()}
          // btnTxt={'Save'}
          // title={Param?.title}
          // containerProps={{ style: { flex: 3 / 4, marginVertical: 25 } }}
          // loading={addLoading}
        >
          <Text style={stylesheet.heading}>GROUP</Text>
          <Text style={stylesheet.subHeading}>{Param?.group?.label}</Text>
          <Text style={stylesheet.heading}>EXERCISE</Text>
          <Text style={stylesheet.subHeading}>{Param?.exercise?.label}</Text>
          <View style={{ marginTop: 20 }}>
            <Select
              pickerProps={{
                onValueChange: async (value) => {
                  this.setState({
                    relatedExerciseGroup: value,
                    selectedItems: [],
                  });
                  await this.getExercise(value);
                },
              }}
              pickerItems={Param?.groupArray ?? []}
              pickerValue={relatedExerciseGroup}
              placeholder={"Select Exercise Group"}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isVisible: true });
              }}
              style={{
                height: 40,
                top: 2,
                position: "absolute",
                zIndex: 1000,
                width: "100%",
              }}
            />
            <Select
              pickerProps={{
                onValueChange: async (value) => {},
                disabled: true,
              }}
              placeholderStyle={{
                color: selectedItems?.length
                  ? Colors.WHITE_COLOR
                  : Colors.INPUT_PLACE,
              }}
              pickerItems={[]}
              pickerValue={null}
              placeholder={
                selectedItems?.length
                  ? selectedItems?.length + " Selected"
                  : "Select Exercise"
              }
            />
          </View>

          <CustomButton
            type={1}
            isLoading={addLoading}
            onPress={() => {
              this.onSave();
            }}
            title="Save"
          />
          <Modal
            onBackButtonPress={() => this.setState({ isVisible: false })}
            isVisible={this.state.isVisible}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.WHITE_COLOR,
                padding: 10,
              }}
            >
              <MultiSelect
                hideTags
                items={exerciseData}
                uniqueKey="id"
                ref={(component) => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectedItems={selectedItems}
                selectText="Select Exercise"
                searchInputPlaceholderText="Search"
                onChangeInput={(text) => console.log(text)}
                altFontFamily="ProximaNova-Light"
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="exercise"
                searchInputStyle={{ color: "#CCC" }}
                submitButtonColor="#CCC"
                submitButtonText="Submit"
                hideSubmitButton={true}
                flatListProps={{ style: { height: DEV_HEIGHT * 0.7 } }}
                styleMainWrapper={{ height: DEV_HEIGHT * 0.8 }}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.SKY_COLOR,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 150,
                  height: 40,
                  borderRadius: 8,
                  alignSelf: "center",
                }}
                onPress={() => this.setState({ isVisible: false })}
              >
                <Text style={{ color: Colors.WHITE_COLOR }}>Done</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Container>
      </>
    );
  }
}

const stylesheet = StyleSheet.create({
  exerciseText: {
    color: Colors.BLACK_COLOR,
    fontSize: 17,
    fontFamily: ROBO_BOLD,
  },
  heading: {
    color: Colors.INPUT_PLACE,
    fontFamily: POP_REGULAR,
    fontSize: findSize(12),

    marginTop: 20,
  },
  subHeading: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_REGULAR,
    fontSize: findSize(16),
  },
});
export default AddAlternativeExercise;
