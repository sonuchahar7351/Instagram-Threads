import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useDispatch, useSelector } from "react-redux";
import useShowToast from "../hooks/useShowToast";
import { useSocket } from "../context/SocketContext";
import { updateLastMessage } from "../features/conversationSlice";
import messageSound from "../assets/sounds/message.mp3";
// import{scrollIntoView} from '@chakra-ui/react'

const MessageContainer = () => {
  const selectedConversation = useSelector(
    (state) => state.selectedConversation
  );
  const showtToast = useShowToast();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useSelector((state) => state.user.preUser);
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const scroller = useRef(null);

  useEffect(() => {
    socket?.on("newMessage", (messsage) => {
     
      if(selectedConversation._id === messsage.conversationId){
        setMessages((prevMessages) => [...prevMessages, messsage]);
      }
      if (!document.hasFocus()) {
				const sound = new Audio(messageSound);
				sound.play();
			}

      dispatch(
        updateLastMessage({
          conversationId: messsage.conversationId,
          messageText: messsage.text,
          sender: messsage.sender,
        })
      );
    });
    return () => socket?.off("newMessage");
  }, [ socket, selectedConversation, dispatch, selectedConversation.mock ]);


  useEffect(()=>{
     const lastMessageIsFromOtherUser = messages.length && messages[messages.length-1].sender !== currentUser._id;

     if(lastMessageIsFromOtherUser){
        socket.emit("markMessagesAsSeen",{
          conversationId: selectedConversation._id,
          userId: selectedConversation.userId,
        });
     }

     const handleMessagesSeen = ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            !message.seen ? { ...message, seen: true } : message
          )
        );
      }
    };
     socket.on("messagesSeen",handleMessagesSeen)

  },[socket, selectedConversation, messages, currentUser._id])

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      setMessages([]);
      try {
        if (selectedConversation.mock) return;

        const res = await fetch(
          `/api/message/messages/${selectedConversation.userId}`
        );
        const data = await res.json();
        if (data.error) {
          showtToast("error", "conversation not started yet", "error");
          return;
        }
        setMessages(data);
      } catch (error) {
        showtToast("error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getMessages();
  }, [selectedConversation.userId, showtToast]);
 
  useEffect(()=>{
    scroller.current?.scrollIntoView({behavior: "smooth"});
  },[messages])


  return (
    <Flex flex={70} bg={useColorModeValue("gray.200", "gray.dark")} borderRadius={"md"} flexDirection={"column"} p={2}>
      {/* Message header */}
      <Flex
        w={"full"}
        h={"12"}
        alignItems={"center"}
        gap={2}
        bg={useColorModeValue("gray.400", "gray.dark")}
        borderRadius={"md"}
        px={2}
      >
        <Avatar src={selectedConversation?.userProfilePic} size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation?.username}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>
      <Divider bg={useColorModeValue("black", "white")} />

      {/* Message body */}

      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        p={2}
        height={{md:"300px", lg:"300px", base:"50vh"}}
        overflowY={"auto"}
      >
        {loading &&
          [0, 1, 2, 3, 4, 5, 6].map((_, i) => (
            <Flex
              key={i}
              gap={3}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex w={"full"} flexDirection={"column"} gap={2}>
                <Skeleton h={"10px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}

        {!loading &&
          messages?.map((message) => (
            <Flex key={message._id}
             direction={"column"}
             ref={messages.length-1 === messages.indexOf(message)? scroller : null}
            >
              <Message
                message={message}
                ownMessage={message.sender === currentUser._id}
              />
            </Flex>
          ))}
      </Flex>
      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
