import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { User } from "../../../models/User.ts";

interface RemoveMapPayload {
  mapId: number;
  userId: number;
}

type RemoveMapResponse = User;

const removeMapRequest = async (
  payload: RemoveMapPayload,
): Promise<RemoveMapResponse> => {
  const response = await fetch(`${BASE_URL}/users/removeMap`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to remove map from user");
  }
  return data;
};

const useRemoveMapFromUser = () => {
  const { mutateAsync, isPending, error } = useMutation<
    RemoveMapResponse,
    Error,
    RemoveMapPayload
  >({
    mutationFn: removeMapRequest,
  });

  return {
    removeMap: mutateAsync,
    isRemovingMap: isPending,
    removeMapError: error,
  };
};

export default useRemoveMapFromUser;
