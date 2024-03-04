import { create } from "zustand";

interface NavigationContainerState {
  isReady: boolean;
  setIsReady: (isReady: boolean) => void;
}

interface NetworkState {
  isOnline: boolean;
  setIsOnline: (isOnline: boolean) => void;
}
interface AppState {
  navigationContainer: NavigationContainerState;
  network: NetworkState;
}

export const useAppStore = create<AppState>((set) => ({
  navigationContainer: {
    isReady: false,
    setIsReady: (isReady: boolean) =>
      set((state) => ({
        navigationContainer: {
          ...state.navigationContainer,
          isReady,
        },
      })),
  },
  network: {
    isOnline: false,
    setIsOnline: (isOnline: boolean) =>
      set((state) => ({
        network: {
          ...state.network,
          isOnline,
        },
      })),
  },
}));
