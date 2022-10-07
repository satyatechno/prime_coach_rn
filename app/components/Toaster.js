import Toast from "react-native-root-toast";
import { Colors } from "../constants/Colors";
import { ROBO_MEDIUM } from "../constants/Fonts";

export function Toaster(toastMessage, bgColor) {
  return Toast.show(toastMessage, {
    duration: Toast.durations.SHORT,
    animation: true,
    containerStyle: {
      backgroundColor: bgColor,
      width: "80%",
      marginBottom: 25,
    },
    textStyle: {
      fontFamily: ROBO_MEDIUM,
      fontSize: 16,
      color: Colors.WHITE_COLOR,
    },
  });
}
