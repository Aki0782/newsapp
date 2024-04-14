import { useAppState } from "@react-native-community/hooks";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient, QueryClientProvider, focusManager } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { Logger, Toast } from "@Utils";
import { AxiosError } from "axios";
import React, { useEffect } from "react";
import { Platform, SafeAreaView, StatusBar, useColorScheme } from "react-native";
import { MMKV } from "react-native-mmkv";
import SplashScreen from "react-native-splash-screen";

import Header from "@Components/Header/Header";

import { Color } from "@Constants/Colors";

import Home from "./Pages/Home/Home";

interface AsyncStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<unknown>;
  removeItem: (key: string) => Promise<void>;
}

export const mmkv = new MMKV();

const storage: AsyncStorage = {
  getItem: async (key: string) => await Promise.resolve(mmkv.getString(key) ?? null),
  setItem: async (key: string, value: string) => await Promise.resolve(mmkv.set(key, value)),
  removeItem: async (key: string) => await Promise.resolve(mmkv.delete(key))
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 60,
      retry: 0,
      refetchOnWindowFocus: true, // Focus Manager must be set to true manually using app state.
      onError: (error) => {
        const err = error as AxiosError;

        if (err.message === "Network Error") Toast(err);
        Logger(err);
      }
    }
  }
});

const persister = createAsyncStoragePersister({
  storage
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24 * 7
});

const App: React.FC = () => {
  const appState = useAppState();
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    flex: 1
  };

  useEffect(() => {
    if (appState === "active") {
      // Set focusing to true to trgigger refetching of inavalidated/stale queries
      // By default react query in react native can't detect whether app is in focus or not
      focusManager.setFocused(true);
    } else {
      focusManager.setFocused(false);
    }
  }, [appState]);

  useEffect(() => {
    if (Platform.OS === "android") SplashScreen.hide();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar backgroundColor={Color.White} barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <Header />
        <Home />
        {/* </ScrollView> */}
      </SafeAreaView>
    </QueryClientProvider>
  );
};

export default App;
