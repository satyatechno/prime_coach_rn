import { StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";
import { ROBO_BOLD, ROBO_MEDIUM, ROBO_REGULAR } from "../../constants/Fonts";
import { IS_IOS } from "../../constants/DeviceDetails";

export const styles = StyleSheet.create({
  regTxt: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_BOLD,
    textAlign: "center",
    fontSize: 30,
    marginBottom: 25,
  },
  createNew: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_MEDIUM,
    textAlign: "center",
    fontSize: 15,
    marginBottom: 15,
  },
  heads: {
    fontSize: 15,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    marginBottom: 5,
  },
  dateView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  dateText: {
    color: Colors.BLACK_COLOR,
    fontFamily: ROBO_REGULAR,
  },
  androidView: {
    height: 45,
    width: "100%",
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: "center",
  },
  dropdown: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.WHITE_COLOR,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
  },
  dropdownLbl: {
    fontSize: 15,
    fontFamily: ROBO_REGULAR,
  },
  registerBtn: {
    width: 100,
    alignSelf: "center",
    backgroundColor: Colors.BG_COLOR,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.SKY_COLOR,
    marginTop: 10,
  },
  dateIconView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  iconView: {
    position: "absolute",
    left: "86%",
    top: IS_IOS ? 110 : 197,
    zIndex: 9999,
  },
});
