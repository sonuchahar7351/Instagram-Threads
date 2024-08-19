import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import useFollowUnfollow from '../hooks/useFollowUnfollow';
const Followers = ({follower}) => {
      const {handleFollowUnFollow, following, updating} = useFollowUnfollow(follower);

  return (
      <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
      {/* left side */}

      <Flex gap={2} as={Link} to={`/${follower.username}`}>
        <Avatar src={follower.profilePic} size={"md"}/>
        <Box>
            <Text fontSize={{base:"sm",md:"md",lg:"lg"}} fontWeight={"bold"}>{follower.username}</Text>
            <Text fontSize={{base:"sm",md:"md",lg:"lg"}} color={"gray.light"} >{follower.name}</Text>
        </Box>
      </Flex>

      {/* right side */}
      <Button size={{base:"sm",md:"md",lg:"md"}} color={following?"black":"white"} bg={following?"white":"blue.400"} onClick={handleFollowUnFollow} isLoading={updating} _hover={{color:following?"black":"white", opacity:".8",}}>
         {following ? "Following" : "Follow Back"}
      </Button>

  </Flex>
  )
}

export default Followers