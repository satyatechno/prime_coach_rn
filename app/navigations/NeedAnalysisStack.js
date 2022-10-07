import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import NeedAnalysis from "../screens/Athlete/Pages/NeedAnalysis/NeedAnalysis";
import ViewExercise from "../screens/Athlete/Pages/NeedAnalysis/ViewExercise";

const NeedAnalysisStack = createStackNavigator(
  {
    NeedAnalysis: NeedAnalysis,
    ViewExercise: ViewExercise,
  },
  {
    initialRouteName: "NeedAnalysis",
    headerMode: "none",
  }
);

export default NeedAnalysisStackNav = createAppContainer(NeedAnalysisStack);
