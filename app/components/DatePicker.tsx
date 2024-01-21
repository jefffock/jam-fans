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

	const onDateInputChange = (e) => {
		let value = e.target.value
		let newValue = ''

		for (let i = 0; i < value.length; i++) {
			const char = value[i]

			if (!char.match(/[0-9]/)) continue // Ignore non-numeric characters

			switch (i) {
				case 0: // First month digit, 0-9
					newValue += char
					break
				case 1: // Second month digit, depends on first
					if ((newValue[0] === '0' || newValue[0] === '1') && char.match(/[0-9]/)) {
						newValue += char
					} else if (newValue[0] === '2' && char.match(/[0-3]/)) {
						newValue += char
					}
					break
				case 2: // First day digit, 0-3
					if (char.match(/[0-3]/)) {
						newValue += `/${char}`
					}
					break
				case 3: // Second day digit, depends on first
					if (newValue[3] === '3' && char.match(/[0-1]/)) {
						newValue += char
					} else if (newValue[3] !== '3' && char.match(/[0-9]/)) {
						newValue += char
					}
					break
				case 4: // First year digit, 1 or 2
					if (char === '1' || char === '2') {
						newValue += `/${char}`
					}
					break
				case 5: // Second year digit, 9 if first is 1, 0 if first is 2
					if ((newValue[5] === '1' && char === '9') || (newValue[5] === '2' && char === '0')) {
						newValue += char
					}
					break
				case 6: // Third year digit, 0, 1, 2
					if (char.match(/[0-2]/)) {
						newValue += char
					}
					break
				case 7: // Fourth year digit, depends on third
					if ((newValue[7] === '0' || newValue[7] === '1') && char.match(/[0-9]/)) {
						newValue += char
					} else if (newValue[7] === '2' && char.match(/[0-4]/)) {
						newValue += char
					}
					break
				default:
					break
			}
		}

		// Pass newValue to parent component
		handleDateInputChange(newValue)
	}

	return (
		<div className="p-4">
			<label htmlFor="date" className="block text-2xl text-gray-900">
				date
			</label>
			<input
				type="text"
				name="date"
				id="date"
				value={formatDateDisplay(dateInput)}
				onChange={onDateInputChange}
				className="border border-gray-300 rounded-md p-2"
				placeholder="mm/dd/yyyy"
			/>
			<p className="text-sm">mm/dd/yyyy</p>
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
