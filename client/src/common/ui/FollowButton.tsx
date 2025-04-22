import React from "react";
import useToggleFollow from "../User/hooks/useToggleFollow.ts";
import { User } from "../../models/User.ts";
import CustomButton from "./CustomButton.tsx";

interface FollowButtonProps {
  user: User;
}

const FollowButton: React.FC<FollowButtonProps> = ({ user }) => {
  const { alreadyFollowing, handleToggle, isPending } = useToggleFollow(user);

  return (
    <CustomButton
      width={120}
      height={50}
      isSelected={alreadyFollowing}
      onClick={handleToggle}
      isLoading={isPending}
    >
      {alreadyFollowing ? "Unfollow" : "Follow"}
    </CustomButton>
  );
};

export default FollowButton;
