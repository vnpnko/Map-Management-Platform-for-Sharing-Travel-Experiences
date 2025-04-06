import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Heading, useToast } from "@chakra-ui/react";
import CustomButton from "../../../components/common/CustomButton.tsx";
import CustomBox from "../../../components/common/CustomBox.tsx";
import CustomInput from "../../../components/common/CustomInput.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import useDeleteUser from "../hooks/useDeleteUser.ts";
import useUpdateUser from "../hooks/useUpdateUser.ts";

const EditProfilePage: React.FC = () => {
  const { loggedInUser, setLoggedInUser } = useUser();
  const [updatedUsername, setUpdatedUsername] = useState(
    loggedInUser!.username,
  );
  const [updatedName, setUpdatedName] = useState(loggedInUser!.name);
  const { deleteUser, isDeletingUser, deleteUserError } = useDeleteUser();
  const { updateUserData, isUpdatingUserData } = useUpdateUser();

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (deleteUserError) {
      toast({
        title: "Delete Failed",
        description: deleteUserError.message,
        status: "error",
        isClosable: true,
      });
    }
  }, [deleteUserError, toast]);

  const handleDeleteUser = async () => {
    if (loggedInUser) {
      try {
        const data = await deleteUser({ _id: loggedInUser._id });
        if (data) {
          setLoggedInUser(null);
          navigate("/");
        }
      } catch (error) {
        toast({
          title: "Delete Failed",
          description: (error as Error).message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const handleUpdateUserData = async () => {
    if (loggedInUser) {
      try {
        const payload = {
          id: loggedInUser._id,
          username: updatedUsername,
          name: updatedName,
        };
        const updatedUser = await updateUserData(payload);
        setLoggedInUser(updatedUser);
        navigate(`/${updatedUsername}`);
      } catch (error) {
        toast({
          title: "Update Failed",
          description: (error as Error).message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

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
            name="Username"
            placeholder="Username"
            value={updatedUsername}
            onChange={(e) => setUpdatedUsername(e.target.value)}
            isDisabled={isUpdatingUserData}
          />

          <CustomInput
            name="Name"
            placeholder="Name"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          />

          <Flex gap={4}>
            <CustomButton
              flex={1}
              isSelected={false}
              onClick={handleUpdateUserData}
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
              onClick={handleDeleteUser}
              isDisabled={isDeletingUser}
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
