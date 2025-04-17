import React, { useState } from "react";
import { Flex, IconButton, Text, Spinner, Box } from "@chakra-ui/react";
import { FaRegListAlt } from "react-icons/fa";
import useRecommended from "../hooks/useRecommended.ts";

interface GenericRecommendationsListProps<T> {
  userId?: number;
  resource: "users" | "places" | "maps";
  renderItem: (item: T) => React.ReactNode;
  title?: string;
}

function GenericRecommendationsList<T>({
  userId,
  resource,
  renderItem,
  title = "Recommended",
}: GenericRecommendationsListProps<T>) {
  const [isOpen, setIsOpen] = useState(true);

  const { recommendations, isLoadingRecommendations, recommendationsError } =
    useRecommended<T>(resource, userId);

  return (
    <Flex
      borderWidth="medium"
      borderColor="green.500"
      direction="column"
      gap={2}
    >
      <Flex justify="space-between" align="center" bg="green.500" p={2}>
        <Text fontWeight="medium">
          {title} {resource}
        </Text>
        <IconButton
          aria-label={isOpen ? "Hide recommendations" : "Show recommendations"}
          icon={<FaRegListAlt />}
          onClick={() => setIsOpen(!isOpen)}
        />
      </Flex>

      {isOpen && (
        <>
          {isLoadingRecommendations && (
            <Box textAlign="center" p={3}>
              <Spinner />
            </Box>
          )}
          {recommendationsError && (
            <Text color="red.500">{recommendationsError.message}</Text>
          )}
          {recommendations.map(renderItem)}
        </>
      )}
    </Flex>
  );
}

export default GenericRecommendationsList;
