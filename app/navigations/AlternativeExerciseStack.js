import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import AlternativeExercise from '../screens/Coach/Pages/AlternativeExercise/AlternativeExercise';
import AddAlternativeExercise from '../screens/Coach/Pages/AlternativeExercise/AddAlternativeExercise';
import ShowAlternativeExercise from '../screens/Coach/Pages/AlternativeExercise/ShowAlternativeExercise';

const Stack = createStackNavigator(
  {
    AlternativeExercise: AlternativeExercise,
    AddAlternativeExercise: AddAlternativeExercise,
    ShowAlternativeExercise: ShowAlternativeExercise,
  },
  {
    initialRouteName: 'AlternativeExercise',
    headerMode: 'none',
  }
);

export default AlternativeExerciseStack = createAppContainer(Stack);
