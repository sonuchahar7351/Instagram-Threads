import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Alluser from "./AllUser";

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/all-users");
        const data = await res.json();
        if (data.error) {
          showToast("error", data.error, "error");
        }
         setAllUsers(data);
      } catch (error) {
        showToast("error", "something wents wrong", "error");
      }finally{
            setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  return (
    <>
      <Text mb={6} fontWeight={"bold"} textAlign={"center"} fontSize={"xl"}>
        Your Friends Circle
      </Text>
      <Flex direction={"column"} gap={4}>
      {!loading &&  allUsers.length > 0 ? (allUsers.map(user => <Alluser key={user._id} user={user}/>)) : <Text textAlign={"center"}>No users found</Text>}
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
};

export default AllUsers;
