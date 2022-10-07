import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Modall from "../../../../components/Modall";
import { DEV_WIDTH, DEV_HEIGHT } from "../../../../constants/DeviceDetails";
import { Colors } from "../../../../constants/Colors";
import { ROBO_MEDIUM, ROBO_REGULAR } from "../../../../constants/Fonts";
import { standardPostApi } from "../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "react-native-vector-icons/Entypo";
import PrimeInput from "../../../../components/PrimeInput";
import { Toaster } from "../../../../components/Toaster";

function Hr(props) {
  return <View style={[styles.line, props && props.style]} />;
}

function Button(props) {
  return (
    <View>
      <TouchableOpacity
        onPress={props.onPress}
        style={[styles.startBtn, props && props.btnStyle]}
      >
        <View style={styles.startCont}>
          <Text style={styles.startTxt}>{props.btnName}</Text>
          <Icon name={props.iconName} size={25} color={Colors.WHITE_COLOR} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default class EmailRecipients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailText: "",
      savedEmails: [],
    };
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      Toaster("Please enter a valid email address.", Colors.LIGHT_RED);
      this.setState({ email: text });
      return false;
    } else {
      this.setState({ email: text });
      return true;
    }
  };

  verifyTotalEmails = () => {
    const { savedEmails } = this.state;
    if (savedEmails.length >= 4) {
      Toaster("You can't have more than 4 email recipients!", Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  verifyDuplicateEmail = () => {
    const { savedEmails, emailText } = this.state;
    let dupItems = savedEmails.filter((item) => {
      return item.emailId === emailText;
    });
    if (dupItems.length > 0) {
      Toaster(
        emailText + " already exists in your recipients list",
        Colors.LIGHT_RED
      );
      return false;
    }
    return true;
  };

  addNewEmail = () => {
    const { emailText, savedEmails } = this.state;
    if (
      this.verifyTotalEmails() &&
      this.validateEmail(emailText) &&
      this.verifyDuplicateEmail()
    ) {
      savedEmails.push({ emailId: emailText });
      this.setState({ savedEmails, emailText: "" });
    }
  };

  removeEmail = async (index) => {
    const { savedEmails } = this.state;
    savedEmails.splice(index, 1);
    this.setState({ savedEmails });
  };

  render() {
    const { savedEmails } = this.state;
    return (
      <Modall
        crossPress={() => this.goBack()}
        savePress={() => {}}
        btnTxt={"Save"}
        title={"Report Email Recipients"}
        hideSaveBtn={true}
        containerProps={{ style: { flex: 3 / 4.3 } }}
      >
        <Text style={styles.exer}>Email Address</Text>
        <Hr />
        <View>
          {savedEmails.map((item, index) => {
            return (
              <View>
                <View style={styles.emailContainer}>
                  <Text numberOfLines={2} style={styles.emailTxt}>
                    {item.emailId}
                  </Text>
                  <Button
                    onPress={() => this.removeEmail(index)}
                    btnName={"Delete"}
                    iconName={"minus"}
                  />
                </View>
                <Hr style={{ borderBottomWidth: 1 }} />
              </View>
            );
          })}
        </View>
        <View>
          <View style={styles.emailContainer}>
            <PrimeInput
              inputProps={{
                onChangeText: (text) => {
                  this.setState({ emailText: text });
                },
                keyboardType: "email-address",
                placeholder: `Email`,
                style: {
                  width: DEV_WIDTH / 2.2,
                },
                value: this.state.emailText,
              }}
              noAnimation={true}
            />
            <Button
              btnStyle={{ backgroundColor: Colors.GREEN_COLOR, width: 125 }}
              btnName={"Add New"}
              iconName={"plus"}
              onPress={() => this.addNewEmail()}
            />
          </View>
        </View>
      </Modall>
    );
  }
}

const styles = StyleSheet.create({
  line: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.LIGHT_GREY,
    marginVertical: 8,
  },
  exer: {
    fontSize: 17,
    color: Colors.BLACK_COLOR,
    fontFamily: ROBO_MEDIUM,
  },
  startBtn: {
    borderRadius: 5,
    padding: 6,
    justifyContent: "center",
    width: 100,
    backgroundColor: Colors.LIGHT_RED,
  },
  startCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  startTxt: {
    fontSize: 18,
    fontFamily: ROBO_MEDIUM,
    color: Colors.WHITE_COLOR,
  },
  emailTxt: {
    color: Colors.BLACK_COLOR,
    fontSize: 16,
    fontFamily: ROBO_REGULAR,
    width: DEV_WIDTH / 2,
  },
  emailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
