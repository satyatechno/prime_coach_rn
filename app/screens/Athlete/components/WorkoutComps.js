import React, { useState } from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import PrimeButton from "../../../components/PrimeButton";
import PrimeInput from "../../../components/PrimeInput";
import Icon from "react-native-vector-icons/FontAwesome5";
import { styles } from "../Pages/Workouts/Workouts.styles";
import { Colors } from "../../../constants/Colors";
import IconExlam from "react-native-vector-icons/FontAwesome5";
import { POP_REGULAR, ROBO_BOLD } from "../../../constants/Fonts";
import SegmentTab from "react-native-segmented-control-tab";
import TildView from "../../../components/tildView/TildView";
import CustomButton from "../../../components/customButton/CustomButton";
import { DEV_WIDTH } from "../../../constants/DeviceDetails";
import CustomInput from "../../../components/customInput/CustomInput";
import { findHeight, findSize } from "../../../utils/helper";

export const FINAL_WELL = [
  { name: "Fresh" },
  { name: "Sore" },
  { name: "Fatigue" },
  { name: "Sleep" },
];

export function RangePicker(props) {
  return (
    <View>
      <View style={styles.intensityLevel}>
        <Text style={styles.intensityName}>{props.level1}</Text>
        <Text style={styles.intensityName}>{props.level2}</Text>
        <Text style={styles.intensityName}>{props.level3}</Text>
      </View>
      <View style={styles.intensityContainer}>
        {Array.from(Array(10).keys()).map((index) => (
          <View>
            <TouchableOpacity
              onPress={() => props.onItemPress(index)}
              style={[
                styles.scaleBtn,
                props.selected === index + 1 && {
                  backgroundColor: Colors.ORANGE,
                },
              ]}
              disabled={props.selected === index + 1 || props?.disabled}
            >
              <Text style={[styles.scaleTxt]}>{index + 1}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

export function Questionnaire1(props) {
  return (
    <View>
      <TildView degree={"5deg"}>
        <View
          style={{
            padding: 15,
          }}
        >
          <Text style={styles.heads}>How Fresh Do You Feel?</Text>
          <View
            style={{
              backgroundColor: Colors.INPUT_PLACE,
              height: 1,
              width: "100%",
              marginBottom: 15,
            }}
          />
          <RangePicker
            onItemPress={props.onFreshPress}
            selected={props.selectedFreshness}
            level1={"Not Fresh"}
            level2={"Fresh"}
            level3={"Very Fresh"}
          />
        </View>
      </TildView>

      <TildView degree={"5deg"}>
        <View
          style={{
            padding: 15,
          }}
        >
          <Text style={styles.heads}>How Sore Are You?</Text>
          <View
            style={{
              backgroundColor: Colors.INPUT_PLACE,
              height: 1,
              width: "100%",
              marginBottom: 15,
            }}
          />

          <RangePicker
            onItemPress={props.onSorePress}
            selected={props.selectedSoreness}
            level1={"Very Sore"}
            level2={"Sore"}
            level3={"Not Sore"}
          />
        </View>
      </TildView>

      <TildView degree={"5deg"}>
        <View
          style={{
            padding: 15,
          }}
        >
          <Text style={styles.heads}>Fatigue Level</Text>
          <View
            style={{
              backgroundColor: Colors.INPUT_PLACE,
              height: 1,
              width: "100%",
              marginBottom: 15,
            }}
          />

          <RangePicker
            onItemPress={props.onFatiguePress}
            selected={props.selectedFatigue}
            level1={"High"}
            level2={"Medium"}
            level3={"Low"}
          />
        </View>
      </TildView>

      <TildView degree={"5deg"}>
        <View
          style={{
            padding: 15,
          }}
        >
          <Text style={styles.heads}>How Did You Sleep?</Text>
          <View
            style={{
              backgroundColor: Colors.INPUT_PLACE,
              height: 1,
              width: "100%",
              marginBottom: 15,
            }}
          />

          <RangePicker
            onItemPress={props.onSleepPress}
            selected={props.selectedSleep}
            level1={"Not Well"}
            level2={"Well"}
            level3={"Very Well"}
          />
        </View>
      </TildView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CustomButton
          disabled={props?.completedLoading}
          type={2}
          isLoading={props.savingQues}
          style={{
            width: DEV_WIDTH * 0.44,
          }}
          loaderColor={Colors.WHITE_COLOR}
          title={"Submit"}
          onPress={() => {
            props.onSubmit();
          }}
        />
        <CustomButton
          disabled={props.savingQues}
          type={1}
          isLoading={props?.completedLoading}
          style={{
            width: DEV_WIDTH * 0.44,
          }}
          loaderColor={Colors.BACKGROUND}
          title={"Complete Workout"}
          onPress={props.onCompletePress}
        />
      </View>
    </View>
  );
}

export function Questionnaire2(props) {
  return (
    <View>
      <Text style={styles.heads}>What is your body weight?</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <CustomInput
          mainContainerStyle={{ marginBottom: 15 }}
          containerStyle={{ width: DEV_WIDTH * 0.55 }}
          placeholder={props?.selectedTabIndex ? "In Kg" : "In Pound"}
          inputStyle={{ fontSize: 11, paddingTop: 12 }}
          onChangeText={(text) => {
            props.onWeightChange(text);
          }}
          keyboardType="numeric"
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: findHeight(50),
            width: findSize(120),
            backgroundColor: Colors.VALHALLA,
            borderRadius: findHeight(26),
            marginBottom: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.onWeightTypeChange(0);
            }}
            style={{
              backgroundColor: !props?.selectedTabIndex
                ? Colors.ORANGE
                : Colors.BACKGROUND,
              height: findSize(32),
              width: findSize(42),
              borderRadius: 10,
              borderColor: !props?.selectedTabIndex
                ? Colors.ORANGE
                : Colors.WHITE_COLOR,
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 2,
            }}
          >
            <Text
              style={{
                fontSize: findSize(12),
                fontFamily: POP_REGULAR,
                color: Colors.WHITE_COLOR,
              }}
            >
              Lbs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.onWeightTypeChange(1);
            }}
            style={{
              backgroundColor: props?.selectedTabIndex
                ? Colors.ORANGE
                : Colors.BACKGROUND,
              height: findSize(32),
              width: findSize(42),
              borderRadius: 10,
              borderColor: props?.selectedTabIndex
                ? Colors.ORANGE
                : Colors.WHITE_COLOR,
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 2,
            }}
          >
            <Text
              style={{
                fontSize: findSize(12),
                fontFamily: POP_REGULAR,
                color: Colors.WHITE_COLOR,
              }}
            >
              Kg
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.heads}>How many hours did you sleep?</Text>

      <CustomInput
        mainContainerStyle={{ marginBottom: 15 }}
        placeholder={"In Hours"}
        inputStyle={{ fontSize: 11, paddingTop: 12 }}
        onChangeText={(text) => {
          props.onSleepChange(text);
        }}
        keyboardType="numeric"
      />
      <Text style={styles.heads}>How much water have you intake?</Text>

      <CustomInput
        mainContainerStyle={{ marginBottom: 15 }}
        placeholder={"In Liters"}
        inputStyle={{ fontSize: 11, paddingTop: 12 }}
        onChangeText={(text) => {
          props.onWaterChange(text);
        }}
        keyboardType="numeric"
      />

      <CustomButton
        type={1}
        title="Submit"
        isLoading={props.savingQues2}
        onPress={props.onSubmit}
      />
    </View>
  );
}

