import React from 'react'
import { useDispatch } from 'react-redux';
import useShowToast from './useShowToast';
import { setUser } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {

      const dispatch = useDispatch();     
      const showToast = useShowToast();   

      const navigate = useNavigate();
      const logout = async () => {
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
              console.log(error);
            }
          };

          return logout;
}

export default useLogout