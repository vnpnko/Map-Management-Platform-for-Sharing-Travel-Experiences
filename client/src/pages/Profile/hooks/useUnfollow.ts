import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { User } from "../../../models/User.ts";

interface UnfollowPayload {
  followerId: number;
  followeeId: number;
}

type UnfollowResponse = User;

const unfollowRequest = async (
  payload: UnfollowPayload,
): Promise<UnfollowResponse> => {
  const response = await fetch(`${BASE_URL}/users/unfollow`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to unfollow user");
  }
  return data;
};

const useUnfollow = () => {
  const { mutateAsync, isPending, error } = useMutation<
    UnfollowResponse,
    Error,
    UnfollowPayload
  >({
    mutationFn: unfollowRequest,
  });

  return {
    unfollow: mutateAsync,
    isUnfollowing: isPending,
    unfollowError: error,
  };
};

export default useUnfollow;
