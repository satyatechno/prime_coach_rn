import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import HamBurger from "../../../../components/HamBurger";
import i18n from "../../../../locale/i18n";
import { Colors } from "../../../../constants/Colors";
import {
  POP_MEDIUM,
  ROBO_BOLD,
  ROBO_REGULAR,
} from "../../../../constants/Fonts";
import AddBtn from "../../../../components/AddBtn";
import PrimeInput from "../../../../components/PrimeInput";
import ProgramView from "../../components/ProgramView";
import { standardPostApi } from "../../../../api/ApiWrapper";
import AsyncStorage from "@react-native-community/async-storage";
import { DEV_WIDTH } from "../../../../constants/DeviceDetails";
import { NavigationEvents } from "react-navigation";
import CustomInput from "../../../../components/customInput/CustomInput";
import { findHeight, findSize } from "../../../../utils/helper";
import Ionicon from "react-native-vector-icons/Ionicons";
import CustomButton from "../../../../components/customButton/CustomButton";
import CustomModal from "../../../../components/customModal/CustomModal";
import DatePicker from "../../../../components/DatePicker";
import Select from "../../../../components/Select";
import moment from "moment";
export default class TrainingPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plans: [],
      plansLoading: true,
      planSearchTxt: "",
      planData: {},
      modalVisible: false,
      modalVisible1: false,
      start_date: new Date(),
      end_date: new Date(),
      selectedLocation: null,
      planName: "",
      addingPlan: false,
      selectedPlan: null,
    };
    this.listAddPlanData();
    this.listAllPlans();
  }

  listAddPlanData = async () => {
    this.setState({ plansLoading: true });
    try {
      const res = await standardPostApi(
        "pre_add_annual_training_program",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({ planData: res.data.data.WorkoutLocation });
      }
    } catch (error) {
      console.log(error);
    }
  };

  listAllPlans = async () => {
    this.setState({ plansLoading: true });
    try {
      const res = await standardPostApi(
        "list_annual_training_program",
        undefined,
        {
          access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
        },
        true
      );
      if (res.data.code == 200) {
        this.setState({
          plans: res.data.data,
          plansLoading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ plansLoading: false });
  };

  checkNonEmpty = (text) => {
    if (!text.trim().length > 0) {
      alert("Please enter a Plan Name.");
      return false;
    } else {
      return true;
    }
  };

  verifyPickers = () => {
    const { selectedLocation } = this.state;
    if (selectedLocation == null) {
      alert("Please choose a location to create a Plan.");
      return false;
    }
    return true;
  };

  toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
  };
  addNewPlan = async () => {
    const START_DATE = moment(this.toTimestamp(this.state.start_date) * 1000)
      .format("YYYY-MM-DD")
      .toString();
    const END_DATE = moment(this.toTimestamp(this.state.end_date) * 1000)
      .format("YYYY-MM-DD")
      .toString();
    if (this.checkNonEmpty(this.state.planName) && this.verifyPickers()) {
      this.setState({ addingPlan: true });
      try {
        const res = await standardPostApi(
          "add_annual_training_program",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            name: this.state.planName,
            start_date: START_DATE,
            end_date: END_DATE,
            location: this.state.selectedLocation,
          },
          true
        );
        this.setState({ addingPlan: false, modalVisible: false });
        if (res.data.code == 200) {
          this.listAllPlans();
          this.setState({ planName: "" });
        }
      } catch (error) {
        this.setState({ addingPlan: false });
        console.log(error);
      }
    }
  };

  copyPlan = async () => {
    if (this.checkNonEmpty(this.state.planName)) {
      this.setState({ addingPlan: true });
      try {
        const res = await standardPostApi(
          "copy_annual_traning_program",
          undefined,
          {
            access_token: await AsyncStorage.getItem("@USER_ACCESS_TOKEN"),
            name: this.state.planName,
            annual_training_program_id: this.state.selectedPlan,
          },
          true
        );
        this.setState({ addingPlan: false, modalVisible1: false });
        if (res.data.code == 200) {
          this.listAllPlans();
          this.setState({ planName: "" });
        }
      } catch (error) {
        this.setState({ addingPlan: false });
        console.log(error);
      }
    }
  };

  render() {
    const {
      plans,
      plansLoading,
      planData,
      planSearchTxt,
      modalVisible,
      end_date,
      start_date,
      selectedLocation,
      planName,
      addingPlan,
    } = this.state;
    return (
      <>
        <HamBurger onMenuPress={() => this.props.navigation.openDrawer()}>
          <NavigationEvents
            onWillFocus={(payload) => {
              this.listAddPlanData();
              this.listAllPlans();
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.plan}>{i18n.t("train.plan")}</Text>

            <CustomButton
              type={1}
              style={{
                backgroundColor: Colors.ORANGE,
                width: findSize(130),
                height: findHeight(40),
              }}
              title={"Add New Program"}
              textStyle={{
                fontSize: findSize(12),
              }}
              onPress={() => {
                this.setState({ modalVisible: true });
              }}
            />
          </View>

          <View style={[]}>
            <CustomInput
              mainContainerStyle={{
                marginVertical: 10,
              }}
              placeholder={"Search Program"}
              inputStyle={{
                fontSize: 11,
                paddingTop: 12,
              }}
              onChangeText={(text) => {
                this.setState({ planSearchTxt: text });
              }}
              value={this.state.planSearchTxt}
            />
            <View
              style={{
                position: "absolute",
                height: findHeight(50),
                marginTop: 10,
                alignSelf: "flex-end",
                justifyContent: "center",
                alignItems: "center",
                end: 10,
              }}
            >
              <TouchableOpacity onPress={() => {}}>
                <Ionicon name="search" size={22} color={Colors.WHITE_COLOR} />
              </TouchableOpacity>
            </View>
          </View>
          {plansLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.ORANGE}
              style={{ marginTop: 150 }}
            />
          ) : plans.length > 0 ? (
            plans.map((item) => {
              if (planSearchTxt != null || planSearchTxt != "") {
                let mainTerm = item.name;
                let subTerm = planSearchTxt;
                let searchRegex = new RegExp(subTerm, "i");
                let res = mainTerm.match(searchRegex);
                let isMatch = res != null && res.length > 0;
                if (isMatch == false) {
                  if (item?.users?.length) {
                    for (var i = 0; item?.users?.length > i; i++) {
                      let Name =
                        item?.users[i]?.first_name +
                        " " +
                        item?.users[i]?.last_name;
                      let subTermName = planSearchTxt;
                      let searchName = new RegExp(subTermName, "i");
                      let resName = Name.match(searchName);
                      let searchEmail = new RegExp(subTermName, "i");
                      let resEmail = item?.users[i]?.email.match(searchEmail);
                      let isMatchPlayer =
                        (resName != null && resName.length > 0) ||
                        (resEmail != null && resEmail.length > 0);
                      if (isMatchPlayer) {
                        break;
                      } else if (i == item?.users?.length - 1) {
                        return null;
                      }
                    }
                  } else {
                    return null;
                  }
                }
              }
              return (
                <ProgramView
                  onProgramPress={() => {
                    this.props.navigation.navigate("PlanDetails", {
                      content: item,
                      refreshFunc: () => {
                        this.listAddPlanData();
                        this.listAllPlans();
                      },
                    });
                  }}
                  programName={item.name}
                  planImage={item.image}
                  onClone={() => {
                    this.setState({
                      modalVisible1: true,
                      selectedPlan: item?.id,
                    });
                  }}
                />
              );
            })
          ) : (
            <Text style={styles.noPlans}>You have not created any plans.</Text>
          )}
        </HamBurger>
        <CustomModal
          isVisible={modalVisible}
          onClose={() => {
            this.setState({
              modalVisible: false,
            });
          }}
        >
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              fontFamily: POP_MEDIUM,
              fontSize: findSize(21),
              textAlign: "center",
            }}
          >
            Add Annual Training Plan
          </Text>
          <CustomInput
            mainContainerStyle={{ marginVertical: 10 }}
            placeholder={"ATP Name"}
            inputStyle={{ fontSize: 11, paddingTop: 12 }}
            onChangeText={(text) => {
              this.setState({ planName: text });
            }}
            value={planName}
          />
          <DatePicker
            dateTimeProps={{
              onChange: async (date) => {
                this.setState({ start_date: date });
              },
            }}
            showDarkBg
            currentDate={start_date}
            minDate={new Date("2020-01-01")}
            maxDate={new Date("2050-01-01")}
          />
          <DatePicker
            dateTimeProps={{
              onChange: async (date) => {
                this.setState({ end_date: date });
              },
            }}
            showDarkBg
            currentDate={end_date}
            minDate={start_date}
            maxDate={new Date("2050-01-01")}
          />
          <Select
            pickerProps={{
              onValueChange: async (value) => {
                this.setState({ selectedLocation: value });
              },
            }}
            pickerItems={planData.pickerArray}
            pickerValue={this.state.selectedLocation}
          />
          <CustomButton
            type={1}
            isLoading={addingPlan}
            loaderColor={Colors.BACKGROUND}
            title={"Save"}
            onPress={() => {
              this.addNewPlan();
            }}
          />
        </CustomModal>
        <CustomModal
          isVisible={this.state.modalVisible1}
          onClose={() => {
            this.setState({
              modalVisible1: false,
            });
          }}
        >
          <Text
            style={{
              color: Colors.WHITE_COLOR,
              fontFamily: POP_MEDIUM,
              fontSize: findSize(21),
              textAlign: "center",
            }}
          >
            Copy Annual Training Plan
          </Text>
          <CustomInput
            mainContainerStyle={{ marginVertical: 10 }}
            placeholder={"ATP Name"}
            inputStyle={{ fontSize: 11, paddingTop: 12 }}
            onChangeText={(text) => {
              this.setState({ planName: text });
            }}
            value={planName}
          />

          <CustomButton
            type={1}
            isLoading={addingPlan}
            loaderColor={Colors.BACKGROUND}
            title={"Save"}
            onPress={() => {
              this.copyPlan();
            }}
          />
        </CustomModal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  plan: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_MEDIUM,
    fontSize: findSize(21),
    marginEnd: 10,
    flex: 1,
  },
  searchBar: {
    width: "85%",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  noPlans: {
    fontSize: 15,
    fontFamily: ROBO_REGULAR,
    color: Colors.WHITE_COLOR,
    textAlign: "center",
    marginTop: 80,
  },
});
