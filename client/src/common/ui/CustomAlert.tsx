import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";

export interface CustomAlertProps {
  title: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ title }) => {
  return (
    <Alert
      status="error"
      variant="solid"
      alignItems={"center"}
      justifyContent={"center"}
      p={6}
    >
      <AlertIcon boxSize={10} />
      <AlertTitle fontSize="xl">{title}</AlertTitle>
    </Alert>
  );
};

export default CustomAlert;
