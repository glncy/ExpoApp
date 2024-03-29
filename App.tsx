import Constants from "expo-constants";
import { ExpoRoot } from "expo-router";
import { RequireContext } from "expo-router/build/types";
import { Platform } from "react-native";

export const App = () => {
  const ctx = require.context("./src/app") as RequireContext;
  return <ExpoRoot context={ctx} />;
};

let Entry = App;

// Storybook
if (
  __DEV__ &&
  Platform.OS !== "web" &&
  Constants.expoConfig &&
  Constants.expoConfig.extra &&
  Constants.expoConfig.extra.storybookEnabled === "1"
) {
  Entry = require("./.storybook").default;
}

export default Entry;
