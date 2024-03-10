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
      [
        "react-native-code-push-plugin",
        {
          android: {
            CodePushDeploymentKey: "cCSNRJgq1_pITIdWiRs-2XlhmOWeeaFv2a7yx",
          },
          ios: {
            CodePushDeploymentKey: "OxINo08obR7Ey3dhj-Nr-P0s8FVQdTeqpotyy",
          },
        },
      ],
    ],
  },
};
