import { useState } from "react";
import { useToast } from "@chakra-ui/react";

interface User {
  _id: number;
  places: string[];
}

interface Place {
  _id: string;
  name: string;
  url: string;
  likes: number[];
}

interface UsePlaceActionsParams {
  baseUrl: string;
}

export function usePlaceActions({ baseUrl }: UsePlaceActionsParams) {
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const toast = useToast();

  const handleAddPlace = async (place: Place) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to add a place.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsAdding(true);

    try {
      const user: User = JSON.parse(storedUser);

      const payload = {
        userId: user._id,
        placeId: place._id,
      };

      const response = await fetch(`${baseUrl}/users/addPlace`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add place");
      }

      toast({
        title: "Place added",
        description: `Added ${place.name} to your saved places.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error adding place",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemovePlace = async (place: Place) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to remove a place.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsRemoving(true);

    try {
      const user: User = JSON.parse(storedUser);

      const payload = {
        userId: user._id,
        placeId: place._id,
      };

      const response = await fetch(`${baseUrl}/users/removePlace`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove place");
      }

      toast({
        title: "Place removed",
        description: `Removed ${place.name} from your saved places.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error removing place",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return {
    isAdding,
    isRemoving,
    handleAddPlace,
    handleRemovePlace,
  };
}
