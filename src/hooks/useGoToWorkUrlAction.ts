import { useOkamiToast } from "@/components/okami-toast";
import { STORAGE_KEYS } from "@/lib/storage";
import { mmkvStorage } from "@/lib/storage/mmkv";
import { Linking } from "react-native";
import { useMMKVString } from "react-native-mmkv";

export interface WorkParams {
	workUrl: string;
	workId: string;
}

export function useGoToWorkUrlAction() {
	const [, setLastWorkClickedStorage] = useMMKVString(
		STORAGE_KEYS.LAST_WORK_CLICKED,
		mmkvStorage,
	);
	const toast = useOkamiToast();

	async function handlePushToUrl(data: WorkParams) {
		const canOpenUrl = await Linking.canOpenURL(data.workUrl);

		if (!canOpenUrl) {
			toast({
				title: "Erro ao abrir link",
				description:
					"Não foi possível abrir o link, tente novamente mais tarde.",
				action: "error",
			});

			return;
		}

		try {
			await Linking.openURL(data.workUrl);
			setLastWorkClickedStorage(data.workId);
		} catch (e) {
			toast({
				title: "Erro ao abrir link",
				description:
					"Não foi possível abrir o link, tente novamente mais tarde.",
				action: "error",
			});
		}
	}

	return handlePushToUrl;
}
