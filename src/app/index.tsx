import Constants from "expo-constants";
import { Redirect } from "expo-router";

let AppEntryPoint = () => {
  return <Redirect href="/auth/login" />;
};

if (
  Constants.expoConfig &&
  Constants.expoConfig.extra &&
  Constants.expoConfig.extra.storybookEnabled === "1"
) {
  AppEntryPoint = require("@/.storybook").default;
}

export default AppEntryPoint;
