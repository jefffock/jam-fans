export function filterSounds(sounds, queryParams) {
	if (!queryParams?.soundIds || !Array.isArray(queryParams.soundIds)) {
		return null
	}

	const soundIdSet = new Set(queryParams.soundIds.map((id) => id.toString()))

	return sounds.filter((sound) => soundIdSet.has(sound.id.toString()))
}
