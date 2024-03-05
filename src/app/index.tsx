import Constants from "expo-constants";
import { Redirect } from "expo-router";
import { Platform } from "react-native";

let AppEntryPoint = () => {
  return <Redirect href="/auth/login" />;
};

if (
  __DEV__ &&
  Platform.OS !== "web" &&
  Constants.expoConfig &&
  Constants.expoConfig.extra &&
  Constants.expoConfig.extra.storybookEnabled === "1"
) {
  AppEntryPoint = require("@/.storybook").default;
}

export default AppEntryPoint;
