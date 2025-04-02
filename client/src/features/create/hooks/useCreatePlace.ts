import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { Place } from "../../../models/Place.ts";

type CreatePlacePayload = Place;

type CreatePlaceResponse = Place;

const createPlaceRequest = async (
  payload: CreatePlacePayload,
): Promise<CreatePlaceResponse> => {
  const response = await fetch(`${BASE_URL}/createPlace`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to create place");
  }
  return data;
};

const useCreatePlace = () => {
  const { mutateAsync, isPending, error } = useMutation<
    CreatePlaceResponse,
    Error,
    CreatePlacePayload
  >({
    mutationFn: createPlaceRequest,
  });

  return {
    createPlace: mutateAsync,
    isCreatingPlace: isPending,
    createPlaceError: error,
  };
};

export default useCreatePlace;
