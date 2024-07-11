import axios, { CreateAxiosDefaults } from "axios";

import Config from "@/src/config";

export const createAxiosInstance = (axiosDefaults?: CreateAxiosDefaults) => {
  return axios.create({
    baseURL: axiosDefaults?.baseURL ?? Config.API_URL,
    timeout: axiosDefaults?.timeout ?? 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

const initialApi = createAxiosInstance();

initialApi.interceptors.request.use(
  function (config) {
    // Do something before request is sent
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

export const api = initialApi;
