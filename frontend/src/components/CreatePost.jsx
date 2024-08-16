import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import UsePreviewimg from "../hooks/UsePreviewimg";
import { BsFillImageFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import useShowToast from "../hooks/useShowToast";
import { addPost } from "../features/postSlice";
import { useParams } from "react-router-dom";
const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImageChange, imageUrl, setImageUrl } = UsePreviewimg();
  const imageRef = useRef(null);

  const user = useSelector((state) => state.user.preUser);
  const posts = useSelector((state) => state.post.posts);
  const dispatch = useDispatch();
  const { username } = useParams();
  const [loading, setLoading] = useState(false);

  const showToast = useShowToast();
  const [postText, setPostText] = useState("");
  const masxChar = 500;
  const [remainingChar, setRemainingChar] = useState(masxChar);
  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > masxChar) {
      const truncatedText = inputText.slice(0, masxChar);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(masxChar - inputText.length);
    }
  };
  const handleCreatePost = async () => {
    setLoading(true);
    if (username === user.username) {
      try {
        const res = await fetch("api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postedBy: user._id,
            text: postText,
            img: imageUrl,
          }),
        });
        const data = await res.json();
        if (data.error) {
          showToast("error", "error while creating post", "error");
          return;
        }
        dispatch(addPost(data));
        showToast("success", "post created successfully", "success");
        onClose();
        setPostText("");
        setImageUrl("");
      } catch (error) {
        showToast("error", "something went wrong", "error");
      } finally {
        setLoading(false);
      }
    }
    else{
      showToast("error", "you can't create post for other user", "error");
      onClose();
      setPostText("");
      setImageUrl("");
    }
  };
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{
          base: "sm",
          sm: "md",
        }}
      >
        <AddIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post Contant goes here"
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                m="1"
                color={"gray.800"}
              >
                {remainingChar}/{masxChar}
              </Text>
              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>
            {imageUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imageUrl} alt="selected img" />
                <CloseButton
                  onClick={() => {
                    setImageUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
