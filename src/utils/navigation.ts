import {
  NavigationState,
  PartialState,
  createNavigationContainerRef,
  useNavigationState,
} from "@react-navigation/native";
import { useNavigationContainerRef } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { BackHandler, Platform } from "react-native";

import * as storage from "./storage";

import Config from "@/src/config";
import { useIsMounted } from "@/src/utils/useIsMounted";

type Storage = typeof storage;
type State = NavigationState | PartialState<NavigationState>;

/**
 * Reference to the root App Navigator.
 *
 * If needed, you can use this to access the navigation object outside of a
 * `NavigationContainer` context. However, it's recommended to use the `useNavigation` hook whenever possible.
 * @see https://reactnavigation.org/docs/navigating-without-navigation-prop/
 *
 * The types on this reference will only let you reference top level navigators. If you have
 * nested navigators, you'll need to use the `useNavigation` with the stack navigator's ParamList type.
 */
export const navigationRef = createNavigationContainerRef();

/**
 * Gets the current screen from any navigation state.
 */
export function getActiveRouteName(state: State): string {
  const route = state.routes[state.index ?? 0];

  // Found the active route -- return the name
  if (!route.state) return route.name;

  // Recursive call to deal with nested routers
  return getActiveRouteName(route.state);
}

/**
 * Hook that handles Android back button presses and forwards those on to
 * the navigation or allows exiting the app.
 */
export function useBackButtonHandler(canExit: (routeName: string) => boolean) {
  // ignore if iOS ... no back button!
  if (Platform.OS === "ios") return;

  // The reason we're using a ref here is because we need to be able
  // to update the canExit function without re-setting up all the listeners
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const canExitRef = useRef(canExit);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    canExitRef.current = canExit;
  }, [canExit]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // We'll fire this when the back button is pressed on Android.
    const onBackPress = () => {
      if (!navigationRef.isReady()) {
        return false;
      }

      // grab the current route
      const routeName = getActiveRouteName(navigationRef.getRootState());

      // are we allowed to exit?
      if (canExitRef.current(routeName)) {
        // exit and let the system know we've handled the event
        BackHandler.exitApp();
        return true;
      }

      // we can't exit, so let's turn this into a back action
      if (navigationRef.canGoBack()) {
        navigationRef.goBack();
        return true;
      }

      return false;
    };

    // Subscribe when we come to life
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    // Unsubscribe when we're done
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, []);
}

/**
 * Custom hook for persisting navigation state.
 */
export function useNavigationPersistence(
  storage: Storage,
  persistenceKey: string
) {
  const ref = useNavigationContainerRef();
  const state = useNavigationState((state) => state);
  const isMounted = useIsMounted();
  const initNavState = !Config.persistNavigation;
  const [isRestored, setIsRestored] = useState(initNavState);

  useEffect(() => {
    if (state.key) {
      if (!isRestored) {
        restoreState();
        return;
      }

      onNavigationStateChange(state);
    }
  }, [state]);

  useEffect(() => {
    navigationRef.current = ref;
  }, [ref]);

  const onNavigationStateChange = (stateValue: State | undefined) => {
    if (stateValue !== undefined) {
      // Persist state to storage
      storage.save(persistenceKey, stateValue);
    }
  };

  const restoreState = () => {
    try {
      const stateValue = storage.load<State>(persistenceKey);
      if (stateValue) navigationRef.reset(stateValue);
    } finally {
      if (isMounted()) setIsRestored(true);
    }
  };

  return {
    isRestored,
  };
}

/**
 * use this to navigate without the navigation
 * prop. If you have access to the navigation prop, do not use this.
 * @see https://reactnavigation.org/docs/navigating-without-navigation-prop/
 */
export function navigate(name: unknown, params?: unknown) {
  if (navigationRef.isReady()) {
    // @ts-expect-error
    navigationRef.navigate(name as never, params as never);
  }
}

/**
 * This function is used to go back in a navigation stack, if it's possible to go back.
 * If the navigation stack can't go back, nothing happens.
 * The navigationRef variable is a React ref that references a navigation object.
 * The navigationRef variable is set in the App component.
 */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

/**
 * resetRoot will reset the root navigation state to the given params.
 */
export function resetRoot(
  state: Parameters<typeof navigationRef.resetRoot>[0] = {
    index: 0,
    routes: [],
  }
) {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot(state);
  }
}
