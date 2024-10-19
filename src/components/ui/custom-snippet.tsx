import { Snippet, extendVariants } from "@nextui-org/react";

export const CustomSnippet = extendVariants(Snippet, {
  variants: {
    color: {
      white: {
        symbol: "FFFFFF",
        base: "FFFFFF",
        pre: "FFFFFF",
        content: "FFFFFF",
        copyButton: "FFFFFF",
        copyIcon: "FFFFFF",
        checkIcon: "FFFFFF",
      },
    },
  },
});
