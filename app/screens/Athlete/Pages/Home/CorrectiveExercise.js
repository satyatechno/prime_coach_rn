import AsyncStorage from "@react-native-community/async-storage";
import React, { Component } from "react";
import { Text, View } from "react-native";
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

export class CorrectiveExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      correctExercises: [],
      exercisesLoading: false,
      exercise: undefined,
      modalVisible: false,
    };
  }
  componentDidMount() {
    this.fetchCorrectExercises();
  }
  fetchCorrectExercises = async () => {
    try {
      this.setState({
        exercisesLoading: true,
      });
      const res = await standardPostApi(
        "list_corrective_exercises",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
        },
        true
      );
      console.log("correxctive", res.data.data);
      if (res.data.code == 200) {
        this.setState({
          correctExercises: res.data.data,
          exercisesLoading: false,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        exercisesLoading: false,
      });
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
  render() {
    return (
      <>
        <Container
          backFn={() => this.props.navigation.goBack()}
          title="Corrective Exercise"
        >
          <Spinnner visible={this.state.exercisesLoading} />

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
            {this.state.correctExercises?.map((item) => {
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
                          this.setState({
                            exercise: item,
                            modalVisible: true,
                          });
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
                          Video
                        </Text>
                      </CustomButton>
                    </View>
                  </View>
                </TildView>
              );
            })}
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
            {this.state.exercise?.name}
          </Text>
          {this.state.exercise?.video ? (
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
                  html: this.convertToIframe(this.state.exercise?.video),
                }}
              />
            </View>
          ) : null}
        </CustomModal>
      </>
    );
  }
}

export default CorrectiveExercise;
