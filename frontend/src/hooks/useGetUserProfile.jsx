import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useShowToast from './useShowToast';

const useGetUserProfile = () => {
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const {username} = useParams();
  const showToast = useShowToast();
  useEffect(()=>{
      const getUser = async () => {
            try {
              const res = await fetch(`/api/users/profile/${username}`);
              const data = await res.json();
              if (data.error) {
                showToast("error", data.error, "error");
                return;
              }
              setUser(data);
            } catch (error) {
              showToast("error", data.error, "error");
            }finally{
              setLoading(false);
            }
          };
          getUser();

  },[username])
  return {loading,user}
}

export default useGetUserProfile