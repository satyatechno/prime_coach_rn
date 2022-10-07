import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Container from "../../../../../components/Container";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomInput from "../../../../../components/customInput/CustomInput";
import { findSize } from "../../../../../utils/helper";
import { DEV_WIDTH } from "../../../../../constants/DeviceDetails";
import moment from "moment";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { Colors } from "../../../../../constants/Colors";
import CustomButton from "../../../../../components/customButton/CustomButton";
import { Toaster } from "../../../../../components/Toaster";
import { standardPostApi } from "../../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import { POP_MEDIUM } from "../../../../../constants/Fonts";
const AddEvent = ({ navigation }) => {
  const teamId = navigation.getParam("teamId");
  const userId = navigation.getParam("userId");
  const date = navigation.getParam("date");
  const onLoadData = navigation.getParam("onLoadData");
  const event = navigation.getParam("event");

  const [showClock, setShowClock] = useState(false);
  const [showEndClock, setShowEndClock] = useState(false);
  const [time, setTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventActionType, setEventActionType] = useState("add");
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    if (event?.id) {
      setEventId(event?.id);
      setName(event?.event_name);
      setTime(moment(event?.event_time, "HH:mm:ss").toDate());
      setEndTime(moment(event?.event_end_time, "HH:mm:ss").toDate());
      setDescription(event?.event_description);
    }
  }, [event]);

  const verifyDetails = (eventActionType) => {
    let Time = moment(time).format("HH:mm:ss");
    const StartTimeStamp = moment(date + " " + Time, "YYYY-MM-DD HH:mm:ss")
      .toDate()
      .getTime();
    let EndTime = moment(endTime).format("HH:mm:ss");
    const EndTimeStamp = moment(date + " " + EndTime, "YYYY-MM-DD HH:mm:ss")
      .toDate()
      .getTime();
    if (!name.trim().length > 0 && eventActionType !== "delete") {
      Toaster("Please provide a name for the event.", Colors.LIGHT_RED);
      return false;
    }

    if (!description.trim().length > 0 && eventActionType !== "delete") {
      Toaster("Please provide description.", Colors.LIGHT_RED);
      return false;
    }
    if (eventActionType !== "delete") {
      if (StartTimeStamp < moment().toDate().getTime()) {
        Toaster("You cannot add an event for an older time.", Colors.LIGHT_RED);
        return false;
      }
    }
    if (eventActionType !== "delete") {
      if (EndTimeStamp < StartTimeStamp) {
        Toaster("End time can not be older than start time.", Colors.LIGHT_RED);
        return false;
      }
    }

    return true;
  };
  const onAddEvent = async (action) => {
    setEventActionType(action);
    if (verifyDetails(action)) {
      setLoading(true);
      try {
        const res = await standardPostApi(
          "calendar_events_add_update",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            ...(teamId
              ? { assigned_team_id: teamId }
              : { assigned_user_id: userId }),
            event_id: eventId,
            event_name: name,
            event_description: description,
            event_date: moment(date).format("YYYY-MM-DD"),
            event_time: moment(time).format("HH:mm:ss"),
            event_end_time: moment(endTime).format("HH:mm:ss"),
            api_action: action,
          },
          true,
          false
        );
        if (res.data.code == 301) {
          Toaster(res.data.message, Colors.LIGHT_RED);
          setLoading(false);
          setName("");
          setDescription("");
          setTime(new Date());
          setEndTime(new Date());
          setEventId(null);
          navigation?.goBack();
        }
        if (res.data.code == 200) {
          setLoading(false);
          setName("");
          setDescription("");
          setTime(new Date());
          setEndTime(new Date());
          setEventId(null);
          Toaster(res.data.message, Colors.GREEN_COLOR);
          navigation?.goBack();
          onLoadData(
            moment(date, "YYYY-MM-DD").toDate().getMonth() + 1,
            moment(date, "YYYY-MM-DD").toDate().getFullYear()
          );
        }
      } catch (error) {
        this.setState({ addEventLoading: false });
        console.log(error);
      }
    }
  };

  return (
    <>
      <Container backFn={() => navigation.goBack()} title="Add Event">
        <Text
          style={{
            fontFamily: POP_MEDIUM,
            fontSize: findSize(21),
            color: Colors.WHITE_COLOR,
            textAlign: "center",
            marginVertical: 10,
          }}
        >
          {moment(date, "YYYY-MM-DD").format("DD MMMM YYYY")}
        </Text>
        <CustomInput
          mainContainerStyle={{ marginVertical: 10 }}
          placeholder={"Event Name"}
          inputStyle={{ fontSize: 11, paddingTop: 12 }}
          onChangeText={(text) => {
            setName(text);
          }}
          value={name}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomInput
            mainContainerStyle={{ marginVertical: 10 }}
            placeholder={"Start Time"}
            inputStyle={{ fontSize: 11, paddingTop: 12 }}
            onChangeText={(text) => {
              //   setName(text);
            }}
            containerStyle={{ width: DEV_WIDTH * 0.44 }}
            value={moment(time).format("hh:mm A")}
            isTouchable={true}
            onPress={() => {
              setShowClock(true);
            }}
            icon={() => (
              <EvilIcons name="clock" color={Colors.WHITE_COLOR} size={20} />
            )}
          />
          <CustomInput
            mainContainerStyle={{ marginVertical: 10 }}
            placeholder={"End Time"}
            inputStyle={{ fontSize: 11, paddingTop: 12 }}
            onChangeText={(text) => {
              //   setName(text);
            }}
            onPress={() => {
              setShowEndClock(true);
            }}
            containerStyle={{ width: DEV_WIDTH * 0.44 }}
            value={moment(endTime).format("hh:mm A")}
            isTouchable={true}
            icon={() => (
              <EvilIcons name="clock" color={Colors.WHITE_COLOR} size={20} />
            )}
          />
        </View>
        <CustomInput
          mainContainerStyle={{ marginVertical: 10 }}
          placeholder={"Description"}
          inputStyle={{ fontSize: 11, paddingTop: 12 }}
          onChangeText={(text) => {
            setDescription(text);
          }}
          value={description}
        />
        {eventId == null ? (
          <CustomButton
            type={1}
            isLoading={loading}
            loaderColor={Colors.BACKGROUND}
            title={"Save"}
            onPress={() => {
              onAddEvent("add");
            }}
          />
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CustomButton
              type={1}
              disabled={loading}
              isLoading={loading && eventActionType === "update"}
              style={{
                width: DEV_WIDTH * 0.44,
              }}
              loaderColor={Colors.BACKGROUND}
              title={"Save"}
              onPress={() => {
                onAddEvent("update");
              }}
            />
            <CustomButton
              type={2}
              disabled={loading}
              isLoading={loading && eventActionType === "delete"}
              style={{
                width: DEV_WIDTH * 0.44,
                borderColor: Colors?.RED_COLOR,
              }}
              loaderColor={Colors.RED_COLOR}
              textStyle={{ color: Colors.RED_COLOR }}
              title={"Delete"}
              onPress={() => {
                Alert.alert(
                  "Delete Event",
                  "Are you sure you want to delete this event?",
                  [
                    { text: "Cancel", style: "cancel" },

                    {
                      text: "Delete",
                      onPress: () => onAddEvent("delete"),
                      style: "destructive",
                    },
                  ]
                );
              }}
            />
          </View>
        )}
      </Container>
      {showClock && (
        <DateTimePicker
          value={time}
          onChange={(event, t) => {
            if (t !== undefined) {
              setTime(t);
              setShowClock(false);
            } else {
              setShowClock(false);
            }
          }}
          mode={"time"}
          is24Hour={true}
          display="clock"
        />
      )}
      {showEndClock && (
        <DateTimePicker
          value={endTime}
          onChange={(event, t) => {
            if (t !== undefined) {
              setEndTime(t);
              setShowEndClock(false);
            } else {
              setShowEndClock(false);
            }
          }}
          mode={"time"}
          is24Hour={true}
          display="clock"
        />
      )}
    </>
  );
};

export default AddEvent;

const styles = StyleSheet.create({});
