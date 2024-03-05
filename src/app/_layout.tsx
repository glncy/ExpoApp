import Constants from "expo-constants";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import App from "@/src/app";
import { colors } from "@/src/theme";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  // ----------------
  // Storybook
  if (
    Constants.expoConfig &&
    Constants.expoConfig.extra &&
    Constants.expoConfig.extra.storybookEnabled === "1"
  ) {
    SplashScreen.hideAsync();
    return <Slot />;
  }
  // ----------------

  return (
    <App>
      <Stack
        screenOptions={{
          headerShown: false,
          navigationBarColor: colors.background(),
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
      </Stack>
    </App>
  );
};

export default RootLayout;
