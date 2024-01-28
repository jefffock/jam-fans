import ConfigurableAddItemModal from './ConfigurableAddItemModal'
import { addShowConfig } from '~/config'
import { useState } from 'react'
import { openModal, closeModal } from '~/utils/modal'
import { Link } from '@remix-run/react'
import ButtonSmall from './ButtonSmall'

// Function to format date from 'yyyy-mm-dd' to 'mm/dd/yyyy'
const addSlashes = (dateStr) => {
	let newDateStr = dateStr.replace(/[^0-9]/g, '') // Remove non-numeric characters
	if (newDateStr.length > 4) {
		// Insert slashes for mm/dd/yyyy format
		newDateStr = newDateStr.substring(0, 2) + '/' + newDateStr.substring(2, 4) + '/' + newDateStr.substring(4)
	} else if (newDateStr.length > 2) {
		newDateStr = newDateStr.substring(0, 2) + '/' + newDateStr.substring(2)
	}
	return newDateStr
}

const formatDateDisplay = (dateStr) => {
	if (!dateStr) return ''
	const [year, month, day] = dateStr.split('-')
	return `${month}/${day}/${year}`
}

export default function DatePicker({
	dateFilter,
	handleDateInputChange,
	date,
	showsOnDate,
	setActiveTab,
	inAdd = false,
	artist,
	showLabel = true,
	setActiveAddTab,
	jamsCount,
	setsCount,
}) {
	const [isModalOpen, setIsModalOpen] = useState(false)

	return (
		<div>
			<div className={`p-4 grid ${inAdd ? 'grid-cols-1' : 'grid-cols-2'} gap-4 w-2xl`}>
				<div>
					<label htmlFor="date" className={`block text-2xl text-gray-900 ${!showLabel ? 'hidden' : ''}`}>
						date
					</label>
					<input
						type="date"
						name="date"
						id="date-input"
						className="border border-gray-300 rounded-md p-2 mt-2 w-full"
						placeholder="mm/dd/yyyy"
						onChange={handleDateInputChange}
						max={new Date().toISOString().split('T')[0]}
						min="1900-01-01"
						disabled={inAdd && !artist}
					/>
				</div>
				{!inAdd && dateFilter && (showsOnDate?.length > 0 || jamsCount > 0 || setsCount > 0) && (
					<div className="flex flex-col text-md">
						<p>
							{showsOnDate?.length} show{showsOnDate.length > 1 ? 's' : ''}{' '}
							{jamsCount ? showsOnDate.length`, ${jamsCount}jams` : ''} {} on jam fans
						</p>
						jams: {jamsCount}
						sets: {setsCount}
					</div>
				)}
			</div>
			{!inAdd && dateFilter && (
				<div className="flex justify-center mb-4">
					<ButtonSmall
						onClick={() => {
							setActiveTab('add')
							setActiveAddTab('jamSetShow')
						}}
						text={`add/rate a jam, set or show from ${dateFilter}`}
					/>
				</div>
			)}
		</div>
	)
}
