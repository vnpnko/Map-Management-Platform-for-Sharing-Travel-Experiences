import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";

interface DeleteUserPayload {
  _id: number;
}

interface DeleteUserResponse {
  success: boolean;
}

const deleteUserRequest = async (
  payload: DeleteUserPayload,
): Promise<DeleteUserResponse> => {
  const response = await fetch(`${BASE_URL}/users/${payload._id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to delete user");
  }
  return data;
};

const useDeleteUser = () => {
  const { mutateAsync, isPending, error } = useMutation<
    DeleteUserResponse,
    Error,
    DeleteUserPayload
  >({
    mutationFn: deleteUserRequest,
  });

  return {
    deleteUser: mutateAsync,
    isDeletingUser: isPending,
    deleteUserError: error,
  };
};

export default useDeleteUser;
