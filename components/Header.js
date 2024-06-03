import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import styles from "../assets/styles/styles";
import Text from "./CText";

const Header = ({ canGoBack, onBackPress }) => {
  return (
    <View style={styles.headerContainer}>
      {canGoBack && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.headerText}>Back</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.headerText}>netz</Text>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />
    </View>
  );
};

export default Header;
