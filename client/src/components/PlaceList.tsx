import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";

import PlaceItem from "./PlaceItem.tsx";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import CustomButton from "./ui/CustomButton.tsx";

export type Place = {
  _id: number;
  url: string;
  name: string;
  likes: number[];
};

interface User {
  _id: string;
  username: string;
  name: string;
  followers: string[];
  following: string[];
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

  return (
    <Flex direction={"column"}>
      {isLoading && (
        <Flex justifyContent={"center"}>
          <Spinner color={"black"} size={"xl"} />
        </Flex>
      )}
      {!isLoading && places?.length === 0 && (
        <Text color={"green"}>you have no saved places yet</Text>
      )}
      {!isLoading && places?.length !== 0 && (
        <Stack gap={2}>
          <Flex justifyContent={"space-between"} mb={4} gap={4}>
            <CustomButton
              bg={"blackAlpha.600"}
              _hover={{ bg: "blackAlpha.600" }}
            >
              places
            </CustomButton>
            <CustomButton>maps</CustomButton>
          </Flex>
          <Stack gap={2}>
            {places?.map((place) => (
              <PlaceItem key={user._id} user={user} place={place} />
            ))}
          </Stack>
        </Stack>
      )}
    </Flex>
  );
};
export default PlaceList;
