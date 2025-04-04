import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { User } from "../../../models/User.ts";

interface AddMapPayload {
  mapId: number;
  userId: number;
}

type AddMapResponse = User;

const addMapRequest = async (
  payload: AddMapPayload,
): Promise<AddMapResponse> => {
  const response = await fetch(`${BASE_URL}/users/addMap`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to add map to user");
  }
  return data;
};

const useAddMapToUser = () => {
  const { mutateAsync, isPending, error } = useMutation<
    AddMapResponse,
    Error,
    AddMapPayload
  >({
    mutationFn: addMapRequest,
  });

  return {
    addMap: mutateAsync,
    isAddingMap: isPending,
    addMapError: error,
  };
};

export default useAddMapToUser;
