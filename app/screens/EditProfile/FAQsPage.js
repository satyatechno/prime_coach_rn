import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from "react-native";
import Container from "../../components/Container";
import { Colors } from "../../constants/Colors";
import {
  POP_MEDIUM,
  POP_REGULAR,
  ROBO_BOLD,
  ROBO_MEDIUM,
  ROBO_REGULAR,
} from "../../constants/Fonts";
import i18n from "../../locale/i18n";
import { standardPostApi } from "../../api/ApiWrapper";
import { DEV_WIDTH } from "../../constants/DeviceDetails";
import HamBurger from "../../components/HamBurger";
import TildView from "../../components/tildView/TildView";
import { findSize } from "../../utils/helper";
import Icon from "react-native-vector-icons/AntDesign";

function Iqon() {
  return (
    <View style={{ alignSelf: "flex-start" }}>
      <View style={{ alignItems: "center" }}>
        <View style={styles.sticks} />
        <View style={styles.circle}>
          <Text style={styles.q}>Q.</Text>
        </View>
        <View style={styles.sticks} />
      </View>
    </View>
  );
}

export default class FAQsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faqsLoading: true,
      faqData: [],
      expanded: [],
    };
    this.fetchFaqs();
  }

  fetchFaqs = async () => {
    try {
      const res = await standardPostApi(
        "list_frequently_asked_questions_data",
        undefined,
        {},
        true
      );
      if (res.data.code == 200) {
        this.setState({
          faqData: res.data.data.FAQs,
          faqsLoading: false,
        });
        console.log("The faqs are ", this.state.faqData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  toggleExpand = (index) => {
    const { expanded } = this.state;
    if (expanded?.includes(index)) {
      this.setState({ expanded: expanded?.filter((x) => x == !index) });
    } else {
      this.setState({ expanded: [...expanded, index] });
    }
  };

  render() {
    const { faqData, faqsLoading } = this.state;
    return (
      <HamBurger
        navigation={this.props?.navigation}
        onMenuPress={() => this.props.navigation.openDrawer()}
      >
        <Text style={styles.editEmail}>{i18n.t("profile.faqs")}</Text>
        <View style={{ marginBottom: 25 }}>
          {faqsLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.ORANGE}
              style={{ marginTop: 150 }}
            />
          ) : (
            faqData.map((item) => {
              const IS_EXPANDED = this.state.expanded.includes(item.id);
              return (
                <TildView
                  degree="5deg"
                  mainViewStyle={{ borderRadius: 10 }}
                  tildViewStyle={{ borderRadius: 10 }}
                  containerStyle={{
                    marginVertical: 0,
                  }}
                >
                  <View
                    style={{
                      padding: 15,
                      // minHeight: 80,
                      // justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.question}>{item.ques}</Text>
                      <TouchableOpacity
                        onPress={async () => this.toggleExpand(item.id)}
                      >
                        <Icon
                          name={IS_EXPANDED ? "minus" : "plus"}
                          size={25}
                          color={Colors.ORANGE}
                        />
                      </TouchableOpacity>
                    </View>

                    {IS_EXPANDED && (
                      <View
                        style={{
                          borderLeftWidth: findSize(3),
                          borderLeftColor: Colors.ORANGE,
                        }}
                      >
                        <Text style={styles.answer}>{item.ans}</Text>
                      </View>
                    )}
                  </View>
                </TildView>
              );
            })
          )}
        </View>
      </HamBurger>
    );
  }
}

const styles = StyleSheet.create({
  editEmail: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_MEDIUM,
    fontSize: 21,
    marginBottom: 10,
  },
  sticks: {
    backgroundColor: Colors.SKY_COLOR,
    height: 20,
    width: 4,
  },
  circle: {
    backgroundColor: Colors.SKY_COLOR,
    height: 45,
    width: 45,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  q: {
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_MEDIUM,
    fontSize: 17,
  },
  question: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_REGULAR,
    fontSize: findSize(14),
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  answer: {
    color: Colors.INPUT_PLACE,
    fontFamily: POP_REGULAR,
    fontSize: 12,
    paddingLeft: 10,
  },
});
