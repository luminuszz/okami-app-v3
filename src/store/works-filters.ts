import { atom } from "jotai";

export type WorkFilters = {
  search: string | null;
  status: "unread" | "read" | "finished" | "favorites" | null;
};

export const worksFiltersAtom = atom<WorkFilters>({
  search: null,
  status: "unread",
});

export const worksFiltersIsIsOpen = atom<boolean>(false);

export const toggleWorkFilter = atom(null, (get, set) => {
  set(worksFiltersIsIsOpen, !get(worksFiltersIsIsOpen));
});
