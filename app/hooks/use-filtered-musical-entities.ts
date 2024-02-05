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
	attributeFilters,
	beforeDateFilter,
	afterDateFilter,
	attributes,
	setFilteredEntitiesLengthUntrimmed,
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

		const soundFilters = attributeFilters.filter((filter) => JSON.parse(filter).is_sound)
		const platformAttributes = attributeFilters.filter((filter) => !JSON.parse(filter).is_sound)

		combinedArray = combinedArray
			.filter((item) => {
				return (
					(!dateFilter || item.date === dateFilter || item.date_text === dateFilter) &&
					(!songFilter || item?.song_name === songFilter) &&
					(artistFilters.length === 0 || artistFilters.includes(item.artist_id.toString())) &&
					(!linkFilter || item.listen_link) &&
					(soundFilters.length === 0 ||
						soundFilters.every((filter) => item.attribute_ids.includes(JSON.parse(filter).id))) &&
					(!beforeDateFilter || item.year <= beforeDateFilter) &&
					(!afterDateFilter || item.year >= Number(afterDateFilter)) &&
					(platformAttributes.length === 0 ||
						platformAttributes.some((filter) => item.attribute_ids.includes(JSON.parse(filter).id)))
				)
			})
			.sort((a, b) => b.likes - a.likes)

		setFilteredEntitiesLengthUntrimmed(combinedArray.length)

		return combinedArray?.slice(0, 100)
	}, [
		allJams,
		allSets,
		allShows,
		musicalEntitiesFilters,
		dateFilter,
		songFilter,
		artistFilters,
		linkFilter,
		attributeFilters,
		beforeDateFilter,
		afterDateFilter,
	])
}

export default useFilteredMusicalEntities
