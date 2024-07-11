import Config from "@/src/config";
import { createAxiosInstance } from "@/src/utils/axios/initialApi";
import { loadString } from "@/src/utils/storage";

const initialApi = createAxiosInstance();

initialApi.interceptors.request.use(
  function (config) {
    const accessToken = loadString(Config.ACCESS_TOKEN_KEY);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.headers.common.Authorization;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

initialApi.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export const authApi = initialApi;
