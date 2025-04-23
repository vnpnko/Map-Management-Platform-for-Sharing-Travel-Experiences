import { ToastProps, useToast } from "@chakra-ui/react";

export interface ToastErrorProps extends ToastProps {
  title: string;
  description?: string;
}

const useToastError = () => {
  const toast = useToast();

  return (props: ToastErrorProps) =>
    toast({
      status: "success",
      duration: 3000,
      position: "bottom-left",
      isClosable: true,
      ...props,
    });
};

export default useToastError;
