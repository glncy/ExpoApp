export interface ConfigBaseProps {
  persistNavigation: boolean;
  catchErrors: boolean;
  exitRoutes: string[];
  API_URL: string;
  BASE_URL: string;
  IS_RELEASE: boolean;
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

  // is release
  IS_RELEASE: !__DEV__,
};

export default Config;
