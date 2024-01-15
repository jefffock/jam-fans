export function buildTitle({ artists, sounds, song, queryParams }) {
	const { date, beforeDate, afterDate } = queryParams
	console.log('buildTitle', { artists, sounds, song, queryParams })
	let title = '🔥 '

	if (sounds && sounds.length > 0) {
		sounds.forEach((sound, i) => {
			title += sound.label
			if (i < sounds.length - 2) title += ', '
			if (i === sounds.length - 2) title += ' and '
		})
	}
	if (song) {
		title += ' ' + song.song
	}

	title += ' Jams'

	if (artists && artists.length > 0 && !date) {
		title += ' by '
		artists.forEach((artist, j) => {
			if (artist === 'Grateful Dead') title += 'The '
			title += artist
			if (j < artists.length - 2) title += ', '
			if (j === artists.length - 2) title += ' and '
		})
	}

	if (!artists || (artists.length === 0 && !date)) {
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

	return {
		title: title.trim(),
		fullTitle: title.trim() + ' on Jam Fans',
	}
}
