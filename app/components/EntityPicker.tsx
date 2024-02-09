export default function MusicalEntityPicker({ entitiesFilters, setEntitiesFilters }) {
	const handleEntityChange = (event) => {
		setEntitiesFilters({
			...entitiesFilters,
			[event.target.name]: event.target.checked,
		})
	}

	return (
		<div className="flex justify-center gap-10 max-w-12 mx-auto p-4">
			{Object.entries(entitiesFilters).map(([key, value]) => (
				<label key={key} className="flex items-center space-x-2">
					<input
						type="checkbox"
						name={key}
						checked={value}
						onChange={handleEntityChange}
						className="form-checkbox h-5 w-5 accent-mondegreen hover:accent-custom-pink"
					/>
					<span className="text-gray-700">{key}</span>
				</label>
			))}
		</div>
	)
}
