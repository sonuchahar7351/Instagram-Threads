import { Button } from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/userSlice";
import useShowToast from "../hooks/useShowToast";
import {FiLogOut} from 'react-icons/fi'

const LogoutButton = () => {
  const user = useSelector((state) => state.user.preUser);
  const dispatch = useDispatch();
  const showToast = useShowToast();
  const handleLogout = async () => {
    try {
      //fetch
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
     
      if (data.error) {
        showToast("error", data.error, "error");
        return;
      }

      localStorage.removeItem("user-threads");
      dispatch(setUser(null));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      position={"fixed"}
      top={"30px"}
      right={"30px"}
      size={"sm"}
      onClick={handleLogout}
    >
      <FiLogOut size={20}/>
    </Button>
  );
};

export default LogoutButton;
