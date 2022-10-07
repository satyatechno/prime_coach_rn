import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Help from "../screens/Coach/Pages/Help/Help";
import HelpDetails from "../screens/Coach/Pages/Help/HelpDetails";

const HelpStack = createStackNavigator(
  {
    Help: Help,
    HelpDetails: HelpDetails,
  },
  {
    initialRouteName: "Help",
    headerMode: "none",
  }
);

export default createAppContainer(HelpStack);
