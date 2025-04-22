import { Flex, Text, Avatar } from "@chakra-ui/react";
import CustomButton from "../../../common/ui/CustomButton";
import { useNavigate } from "react-router-dom";
import { User } from "../../../models/User";
import FollowButton from "../../../common/ui/FollowButton.tsx";

interface Props {
  user: User;
  isOwnProfile: boolean;
}

const ProfileHeader = ({ user, isOwnProfile }: Props) => {
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
            <FollowButton user={user} />
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
