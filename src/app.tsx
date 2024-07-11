// tailwind
import "@/global.css";

// unistyles
import "@/src/theme/unistyles";

import notifee from "@notifee/react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import messaging from "@react-native-firebase/messaging";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { ReactNode, useEffect, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Config from "@/src/config";
import { GoogleSignin } from "@/src/modules/@react-native-google-signin/google-signin";
import { DBConnectionProvider } from "@/src/providers/DBConnectionProvider";
import { useAppStore } from "@/src/store/useAppStore";
import { fontsToLoad } from "@/src/theme/typography";
import {
  useBackButtonHandler,
  useNavigationPersistence,
} from "@/src/utils/navigation";
import * as storage from "@/src/utils/storage";
import { NAV_THEME } from "@/src/utils/tailwind/constants";
import { useColorScheme } from "@/src/utils/tailwind/useColorScheme";

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

// Theming
const THEME_STORAGE_KEY = "APP_THEME";
const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};

const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

const App = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [isNetworkLoaded, setIsNetworkLoaded] = useState(false);
  const { network } = useAppStore();
  const { isInternetReachable } = useNetInfo();
  const [isFontsLoaded] = useFonts(fontsToLoad);
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const { isRestored: isNavigationStateRestored } = useNavigationPersistence(
    storage,
    NAVIGATION_PERSISTENCE_KEY
  );

  // handle back button
  useBackButtonHandler((routeName) => Config.exitRoutes.includes(routeName));

  // handle color scheme
  useEffect(() => {
    (async () => {
      const theme = storage.loadString(THEME_STORAGE_KEY);
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        storage.saveString(THEME_STORAGE_KEY, colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (isFontsLoaded && isNetworkLoaded && isColorSchemeLoaded) {
      setIsReady(true);
    }
  }, [isFontsLoaded, isNetworkLoaded, isColorSchemeLoaded]);

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
    <DBConnectionProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          {children}
          <StatusBar style="auto" />
        </ThemeProvider>
      </GestureHandlerRootView>
    </DBConnectionProvider>
  );
};

export default App;
