import { PermissionsAndroid, Platform } from "react-native";
import FileViewer from "react-native-file-viewer";
import RNFetchBlob from "rn-fetch-blob";
import { Toaster } from "../components/Toaster";
import { Colors } from "../constants/Colors";

export const downloadFile = async (file) => {
  console.log("file", JSON.stringify(file, null, 2));
  if (Platform.OS === "android") {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    const isGranted =
      result[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
        "granted" &&
      result[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
        "granted";
    console.log("granted", isGranted);
    if (!isGranted) {
      return;
    }
  }

  const { dirs } = RNFetchBlob.fs;
  const androidPath = `${dirs.DownloadDir}/U-Rest/${file.name}`;

  // const iosPath = file.path?.replace(
  //   'https://qaff-storage.s3.me-south-1.amazonaws.com/public/project',
  //   `${dirs.DocumentDir}/Qaff/${file.name}`,
  // );
  const iosPath = `${dirs.DocumentDir}/U-Rest/${file.name}`;

  const dirToSave = Platform.OS == "ios" ? iosPath : androidPath;
  const configfb = {
    fileCache: true,
    path: dirToSave,
    indicator: true,
    overwrite: true,

    addAndroidDownloads: {
      mime: file.type,
      path: dirToSave,

      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: `${file?.name}`,
      trusty: true,
    },
  };
  const configOptions = Platform.select({
    ios: {
      fileCache: configfb.fileCache,
      title: configfb.title,
      path: configfb.path,
      appendExt: file.type,
    },
    android: configfb,
  });

  //   console.log('The file saved to ', RNFetchBlob.fs.dirs.DownloadDir);
  const downloaded = await RNFetchBlob.fs.exists(dirToSave);
  if (downloaded) {
    console.log("already downloaded");
    // Snackbar.show({
    //   text: 'Already downloaded',
    //   duration: 800,
    //   backgroundColor: colors.appGreen,
    //   fontFamily: fonts.primarySB,
    // });
    Toaster("Already Download", Colors.GREEN_COLOR);
    console.log("already download directory", dirToSave);

    FileViewer.open(dirToSave)
      .then(() => {
        console.log("file opened");
      })
      .catch((error) => {
        // error
        console.log("file open err", error);
      });
  } else {
    RNFetchBlob.config(configOptions)
      .fetch("GET", `${file.path}`, { "Cache-Control": "no-store" })
      .then((res) => {
        console.log("resss file ", res);
        if (Platform.OS === "ios") {
          RNFetchBlob.ios.previewDocument(configfb.path);
        }
        // setisdownloaded(false)
        if (Platform.OS === "android") {
          FileViewer.open(`${res.data}`);
          console.log("ress", JSON.stringify(res, null, 2));
          //   if (isGranted) {
          //   } else {
          //     console.error("Permission not granted");
          //   }
        }
      })
      .catch((e) => {
        console.log("The file saved to ERROR", e);
      });
  }
  // }
};
