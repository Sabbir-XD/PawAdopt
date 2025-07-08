import { AuthContext } from "@/context/Authintication/AuthContext";
import React, { useContext } from "react";

const UseAuth = () => {
  return useContext(AuthContext);
};

export default UseAuth;
