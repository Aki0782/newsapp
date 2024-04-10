import { Logger } from "@Utils";
import React from "react";
import { View, StyleSheet } from "react-native";

import Label from "@Components/Label";

import { Color } from "@Constants/Colors";

import { useGetHeadlines } from "../../CallBacks/GetHeadlines/GetHeadlines";

const Home: React.FC = () => {
  const { data } = useGetHeadlines();

  Logger(data?.articles.length);

  return (
    <View style={styles.container}>
      <Label>Home</Label>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Night,
    flex: 1
  }
});
