import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useDispatch, useSelector } from "react-redux";
import {  updateLastMessage } from "../features/conversationSlice";

const MessageInput = ({ setMessages }) => {

  const conversation = useSelector((state) => state.conversation.conversation);
  const selectedConversation = useSelector(
    (state) => state.selectedConversation
  );
  const dispatch = useDispatch();

  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim().length === 0) return;
    try {
      const res = await fetch(`/api/message/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          receiverId: selectedConversation.userId,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("error", data.error, "error");
      }
      setMessages((messages) => [...messages, data]);
      dispatch(
        updateLastMessage({
          conversationId: selectedConversation._id,
          messageText: messageText,
          sender: data.sender,
        })
      );
      setMessageText("");

    } catch (error) {
      showToast("error", "error when sending message", "error");
    }
  };
  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
        <Input
          w={"full"}
          placeholder="Type a message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <InputRightElement cursor={"pointer"} onClick={handleSendMessage}>
          <IoSendSharp />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;


// setConversations(pre =>{
//   const updataedConversations = pre.map(conversation=>{
//     if(conversation._id === selectedConversation._id){
//       return{
//         ...conversation,
//         lastMessage:{
//           text:messageText,
//           sender:data.sender
//         }
//       }
//     }
//     return conversation
//   })
//   return updataedConversations;
// })