import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Heading } from "@chakra-ui/react";
import CustomButton from "../../../components/common/CustomButton.tsx";
import CustomBox from "../../../components/common/CustomBox.tsx";
import CustomInput from "../../../components/common/CustomInput.tsx";

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
    <Flex direction="column">
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
              flex={1}
              isSelected={false}
              // onClick={handleSaveProfile}
            >
              Save Changes
            </CustomButton>
            <CustomButton
              flex={1}
              bg="gray.50"
              textColor="black"
              _hover={{
                bg: "red.500",
                textColor: "white",
              }}
              borderColor="blackAlpha.300"
              borderWidth={2}
              w={"full"}
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
