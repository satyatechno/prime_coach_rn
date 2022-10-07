import Profile from "../screens/Coach/Pages/Profile/Profile";
import EditName from "../screens/EditProfile/EditName";
import EditPassword from "../screens/EditProfile/EditPassword";
import EditEmail from "../screens/EditProfile/EditEmail";
import CoachSpcl from "../screens/EditProfile/CoachSpcl";
import EditDOB from "../screens/EditProfile/EditDOB";
import EditPhone from "../screens/EditProfile/EditPhone";
import EditAddress from "../screens/EditProfile/EditAddress";
import PrivacyPage from "../screens/EditProfile/PrivacyPage";
import TermsPage from "../screens/EditProfile/TermsPage";
import FAQsPage from "../screens/EditProfile/FAQsPage";
import ReferPage from "../screens/EditProfile/ReferPage";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import ExerciseSettings from "../screens/Coach/ExerciseSettings/ExerciseSettings";
import EditProfile from "../screens/Coach/Pages/Profile/EditProfile";

const ProfileStackCoach = createStackNavigator(
  {
    Profile: Profile,
    EditProfile: EditProfile,
    EditName: EditName,
    EditPassword: EditPassword,
    EditEmail: EditEmail,
    CoachSpcl: CoachSpcl,
    EditDOB: EditDOB,
    EditPhone: EditPhone,
    EditAddress: EditAddress,
    PrivacyPage: PrivacyPage,
    TermsPage: TermsPage,
    FAQsPage: FAQsPage,
    ReferPage: ReferPage,
    ExerciseSettings: ExerciseSettings,
  },
  {
    initialRouteName: "Profile",
    headerMode: "none",
  }
);

export default ProfileStackCoachNav = createAppContainer(ProfileStackCoach);
