import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import IconDumbbell from "react-native-vector-icons/FontAwesome5";
import PrimeInput from "../../../components/PrimeInput";
import { styles } from "../Pages/TrainingPlan/Weeks.styles";
import Select from "../../../components/Select";
import { Colors } from "../../../constants/Colors";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import IconTrash from "react-native-vector-icons/MaterialCommunityIcons";

const RepetitionPicker = [
  { label: "Repetition", value: "repetition" },
  { label: "Minutes", value: "minutes" },
  { label: "Seconds", value: "seconds" },
];

function CheckBox(props) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View>
        <TouchableOpacity onPress={props.onPress}>
          <View
            style={[
              styles.emptyBox,
              {
                backgroundColor:
                  props.checked === "1" ? Colors.SKY_COLOR : Colors.WHITE_COLOR,
                borderColor:
                  props.checked === "1" ? Colors.SKY_COLOR : Colors.LIGHT_GREY,
              },
            ]}
          >
            {props.checked === "1" && (
              <Icons name="check-bold" color={Colors.WHITE_COLOR} size={25} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function ExerciseSelector(props) {
  return (
    <View>
      <View style={styles.exerciseRow}>
        <Text style={[styles.heads, { marginBottom: 0 }]}>Exercise</Text>
        <PrimeInput
          inputProps={{
            editable: false,
            placeholder: "Select Exercise",
            style: { marginBottom: 0, width: 165 },
            value: props.exerciseName,
          }}
          noAnimation={true}
        />
        <TouchableOpacity
          onPress={props.onDumbbellPress}
          style={styles.updateBtn}
        >
          <IconDumbbell name="dumbbell" color={Colors.WHITE_COLOR} size={20} />
        </TouchableOpacity>
      </View>
      <View>
        <View style={styles.repsRow}>
          <Text style={[styles.heads, { width: 50 }]}>Reps</Text>
          <PrimeInput
            inputProps={{
              onChangeText: (text) => {
                props.onRepsChange(text);
              },
              style: { marginBottom: 15, width: 70 },
              value: props.repsValue,
            }}
            noAnimation={true}
          />
          <Text style={[styles.heads, { width: 130 }]}>Reps Each Side?</Text>
          <CheckBox checked={props.isReps} onPress={props.onRepsCbPress} />
        </View>
        <View style={styles.repsRow}>
          <Text style={[styles.heads, { width: 50 }]}>Load</Text>
          <PrimeInput
            inputProps={{
              onChangeText: (text) => {
                props.onLoadChange(text);
              },
              style: { marginBottom: 15, width: 70 },
              value: props.loadValue,
            }}
            noAnimation={true}
          />
          <Text style={[styles.heads, { width: 130 }]}>Load Required?</Text>
          <CheckBox checked={props.isLoad} onPress={props.onLoadCbPress} />
        </View>
      </View>
      <Text style={[styles.heads]}>Repetition type</Text>
      <Select
        pickerProps={{
          onValueChange: async (value) => {
            props.onValueChange(value);
          },
        }}
        pickerItems={RepetitionPicker}
        pickerValue={props.repetitionType}
      />
      {props.showSetReps && (
        <View style={styles.repsRow}>
          <Text style={[styles.heads, { width: 50 }]}>Sets</Text>
          <PrimeInput
            inputProps={{
              onChangeText: (text) => {
                props.onSetsChange(text);
              },
              style: { marginBottom: 15, width: 70 },
              value: props.setsValue,
            }}
            noAnimation={true}
          />
          <Text style={[styles.heads, { width: 50 }]}>Rest</Text>
          <PrimeInput
            inputProps={{
              onChangeText: (text) => {
                props.onRestChange(text);
              },
              style: { marginBottom: 15, width: 70 },
              value: props.restValue,
            }}
            noAnimation={true}
          />
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          disabled={props.isDisabled}
          onPress={props.onRightPress}
          style={[styles.iconBtn, styles.checkDeleteIcons, styles.checkIcon]}
        >
          <Icons name="check-bold" color={Colors.WHITE_COLOR} size={35} />
        </TouchableOpacity>
        {props.showDelete && (
          <TouchableOpacity
            onPress={props.onDeletePress}
            style={[styles.iconBtn, styles.checkDeleteIcons]}
          >
            <IconTrash name="delete" color={Colors.WHITE_COLOR} size={25} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
