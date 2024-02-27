import { create } from "zustand";

interface NavigationContainerState {
  isReady: boolean;
  setIsReady: (isReady: boolean) => void;
}
interface AppState {
  navigationContainer: NavigationContainerState;
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
}));
