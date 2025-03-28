import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Heading } from "@chakra-ui/react";
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
      <CustomBox p={8} w={"sm"}>
        <Heading mb={8} color="black" size="lg">
          Edit Profile
        </Heading>

        <Flex
          as={"form"}
          // onSubmit={handleSignUp}
          direction={"column"}
          gap={4}
        >
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

          <Flex gap={4}>
            <CustomButton
            // onClick={handleSaveProfile}
            >
              Save Changes
            </CustomButton>
            <CustomButton
              bg="blackAlpha.600"
              _hover={{ bg: "red.600" }}
              // onClick={handleDeleteAccount}
            >
              Delete Account
            </CustomButton>
          </Flex>
        </Flex>
      </CustomBox>
    </Flex>
  );
};

export default EditProfilePage;
