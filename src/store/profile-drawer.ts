import { atom } from "jotai";

export const profileDrawerIsOpen = atom(false);

export const toggleProfileDrawerActionAtom = atom(null, (get, set) => {
	set(profileDrawerIsOpen, !get(profileDrawerIsOpen));
});
