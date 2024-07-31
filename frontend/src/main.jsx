import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, ColorModeScript, extendTheme, useColorModeValue } from "@chakra-ui/react";

const styles = {
  global: (props) => ({
    body: {
      color: useColorModeValue('gray.800', 'whiteAlpha.900'),
      bg: useColorModeValue('gray.100', '#101010'),
    },
  }),
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const colors = {
  gray: {
    light: '#616161',
    dark: '#1e1e1e',
  },
};

const theme = extendTheme({ config, styles, colors });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);