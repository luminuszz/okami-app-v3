import type { TagModel } from "@/api/models";

import configColors from "tailwindcss/colors";

const replacedDeprecatedColorsMapper: Record<string, string> = {
  lightBlue: "sky",
  warmGray: "stone",
};

export const resolveTagColor = (tag: TagModel) => {
  let currentColor = tag.color as keyof typeof configColors;

  const existsInMapper = replacedDeprecatedColorsMapper?.[currentColor];

  if (existsInMapper) {
    currentColor = existsInMapper as keyof typeof configColors;
  }

  return {
    ...tag,
    color: configColors?.[currentColor]?.[500] ?? configColors.gray[500],
  };
};
