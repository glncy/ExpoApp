import { Axios } from "axios";
import { useEffect } from "react";

import { useAuthStore } from "@/src/store/useAuthStore";

export const useAuthHook = (authApi: Axios) => {
  const authStore = useAuthStore();

  useEffect(() => {
    // change authApi defaults
    if (authStore.accessToken) {
      authApi.defaults.headers.common.Authorization = `Bearer ${authStore.accessToken}`;
    } else {
      delete authApi.defaults.headers.common.Authorization;
    }
  }, [authStore.accessToken]);

  return { authApi };
};
