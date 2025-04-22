import { Flex } from "@chakra-ui/react";
import CustomButton from "../ui/CustomButton.tsx";
import { loggedInUserStore } from "../../store/loggedInUserStore.ts";
import { useLocation, useNavigate } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedInUser } = loggedInUserStore();

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
          Profile
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
      justify="end"
      borderBottomWidth={3}
      borderBottomColor={"blackAlpha.300"}
      px={4}
      py={1}
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg="gray.50"
      zIndex={1000}
    >
      <Flex gap={4} my={2}>
        {buttons}
      </Flex>
    </Flex>
  );
}
