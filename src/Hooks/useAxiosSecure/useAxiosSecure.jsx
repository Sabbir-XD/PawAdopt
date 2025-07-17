import axios from "axios";
import React, { useEffect } from "react";
import UseAuth from "../UseAuth/UseAuth";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your server URL
  withCredentials: true,
});
const useAxiosSecure = () => {
  const { user, handleLogoutUser } = UseAuth();

  // Add a request interceptor to include the Authorization header with the token
  useEffect(() => {
    // Add a request interceptor
    const interceptor = axiosInstance.interceptors.request.use(function (
      config
    ) {
      // Do something before request is sent
      return config;
    });


    //response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        handleLogoutUser();
      }
      return Promise.reject(error);
    }
  );

  // Cleanup to remove old interceptor
  return () => {
    axiosInstance.interceptors.request.eject(interceptor);
  }
  }, [user, handleLogoutUser]);


  return axiosInstance;
};

export default useAxiosSecure;
