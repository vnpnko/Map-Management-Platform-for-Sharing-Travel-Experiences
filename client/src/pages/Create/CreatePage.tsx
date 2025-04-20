import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";
import ToggleButton from "../../common/components/ui/ToggleButton.tsx";
import CreatePlace from "./components/CreatePlace.tsx";
import CreateMap from "./components/CreateMap.tsx";

const CreatePage: React.FC = () => {
  const [type, setType] = useState("places");

  const renderContent = () => {
    switch (type) {
      case "places":
        return <CreatePlace />;
      case "maps":
        return <CreateMap />;
    }
  };

  return (
    <Flex direction="column" gap={4} w={"2xl"}>
      <Flex justifyContent="space-between" gap={4}>
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

export default CreatePage;
