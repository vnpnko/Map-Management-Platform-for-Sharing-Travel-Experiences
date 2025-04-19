import { Flex, Image, Text } from "@chakra-ui/react";
import CustomButton from "../ui/CustomButton.tsx";
import { useLoggedInUserStore } from "../../../store/useLoggedInUserStore.ts";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/favmaps_logo.png";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedInUser } = useLoggedInUserStore();

  const isAuthPage =
    location.pathname === "/" || location.pathname === "/signup";

  let buttons;

  if (loggedInUser) {
    buttons = (
      <>
        <CustomButton
          isSelected={location.pathname === `/${loggedInUser.username}`}
          onClick={() => navigate(`/${loggedInUser.username}`)}
        >
          Home
        </CustomButton>
        <CustomButton
          isSelected={location.pathname.startsWith("/create")}
          onClick={() => navigate("/create")}
        >
          Create
        </CustomButton>
        <CustomButton
          isSelected={location.pathname.startsWith("/search")}
          onClick={() => navigate("/search")}
        >
          Explore
        </CustomButton>
      </>
    );
  } else {
    if (isAuthPage) {
      buttons = (
        <CustomButton onClick={() => navigate("/search")}>Explore</CustomButton>
      );
    } else {
      buttons = (
        <>
          <CustomButton onClick={() => navigate("/")}>Login</CustomButton>
          <CustomButton onClick={() => navigate("/signup")}>
            Signup
          </CustomButton>
          <CustomButton
            isSelected={location.pathname.startsWith("/search")}
            onClick={() => navigate("/search")}
          >
            Explore
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
      py={1}
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg="white"
      zIndex={1000}
    >
      <Flex align="center">
        <Image src={logo} alt="favmaps logo" boxSize={12} mr={2} />
        <Text
          fontSize="xl"
          fontWeight="medium"
          color="black"
          fontFamily="heading"
        >
          Favmaps
        </Text>
      </Flex>

      <Flex gap={4} my={2}>
        {buttons}
      </Flex>
    </Flex>
  );
}
