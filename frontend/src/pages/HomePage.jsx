import { Box, Flex, Spinner, useStatStyles } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { fetchedPosts } from "../features/postSlice";
import SuggestedUsers from "../components/SuggestedUsers";
import AllUsers from "../components/AllUsers";

const HomePage = () => {
  const showToast = useShowToast();
  const posts = useSelector((state) => state.post.posts);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeedPost = async () => {
      dispatch(fetchedPosts([]));
      setLoading(true);
      
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("error",data.error, "error");
          return;
        }
        dispatch(fetchedPosts(data));
      } catch (error) {
        showToast("error", "error while fetching feed", "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPost();
  }, []);
  
  useEffect(()=>{
    return ()=>{
      dispatch(fetchedPosts([]))
    }
  },[])

  return (
    <Flex gap="10" alignItems={"flex-start"}>
      <Box flex={70}>
        {!loading && posts?.length === 0 && (
          <h1 alignItems={"center"}>Follow some users to see the feed</h1>

        )}
        {loading && (
          <Flex justify={"center"} mt={"30%"}>
            <Spinner size={"xl"} />
          </Flex>
        )}
        {posts.length > 0 && posts.map((post) => (
          <Post key={post?._id} post={post} postedBy={post.postedBy ? post.postedBy._id : null} />
        ))}
      </Box>
      <Box flex={30}
       display={{
        base:"none",
        md:"block"
       }}
      >
        <SuggestedUsers/>
      </Box>
    </Flex>
  );
};

export default HomePage;
