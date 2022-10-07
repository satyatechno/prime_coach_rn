import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImagePicker, { ImageOrVideo } from "react-native-image-crop-picker";
import { Modalize } from "react-native-modalize";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import { colors } from "src/constants/colors";
import { showMessage } from "../messageModal/MessageModal";
import { CustomImagePickerStyle } from "./CustomImagePicker.styles";
import { Portal } from "react-native-portalize";
import ConfirmationModal from "../customModal/confirmationModal/ConfirmationModal";

const CustomImagePicker = ({
  show,
  onClose,
  pickerOption,
  onChange,
  supportType,
}) => {
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [permissionType, setPermissionType] = useState("");
  const modalizeRef = useRef < Modalize > null;
  //   const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    show && modalizeRef.current?.open();
    !show && modalizeRef.current?.close();
  }, [show]);

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);

    if (status === "never_ask_again") {
      setOpenConfirmationModal(true);
      modalizeRef.current?.close();
    }

    return status === "granted";
  }

  const galleryOpen = async () => {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }

    ImagePicker.openPicker({
      multiple: pickerOption?.multiple,
      maxFiles: pickerOption?.maxFiles,
      cropping: pickerOption?.cropping,
      mediaType: pickerOption?.mediaType ?? "any",
      compressImageQuality: pickerOption?.compressImageQuality ?? 1,

      compressImageMaxHeight: pickerOption?.compressImageMaxHeight,
      compressImageMaxWidth: pickerOption?.compressImageMaxWidth,
      height: pickerOption?.height ?? 1000,
      width: pickerOption?.width ?? 1000,
    })
      .then((res) => {
        onGetFile(res);
      })
      .catch((err) => {
        console.error("error on Open Image Picker", err);
        if (err.code === "E_NO_LIBRARY_PERMISSION") {
          setPermissionType("gallery");
          setOpenConfirmationModal(true);
        }
      });
  };

  const cameraOpen = () => {
    ImagePicker.openCamera({
      height: pickerOption?.height ?? 1000,
      width: pickerOption?.width ?? 1000,
      cropping: pickerOption?.cropping,
      multiple: pickerOption?.multiple,
      mediaType: pickerOption?.mediaType ?? "any",
      compressImageQuality: pickerOption?.compressImageQuality ?? 1,
      compressImageMaxHeight: pickerOption?.compressImageMaxHeight,
      compressImageMaxWidth: pickerOption?.compressImageMaxWidth,
    })
      .then((res) => onGetFile(res))
      .catch(async (err) => {
        console.error("Image Picker Cancelled", err);
        if (err.code === "E_NO_CAMERA_PERMISSION") {
          setPermissionType("camera");
          setOpenConfirmationModal(true);
          modalizeRef.current?.close();
        }
      });
  };

  const onGetFile = (res: any) => {
    console.log("res", res);
    let isArray = Array.isArray(res);
    if (!supportType) {
      if (!isArray) {
        onChange(res);
        onClose(false);
        return;
      } else {
        onChange([res]);
        onClose(false);
        return;
      }
    }
    if (isArray) {
      let error = res?.find(
        (item: ImageOrVideo) => !item?.mime.includes(supportType)
      );
      if (error) {
        return showMessage({
          isVisible: true,
          message: `Please select only ${supportType} file.`,
        });
      }
    } else {
      if (!res?.mime.includes(supportType)) {
        return showMessage({
          isVisible: true,
          message: `Please select only ${supportType} file.`,
        });
      }
    }
    if (!isArray) {
      onChange(res);
    } else {
      onChange([res]);
    }
    onClose(false);
  };
  return (
    <Portal>
      <Modalize
        // onOpened={() => setIsModalOpen(true)}
        onClosed={() => onClose(false)}
        ref={modalizeRef}
        handlePosition="inside"
        adjustToContentHeight
        onClose={() => onClose(false)}
        useNativeDriver={true}
        rootStyle={{
          shadowColor: colors.background,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.82,
          shadowRadius: 2.65,
          elevation: 2,
        }}
        modalStyle={{ backgroundColor: colors.background }}
        avoidKeyboardLikeIOS
        handleStyle={{ backgroundColor: colors.balticSea }}
      >
        <View style={{ minHeight: 180, justifyContent: "center" }}>
          <View style={[{ flexDirection: "row", alignSelf: "center" }]}>
            <TouchableOpacity
              style={CustomImagePickerStyle.button}
              onPress={cameraOpen}
            >
              <View style={CustomImagePickerStyle.iconContainer}>
                <IoniconsIcon
                  name="ios-camera"
                  size={28}
                  color={colors.linkWater}
                />
              </View>
              <Text style={CustomImagePickerStyle.textStyle}>Open Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={CustomImagePickerStyle.button}
              onPress={galleryOpen}
            >
              <View style={CustomImagePickerStyle.iconContainer}>
                <IoniconsIcon
                  name="ios-images"
                  size={28}
                  color={colors.linkWater}
                />
              </View>
              <Text style={CustomImagePickerStyle.textStyle}>Open Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modalize>

      <ConfirmationModal
        isOpen={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        heading="Permission Required!"
        title={`Follow My Lead  would like to access your ${permissionType}`}
        // title={`Follow My Lead would like to access your storage permission`}
        submitButtonText="Settings"
        submitButtonIcon={
          <IoniconsIcon
            name="ios-settings"
            color={colors.yellowSea}
            size={16}
          />
        }
        onPress={() =>
          Linking.openSettings().then((res) => setOpenConfirmationModal(false))
        }
      />

      {/* <ConfirmationModal
        isOpen={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        heading='Permission Required!'
        title={`Host would like to access your ${permissionType}`}
        submitButtonText='Settings'
        submitButtonIcon={
          <IoniconsIcon name='ios-settings' color={colors.defaultWhite} />
        }
        onPress={() =>
          Linking.openSettings().then((res) => setOpenConfirmationModal(false))
        }
      /> */}
    </Portal>
  );
};

export default CustomImagePicker;
