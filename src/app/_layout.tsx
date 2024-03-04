import Constants from "expo-constants";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import App from "@/src/app";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  if (
    Constants.expoConfig &&
    Constants.expoConfig.extra &&
    Constants.expoConfig.extra.storybookEnabled === "1"
  ) {
    SplashScreen.hideAsync();
    return <Slot />;
  }

  return (
    <App>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
      </Stack>
    </App>
  );
}
