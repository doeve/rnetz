import { Text } from "react-native";
import React, { Component } from "react";

export default class CText extends Component {
  constructor(props) {
    super(props);
    this.style = [{ fontFamily: "Courier New" }];
    if (props.style) {
      if (Array.isArray(props.style)) {
        this.style = this.style.concat(props.style);
      } else {
        this.style.push(props.style);
      }
    }
  }

  render() {
    return (
      <Text {...this.props} style={this.style}>
        {this.props.children}
      </Text>
    );
  }
}
