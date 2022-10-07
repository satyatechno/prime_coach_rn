import AsyncStorage from "@react-native-community/async-storage";
import React, { Component } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import WebView from "react-native-webview";
import { standardPostApi } from "../../../../api/ApiWrapper";
import Container from "../../../../components/Container";
import CustomButton from "../../../../components/customButton/CustomButton";
import CustomModal from "../../../../components/customModal/CustomModal";
import Spinnner from "../../../../components/Spinnner";
import TildView from "../../../../components/tildView/TildView";
import { Colors } from "../../../../constants/Colors";
import { DEV_HEIGHT, DEV_WIDTH } from "../../../../constants/DeviceDetails";
import { POP_MEDIUM, POP_REGULAR } from "../../../../constants/Fonts";
import { findSize } from "../../../../utils/helper";

export class SelfScreening extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exercisesLoading: false,
      exercises: [],
      modalVisible: false,
      screeningData: undefined,
      selectedDysfunctions: [],
      savingSelfScreening: false,
    };
  }
  componentDidMount() {
    this.fetchSelfScreenings();
  }
  fetchSelfScreenings = async () => {
    this.setState({ exercisesLoading: true });
    try {
      const res = await standardPostApi(
        "list_self_screening",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
        },
        true
      );
      console.log("exerciseeeee", JSON.stringify(res.data.data, null, 2));
      if (res.data.code == 200) {
        this.setState({
          exercises: res.data.data,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ exercisesLoading: false });
    }
  };

  checkIfAllFalse = () => {
    const { exercises } = this.state;
    let new_array = [];
    exercises.forEach((item) => {
      if (item.saved_for_user === true) {
        new_array.push(item);
      }
    });
    if (exercises.length === new_array.length) {
      return false;
    } else {
      return true;
    }
  };
  getId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };
  convertToIframe = (url) => {
    console.log("url", url);
    const videoId = this.getId(url);
    return (
      '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' +
      videoId +
      '" frameborder="0" allowFullScreen></iframe>'
    );
  };
  saveSelfScreeningDetails = async () => {
    const { selectedDysfunctions, screeningData } = this.state;
    this.setState({ savingSelfScreening: true });
    try {
      const res = await standardPostApi(
        "save_self_screening",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          screening_id: screeningData.id,
          dysfunctions: JSON.stringify(selectedDysfunctions),
        },
        true
      );
      this.setState({ savingSelfScreening: false, modalVisible: false });
      if (res.data.code == 200) {
        this.fetchSelfScreenings();
      }
    } catch (error) {
      console.log(error);
      this.setState({ savingSelfScreening: false });
    }
  };
  initiateDysFunctionsArray = (item) => {
    const { selectedDysfunctions } = this.state;
    for (let i = 0; i < item?.dysfunction?.length; i++) {
      selectedDysfunctions.push({
        id: item?.dysfunction?.[i]?.id,
        status: 0,
      });
    }
  };

  toggleCheckBox = async (id, index) => {
    const { selectedDysfunctions, screeningData } = this.state;
    const changedCheckbox = screeningData?.dysfunction?.find(
      (cb) => cb.id === id
    );
    changedCheckbox.checked = !changedCheckbox.checked;
    if (changedCheckbox.checked === true) {
      selectedDysfunctions[index].status = 1;
    } else if (changedCheckbox.checked === false) {
      selectedDysfunctions[index].status = 0;
    }
    const checkboxes = Object.assign(
      {},
      screeningData?.dysfunction,
      changedCheckbox
    );
    this.setState({ checkboxes });
  };

  render() {
    const { exercisesLoading, exercises, screeningData } = this.state;
    return (
      <>
        <Container
          backFn={() => this.props.navigation.goBack()}
          title="Self Screening"
        >
          <Spinnner visible={exercisesLoading} />
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              fontFamily: POP_MEDIUM,
              fontSize: findSize(21),
            }}
          >
            Exercise
          </Text>
          <View>
            {true ? (
              exercises.map((item) => {
                // if (item.saved_for_user === false)
                return (
                  <TildView
                    degree="4deg"
                    mainViewStyle={{ borderRadius: 10 }}
                    tildViewStyle={{ borderRadius: 10 }}
                    containerStyle={{ marginVertical: 1 }}
                    key={item.id?.toString()}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 15,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: findSize(15),
                          fontFamily: POP_MEDIUM,
                          color: Colors.WHITE_COLOR,
                        }}
                      >
                        {item?.name}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",

                          justifyContent: "space-between",
                        }}
                      >
                        <CustomButton
                          onPress={() => {
                            // this.props.navigation.navigate("SelfScreen", {
                            //   content: item,
                            //   refreshFunc: () => {
                            //     this.fetchSelfScreenings();
                            //   },
                            // });
                            this.setState({
                              screeningData: item,
                              modalVisible: true,
                            });
                            this.initiateDysFunctionsArray(item);
                          }}
                        >
                          <Text
                            style={{
                              color: Colors.ORANGE,
                              fontFamily: POP_REGULAR,
                              fontSize: findSize(16),
                              padding: 10,
                            }}
                          >
                            Start Screening
                          </Text>
                        </CustomButton>
                      </View>
                    </View>
                  </TildView>
                );
              })
            ) : (
              <View
                style={{
                  height: DEV_HEIGHT * 0.8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: findSize(15),
                    fontFamily: POP_MEDIUM,
                    color: Colors.WHITE_COLOR,
                  }}
                >
                  No exercise available for self screening.
                </Text>
              </View>
            )}
          </View>
        </Container>
        <CustomModal
          isVisible={this.state.modalVisible}
          onClose={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              fontFamily: POP_MEDIUM,
              fontSize: findSize(21),
              modalVisible: 15,
              alignSelf: "center",
            }}
          >
            {screeningData?.name}
          </Text>
          <ScrollView
            style={{
              maxHeight: DEV_HEIGHT * 0.75,
            }}
          >
            <View>
              {screeningData?.video ? (
                <View
                  style={{
                    height: DEV_HEIGHT * 0.25,
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
                      height: DEV_HEIGHT * 0.25,
                      backgroundColor: Colors.VALHALLA,
                      overflow: "hidden",
                      width: DEV_WIDTH - 80,
                    }}
                    source={{
                      html: this.convertToIframe(screeningData?.video),
                    }}
                  />
                </View>
              ) : null}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 15,
                  borderBottomColor: Colors.VALHALLA,
                  borderBottomWidth: 1,
                  paddingBottom: 5,
                  marginBottom: 15,
                }}
              >
                <Text
                  style={{
                    color: Colors.WHITE_COLOR,
                    fontFamily: POP_MEDIUM,
                    fontSize: findSize(16),
                  }}
                >
                  Dysfunction
                </Text>
                <Text
                  style={{
                    color: Colors.WHITE_COLOR,
                    fontFamily: POP_MEDIUM,
                    fontSize: findSize(16),
                  }}
                >
                  Applies?
                </Text>
              </View>
              {screeningData?.dysfunction.map((item, index) => {
                return (
                  <CheckBoxComponent
                    dysfunction={item.name}
                    image={item.image}
                    checked={item.checked}
                    onPress={() => this.toggleCheckBox(item.id, index)}
                  />
                );
              })}
              <CustomButton
                isLoading={this.state.savingSelfScreening}
                type={1}
                title={"Save"}
                onPress={() => {
                  this.saveSelfScreeningDetails();
                }}
              />
            </View>
          </ScrollView>
        </CustomModal>
      </>
    );
  }
}

function CheckBoxComponent({ dysfunction, image, checked, onPress }) {
  return (
    <CustomButton onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
          {image?.length ? (
            <Image
              source={{ uri: image }}
              style={{ height: 34, width: 34, borderRadius: 5 }}
              resizeMode="contain"
            />
          ) : null}
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              fontFamily: POP_REGULAR,
              fontSize: findSize(14),
              flex: 1,

              marginStart: 8,
            }}
          >
            {dysfunction}
          </Text>
        </View>
        <View>
          <View
            style={{
              height: 22,
              width: 22,
              borderRadius: 11,
              borderWidth: 1,
              borderColor: checked ? Colors.ORANGE : Colors.INPUT_PLACE,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 5,
            }}
          >
            {checked ? (
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
        </View>
      </View>
    </CustomButton>
  );
}

export default SelfScreening;
