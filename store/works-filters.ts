import { atom } from "jotai";

type WorkFilters = {
  search: string | null;
  status: "unread" | "read" | "finished" | "favorites" | null;
};

export const worksFiltersAtom = atom<WorkFilters>({
  search: null,
  status: null,
});

export const worksFiltersIsIsOpen = atom<boolean>(false);

export const toggleWorkFilter = atom(null, (get, set) => {
  set(worksFiltersIsIsOpen, !get(worksFiltersIsIsOpen));
});
