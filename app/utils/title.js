export function createTitle(queryParams) {
	let title = '🔥 '
	const { soundsInQuery, song, artistsInQueryNames, date, beforeDate, afterDate, sounds } = queryParams

	if (soundsInQuery && soundsInQuery.length > 0) {
		soundsInQuery.forEach((sound, i) => {
			const foundSound = sounds.find((s) => s.text === sound)?.label || ''
			title += foundSound
			if (i < soundsInQuery.length - 2) title += ', '
			if (i === soundsInQuery.length - 2) title += ' and '
		})
	}

	if (song) {
		title += ' ' + song
	}

	title += ' Jams'

	if (artistsInQueryNames && artistsInQueryNames.length > 0 && !date) {
		title += ' by '
		artistsInQueryNames.forEach((artist, j) => {
			if (artist === 'Grateful Dead') title += 'The '
			title += artist
			if (j < artistsInQueryNames.length - 2) title += ', '
			if (j === artistsInQueryNames.length - 2) title += ' and '
		})
	}

	if (!artistsInQueryNames || (artistsInQueryNames.length === 0 && !date)) {
		title += ' by All Bands'
	}

	if (date) {
		title += ' from ' + new Date(date + 'T16:00:00').toLocaleDateString()
	}

	if (beforeDate && afterDate && !date) {
		title += beforeDate === afterDate ? ' from ' + beforeDate : ' from ' + afterDate + ' to ' + beforeDate
	}

	if (beforeDate && !afterDate && !date) {
		title += ' from ' + beforeDate + ' and before '
	}

	if (afterDate && !beforeDate && !date) {
		title += ' from ' + afterDate + ' and after '
	}

	return title.trim() + ' on Jam Fans'
}
