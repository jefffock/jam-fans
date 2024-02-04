import { useMemo } from 'react'

const useFilteredMusicalEntities = ({
	allJams,
	allSets,
	allShows,
	musicalEntitiesFilters,
	dateFilter,
	songFilter,
	artistFilters,
	linkFilter,
	soundFilters,
	beforeDateFilter,
	afterDateFilter,
}) => {
	return useMemo(() => {
		let combinedArray = []
		if (musicalEntitiesFilters.jams) {
			combinedArray = [...combinedArray, ...allJams]
		}
		if (musicalEntitiesFilters.sets) {
			combinedArray = [...combinedArray, ...allSets]
		}
		if (musicalEntitiesFilters.shows) {
			combinedArray = [...combinedArray, ...allShows]
		}

		return combinedArray
			.filter((item) => {
				return (
					(!dateFilter || item.date === dateFilter || item.date_text === dateFilter) &&
					(!songFilter || item?.song_name === songFilter) &&
					(artistFilters.length === 0 || artistFilters.includes(item.artist_id.toString())) &&
					(!linkFilter || item.listen_link) &&
					(soundFilters.length === 0 ||
						soundFilters.every((filter) => item.sound_ids.includes(filter.toString()))) &&
					(!beforeDateFilter || item.year <= beforeDateFilter) &&
					(!afterDateFilter || item.year >= Number(afterDateFilter))
				)
			})
			.sort((a, b) => b.likes - a.likes)
	}, [
		allJams,
		allSets,
		allShows,
		musicalEntitiesFilters,
		dateFilter,
		songFilter,
		artistFilters,
		linkFilter,
		soundFilters,
		beforeDateFilter,
		afterDateFilter,
	])
}

export default useFilteredMusicalEntities
