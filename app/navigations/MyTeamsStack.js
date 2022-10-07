import MyTeams from "../screens/Coach/Pages/MyPlayers/MyTeams";
import AddTeam from "../screens/Coach/Modals/AddTeam";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import MyPlayers from "../screens/Coach/Pages/MyPlayers/MyPlayers";
import AddCoach from "../screens/Coach/Modals/AddCoach";
import AddPlayer from "../screens/Coach/Modals/AddPlayer";
import Reports from "../screens/Coach/Pages/MyPlayers/Reports";
import Testing from "../screens/Coach/Pages/MyPlayers/Testing";
import TrainingPlanPage from "../screens/Coach/Pages/MyPlayers/PlayerPages/TrainingPlanPage";
import ProgramView from "../screens/Coach/Pages/MyPlayers/PlayerPages/ProgramView";
import TestingResults from "../screens/Coach/Pages/MyPlayers/PlayerPages/TestingResults";
import ReportsPage from "../screens/Coach/Pages/MyPlayers/PlayerPages/ReportsPage";
import EditUserDetails from "../screens/Coach/Pages/MyPlayers/PlayerPages/EditUserDetails";
import WeekDetails from "../screens/Coach/Pages/MyPlayers/PlayerPages/WeekDetails";
import DayDetails from "../screens/Coach/Pages/MyPlayers/PlayerPages/DayDetails";
import PlayerDetails from "../screens/Coach/Pages/MyPlayers/PlayerDetails";
import CreateEditProtocol from "../screens/Coach/Modals/CreateEditProtocol";
import AddTestingResult from "../screens/Coach/Modals/AddTestingResult";
import StartWorkout from "../screens/Athlete/Pages/Workouts/StartWorkout";
import ViewWorkout from "../screens/Athlete/Pages/Workouts/ViewWorkout";
import CalendarWorkout from "../screens/Coach/Pages/MyPlayers/PlayerPages/CalendarWorkout";
import TeamEvent from "../screens/Coach/Pages/MyPlayers/PlayerPages/TeamEvents";
import DayWiseReport from "../screens/Athlete/Pages/Home/DayWiseReport";
import Screening from "../screens/Coach/Pages/MyPlayers/Screening";
import CreateEditScreeningProtocol from "../screens/Coach/Modals/CreateEditScreeningProtocol";
import ViewScreeningResult from "../screens/Coach/Modals/ViewScreeningResult";
import AddScreeningResult from "../screens/Coach/Modals/AddScreeningResult";
import VideoPreview from "../components/videoPreview/VideoPreview";
import AddEvent from "../screens/Coach/Pages/MyPlayers/PlayerPages/AddEvent";

const MyTeamsStack = createStackNavigator(
  {
    MyTeams: MyTeams,
    AddTeam: AddTeam,
    MyPlayers: MyPlayers,
    AddPlayer: AddPlayer,
    AddCoach: AddCoach,
    Reports: Reports,
    Testing: Testing,
    PlayerDetails: PlayerDetails,
    CreateEditProtocol: CreateEditProtocol,
    AddTestingResult: AddTestingResult,
    TrainingPlanPage: TrainingPlanPage,
    ProgramView: ProgramView,
    TestingResults: TestingResults,
    ReportsPage: ReportsPage,
    EditUserDetails: EditUserDetails,
    WeekDetails: WeekDetails,
    DayDetails: DayDetails,
    ViewWorkout: ViewWorkout,
    StartWorkout: StartWorkout,
    CalendarWorkout: CalendarWorkout,
    TeamEvent: TeamEvent,
    AddEvent: AddEvent,
    AnalyseDayWorkout: DayWiseReport,
    Screening: Screening,
    CreateEditScreeningProtocol: CreateEditScreeningProtocol,
    ViewScreeningResult: ViewScreeningResult,
    AddScreeningResult: AddScreeningResult,
    VideoPreview: VideoPreview,
  },
  {
    initialRouteName: "MyTeams",
    headerMode: "none",
  }
);

export default MyTeamsStackNav = createAppContainer(MyTeamsStack);
