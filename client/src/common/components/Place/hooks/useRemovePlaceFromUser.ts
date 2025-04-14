import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../../App.tsx";
import { User } from "../../../../models/User.ts";

interface RemovePlacePayload {
  placeId: string;
  userId: number;
}

type RemovePlaceResponse = User;

const removePlaceRequest = async (
  payload: RemovePlacePayload,
): Promise<RemovePlaceResponse> => {
  const response = await fetch(`${BASE_URL}/users/removePlace`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to remove place");
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
