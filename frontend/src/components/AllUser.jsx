import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useFollowUnfollow from '../hooks/useFollowUnfollow'

const Alluser = ({user}) => {
  
      const {handleFollowUnFollow, following, updating} = useFollowUnfollow(user);

  return <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
      {/* left side */}

      <Flex gap={2} as={Link} to={`/${user.username}`}>
        <Avatar src={user.profilePic} size={"md"}/>
        <Box>
            <Text fontSize={{base:"sm",md:"md",lg:"lg"}} fontWeight={"bold"}>{user.username.length > 16 ? user.username.substring(0,16)+"...": user.username}</Text>
            <Text fontSize={{base:"sm",md:"md",lg:"lg"}} color={"gray.light"} >{user.name}</Text>
        </Box>
      </Flex>

      {/* right side */}
      <Button size={{base:"sm",md:"md",lg:"md"}} color={following?"black":"white"} bg={following?"white":"blue.400"} onClick={handleFollowUnFollow} isLoading={updating} _hover={{color:following?"black":"white", opacity:".8",}}>
         {following ? "Unfollow" : "Follow"}
      </Button>

  </Flex>
}

export default Alluser