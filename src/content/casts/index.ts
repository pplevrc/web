import { memoize } from "@lib/utils/cache";

import { createMockCasts } from "./__mock__";
import { type Cast, type FetchedCast, assertCasts } from "./types";

export type { Avatar, AvatarImages } from "./avatar";
export type { Cast, CastProfile, VRChatProfile } from "./types";

export const fetchCasts = memoize(async (): Promise<Cast[]> => {
	// 本来は API からデータを取得する
	const result = await createMockCasts();

	assertCasts(result);

	return Promise.all(result.map(fixCast));
});

async function fixCast(cast: FetchedCast): Promise<Cast> {
	return cast as Cast;
}

export async function fetchCastByNickName(nickname: string): Promise<Cast> {
	const casts = await fetchCasts();
	const cast = casts.find((cast) => cast.profile.nickname === nickname);

	if (!cast) {
		throw new Error(`Cast "${nickname}" not found`);
	}

	return cast;
}
