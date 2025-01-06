import { TagModel } from "@/api/models";

import configColors from "tailwindcss/colors";

export const resolveTagColor = (tag: TagModel) => {
	const currentColor = tag.color as keyof typeof configColors;

	return {
		...tag,
		color: configColors?.[currentColor]?.[500] ?? configColors.gray[500],
	};
};
