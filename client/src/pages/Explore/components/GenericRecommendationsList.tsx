import React, { useState } from "react";
import { Flex, IconButton, Text, Spinner, Box } from "@chakra-ui/react";
import { FaRegListAlt } from "react-icons/fa";
import useRecommended from "../hooks/useRecommended.ts";

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
          icon={<FaRegListAlt />}
          onClick={() => setIsOpen(!isOpen)}
        />
      </Flex>

      {isOpen && (
        <>
          {isLoadingRecommendations && (
            <Box textAlign="center" p={4}>
              <Spinner color={"black"} />
            </Box>
          )}
          {recommendationsError && (
            <Box textAlign="center" p={4}>
              <Text color="red.500">{recommendationsError.message}</Text>
            </Box>
          )}
          {recommendations.map(renderItem)}
        </>
      )}
    </Flex>
  );
}

export default GenericRecommendationsList;
