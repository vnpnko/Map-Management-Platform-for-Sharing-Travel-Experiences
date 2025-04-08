import React from "react";
import { Text, useToast, Spinner, Flex } from "@chakra-ui/react";
import useFetchMap from "../hooks/useFetchMap.ts";
import { useUser } from "../../../context/UserContext.tsx";
import useAddMapToUser from "../hooks/useAddMapToUser.ts";
import useRemoveMapFromUser from "../hooks/useRemoveMapFromUser.ts";
import useAddMapLike from "../hooks/useAddMapLike.ts";
import useRemoveMapLike from "../hooks/useRemoveMapLike.ts";
import IconBox from "../../../components/common/IconBox.tsx";
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import CustomBox from "../../../components/common/CustomBox.tsx";
import PlaceList from "../../places/components/PlaceList.tsx";

interface MapItemProps {
  map_id: number;
}

const MapItem: React.FC<MapItemProps> = ({ map_id }) => {
  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = useUser();
  const { map } = useFetchMap({ mapId: map_id });
  const { addMapToUser, isAddingMapToUser } = useAddMapToUser();
  const { removeMap, isRemovingMap } = useRemoveMapFromUser();
  const { addMapLike } = useAddMapLike();
  const { removeMapLike } = useRemoveMapLike();

  const alreadyHasMap = loggedInUser && loggedInUser.maps.includes(map_id);

  if (!map) {
    return;
  }

  const handleAddMap = async () => {
    if (!loggedInUser) {
      toast({
        title: "Not Authorized",
        description: "Please log in to like a map.",
        status: "error",
        isClosable: true,
      });
      return;
    }
    if (map && loggedInUser && !alreadyHasMap) {
      try {
        const payload = { mapId: map._id, userId: loggedInUser._id };
        const updatedUser = await addMapToUser(payload);
        setLoggedInUser(updatedUser);
        await addMapLike({ mapId: map._id, userId: loggedInUser._id });
        map.likes.push(loggedInUser._id);
      } catch (error) {
        toast({
          title: "Error Adding Map",
          description: (error as Error).message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const handleRemoveMap = async () => {
    if (map && loggedInUser && alreadyHasMap) {
      try {
        const payload = { mapId: map._id, userId: loggedInUser._id };
        const updatedUser = await removeMap(payload);
        setLoggedInUser(updatedUser);
        await removeMapLike({ mapId: map._id, userId: loggedInUser._id });
        map.likes = map.likes.filter((id) => id !== loggedInUser._id);
      } catch (error) {
        toast({
          title: "Error Removing Map",
          description: (error as Error).message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  return (
    <CustomBox p={4}>
      <Flex direction={"column"} gap={4}>
        <Flex justifyContent={"space-between"}>
          <Flex direction={"column"} gap={4} textAlign={"left"}>
            <Text color="black" fontSize={"lg"} fontWeight={"medium"}>
              {map.name}
            </Text>
            <Text color="black" fontSize={"md"} noOfLines={3}>
              {map.description}
            </Text>
          </Flex>
          {alreadyHasMap ? (
            <IconBox
              title="Remove from saved maps"
              cursor="pointer"
              color="gray.500"
              _hover={{ color: "red.600" }}
              onClick={handleRemoveMap}
            >
              {isRemovingMap ? (
                <Spinner size="lg" />
              ) : (
                <IoIosRemoveCircle size={40} />
              )}
            </IconBox>
          ) : (
            <IconBox
              title="Add to saved places"
              cursor="pointer"
              color="green.500"
              _hover={{ color: "green.600" }}
              onClick={handleAddMap}
            >
              {isAddingMapToUser ? (
                <Spinner size="lg" />
              ) : (
                <IoIosAddCircle size={40} />
              )}
            </IconBox>
          )}
        </Flex>

        {map.places.length === 0 ? (
          <Text color="black" textAlign="left">
            No places added
          </Text>
        ) : (
          <PlaceList places={map.places} />
        )}
      </Flex>
    </CustomBox>
  );
};

export default MapItem;
