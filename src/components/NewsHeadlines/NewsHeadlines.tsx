import React from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";

import Label from "@Components/Label";

import { Color } from "@Constants/Colors";

type NewsHeadlinesProps = {
  uri: string;
  title: string;
  url: string;
};

const NewsHeadlines: React.FC<NewsHeadlinesProps> = ({ uri, title, url }) => {
  return (
    <TouchableOpacity
      onPress={(): void => {
        void Linking.openURL(url);
      }}
      style={styles.container}>
      <View style={styles.imageContainer}>
        <FastImage
          style={styles.image}
          source={{
            uri
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      <View style={styles.contentContainer}>
        <Label style={styles.contentText} numberOfLines={3}>
          {title}
        </Label>
      </View>
    </TouchableOpacity>
  );
};

export default NewsHeadlines;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Grey,
    borderRadius: 5,
    padding: 6,
    display: "flex",
    flexDirection: "row",
    gap: 10
  },
  imageContainer: {
    width: 100,
    height: 60,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "lime"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  contentContainer: {
    flex: 1
  },
  contentText: {
    fontWeight: "600"
  }
});
