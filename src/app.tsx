// tailwind
import "@/global.css";

// unistyles
import "@/src/theme/unistyles";

import notifee from "@notifee/react-native";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import messaging from "@react-native-firebase/messaging";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { ReactNode, useEffect, useState } from "react";
import {
  AppState,
  AppStateStatus,
  Platform,
  useColorScheme,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SWRConfig } from "swr";

import Config from "@/src/config";
import { useAuthHook } from "@/src/hooks/useAuthHook";
import { GoogleSignin } from "@/src/modules/@react-native-google-signin/google-signin";
import {
  CodePushProvider,
  useCodePushProvider,
} from "@/src/providers/CodePushProvider";
import { DBConnectionProvider } from "@/src/providers/DBConnectionProvider";
import { useAppStore } from "@/src/store/useAppStore";
import { fontsToLoad } from "@/src/theme/typography";
import { api } from "@/src/utils/axiosInstance";
import {
  useBackButtonHandler,
  useNavigationPersistence,
} from "@/src/utils/navigation";
import * as storage from "@/src/utils/storage";

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE";

if (Platform.OS !== "web") {
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
}

const App = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [isNetworkLoaded, setIsNetworkLoaded] = useState(false);
  const { authApi } = useAuthHook(api);
  const { network } = useAppStore();
  const { isInternetReachable } = useNetInfo();
  const [isFontsLoaded] = useFonts(fontsToLoad);
  const codePush = useCodePushProvider();
  const colorScheme = useColorScheme();
  const { isRestored: isNavigationStateRestored } = useNavigationPersistence(
    storage,
    NAVIGATION_PERSISTENCE_KEY
  );

  // handle back button
  useBackButtonHandler((routeName) => Config.exitRoutes.includes(routeName));

  useEffect(() => {
    if (isFontsLoaded && isNetworkLoaded) {
      setIsReady(true);
    }
  }, [isFontsLoaded, isNetworkLoaded]);

  useEffect(() => {
    if (isNavigationStateRestored && isReady && codePush.isCodePushReady) {
      SplashScreen.hideAsync();
    }
  }, [isNavigationStateRestored, isReady, codePush.isCodePushReady]);

  // handle network and internet connection
  useEffect(() => {
    if (typeof isInternetReachable === "boolean") {
      setIsNetworkLoaded(true);
      network.setIsOnline(isInternetReachable);
    }
  }, [isInternetReachable]);

  if (!isReady) return null;

  return (
    <CodePushProvider provider={codePush}>
      <DBConnectionProvider>
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
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              {children}
              <StatusBar style="auto" />
            </ThemeProvider>
          </SWRConfig>
        </GestureHandlerRootView>
      </DBConnectionProvider>
    </CodePushProvider>
  );
};

export default App;
