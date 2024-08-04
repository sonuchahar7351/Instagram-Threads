import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("error", data.error, "error");
      }finally{
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

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
      <UserPost
        likes={1200}
        replies={421}
        postImg="/post1.png"
        postTitle="Let's talk about threads."
      />
      <UserPost
        likes={120}
        replies={41}
        postImg="/post2.png"
        postTitle="Nice tutorial"
      />
      <UserPost
        likes={180}
        replies={21}
        postImg="/post3.png"
        postTitle="I love this guy."
      />
      <UserPost
        likes={1800}
        replies={210}
        postImg="/post4.png"
        postTitle="This is my first Threads."
      />
    </>
  );
};

export default UserPage;
