import { Flex, Image, useColorMode } from '@chakra-ui/react';
import React from 'react';

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode(); // Destructure for clarity

    return (
        <Flex justifyContent="center" mt={6} mb={12}>
            <Image
                cursor="pointer"
                width={6}
                alt="logo"
                src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
                onClick={toggleColorMode}
            />
        </Flex>
    );
};

export default Header;