export function RateIntensity(props) {
  return (
    <View>
      {/* <View style={styles.workCompleteRow}>
        <Text style={styles.workComplete}>Workout Completed</Text>
        <Icon name="check" size={22} color={"green"} />
      </View> */}
      {/* <Text style={[styles.heads]}>
        Please estimate the workout intensity
      </Text>
      <RangePicker
        onItemPress={props.onIntensityPress}
        selected={props.selectedIntensity}
        level1={"low"}
        level2={"medium"}
        level3={"high"}
      /> */}

      <TildView degree={"5deg"}>
        <View
          style={{
            padding: 15,
          }}
        >
          <Text style={styles.heads}>
            Please estimate the workout intensity
          </Text>
          <View
            style={{
              backgroundColor: Colors.INPUT_PLACE,
              height: 1,
              width: "100%",
              marginBottom: 15,
            }}
          />

          <RangePicker
            onItemPress={props.onIntensityPress}
            selected={props.selectedIntensity}
            level1={"Low"}
            level2={"Medium"}
            level3={"High"}
            disabled={props?.showAccomps}
          />
        </View>
      </TildView>

      {/* <PrimeButton
        buttonProps={{
          style: [styles.submitBtn, { backgroundColor: Colors.SKY_COLOR }],
          onPress: props.onSubmit,
        }}
        loading={props.submittingIntensity}
        buttonText={"Submit"}
        indiColor={Colors.WHITE_COLOR}
      /> */}
      {!props?.showAccomps ? (
        <CustomButton
          isLoading={props.submittingIntensity}
          type={1}
          title={"Submit"}
          onPress={() => {
            props.onSubmit();
          }}
        />
      ) : null}
    </View>
  );
}

export function Deload(props) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.deloadTxt}>You should consider Deloading...</Text>
      <IconExlam
        name="exclamation-circle"
        color={Colors.ORANGE_COLOR}
        size={35}
      />
      <PrimeButton
        buttonProps={{
          style: [styles.submitBtn, { backgroundColor: "#5bc0de" }],
          onPress: props.onSubmit,
        }}
        loading={props.saveDeload}
        buttonText={"Submit"}
        indiColor={Colors.WHITE_COLOR}
      />
    </View>
  );
}

export function Hr(props) {
  return <View style={[styles.line, props && props.style]} />;
}

export function RoundOff(num) {
  return parseInt(Math.round(Number(num)));
}
