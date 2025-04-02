import { Flex, Text } from "@chakra-ui/react";
import CustomButton from "./ui/CustomButton.tsx";
import { useUser } from "../context/UserContext.tsx";
import { useLocation, useNavigate } from "react-router-dom";

export function Header() {
  const { loggedInUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on an auth page (login or signup)
  const isAuthPage =
    location.pathname === "/" || location.pathname === "/signup";

  let buttons = null;

  if (loggedInUser) {
    buttons = (
      <>
        <CustomButton onClick={() => navigate(`/${loggedInUser.username}`)}>
          Home
        </CustomButton>
        <CustomButton onClick={() => navigate("/create")}>Create</CustomButton>
        <CustomButton onClick={() => navigate("/search")}>Search</CustomButton>
      </>
    );
  } else {
    if (isAuthPage) {
      buttons = (
        <CustomButton onClick={() => navigate("/search")}>Search</CustomButton>
      );
    } else {
      buttons = (
        <>
          <CustomButton onClick={() => navigate("/")}>Login</CustomButton>
          <CustomButton onClick={() => navigate("/signup")}>
            Signup
          </CustomButton>
          <CustomButton onClick={() => navigate("/search")}>
            Search
          </CustomButton>
        </>
      );
    }
  }

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      boxShadow="md"
      px={4}
    >
      <Text fontSize="xl" fontWeight="medium" color="black">
        Map Management Platform for Sharing Travel Experiences
      </Text>

      <Flex gap={4} my={2}>
        {buttons}
      </Flex>
    </Flex>
  );
}
