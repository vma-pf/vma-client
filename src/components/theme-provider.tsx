"use client";

import * as React from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type ProviderProps } from "react";

export function ThemeProvider({ children, ...props }: any) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}
