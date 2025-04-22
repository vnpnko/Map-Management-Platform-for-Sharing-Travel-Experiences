import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Heading } from "@chakra-ui/react";
import CustomButton from "../../common/ui/CustomButton.tsx";
import CustomInput from "../../common/ui/CustomInput.tsx";
import useDeleteUser from "./hooks/useDeleteUser.ts";
import useUpdateUser from "./hooks/useUpdateUser.ts";
import { loggedInUserStore } from "../../store/loggedInUserStore.ts";
import PasswordInput from "../../common/ui/PasswordInput.tsx";
import useToastError from "../../common/hooks/toast/useToastError.ts";

const EditProfilePage: React.FC = () => {
  const { loggedInUser, setLoggedInUser } = loggedInUserStore();

  const [updatedName, setUpdatedName] = useState(loggedInUser!.name);
  const [updatedUsername, setUpdatedUsername] = useState(
    loggedInUser!.username,
  );
  const [updatedPassword, setUpdatedPassword] = useState(
    loggedInUser!.password,
  );

  const { updateUserData, isUpdatingUserData } = useUpdateUser();
  const { deleteUser, isDeletingUser, deleteUserError } = useDeleteUser();

  const navigate = useNavigate();
  const toastError = useToastError();

  useEffect(() => {
    if (deleteUserError) {
      toastError({
        title: "Delete Failed",
        description: deleteUserError.message,
      });
    }
  }, [deleteUserError, toastError]);

  const handleLogout = () => {
    setLoggedInUser(null);
    navigate("/");
  };

  const handleDeleteUser = async () => {
    if (loggedInUser) {
      try {
        const data = await deleteUser({ _id: loggedInUser._id });
        if (data) {
          setLoggedInUser(null);
          navigate("/");
        }
      } catch (error) {
        toastError({
          title: "Delete Failed",
          description: (error as Error).message,
        });
      }
    }
  };

  const handleUpdateUserData = async () => {
    if (loggedInUser) {
      try {
        const payload = {
          id: loggedInUser._id,
          name: updatedName,
          username: updatedUsername,
          password: updatedPassword,
        };
        const updatedUser = await updateUserData(payload);
        setLoggedInUser(updatedUser);
        navigate(`/${updatedUsername}`);
      } catch (error) {
        toastError({
          title: "Update Failed",
          description: (error as Error).message,
        });
      }
    }
  };

  return (
    <Flex direction="column" w="sm" gap={8} alignItems="center">
      <Heading color="black" size="lg">
        Edit profile
      </Heading>

      <Flex
        as={"form"}
        direction={"column"}
        alignItems={"center"}
        w="full"
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

        <PasswordInput
          name="Password"
          placeholder="Password"
          value={updatedPassword}
          onChange={(e) => setUpdatedPassword(e.target.value)}
          isDisabled={isUpdatingUserData}
        />

        <CustomButton
          w="full"
          isSelected={false}
          isDisabled={isUpdatingUserData}
          onClick={handleUpdateUserData}
        >
          Save changes
        </CustomButton>
        <CustomButton
          w="full"
          isSelected={true}
          textColor="black"
          borderColor="blackAlpha.300"
          onClick={handleLogout}
        >
          Logout
        </CustomButton>
        <CustomButton
          w="full"
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
    </Flex>
  );
};

export default EditProfilePage;
