// src/hooks/useProfileActions.ts
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { BASE_URL } from "../../App.tsx";
import { useState } from "react";

import { User } from "../../models/User.ts";

interface UseProfileActionsProps {
  loggedInUser: User | null;
  profileUser: User | null;
}

export const useProfileActions = ({
  loggedInUser,
  profileUser,
}: UseProfileActionsProps) => {
  const [LoggedInUser, setLoggedInUser] = useState<User | null>(loggedInUser);
  const [ProfileUser, setProfileUser] = useState<User | null>(profileUser);

  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const onFollow = async () => {
    console.log(LoggedInUser);
    console.log(ProfileUser);
    if (!LoggedInUser || !ProfileUser) return;

    const payload = {
      followerId: LoggedInUser._id,
      followeeId: ProfileUser._id,
    };

    try {
      const response = await fetch(`${BASE_URL}/follow`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        toast({
          title: "Failed to follow user",
          description: "Failed to follow the user.",
          status: "error",
          isClosable: true,
        });
      } else {
        setProfileUser({
          ...ProfileUser,
          followers: [...ProfileUser.followers, LoggedInUser._id],
        });
        const updatedLoggedInUser = {
          ...LoggedInUser,
          following: [...LoggedInUser.following, ProfileUser._id],
        };
        setLoggedInUser(updatedLoggedInUser);
        localStorage.setItem("user", JSON.stringify(updatedLoggedInUser));
        toast({
          title: "Success",
          description: "User followed successfully.",
          status: "success",
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: "Network error",
        description: "Network error while trying to follow the user.",
        status: "error",
        isClosable: true,
      });
    }
  };

  const onUnfollow = async () => {
    if (!LoggedInUser || !ProfileUser) return;

    const payload = {
      followerId: LoggedInUser._id,
      followeeId: ProfileUser._id,
    };

    try {
      const response = await fetch(`${BASE_URL}/unfollow`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        toast({
          title: "Failed to unfollow user",
          description:
            "Something went wrong while trying to unfollow the user.",
          status: "error",
          isClosable: true,
        });
      } else {
        const updatedProfileUser = {
          ...ProfileUser,
          followers: ProfileUser.followers.filter(
            (id) => id !== LoggedInUser._id,
          ),
        };
        setProfileUser(updatedProfileUser);
        const updatedLoggedInUser = {
          ...LoggedInUser,
          following: LoggedInUser.following.filter(
            (id) => id !== ProfileUser._id,
          ),
        };
        setLoggedInUser(updatedLoggedInUser);
        localStorage.setItem("user", JSON.stringify(updatedLoggedInUser));
        toast({
          title: "Success",
          description: "User unfollowed successfully.",
          status: "success",
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: "Network error",
        description: "Network error while trying to unfollow the user.",
        status: "error",
        isClosable: true,
      });
    }
  };

  return { handleLogout, onFollow, onUnfollow };
};
