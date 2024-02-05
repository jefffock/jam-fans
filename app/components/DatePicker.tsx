import Button from './Button'

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
	return (
		<div>
			<div className={`p-4 w-2xl`}>
				<div className="flex justify-between">
					<label
						htmlFor="date"
						className={`text-2xl align-middle text-gray-900 mr-16 ${!showLabel ? 'hidden' : ''}`}
					>
						date
					</label>
					<input
						type="date"
						name="date"
						id="date-input"
						className="border border-gray-300 rounded-md w-full p-2"
						placeholder="mm/dd/yyyy"
						onChange={handleDateInputChange}
						max={new Date().toISOString().split('T')[0]}
						min="1900-01-01"
						disabled={inAdd && !artist}
					/>
				</div>
			</div>
			{!inAdd && dateFilter && (
				<div className="flex justify-center mb-4">
					<Button
						onClick={() => {
							setActiveTab('add')
							setActiveAddTab('jamSetShow')
						}}
						text={`add a jam, set or show from ${dateFilter}`}
					/>
				</div>
			)}
		</div>
	)
}
