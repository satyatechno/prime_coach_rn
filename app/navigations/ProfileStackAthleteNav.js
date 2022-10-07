import Profile from "../screens/Athlete/Pages/Profile/Profile";
import EditName from "../screens/EditProfile/EditName";
import EditPassword from "../screens/EditProfile/EditPassword";
import EditEmail from "../screens/EditProfile/EditEmail";
import EditDOB from "../screens/EditProfile/EditDOB";
import EditPhone from "../screens/EditProfile/EditPhone";
import EditAddress from "../screens/EditProfile/EditAddress";
import EditGender from "../screens/EditProfile/EditGender";
import EditHeight from "../screens/EditProfile/EditHeight";
import EditWeight from "../screens/EditProfile/EditWeight";
import PrivacyPage from "../screens/EditProfile/PrivacyPage";
import TermsPage from "../screens/EditProfile/TermsPage";
import FAQsPage from "../screens/EditProfile/FAQsPage";
import ReferPage from "../screens/EditProfile/ReferPage";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import EditProfile from "../screens/Athlete/Pages/Profile/EditProfile";

const ProfileStackAthlete = createStackNavigator(
  {
    Profile: Profile,
    EditProfile: EditProfile,
    EditName: EditName,
    EditPassword: EditPassword,
    EditEmail: EditEmail,
    EditDOB: EditDOB,
    EditPhone: EditPhone,
    EditAddress: EditAddress,
    EditGender: EditGender,
    EditWeight: EditWeight,
    EditHeight: EditHeight,
    PrivacyPage: PrivacyPage,
    TermsPage: TermsPage,
    FAQsPage: FAQsPage,
    ReferPage: ReferPage,
  },
  {
    initialRouteName: "Profile",
    headerMode: "none",
  }
);

export default ProfileStackAthleteNav = createAppContainer(ProfileStackAthlete);
