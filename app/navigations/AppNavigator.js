import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Welcome from '../screens/Welcome/Welcome';
import Choices from '../screens/Login/Choices';
import Login from '../screens/Login/Login';
import InputEmail from '../screens/ForgotPassword/InputEmail';
import OTPScreen from '../screens/ForgotPassword/OTPScreen';
import CreateNewPassword from '../screens/ForgotPassword/CreateNewPassword';
import SelectSport from '../screens/Signup/SelectSport';
import SelectPlan from '../screens/Signup/SelectPlan';
import Register from '../screens/Signup/Register';
import DrawerNav from './DrawerNav';
import DrawerAthNav from './DrawerAthNav';
import DrawerAdminNav from './DrawerAdminNav';
import { Colors } from '../constants/Colors';

const RootStack = createStackNavigator(
  {
    Welcome: Welcome,
    Choices: Choices,
    Login: Login,
    InputEmail: InputEmail,
    OTPScreen: OTPScreen,
    CreateNewPassword: CreateNewPassword,
    SelectSport: SelectSport,
    SelectPlan: SelectPlan,
    Register: Register,
    DrawerNav: DrawerNav,
    DrawerAthNav: DrawerAthNav,
    DrawerAdminNav: DrawerAdminNav,
  },
  {
    initialRouteName: 'Welcome',
    mode: 'card',
    headerMode: 'none',
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: Colors.BACKGROUND,
      },
    },
  }
);

export default AppNavigator = createAppContainer(RootStack);
