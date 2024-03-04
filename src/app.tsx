import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { ReactNode, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { SWRConfig } from "swr";

import { useAuthHook } from "@/src/hooks/useAuthHook";
import { useAppStore } from "@/src/store/useAppStore";
import { fontsToLoad } from "@/src/theme/typography";
import { api } from "@/src/utils/axiosInstance";

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE";

const App = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const { authApi } = useAuthHook(api);
  const { network } = useAppStore();
  const { isInternetReachable } = useNetInfo();
  const [isFontsLoaded] = useFonts(fontsToLoad);
  const [isNetworkLoaded, setIsNetworkLoaded] = useState(false);

  useEffect(() => {
    if (isFontsLoaded && isNetworkLoaded) {
      setIsReady(true);
    }
  }, [isFontsLoaded, isNetworkLoaded]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  // handle network and internet connection
  useEffect(() => {
    if (typeof isInternetReachable === "boolean") {
      setIsNetworkLoaded(true);
      network.setIsOnline(isInternetReachable);
    }
  }, [isInternetReachable]);

  if (!isReady) return null;

  return (
    <SWRConfig
      value={{
        fetcher: (resource) => authApi.get(resource).then((res) => res.data),
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
  );
};

export default App;
