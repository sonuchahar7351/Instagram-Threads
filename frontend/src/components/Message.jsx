import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { BsCheck2All } from "react-icons/bs";
import { useSelector } from "react-redux";

const Message = ({ ownMessage, message }) => {

  const selectedConversation = useSelector(
    (state) => state.selectedConversation
  );
  const user = useSelector((state) => state.user.preUser);

  return (
    <>
      {ownMessage ? (
        <Flex alignSelf={"flex-end"} gap={2}>
          <Flex
            bg="green.700"
            maxW="350px"
            p={2}
            borderRadius="md"
            align="center"
          >
            <Text color="white">{message.text}</Text>
            <Box
              alignSelf="flex-end"
              ml={2}
              color={message.seen ? "blue.400" : "gray.400"} // Default color when not seen
              fontWeight="bold"
            >
              <BsCheck2All size={16} />
            </Box>
          </Flex>
          <Avatar src={user?.profilePic} w={"7"} h={7} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src={selectedConversation?.userProfilePic} w={"7"} h={7} />
          <Text
            maxW={"350px"}
            bg={"gray.400"}
            p={1}
            borderRadius={"md"}
            color={"black"}
          >
            {message?.text}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;
