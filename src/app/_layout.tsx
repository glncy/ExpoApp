import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import App from "@/src/app";
import { colors } from "@/src/theme";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
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
