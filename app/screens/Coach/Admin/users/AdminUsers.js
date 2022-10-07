import AsyncStorage from "@react-native-community/async-storage";
import React, { Component } from "react";
import {
  Alert,
  FlatList,
  ImageBackground,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Icon from "react-native-vector-icons/Feather";
import { standardPostApi } from "../../../../api/ApiWrapper";
import ContainerWithoutScrollView from "../../../../components/ContainerWithoutScrollView";
import CustomButton from "../../../../components/customButton/CustomButton";
import CustomInput from "../../../../components/customInput/CustomInput";
import CustomModal from "../../../../components/customModal/CustomModal";
import Spinnner from "../../../../components/Spinnner";
import TildView from "../../../../components/tildView/TildView";
import { Toaster } from "../../../../components/Toaster";
import { Colors } from "../../../../constants/Colors";
import { POP_MEDIUM, POP_REGULAR } from "../../../../constants/Fonts";
import { findHeight, findSize } from "../../../../utils/helper";

export class AdminUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingSpinner: false,
      firstName: "",
      lastName: "",
      email: "",
      searchingUsers: false,
      userResults: [],
      isModalVisible: false,
      modalData: null,
      isSecure: true,
    };
  }
  verificationPreSearch = () => {
    const { firstName, lastName, email } = this.state;
    if (
      !firstName.trim().length > 0 &&
      !lastName.trim().length > 0 &&
      !email.trim().length > 0
    ) {
      Toaster(
        "Please enter either a First Name, Last Name or an Email.",
        Colors.LIGHT_RED
      );
      return false;
    }
    return true;
  };
  searchUsers = async () => {
    if (this.verificationPreSearch()) {
      this.setState({ searchingUsers: true });
      try {
        const res = await standardPostApi(
          "admin_user_search",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            first_name: this.state.firstName.trim(),
            last_name: this.state.lastName.trim(),
            email: this.state.email.trim(),
          },
          true,
          false
        );
        if (res.data.code == 301) {
          this.setState({ searchingUsers: false, userResults: [] });
          Toaster(res.data.message, Colors.LIGHT_RED);
        }
        if (res.data.code == 200) {
          this.setState({ searchingUsers: false, userResults: res.data.data });
        }
      } catch (error) {
        console.log(error);
        this.setState({ searchingUsers: false });
      }
    }
  };
  deleteUserAlert = (user_id) => {
    return Alert.alert(
      "Delete User Account",
      "Are you sure you want to delete this user account? This cannot be undone!",
      [
        { text: "Cancel" },
        {
          text: "Yes",
          onPress: () => this.deleteUser(user_id),
        },
      ]
    );
  };
  deleteUser = async (userId) => {
    this.setState({ searchingUsers: true });
    try {
      const res = await standardPostApi(
        "admin_delete_user",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
          user_id: userId,
        },
        true,
        false
      );
      if (res.data.code == 301) {
        this.setState({ searchingUsers: false });
        Toaster(res.data.message, Colors.LIGHT_RED);
      }
      if (res.data.code == 200) {
        let temp = this.state.userResults?.users;
        temp = temp.filter((item) => item.id != userId);
        temp = { users: temp };
        this.setState({ userResults: temp, searchingUsers: false });
      }
    } catch (error) {
      console.log(error);
    }
  };

  verifyPasswords = () => {
    const { newPassword, confirmNewPassword } = this.state?.modalData;
    if (newPassword.length < 8) {
      Toaster(
        "New password should be of at least 8 characters.",
        Colors.LIGHT_RED
      );
      return false;
    } else if (newPassword !== confirmNewPassword) {
      Toaster("Passwords do not match.", Colors.LIGHT_RED);
      return false;
    }
    return true;
  };

  resetUserPassword = async () => {
    if (this.verifyPasswords()) {
      Keyboard.dismiss();
      this.setState({ isModalVisible: false, searchingUsers: true });
      try {
        const res = await standardPostApi(
          "admin_reset_password",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            user_id: this.state.modalData?.id,
            password: this.state.modalData?.confirmNewPassword,
          },
          true,
          false
        );
        if (res.data.code == 301) {
          this.setState({ searchingUsers: false });
          Toaster(res.data.message, Colors.LIGHT_RED);
        }
        if (res.data.code == 200) {
          Toaster(
            `You have successfully reset the password for user ${this.state.modalData?.email}`,
            Colors.GREEN_COLOR
          );
          this.setState({ searchingUsers: false });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  toggleEye = () => {
    return (
      <View>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => this.setState({ isSecure: !this.state.isSecure })}
        >
          <Icon
            name={this.state.isSecure ? "eye-off" : "eye"}
            size={20}
            color={Colors.INPUT_PLACE}
          />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {
      email,
      firstName,
      lastName,
      searchingUsers,
      userResults,
      isModalVisible,
      modalData,
    } = this.state;
    return (
      <>
        <ContainerWithoutScrollView
          backFn={() => this.props.navigation.goBack()}
          title="Users"
        >
          <Spinnner visible={searchingUsers} />

          <FlatList
            decelerationRate={0.9}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            contentContainerStyle={{ paddingBottom: findSize(20) }}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <View>
                <CustomInput
                  mainContainerStyle={{ marginVertical: 10 }}
                  placeholder="First Name"
                  inputStyle={{ fontSize: 11, paddingTop: 12 }}
                  onChangeText={(text) => {
                    this.setState({
                      firstName: text,
                    });
                  }}
                  value={firstName}
                />
                <CustomInput
                  mainContainerStyle={{ marginVertical: 10 }}
                  placeholder="Last Name"
                  inputStyle={{ fontSize: 11, paddingTop: 12 }}
                  onChangeText={(text) => {
                    this.setState({
                      lastName: text,
                    });
                  }}
                  value={lastName}
                />
                <CustomInput
                  keyboardType="email-address"
                  mainContainerStyle={{ marginVertical: 10 }}
                  placeholder="Email Address"
                  inputStyle={{ fontSize: 11, paddingTop: 12 }}
                  onChangeText={(text) => {
                    this.setState({
                      email: text,
                    });
                  }}
                  value={email}
                />
                <CustomButton
                  onPress={this.searchUsers}
                  title="Search"
                  type={1}
                  style={{
                    marginTop: 20,
                  }}
                />
              </View>
            }
            data={userResults?.users}
            renderItem={({ item }) => (
              <UserCard
                item={item}
                onResetPassword={(value) => {
                  this.setState({ modalData: value, isModalVisible: true });
                }}
                onDelete={(value) => this.deleteUserAlert(value.id)}
              />
            )}
            keyExtractor={(item, index) => item?.id?.toString()}
          />
        </ContainerWithoutScrollView>
        <CustomModal
          isVisible={isModalVisible}
          onClose={() =>
            this.setState({ isModalVisible: false, modalData: null })
          }
        >
          <View
            style={{
              backgroundColor: Colors.BACKGROUND,
              paddingTop: 20,
            }}
          >
            <Text
              style={{
                fontFamily: POP_MEDIUM,
                color: Colors.WHITE_COLOR,
                textAlign: "center",
                fontSize: 21,
                paddingBottom: 10,
              }}
            >
              Reset User Password
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: Colors.COMET,
                marginBottom: 30,
              }}
            />

            <View>
              <CustomInput
                mainContainerStyle={{ marginVertical: 10 }}
                placeholder="New Password"
                inputStyle={{ fontSize: 11, paddingTop: 12 }}
                onChangeText={(text) => {
                  this.setState({
                    modalData: {
                      ...modalData,
                      newPassword: text,
                    },
                  });
                }}
                value={modalData?.newPassword}
                secureTextEntry={this.state.isSecure}
              />
              <View
                style={{
                  position: "absolute",
                  // height: findHeight(50),
                  // marginTop: 10,
                  alignSelf: "flex-end",
                  justifyContent: "center",
                  alignItems: "center",
                  bottom: 0,
                  top: 0,
                }}
              >
                {this.toggleEye()}
              </View>
            </View>
            <View>
              <CustomInput
                mainContainerStyle={{ marginVertical: 10 }}
                placeholder="Confirm New Password"
                inputStyle={{ fontSize: 11, paddingTop: 12 }}
                onChangeText={(text) => {
                  this.setState({
                    modalData: {
                      ...modalData,
                      confirmNewPassword: text,
                    },
                  });
                }}
                value={modalData?.confirmNewPassword}
                secureTextEntry={this.state.isSecure}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  top: 0,
                  alignSelf: "flex-end",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {this.toggleEye()}
              </View>
            </View>

            <CustomButton
              onPress={this.resetUserPassword}
              title="Save"
              type={1}
              style={{
                marginTop: 20,
              }}
            />
          </View>
        </CustomModal>
      </>
    );
  }
}

