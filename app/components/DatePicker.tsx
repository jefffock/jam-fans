export default function DatePicker({ dateInput, handleDateInputChange, date }) {
	return (
		<div className="p-4">
			<label
				htmlFor="date"
				// className='block text-md font-medium text-gray-700'
				className="block text-2xl text-gray-900"
			>
				Date
			</label>
			<input
				type="text"
				name="date"
				id="date"
				value={dateInput || ''}
				onChange={handleDateInputChange}
				className="border border-gray-300 rounded-md p-2"
			/>
			<p className="text-sm">mmddyyyy</p>
			<p className="text-2xl">{date ? new Date(date + 'T16:00:00').toLocaleDateString() : ''}</p>
		</div>
	)
}
