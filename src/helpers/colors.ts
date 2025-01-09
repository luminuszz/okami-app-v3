import type { TagModel } from "@/api/models";

import configColors from "tailwindcss/colors";

export const resolveTagColor = (tag: TagModel) => {
  let currentColor = tag.color as keyof typeof configColors;

  if (currentColor === "lightBlue") {
    currentColor = "sky";
  }

  return {
    ...tag,
    color: configColors?.[currentColor]?.[500] ?? configColors.gray[500],
  };
};
