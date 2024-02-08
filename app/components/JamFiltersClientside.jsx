import { useFetcher, useSubmit } from '@remix-run/react'
import { useMemo, useState } from 'react'
import { buildFiltersButtonText } from '~/utils'
import AddEntity from './AddEntity'
import ArtistPicker from './ArtistPicker'
import AttributePicker from './AttributePicker'
import DatePicker from './DatePicker'
import EntityDisplayPreferences from './EntityDisplayPreferences'
import MusicalEntityPicker from './EntityPicker'
import { FilterButtonsContainer } from './FilterButtonsContainer'
import FiltersForm from './FiltersForm'
import FiltersFormBody from './FiltersFormBody'
import FiltersSlideout from './FiltersSlideout'
import SongPicker from './SongPicker'
import YearFilter from './YearFilterNew'

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function JamFiltersClientside({
	songs,
	artists,
	attributes,
	open,
	setOpen,
	totalCount,
	search,
	iframeOpen,
	setArtistFilters,
	setAttributeFilters,
	setSongFilter,
	setBeforeDateFilter,
	setAfterDateFilter,
	setDateFilter,
	setOrderBy,
	setShowComments,
	setDisplayRatings,
	songFilter,
	artistFilters,
	attributeFilters,
	beforeDateFilter,
	afterDateFilter,
	dateFilter,
	showComments,
	displayRatings,
	orderBy,
	musicalEntitiesLength,
	linkFilter,
	setLinkFilter,
	query,
	setQuery,
	musicalEntitiesFilters,
	setMusicalEntitiesFilters,
	jamsCount,
	setsCount,
	showsCount,
	showsOnDate,
	filteredMusicalEntities,
	profile,
	activeAddTab,
	setActiveAddTab,
	activeTab,
	setActiveTab,
	filteredEntitiesLengthUntrimmed,
	setIframeOpen,
	setIframeUrl,
}) {
	const submit = useSubmit()
	const fetcher = useFetcher()
	const [date, setDate] = useState('')
	const [dateInput, setDateInput] = useState('')
	const [songSelected, setSongSelected] = useState(null)
	const noFiltersSelected = musicalEntitiesLength === jamsCount + setsCount + showsCount

	const dates = []
	let currentYear = new Date().getFullYear()
	for (var i = currentYear; i > 1959; i--) {
		dates.push(i)
	}

	const beforeYearDisplayValue = beforeDateFilter ? `${beforeDateFilter} or earlier` : `${currentYear} or earlier`

	const afterYearDisplayValue = afterDateFilter ? `${afterDateFilter} or later` : '1960 or later'

	function clearFilters(e) {
		e.preventDefault()
		setQuery('')
		setArtistFilters([])
		setAttributeFilters([])
		setSongFilter('')
		setDateFilter('')
		setBeforeDateFilter('')
		setAfterDateFilter('')
		const form = document.querySelector('#jam-filter-form')
		const inputs = form?.querySelectorAll('input, select')

		inputs.forEach((input) => {
			if (input.type === 'checkbox') input.checked = false
			else {
				input.value = ''
			}
		})
	}

	function handleArtistsChange(e) {
		let artistId = e.target.value
		if (e.target.checked) {
			setArtistFilters((prev) => [...prev, artistId])
		} else {
			setArtistFilters((prev) => prev.filter((artist) => artist !== artistId))
		}
	}

	function handleAttributesChange(e) {
		let attribute = e.target.value
		if (e.target.checked) {
			setAttributeFilters((prev) => [...prev, attribute])
		} else {
			setAttributeFilters((prev) => prev.filter((prevAttribute) => prevAttribute !== attribute))
		}
	}

	function handleDateInputChange(e) {
		const year = Number(e.target.value.slice(0, 4))
		// check if year is between 1900 and present year
		if (year >= 1900 && year <= new Date().getFullYear()) {
			setDateFilter(e.target.value)
		}
	}

	function handleAfterChange(e) {
		let afterYear = e.target.value
		//afterYear is a string value in a select input, not a checkbox
		if (afterYear) {
			setAfterDateFilter(afterYear)
		}
	}

	function handleShowCommentsChange(e) {
		let showComments = e.target.value
		//showComments is a string value in a select input, not a checkbox
		if (showComments) {
			setShowComments(showComments)
		}
	}

	function handleCloseFilters(e) {
		e.preventDefault()
		setOpen(false)
	}

	function handleLinkChange(e) {
		// this event is from a checkbox
		setLinkFilter(e.target.checked)
	}

	function clearSong() {
		console.log('clear song')
		setSongFilter('')
		setSongSelected(null)
		setQuery('')
	}

	function handleAddArtistClick() {
		setActiveTab('add')
		setActiveAddTab('artist')
	}

	const filteredSetsCount = useMemo(() => {
		return filteredMusicalEntities?.filter((entity) => entity.type === 'set').length
	}, [filteredMusicalEntities])

	const filteredJamsCount = useMemo(() => {
		return filteredMusicalEntities?.filter((entity) => entity.type === 'jam').length
	}, [filteredMusicalEntities])

	const sounds = attributes?.filter((attr) => attr?.is_sound)
	const attributesNotSounds = attributes?.filter((attr) => !attr?.is_sound)

	const parsedSelectedSounds = attributeFilters?.map((sound) => JSON.parse(sound)).filter((sound) => sound?.is_sound)

	return (
		<FiltersSlideout
			open={open}
			setOpen={setOpen}
			iframeOpen={iframeOpen}
			activeTab={activeTab}
			setActiveTab={setActiveTab}
		>
			{activeTab === 'explore' && (
				<FiltersForm>
					<FiltersFormBody>
						<MusicalEntityPicker
							entitiesFilters={musicalEntitiesFilters}
							setEntitiesFilters={setMusicalEntitiesFilters}
						/>
						<ArtistPicker
							artists={artists}
							handleArtistsChange={handleArtistsChange}
							artistFilters={artistFilters}
							onClick={handleAddArtistClick}
							setActiveAddTab={setActiveAddTab}
							setActiveTab={setActiveTab}
							setArtistFilters={setArtistFilters}
						/>
						<DatePicker
							dateInput={dateInput}
							handleDateInputChange={handleDateInputChange}
							date={date}
							dateFilter={dateFilter}
							showsOnDate={showsOnDate}
							setActiveTab={setActiveTab}
							setActiveAddTab={setActiveAddTab}
							jamsCount={filteredJamsCount}
							setsCount={filteredSetsCount}
						/>

						<AttributePicker
							attributes={sounds}
							handleAttributesChange={handleAttributesChange}
							defaults={attributeFilters}
							open={attributeFilters.length > 0}
							parsedSelectedAttributes={parsedSelectedSounds}
							title="sounds"
							inCard={false}
						/>
						<SongPicker
							setQuery={setQuery}
							songSelected={songSelected}
							songFilter={songFilter}
							setSongFilter={setSongFilter}
							clearSong={clearSong}
							setSongSelected={setSongSelected}
							query={query}
							songs={songs}
						/>
						<div className="flex justify-between">
							<YearFilter
								filterType="before"
								value={beforeDateFilter}
								onChange={setBeforeDateFilter}
								dates={dates}
								displayValue={beforeYearDisplayValue}
							/>

							<YearFilter
								filterType="after"
								value={afterDateFilter}
								onChange={setAfterDateFilter}
								dates={dates}
								displayValue={afterYearDisplayValue}
							/>
						</div>
						<EntityDisplayPreferences
							handleLinkChange={handleLinkChange}
							linkFilter={linkFilter}
							attributesNotSounds={attributesNotSounds}
							handleAttributesChange={handleAttributesChange}
							displayRatings={displayRatings}
							setDisplayRatings={setDisplayRatings}
						/>
					</FiltersFormBody>
					<FilterButtonsContainer
						musicalEntitiesFilters={musicalEntitiesFilters}
						musicalEntitiesLength={filteredEntitiesLengthUntrimmed}
						noFiltersSelected={noFiltersSelected}
						handleCloseFilters={handleCloseFilters}
						buildFiltersButtonText={buildFiltersButtonText}
						clearFilters={clearFilters}
						setOpen={setOpen}
						iframeOpen={iframeOpen}
					/>
				</FiltersForm>
			)}
			{activeTab === 'add' && (
				<AddEntity
					artists={artists}
					artist={artistFilters[0]}
					dateFilter={dateFilter}
					handleDateInputChange={handleDateInputChange}
					date={date}
					filteredMusicalEntities={filteredMusicalEntities}
					activeAddTab={activeAddTab}
					setActiveAddTab={setActiveAddTab}
					profile={profile}
					attributes={attributes}
					iframeOpen={iframeOpen}
					setIframeOpen={setIframeOpen}
					setIframeUrl={setIframeUrl}
					displayRatings={displayRatings}
				/>
			)}
		</FiltersSlideout>
	)
}
