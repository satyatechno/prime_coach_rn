import React, { Component, createRef, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Container from "../../../../components/Container";
import IconFont from "react-native-vector-icons/Fontisto";
import Icon from "react-native-vector-icons/AntDesign";
import { Colors } from "../../../../constants/Colors";
import {
  POP_BOLD,
  POP_MEDIUM,
  POP_REGULAR,
  ROBO_MEDIUM,
} from "../../../../constants/Fonts";
import HamBurger from "../../../../components/HamBurger";
import { Toaster } from "../../../../components/Toaster";
import { standardPostApi } from "../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../../../../components/Loader";
import Spinnner from "../../../../components/Spinnner";
import Select from "../../../../components/Select";
import CustomButton from "../../../../components/customButton/CustomButton";
import { findHeight, findSize } from "../../../../utils/helper";
import { DEV_HEIGHT, DEV_WIDTH } from "../../../../constants/DeviceDetails";
import TildView from "../../../../components/tildView/TildView";
import CustomModal from "../../../../components/customModal/CustomModal";
import WebView from "react-native-webview";

const RenderItem = ({ item, onRefresh, navigation, onView }) => {
  const [loading, setloading] = useState(false);
  const onDelete = async (id) => {
    setloading(true);
    try {
      const res = await standardPostApi(
        "alternative_exercise_add_update",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          alternative_exercise_id: id,
          alternative_exercise_name: item?.exercise,
          alternative_exercise_description: item?.description,
          alternative_exercise_video: item?.video,
          api_action: "delete",
        },
        true,
        false
      );
      if (res.data.code == 301) {
        setloading(false);
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        setloading(false);
        console.log("res data", res.data);
        Toaster("Exercise delete successfully", Colors.GREEN_COLOR);
        onRefresh();
      }
    } catch (error) {
      setloading(false);
      console.log(error);
    }
  };
  return (
    <TildView
      tildViewStyle={{
        backgroundColor: Colors.BACKGROUND,
        borderRadius: findSize(15),
      }}
      mainViewStyle={{
        backgroundColor: Colors.TILD_VIEW,
        borderRadius: findSize(15),
      }}
      degree={"5deg"}
      containerStyle={{
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          padding: 5,
        }}
      >
        <View
          style={{
            // backgroundColor: Colors.WHITE_COLOR,
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 3,
          }}
        >
          <Text
            style={{
              fontFamily: POP_MEDIUM,
              color: Colors.WHITE_COLOR,
              fontSize: findSize(17),
              flex: 1,
            }}
          >
            {item?.exercise}
          </Text>
          <TouchableOpacity
            onPress={() => {
              onView();
              //   navigation.navigate("ShowAlternativeExercise", {
              //   content: {
              //     data: item,
              //   },
              // })
            }}
          >
            <Text
              style={{
                fontFamily: POP_MEDIUM,
                color: Colors.ORANGE,
                fontSize: findSize(15),
              }}
            >
              View
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontFamily: POP_REGULAR,
            color: Colors.INPUT_PLACE,
            fontSize: findSize(17),
            marginHorizontal: 10,
          }}
        >
          {item?.exercise_group?.exercise_group}
        </Text>
      </View>
    </TildView>
  );
};
class AlternativeExercise extends Component {
  state = {
    exerciseData: [],
    isLoading: false,
    selectedExerGroup: null,
    groupData: [],
    selectedExercise: null,
    exerciseArray: [],
    alternativeData: [],
    alternativeLoading: false,
    modalVisible: false,
    alternativeExercise: {},
  };
  webViewRef = createRef();
  onLoad = async () => {
    this.setState({ isLoading: true });
    try {
      const res = await standardPostApi(
        "exercise/get_group_exercises",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
        },
        true,
        false
      );

      if (res.data.code == 301) {
        this.setState({ isLoading: false });
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        let pickerData = res.data?.data?.ExerciseGroups?.map((item) => ({
          id: item?.id,
          label: item?.exercise_group,
          value: item?.id,
        }));
        this.setState({
          exerciseData: res.data?.data?.ExerciseGroups,
          groupData: pickerData,
          isLoading: false,
          selectedExerGroup: pickerData?.length ? pickerData?.[0]?.value : null,
        });
        if (pickerData?.length) {
          let tempExer = res.data?.data?.ExerciseGroups[0]?.exercises?.map(
            (item) => ({
              id: item?.id,
              label: item?.exercise,
              value: item?.id,
            })
          );
          this.setState({
            selectedExerGroup: pickerData?.[0]?.value,
            exerciseArray: tempExer,
          });
          if (tempExer?.length)
            this.setState({
              selectedExercise: tempExer?.[0]?.id,
            });
          this.getAlternative(tempExer?.[0]?.id);
        }
      }
    } catch (error) {
      this.setState({ isLoading: false });
      console.log(error);
    }
  };
  getAlternative = async (id) => {
    this.setState({ alternativeLoading: true });
    try {
      const res = await standardPostApi(
        "exercise/get_alternate_exercises",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          exercise_id: id,
        },
        true,
        false
      );

      if (res.data.code == 301) {
        this.setState({ alternativeLoading: false });
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        this.setState({
          alternativeData: res.data?.data?.alternate_exercises,

          alternativeLoading: false,
        });
      }
    } catch (error) {
      this.setState({ alternativeLoading: false });
      console.log(error);
    }
  };
  componentDidMount() {
    this.onLoad();
  }
  onRefresh = () => {
    this.getAlternative(this.state.selectedExercise);
  };
  convertToIframe = (url) => {
    return (
      '<video width="100%" height="100%" controls><source src="' +
      url +
      '" type="video/mp4" /></video>'
    );
  };

  render() {
    const {
      exerciseData,
      isLoading,
      groupData,
      selectedExerGroup,
      exerciseArray,
      selectedExercise,
      alternativeData,
      alternativeLoading,
      alternativeExercise,
    } = this.state;
    console.log("alternativeExercise", alternativeExercise);
    return (
      <>
        <HamBurger onMenuPress={() => this.props.navigation.openDrawer()}>
          <Spinnner visible={alternativeLoading} />
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.heading}>Alternative Exercise</Text>

              <CustomButton
                type={1}
                style={{
                  backgroundColor: Colors.ORANGE,
                  width: findSize(130),
                  height: findHeight(40),
                }}
                title={"Add New Exercise"}
                textStyle={{
                  fontSize: findSize(12),
                }}
                onPress={() =>
                  this.props.navigation.navigate("AddAlternativeExercise", {
                    content: {
                      title: "Add Alternative Exercise",
                      type: "add",
                      refreshFnc: this.onRefresh,
                      group: groupData?.find(
                        (item) => item.id === selectedExerGroup
                      ),
                      exercise: exerciseArray?.find(
                        (item) => item.id === selectedExercise
                      ),
                      groupArray: groupData,
                    },
                  })
                }
              />
            </View>

            {isLoading ? (
              <Loader />
            ) : (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 15,
                  }}
                >
                  <Select
                    containerStyle={{
                      borderColor: Colors.WHITE_COLOR,
                      borderWidth: 1,
                      width: DEV_WIDTH * 0.44,
                      backgroundColor: Colors.BACKGROUND,
                    }}
                    pickerProps={{
                      onValueChange: async (value) => {
                        let temp = exerciseData
                          ?.find((g) => g.id == value)
                          ?.exercises?.map((x) => ({
                            id: x?.id,
                            label: x?.exercise,
                            value: x?.id,
                          }));
                        this.setState({
                          selectedExerGroup: value,
                          exerciseArray: temp,
                          selectedExercise: temp?.length ? temp?.[0]?.id : null,
                        });
                        // await this.fetchExercises(value);
                      },
                    }}
                    pickerItems={groupData}
                    pickerValue={selectedExerGroup}
                    placeholder={"Select Exercise Gorup"}
                    iosLabel={Colors.WHITE_COLOR}
                    androidLabel={Colors.WHITE_COLOR}
                    iconColor={Colors.WHITE_COLOR}
                  />
                  <Select
                    containerStyle={{
                      borderColor: Colors.WHITE_COLOR,
                      borderWidth: 1,
                      width: DEV_WIDTH * 0.44,
                      backgroundColor: Colors.BACKGROUND,
                    }}
                    pickerProps={{
                      onValueChange: async (value) => {
                        this.setState({ selectedExercise: value });
                        if (value !== null) await this.getAlternative(value);
                      },
                    }}
                    pickerItems={exerciseArray}
                    pickerValue={selectedExercise}
                    placeholder={"Select Exercise"}
                    iosLabel={Colors.WHITE_COLOR}
                    androidLabel={Colors.WHITE_COLOR}
                    iconColor={Colors.WHITE_COLOR}
                  />
                </View>

                <View
                  style={{
                    backgroundColor: Colors.VALHALLA,
                    borderRadius: findSize(25),
                    marginTop: 20,
                    padding: 15,
                  }}
                >
                  {alternativeData.length === 0 ? (
                    <View>
                      <Image
                        source={require("../../../../../assets/images/no-event.png")}
                        style={{
                          height: findSize(270),
                          width: findSize(270),
                          marginVertical: findSize(10),
                        }}
                      />
                      <Text
                        style={{
                          color: Colors.WHITE_COLOR,
                          fontFamily: POP_MEDIUM,
                          fontSize: findSize(19),
                          textAlign: "center",
                          marginTop: 5,
                        }}
                      >
                        No Alternative Exercise
                      </Text>
                    </View>
                  ) : (
                    alternativeData.map((item, index) => (
                      <RenderItem
                        item={item}
                        onRefresh={this.onRefresh}
                        navigation={this.props.navigation}
                        key={item?.id?.toString()}
                        onView={() => {
                          this.setState({
                            alternativeExercise: item,
                            modalVisible: true,
                          });
                        }}
                      />
                    ))
                  )}
                </View>
              </>
            )}
          </View>
        </HamBurger>
        <CustomModal
          isVisible={this.state.modalVisible}
          onClose={() => {
            this.webViewRef?.current?.stopLoading();
            this.setState({
              alternativeExercise: {},

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
              marginBottom: 10,
            }}
          >
            View Alternative Exercise
          </Text>

          <Text
            style={{
              color: Colors.INPUT_PLACE,
              fontFamily: POP_REGULAR,
              fontSize: findSize(12),

              marginTop: 10,
            }}
          >
            GROUP
          </Text>
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              fontFamily: POP_REGULAR,
              fontSize: findSize(16),
            }}
          >
            {alternativeExercise?.exercise_group?.exercise_group}
          </Text>
          <Text
            style={{
              color: Colors.INPUT_PLACE,
              fontFamily: POP_REGULAR,
              fontSize: findSize(12),

              marginTop: 8,
            }}
          >
            EXERCISE
          </Text>
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              fontFamily: POP_REGULAR,
              fontSize: findSize(16),
              marginBottom: 10,
            }}
          >
            {alternativeExercise?.exercise}
          </Text>
          <View
            style={{
              height: 200,
              backgroundColor: Colors.VALHALLA,
              overflow: "hidden",
              width: DEV_WIDTH - 80,
            }}
          >
            <WebView
              ref={(o) => (this.webViewRef = o)}
              startInLoadingState={true}
              allowsFullscreenVideo
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              bounces={false}
              style={{
                height: 200,
                backgroundColor: Colors.VALHALLA,
                overflow: "hidden",
                width: DEV_WIDTH - 80,
              }}
              source={{
                // html: this.convertToIframe(alternativeExercise?.video),
                uri: alternativeExercise?.video,
              }}
            />
          </View>
        </CustomModal>
      </>
    );
  }
}
const styles = StyleSheet.create({
  icon: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.BG_COLOR,
  },
  heading: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_MEDIUM,
    fontSize: 21,
  },
  addButton: {
    borderColor: Colors.SKY_COLOR,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: Colors.BG_LIGHT,
    marginVertical: 5,
    color: Colors.WHITE_COLOR,
    fontSize: 16,
  },
  noExercise: {
    flex: 1,
    color: Colors.WHITE_COLOR,
    fontSize: 20,
    textAlign: "center",
    fontFamily: POP_MEDIUM,
  },
});
export default AlternativeExercise;
