import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import {
  IoIosTrash,
  IoIosMap,
  IoIosAddCircle,
  IoIosPeople,
} from "react-icons/io";
import { Place } from "./PlaceList.tsx";
import CustomBox from "./ui/CustomBox.tsx";

interface User {
  _id: string;
  username: string;
  name: string;
  followers: string[];
  following: string[];
  places: string[];
}

interface PlaceItemProps {
  user: User;
  place: Place;
}

const PlaceItem: React.FC<PlaceItemProps> = ({ user, place }) => {
  return (
    <Flex gap={2}>
      <CustomBox flex={1} p={2} border={"1px"} borderColor={"blue.600"}>
        <Text color={"black"} fontSize={"lg"} textAlign={"left"}>
          {place.name}
        </Text>
      </CustomBox>
      <Flex gap={2} alignItems={"center"}>
        <Box
          color={"blue.600"}
          _hover={{ color: "blue.600" }}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <IoIosPeople size={40} />
          <Text position="absolute" mt={7} color="black" fontSize="sm">
            {place.likes.length}
          </Text>
        </Box>
        <Box
          color={"yellow.500"}
          _hover={{ color: "yellow.600" }}
          cursor={"pointer"}
          onClick={() => window.open(place.url)}
        >
          <IoIosMap size={40} />
        </Box>
        <Box
          color={"green.500"}
          _hover={{ color: "green.600" }}
          cursor={"pointer"}
          onClick={() => {}}
        >
          <IoIosAddCircle size={40} />
        </Box>
        {/*{user.places.contains(place._id) ? (*/}
        {/*    <Box color={"red.500"} cursor={"pointer"} onClick={() => deletePlace()}>*/}
        {/*        {!isAddingFromLikes && <IoIosTrash size={24} />}*/}
        {/*        {isAddingFromLikes && <Spinner size={"md"} />}*/}
        {/*    </Box>*/}
        {/*) : (*/}
        {/*    <Box color={"green.500"} cursor={"pointer"} onClick={() => userLikesPlace()}>*/}
        {/*        {!isRemovingFromLikes && <IoIosAddCircle size={24} />}*/}
        {/*        {isRemovingFromLikes && <Spinner size={"md"} />}*/}
        {/*    </Box>*/}
        {/*)}*/}
      </Flex>
    </Flex>
  );
};
export default PlaceItem;
