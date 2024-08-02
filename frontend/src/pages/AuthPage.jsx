import React, { useState } from "react";
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import { useSelector } from "react-redux";

const AuthPage = () => {
  const authScreenState = useSelector((state) => state.auth.screen);

  return <>{authScreenState === "login" ? <Login /> : <SignUp />}</>;
};

export default AuthPage;
