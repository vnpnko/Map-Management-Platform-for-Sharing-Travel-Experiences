import { Flex } from "@chakra-ui/react";
import CustomButton from "../ui/CustomButton.tsx";
import { loggedInUserStore } from "../../store/loggedInUserStore.ts";
import { NavLink } from "react-router-dom";

export function Header() {
  const { loggedInUser } = loggedInUserStore();

  const navItems = loggedInUser
    ? [
        { to: `/${loggedInUser.username}`, label: "Profile" },
        { to: "/search", label: "Explore" },
        { to: "/create", label: "Create" },
      ]
    : [
        { to: "/", label: "Login", end: true },
        { to: "/signup", label: "Signup" },
        { to: "/search", label: "Explore" },
      ];

  return (
    <Flex
      as="header"
      justify="end"
      borderBottomWidth={2}
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
        {navItems.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end}>
            {({ isActive }) => (
              <CustomButton isSelected={isActive}>{label}</CustomButton>
            )}
          </NavLink>
        ))}
      </Flex>
    </Flex>
  );
}
