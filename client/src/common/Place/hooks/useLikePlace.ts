// useLikePlace.ts
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App";
import { User } from "../../../models/User";

interface Payload {
  placeId: string;
  userId: number;
}

export const likePlaceRequest = async (payload: Payload): Promise<User> => {
  const res = await fetch(
    `${BASE_URL}/places/${payload.placeId}/likes/${payload.userId}`,
    {
      method: "POST",
    },
  );
  const user = await res.json();
  if (!res.ok) throw new Error(user.error || "Failed to like place");
  return user;
};

const useLikePlace = () => {
  const { mutateAsync, isPending, error } = useMutation<User, Error, Payload>({
    mutationFn: likePlaceRequest,
  });
  return {
    likePlace: mutateAsync,
    isLikingPlace: isPending,
    likePlaceError: error,
  };
};

export default useLikePlace;
