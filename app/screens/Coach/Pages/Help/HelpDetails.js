import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Container from "../../../../components/Container";
import { Colors } from "../../../../constants/Colors";
import { findHeight, findSize } from "../../../../utils/helper";
import { POP_REGULAR } from "../../../../constants/Fonts";
import { DEV_WIDTH } from "../../../../constants/DeviceDetails";
import TildView from "../../../../components/tildView/TildView";

const Steps = ({ item, index }) => {
  const [height, setHeight] = useState(60);
  const addZero = (i) => {
    let num = i?.toString();
    if (num?.length > 1) {
      return num;
    } else {
      return `0${num}`;
    }
  };
  return (
    <View
      style={{
        flexDirection: "row",
        overflow: "hidden",
        justifyContent: "flex-end",
        paddingVertical: 10,
        marginVertical: 5,
      }}
    >
      <View
        style={{
          height: findSize(60),
          width: (DEV_WIDTH - 40) * 0.14,
          backgroundColor: Colors.ORANGE,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          zIndex: 10,
          left: 0,
        }}
      >
        <Text style={styles.stepText}>STEP</Text>
        <Text style={styles.step}>{addZero(index + 1)}</Text>
      </View>
      <View
        onLayout={(e) => {
          console.log("first", e?.nativeEvent?.layout?.height);
          setHeight(e?.nativeEvent?.layout?.height);
        }}
        style={{
          minHeight: findSize(60),
          width: (DEV_WIDTH - 40) * 0.92,
          backgroundColor: Colors.VALHALLA,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingLeft: (DEV_WIDTH - 40) * 0.08,
        }}
      >
        <Text style={styles.point}>{item?.point} </Text>
        <View>
          <View
            style={[styles.triangleCorner, { borderTopWidth: height * 0.5 }]}
          />
          <View
            style={[
              styles.triangleCornerDown,
              { borderBottomWidth: height * 0.5 },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const HelpDetails = ({ navigation }) => {
  const data = navigation?.getParam("data");
  console.log("data", data);

  return (
    <Container
      backFn={() => {
        navigation?.goBack();
      }}
      title=""
    >
      <Text style={styles.heading}>{data?.title}</Text>
      {data?.title?.includes("How to") ? (
        <View>
          {data?.points?.map((item, index) => (
            <Steps index={index} item={item} />
          ))}
        </View>
      ) : (
        <View>
          <Text
            style={{
              fontSize: findSize(14),
              fontFamily: POP_REGULAR,
              color: Colors.INPUT_PLACE,
            }}
          >
            {data?.points?.[0]?.point}
          </Text>

          <View>
            {data?.subPoint?.map((item, index) => (
              <TildView
                degree="5deg"
                mainViewStyle={{ borderRadius: 10 }}
                tildViewStyle={{ borderRadius: 10 }}
                containerStyle={{
                  paddingBottom: 10,
                  marginBottom: 2,
                }}
              >
                <View style={{ padding: 15 }}>
                  <Text style={styles.subPoint}>{item?.point}</Text>
                </View>
              </TildView>
            ))}
          </View>
        </View>
      )}
    </Container>
  );
};

export default HelpDetails;

const styles = StyleSheet.create({
  heading: {
    color: Colors.WHITE_COLOR,
    fontSize: findSize(24),
    fontFamily: POP_REGULAR,
    marginBottom: 10,
  },
  step: {
    color: Colors.WHITE_COLOR,
    fontSize: findSize(29),
    fontFamily: POP_REGULAR,
    lineHeight: 29,
  },
  stepText: {
    color: Colors.WHITE_COLOR,
    fontSize: findSize(9),
    fontFamily: POP_REGULAR,
    lineHeight: 12,
  },
  point: {
    color: Colors.WHITE_COLOR,
    fontSize: findSize(14),
    fontFamily: POP_REGULAR,
    flex: 1,
    margin: 5,
  },
  subPoint: {
    color: Colors.WHITE_COLOR,
    fontSize: findSize(14),
    fontFamily: POP_REGULAR,
  },
  triangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: findHeight(30),
    borderTopWidth: findHeight(40),
    borderLeftColor: "transparent",
    borderTopColor: Colors.BACKGROUND,
  },
  triangleCornerDown: {
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: findHeight(30),
    borderBottomWidth: findHeight(40),
    borderLeftColor: "transparent",
    borderBottomColor: Colors.BACKGROUND,
  },
});
