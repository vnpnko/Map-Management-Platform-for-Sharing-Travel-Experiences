import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { User } from "../../../models/User.ts";

interface FollowPayload {
  followerId: number;
  followeeId: number;
}

type FollowResponse = User;

const followRequest = async (
  payload: FollowPayload,
): Promise<FollowResponse> => {
  const response = await fetch(`${BASE_URL}/follow`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to follow user");
  }
  return data;
};

const useFollow = () => {
  const { mutateAsync, isPending, error } = useMutation<
    FollowResponse,
    Error,
    FollowPayload
  >({
    mutationFn: followRequest,
  });

  return { follow: mutateAsync, isFollowing: isPending, followError: error };
};

export default useFollow;
