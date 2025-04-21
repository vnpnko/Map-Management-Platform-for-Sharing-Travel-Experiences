import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { User } from "../../../models/User.ts";

interface RemovePlacePayload {
  userId: string | number;
  placeId: string;
}

type RemovePlaceResponse = User;

const removePlaceRequest = async (
  payload: RemovePlacePayload,
): Promise<RemovePlaceResponse> => {
  const { userId, placeId } = payload;

  const response = await fetch(
    `${BASE_URL}/users/${userId}/places/${placeId}`,
    {
      method: "DELETE",
    },
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to remove place from user");
  }
  return data;
};

const useRemovePlaceFromUser = () => {
  const { mutateAsync, isPending, error } = useMutation<
    RemovePlaceResponse,
    Error,
    RemovePlacePayload
  >({
    mutationFn: removePlaceRequest,
  });

  return {
    removePlaceFromUser: mutateAsync,
    isRemovingPlaceFromUser: isPending,
    removePlaceFromUserError: error,
  };
};

export default useRemovePlaceFromUser;
