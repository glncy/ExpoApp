import { Platform } from "react-native";

export interface ConfigBaseProps {
  persistNavigation: boolean;
  catchErrors: boolean;
  exitRoutes: string[];
  API_URL: string;
  BASE_URL: string;
  CODEPUSH_DEPLOYMENT_KEY: string | undefined;
}

const Config: ConfigBaseProps = {
  // This feature is particularly useful in development mode, but
  // can be used in production as well if you prefer.
  persistNavigation: process.env.EXPO_PUBLIC_PERSIST_NAVIGATION
    ? Boolean(Number(process.env.EXPO_PUBLIC_PERSIST_NAVIGATION))
    : __DEV__,

  /**
   * Only enable if we're catching errors in the right environment
   */
  catchErrors: process.env.EXPO_PUBLIC_CATCH_ERRORS
    ? Boolean(Number(process.env.EXPO_PUBLIC_CATCH_ERRORS))
    : __DEV__,

  /**
   * This is a list of all the route names that will exit the app if the back button
   * is pressed while in that screen. Only affects Android.
   */
  exitRoutes: ["/auth/login"],

  // .env
  API_URL: process.env.EXPO_PUBLIC_API_URL,

  // remove /api from the end of the url for baseUrl
  BASE_URL: process.env.EXPO_PUBLIC_API_URL?.replace(/\/api$/, ""),

  // CodePush deployment key
  CODEPUSH_DEPLOYMENT_KEY: Platform.select({
    ios: process.env.EXPO_PUBLIC_CODEPUSH_DEPLOYMENT_KEY_IOS || undefined,
    android:
      process.env.EXPO_PUBLIC_CODEPUSH_DEPLOYMENT_KEY_ANDROID || undefined,
    default: undefined,
  }),
};

export default Config;
