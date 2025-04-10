import React from "react";
import { Flex } from "@chakra-ui/react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import ToggleButton from "../../../components/common/ToggleButton.tsx";

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath =
    location.pathname === "/search" ? "/search/users" : location.pathname;

  return (
    <Flex direction="column" gap={4} w={"2xl"}>
      <Flex justifyContent="space-between" gap={4}>
        <ToggleButton
          onClick={() => navigate("/search/users")}
          isSelected={currentPath === "/search/users"}
        >
          Users
        </ToggleButton>
        <ToggleButton
          onClick={() => navigate("/search/places")}
          isSelected={currentPath === "/search/places"}
        >
          Places
        </ToggleButton>
        <ToggleButton
          onClick={() => navigate("/search/maps")}
          isSelected={currentPath === "/search/maps"}
        >
          Maps
        </ToggleButton>
      </Flex>
      <Outlet />
    </Flex>
  );
};

export default ExplorePage;
