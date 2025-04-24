import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App";
import { User } from "../../../models/User";

interface Payload {
  mapId: number;
  userId: number;
}

export const likeMapRequest = async (payload: Payload): Promise<User> => {
  const { mapId, userId } = payload;
  const res = await fetch(`${BASE_URL}/maps/${mapId}/likes/${userId}`, {
    method: "POST",
  });
  const user = await res.json();
  if (!res.ok) throw new Error(user.error || "Failed to like map");
  return user;
};

const useLikeMap = () => {
  const { mutateAsync, isPending, error } = useMutation<User, Error, Payload>({
    mutationFn: likeMapRequest,
  });
  return { likeMap: mutateAsync, isLikingMap: isPending, likeMapError: error };
};

export default useLikeMap;
