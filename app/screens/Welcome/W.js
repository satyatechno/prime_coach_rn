import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
} from "react-native";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: "",
      inputCount: 3,
      data: [{ name: "input1" }, { name: "input2" }, { name: "input3" }],
    };
    this.inputRefs = {};
  }

  onAddMore() {
    const newData = this.state.data;
    newData.push({ name: `input${this.state.inputCount + 1}` });
    this.setState((prevState) => ({
      inputCount: prevState.inputCount + 1,
      data: newData,
    }));
  }

  _onChangeText(text, inputName) {
    console.log("Input Name:", inputName, text);
    console.log("Inout's Ref:", this.inputRefs[inputName]);
    const info = `${inputName} changed text`;
    this.setState({
      info: this.state.info + "\n\r" + info,
    });
  }

  _onChange(event, inputName) {
    console.log("Input Name:", inputName);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.data.map((d) => (
          <View style={styles.inputWrapper} key={d.name}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                this._onChangeText(text, d.name);
              }}
              onChange={(event) => {
                this._onChange(event, d.name);
              }}
              ref={(ref) => {
                this.inputRefs[d.name] = ref;
              }}
              defaultValue={d.name}
            />
          </View>
        ))}
        <Button
          onPress={this.onAddMore.bind(this)}
          title="Add More"
          color="#841584"
        />
        <TextInput multiline={true} editable={false} style={styles.info}>
          {this.state.info}
        </TextInput>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    marginTop: 50,
  },
  info: {
    flex: 0.5,
  },
  inputWrapper: {
    backgroundColor: "yellow",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  input: {
    height: 55,
    paddingLeft: 15,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 5,
    color: "red",
  },
});

// import React, { Component } from "react";
// import { Text, View, StyleSheet, SafeAreaView } from "react-native";
// import PrimeInput from "../../components/PrimeInput";
// import PrimeButton from "../../components/PrimeButton";
// import { Colors } from "../../constants/Colors";

// const ITEMS = [
//   { name: "One", value: "Sachin" },
//   { name: "Two", value: "Virat" },
//   { name: "Three", value: "Rahul" },
//   { name: "Four", value: "Dhoni" },
//   { name: "Five", value: "Bumrah" },
// ];

// export default class Welcome extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       // updated: "",
//     };
//   }

//   handleInputChange = async (name, text) => {
//     // return async (text) => {
//     await this.setState({ [name]: text });
//     console.log(this.state);
//     // };
//     // this.setState({ [e.target.name]: e.target.value });
//   };

//   render() {
//     return (
//       <SafeAreaView style={styles.safeView}>
//         <View style={{ paddingHorizontal: 25, marginTop: 35 }}>
//           {ITEMS.map((item, index) => {
//             return (
//               <View>
//                 <PrimeInput
//                   inputProps={{
//                     onChangeText: (text) =>
//                       this.handleInputChange(item.name, text),
//                     keyboardType: "email-address",
//                     value: item.value,
//                   }}
//                   noAnimation={true}
//                 />
//               </View>
//             );
//           })}
//           <PrimeButton
//             buttonProps={{
//               style: styles.loginBtn,
//               onPress: () => null,
//             }}
//             buttonText="Submit"
//           />
//         </View>
//       </SafeAreaView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   safeView: {
//     flex: 1,
//     backgroundColor: "#121212",
//   },
//   loginBtn: {
//     width: 100,
//     alignSelf: "center",
//     backgroundColor: Colors.BG_COLOR,
//     marginBottom: 25,
//     borderWidth: 1,
//     borderColor: Colors.SKY_COLOR,
//   },
// });

// import React, { Component } from "react";
// import {
//   View,
//   StyleSheet,
//   TextInput,
//   Button,
//   SafeAreaView,
// } from "react-native";

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       info: "",
//       inputCount: 3,
//       data: [{ name: "input1" }, { name: "input2" }, { name: "input3" }],
//     };
//     this.inputRefs = {};
//   }

//   onAddMore() {
//     const newData = this.state.data;
//     newData.push({ name: `input${this.state.inputCount + 1}` });
//     this.setState((prevState) => ({
//       inputCount: prevState.inputCount + 1,
//       data: newData,
//     }));
//   }

//   _onChangeText(text, inputName) {
//     console.log("Input Name:", inputName, text);
//     console.log("Inout's Ref:", this.inputRefs[inputName]);
//     const info = `${inputName} changed text`;
//     this.setState({
//       info: this.state.info + "\n\r" + info,
//     });
//   }

//   _onChange(event, inputName) {
//     console.log("Input Name:", inputName);
//   }

//   render() {
//     return (
//       <SafeAreaView style={styles.container}>
//         {this.state.data.map((d) => (
//           <View style={styles.inputWrapper} key={d.name}>
//             <TextInput
//               style={styles.input}
//               onChangeText={(text) => {
//                 this._onChangeText(text, d.name);
//               }}
//               onChange={(event) => {
//                 this._onChange(event, d.name);
//               }}
//               ref={(ref) => {
//                 this.inputRefs[d.name] = ref;
//               }}
//               defaultValue={d.name}
//             />
//           </View>
//         ))}
//         <Button
//           onPress={this.onAddMore.bind(this)}
//           title="Add More"
//           color="#841584"
//         />
//         <TextInput multiline={true} editable={false} style={styles.info}>
//           {this.state.info}
//         </TextInput>
//       </SafeAreaView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F2F2F2",
//     marginTop: 50,
//   },
//   info: {
//     flex: 0.5,
//   },
//   inputWrapper: {
//     backgroundColor: "yellow",
//     marginTop: 5,
//     marginBottom: 5,
//     marginLeft: 5,
//     marginRight: 5,
//   },
//   input: {
//     height: 55,
//     paddingLeft: 15,
//     paddingRight: 5,
//     paddingTop: 5,
//     paddingBottom: 5,
//     color: "red",
//   },
// });
