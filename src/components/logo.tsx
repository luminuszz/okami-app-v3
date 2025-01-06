import { Image } from "expo-image";

import okamiLogo from "@/assets/images/okami.png";

export function OkamiLogo() {
	return <Image source={okamiLogo} style={{ width: 150, height: 150 }} />;
}
