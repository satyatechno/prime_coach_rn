import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Admin from '../screens/Coach/Admin/Admin';
import ResetPassword from '../screens/Coach/Admin/ResetPassword';
import Coaches from '../screens/Coach/Admin/Coaches';
import CoachTeam from '../screens/Coach/Admin/CoachTeam';
import AdminExerciseGroup from '../screens/Coach/Admin/adminExerciseSettings/AdminExerciseGroup';
import AdminExercises from '../screens/Coach/Admin/adminExerciseSettings/AdminExercises';
import { Colors } from '../constants/Colors';
import AdminUsers from '../screens/Coach/Admin/users/AdminUsers';

const AdminStack = createStackNavigator(
  {
    Admin: Admin,
    ResetPassword: ResetPassword,
    AdminExerciseGroup: AdminExerciseGroup,
    AdminExercises: AdminExercises,
    AdminUsers: AdminUsers,
  },
  {
    initialRouteName: 'Admin',
    headerMode: 'none',
  }
);
const CoachesStack = createStackNavigator(
  {
    Coaches: Coaches,
    CoachTeam: CoachTeam,
  },
  {
    initialRouteName: 'Coaches',
    headerMode: 'none',
  }
);
export const CoachesStackNav = createAppContainer(CoachesStack);
export default AdminStackNav = createAppContainer(AdminStack);
