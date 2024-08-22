import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UsePreviewimg from "../hooks/UsePreviewimg";
import useShowToast from "../hooks/useShowToast";
import { setUser } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
export default function UpdateProfile() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.preUser);
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    password: user.password,
    bio: user.bio,
  });
  const fileRef = useRef(null);
  const showToast = useShowToast();
  const [updating, setUpdating] = useState(false);
  const { handleImageChange, imageUrl } = UsePreviewimg();

  {
    /* update profile will work only you change any fields otherwise it will not work */
  }

  const [hasChanges, setHasChanges] = useState(false);
  // const [isUpdated, setIsUpdated] = useState(false); // Track if the profile was updated

  useEffect(() => {
    const isChanged =
      inputs.name !== user.name ||
      inputs.username !== user.username ||
      inputs.email !== user.email ||
      inputs.bio !== user.bio ||
      inputs.password !== user.password ||
      (imageUrl && imageUrl !== user.profilePic); 
    setHasChanges(isChanged);
  }, [inputs, user, imageUrl]);

  {
    /* ################################################################################## */
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (updating) return;
    setUpdating(true);

    {
      /* for cancelling ongoing request */
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController; // Store the current controller

    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, profilePic: imageUrl }),
        signal: abortController.signal, // Attach the abort signal
      });
      const data = await res.json();

      if (data.error) {
        showToast("error", data.error, "error");
        return;
      }
      dispatch(setUser(data));
      localStorage.setItem("user-threads", JSON.stringify(data));
      showToast("success", "profile update succussfully", "success");
      // setIsUpdated(true);
      setHasChanges(false);
      window.location.reload();
         
    } catch (error) {
      if (error.name === "AbortError") {
        showToast("info", "Profile update cancelled", "info");
      } else {
        showToast("error", error.messsage, "error");
      }
    } finally {
      setUpdating(false);
    }
  };

  {
    /* handle the cancle request if user click on cancle button the ongoing request should be cancelled */
  }

  const abortControllerRef = useRef(new AbortController());
  const handleCancel = () => {
    showToast("info", "Profile update cancelled", "info");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imageUrl || user.profilePic}
                />
              </Center>
              <Center w="full">
                <Button
                  w="full"
                  onClick={() => fileRef.current.click()}
                  isDisabled={updating}
                >
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="saunoo chahar"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.name}
              onChange={(e)=>{setInputs({...inputs,name:e.target.value})}} // Use new change handler
              isDisabled={updating}
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.username}
              onChange={(e)=>{setInputs({ ...inputs, username: e.target.value })}} // Use new change handler
              isDisabled={updating}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={inputs.email}
              onChange={(e)=>{setInputs({ ...inputs, email: e.target.value })}} // Use new change handler
              isDisabled={updating}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="your bio ..."
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.bio}
              onChange={(e)=>{setInputs({ ...inputs, bio: e.target.value })}} // Use new change handler
              isDisabled={updating}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              value={inputs.password}
              onChange={(e)=>{setInputs({ ...inputs, password: e.target.value })}} // Use new change handler
              isDisabled={updating}
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            {updating ? (
              <Button
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{ bg: "red.500" }}
                onClick={() => {
                  handleCancel();
                }}
              >
                Cancel
              </Button>
            ) : (
              <Button
                bg={"green.400"}
                color={"white"}
                w="full"
                _hover={{ bg: "green.500" }}
                onClick={() => {
                  navigate("/");
                }}
              >
                Go to Home
              </Button>
            )}

            <Button
              bg={"yellow.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "yellow.500",
              }}
              type="submit"
              isLoading={updating}
              isDisabled={!hasChanges}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
