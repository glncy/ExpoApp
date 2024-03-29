const webOutputHandler = () => {
  // let's use server mode for production
  if (process.env.NODE_ENV === "production") return "server";

  // add SERVER_ENABLED flag to enable server mode
  // for developing api router (api routes still experimental)
  const SERVER_ENABLED = process.env.SERVER_ENABLED === "1";
  if (SERVER_ENABLED) {
    return "server";
  }

  // use single for web development
  // for faster build time
  return "single";
};

const EXPO_UPDATES_KEY = process.env.EXPO_UPDATES_KEY || "";

module.exports = {
  expo: {
    name: "ExpoApp",
    slug: "ExpoApp",
    scheme: "expoapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./src/assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    updates: {
      url: "https://sample-expo-up-server.vercel.app/api/expo-up/manifest",
      enabled: true,
      fallbackToCacheTimeout: 30000,
      requestHeaders: {
        "x-expo-updates-key": EXPO_UPDATES_KEY,
      },
    },
    runtimeVersion: { policy: "appVersion" },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.example.ExpoApp",
      googleServicesFile: "./src/credentials/GoogleService-Info.plist",
    },
    android: {
      package: "com.example.ExpoApp",
      adaptiveIcon: {
        foregroundImage: "./src/assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile: "./src/credentials/google-services.json",
      permissions: ["android.permission.ACCESS_NETWORK_STATE"],
    },
    web: {
      favicon: "./src/assets/favicon.png",
      output: webOutputHandler(),
    },
    experiments: {
      tsconfigPaths: true,
      typedRoutes: true,
    },
    extra: {
      storybookEnabled: process.env.STORYBOOK_ENABLED,
    },
    plugins: [
      "expo-font",
      [
        "expo-build-properties",
        {
          android: {
            extraMavenRepos: [
              "../../node_modules/@notifee/react-native/android/libs",
            ],
          },
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      "@react-native-firebase/app",
      "expo-router",
    ],
  },
};
