import notifee from "@notifee/react-native";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import messaging from "@react-native-firebase/messaging";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { ReactNode, useEffect, useState } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import codePush from "react-native-code-push";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SWRConfig } from "swr";

import { useAuthHook } from "@/src/hooks/useAuthHook";
import { DatabaseConnectionProvider } from "@/src/providers/DatabaseConnectionProvider";
import { useAppStore } from "@/src/store/useAppStore";
import { fontsToLoad } from "@/src/theme/typography";
import { api } from "@/src/utils/axiosInstance";
import { useNavigationPersistence } from "@/src/utils/navigation";
import * as storage from "@/src/utils/storage";

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE";

// notification handlers
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
  notifee.displayNotification(
    JSON.parse((remoteMessage.data?.notifee as string) ?? "{}")
  );
});

messaging().onMessage(async (remoteMessage) => {
  console.log("Message handled in the foreground!", remoteMessage);
  notifee.displayNotification(
    JSON.parse((remoteMessage.data?.notifee as string) ?? "{}")
  );
});

// google sign in configure
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId:
    Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
      : undefined,
  offlineAccess: false,
});

const App = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const { authApi } = useAuthHook(api);
  const { network } = useAppStore();
  const { isInternetReachable } = useNetInfo();
  const [isFontsLoaded] = useFonts(fontsToLoad);
  const [isNetworkLoaded, setIsNetworkLoaded] = useState(false);

  const { isRestored: isNavigationStateRestored } = useNavigationPersistence(
    storage,
    NAVIGATION_PERSISTENCE_KEY
  );

  useEffect(() => {
    if (isFontsLoaded && isNetworkLoaded) {
      setIsReady(true);
    }
  }, [isFontsLoaded, isNetworkLoaded]);

  useEffect(() => {
    if (isNavigationStateRestored && isReady) {
      SplashScreen.hideAsync();
    }
  }, [isNavigationStateRestored, isReady]);

  // handle network and internet connection
  useEffect(() => {
    if (typeof isInternetReachable === "boolean") {
      setIsNetworkLoaded(true);
      network.setIsOnline(isInternetReachable);
    }
  }, [isInternetReachable]);

  if (!isReady) return null;

  return (
    <DatabaseConnectionProvider>
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
              return network.isOnline;
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
              let networkState = network.isOnline;
              const subscription = NetInfo.addEventListener((state) => {
                if (networkState !== state.isInternetReachable) {
                  callback();
                }
                networkState = state.isInternetReachable ?? network.isOnline;
              });

              return () => {
                subscription();
              };
            },
          }}
        >
          {children}
          <StatusBar style="auto" />
        </SWRConfig>
      </GestureHandlerRootView>
    </DatabaseConnectionProvider>
  );
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

const RootApp = !__DEV__ ? App : codePush(codePushOptions)(App);

export default RootApp;
