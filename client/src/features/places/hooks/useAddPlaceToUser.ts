import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { User } from "../../../models/User.ts";

interface AddPlacePayload {
  placeId: string;
  userId: number;
}

type AddPlaceResponse = User;

const addPlaceRequest = async (
  payload: AddPlacePayload,
): Promise<AddPlaceResponse> => {
  const response = await fetch(`${BASE_URL}/users/addPlace`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to add place to user");
  }
  return data;
};

const useAddPlaceToUser = () => {
  const { mutateAsync, isPending, error } = useMutation<
    AddPlaceResponse,
    Error,
    AddPlacePayload
  >({
    mutationFn: addPlaceRequest,
  });

  return {
    addPlace: mutateAsync,
    isAddingPlace: isPending,
    addPlaceError: error,
  };
};

export default useAddPlaceToUser;
