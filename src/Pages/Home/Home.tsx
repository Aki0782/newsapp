import { useQueryClient } from "@tanstack/react-query";
import { Vibrate } from "@Utils";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { GestureHandlerRootView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Label from "@Components/Label";
import NewsHeadlines from "@Components/NewsHeadlines/NewsHeadlines";

import { Color } from "@Constants/Colors";

import { mmkv } from "../../App";
import { useGetHeadlines } from "../../CallBacks/GetHeadlines/GetHeadlines";

const ItemSeparator = (): React.ReactElement => <View style={styles.separator} />;

type StateProps = {
  articles: Article[];
  titles: string[];
  headlines: Article[];
  pinnedHeadlines: Article | object;
};

const Home: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, refetch: refetchHeadlines, isFetching } = useGetHeadlines();
  const [headlines, setHeadlines] = useState<Article[]>([]);
  const [pinnedHeadlines, setPinnedHeadlines] = useState<Article | object>({});
  const [articles, setArticles] = useState<Article[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const intervalRef = useRef<null | NodeJS.Timeout>(null);
  const swipeRef = useRef<Swipeable | null>(null);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffledArray = [...array]; // Create a copy of the original array

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate a random index

      // Swap elements at index i and j
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
  };

  const pullToRefresh = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (articles.length > 0) {
      const slicedTitles = titles.slice(0, 5);
      const remainingTitles = titles.slice(5);

      setTitles([]);
      const artToPush = articles.filter((art) => slicedTitles.includes(art.title));

      setArticles((prevArticles) => prevArticles.filter((art) => !slicedTitles.includes(art.title)));
      setTitles(remainingTitles);
      setHeadlines((prevHeadlines) => [...artToPush, ...prevHeadlines]);
    }

    startInterval();
  };

  const startInterval = (): void => {
    intervalRef.current = setInterval(() => {
      setTitles((prevTitles) => {
        const slicedTitles = prevTitles.slice(0, 5);
        const remainingTitles = prevTitles.slice(5);
        const artToPush = articles.filter((art) => slicedTitles.includes(art.title));

        setArticles((prevArticles) => {
          return prevArticles.filter((art) => !slicedTitles.includes(art.title));
        });
        setHeadlines((prevHeadlines) => {
          return [...artToPush, ...prevHeadlines];
        });

        return remainingTitles;
      });
    }, 10000);
  };

  const removeHandler = (title: string): void => {
    setHeadlines((prevHeadlines) => prevHeadlines.filter((art) => art.title !== title));
    Vibrate();
  };

  const leftView = (title: string): React.ReactElement => {
    return (
      <TouchableWithoutFeedback
        onPress={() => removeHandler(title)}
        style={[styles.leftSwipeContainer, styles.swipeContainerChild]}>
        <MaterialIcons name="delete" size={24} color={Color.White} />
        <Label style={styles.swipeLableSize}>Remove</Label>
      </TouchableWithoutFeedback>
    );
  };

  const pinHandler = (title: string, isPinned: boolean): void => {
    const selectedHeadlines = headlines.filter((art) => art.title === title);

    if (isPinned && pinnedHeadlines) {
      setHeadlines((prev) => {
        return [...prev, pinnedHeadlines] as Article[];
      });
      setPinnedHeadlines({});
      mmkv.set("pinnedItem", JSON.stringify(""));

      return;
    }

    if (!isPinned && pinnedHeadlines) {
      setHeadlines((prev) => {
        return [...prev.filter((art) => art.title !== title), pinnedHeadlines] as Article[];
      });
      setPinnedHeadlines(selectedHeadlines[0]);
      mmkv.set("pinnedItem", JSON.stringify(selectedHeadlines[0]));

      return;
    }

    if (!isPinned) {
      setPinnedHeadlines(selectedHeadlines[0]);
      mmkv.set("pinnedItem", JSON.stringify(selectedHeadlines[0]));
      setHeadlines((prev) => {
        return prev.filter((art) => art.title !== title);
      });
    }

    Vibrate();
  };

  const rightView = (title: string, isPinned = false): React.ReactElement => {
    return (
      <TouchableWithoutFeedback
        onPress={() => pinHandler(title, isPinned)}
        style={[styles.rightSwipeContainer, styles.swipeContainerChild]}>
        <MaterialIcons name={isPinned ? "pin-off" : "pin"} size={24} color={Color.White} />
        <Label style={styles.swipeLableSize}>{isPinned ? "Unpin" : "Pin"}</Label>
      </TouchableWithoutFeedback>
    );
  };

  useEffect(() => {
    const state = mmkv.getString("state");
    const parsedState: StateProps = state && JSON.parse(state);

    if (parsedState?.pinnedHeadlines) {
      setPinnedHeadlines(parsedState.pinnedHeadlines);
    }

    if (parsedState?.headlines.length > 0) {
      setHeadlines(parsedState.headlines);
    }

    if (parsedState?.titles.length > 0) {
      setTitles(parsedState.titles);
    }

    if (parsedState?.articles.length > 0) {
      console.log("triggered");
      setArticles(parsedState.articles);
      startInterval();

      return;
    }

    if (data) {
      const articlesResponse = [...data.articles.filter((art) => art.title !== "[Removed]")];
      const splicedArticles = articlesResponse.splice(1, headlines.length === 0 ? 10 : 5);

      setHeadlines((prev) => [...splicedArticles, ...prev]);
      setArticles(articlesResponse);
      const originalArray = articlesResponse.map((news) => news.title);

      setTitles(shuffleArray(originalArray));
    }
  }, [data]);

  useEffect(() => {
    const state = {
      articles,
      titles,
      headlines,
      pinnedHeadlines
    };

    mmkv.set("state", JSON.stringify(state));
  }, [articles, titles, headlines, pinnedHeadlines]);

  useEffect(() => {
    if (intervalRef.current === null && articles.length > 0) {
      startInterval();
    }

    if (articles.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      const refetch = async (): Promise<void> => {
        queryClient.setQueryData(["getHeadlines"], () => undefined); // refetch query)

        await refetchHeadlines();
      };

      refetch().catch((err) => {
        console.error(err);
      });
    }
  }, [articles]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const renderer = ({ item }: { item: Article }): React.ReactElement => {
    return (
      <Swipeable
        containerStyle={styles.swipeContainer}
        key={item.title}
        ref={swipeRef}
        overshootLeft={false}
        overshootRight={false}
        renderLeftActions={() => leftView(item.title)}
        renderRightActions={() => rightView(item.title)}>
        <NewsHeadlines
          source={item.source?.name}
          isPinned={false}
          uri={
            item.urlToImage ||
            "https://plus.unsplash.com/premium_photo-1691223714882-57a432c4edaf?q=80&w=3281&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          title={item.title}
          url={item.url}
        />
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        {Object.keys(pinnedHeadlines).length > 0 && (
          <View style={styles.pinnedContainer}>
            <Swipeable renderRightActions={() => rightView((pinnedHeadlines as Article)?.title, true)}>
              <NewsHeadlines
                source={(pinnedHeadlines as Article).source.name}
                isPinned={Boolean(pinnedHeadlines)}
                uri={
                  (pinnedHeadlines as Article).urlToImage ||
                  "https://plus.unsplash.com/premium_photo-1691223714882-57a432c4edaf?q=80&w=3281&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                title={(pinnedHeadlines as Article).title}
                url={(pinnedHeadlines as Article).url}
              />
            </Swipeable>
          </View>
        )}
        {headlines.length > 0 && (
          <FlatList
            refreshing={isFetching}
            onRefresh={pullToRefresh}
            ItemSeparatorComponent={ItemSeparator}
            data={headlines}
            renderItem={renderer}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Grey,
    flex: 1,
    padding: 12
  },
  separator: {
    height: 10, // Adjust the height of the gap as needed
    backgroundColor: "transparent" // Change this to set the color of the gap
  },
  swipeContainer: {
    borderRadius: 5
  },
  swipeContainerChild: {
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    height: "100%"
  },
  leftSwipeContainer: {
    backgroundColor: Color.Red
  },
  rightSwipeContainer: {
    backgroundColor: Color.Green
  },
  swipeLableSize: {
    fontSize: 12
  },
  pinnedContainer: {
    marginBottom: 10
  }
});
