import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Heading, useToast, VStack } from "@chakra-ui/react";
import CustomButton from "../components/ui/CustomButton";
import CustomBox from "../components/ui/CustomBox.tsx";
import CustomInput from "../components/ui/CustomInput.tsx";

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
}

const EditProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    if (storedUserStr) {
      const storedUser = JSON.parse(storedUserStr) as User;
      setUser(storedUser);
      setUpdatedName(storedUser.name);
      setUpdatedEmail(storedUser.email);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleDeleteAccount = async () => {
    if (!user) return;

    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user._id}`,
        { method: "DELETE" },
      );
      if (response.ok) {
        toast({
          title: "Account deleted",
          description: "Your account has been deleted successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        localStorage.removeItem("user");
        navigate("/");
      } else {
        toast({
          title: "Deletion failed",
          description: "Unable to delete your account. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: "Network error",
        description: "An error occurred while deleting your account.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg="gray.50"
    >
      <CustomBox>
        <Heading mb={8} color="black" size="lg">
          Edit Profile
        </Heading>

        <VStack spacing={4}>
          <CustomInput
            name="Name"
            placeholder="Name"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          />

          <CustomInput
            name="Email"
            placeholder="Email"
            value={updatedEmail}
            onChange={(e) => setUpdatedEmail(e.target.value)}
          />
        </VStack>

        <Flex mt={6} gap={8} justify="space-between">
          <CustomButton
          // onClick={handleSaveProfile}
          >
            Save Changes
          </CustomButton>
          <CustomButton
            bg="blackAlpha.600"
            _hover={{ bg: "red.600" }}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </CustomButton>
        </Flex>
      </CustomBox>
    </VStack>
  );
};

export default EditProfilePage;
