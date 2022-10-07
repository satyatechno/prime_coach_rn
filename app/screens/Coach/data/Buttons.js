import { Colors } from "../../../constants/Colors";

export const BUTTONS_FILLED = [
  {
    btnName: "Create",
    pageName: "CreateEditProtocol",
    themeColor: Colors.GREEN_COLOR,
    icon: require("../../../../assets/images/create-circle.png"),
  },
  {
    btnName: "Edit",
    pageName: "CreateEditProtocol",
    themeColor: Colors.YELLOW_COLOR,
    icon: require("../../../../assets/images/edit-circle.png"),
  },
  {
    btnName: "Delete",
    isButton: true,
    themeColor: Colors.RED_COLOR,
    icon: require("../../../../assets/images/delete-circle.png"),
  },
];

export const BUTTONS_FILLED_SCREENING = [
  {
    btnName: "Create",
    pageName: "CreateEditScreeningProtocol",
    themeColor: Colors.GREEN_COLOR,
    icon: require("../../../../assets/images/create-circle.png"),
  },
  {
    btnName: "Edit",
    pageName: "CreateEditScreeningProtocol",
    themeColor: Colors.YELLOW_COLOR,
    icon: require("../../../../assets/images/edit-circle.png"),
  },
  {
    btnName: "Delete",
    isButton: true,
    themeColor: Colors.RED_COLOR,
    icon: require("../../../../assets/images/delete-circle.png"),
  },
];

export const BUTTONS_BORDERED = [
  { id: 1, btnName: "Previous", themeColor: Colors.SKY_COLOR },
  { id: 2, btnName: "Create", themeColor: Colors.SKY_COLOR },
  { id: 3, btnName: "Next", themeColor: Colors.SKY_COLOR },
];

export const BUTTONS = [
  {
    btnName: "Add Player",
    pageName: "AddPlayer",
    themeColor: Colors.LIGHT_SKY,
    role: "Coach",
    icon: require("../../../../assets/images/addPlayer.png"),
  },
  {
    btnName: "Add Coach",
    pageName: "AddCoach",
    themeColor: Colors.LIGHT_GREEN,
    role: "Coach",
    icon: require("../../../../assets/images/addCoach.png"),
  },
  {
    btnName: "Add Event",
    pageName: "TeamEvent",
    themeColor: Colors.ORANGE_COLOR,
    role: "Coach",
    icon: require("../../../../assets/images/addEvent.png"),
  },
  {
    btnName: "Testing",
    pageName: "Testing",
    themeColor: Colors.YELLOW_COLOR,
    role: "Coach",
    icon: require("../../../../assets/images/testing.png"),
  },
  {
    btnName: "Screening",
    pageName: "Screening",
    themeColor: Colors.INDIGO_COLOR,
    role: "Coach",
    icon: require("../../../../assets/images/screening.png"),
  },
  {
    btnName: "Reports",
    pageName: "Reports",
    themeColor: Colors.VIOLET_COLOR,
    role: "Coach",
    icon: require("../../../../assets/images/reports.png"),
  },
  {
    btnName: "Delete Team",
    isButton: true,
    themeColor: Colors.RED_COLOR,
    role: "Coach",
    icon: require("../../../../assets/images/delete.png"),
  },

  /////////ADMIN///////
  {
    btnName: "Add Player",
    pageName: "AddPlayer",
    themeColor: Colors.LIGHT_SKY,
    role: "Admin",
    icon: require("../../../../assets/images/addPlayer.png"),
  },
  {
    btnName: "Add Coach",
    pageName: "AddCoach",
    themeColor: Colors.LIGHT_GREEN,
    role: "Admin",
    icon: require("../../../../assets/images/addCoach.png"),
  },
  {
    btnName: "Add Event",
    pageName: "TeamEvent",
    themeColor: Colors.ORANGE_COLOR,
    role: "Admin",
    icon: require("../../../../assets/images/addEvent.png"),
  },
  {
    btnName: "Testing",
    pageName: "Testing",
    themeColor: Colors.YELLOW_COLOR,
    role: "Admin",
    icon: require("../../../../assets/images/testing.png"),
  },
  {
    btnName: "Screening",
    pageName: "Screening",
    themeColor: Colors.INDIGO_COLOR,
    role: "Admin",
    icon: require("../../../../assets/images/screening.png"),
  },
  {
    btnName: "Reports",
    pageName: "Reports",
    themeColor: Colors.VIOLET_COLOR,
    role: "Admin",
    icon: require("../../../../assets/images/reports.png"),
  },
  {
    btnName: "Delete Team",
    isButton: true,
    themeColor: Colors.RED_COLOR,
    role: "Admin",
    icon: require("../../../../assets/images/delete.png"),
  },

  ////////S&C/////////
  {
    btnName: "Add Player",
    pageName: "AddPlayer",
    themeColor: Colors.LIGHT_SKY,
    role: "S&C Coach",
    icon: require("../../../../assets/images/addPlayer.png"),
  },
  {
    btnName: "Add Coach",
    pageName: "AddCoach",
    themeColor: Colors.LIGHT_GREEN,
    role: "S&C Coach",
    icon: require("../../../../assets/images/addCoach.png"),
  },
  {
    btnName: "Add Event",
    pageName: "TeamEvent",
    themeColor: Colors.ORANGE_COLOR,
    role: "S&C Coach",
    icon: require("../../../../assets/images/addEvent.png"),
  },
  {
    btnName: "Testing",
    pageName: "Testing",
    themeColor: Colors.YELLOW_COLOR,
    role: "S&C Coach",
    icon: require("../../../../assets/images/testing.png"),
  },
  {
    btnName: "Screening",
    pageName: "Screening",
    themeColor: Colors.INDIGO_COLOR,
    role: "S&C Coach",
    icon: require("../../../../assets/images/screening.png"),
  },
  {
    btnName: "Reports",
    pageName: "Reports",
    themeColor: Colors.VIOLET_COLOR,
    role: "S&C Coach",
    icon: require("../../../../assets/images/reports.png"),
  },
  {
    btnName: "Delete Team",
    isButton: true,
    themeColor: Colors.RED_COLOR,
    role: "S&C Coach",
    icon: require("../../../../assets/images/delete.png"),
  },

  ////////ASSTT/////////

  {
    btnName: "Add Event",
    pageName: "TeamEvent",
    themeColor: Colors.ORANGE_COLOR,
    role: "Assistant Coach",
    icon: require("../../../../assets/images/addEvent.png"),
  },
  {
    btnName: "Testing",
    pageName: "Testing",
    themeColor: Colors.YELLOW_COLOR,
    role: "Assistant Coach",
    icon: require("../../../../assets/images/testing.png"),
  },
  {
    btnName: "Screening",
    pageName: "Screening",
    themeColor: Colors.INDIGO_COLOR,
    role: "Assistant Coach",
    icon: require("../../../../assets/images/screening.png"),
  },
  {
    btnName: "Reports",
    pageName: "Reports",
    themeColor: Colors.VIOLET_COLOR,
    role: "Assistant Coach",
    icon: require("../../../../assets/images/reports.png"),
  },
];

export const PLAYER_BUTTONS = [
  { title: "Training Plan", pageName: "TrainingPlanPage", id: 1 },
  { title: "Program View", pageName: "ProgramView", id: 2 },
  { title: "Testing Results", pageName: "TestingResults", id: 3 },
  { title: "Reports", pageName: "ReportsPage", id: 4 },
  { title: "Edit User Details", pageName: "EditUserDetails", id: 5 },
];
