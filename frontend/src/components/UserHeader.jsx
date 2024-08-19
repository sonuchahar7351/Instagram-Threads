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
  useColorMode,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useSelector } from "react-redux";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
const UserHeader = ({ user }) => {
      const toast = useToast()
      const currentUser = useSelector((state)=>state.user.preUser);      
      
     const{handleFollowUnFollow,updating,following} = useFollowUnfollow(user);
      

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
      <Text>{user.bio.length > 80 ? user.bio.substring(0, 80) + "..." : user.bio}</Text>
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
          {currentUser?._id === user._id ?<Text color={"gray.light"} as={Link} to={"/your-followers"}>{user.followers.length} followers</Text>
           :
           <Text color={"gray.light"}>{user.followers.length} followers</Text>
        }
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
                  <MenuList bg={useColorModeValue("gray.200","black")}>
                        <MenuItem bg={useColorModeValue("gray.200","black")} onClick={copyURL} fontWeight={"500"}
                         color={useColorModeValue("black","white")}
                        >Copy link</MenuItem>
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
