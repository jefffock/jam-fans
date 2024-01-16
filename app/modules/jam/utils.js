export function buildTitle({ artistNames, soundNames, song, queryParams }) {
	const { date, beforeDate, afterDate } = queryParams
	console.log('buildTitle', {
		artistNames,
		soundNames,
		song,
		date,
		queryParams,
	})
	let title = '🔥 '

	if (soundNames && soundNames.length > 0) {
		soundNames.forEach((sound, i) => {
			title += sound
			if (i < soundNames.length - 2) title += ', '
			if (i === soundNames.length - 2) title += ' and '
		})
	}
	if (song) {
		title += ' ' + song.song
	}

	title += ' Jams'

	// if (artists && artists.length > 0 && !date) {
	// 	title += ' by '

	if (artistNames && artistNames.length > 0) {
		title += ' by '
		artistNames.forEach((artist, i) => {
			if (artist === 'Grateful Dead') title += 'The '
			title += artist
			if (i < artistNames.length - 2) title += ', '
			if (i === artistNames.length - 2) title += ' and '
		})
	}

	if (date) {
		console.log('date in utils', date)
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
