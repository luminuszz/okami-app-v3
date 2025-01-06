import { atom } from "jotai";

export const workActionsDrawerIsOpen = atom(false);

export const toggleWorkActionsDrawerActionAtom = atom(null, (get, set) => {
	set(workActionsDrawerIsOpen, !get(workActionsDrawerIsOpen));
});
