import React from "react";
import { Text, Flex, useToast, IconButton } from "@chakra-ui/react";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaRegMap,
  FaRegPaperPlane,
} from "react-icons/fa6";
import CustomBox from "./ui/CustomBox.tsx";
import IconCover from "./ui/IconCover.tsx";

interface GenericCardItemProps {
  id: string | number;
  name: string;
  url?: string;
  imageUrl?: string;
  likesCount: number;
  // commentsCount?: number;
  likedByUser?: boolean;
  onLike: () => void;
  onUnlike: () => void;
  isPending: boolean;
  children?: React.ReactNode;
}

const CardItem: React.FC<GenericCardItemProps> = ({
  id,
  name,
  url,
  likesCount,
  likedByUser = false,
  onLike,
  onUnlike,
  isPending,
  children,
}) => {
  const toast = useToast();
  const handleLikeToggle = () => (likedByUser ? onUnlike() : onLike());

  const copyLink = (message: string) => {
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: message,
          status: "success",
          isClosable: true,
        });
      });
    }
  };

  return (
    <CustomBox key={id}>
      <Flex direction={"column"}>
        <Text py={4} fontSize={"medium"} textAlign={"left"} color={"black"}>
          {name}
        </Text>

        {children}

        <Flex py={2} gap={2}>
          <IconCover>
            <Flex justifyContent={"center"} alignItems={"center"} mr={2}>
              <IconButton
                aria-label={likedByUser ? "Unlike" : "Like"}
                icon={likedByUser ? <FaHeart /> : <FaRegHeart />}
                color={likedByUser ? "red.500" : "gray.600"}
                onClick={handleLikeToggle}
                disabled={isPending}
              />
              <Text fontSize="sm" color="gray.600">
                {likesCount}
              </Text>
            </Flex>
          </IconCover>
          <IconCover>
            <Flex justifyContent={"center"} alignItems={"center"} mr={2}>
              <IconButton
                aria-label="Comment"
                icon={<FaRegComment />}
                onClick={() => copyLink("Redirecting to comments...")}
                color="gray.600"
              />
              <Text fontSize="sm" color="gray.600">
                21
              </Text>
            </Flex>
          </IconCover>
          <IconCover>
            {url && (
              <IconButton
                aria-label="Open in Google Maps"
                icon={<FaRegMap />}
                onClick={() => window.open(url, "_blank")}
                color="gray.600"
              />
            )}
          </IconCover>
          <IconCover>
            <IconButton
              aria-label="Share"
              icon={<FaRegPaperPlane />}
              onClick={() => copyLink("Link copied to clipboard")}
              color="gray.600"
            />
          </IconCover>
        </Flex>
      </Flex>
    </CustomBox>
  );
};

export default CardItem;
