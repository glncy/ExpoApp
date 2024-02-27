import { CompositeScreenProps } from "@react-navigation/native";
/**
 * Change imports below this comment to use a different navigator type.
 * NOTE: Only one navigator type can be used at a time.
 *
 * For example, if you want to use a BottomTabNavigator, change this import to:
 *
 * import {
 *  createBottomTabNavigator,
 *  BottomTabScreenProps,
 * } from "@react-navigation/bottom-tabs";
 *
 * References:
 * - Stack: https://reactnavigation.org/docs/stack-navigator/ (use StackScreenProps)
 * - Native Stack: https://reactnavigation.org/docs/native-stack-navigator/ (use NativeStackScreenProps)
 * - Bottom Tabs: https://reactnavigation.org/docs/bottom-tab-navigator/ (use BottomTabScreenProps)
 * - Drawer: https://reactnavigation.org/docs/drawer-navigator/ (use DrawerScreenProps)
 * - Material Top Tabs: https://reactnavigation.org/docs/material-top-tab-navigator/ (use MaterialTopTabScreenProps)
 * - Material Bottom Tabs: https://reactnavigation.org/docs/material-bottom-tab-navigator/ (use MaterialBottomTabScreenProps)
 *
 * DO NOT DELETE THE FOLLOWING GENERATOR COMMENTS. THEY ARE USED BY THE GENERATOR.
 * - GENERATOR_ANCHOR_SCREEN_IMPORTS
 * - GENERATOR_ANCHOR_PARAM_LIST
 * - GENERATOR_ANCHOR_SCREENS
 */
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React from "react";

import {
  AppStackParamList,
  AppStackScreenProps,
} from "@/src/navigators/AppNavigator";
import { ScreenNameScreen } from "@/src/screens/NavigatorNameNavigator/ImportScreenNameScreen";
// GENERATOR_ANCHOR_SCREEN_IMPORTS

export type NavigatorNameNavParamList = {
  ScreenNameScreen: undefined;
  // GENERATOR_ANCHOR_PARAM_LIST
};

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type NavigatorNameNavScreenProps<
  T extends keyof NavigatorNameNavParamList,
> = CompositeScreenProps<
  NativeStackScreenProps<NavigatorNameNavParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>;

const { Navigator, Screen } =
  createNativeStackNavigator<NavigatorNameNavParamList>();

export const NavigatorNameNavigator = () => {
  return (
    <Navigator screenOptions={{}}>
      <Screen name="ScreenNameScreen" component={ScreenNameScreen} />
      {/* GENERATOR_ANCHOR_SCREENS */}
    </Navigator>
  );
};
