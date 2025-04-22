import useAddMapToUser from "../../User/hooks/useAddMapToUser.ts";
import useRemoveMapFromUser from "../../User/hooks/useRemoveMapFromUser.ts";
import useLikeMap from "./useLikeMap.ts";
import useUnlikeMap from "./useUnlikeMap.ts";
import { loggedInUserStore } from "../../../store/loggedInUserStore.ts";
import useToastError from "../../hooks/toast/useToastError.ts";
import { Map } from "../../../models/Map.ts";

const useToggleLikeMap = (map: Map) => {
  const toastError = useToastError();
  const { loggedInUser, setLoggedInUser } = loggedInUserStore();

  const { addMapToUser, isAddingMapToUser } = useAddMapToUser();
  const { removeMap, isRemovingMap } = useRemoveMapFromUser();
  const { likeMap, isLikingMap } = useLikeMap();
  const { unlikeMap, isUnlikingMap } = useUnlikeMap();

  const alreadyLiked = loggedInUser?.maps.includes(map._id) ?? false;

  const handleToggle = async () => {
    if (!loggedInUser) {
      toastError({
        title: "Like Failed",
        description: "Login to like maps",
      });
      return;
    }

    const payload = {
      mapId: map._id,
      userId: loggedInUser._id,
    };

    try {
      const updatedUser = alreadyLiked
        ? await removeMap(payload)
        : await addMapToUser(payload);

      setLoggedInUser(updatedUser);

      if (alreadyLiked) {
        await unlikeMap(payload);
        map.likes = map.likes.filter((id) => id !== loggedInUser._id);
      } else {
        await likeMap(payload);
        map.likes.push(loggedInUser._id);
      }
    } catch (error) {
      toastError({
        title: alreadyLiked ? "Unlike Failed" : "Like Failed",
        description: (error as Error).message,
      });
    }
  };

  const isPending =
    isAddingMapToUser || isRemovingMap || isLikingMap || isUnlikingMap;

  return {
    alreadyLiked,
    handleToggle,
    isPending,
  };
};

export default useToggleLikeMap;
