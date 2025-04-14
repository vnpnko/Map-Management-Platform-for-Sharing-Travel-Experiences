import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Header } from "./Header.tsx";

export function Layout() {
  return (
    <Box bg="gray.50" minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box
        p={4}
        pt={8}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Outlet />
      </Box>
    </Box>
  );
}
