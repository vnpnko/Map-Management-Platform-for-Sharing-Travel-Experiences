import React from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface ErrorMessageProps extends TextProps {
  error: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, ...rest }) => {
  return (
    <Text color="red.500" {...rest}>
      {error}
    </Text>
  );
};

export default ErrorMessage;
