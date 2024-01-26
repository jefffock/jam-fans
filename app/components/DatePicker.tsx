import ConfigurableAddItemModal from './ConfigurableAddItemModal'
import { addShowConfig } from '~/config'
import { useState } from 'react'
import { openModal, closeModal } from '~/utils/modal'
import { Link } from '@remix-run/react'

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
}) {
	const [isModalOpen, setIsModalOpen] = useState(false)

	return (
		<div className="p-4 grid grid-cols-2 gap-4">
			<div>
				<label htmlFor="date" className="block text-2xl text-gray-900">
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

			<div className="flex flex-col">
				{showsOnDate && showsOnDate.length > 0 && (
					<>
						<p className="text-lg font-semibold mb-2">shows on jam fans</p>
						{showsOnDate.map((show) => (
							<Link to={`/shows/${show.id}`} key={show.id} className="flex flex-row mb-2">
								<p className="text-md underline">
									{show.artists.artist} - {show.location}
								</p>
							</Link>
						))}
					</>
				)}

				{!inAdd && dateFilter && (
					<div>
						<button
							onClick={(e) => {
								e.preventDefault()
								setActiveTab('add')
							}}
							className="bg-blue-500 text-white rounded p-2 mt-2"
						>
							add a jam, set or show from {dateFilter}
						</button>
						{/* <ConfigurableAddItemModal
							isOpen={isModalOpen}
							onClose={() => closeModal(setIsModalOpen)}
							config={addShowConfig}
							date={dateFilter}
						/> */}
					</div>
				)}
			</div>
		</div>
	)
}
