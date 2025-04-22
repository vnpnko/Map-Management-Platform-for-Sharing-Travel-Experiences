import React, { useState } from "react";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { FaRegListAlt } from "react-icons/fa";
import useRecommended from "../hooks/useRecommended.ts";
import CustomSpinner from "../../../common/ui/CustomSpinner.tsx";
import CustomAlert from "../../../common/ui/CustomAlert.tsx";

interface GenericRecommendationsListProps<T> {
  userId: number;
  resource: "users" | "places" | "maps";
  renderItem: (item: T) => React.ReactNode;
}

function GenericRecommendationsList<T>({
  userId,
  resource,
  renderItem,
}: GenericRecommendationsListProps<T>) {
  const [isOpen, setIsOpen] = useState(true);

  const { recommendations, isLoadingRecommendations, recommendationsError } =
    useRecommended<T>(resource, userId);

  return (
    <Flex bgColor="green.100" direction="column">
      <Flex justify="space-between" align="center" bg="green.500" p={2}>
        <Text fontWeight="medium">Recommended {resource}</Text>
        <IconButton
          aria-label={isOpen ? "Hide recommendations" : "Show recommendations"}
          icon={<FaRegListAlt size={20} />}
          onClick={() => setIsOpen(!isOpen)}
        />
      </Flex>

      {isOpen && (
        <>
          {isLoadingRecommendations && <CustomSpinner />}
          {recommendationsError && (
            <CustomAlert title={recommendationsError.message} />
          )}
          {recommendations.length === 0 && (
            <Text textAlign={"center"} color={"black"} p={4}>
              no {resource} found
            </Text>
          )}
          {recommendations.map(renderItem)}
        </>
      )}
    </Flex>
  );
}

export default GenericRecommendationsList;
