import React, { useState } from "react";
import { Text, useToast, Flex } from "@chakra-ui/react";
import Pin from "../../../assets/favmaps_logo.png";
import useFetchMap from "../hooks/useFetchMap.ts";
import { useUser } from "../../../context/UserContext.tsx";
import useAddMapToUser from "../hooks/useAddMapToUser.ts";
import useRemoveMapFromUser from "../hooks/useRemoveMapFromUser.ts";
import useAddMapLike from "../hooks/useAddMapLike.ts";
import useRemoveMapLike from "../hooks/useRemoveMapLike.ts";
import IconBox from "../../../components/common/IconBox.tsx";
import CustomBox from "../../../components/common/CustomBox.tsx";
import PlaceList from "../../places/components/PlaceList.tsx";
import { GoogleMap, Marker } from "@react-google-maps/api";
import {
  FaHeart,
  FaRegComment,
  FaRegFolderClosed,
  FaRegFolderOpen,
  FaRegHeart,
  FaRegPaperPlane,
} from "react-icons/fa6";

interface MapItemProps {
  map_id: number;
}

const MapItem: React.FC<MapItemProps> = ({ map_id }) => {
  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = useUser();
  const { map } = useFetchMap({ mapId: map_id });
  const { addMapToUser } = useAddMapToUser();
  const { removeMap } = useRemoveMapFromUser();
  const { addMapLike } = useAddMapLike();
  const { removeMapLike } = useRemoveMapLike();

  const [showPlaces, setShowPlaces] = useState(false);

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
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text color="black" fontSize={"lg"} fontWeight={"medium"}>
            {map.name}
          </Text>
          <Flex gap={2}>
            <IconBox
              title={showPlaces ? "Hide Places" : "Show Places"}
              cursor="pointer"
              color={"black"}
              borderRadius="md"
              _hover={{ color: "blackAlpha.700" }}
              onClick={() => setShowPlaces(!showPlaces)}
            >
              {showPlaces ? (
                <FaRegFolderOpen size={25} />
              ) : (
                <FaRegFolderClosed size={25} />
              )}
            </IconBox>
            <IconBox
              title="Share"
              cursor="pointer"
              color="black"
              borderRadius="md"
              _hover={{ color: "blackAlpha.700" }}
              onClick={() =>
                navigator.clipboard.writeText("map.url").then(() => {
                  toast({
                    title: "Link copied to clipboard",
                    status: "success",
                    isClosable: true,
                  });
                })
              }
            >
              <FaRegPaperPlane size={25} />
            </IconBox>
            <IconBox
              title="Comment"
              cursor="pointer"
              color="black"
              borderRadius="md"
              _hover={{ color: "blackAlpha.700" }}
            >
              <FaRegComment size={25} />
            </IconBox>
            {alreadyHasMap ? (
              <IconBox
                title="Unlike"
                cursor="pointer"
                color="red.500"
                onClick={handleRemoveMap}
              >
                <FaHeart size={25} />
              </IconBox>
            ) : (
              <IconBox
                title="Like"
                cursor="pointer"
                color="black"
                _hover={{ color: "blackAlpha.700" }}
                onClick={handleAddMap}
              >
                <FaRegHeart size={25} />
              </IconBox>
            )}
          </Flex>
        </Flex>
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "300px",
          }}
          center={{ lat: 50.5, lng: 30.5 }}
          zoom={6}
        >
          <Marker
            position={{ lat: 50, lng: 30 }}
            onClick={() => {
              toast({
                title: "IT WORKS!",
                description: "location 1 clicked",
                status: "info",
                isClosable: true,
              });
            }}
          />
          <Marker
            position={{ lat: 51, lng: 30 }}
            onClick={() => {
              toast({
                title: "IT WORKS!",
                description: "location 2 clicked",
                status: "info",
                isClosable: true,
              });
            }}
          />
          <Marker
            position={{ lat: 50, lng: 31 }}
            onClick={() => {
              toast({
                title: "IT WORKS!",
                description: "location 3 clicked",
                status: "info",
                isClosable: true,
              });
            }}
          />
          <Marker
            position={{ lat: 51, lng: 31 }}
            onClick={() => {
              toast({
                title: "IT WORKS!",
                description: "location 4 clicked",
                status: "info",
                isClosable: true,
              });
            }}
            icon={{ url: Pin, scaledSize: new google.maps.Size(40, 40) }}
          />
        </GoogleMap>
        {showPlaces &&
          (map.places.length === 0 ? (
            <Text color="black" textAlign="left">
              No places added
            </Text>
          ) : (
            <PlaceList places={map.places} />
          ))}
        <Text
          color="black"
          fontSize="md"
          fontWeight={"semibold"}
          textAlign={"left"}
        >
          {map.likes.length} likes
        </Text>
        <Flex alignItems={"center"} gap={2}>
          <Text
            color="black"
            fontSize={"md"}
            fontWeight={"medium"}
            noOfLines={3}
          >
            vn.pnko
          </Text>
          <Text color="black" fontSize={"md"} noOfLines={3}>
            {/*{map.description}*/}I thought you were going to Brazil to enjoy
            Carnival in Rio
          </Text>
        </Flex>

        <Text
          cursor="pointer"
          color="blackAlpha.600"
          fontSize="md"
          fontWeight={"normal"}
          textAlign={"left"}
        >
          View all 229 comments
        </Text>
      </Flex>
    </CustomBox>
  );
};

export default MapItem;
