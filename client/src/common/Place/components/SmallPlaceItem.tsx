import React from "react";
import { Flex, Image, IconButton, Link } from "@chakra-ui/react";
import CustomBox from "../../ui/CustomBox.tsx";
import { FaHeart, FaRegHeart, FaRegMap } from "react-icons/fa6";
import { Place } from "../../../models/Place.ts";
import IconCover from "../../ui/IconCover.tsx";
import { BASE_URL } from "../../../App.tsx";
import { Link as RouterLink } from "react-router-dom";
import useToggleLikePlace from "../hooks/useToggleLikePlace.ts";

interface SmallPlaceItemProps {
  place: Place;
}

const SmallPlaceItem: React.FC<SmallPlaceItemProps> = ({ place }) => {
  const { alreadyLiked, handleToggle, isPending } = useToggleLikePlace(place);

  return (
    <CustomBox bgColor={"blackAlpha.100"} borderWidth={0} height="300px">
      <Flex direction="column">
        <Flex justifyContent="space-between" alignItems="center" px={2}>
          <Link
            as={RouterLink}
            to={`/place/${place._id}`}
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
                as={RouterLink}
                to={place.url}
                target="_blank"
                aria-label={"Open in Google Maps"}
                icon={<FaRegMap size={20} />}
                color={"blackAlpha.700"}
              />
            </IconCover>

            <IconCover>
              <IconButton
                aria-label={alreadyLiked ? "Unlike" : "Like"}
                icon={
                  alreadyLiked ? (
                    <FaHeart size={20} />
                  ) : (
                    <FaRegHeart size={20} />
                  )
                }
                color={alreadyLiked ? "red.500" : "blackAlpha.700"}
                onClick={handleToggle}
                isLoading={isPending}
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
