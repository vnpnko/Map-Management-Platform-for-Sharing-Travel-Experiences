// src/common/Map/hooks/useLikeMap.ts
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
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to like map");
  return json as User;
};

const useLikeMap = () => {
  const { mutateAsync, isPending, error } = useMutation<User, Error, Payload>({
    mutationFn: likeMapRequest,
  });
  return { likeMap: mutateAsync, isLikingMap: isPending, likeMapError: error };
};

export default useLikeMap;
