import React, { useEffect, useState } from "react";
import { Flex, Spinner, Alert, AlertIcon, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../App";
import MyProfilePage from "./MyProfilePage";
import PublicProfilePage from "./PublicProfilePage";
// import PlaceList from "../components/PlaceList.tsx";
// import CustomBox from "../components/ui/CustomBox.tsx";
// import PlaceForm from "../components/PlaceForm.tsx";

interface User {
  _id: number;
  username: string;
  name: string;
  followers: number[];
  following: number[];
  places: string[];
}

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>("");
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }

    async function fetchProfile() {
      try {
        const response = await fetch(`${BASE_URL}/users/username/${username}`);
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

  if (loading) {
    return (
      <Flex
        minH="100vh"
        bg="gray.50"
        direction="column"
        align="center"
        justify="center"
        gap={2}
        py={10}
      >
        <Spinner color="black" />
      </Flex>
    );
  }

  if (!profileUser) {
    return (
      <Flex
        minH="100vh"
        bg="gray.50"
        direction="column"
        align="center"
        justify="center"
        gap={2}
        py={10}
      >
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
            {message}
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
      bg="gray.50"
      direction="column"
      align="center"
      justify="center"
      gap={2}
      py={10}
    >
      {isOwner ? (
        <MyProfilePage user={profileUser} />
      ) : (
        <PublicProfilePage user={profileUser} />
      )}
    </Flex>
  );
};

export default ProfilePage;
