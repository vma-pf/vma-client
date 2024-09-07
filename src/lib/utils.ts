import { UseFormSetError, set } from "react-hook-form";
import { EntityError } from "./http";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
