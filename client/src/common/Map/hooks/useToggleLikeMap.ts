// src/common/Map/hooks/useToggleLikeMap.ts
import { loggedInUserStore } from "../../../store/loggedInUserStore";
import useToastError from "../../hooks/toast/useToastError";
import useLikeMap from "./useLikeMap";
import useUnlikeMap from "./useUnlikeMap";
import { Map as MapModel } from "../../../models/Map";

interface Payload {
  mapId: number;
  userId: number;
}

const useToggleLikeMap = (map: MapModel) => {
  const toast = useToastError();
  const { loggedInUser, setLoggedInUser } = loggedInUserStore();
  const { likeMap, isLikingMap } = useLikeMap();
  const { unlikeMap, isUnlikingMap } = useUnlikeMap();

  const alreadyLiked = loggedInUser?.maps.includes(map._id) ?? false;

  const handleToggle = async () => {
    if (!loggedInUser) {
      return toast({ title: "Like Failed", description: "Please log in." });
    }
    const payload: Payload = { mapId: map._id, userId: loggedInUser._id };

    try {
      const updatedUser = alreadyLiked
        ? await unlikeMap(payload)
        : await likeMap(payload);

      setLoggedInUser(updatedUser);

      // reflect on local `map.likes` array
      if (alreadyLiked) {
        map.likes = map.likes.filter((id) => id !== loggedInUser._id);
      } else {
        map.likes.push(loggedInUser._id);
      }
    } catch (err) {
      toast({
        title: alreadyLiked ? "Unlike Failed" : "Like Failed",
        description: (err as Error).message,
      });
    }
  };

  return {
    alreadyLiked,
    handleToggle,
    isPending: isLikingMap || isUnlikingMap,
  };
};

export default useToggleLikeMap;
