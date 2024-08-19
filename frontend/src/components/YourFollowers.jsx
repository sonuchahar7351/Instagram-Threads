import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import useShowToast from '../hooks/useShowToast';
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react';
import Followers from './Followers';
import { SearchIcon } from '@chakra-ui/icons';

const YourFollowers = () => {
  const currentUser = useSelector(state=>state.user.preUser);
  const [search,setSearch] = useState("");
  const [followers,setFollowers] = useState(null);
  const showToast = useShowToast();
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    const getUser = async ()=>{
       setLoading(true);
       try {
            const res = await fetch(`/api/users/your-followers/${currentUser._id}`);
            const data = await res.json();
            if (data.error) {
               showToast("error",data.error,"error");
               return;
            }
          setFollowers(data);

       } catch (error) {
           showToast("error","error while fething your followers","error") 
       }finally{
            setLoading(false);
       }
    }

  getUser();

  },[])

  return (
      <>
        <Text mb={6} fontWeight={"bold"} textAlign={"center"} fontSize={"xl"}>
          Your Followers {followers?.length}
        </Text>

        <Flex direction={"column"} gap={4}>
      <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search for a user"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                size={{ base: "sm", md: "md", lg: "md" }}
              >
                <SearchIcon />
              </Button>
        </Flex>

      {!loading &&  followers?.length > 0 && (followers.filter((follower) =>{
        return search.toLocaleLowerCase().trim() === "" ? follower : follower.username.toLocaleLowerCase().includes(search.toLocaleLowerCase().trim())
      }).map(follower => <Followers key={follower._id} follower={follower}/>))}
      {!loading && followers?.length === 0 && <Text>you have no followers</Text>}
        {loading &&
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((i) => (
            <Flex
              key={i}
              gap={2}
              p={1}
              alignItems={"center"}
              borderRadius={"md"}
            >
              <Box>
                <SkeletonCircle size={"16"} />
              </Box>
              <Flex w={"full"} flexDirection={"column"} gap={2}>
                <Skeleton h={"20px"} w={"120px"} />
                <Skeleton h={"20px"} w={"130px"} />
              </Flex>
              <Flex>
                <Skeleton h={"35px"} w={"100px"} />
              </Flex>
            </Flex>
          ))}
      </Flex>
      </>
    );
}

export default YourFollowers