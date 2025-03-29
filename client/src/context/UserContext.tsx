import React, { createContext, useState, useContext } from "react";
import { User } from "../models/User.ts";
import { useToast } from "@chakra-ui/react";
import { BASE_URL } from "../App.tsx";

// Define the type for the context value
interface UserContextType {
  loggedInUser: User | null;
  handleLogin: (userData: User) => void;
  handleLogout: () => void;
  onFollow: (profileUser: User) => void;
  onUnfollow: (profileUser: User) => void;
}

// Create the context with a default value
export const UserContext = createContext<UserContextType | null>(null);

// UserProvider component to provide context to the app
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const toast = useToast();

  const handleLogin = (userData: User) => {
    setLoggedInUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedInUser(null);
  };

  const onFollow = async (profileUser: User) => {
    if (!loggedInUser) {
      toast({
        title: "Failed to follow user",
        description: "You need to be logged in to follow a user.",
        status: "error",
        isClosable: true,
      });
      return;
    }

    const payload = {
      followerId: loggedInUser._id,
      followeeId: profileUser._id,
    };

    try {
      const response = await fetch(`${BASE_URL}/follow`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        toast({
          title: "Failed to follow the user.",
          description: "Failed to follow the user.",
          status: "error",
          isClosable: true,
        });
      } else {
        setLoggedInUser({
          ...loggedInUser,
          following: [...loggedInUser.following, profileUser._id],
        });
        // setProfileUser({
        //   ...profileUser,
        //   followers: [...profileUser.followers, loggedInUser._id], // Add the follower to the profileUser's followers
        // });
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        toast({
          title: "Success",
          description: "You are now following this user.",
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

  const onUnfollow = async (profileUser: User) => {
    if (!loggedInUser) return;

    const payload = {
      followerId: loggedInUser._id,
      followeeId: profileUser._id,
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
        setLoggedInUser({
          ...loggedInUser,
          following: loggedInUser.following.filter(
            (id) => id !== profileUser._id,
          ),
        });
        // setProfileUser({
        //   ...profileUser,
        //   followers: profileUser.followers.filter(
        //     (id) => id !== loggedInUser._id,
        //   ),
        // });
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        toast({
          title: "Success",
          description: "You have unfollowed this user.",
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

  return (
    <UserContext.Provider
      value={{
        loggedInUser,
        handleLogin,
        handleLogout,
        onFollow,
        onUnfollow,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
