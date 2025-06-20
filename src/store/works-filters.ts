import type { WorkModelPaged } from "@/api/models";
import {
  getWorkControllerListUserWorksPagedInfiniteQueryOptions,
  getWorkControllerListUserWorksPagedQueryKey,
} from "@/api/okami";
import { queryClient } from "@/lib/react-query";
import { atom } from "jotai";
import { atomWithInfiniteQuery } from "jotai-tanstack-query";

export type WorkFilters = {
  search: string | null;
  status: "unread" | "read" | "finished" | "favorites" | null;
  category: "MANGA" | "ANIME" | null;
};

export const worksFiltersAtom = atom<WorkFilters>({
  search: null,
  status: "unread",
  category: null,
});

export const worksFiltersIsIsOpen = atom<boolean>(false);

export const toggleWorkFilter = atom(null, (get, set) => {
  set(worksFiltersIsIsOpen, !get(worksFiltersIsIsOpen));
});

export const worksFilterParamsQueryKeyAtom = atom((get) => {
  const { search, status, category } = get(worksFiltersAtom);

  return getWorkControllerListUserWorksPagedQueryKey({
    search: search ?? undefined,
    status: status ?? undefined,
    category: category ?? undefined,
    page: 1,
    limit: 10,
  });
});

export const fetchWorksWithFiltersAtomQuery =
  atomWithInfiniteQuery<WorkModelPaged>((get) => {
    const { search, status, category } = get(worksFiltersAtom);

    const parsedFilters = {
      search: search ?? undefined,
      status: status ?? undefined,
      category: category ?? undefined,
    };

    return {
      ...getWorkControllerListUserWorksPagedInfiniteQueryOptions({
        ...parsedFilters,
        limit: 10,
        page: 1,
      }),
      queryKey: get(worksFilterParamsQueryKeyAtom),
      getNextPageParam: (lastPage: { nextPage: number }) => lastPage.nextPage,
    };
  });

export const invalidateWorkListWithFiltersQuery = atom(null, async (get) => {
  console.log("invalidating", get(worksFilterParamsQueryKeyAtom));

  await queryClient.invalidateQueries({
    queryKey: get(worksFilterParamsQueryKeyAtom),
  });
});
