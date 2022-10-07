import React, { Component } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import HamBurger from "../../../../components/HamBurger";
import i18n from "../../../../locale/i18n";
import { Colors } from "../../../../constants/Colors";
import {
  ROBO_BOLD,
  ROBO_MEDIUM,
  ROBO_REGULAR,
  ROBO_ITALIC,
  POP_MEDIUM,
  POP_REGULAR,
} from "../../../../constants/Fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Entypo";
import { standardPostApi } from "../../../../api/ApiWrapper";
import { findSize } from "../../../../utils/helper";

export default class Help extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: [],
      helpData: [],
      helpDataLoading: true,
    };
    this.fetchHelpContent();
  }

  fetchHelpContent = async () => {
    try {
      const res = await standardPostApi("list_help_data", undefined, {}, true);
      if (res.data.code == 200) {
        this.setState({
          helpData: res.data.data.HelpData,
          helpDataLoading: false,
        });
        console.log(
          "The helpData is ",
          JSON.stringify(this.state.helpData, null, 2)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  toggleExpand = (id) => {
    const { helpData } = this.state;
    const expand_item = helpData.find((item) => item.id === id);
    expand_item.expanded = !expand_item.expanded;
    const newHelpData = Object.assign({}, helpData, expand_item);
    this.setState({ newHelpData });
  };

  render() {
    const { helpData, helpDataLoading } = this.state;
    helpData.map(function (el) {
      var o = Object.assign({}, el);
      o.expanded = false;
      return o;
    });
    return (
      <HamBurger onMenuPress={() => this.props.navigation.openDrawer()}>
        <Text style={styles.help}>{i18n.t("help.help")}</Text>
        <View style={{ marginBottom: 25 }}>
          {helpDataLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.ORANGE}
              style={{ marginTop: 150 }}
            />
          ) : (
            helpData.map((item, index) => {
              const IS_EXPANDED = item.expanded;
              return (
                <View>
                  <TouchableOpacity
                    style={[
                      index === helpData?.length - 1
                        ? {
                            paddingVertical: 15,
                          }
                        : {
                            paddingVertical: 15,
                            borderBottomColor: Colors.INPUT_PLACE,
                            borderBottomWidth: 1,
                          },
                    ]}
                    // onPress={async () => await this.toggleExpand(item.id)}
                    onPress={() => {
                      this.props.navigation?.navigate("HelpDetails", {
                        data: item,
                      });
                    }}
                  >
                    <View style={styles.rowContainer}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Icon
                        name={"chevron-right"}
                        size={25}
                        color={Colors.WHITE_COLOR}
                        style={{ marginEnd: -5 }}
                      />
                    </View>
                  </TouchableOpacity>
                  {IS_EXPANDED && (
                    <View>
                      {item.points.map((i) => {
                        return (
                          <View>
                            <View style={styles.bg}>
                              <Text style={styles.pointTxt}>
                                {"\u2022 " + i.point}
                              </Text>
                            </View>
                            {item.subPoint &&
                              item.subPoint.map((sub) => {
                                return (
                                  <View style={[styles.bg, { marginLeft: 15 }]}>
                                    <Text
                                      style={[
                                        styles.pointTxt,
                                        { fontFamily: ROBO_ITALIC },
                                      ]}
                                    >
                                      {"- " + sub.point}
                                    </Text>
                                  </View>
                                );
                              })}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </HamBurger>
    );
  }
}

const styles = StyleSheet.create({
  help: {
    color: Colors.WHITE_COLOR,
    fontFamily: POP_MEDIUM,
    fontSize: 21,
    marginBottom: 10,
  },
  title: {
    fontSize: findSize(18),
    color: Colors.WHITE_COLOR,
    fontFamily: POP_REGULAR,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bg: {
    backgroundColor: Colors.BG_LIGHT,
    marginTop: 10,
    alignItems: "center",
    borderRadius: 3,
  },
  pointTxt: {
    fontSize: 15,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_REGULAR,
    padding: 10,
    alignSelf: "flex-start",
  },
});
