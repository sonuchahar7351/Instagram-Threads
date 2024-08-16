import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  useColorModeValue,
  WrapItem,
  useColorMode,
  Box
} from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {BsCheck2All} from 'react-icons/bs'
import { setSelectedConversation } from "../features/selectedConversationSlice";

const Conversation = ({conversation, isOnline}) => {
 
  const colorMode = useColorMode();
  const user = conversation.participants[0];
  const lastMessage = conversation.lastMessage;
  const currentUser = useSelector((state)=>state.user.preUser);
  const selectedConversation = useSelector((state)=>state.selectedConversation);
  const dispatch = useDispatch();
 
 
  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={1}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.400", "gray.dark"),
        color: "white",
      }}
      borderRadius={"md"}
      onClick={()=>{
        dispatch(setSelectedConversation({
          _id:conversation?._id,
          userId:user?._id,
          userProfilePic:user?.profilePic,
          username:user?.username,
          mock:conversation.mock,
        }))
        
      }}
      bg={selectedConversation?._id === conversation?._id ? (colorMode==="light"?"gray.400":"gray.dark") : ""}
      color={selectedConversation?._id === conversation?._id ? (colorMode === "light"?"black":"white") : ""}
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={user?.profilePic}
        >
        {isOnline ? <AvatarBadge boxSize={"1rem"} bg={"green.500"} /> : ''}
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {user?.username} <Image src="/verified.png" w={"4"} h={"4"} ml={3} />
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {currentUser?._id === lastMessage?.sender ?(
            <Box color={lastMessage?.seen ? "blue.500":""}>
               <BsCheck2All size={16}/> 
            </Box>
          ): ""}
           {lastMessage?.text.length>18 ? lastMessage.text.substring(0,18)+"..." : lastMessage.text }
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;
