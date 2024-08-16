import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";
import useShowToast from "../hooks/useShowToast";
import {FiLogOut} from 'react-icons/fi'
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const showToast = useShowToast();
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    if(loading) return;
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
      navigate('/auth');
    } catch (error) {
      showToast("error", "something went wrong when logout", "error");
    }finally{
       setLoading(false);
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
      {loading ? <Spinner size={"sm"}/> : <FiLogOut size={20}/> }
    </Button>
  );
};

export default LogoutButton;
