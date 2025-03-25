import React, { useEffect, useState } from "react";
import { Flex, Spinner, Alert, AlertIcon, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../App";
import MyProfilePage from "./MyProfilePage";
import PublicProfilePage from "./PublicProfilePage";
import PlaceList from "../components/PlaceList.tsx";
import CustomBox from "../components/ui/CustomBox.tsx";
import PlaceForm from "../components/PlaceForm.tsx";

interface User {
  _id: string;
  username: string;
  name: string;
  followers: string[];
  following: string[];
  places: string[];
}

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>("");
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    // Get logged-in user data from localStorage if available
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }

    // Fetch profile data for the given username
    async function fetchProfile() {
      try {
        const response = await fetch(`${BASE_URL}/users/${username}`);
        if (!response.ok) {
          setMessage("User not found");
        } else {
          const data = await response.json();
          setProfileUser(data);
        }
      } catch {
        setMessage("Error fetching user data");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    // Check if visitor is logged in
    const loggedUserStr = localStorage.getItem("user");
    if (!loggedUserStr) {
      setMessage("You need to be logged in to follow someone.");
      return;
    }
    const loggedUser = JSON.parse(loggedUserStr);

    // Prepare payload using logged-in user's ID and profile user's ID
    const payload = {
      followerId: loggedUser._id,
      followeeId: profileUser?._id,
    };

    try {
      const response = await fetch(`${BASE_URL}/follow`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        setMessage("Failed to follow the user.");
      } else {
        setMessage("You are now following this user!");
        // Update the profileUser's followers array:
        if (profileUser) {
          setProfileUser({
            ...profileUser,
            followers: [...profileUser.followers, loggedUser._id],
          });
        }
        // Update the logged-in user's following array:
        if (loggedInUser) {
          const updatedLoggedInUser = {
            ...loggedInUser,
            following: [...loggedInUser.following, profileUser!._id],
          };
          setLoggedInUser(updatedLoggedInUser);
          // Optionally, update localStorage so the change persists
          localStorage.setItem("user", JSON.stringify(updatedLoggedInUser));
        }
      }
    } catch {
      setMessage("Network error while trying to follow the user.");
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" minH="100vh" bg="gray.50">
        <Spinner color="black" />
      </Flex>
    );
  }

  if (!profileUser) {
    return (
      <Flex align="center" justify="center" minH="100vh" bg="gray.50">
        <Alert
          w="sm"
          p={8}
          status="error"
          variant="solid"
          alignItems="center"
          justifyContent="center"
        >
          <AlertIcon boxSize={10} color="red.500" />
          <Text color="red.500" fontSize="2xl" fontWeight="bold">
            {message || "User not found"}
          </Text>
        </Alert>
      </Flex>
    );
  }

  const isOwner =
    loggedInUser && loggedInUser.username === profileUser.username;

  return (
    <Flex
      minH="100vh"
      direction={"column"}
      bgColor={"gray.50"}
      align={"center"}
      justify={"center"}
      py={10}
    >
      <CustomBox>
        {isOwner ? (
          <MyProfilePage user={profileUser} />
        ) : (
          <PublicProfilePage user={profileUser} onFollow={handleFollow} />
        )}
        {isOwner && <PlaceForm />}
        <PlaceList user={profileUser} />
      </CustomBox>
    </Flex>
  );
};

export default ProfilePage;
