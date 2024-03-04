/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./src/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */

import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { AppState, AppStateStatus } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { SWRConfig } from "swr";

import Config from "./config";
import { AppNavigator, useNavigationPersistence } from "./navigators";
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary";
import * as storage from "./utils/storage";

import { useAuthHook } from "@/src/hooks/useAuthHook";
import { DatabaseConnectionProvider } from "@/src/providers/DatabaseConnectionProvider";
import {
  NetworkConnectionProvider,
  useNetworkConnection,
} from "@/src/providers/NetworkConnectionProvider";
import { fontsToLoad } from "@/src/theme";
import { api } from "@/src/utils/axiosInstance";

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE";

interface AppProps {}

const config = {
  screens: {},
};

// background notification
messaging().onMessage(async (remoteMessage) => {
  console.log("Message handled in the foreground!", remoteMessage);
  notifee.displayNotification(
    JSON.parse((remoteMessage.data?.notifee as string) ?? "{}")
  );
});

/**
 * This is the root component of our app.
 */
const App = (_props: AppProps) => {
  const { isOnline, NetInfo } = useNetworkConnection();
  const { authApi } = useAuthHook(api);
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY);
  const [isFontsLoaded] = useFonts(fontsToLoad);

  const linking = {
    prefixes: ["expoapp://"],
    config,
  };

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!isNavigationStateRestored || !isFontsLoaded) return null;

  // otherwise, we're ready to render the app
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <DatabaseConnectionProvider>
          <NetworkConnectionProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <SWRConfig
                value={{
                  fetcher: (resource) =>
                    authApi.get(resource).then((res) => res.data),
                  onError: (error) => {
                    console.log("SWR Error: ", error);
                  },
                  provider: () => new Map(),
                  isVisible: () => {
                    return true;
                  },
                  isOnline: () => {
                    return isOnline;
                  },
                  initFocus(callback) {
                    let appState = AppState.currentState;

                    const onAppStateChange = (nextAppState: AppStateStatus) => {
                      /* If it's resuming from background or inactive mode to active one */
                      if (
                        appState.match(/inactive|background/) &&
                        nextAppState === "active"
                      ) {
                        callback();
                      }
                      appState = nextAppState;
                    };

                    // Subscribe to the app state change events
                    const subscription = AppState.addEventListener(
                      "change",
                      onAppStateChange
                    );

                    return () => {
                      subscription.remove();
                    };
                  },
                  initReconnect: (callback) => {
                    let networkState = isOnline;
                    const subscription = NetInfo.addEventListener((state) => {
                      if (networkState !== state.isInternetReachable) {
                        callback();
                      }
                      networkState = state.isInternetReachable ?? isOnline;
                    });

                    return () => {
                      subscription();
                    };
                  },
                }}
              >
                <AppNavigator
                  linking={linking}
                  initialState={initialNavigationState}
                  onStateChange={onNavigationStateChange}
                />
              </SWRConfig>
              <StatusBar style="auto" />
            </GestureHandlerRootView>
          </NetworkConnectionProvider>
        </DatabaseConnectionProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

export default App;
