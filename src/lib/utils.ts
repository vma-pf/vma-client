import { UseFormSetError, set } from "react-hook-form";
import { EntityError } from "./http";

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((error: any) => {
      setError(error.field, { type: "server", message: error.message });
    });
  } else {
    console.log(error);
  }
};
