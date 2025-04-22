import React from "react";
import { Flex, useToast, Image, IconButton, Link } from "@chakra-ui/react";
import CustomBox from "../../ui/CustomBox.tsx";
import useAddPlaceToUser from "../../User/hooks/useAddPlaceToUser.ts";
import useRemovePlaceFromUser from "../../User/hooks/useRemovePlaceFromUser.ts";
import useAddPlaceLike from "../hooks/useAddPlaceLike.ts";
import useRemovePlaceLike from "../hooks/useRemovePlaceLike.ts";
import { FaHeart, FaRegHeart, FaRegMap } from "react-icons/fa6";
import { Place } from "../../../models/Place.ts";
import { loggedInUserStore } from "../../../store/loggedInUserStore.ts";
import IconCover from "../../ui/IconCover.tsx";
import { BASE_URL } from "../../../App.tsx";
import { Link as RouterLink } from "react-router-dom";

interface SmallPlaceItemProps {
  place: Place;
}

const SmallPlaceItem: React.FC<SmallPlaceItemProps> = ({ place }) => {
  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = loggedInUserStore();
  const { addPlaceToUser, isAddingPlaceToUser } = useAddPlaceToUser();
  const { removePlaceFromUser, isRemovingPlaceFromUser } =
    useRemovePlaceFromUser();
  const { addPlaceLike, isAddingPlaceLike } = useAddPlaceLike();
  const { removePlaceLike, isRemovingPlaceLike } = useRemovePlaceLike();

  const alreadyHasPlace =
    loggedInUser && loggedInUser.places.includes(place._id);

  const handleAddPlace = async () => {
    if (loggedInUser === null) {
      toast({
        title: "Not Authorized",
        description: "Please log in to like a place.",
        status: "error",
        isClosable: true,
      });
      return;
    }
    if (place && loggedInUser && !alreadyHasPlace) {
      try {
        const payload = { placeId: place._id, userId: loggedInUser._id };
        const updatedUser = await addPlaceToUser(payload);
        setLoggedInUser(updatedUser);
        await addPlaceLike({ placeId: place._id, userId: loggedInUser._id });
      } catch (error) {
        toast({
          title: "UseToastError Adding hooks",
          description: (error as Error).message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const handleRemovePlace = async () => {
    if (place && loggedInUser && alreadyHasPlace) {
      try {
        const payload = { placeId: place._id, userId: loggedInUser._id };
        const updatedUser = await removePlaceFromUser(payload);
        setLoggedInUser(updatedUser);
        await removePlaceLike({ placeId: place._id, userId: loggedInUser._id });
      } catch (error) {
        toast({
          title: "UseToastError Removing hooks",
          description: (error as Error).message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const handleLikeToggle = () =>
    alreadyHasPlace ? handleRemovePlace() : handleAddPlace();

  return (
    <CustomBox bgColor={"blackAlpha.100"} borderWidth={0} height="300px">
      <Flex direction="column">
        <Flex justifyContent="space-between" alignItems="center" px={2}>
          <Link
            as={RouterLink}
            to={`/place/${place._id}`}
            isExternal
            fontSize="lg"
            color="black"
            textAlign="left"
            noOfLines={0}
            w="fit-content"
            _hover={{ textDecoration: "underline" }}
          >
            {place.name}
          </Link>

          <Flex alignItems={"center"} gap={2} py={2}>
            <IconCover>
              <IconButton
                aria-label={"Open in Google Maps"}
                icon={<FaRegMap size={25} />}
                color={"gray.600"}
                onClick={() => window.open(place.url, "_blank")}
              />
            </IconCover>
            <IconCover>
              <IconButton
                aria-label={alreadyHasPlace ? "Unlike" : "Like"}
                icon={
                  alreadyHasPlace ? (
                    <FaHeart size={25} />
                  ) : (
                    <FaRegHeart size={25} />
                  )
                }
                color={alreadyHasPlace ? "red.500" : "gray.600"}
                onClick={handleLikeToggle}
                disabled={
                  isAddingPlaceLike ||
                  isRemovingPlaceLike ||
                  isAddingPlaceToUser ||
                  isRemovingPlaceFromUser
                }
              />
            </IconCover>
          </Flex>
        </Flex>
        <Image
          src={`${BASE_URL}/proxy/googlephoto?url=${encodeURIComponent(place.photoUrl)}`}
          alt={`${place.name} photo`}
          width={"100%"}
          height={"200px"}
          objectFit="cover"
        />
      </Flex>
    </CustomBox>
  );
};

export default SmallPlaceItem;
