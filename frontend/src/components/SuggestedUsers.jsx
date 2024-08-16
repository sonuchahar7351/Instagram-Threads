import { Box, Flex, Skeleton, SkeletonCircle, SkeletonText, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import SuggestedUser from './SuggestedUser';
import useShowToast from '../hooks/useShowToast';

const SuggestedUsers = () => {
      const [loading,setLoading] = useState(true);
      const [SuggestedUsers, setSuggestedUsers] = useState([])
      const showToast = useShowToast();
      
      useEffect(()=>{
        const getSuggestedUsers = async()=>{
          setLoading(true);
          try {
            const res = await fetch("/api/users/suggested-users");
            const data = await res.json();
            if (data.error) {
              showToast("error", data.error, "error");
              return;
            }
            setSuggestedUsers(data);
          } catch (error) {
            showToast("error", "error while fetching suggested users", "error");
          } finally {
            setLoading(false);
          }
        }
        getSuggestedUsers();
      },[showToast])
     

  return (
    <>
    <Text mb={4} fontWeight={"bold"}> Suggested Users </Text>
    <Flex direction={"column"} gap={4} >
      {!loading &&  SuggestedUsers.map(user => <SuggestedUser key={user._id} user={user}/>)}
       {loading && [1,2,3,4,5].map((i)=>(
         <Flex key={i} gap={2} p={1} alignItems={"center"} borderRadius={"md"} >
            <Box>
            <SkeletonCircle size={"10"} />
            </Box>
           <Flex w={"full"} flexDirection={"column"} gap={2}>
            <Skeleton h={"10px"} w={"80px"}/>
            <Skeleton h={"10px"} w={"90px"}/>
           </Flex>
           <Flex>
            <Skeleton h={"25px"} w={"70px"}/>
           </Flex>
           
         </Flex>
       ))}
    </Flex>
    </>
  )
}

export default SuggestedUsers