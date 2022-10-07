import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import TrainingPlan from '../screens/Coach/Pages/TrainingPlan/TrainingPlan';
import AddNewProgram from '../screens/Coach/Modals/AddNewProgram';
import EditWorkout from '../screens/Coach/Modals/EditWorkout';
import PlanDetails from '../screens/Coach/Pages/TrainingPlan/PlanDetails';
import Weeks from '../screens/Coach/Pages/TrainingPlan/Weeks';
import Days from '../screens/Coach/Pages/TrainingPlan/Days';
import Workouts from '../screens/Coach/Pages/TrainingPlan/Workouts';
import WorkoutGroup from '../screens/Coach/Pages/TrainingPlan/WorkoutGroup';
import WorkoutGroupExercise from '../screens/Coach/Pages/TrainingPlan/WorkoutGroupExercise';
import ExercisePicker from '../screens/Coach/Modals/ExercisePicker';

const TrainingPlanStack = createStackNavigator(
  {
    TrainingPlan: TrainingPlan,
    AddNewProgram: AddNewProgram,
    PlanDetails: PlanDetails,
    Weeks: Weeks,
    Days: Days,
    Workouts: Workouts,
    WorkoutGroup: WorkoutGroup,
    WorkoutGroupExercise: WorkoutGroupExercise,
    EditWorkout: EditWorkout,
    ExercisePicker: ExercisePicker,
  },
  {
    initialRouteName: 'TrainingPlan',
    headerMode: 'none',
  }
);

export default TrainingPlanStackNav = createAppContainer(TrainingPlanStack);
