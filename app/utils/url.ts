export function createFilterURL(baseURL, filters) {
	console.log('filters', filters)
	const params = new URLSearchParams()

	if (filters.dateFilter) {
		params.append('date', filters.dateFilter)
	}
	if (filters.songFilter) {
		params.append('song', filters.songName)
	}
	if (filters.artistNames?.length > 0) {
		params.append('artist', filters.artistNames[0])
	}

	if (filters.soundNames?.length > 0) {
		filters.soundNames.forEach((sound) => {
			params.append('sound', sound)
		})
	}
	console.log('params', params.toString())

	return `${baseURL}?${params.toString()}`
}

export function slugify(string) {
	if (!string) {
		return ''
	}
	return string
		.toLowerCase()
		.replace(/ /g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '')
}
