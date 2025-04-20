import { Flex, Spinner } from "@chakra-ui/react";

const CustomSpinner: React.FC = () => {
  return (
    <Flex direction="column" align={"center"} justify={"center"} w="full" p={4}>
      <Spinner size={"md"} color={"black"} />
    </Flex>
  );
};

export default CustomSpinner;
