import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Heading, useToast } from "@chakra-ui/react";
import CustomButton from "../../common/components/ui/CustomButton.tsx";
import CustomBox from "../../common/components/ui/CustomBox.tsx";
import CustomInput from "../../common/components/ui/CustomInput.tsx";
import useDeleteUser from "./hooks/useDeleteUser.ts";
import useUpdateUser from "./hooks/useUpdateUser.ts";
import { useUserStore } from "../../store/useUserStore.ts";

const EditProfilePage: React.FC = () => {
  const { user, setUser } = useUserStore();

  const [updatedName, setUpdatedName] = useState(user!.name);
  const [updatedUsername, setUpdatedUsername] = useState(user!.username);
  const [updatedPassword, setUpdatedPassword] = useState(user!.password);

  const { updateUserData, isUpdatingUserData } = useUpdateUser();
  const { deleteUser, isDeletingUser, deleteUserError } = useDeleteUser();

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

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const handleDeleteUser = async () => {
    if (user) {
      try {
        const data = await deleteUser({ _id: user._id });
        if (data) {
          setUser(null);
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
    if (user) {
      try {
        const payload = {
          id: user._id,
          name: updatedName,
          username: updatedUsername,
          password: updatedPassword,
        };
        const updatedUser = await updateUserData(payload);
        setUser(updatedUser);
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
          Edit profile
        </Heading>

        <Flex
          as={"form"}
          // onSubmit={handleSignUp}
          direction={"column"}
          gap={4}
        >
          <CustomInput
            name="Full name"
            placeholder="Full name"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          />

          <CustomInput
            name="Username"
            placeholder="Username"
            value={updatedUsername}
            onChange={(e) => setUpdatedUsername(e.target.value)}
            isDisabled={isUpdatingUserData}
          />

          <CustomInput
            name="Password"
            placeholder="Password"
            type="password"
            value={updatedPassword}
            onChange={(e) => setUpdatedPassword(e.target.value)}
            isDisabled={isUpdatingUserData}
          />

          <CustomButton
            isSelected={false}
            isDisabled={isUpdatingUserData}
            onClick={handleUpdateUserData}
          >
            Save changes
          </CustomButton>
          <CustomButton
            isSelected={true}
            textColor="black"
            borderColor="blackAlpha.300"
            onClick={handleLogout}
          >
            Logout
          </CustomButton>
          <CustomButton
            isSelected={true}
            textColor="red.500"
            _hover={{
              bg: "red.500",
              textColor: "white",
            }}
            onClick={handleDeleteUser}
            isDisabled={isDeletingUser}
          >
            Delete account
          </CustomButton>
        </Flex>
      </CustomBox>
    </Flex>
  );
};

export default EditProfilePage;
