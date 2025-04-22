import React from "react";
import { Text, Flex, IconButton, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaRegMap,
  FaLink,
} from "react-icons/fa6";
import CustomBox from "../ui/CustomBox.tsx";
import IconCover from "../ui/IconCover.tsx";
import useToastSuccess from "../hooks/toast/useToastSuccess.ts";

interface GenericCardItemProps {
  type: string;
  isDetailPage?: boolean;
  id: string | number;
  name: string;
  url?: string;
  imageUrl?: string;
  likesCount: number;
  // commentsCount?: number;
  likedByUser: boolean;
  onLikeToggle: () => void;
  isPending: boolean;
  children: React.ReactNode;
}

const CardItem: React.FC<GenericCardItemProps> = ({
  type,
  isDetailPage = false,
  id,
  name,
  url,
  likesCount,
  likedByUser = false,
  onLikeToggle,
  isPending,
  children,
}) => {
  const toastSuccess = useToastSuccess();

  const copyLink = (message: string) => {
    navigator.clipboard.writeText(message).then(() => {
      toastSuccess({
        title: `Link to the ${type} copied`,
      });
    });
  };

  return (
    <CustomBox key={id} borderBottomWidth={2} borderColor={"blackAlpha.300"}>
      <Flex direction={"column"}>
        {isDetailPage ? (
          <Text
            py={4}
            fontSize="lg"
            color="black"
            textAlign="left"
            noOfLines={0}
            w="fit-content"
          >
            {name}
          </Text>
        ) : (
          <Link
            as={RouterLink}
            to={`/${type}/${id}`}
            py={4}
            fontSize="lg"
            color="black"
            textAlign="left"
            noOfLines={0}
            w="fit-content"
            _hover={{ textDecoration: "underline" }}
          >
            {name}
          </Link>
        )}
        {children}

        <Flex py={2} gap={2}>
          <IconCover>
            <Flex justifyContent={"center"} alignItems={"center"} mr={2}>
              <IconButton
                aria-label={likedByUser ? "Unlike" : "Like"}
                icon={
                  likedByUser ? <FaHeart size={20} /> : <FaRegHeart size={20} />
                }
                color={likedByUser ? "red.500" : "blackAlpha.700"}
                onClick={onLikeToggle}
                isLoading={isPending}
              />
              <Text fontSize="sm" color="blackAlpha.700">
                {likesCount}
              </Text>
            </Flex>
          </IconCover>
          <IconCover>
            <Flex justifyContent={"center"} alignItems={"center"} mr={2}>
              <IconButton
                as={RouterLink}
                to={`/${type}/${id}`}
                aria-label="Comment"
                icon={<FaRegComment size={20} />}
                color="blackAlpha.700"
              />

              <Text fontSize="sm" color="blackAlpha.700">
                21
              </Text>
            </Flex>
          </IconCover>
          {url && (
            <IconCover>
              <IconButton
                as={RouterLink}
                to={url}
                target="_blank"
                aria-label="Open in Google Maps"
                icon={<FaRegMap size={20} />}
                color="blackAlpha.700"
              />
            </IconCover>
          )}
          <IconCover>
            <IconButton
              aria-label="Share"
              icon={<FaLink size={20} />}
              onClick={() =>
                copyLink(`${window.location.origin}/${type}/${id}`)
              }
              color="blackAlpha.700"
            />
          </IconCover>
        </Flex>
      </Flex>
    </CustomBox>
  );
};

export default CardItem;
