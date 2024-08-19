import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Alluser from "./AllUser";
import { SearchIcon } from "@chakra-ui/icons";

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [search,setSearch] = useState("");
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
      <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search for a user"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                size={{ base: "sm", md: "md", lg: "md" }}
                // onClick={handleConversationSearch}
                // isLoading={searchLoading}
              >
                <SearchIcon />
              </Button>
        </Flex>

      {!loading &&  allUsers?.length > 0 && (allUsers.filter((user) =>{
        return search.toLocaleLowerCase().trim() === "" ? user : user.username.toLocaleLowerCase().includes(search.toLocaleLowerCase().trim())
      }).map(user => <Alluser key={user._id} user={user}/>))}
      {!loading && allUsers?.length === 0 && <Text>No users found</Text>}
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
