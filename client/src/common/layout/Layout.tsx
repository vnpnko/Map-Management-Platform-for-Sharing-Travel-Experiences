import { Outlet } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { Header } from "./Header.tsx";

export function Layout() {
  return (
    <Flex bg="gray.50" minH="100vh" direction={"column"}>
      <Header />
      <Flex p={4} pt={20} justifyContent="center">
        <Outlet />
      </Flex>
    </Flex>
  );
}
