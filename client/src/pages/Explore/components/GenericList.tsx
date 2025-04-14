import React from "react";
import { Flex, Text, Spinner, AlertIcon, Alert } from "@chakra-ui/react";

interface GenericListProps<T> {
  items: T[] | undefined;
  isLoading: boolean;
  error: unknown;
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

function GenericList<T>({
  items,
  isLoading,
  error,
  renderItem,
  emptyMessage = "No items available",
}: GenericListProps<T>) {
  if (isLoading) {
    return (
      <Flex align="center" justify="center" mt={8}>
        <Spinner size="lg" color={"black"} />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert
        p={8}
        status="error"
        variant="solid"
        alignItems="center"
        justifyContent="center"
      >
        <AlertIcon boxSize={10} color="red.500" />
        <Text color="red.500" fontSize="xl" fontWeight="bold">
          Failed to load items
        </Text>
      </Alert>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Flex align="center" justify="center" mt={8}>
        <Text color="green" fontSize="xl">
          {emptyMessage}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap={2}>
      {items.map(renderItem)}
    </Flex>
  );
}

export default GenericList;
