import useAddMapToUser from "../hooks/useAddMapToUser";
import useRemoveMapFromUser from "../hooks/useRemoveMapFromUser";
import useAddMapLike from "../hooks/useAddMapLike";
import useRemoveMapLike from "../hooks/useRemoveMapLike";
import { loggedInUserStore } from "../../../../store/loggedInUserStore.ts";
import useToastError from "../../../hooks/useToastError.ts";
import { Map } from "../../../../models/Map";

const useToggleLikeMap = (map: Map) => {
  const toastError = useToastError();
  const { loggedInUser, setLoggedInUser } = loggedInUserStore();

  const { addMapToUser, isAddingMapToUser } = useAddMapToUser();
  const { removeMap, isRemovingMap } = useRemoveMapFromUser();
  const { addMapLike, isAddingMapLike } = useAddMapLike();
  const { removeMapLike, isRemovingMapLike } = useRemoveMapLike();

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
        await removeMapLike(payload);
        map.likes = map.likes.filter((id) => id !== loggedInUser._id);
      } else {
        await addMapLike(payload);
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
    isAddingMapToUser || isRemovingMap || isAddingMapLike || isRemovingMapLike;

  return {
    alreadyLiked,
    handleToggle,
    isPending,
  };
};

export default useToggleLikeMap;
