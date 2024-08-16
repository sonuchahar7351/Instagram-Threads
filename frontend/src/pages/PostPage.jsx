import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
  useStatStyles,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Actions } from "../components/Actions";
import Comment from "../components/Comment";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { fetchedPosts } from "../features/postSlice";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const showToast = useShowToast();
  const { pid } = useParams();
  const posts = useSelector((state) => state.post.posts);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.preUser);
  const navigate = useNavigate();
  const currentPost = posts[0];
  useEffect(() => {
    const getPost = async () => {
      dispatch(fetchedPosts([]));
      try {
        const res = await fetch(`/api/posts/post/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("error", data.error, "error");
          return;
        }
        dispatch(fetchedPosts([data]));
      } catch (error) {
        showToast("error", "error", "error");
      }
    };
    getPost();
  }, [dispatch, pid]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("error", data.error, "error");
        return;
      }

      showToast("success", "post deleted succussfully", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("error", "error when post deleting", "error");
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name={user.name} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src="/verified.png" w="4" h="4" ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray-light"}
          >
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && (
            <DeleteIcon
              cursor={"pointer"}
              size={20}
              onClick={handleDeletePost}
            />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>
      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👏</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {currentPost.replies?.length > 0 ? (
        currentPost.replies.map((reply) => (
          <Comment
            key={reply._id}
            reply={reply}
            lastReply={
              reply._id ===
              currentPost.replies[currentPost.replies.length - 1]._id
            }
          />
        ))
      ) : (
        <Text>No replies yet.</Text>
      )}
    </>
  );
};

export default PostPage;
