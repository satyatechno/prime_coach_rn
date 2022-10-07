import {
  Alert,
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Container from "../../../../components/Container";
import { findSize } from "../../../../utils/helper";
import { Colors } from "../../../../constants/Colors";
import { POP_REGULAR } from "../../../../constants/Fonts";
import CustomButton from "../../../../components/customButton/CustomButton";
import CustomInput from "../../../../components/customInput/CustomInput";
import Select from "../../../../components/Select";
import DatePicker from "../../../../components/DatePicker";
import moment from "moment";
import {
  standardPostApi,
  standardPostApiJsonBased,
  uploadVideoOnServer,
} from "../../../../api/ApiWrapper";
import { EventRegister } from "react-native-event-listeners";
import { Toaster } from "../../../../components/Toaster";
import CustomModal from "../../../../components/customModal/CustomModal";
import ImageCropPicker from "react-native-image-crop-picker";
import AsyncStorage from "@react-native-community/async-storage";
const GenderDta = [
  { id: 1, label: "Male", value: "male" },
  { id: 2, label: "Female", value: "female" },
  { id: 3, label: "Other", value: "other" },
];
const EditProfile = ({ navigation }) => {
  const userProfile = navigation.getParam("userProfile");
  const coachSpec = navigation.getParam("coachSpec");
  const refresh = navigation.getParam("refresh");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [DOB, setDOB] = useState(new Date());
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [specialization, setSpecialization] = useState(null);
  const [gender, setGender] = useState("male");
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [ImageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    if (userProfile?.id) {
      let specialisationTemp = coachSpec?.pickerArray?.find(
        (x) => x.label === userProfile?.specialization
      );
      setFirstName(userProfile?.first_name);
      setLastName(userProfile?.last_name);

      setAddress(userProfile?.address);
      setEmail(userProfile?.email);
      setMobile(userProfile?.phone);
      setHeight(userProfile?.height);
      setWeight(userProfile?.body_weight);
      setGender(userProfile?.gender);

      setDOB(moment(userProfile?.dob, "YYYY-MM-DD").toDate());
      setProfileImage(userProfile?.profile_image);
    }
  }, []);

  const checkValidation = () => {
    var regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const dob = new Date(DOB);
    const today = new Date();

    if (!firstName?.trim()?.length) {
      Toaster("First Name is required.", Colors.LIGHT_RED);
      return false;
    } else if (!lastName?.trim()?.length) {
      Toaster("Last Name is required.", Colors.LIGHT_RED);
      return false;
    } else if (!mobile?.trim()?.length) {
      Toaster("Phone number is required.", Colors.LIGHT_RED);
      return false;
    } else if (!regex.test(mobile)) {
      Toaster("Please enter a valid Phone number.", Colors.LIGHT_RED);
      return false;
    } else if (!DOB) {
      Toaster("Please select a Date of Birth.", Colors.LIGHT_RED);
      return false;
    } else if (today.getFullYear() - dob.getFullYear() < 16) {
      Toaster("You must be at least 16 year old.", Colors.LIGHT_RED);
      return false;
    } else if (!address?.trim().length) {
      Toaster("Address is required.", Colors.LIGHT_RED);
      return false;
    } else if (!weight?.trim().length) {
      Toaster("Body weight is required.", Colors.LIGHT_RED);
      return false;
    } else if (!height?.trim().length) {
      Toaster("height is required.", Colors.LIGHT_RED);
      return false;
    } else {
      return true;
    }
  };

  const updateProfile = async () => {
    const isValid = checkValidation();
    if (isValid) {
      let formdata = new FormData();
      formdata?.append(
        "access_token",
        await AsyncStorage.getItem("@USER_ACCESS_TOKEN")
      );
      formdata.append("first_name", firstName);
      formdata.append("last_name", lastName);
      formdata.append("phone", mobile);
      formdata.append("height", height);
      formdata.append("gender", gender);
      formdata.append("body_weight", weight);

      formdata.append(
        "dob",
        moment(DOB, "DD/MM/YYYY").format("YYYY-MM-DD").toString()
      );
      formdata.append("address", address);
      ImageFile?.uri && formdata?.append("profile_image", ImageFile);
      try {
        setLoading(true);
        const res = await uploadVideoOnServer(
          "update_user_profile",

          formdata
        );

        // console.log("response", res.data);
        console.log("sadad", JSON.stringify(res, null, 2));
        await AsyncStorage.setItem("user", JSON.stringify(res.data.data));
        EventRegister.emit("refreshUserData");
        refresh();
        navigation?.goBack();
      } catch (error) {
        console.log(error);
        console.log(error?.response?.data);
      } finally {
        setLoading(false);
      }
    }
  };

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);

    if (status === "never_ask_again") {
      setModalVisible(false);
    }

    return status === "granted";
  }

  const onGetFile = (file) => {
    console.log("file", file);
    setImageFile({
      uri: file?.path,
      type: file?.mime,
      size: file?.size,
      name: Math.random().toString(),
    });
    setProfileImage(file?.path);
    setModalVisible(false);
  };
  const hanldeCamera = async () => {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }
    ImageCropPicker.openCamera({
      cropping: true,
      mediaType: "photo",
      height: 600,
      width: 600,
    })
      .then((res) => {
        onGetFile(res);
      })
      .catch((err) => {
        console.error("error on Open Image Picker", err);
        if (err.code === "E_NO_LIBRARY_PERMISSION") {
          // setPermissionType("gallery");
          // setOpenConfirmationModal(true);
        }
      });
  };

  const hanldeGallery = async () => {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }
    ImageCropPicker.openPicker({
      cropping: true,
      mediaType: "photo",
      height: 600,
      width: 600,
    })
      .then((res) => {
        onGetFile(res);
      })
      .catch((err) => {
        console.error("error on Open Image Picker", err);
        if (err.code === "E_NO_LIBRARY_PERMISSION") {
          // setPermissionType("gallery");
          // setOpenConfirmationModal(true);
        }
      });
  };

  return (
    <>
      <Container
        backFn={() => {
          navigation?.goBack();
        }}
        title={"Edit Profile"}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginVertical: findSize(15),
          }}
        >
          <View
            style={{
              height: findSize(103),
              width: findSize(103),
              borderRadius: findSize(52),
              backgroundColor: Colors.VALHALLA,
              elevation: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: findSize(90),
                width: findSize(90),
                borderRadius: findSize(46),
                borderWidth: findSize(6),
                borderColor: Colors.VALHALLA,
                elevation: 5,
                overflow: "hidden",
              }}
            >
              <Image
                source={
                  profileImage
                    ? {
                        uri: profileImage,
                      }
                    : require("../../../../../assets/images/avtar.png")
                }
                defaultSource={require("../../../../../assets/images/avtar.png")}
                style={{
                  flex: 1,
                  height: null,
                  width: null,
                  backgroundColor: Colors.WHITE_COLOR,
                }}
              />
            </View>
          </View>
          <CustomButton
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text
              style={{
                fontSize: findSize(12),
                fontFamily: POP_REGULAR,
                color: Colors.INPUT_PLACE,
                marginTop: 7,
              }}
            >
              Change Photo
            </Text>
          </CustomButton>
        </View>
        <CustomInput
          mainContainerStyle={{ marginVertical: 10 }}
          placeholder={"First Name"}
          inputStyle={{ fontSize: 11, paddingTop: 12 }}
          onChangeText={(text) => {
            setFirstName(text);
          }}
          value={firstName}
        />
        <CustomInput
          mainContainerStyle={{ marginVertical: 10 }}
          placeholder={"Last Name"}
          inputStyle={{ fontSize: 11, paddingTop: 12 }}
          onChangeText={(text) => {
            setLastName(text);
          }}
          value={lastName}
        />
        <CustomInput
          mainContainerStyle={{ marginVertical: 10 }}
          placeholder={"Email"}
          inputStyle={{ fontSize: 11, paddingTop: 12 }}
          onChangeText={(text) => {
            setEmail(text);
          }}
          value={email}
          editable={false}
        />
        <CustomInput
          mainContainerStyle={{ marginVertical: 10 }}
          placeholder={"Phone"}
          inputStyle={{ fontSize: 11, paddingTop: 12 }}
          onChangeText={(text) => {
            setMobile(text);
          }}
          value={mobile}
        />
        <DatePicker
          dateTimeProps={{
            onChange: async (date) => {
              setDOB(date);
            },
          }}
          showDarkBg
          currentDate={DOB}
          minDate={new Date("1900-01-01")}
          maxDate={new Date()}
        />
        <View style={{ marginTop: 10 }}>
          <Select
            pickerProps={{
              onValueChange: async (value) => {
                setGender(value);
              },
            }}
            pickerItems={GenderDta}
            pickerValue={gender}
            placeholder={"Select gender"}
          />
        </View>
        <CustomInput
          mainContainerStyle={{ marginVertical: 10 }}
          placeholder={"Address"}
          inputStyle={{ fontSize: 11, paddingTop: 12 }}
          onChangeText={(text) => {
            setAddress(text);
          }}
          value={address}
        />
        <CustomInput
          mainContainerStyle={{ marginVertical: 10 }}
          placeholder={"Body Weight(in lbs)"}
          inputStyle={{ fontSize: 11, paddingTop: 12 }}
          onChangeText={(text) => {
            setWeight(text);
          }}
          value={weight}
        />
        <CustomInput
          mainContainerStyle={{ marginVertical: 10 }}
          placeholder={"Height"}
          inputStyle={{ fontSize: 11, paddingTop: 12 }}
          onChangeText={(text) => {
            setHeight(text);
          }}
          value={height}
        />
        <CustomButton
          type={1}
          isLoading={loading}
          loaderColor={Colors.BACKGROUND}
          title={"Save"}
          onPress={() => {
            updateProfile();
          }}
        />
      </Container>
      <CustomModal
        isVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            paddingVertical: 20,
          }}
        >
          <CustomButton
            onPress={() => {
              hanldeCamera();
            }}
          >
            <Image
              source={require("../../../../../assets/images/camera.png")}
              style={{ height: 100, width: 100 }}
            />
          </CustomButton>
          <CustomButton
            onPress={() => {
              hanldeGallery();
            }}
          >
            <Image
              source={require("../../../../../assets/images/gallary.png")}
              style={{ height: 100, width: 100 }}
            />
          </CustomButton>
        </View>
      </CustomModal>
    </>
  );
};

export default EditProfile;

const styles = StyleSheet.create({});
