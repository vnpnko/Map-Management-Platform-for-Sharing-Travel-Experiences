import React from "react";
import { Flex } from "@chakra-ui/react";
import CustomButton from "../components/ui/CustomButton.tsx";
import AllUsersList from "../components/search/AllUsersList.tsx";
// import AllPlacesList from "../components/search/AllPlacesList.tsx";

const SearchPage: React.FC = () => {
  return (
    <Flex direction="column" gap={4} w={"md"}>
      <Flex justifyContent="space-between" gap={4}>
        <CustomButton>Users</CustomButton>
        <CustomButton bg="blackAlpha.600" _hover={{ bg: "blackAlpha.600" }}>
          Places
        </CustomButton>
        <CustomButton>Maps</CustomButton>
      </Flex>
      {/*<AllPlacesList />;*/}
      <AllUsersList />;
    </Flex>
  );
};

export default SearchPage;
