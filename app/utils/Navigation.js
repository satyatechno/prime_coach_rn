import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

export function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

export const popToTop = async () => {
  await AsyncStorage.removeItem('@USER_ACCESS_TOKEN');
  await AsyncStorage.removeItem('@USER_ROLE');
  await AsyncStorage.removeItem('@CURRENT_WEEK');
  await AsyncStorage.removeItem('@CURRENT_PROGRAM');
  await AsyncStorage.removeItem('@IS_ADMIN');
  _navigator.dispatch(
    StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'Welcome',
          params: {},
        }),
      ],
    })
  );
};

// add other navigation functions that you need and export them
