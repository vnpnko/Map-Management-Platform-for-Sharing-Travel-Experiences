import React from "react";
import { Flex } from "@chakra-ui/react";
import ToggleButton from "../../../components/common/ToggleButton.tsx";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath =
    location.pathname === "/create" ? "/create/places" : location.pathname;

  return (
    <Flex direction="column" gap={4} w="md" mx="auto" mt={8}>
      <Flex justifyContent="space-between" gap={4}>
        <ToggleButton
          onClick={() => navigate("/create/places")}
          isSelected={currentPath === "/create/places"}
        >
          Places
        </ToggleButton>
        <ToggleButton
          onClick={() => navigate("/create/maps")}
          isSelected={currentPath === "/create/maps"}
        >
          Maps
        </ToggleButton>
      </Flex>
      <Outlet />
    </Flex>
  );
};

export default CreatePage;
