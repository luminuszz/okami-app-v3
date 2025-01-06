export const STORAGE_KEYS = {
	REFRESH_TOKEN: "auth.refresh-token",
	TOKEN: "auth.token",
	SYNC_WORK_DELAY_DATE: "user.okami-sync-work-delay-date",
	LAST_WORK_CLICKED: "user.okami-last-work-clicked",
	USER_IS_SUBSCRIBED_IN_NOTIFICATIONS: "user.is-subscribed-in-notifications",
} as const;

export interface AsyncStoragePersister {
	getItem: (key: string) => Promise<string | null>;
	setItem: (key: string, value: string) => Promise<unknown>;
	removeItem: (key: string) => Promise<void>;
}
