import React, { useState } from "react";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import CustomInput from "./ui/CustomInput.tsx";
import GenericVirtualList from "./GenericVirtualList.tsx";
import useFetchIds from "../hooks/useFetchIds.tsx";
import useRecommendedUsers from "../../pages/Explore/hooks/useRecommendedUsers.ts";
import UserItem from "./User/UserItem.tsx";
import { useUserStore } from "../../store/useUserStore.ts";
import IconCover from "./ui/IconCover.tsx";
import { FaRegListAlt } from "react-icons/fa";
import useRecommendedPlaces from "../../pages/Explore/hooks/useRecommendedPlaces.ts";
import useRecommendedMaps from "../../pages/Explore/hooks/useRecommendedMaps.ts";
import { User } from "../../models/User.ts";
import { Place } from "../../models/Place.ts";
import { Map } from "../../models/Map.ts";
import PlaceItem from "./Place/PlaceItem.tsx";
import MapItem from "./Map/MapItem.tsx";

interface ExploreItemsProps<T> {
  resource: "users" | "places" | "maps";
  renderItem: (item: T) => React.ReactNode;
  placeholder: string;
  pageSize?: number;
}

const ExploreItems = <T, ID>({
  resource,
  renderItem,
  placeholder,
  pageSize = 5,
}: ExploreItemsProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(true);
  const { user } = useUserStore();
  const { data } = useFetchIds<ID>(resource, searchQuery);
  const ids = data?.filter((id) => id !== user?._id) || [];

  const {
    recommendedUsers,
    isLoadingUsersRecommendations,
    recommendationUsersError,
  } = useRecommendedUsers(user?._id);
  const {
    recommendedPlaces,
    isLoadingPlacesRecommendations,
    recommendationPlacesError,
  } = useRecommendedPlaces(user?._id);
  const {
    recommendedMaps,
    isLoadingMapsRecommendations,
    recommendationMapsError,
  } = useRecommendedMaps(user?._id);

  return (
    <Flex direction="column" gap={4}>
      {user && (
        <Flex
          borderWidth={"medium"}
          borderColor={"green.500"}
          direction="column"
          gap={2}
        >
          <Flex
            justifyContent={"space-between"}
            alignItems="center"
            bg={"green.500"}
            p={2}
          >
            <Text fontWeight={"medium"}>Recommended {resource}</Text>
            <IconCover>
              <IconButton
                aria-label={
                  isRecommendationsOpen
                    ? "Hide recommendations"
                    : "Show recommendations"
                }
                icon={<FaRegListAlt />}
                onClick={() => setIsRecommendationsOpen(!isRecommendationsOpen)}
              />
            </IconCover>
          </Flex>
          {resource === "users" && isRecommendationsOpen && (
            <>
              {isLoadingUsersRecommendations && <Text>Loading...</Text>}
              {recommendationUsersError && (
                <Text color="red.500">{recommendationUsersError.message}</Text>
              )}
              {recommendedUsers.map((user: User) => (
                <UserItem key={user._id} user={user} />
              ))}
            </>
          )}
          {resource === "places" && isRecommendationsOpen && (
            <>
              {isLoadingPlacesRecommendations && <Text>Loading...</Text>}
              {recommendationPlacesError && (
                <Text color="red.500">{recommendationPlacesError.message}</Text>
              )}
              {recommendedPlaces.map((place: Place) => (
                <PlaceItem key={place._id} place={place} />
              ))}
            </>
          )}
          {resource === "maps" && isRecommendationsOpen && (
            <>
              {isLoadingMapsRecommendations && <Text>Loading...</Text>}
              {recommendationMapsError && (
                <Text color="red.500">{recommendationMapsError.message}</Text>
              )}
              {recommendedMaps.map((map: Map) => (
                <MapItem key={map._id} map={map} />
              ))}
            </>
          )}
        </Flex>
      )}

      <CustomInput
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <GenericVirtualList<T, ID>
        items={ids}
        type={resource}
        pageSize={pageSize}
        renderItem={renderItem}
      />
    </Flex>
  );
};

export default ExploreItems;
