import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useSelector } from "react-redux";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({ user }) => {
      const toast = useToast()
      const currentUser = useSelector((state)=>state.user.preUser);
      const [following,setFollowing] = useState(user.followers.includes(currentUser?._id));
      
      const showToast = useShowToast();
      const [updating,setUpdating] = useState(false);

      const handleFollowUnFollow = async()=>{
        if(!currentUser){
          showToast("error","please login","error");
          return;
        }
        if(updating) return;

        setUpdating(true);
        try {
             const res = await fetch(`/api/users/follow/${user._id}`,{
              method:"POST",
               headers : {
                "Content-Type" : "application/json"
               }

             })
             const data = await res.json();
             if(data.error){
              showToast("error",data.error,"error");
              return
             }
            //  console.log(data);
            if(following){
              showToast("success",`UnFollow ${user.name}`,"success");
              user.followers.pop();
            }else{
              showToast("success",`Follow ${user.name}`,"success");
              user.followers.push(currentUser?._id); // simulate adding followers
            }
            
            setFollowing(!following)
          
        } catch (error) {
           showToast("error",error,"error")
        }finally{
          setUpdating(false)
        }
        
      }

      const copyURL =()=>{
            const currentURL=window.location.href;
            navigator.clipboard.writeText(currentURL).then(()=>{
                 toast({
                  title:"Account created",
                  status:"success",
                  description:"Profile link copied",
                  duration:3000,
                  isClosable:true,
                 })
            })
      }
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
           {user?.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user?.username}</Text>
            <Text
              fontSize={
                {
                  base:"xs",
                  md:"sm",
                  'lg':"md",
                }
              }
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              Threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
            name={user?.name}
            src={user?.profilePic}
            size={{
              base: "md",
              md: "xl",
            }}
            />
          )}
          {!user.profilePic && (
            <Avatar
            name={user.name}
            src="https://bit.ly/broken-link"
            size={{
              base: "md",
              md: "xl",
            }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>
      {currentUser?._id === user?._id && (
        <Link to="/update">
            <Button size={"sm"}> Update Profile</Button>
        </Link>
      )}
       {currentUser?._id !== user._id && (
        
            <Button size={"sm"} onClick={handleFollowUnFollow} isLoading={updating}>
              {following ? "UnFollow" : "Follow"}
            </Button>
      
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                  <MenuList bg={"gray.dark"}>
                        <MenuItem bg={"gray.dark"} onClick={copyURL}>Copy link</MenuItem>
                  </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
            <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                  <Text fontWeight={"bold"}>Threads</Text>
            </Flex>
            <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} color={"gray.light"} pb="3" cursor={"pointer"}>
                  <Text fontWeight={"bold"}>Replies</Text>
            </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
