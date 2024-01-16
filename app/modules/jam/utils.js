export function buildTitle({ artistNames, soundNames, song, beforeDateFilter, afterDateFilter, date }) {
	console.log('buildTitle', {
		artistNames,
		soundNames,
		song,
		date,
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

	if (beforeDateFilter && afterDateFilter && !date) {
		title +=
			beforeDateFilter === afterDateFilter
				? ' from ' + beforeDateFilter
				: ' from ' + afterDateFilter + ' to ' + beforeDateFilter
	}

	if (beforeDateFilter && !afterDateFilter && !date) {
		title += ' from ' + beforeDateFilter + ' and before '
	}

	if (afterDateFilter && !beforeDateFilter && !date) {
		title += ' from ' + afterDateFilter + ' and after '
	}

	return {
		title: title.trim(),
		fullTitle: title.trim() + ' on Jam Fans',
	}
}
