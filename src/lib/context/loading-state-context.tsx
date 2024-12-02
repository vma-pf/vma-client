"use client";
import React from "react";

type LoadingStateContextType = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoadingStateContext = React.createContext<LoadingStateContextType>({
  loading: false,
  setLoading: () => {},
});

export const LoadingStateProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [loading, setLoading] = React.useState(false);
  return <LoadingStateContext.Provider value={{ loading, setLoading }}>{children}</LoadingStateContext.Provider>;
};

export default LoadingStateContext;