const UserCard = ({ item, onResetPassword, onDelete }) => {
  return (
    <TildView
      degree="4.15deg"
      containerStyle={{
        paddingVertical: 0,
      }}
    >
      <View style={{ padding: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 0.6 }}>
            <Text
              style={{
                fontFamily: POP_REGULAR,
                color: Colors.INPUT_PLACE,
                fontSize: findSize(12),
              }}
            >
              NAME
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: POP_REGULAR,
                  color: Colors.WHITE_COLOR,
                  fontSize: findSize(13),
                  marginEnd: 5,
                }}
                numberOfLines={2}
              >
                {`${item?.first_name} ${item?.last_name}`}
              </Text>
              <ImageBackground
                source={require("../../../../../assets/images/hexagon.png")}
                style={{
                  height: findSize(20),
                  width: findSize(20),
                  justifyContent: "center",
                  alignItems: "center",
                }}
                resizeMode="contain"
              >
                <Text
                  style={{
                    fontFamily: POP_REGULAR,
                    color: Colors.WHITE_COLOR,
                    fontSize: findSize(10),
                    marginTop: 3,
                  }}
                >
                  {item?.role?.toLowerCase() === "athlete" ? "P" : "C"}
                </Text>
              </ImageBackground>
            </View>
          </View>
          <View style={{ alignSelf: "flex-start", flex: 0.5 }}>
            <Text
              style={{
                fontFamily: POP_REGULAR,
                color: Colors.INPUT_PLACE,
                fontSize: findSize(12),
              }}
            >
              EMAIL ADDRESS
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: POP_REGULAR,
                color: Colors.WHITE_COLOR,
                fontSize: findSize(13),
              }}
            >
              {item?.email}
            </Text>
          </View>
        </View>
        {item?.role?.toLowerCase() === "athlete" ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <View style={{ flex: 0.6 }}>
              <Text
                style={{
                  fontFamily: POP_REGULAR,
                  color: Colors.INPUT_PLACE,
                  fontSize: findSize(12),
                }}
              >
                ATP'S
              </Text>
              {item?.assign_atp?.length > 0 ? (
                item?.assign_atp?.map((atp) => (
                  <View>
                    <Text
                      style={{
                        fontFamily: POP_REGULAR,
                        color: Colors.WHITE_COLOR,
                        fontSize: findSize(13),
                        marginRight: 10,
                      }}
                      numberOfLines={2}
                    >
                      {atp?.name}
                    </Text>
                  </View>
                ))
              ) : (
                <Text
                  style={{
                    fontFamily: POP_REGULAR,
                    color: Colors.WHITE_COLOR,
                    fontSize: findSize(13),
                    marginRight: 10,
                  }}
                >
                  N/A
                </Text>
              )}
            </View>
            <View style={{ alignSelf: "flex-start", flex: 0.5 }}>
              <Text
                style={{
                  fontFamily: POP_REGULAR,
                  color: Colors.INPUT_PLACE,
                  fontSize: findSize(12),
                }}
              >
                TEAM NAME
              </Text>

              <Text
                numberOfLines={2}
                style={{
                  fontFamily: POP_REGULAR,
                  color: Colors.WHITE_COLOR,
                  fontSize: findSize(13),
                }}
              >
                {item?.assign_team?.[0]?.name || "N/A"}
              </Text>
            </View>
          </View>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <CustomButton
            onPress={() => {
              onResetPassword(item);
            }}
            title="Reset Password"
            type={1}
            style={{
              alignSelf: "baseline",
              width: "auto",
              paddingHorizontal: 15,
              height: 40,
            }}
          />
          <TouchableOpacity
            onPress={() => onDelete(item)}
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 15,
            }}
          >
            <AntDesign name="delete" size={28} color={Colors.RED_COLOR} />
          </TouchableOpacity>
        </View>
      </View>
    </TildView>
  );
};

export default AdminUsers;
