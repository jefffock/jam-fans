import ConfigurableAddItemModal from './ConfigurableAddItemModal'
import { addShowConfig } from '~/config'
import { useState } from 'react'
import { openModal, closeModal } from '~/utils/modal'

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

export default function DatePicker({ dateInput, handleDateInputChange, date }) {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleDateChange = (e) => {
		console.log('e.target.value', e.target.value)
		// const newDate = addSlashes(e.target.value)
		// handleDateInputChange(newDate)
	}

	return (
		<div className="p-4">
			<label htmlFor="date" className="block text-2xl text-gray-900">
				date
			</label>
			<input
				type="date"
				name="date"
				id="date-input"
				className="border border-gray-300 rounded-md p-2"
				placeholder="mm/dd/yyyy"
				onChange={handleDateInputChange}
				max={new Date().toISOString().split('T')[0]}
				min="1900-01-01"
			/>
			<p>{date}</p>
			<p className="text-2xl">{date ? new Date(date + 'T16:00:00').toLocaleDateString() : ''}</p>
			{date && (
				<div>
					<button onClick={openModal} className="bg-blue-500 text-white rounded p-2">
						add a show
					</button>
					<ConfigurableAddItemModal isOpen={isModalOpen} onClose={closeModal} config={addShowConfig} />
				</div>
			)}
		</div>
	)
}
