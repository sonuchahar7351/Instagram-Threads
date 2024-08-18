import {  createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from 'socket.io-client'

const SocketContext = createContext();

export const useSocket = () => {
      return useContext(SocketContext);
}

export const SocketContextProvider = ({children}) => {

    
      const [socket, setSocket] = useState(null);
      const [onlineUsers, setOnlineUsers] = useState([]);
      const user = useSelector((state)=>state.user.preUser);


      useEffect(()=>{
            const socket = io("/",{
                  query:{
                        userId : user?._id
                  }
            })
            setSocket(socket);
            socket.on("getOnlineUsers",(users)=>{
                   setOnlineUsers(users);
            })
            

           return ()=> socket && socket.close();

      },[])


      return (
            <SocketContext.Provider value={{socket, onlineUsers}}>
                  {children}
            </SocketContext.Provider>
      )
}