import React from "react";
import {Flex, Text, useToast, Image, IconButton} from "@chakra-ui/react";
import CustomBox from "../ui/CustomBox.tsx";
import useAddPlaceToUser from "./hooks/useAddPlaceToUser.ts";
import useRemovePlaceFromUser from "./hooks/useRemovePlaceFromUser.ts";
import useAddPlaceLike from "./hooks/useAddPlaceLike.ts";
import useRemovePlaceLike from "./hooks/useRemovePlaceLike.ts";
import { FaHeart, FaRegHeart, FaRegMap } from "react-icons/fa6";
import { Place } from "../../../models/Place.ts";
import { useUserStore } from "../../../store/useUserStore.ts";
import favmaps_logo from "../../../assets/favmaps_logo.png";
import IconCover from "../ui/IconCover.tsx";

interface PlaceItemProps {
  place: Place;
}

const PlaceItem: React.FC<PlaceItemProps> = ({ place }) => {
  const toast = useToast();
  const { user, setUser } = useUserStore();
  const { addPlaceToUser, isAddingPlaceToUser } = useAddPlaceToUser();
  const { removePlaceFromUser, isRemovingPlaceFromUser } = useRemovePlaceFromUser();
  const { addPlaceLike, isAddingPlaceLike } = useAddPlaceLike();
  const { removePlaceLike, isRemovingPlaceLike } = useRemovePlaceLike();

  const alreadyHasPlace = user && user.places.includes(place._id);

  const handleAddPlace = async () => {
    if (user === null) {
      toast({
        title: "Not Authorized",
        description: "Please log in to like a place.",
        status: "error",
        isClosable: true,
      });
      return;
    }
    if (place && user && !alreadyHasPlace) {
      try {
        const payload = { placeId: place._id, userId: user._id };
        const updatedUser = await addPlaceToUser(payload);
        setUser(updatedUser);
        await addPlaceLike({ placeId: place._id, userId: user._id });
      } catch (error) {
        toast({
          title: "Error Adding hooks",
          description: (error as Error).message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const handleRemovePlace = async () => {
    if (place && user && alreadyHasPlace) {
      try {
        const payload = { placeId: place._id, userId: user._id };
        const updatedUser = await removePlaceFromUser(payload);
        setUser(updatedUser);
        await removePlaceLike({ placeId: place._id, userId: user._id });
      } catch (error) {
        toast({
          title: "Error Removing hooks",
          description: (error as Error).message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const handleLikeToggle = () => (alreadyHasPlace ? handleRemovePlace() : handleAddPlace());


  return (
    <CustomBox  borderTopWidth="2px" borderTopColor={"blackAlpha.300"} height="300px">
      <Flex direction="column">
        <Flex justifyContent="space-between" alignItems="center">
          <Text
            px={2}
            color="black"
            fontSize="lg"
            textAlign="left"
            cursor={"pointer"}
            _hover={{ textDecoration: "underline" }}
            onClick={() => window.open(place.url, "_blank")}
            noOfLines={1}
          >
            {place.name}
          </Text>
          <Flex alignItems={"center"} gap={2} py={2}>
            <IconCover>
              <IconButton
                  aria-label={"Open in Google Maps"}
                  icon={<FaRegMap size={25}/>}
                  color={"gray.600"}
                  onClick={() => window.open(place.url, "_blank")}
              />
            </IconCover>
            <IconCover>
              <IconButton
                  aria-label={alreadyHasPlace ? "Unlike" : "Like"}
                  // size={"lg"}
                  icon={alreadyHasPlace ? <FaHeart size={25}/> : <FaRegHeart size={25}/>}
                  color={alreadyHasPlace ? "red.500" : "gray.600"}
                  onClick={handleLikeToggle}
                  disabled={isAddingPlaceLike || isRemovingPlaceLike || isAddingPlaceToUser || isRemovingPlaceFromUser}
              />
            </IconCover>
          </Flex>
        </Flex>
        <Image
          src={place.photoUrl || favmaps_logo}
          alt={`${place.name} photo`}
          borderRadius="md"
          width={"100%"}
          height={"200px"}
          objectFit="cover"
        />
      </Flex>
    </CustomBox>
  );
};

export default PlaceItem;
