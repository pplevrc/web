import {
  type CssKeyframes,
  type SemanticTokens,
  type Tokens,
  defineKeyframes,
  defineSemanticTokens,
  defineTokens,
} from "@pandacss/dev";

export const tokens: Tokens = defineTokens({
  easings: {
    linear: {
      value: [0, 0, 1, 1],
    },
    easeIn: {
      sine: {
        value: [0.47, 0, 0.745, 0.715],
        description: "弱い EaseIn",
      },
      quad: {
        value: [0.55, 0.085, 0.68, 0.53],
        description: "弱めの EaseIn",
      },
      cubic: {
        value: [0.55, 0.055, 0.675, 0.19],
        description: "少し弱めの EaseIn",
      },
      quart: {
        value: [0.895, 0.03, 0.685, 0.22],
        description: "少し強めの EaseIn",
      },
      quint: {
        value: [0.755, 0.05, 0.855, 0.06],
        description: "強めの EaseIn",
      },
      expo: {
        value: [0.95, 0.05, 0.795, 0.035],
        description: "強い EaseIn",
      },
      circ: {
        value: [0.6, 0.04, 0.98, 0.335],
        description: "強いが, 加減速がゆるやかな EaseIn",
      },
      back: {
        value: [0.6, -0.28, 0.735, 0.045],
        description: "行き過ぎてから少し戻る EaseIn",
      },
    },
    easeOut: {
      sine: {
        value: [0.39, 0.575, 0.565, 1],
        description: "弱い EaseOut",
      },
      quad: {
        value: [0.25, 0.46, 0.45, 0.94],
        description: "弱めの EaseOut",
      },
      cubic: {
        value: [0.215, 0.61, 0.355, 1],
        description: "少し弱めの EaseOut",
      },
      quart: {
        value: [0.165, 0.84, 0.44, 1],
        description: "少し強めの EaseOut",
      },

      quint: {
        value: [0.23, 1, 0.32, 1],
        description: "強めの EaseOut",
      },
      expo: {
        value: [0.19, 1, 0.22, 1],
        description: "強い EaseOut",
      },
      circ: {
        value: [0.075, 0.82, 0.165, 1],
        description: "強いが, 加減速がゆるやかな EaseOut",
      },
      back: {
        value: [0.175, 0.885, 0.32, 1.275],
        description: "行き過ぎてから少し戻る EaseOut",
      },
    },
    easeInOut: {
      sine: {
        value: [0.445, 0.05, 0.55, 0.95],
        description: "弱い EaseInOut",
      },
      quad: {
        value: [0.455, 0.03, 0.515, 0.955],
        description: "弱めの EaseInOut",
      },
      cubic: {
        value: [0.645, 0.045, 0.355, 1],
        description: "少し弱めの EaseInOut",
      },
      quart: {
        value: [0.77, 0, 0.175, 1],
        description: "少し強めの EaseInOut",
      },
      quint: {
        value: [0.86, 0, 0.07, 1],
        description: "強めの EaseInOut",
      },
      expo: {
        value: [1, 0, 0, 1],
        description: "強い EaseInOut",
      },
      circ: {
        value: [0.785, 0.135, 0.15, 0.86],
        description: "強いが, 加減速がゆるやかな EaseInOut",
      },
      back: {
        value: [0.68, -0.55, 0.265, 1.55],
        description: "行き過ぎてから少し戻る EaseInOut",
      },
    },
  },
  durations: {
    none: {
      value: "0s",
    },
    faster: {
      value: "150ms",
    },
    fast: {
      value: "300ms",
    },
    slow: {
      value: "1000ms",
    },
    slower: {
      value: "3000ms",
    },
    slowest: {
      value: "12000ms",
    },
  },
  animations: {},
});

export const semanticTokens: SemanticTokens = defineSemanticTokens({});

export const keyframes: CssKeyframes = defineKeyframes({
  fadeIn: {
    from: { opacity: "0" },
    to: { opacity: "1" },
  },
  rotate: {
    from: {
      transform: "rotate(0)",
    },
    to: {
      transform: "rotate(360deg)",
    },
  },
  logoShrink: {
    "0%": {
      transform: "scale(var(--large-logo-size))",
      opacity: "1",
    },
    "25%": {
      transform: "scale(var(--large-logo-size))",
      opacity: "1",
    },
    "32.5%": {
      transform: "scale(var(--large-logo-size))",
      opacity: "0",
    },
    "34%": {
      transform: "scale(1)",
      opacity: "0",
    },
    "34.5%": {
      transform: "scale(1)",
      opacity: "0",
    },
    "42%": {
      transform: "scale(1)",
      opacity: "1",
    },
    "100%": {
      transform: "scale(1)",
      opacity: "1",
    },
  },
});

export const globalVars = {
  "--large-logo-size": {
    syntax: "<percentage>",
    inherits: false,
    initialValue: "100%",
  },
} as const;
