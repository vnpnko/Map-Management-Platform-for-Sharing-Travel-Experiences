import useFollow from "./useFollow.ts";
import useUnfollow from "./useUnfollow.ts";
import { loggedInUserStore } from "../../../store/loggedInUserStore.ts";
import useToastError from "../../hooks/toast/useToastError.ts";
import { User } from "../../../models/User.ts";

const useToggleFollow = (user: User) => {
  const { loggedInUser, setLoggedInUser } = loggedInUserStore();
  const toastError = useToastError();

  const { follow, isFollowing } = useFollow();
  const { unfollow, isUnfollowing } = useUnfollow();

  const alreadyFollowing = loggedInUser?.following.includes(user._id) ?? false;

  const handleToggle = async () => {
    if (!loggedInUser) {
      toastError({
        title: "Follow Failed",
        description: "Login to follow users",
      });
      return;
    }

    const payload = {
      followeeId: user._id,
      followerId: loggedInUser._id,
    };

    try {
      const updatedUser = alreadyFollowing
        ? await unfollow(payload)
        : await follow(payload);

      setLoggedInUser(updatedUser);

      if (alreadyFollowing) {
        user.followers = user.followers.filter((id) => id !== loggedInUser._id);
      } else {
        user.followers.push(loggedInUser._id);
      }
    } catch (error) {
      toastError({
        title: alreadyFollowing ? "Unfollow Failed" : "Follow Failed",
        description: (error as Error).message,
      });
    }
  };

  const isPending = isFollowing || isUnfollowing;

  return {
    alreadyFollowing,
    handleToggle,
    isPending,
  };
};

export default useToggleFollow;
