import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsCheck2All } from "react-icons/bs";
import { useSelector } from "react-redux";


const Message = ({ ownMessage, message }) => {
  const [imageLoad,setImageLoad] = useState(false);

  const selectedConversation = useSelector(
    (state) => state.selectedConversation
  );
  const user = useSelector((state) => state.user.preUser);

  return (
    <>
      {ownMessage ? (
        <Flex alignSelf={"flex-end"} gap={2}>
          {message.text && (
            <Flex
              bg="green.700"
              maxW="350px"
              p={2}
              borderRadius="md"
              align="center"
            >
              <Text color="white">{message.text}</Text>
              <Flex
                alignSelf="flex-end"
                ml={2}
                color={message.seen ? "blue.400" : "gray.400"} // Default color when not seen
                fontWeight="bold"
              >
                <BsCheck2All size={16} />
              </Flex>
            </Flex>
          )}
          {message.img && !imageLoad && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} alt="message image" borderRadius={4} hidden onLoad={()=>setImageLoad(true)} />
                <Skeleton w={"200px"} h={"200px"}/>
            </Flex>
          )}
        { message.img && imageLoad && (
          <Flex mt={5} w={"200px"}>
          <Image src={message.img} alt="message image" borderRadius={4}/>
          <Box
                alignSelf="flex-end"
                ml={2}
                color={message.seen ? "blue.400" : "gray.400"} // Default color when not seen
                fontWeight="bold"
              >
                <BsCheck2All size={16} />
              </Box>
        </Flex>
        )}

          <Avatar src={user?.profilePic} w={"7"} h={7} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src={selectedConversation?.userProfilePic} w={"7"} h={7} />
          {message.text && (
            <Text
              maxW={"350px"}
              bg={"gray.400"}
              p={1}
              borderRadius={"md"}
              color={"black"}
            >
              {message?.text}
            </Text>
          )}
          {message.img && !imageLoad && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} alt="message image" borderRadius={4} hidden onLoad={()=>setImageLoad(true)} />
                <Skeleton w={"200px"} h={"200px"}/>
            </Flex>
          )}
        { message.img && imageLoad && (
          <Flex mt={5} w={"200px"}>
          <Image src={message.img} alt="message image" borderRadius={4}/>
        </Flex>
        )}
        </Flex>
      )}
    </>
  );
};

export default Message;
