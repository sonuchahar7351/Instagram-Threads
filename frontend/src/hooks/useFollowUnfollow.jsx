import React, { useState } from "react";
import useShowToast from "./useShowToast";
import { useSelector } from "react-redux";

const useFollowUnfollow = (user) => {
  const currentUser = useSelector((state) => state.user.preUser);
  const [following, setFollowing] = useState( user.followers.includes(currentUser?._id) );
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();
  const handleFollowUnFollow = async () => {
    if (!currentUser) {
      showToast("error", "please login", "error");
      return;
    }
    if (updating) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
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
      //  console.log(data);
      if (following) {
        showToast("success", `UnFollow ${user.name}`, "success");
        user.followers.pop();
      } else {
        showToast("success", `Follow ${user.name}`, "success");
        user.followers.push(currentUser?._id); // simulate adding followers
      }

      setFollowing(!following);
    } catch (error) {
      showToast("error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  return { handleFollowUnFollow, updating, following };
};

export default useFollowUnfollow;
