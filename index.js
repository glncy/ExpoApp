import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import codePush from "react-native-code-push";

import Config from "@/src/config";

export const App = () => {
  const ctx = require.context("./src/app");
  return <ExpoRoot context={ctx} />;
};

// CodePush Installation
const RootApp = Config.IS_RELEASE
  ? codePush({ checkFrequency: codePush.CheckFrequency.MANUAL })(App)
  : App;

registerRootComponent(RootApp);
