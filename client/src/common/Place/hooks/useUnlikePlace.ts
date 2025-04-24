import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App";
import { User } from "../../../models/User";

interface Payload {
  placeId: string;
  userId: number;
}

export const unlikePlaceRequest = async (payload: Payload): Promise<User> => {
  const res = await fetch(
    `${BASE_URL}/places/${payload.placeId}/likes/${payload.userId}`,
    { method: "DELETE" },
  );
  const user = await res.json();
  if (!res.ok) throw new Error(user.error || "Failed to unlike place");
  return user;
};

const useUnlikePlace = () => {
  const { mutateAsync, isPending, error } = useMutation<User, Error, Payload>({
    mutationFn: unlikePlaceRequest,
  });
  return {
    unlikePlace: mutateAsync,
    isUnlikingPlace: isPending,
    unlikePlaceError: error,
  };
};

export default useUnlikePlace;
