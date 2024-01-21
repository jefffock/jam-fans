import { useEffect } from 'react'

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
	buildTitle,
	setTitle,
	scrollToTopOfRef,
	jamListRef,
	createFilterURL,
	setAddJamLink,
	filteredMusicalEntities,
}) => {
	useEffect(() => {
		const filters = {
			dateFilter: dateFilter,
			beforeDateFilter,
			afterDateFilter,
			artistNames: artistFilters.map((id) => artists.find((artist) => artist.id === parseInt(id))?.artist),
			soundNames: soundFilters.map((id) => sounds.find((sound) => sound.id === parseInt(id))?.label),
			songName: songFilter,
			showJams,
			showSets,
			showShows,
		}

		const newTitle = buildTitle(filters)
		setTitle(newTitle)

		scrollToTopOfRef(jamListRef)

		const filterURL = createFilterURL('/add/jam', filters)
		console.log('filterURL', filterURL)
		setAddJamLink(filterURL)
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
		showJams,
		showSets,
		showShows,
		buildTitle,
		setTitle,
		scrollToTopOfRef,
		jamListRef,
		createFilterURL,
		setAddJamLink,
	])
}

export default useFilterEffects
