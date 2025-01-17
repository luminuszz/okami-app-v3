export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const daysOfWeek = [
  { dayNumber: 0, dayName: "Domingo" },
  { dayNumber: 1, dayName: "Segunda-feira" },
  { dayNumber: 2, dayName: "Terça-feira" },
  { dayNumber: 3, dayName: "Quarta-feira" },
  { dayNumber: 4, dayName: "Quinta-feira" },
  { dayNumber: 5, dayName: "Sexta-feira" },
  { dayNumber: 6, dayName: "Sábado" },
];

export const concatWithCategoryLabel = (
  category: string,
  value: string | number,
) => {
  const categoryMapper = {
    MANGA: "Capítulo",
    ANIME: "Episódio",
  };

  console.log(category);

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
