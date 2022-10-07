import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import AssignedWorkouts from '../screens/Athlete/Pages/Workouts/AssignedWorkouts';
import ViewWorkout from '../screens/Athlete/Pages/Workouts/ViewWorkout';
import StartWorkout from '../screens/Athlete/Pages/Workouts/StartWorkout';
import CalendarScreen from '../screens/Athlete/Pages/Calendar/CalendarScreen';
import WorkoutView from '../screens/Athlete/Pages/Workouts/WorkoutView';
import ShowAlternativeExercise from '../screens/Coach/Pages/AlternativeExercise/ShowAlternativeExercise';

const WorkoutAthStack = createStackNavigator(
  {
    AssignedWorkouts: AssignedWorkouts,
    ViewWorkout: ViewWorkout,
    StartWorkout: StartWorkout,
    CalendarScreen: CalendarScreen,
    WorkoutView: WorkoutView,
    AlternativeExerciseDetails: ShowAlternativeExercise,
  },
  {
    initialRouteName: 'AssignedWorkouts',
    headerMode: 'none',
  }
);

export default WorkoutAthStackNav = createAppContainer(WorkoutAthStack);
