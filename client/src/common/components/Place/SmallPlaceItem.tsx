import React from "react";
import { Flex, Text, useToast, Image } from "@chakra-ui/react";
import CustomBox from "../ui/CustomBox.tsx";
import IconBox from "../ui/IconBox.tsx";
import useAddPlaceToUser from "./hooks/useAddPlaceToUser.ts";
import useRemovePlaceFromUser from "./hooks/useRemovePlaceFromUser.ts";
import useAddPlaceLike from "./hooks/useAddPlaceLike.ts";
import useRemovePlaceLike from "./hooks/useRemovePlaceLike.ts";
import { FaHeart, FaRegHeart, FaRegMap } from "react-icons/fa6";
import { Place } from "../../../models/Place.ts";
import { useUserStore } from "../../../store/useUserStore.ts";
import favmaps_logo from "../../../assets/favmaps_logo.png";

interface PlaceItemProps {
  place: Place;
}

const PlaceItem: React.FC<PlaceItemProps> = ({ place }) => {
  const toast = useToast();
  const { user, setUser } = useUserStore();
  const { addPlaceToUser } = useAddPlaceToUser();
  const { removePlaceFromUser } = useRemovePlaceFromUser();
  const { addPlaceLike } = useAddPlaceLike();
  const { removePlaceLike } = useRemovePlaceLike();

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

  return (
    <CustomBox bg={"blackAlpha.50"} height="300px">
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
          <Flex gap={2} py={2}>
            <IconBox
              title="Open in Google Maps"
              cursor="pointer"
              color="black"
              borderRadius="md"
              _hover={{ color: "blackAlpha.700" }}
              onClick={() => window.open(place.url, "_blank")}
            >
              <FaRegMap size={25} />
            </IconBox>
            {alreadyHasPlace ? (
              <IconBox
                title="Unlike"
                cursor="pointer"
                color="red.500"
                onClick={handleRemovePlace}
              >
                <FaHeart size={25} />
              </IconBox>
            ) : (
              <IconBox
                title="Like"
                cursor="pointer"
                color="black"
                _hover={{ color: "blackAlpha.700" }}
                onClick={handleAddPlace}
              >
                <FaRegHeart size={25} />
              </IconBox>
            )}
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
