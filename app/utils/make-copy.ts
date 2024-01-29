export function buildTitle({
	artistNames,
	soundNames,
	songName,
	beforeDateFilter,
	afterDateFilter,
	dateFilter,
	musicalEntitiesFilters,
}) {
	console.log('musicalEntitiesFilters', musicalEntitiesFilters)
	const musicalEntitiesToShow = Object.keys(musicalEntitiesFilters).filter((key) => musicalEntitiesFilters[key])

	let title = '🔥 '

	if (soundNames && soundNames.length > 0) {
		title += soundNames.join(', ').replace(/, ([^,]*)$/, ' and $1')
	}

	if (songName) {
		title += ` ${songName}`
	}

	switch (musicalEntitiesToShow.length) {
		case 1:
			title += musicalEntitiesToShow[0]
			break
		case 2:
			title += `${musicalEntitiesToShow[0]} and ${musicalEntitiesToShow[1]}`
			break
		case 3:
			title += 'jams, sets, and shows'
			break
		default:
			title += ''
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

export function buildFiltersButtonText(filters, count) {
	// Filter keys that are true
	let enabledEntities
	if (filters) {
		enabledEntities = Object.keys(filters).filter((key) => filters[key])
	} else {
		enabledEntities = ['jams', 'sets', 'shows']
	}

	// Convert array to a string like "jams, sets, and shows"
	const entityString = enabledEntities.join(', ').replace(/, ([^,]*)$/, ' and $1')

	// Return the full description
	return count !== 0 ? `see ${count} ${entityString}` : `0 😢`
}
