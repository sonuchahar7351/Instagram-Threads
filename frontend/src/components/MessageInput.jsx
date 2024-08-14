import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useDispatch, useSelector } from "react-redux";
import { updateLastMessage } from "../features/conversationSlice";
import { BsFillImageFill } from "react-icons/bs";
import UsePreviewimg from "../hooks/UsePreviewimg";

const MessageInput = ({ setMessages }) => {
  const conversation = useSelector((state) => state.conversation.conversation);
  const selectedConversation = useSelector(
    (state) => state.selectedConversation
  );
  const [messageText, setMessageText] = useState("");
  const dispatch = useDispatch();
  const showToast = useShowToast();
  const { onClose } = useDisclosure();
  const imageRef = useRef(null);
  
  const  { handleImageChange, imageUrl, setImageUrl } = UsePreviewimg();
  const [sending,setSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim().length === 0 && !imageUrl) return;
    if(sending) return;

     setSending(true)
    try {
      const res = await fetch(`/api/message/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          receiverId: selectedConversation.userId,
          img: imageUrl,
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
      setImageUrl("");
    } catch (error) {
      showToast("error", "error when sending message", "error");
    }finally{
      setSending(false)
    }
  };
  return (
    <Flex alignItems={"center"} gap={2}>
      <Flex flex={5} cursor={"pointer"}>
        <BsFillImageFill size={30} onClick={() => imageRef.current.click()} />
        <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
      </Flex>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
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

      <Modal isOpen={imageUrl} onClose={()=>{onClose(); setImageUrl("")}}>
        <ModalOverlay/>
        <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <Flex mt={5} w={"full"}>
             <Image src={imageUrl}/>
          </Flex>
          <Flex justifyContent={"flex-end"} my={2}>
            {!sending ? (<IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />):(<Spinner size={"md"}/>)}
          </Flex>
        </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;
