import { Platform, Dimensions } from "react-native";

export const IS_IOS = Platform.OS === "ios";

export const DEV_HEIGHT = Dimensions.get("screen").height;

export const DEV_WIDTH = Dimensions.get("screen").width;

export const isIOS13 =
  IS_IOS &&
  parseInt(Platform.Version, 10) >= 13 &&
  parseInt(Platform.Version, 10) < 14;

export const isIOS14 = IS_IOS && parseInt(Platform.Version, 10) >= 14;
export const APP_VERSION = "";
// export const APP_VERSION = 'v 1.1(7)';
