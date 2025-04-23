// src/common/Map/hooks/useUnlikeMap.ts
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App";
import { User } from "../../../models/User";

interface Payload {
  mapId: number;
  userId: number;
}

export const unlikeMapRequest = async (payload: Payload): Promise<User> => {
  const { mapId, userId } = payload;
  const res = await fetch(`${BASE_URL}/maps/${mapId}/likes/${userId}`, {
    method: "DELETE",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to unlike map");
  return json as User;
};

const useUnlikeMap = () => {
  const { mutateAsync, isPending, error } = useMutation<User, Error, Payload>({
    mutationFn: unlikeMapRequest,
  });
  return {
    unlikeMap: mutateAsync,
    isUnlikingMap: isPending,
    unlikeMapError: error,
  };
};

export default useUnlikeMap;
