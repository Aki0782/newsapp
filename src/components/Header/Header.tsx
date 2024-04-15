import React from "react";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import Label from "@Components/Label";

import { Color } from "@Constants/Colors";

const Header: React.FC = () => {
  return (
    <View style={styles.container}>
      <Label style={[styles.logo]}>News App</Label>
      <Icon name="search" color={Color.Night} size={24} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Color.Grey,
    flexDirection: "row"
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: Color.Night
  }
});
