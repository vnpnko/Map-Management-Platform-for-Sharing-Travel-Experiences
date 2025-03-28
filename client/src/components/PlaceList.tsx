import { Flex, Spinner, Text } from "@chakra-ui/react";

import PlaceItem from "./PlaceItem.tsx";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import CustomButton from "./ui/CustomButton.tsx";

export type Place = {
  _id: string;
  url: string;
  name: string;
  likes: number[];
};

interface User {
  _id: number;
  username: string;
  name: string;
  followers: number[];
  following: number[];
  places: string[];
}

interface PlaceListProps {
  user: User;
}

const PlaceList: React.FC<PlaceListProps> = ({ user }) => {
  const { data: places, isLoading } = useQuery<Place[]>({
    queryKey: ["places"],
    queryFn: async () => {
      try {
        const res = await fetch(BASE_URL + "/places");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data || [];
      } catch (error) {
        console.log(error);
      }
    },
  });

  if (!isLoading && places?.length === 0) {
    return <Text color={"green"}>you have no saved places yet</Text>;
  } else if (!isLoading && places?.length !== 0) {
    return (
      <Flex direction={"column"} gap={4}>
        <Flex justifyContent={"space-between"} gap={4}>
          <CustomButton bg={"blackAlpha.600"} _hover={{ bg: "blackAlpha.600" }}>
            places
          </CustomButton>
          <CustomButton>maps</CustomButton>
        </Flex>
        <Flex direction={"column"} gap={2}>
          {places?.map((place) => (
            <PlaceItem key={user._id} user={user} place={place} />
          ))}
        </Flex>
      </Flex>
    );
  } else {
    return (
      <Flex justifyContent={"center"}>
        <Spinner color={"black"} size={"xl"} />
      </Flex>
    );
  }
};

export default PlaceList;
