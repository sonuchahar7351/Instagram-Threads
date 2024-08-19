import { Box, Button, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useSelector } from "react-redux";
import UpdateProfile from "./pages/UpdateProfile";
import CreatePost from "./components/CreatePost";
import Chatpage from "./pages/Chatpage";
import AllUsers from "./components/AllUsers";
import YourFollowers from "./components/YourFollowers";

function App() {
  const User = useSelector((state) => state.user.preUser);
  const {pathname} = useLocation();
  return (
    <Box position={"relative"}
     w={"full"}
    >
    <Container maxW={ pathname==="/" ? {base:"620px",md:"900px"} : "620px" } >
      <Header />
      <Routes>
        <Route
          path="/"
          element={User ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={!User ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/update"
          element={User ? <UpdateProfile /> : <Navigate to="/auth" />}
        />
        <Route
          path="/:username"
          element={
            User ? (
              <>
                <UserPage />
                <CreatePost />
              </>
            ) : (
              <UserPage />
            )
          }
          />
        <Route path="/:username/post/:pid" element={<PostPage />} />
        <Route path="/chat" element={User? <Chatpage />:<Navigate to="/auth" />} />
        <Route path="/all-users" element={User? <AllUsers />:<Navigate to="/auth" />} />
        <Route path="/your-followers" element={ User ? <YourFollowers/> : <Navigate to="/auth"/>}/>
      </Routes>
    </Container>
          </Box>
  );
}

export default App;
