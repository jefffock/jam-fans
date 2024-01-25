import { Fragment, useState, useEffect, useMemo } from 'react'
import { Form, useSubmit, useFetcher, Link } from '@remix-run/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox, Listbox, Transition, Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { set } from 'zod'
import SoundPicker from './SoundPicker'
import ArtistPicker from './ArtistPicker'
import SongPicker from './SongPicker'
import { useDebounce } from '~/hooks'
import MusicalEntityPicker from './EntityPicker'
import FiltersSlideout from './FiltersSlideout'
import DatePicker from './DatePicker'
import Accordion from './Accordion'
import { buildFiltersButtonText } from '~/utils'
import YearFilter from './YearFilterNew'
import FiltersForm from './FiltersForm'
import Checkbox from './Checkbox'
import EntityDisplayPreferences from './EntityDisplayPreferences'
import { FilterButtonsContainer } from './FilterButtonsContainer'
import AddEntity from './AddEntity'

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function JamFiltersClientside({
	songs,
	artists,
	sounds,
	open,
	setOpen,
	totalCount,
	search,
	showIframe,
	setArtistFilters,
	setSoundFilters,
	setSongFilter,
	setBeforeDateFilter,
	setAfterDateFilter,
	setDateFilter,
	setOrderBy,
	setShowComments,
	setShowRatings,
	songFilter,
	artistFilters,
	soundFilters,
	beforeDateFilter,
	afterDateFilter,
	dateFilter,
	showComments,
	showRatings,
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
}) {
	const submit = useSubmit()
	const fetcher = useFetcher()
	const [date, setDate] = useState('')
	const [dateInput, setDateInput] = useState('')
	const [songSelected, setSongSelected] = useState(null)
	const [activeTab, setActiveTab] = useState('explore')
	const noFiltersSelected = musicalEntitiesLength === jamsCount + setsCount + showsCount

	console.log('artist fitlers', artistFilters)

	const dates = []
	let currentYear = new Date().getFullYear()
	for (var i = currentYear; i > 1959; i--) {
		dates.push(i)
	}

	const beforeYearDisplayValue = beforeDateFilter ? `${beforeDateFilter} or earlier` : `${currentYear} or earlier`

	const afterYearDisplayValue = afterDateFilter ? `${afterDateFilter} or later` : '1960 or later'

	function clearFilters() {
		setQuery('')
		setArtistFilters([])
		setSoundFilters([])
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

	function handleSoundsChange(e) {
		let soundId = e.target.value
		if (e.target.checked) {
			setSoundFilters((prev) => [...prev, soundId])
		} else {
			setSoundFilters((prev) => prev.filter((sound) => sound !== soundId))
		}
	}

	function handleDateInputChange(e) {
		console.log('dateInputString', e.target.value)
		const year = Number(e.target.value.slice(0, 4))
		console.log('year', year)
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

	return (
		<FiltersSlideout
			open={open}
			setOpen={setOpen}
			showIframe={showIframe}
			activeTab={activeTab}
			setActiveTab={setActiveTab}
		>
			{activeTab === 'explore' && (
				<FiltersForm>
					<div className="relative flex-1 px-4 sm:px-6">
						<div className="divide-y divide-gray-200">
							<MusicalEntityPicker
								entitiesFilters={musicalEntitiesFilters}
								setEntitiesFilters={setMusicalEntitiesFilters}
							/>
							<ArtistPicker
								artists={artists}
								handleArtistsChange={handleArtistsChange}
								artistFilters={artistFilters}
							/>
							<DatePicker
								dateInput={dateInput}
								handleDateInputChange={handleDateInputChange}
								date={date}
								dateFilter={dateFilter}
								showsOnDate={showsOnDate}
							/>
							<Accordion title="sounds">
								<SoundPicker
									sounds={sounds}
									handleSoundsChange={handleSoundsChange}
									soundFilters={soundFilters}
								/>
							</Accordion>
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
							<EntityDisplayPreferences handleLinkChange={handleLinkChange} linkFilter={linkFilter} />
						</div>
					</div>
					<FilterButtonsContainer
						musicalEntitiesFilters={musicalEntitiesFilters}
						musicalEntitiesLength={musicalEntitiesLength}
						noFiltersSelected={noFiltersSelected}
						handleCloseFilters={handleCloseFilters}
						buildFiltersButtonText={buildFiltersButtonText}
						clearFilters={clearFilters}
						setOpen={setOpen}
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
				/>
			)}
		</FiltersSlideout>
	)
}
