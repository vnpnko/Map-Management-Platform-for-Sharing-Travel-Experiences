import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";
import ToggleButton from "../../common/components/ui/ToggleButton.tsx";
import ExploreUsers from "./components/ExploreUsers.tsx";
import ExplorePlaces from "./components/ExplorePlaces.tsx";
import ExploreMaps from "./components/ExploreMaps.tsx";

const ExplorePage: React.FC = () => {
  const [type, setType] = useState("users");

  const renderContent = () => {
    switch (type) {
      case "users":
        return <ExploreUsers />;
      case "places":
        return <ExplorePlaces />;
      case "maps":
        return <ExploreMaps />;
    }
  };

  return (
    <Flex direction="column" gap={4} w={"2xl"}>
      <Flex justifyContent="space-between" gap={4}>
        <ToggleButton
          onClick={() => setType("users")}
          isSelected={type === "users"}
        >
          Users
        </ToggleButton>
        <ToggleButton
          onClick={() => setType("places")}
          isSelected={type === "places"}
        >
          Places
        </ToggleButton>
        <ToggleButton
          onClick={() => setType("maps")}
          isSelected={type === "maps"}
        >
          Maps
        </ToggleButton>
      </Flex>

      {renderContent()}
    </Flex>
  );
};

export default ExplorePage;
