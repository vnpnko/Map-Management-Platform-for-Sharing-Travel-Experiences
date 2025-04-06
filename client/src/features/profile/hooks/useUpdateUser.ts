import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { User } from "../../../models/User.ts";

interface UpdateUserDataPayload {
  id: number;
  username?: string;
  name?: string;
}

type UpdateUserDataResponse = User;

const updateUserRequest = async (
  payload: UpdateUserDataPayload,
): Promise<UpdateUserDataResponse> => {
  const response = await fetch(`${BASE_URL}/users/${payload.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to update user data");
  }
  return data;
};

const useUpdateUser = () => {
  const { mutateAsync, isPending, error } = useMutation<
    UpdateUserDataResponse,
    Error,
    UpdateUserDataPayload
  >({
    mutationFn: updateUserRequest,
  });

  return {
    updateUserData: mutateAsync,
    isUpdatingUserData: isPending,
    updateUserDataError: error,
  };
};

export default useUpdateUser;
