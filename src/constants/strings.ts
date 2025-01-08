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
    value: "finish",
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
