import React, { useState } from "react";
import {
  InputGroup,
  InputRightElement,
  IconButton,
  InputProps,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import CustomInput from "./CustomInput";

interface PasswordInputProps extends InputProps {
  name?: string;
  isError?: boolean;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  isError,
  error,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup>
      <CustomInput
        name={name}
        type={showPassword ? "text" : "password"}
        isError={isError}
        error={error}
        {...rest}
      />
      <InputRightElement>
        <IconButton
          aria-label={showPassword ? "Hide password" : "Show password"}
          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
          onClick={() => setShowPassword(!showPassword)}
          color="black"
          mb={3}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
