import React, { Component } from "react";
import { Text, View, Button } from "react-native";

const ARR = [
  {
    name: "Pink Floyd",
  },
  {
    name: "Coldplay",
  },
  {
    name: "Iron Maiden",
  },
  {
    name: "Linkin Park",
  },
  {
    name: "Black Sabbath",
  },
];

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arr: ARR,
      index: 0,
    };
  }

  next = async () => {
    const { arr, index } = this.state;
    if (index !== arr.length - 1) {
      await this.setState({ index: index + 1 });
    } else {
      await this.setState({ index: 0 });
    }
  };

  previous = async () => {
    const { arr, index } = this.state;
    if (index === 0) {
      await this.setState({ index: arr.length - 1 });
    } else if (index > 0) {
      await this.setState({ index: index - 1 });
    }
  };

  render() {
    const { arr, index } = this.state;
    const info = arr[index];
    return (
      <View style={{ flex: 1, backgroundColor: "#121212" }}>
        <Text style={{ color: "#f00", fontSize: 25 }}>{info.name}</Text>
        <Button color="white" title="NEXT" onPress={() => this.next()} />
        <Button color="white" title="PREV" onPress={() => this.previous()} />
      </View>
    );
  }
}
