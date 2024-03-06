import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { RequireContext } from "expo-router/build/types";

import { CodePushHOC } from "@/src/providers/CodePushProvider";

export const App = () => {
  const ctx = require.context("./src/app") as RequireContext;
  return <ExpoRoot context={ctx} />;
};

registerRootComponent(CodePushHOC(App));
