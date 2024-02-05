import { useEffect } from 'react'
import { buildTitle } from '~/utils'

const useFilterEffects = ({
	dateFilter,
	beforeDateFilter,
	afterDateFilter,
	artistFilters,
	artists,
	attributeFilters,
	attributes,
	songFilter,
	setTitle,
	scrollToTopOfRef,
	createFilterURL,
	setAddJamLink,
	filteredMusicalEntities,
	allShows,
	setShowsOnDate,
	musicalEntitiesFilters,
}) => {
	const soundFiltersLabels = attributeFilters
		.filter((filter) => JSON.parse(filter).is_sound)
		.map((filter) => JSON.parse(filter).label)

	const platformAttributesLabels = attributeFilters
		.filter((filter) => !JSON.parse(filter).is_sound)
		.map((filter) => JSON.parse(filter).label)
	useEffect(() => {
		const filters = {
			dateFilter: dateFilter,
			beforeDateFilter,
			afterDateFilter,
			artistNames: artistFilters.map((id) => artists.find((artist) => artist.id === parseInt(id))?.artist),
			soundFiltersLabels,
			platformAttributesLabels,
			songName: songFilter,
			musicalEntitiesFilters,
		}

		const newTitle = buildTitle(filters)
		setTitle(newTitle)

		const showsOnDate = allShows.filter((show) => show.date_text === dateFilter)
		setShowsOnDate(showsOnDate)
	}, [
		filteredMusicalEntities,
		dateFilter,
		beforeDateFilter,
		afterDateFilter,
		artistFilters,
		artists,
		attributeFilters,
		attributes,
		songFilter,
		buildTitle,
		setTitle,
		scrollToTopOfRef,
		createFilterURL,
		setAddJamLink,
		musicalEntitiesFilters,
		allShows,
		setShowsOnDate,
	])
}

export default useFilterEffects
