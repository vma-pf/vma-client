import { UseFormSetError, set } from "react-hook-form";
import { EntityError } from "./http";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateValue } from "@nextui-org/react";

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

export const decodeToken = (token: string) => {
  if (!token) {
    return;
  }
  return JSON.parse(atob(token.split(".")[1]));
};

export const changeToDate = (date: DateValue) => {
  return new Date(date.year, date.month - 1, date.day);
};

export const ROLE = {
  VETERINARIAN: "veterinarian",
  FARMER: "farmer",
};
