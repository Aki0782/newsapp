import { Vibrate } from "@Utils";
import React from "react";
import { Linking, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Label from "@Components/Label";

import { Color } from "@Constants/Colors";

type NewsHeadlinesProps = {
  uri: string;
  title: string;
  url: string;
  source: string;
  isPinned: boolean;
};

const NewsHeadlines: React.FC<NewsHeadlinesProps> = ({ uri, title, url, isPinned = false, source }) => {
  return (
    <TouchableWithoutFeedback
      onPress={(): void => {
        void Linking.openURL(url);
        Vibrate();
      }}
      style={styles.container}>
      {isPinned && (
        <View style={styles.pinnedIcon}>
          <MaterialIcons name="pin-off" size={10} color={Color.White} />
        </View>
      )}

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
        <View style={styles.headlineContainer}>
          <Label style={styles.contentText} numberOfLines={3}>
            {title}
          </Label>
        </View>
        <View style={styles.authorContainer}>
          <Label style={styles.author}>- {source}</Label>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewsHeadlines;

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: Color.White,
    borderRadius: 5,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between" // Center content vertically
  },
  imageContainer: {
    flexBasis: 100,
    height: 60,
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 10
  },
  image: {
    width: "100%",
    height: "100%"
  },
  contentContainer: {
    flex: 1
  },
  contentText: {
    fontWeight: "600",
    color: Color.Night
  },
  pinnedIcon: {
    position: "absolute",
    top: 4,
    right: 4
  },
  author: {
    fontSize: 12,
    color: Color.Night
  },
  authorContainer: {
    alignItems: "flex-end",
    flexBasis: 14
  },
  headlineContainer: {
    flex: 1
  }
});
