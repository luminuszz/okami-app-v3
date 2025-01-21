export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const concatWithCategoryLabel = (
  category: string,
  value: string | number,
) => {
  const categoryMapper = {
    MANGA: "Capítulo",
    ANIME: "Episódio",
  };

  const categoryLabel = categoryMapper[category as keyof typeof categoryMapper];

  return `${categoryLabel} ${value}`;
};

export const parseCategory = (category: string) => {
  const categoryMapper = {
    MANGA: "Mangá",
    ANIME: "Anime",
  };

  return categoryMapper[category as keyof typeof categoryMapper];
};

export const parseCategoryPredicate = (category: string) => {
  const categoryMapper = {
    MANGA: "Lendo",
    ANIME: "Assistindo",
  };

  return categoryMapper[category as keyof typeof categoryMapper];
};
