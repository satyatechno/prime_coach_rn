import { StyleSheet } from 'react-native';
import { colors } from 'src/constants/colors';
import { SCREEN_WIDTH } from 'src/constants/deviceInfo';
import { fonts } from 'src/constants/fonts';

export const CustomImagePickerStyle = StyleSheet.create({
  button: {
    height: 120,
    width: SCREEN_WIDTH * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 22,
    backgroundColor: colors.balticSea,
    padding: 10,
  },
  iconContainer: {
    height: 50,
    width: 50,
    borderRadius: 22,
    backgroundColor: colors.tuna,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textStyle: {
    color: colors.linkWater,
    // opacity: 0.5,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
});
