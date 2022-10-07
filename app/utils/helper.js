import { DEV_HEIGHT, DEV_WIDTH } from "../constants/DeviceDetails";

export const FONT_SIZE = (size) => {
  return (DEV_HEIGHT / 725) * size;
};
export const FLEX_WIDTH = (size) => {
  return (DEV_WIDTH / 360) * size;
};

export const findSize = (size) => {
  return (DEV_WIDTH / 428) * size;
};
export const findHeight = (size) => {
  return (DEV_HEIGHT / 926) * size;
};
export const capitalizeFirstLetter = (string = "") => {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
};
