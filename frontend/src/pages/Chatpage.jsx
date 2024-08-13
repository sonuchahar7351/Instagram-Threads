import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GiConversation } from "react-icons/gi";
import { fetchedConversation } from "../features/conversationSlice";
import { setSelectedConversation } from "../features/selectedConversationSlice";
import { useSocket } from "../../context/SocketContext";

const Chatpage = () => {
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.conversation.conversation);
  const selectedConversation = useSelector(
    (state) => state.selectedConversation
  );
  const currentUser = useSelector((state) => state.user.preUser);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/message/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("error", data.error, "error");
          return;
        }

        dispatch(fetchedConversation(data));
      } catch (error) {
        showToast("error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, [showToast, dispatch]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/users/profile/${search}`);
      const searchUser = await res.json();

      if (searchUser.error) {
        showToast("error", searchUser.error, "error");
        return;
      }

      const messagingYourself = searchUser._id === currentUser._id;
      if (messagingYourself) {
        showToast("error", "you can not messege yourself", "error");
        return;
      }

      const conversationAllreadyExist = conversations.find(
        (conversation) => conversation.participants[0]._id === searchUser._id
      );

      if (conversationAllreadyExist) {
        dispatch(
          setSelectedConversation({
            _id: conversationAllreadyExist._id,
            userId: searchUser._id,
            username: searchUser.username,
            profilePic: searchUser.profilePic,
          })
        );
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchUser._id,
            username: searchUser.username,
            profilePic: searchUser.profilePic,
          },
        ],
      };

      dispatch(fetchedConversation([...conversations, mockConversation]));

      setSearch("");
    } catch (error) {
      showToast("error", error.message, "error");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <Box
      position={"absolute"}
      w={{
        lg: "750px",
        md: "100%",
        base: "100%",
      }}
      left={"50%"}
      transform={"translateX(-50%)"}
      p={4}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
          lg: "row",
        }}
        maxW={{
          base: "600px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your conversation
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search for a user"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
              <Button
                size={"sm"}
                onClick={handleConversationSearch}
                isLoading={searchLoading}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {loading &&
            [0, 1, 2, 3, 4, 5].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={1}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}
          {!loading &&
            conversations?.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers?.includes(
                  conversation?.participants[0]?._id
                )}
                conversation={conversation}
              />
            ))}
        </Flex>
        {!selectedConversation?._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        )}
        {selectedConversation?._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default Chatpage;
