import { useEffect } from 'react'
import { buildTitle } from '~/utils'

const useFilterEffects = ({
	dateFilter,
	beforeDateFilter,
	afterDateFilter,
	artistFilters,
	artists,
	soundFilters,
	sounds,
	songFilter,
	showJams,
	showSets,
	showShows,
	setTitle,
	scrollToTopOfRef,
	createFilterURL,
	setAddJamLink,
	filteredMusicalEntities,
	allShows,
	setShowsOnDate,
	musicalEntitiesFilters,
}) => {
	useEffect(() => {
		console.log('show jams', showJams)
		const filters = {
			dateFilter: dateFilter,
			beforeDateFilter,
			afterDateFilter,
			artistNames: artistFilters.map((id) => artists.find((artist) => artist.id === parseInt(id))?.artist),
			soundNames: soundFilters.map((id) => sounds.find((sound) => sound.id === parseInt(id))?.label),
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
		soundFilters,
		sounds,
		songFilter,
		buildTitle,
		setTitle,
		scrollToTopOfRef,
		// jamListRef,
		createFilterURL,
		setAddJamLink,
		musicalEntitiesFilters,
	])
}

export default useFilterEffects
