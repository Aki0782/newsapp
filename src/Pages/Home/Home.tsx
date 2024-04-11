import { Logger } from "@Utils";
import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

import NewsHeadlines from "@Components/NewsHeadlines/NewsHeadlines";

import { Color } from "@Constants/Colors";

import { useGetHeadlines } from "../../CallBacks/GetHeadlines/GetHeadlines";

const ItemSeparator = (): React.ReactElement => <View style={styles.separator} />;

const Home: React.FC = () => {
  const { data } = useGetHeadlines();

  Logger(data?.articles.length);

  const renderer = ({ item }: { item: Article }): React.ReactElement => {
    return (
      <View>
        <NewsHeadlines
          uri={
            item.urlToImage ||
            "https://plus.unsplash.com/premium_photo-1691223714882-57a432c4edaf?q=80&w=3281&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          title={item.title}
          url={item.url}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {data && <FlatList ItemSeparatorComponent={ItemSeparator} data={data.articles} renderItem={renderer} />}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Night,
    flex: 1,
    padding: 12
  },
  separator: {
    height: 10, // Adjust the height of the gap as needed
    backgroundColor: "transparent" // Change this to set the color of the gap
  }
});
