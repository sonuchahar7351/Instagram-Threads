import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useDispatch, useSelector } from "react-redux";
import { fetchedPosts } from "../features/postSlice";

const UserPage = () => {
  const { username } = useParams();
  const {user,loading} = useGetUserProfile();
  const showToast = useShowToast();
  const [fetching,setFetching] = useState(true);
  const dispatch = useDispatch();
  const posts = useSelector((state)=>state.post.posts);

  useEffect(() => {    
  
    const getPosts = async () =>{
       try {
        const res = await fetch(`/api/posts/user/${username}`)
        const data = await res.json();
        if(data.error){
          showToast("error","error in somecases","error");
          return;
        }
        dispatch(fetchedPosts(data));
        } 
        catch (error) {
        showToast("error","something went wrong while fetching posts","error")
       }finally{
        setFetching(false);
       }
     }
    getPosts();
  }, [username,dispatch]);
  if(!user && loading){
    return (
     <Flex justifyContent={"center"}>
       <Spinner size={"xl"}/>
     </Flex>
    )
  }
  if(!user && !loading){
    return <h1>User not found</h1>
  }
  return (
    <>
      <UserHeader user={user} />
      {!fetching && posts?.length === 0 && <h1>User has no posts.</h1>}
      {fetching && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"}/>
        </Flex>
      )} 
      {posts?.map((post)=>(
        <Post key={post._id} post={post} postedBy={post.postedBy}/>
      ))}
    </>
  );
};

export default UserPage;
