export function buildTitle({
	artistNames,
	soundNames,
	songName,
	beforeDateFilter,
	afterDateFilter,
	dateFilter,
	showJams,
	showSets,
	showShows,
}) {
	let title = '🔥 '

	if (soundNames && soundNames.length > 0) {
		title += soundNames.join(', ').replace(/, ([^,]*)$/, ' and $1')
	}

	if (songName) {
		title += ` ${songName}`
	}

	if (showJams) {
		title += ' jams'
		if (showSets || showShows) {
			title += ', '
		}
	}
	if (showSets) {
		title += ' sets'
		if (showShows) {
			title += ', '
		}
	}
	if (showShows) {
		if (showJams || showSets) {
			title += ' and '
		}
		title += ' shows'
	}
	if (artistNames && artistNames.length > 0) {
		title += ' by '
		title += artistNames
			.map((artist) => (artist === 'Grateful Dead' ? 'The ' + artist : artist))
			.join(', ')
			.replace(/, ([^,]*)$/, ' and $1')
	}

	if (dateFilter) {
		title += ' from ' + new Date(dateFilter + 'T16:00:00').toLocaleDateString()
	} else {
		if (beforeDateFilter && afterDateFilter) {
			title += ' from ' + afterDateFilter + ' to ' + beforeDateFilter
		} else if (beforeDateFilter) {
			title += ' from ' + beforeDateFilter + ' and earlier'
		} else if (afterDateFilter) {
			title += ' from ' + afterDateFilter + ' and later'
		}
	}

	return title.trim()
}
