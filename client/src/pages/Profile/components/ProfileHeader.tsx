import { Flex, Text, Avatar } from "@chakra-ui/react";
import CustomButton from "../../../common/components/ui/CustomButton";
import { useNavigate } from "react-router-dom";
import { User } from "../../../models/User";

interface Props {
  user: User;
  isOwnProfile: boolean;
  isFollowingUser: boolean;
  onFollowToggle: () => void;
  isFollowLoading: boolean;
}

const ProfileHeader = ({
  user,
  isOwnProfile,
  isFollowingUser,
  onFollowToggle,
  isFollowLoading,
}: Props) => {
  const navigate = useNavigate();

  return (
    <Flex gap={8} w={"xl"}>
      <Avatar name={user.username} size="2xl" />
      <Flex direction="column" w="full">
        <Flex alignItems="center" justifyContent="space-between">
          <Text color={"black"} fontSize="5xl" fontWeight="medium">
            {user.username}
          </Text>
          {isOwnProfile ? (
            <CustomButton
              width={120}
              height={50}
              isSelected
              onClick={() => navigate(`/${user.username}/edit`)}
            >
              Edit profile
            </CustomButton>
          ) : (
            <CustomButton
              width={120}
              height={50}
              isSelected
              onClick={onFollowToggle}
              isDisabled={isFollowLoading}
            >
              {isFollowingUser ? "Unfollow" : "Follow"}
            </CustomButton>
          )}
        </Flex>
        <Text color={"black"} fontSize="xl">
          {user.name}
        </Text>
      </Flex>
    </Flex>
  );
};

export default ProfileHeader;
