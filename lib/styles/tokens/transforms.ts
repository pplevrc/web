import { type Tokens, defineTokens } from "@pandacss/dev";

export const tokens: Tokens = defineTokens({
  opacity: {
    none: {
      value: 100,
    },
    full: {
      value: 0,
    },
  },
});
