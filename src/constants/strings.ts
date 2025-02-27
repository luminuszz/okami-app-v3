export const filtersLabels = {
  unread: "Atualizado",
  read: "Lido",
  finished: "Finalizado",
  favorites: "Favorito",
} as const;

export const filtersOptions = [
  {
    label: "Favorito",
    value: "favorites",
  },
  {
    label: "Finalizado",
    value: "finished",
  },
  {
    label: "Lido",
    value: "read",
  },
  {
    label: "Atualizado",
    value: "unread",
  },
] as const;

export const daysOfWeek = [
  { dayNumber: 0, dayName: "Domingo" },
  { dayNumber: 1, dayName: "Segunda-feira" },
  { dayNumber: 2, dayName: "Terça-feira" },
  { dayNumber: 3, dayName: "Quarta-feira" },
  { dayNumber: 4, dayName: "Quinta-feira" },
  { dayNumber: 5, dayName: "Sexta-feira" },
  { dayNumber: 6, dayName: "Sábado" },
];
