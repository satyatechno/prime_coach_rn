import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import CustomButton from "../../../components/customButton/CustomButton";
import TildView from "../../../components/tildView/TildView";
import { Colors } from "../../../constants/Colors";
import { ROBO_MEDIUM, ROBO_REGULAR } from "../../../constants/Fonts";
import { findSize } from "../../../utils/helper";

export default class Player extends Component {
  render() {
    const { playersArray, showPosition } = this.props;
    return (
      // <View style={{ marginVertical: 10 }}>
      //   {showPosition && (
      //     <View style={styles.categoryBg}>
      //       <Text style={styles.playerType}>{this.props.playerType}</Text>
      //     </View>
      //   )}
      //   <View style={styles.playerContainer}>
      //     {playersArray &&
      //       playersArray.map((item) => (
      //         <View style={{ width: 150 }}>
      //           <Text style={styles.playerName}>
      //             {item.first_name + " " + item.last_name}
      //           </Text>
      //           <TouchableOpacity
      //             disabled={this.props.isDisabled}
      //             style={{ marginBottom: 15 }}
      //             onPress={() => this.props.onPlayerPress(item)}
      //           >
      //             <View style={styles.darkSkyBg}>
      //               <Image
      //                 style={styles.img}
      //                 source={require("../Pages/MyPlayers/player.png")}
      //               />
      //             </View>
      //           </TouchableOpacity>
      //         </View>
      //       ))}
      //   </View>
      // </View>
      <TildView>
        <View style={{ padding: findSize(15), paddingVertical: findSize(22) }}>
          {showPosition && (
            <View style={styles.categoryBg}>
              <Text style={styles.playerType}>{this.props.playerType}</Text>
            </View>
          )}
          <View style={styles.playerContainer}>
            {playersArray &&
              playersArray.map((item) => (
                <CustomButton
                  style={{
                    backgroundColor: Colors.BACKGROUND,
                    width: findSize(105),
                    padding: findSize(15),
                    borderRadius: findSize(10),
                    marginHorizontal: 5,
                    marginTop: 10,
                    alignItems: "center",
                  }}
                  onPress={() => this.props.onPlayerPress(item)}
                >
                  <View style={styles.img}>
                    <Image
                      style={styles.img}
                      source={require("../../../../assets/images/avtar.png")}
                    />
                  </View>
                  <Text style={styles.playerName} numberOfLines={1}>
                    {item.first_name + " " + item.last_name}
                  </Text>
                </CustomButton>
              ))}
          </View>
        </View>
      </TildView>
    );
  }
}

const styles = StyleSheet.create({
  playerType: {
    fontSize: 15,
    color: Colors.WHITE_COLOR,
    fontFamily: ROBO_MEDIUM,
  },
  img: {
    resizeMode: "contain",
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: Colors.WHITE_COLOR,

    overflow: "hidden",
  },
  darkSkyBg: {
    alignSelf: "center",
    backgroundColor: Colors.DARK_SKY,
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  playerName: {
    color: Colors.WHITE_COLOR,

    fontFamily: ROBO_REGULAR,
    fontSize: 10,
    textAlign: "center",
    marginTop: 10,
  },
  categoryBg: {
    borderBottomColor: Colors.INPUT_PLACE,
    borderBottomWidth: 1.5,
    marginHorizontal: 8,
    paddingBottom: 8,
    marginBottom: 10,
  },
  playerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
});
