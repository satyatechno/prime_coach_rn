import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "../screens/Athlete/Pages/Home/Home";
import SelfScreen from "../screens/Athlete/Pages/Home/SelfScreen";
import ShowExercise from "../screens/Athlete/Pages/Home/ShowExercise";
import EmailRecipients from "../screens/Athlete/Pages/Workouts/EmailRecipients";
import DayWiseReport from "../screens/Athlete/Pages/Home/DayWiseReport";
import IntensityGraph from "../screens/Athlete/Pages/Home/IntensityGraph";
import CorrectiveExercise from "../screens/Athlete/Pages/Home/CorrectiveExercise";
import SelfScreening from "../screens/Athlete/Pages/Home/SelfScreening";
import WeeklyReport from "../screens/Athlete/Pages/Home/WeeklyReport";

const HomeAthStack = createStackNavigator(
  {
    Home: Home,
    IntensityGraph: IntensityGraph,
    CorrectiveExercise: CorrectiveExercise,
    SelfScreening: SelfScreening,
    WeeklyReport: WeeklyReport,
    SelfScreen: SelfScreen,
    ShowExercise: ShowExercise,
    EmailRecipients: EmailRecipients,
    DayWiseReport: DayWiseReport,
  },
  {
    initialRouteName: "Home",
    headerMode: "none",
  }
);

export default HomeAthStackNav = createAppContainer(HomeAthStack);
