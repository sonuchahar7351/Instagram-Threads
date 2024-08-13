import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import { BsFillChatQuoteFill } from "react-icons/bs";

const Header = () => {
  const logout = useLogout();
  const { colorMode, toggleColorMode } = useColorMode(); // Destructure for clarity
  const user = useSelector((state) => state.user.preUser);
  return (
    <Flex justifyContent={user ? "space-between" : "center"} mt={6} mb={8}>
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
        
      )}
      <Image
        cursor="pointer"
        width={6}
        alt="logo"
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Link as={RouterLink} to={`/chat`}>
            <BsFillChatQuoteFill size={20} />
          </Link>
          <Button size={"xs"} onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
