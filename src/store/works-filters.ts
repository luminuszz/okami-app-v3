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

const LIMIT_PER_PAGE = 20 as const;
const FIRST_PAGE = 1 as const;

export const worksFiltersAtom = atom<WorkFilters>({
  search: null,
  status: "unread",
  category: null,
});

export const paginationAtom = atom({
  limit: LIMIT_PER_PAGE,
  page: FIRST_PAGE,
});

export const worksFiltersIsIsOpen = atom<boolean>(false);

export const toggleWorkFilter = atom(null, (get, set) => {
  set(worksFiltersIsIsOpen, !get(worksFiltersIsIsOpen));
});

export const worksFilterParamsQueryKeyAtom = atom((get) => {
  const { search, status, category } = get(worksFiltersAtom);
  const { page, limit } = get(paginationAtom);

  return getWorkControllerListUserWorksPagedQueryKey({
    search: search ?? undefined,
    status: status ?? undefined,
    category: category ?? undefined,
    page,
    limit,
  });
});

export const fetchWorksWithFiltersAtomQuery =
  atomWithInfiniteQuery<WorkModelPaged>((get) => {
    const { search, status, category } = get(worksFiltersAtom);
    const { page, limit } = get(paginationAtom);

    const parsedFilters = {
      search: search ?? undefined,
      status: status ?? undefined,
      category: category ?? undefined,
      page,
      limit,
    };
    return getWorkControllerListUserWorksPagedInfiniteQueryOptions(
      parsedFilters,
      {
        query: {
          queryKey: get(worksFilterParamsQueryKeyAtom),
          getNextPageParam: (lastPage) => Number(lastPage.nextPage),
        },
      },
    );
  });

export const invalidateWorkListWithFiltersQuery = atom(null, async (get) => {
  await queryClient.invalidateQueries({
    queryKey: get(worksFilterParamsQueryKeyAtom),
  });
});
