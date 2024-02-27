/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 *
 * DO NOT DELETE THE FOLLOWING GENERATOR COMMENTS. THEY ARE USED BY THE GENERATOR.
 * - GENERATOR_ANCHOR_SCREEN_IMPORTS
 * - GENERATOR_ANCHOR_PARAM_LIST
 * - GENERATOR_ANCHOR_SCREENS
 */
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigationState,
  NavigatorScreenParams,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Platform, useColorScheme } from "react-native";

// GENERATOR_ANCHOR_NAV_IMPORTS
import {
  getActiveRouteName,
  navigationRef,
  useBackButtonHandler,
} from "./navigationUtilities";
import Config from "../config";
import * as Screens from "../screens";
import { colors } from "../theme";

import { useAppStore } from "@/src/store/useAppStore";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId:
    Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
      : undefined,
  offlineAccess: false,
});

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  WelcomeScreen: undefined;
  // GENERATOR_ANCHOR_PARAM_LIST
};

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const { Navigator, Screen } = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  // for auth

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background(),
      }}
      // Note: authenticated users should be sent to the main flow
      // initialRouteName={isAuthenticated ? "WelcomeScreen" : "WelcomeScreen"}
    >
      <Screen name="WelcomeScreen" component={Screens.WelcomeScreen} />
      {/* GENERATOR_ANCHOR_SCREENS */}
    </Navigator>
  );
};

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: NavigationProps) => {
  const colorScheme = useColorScheme();
  const { navigationContainer } = useAppStore();
  const [routeName, setRouteName] = useState("");

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName));

  const onStateChange = async (state: NavigationState | undefined) => {
    if (state) {
      const newRouteName = getActiveRouteName(state);
      if (routeName !== newRouteName) {
        setRouteName(newRouteName);
      }
    }

    if (props.onStateChange) {
      await props.onStateChange(state);
    }
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        navigationContainer.setIsReady(true);
      }}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      onStateChange={onStateChange}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  );
};
