export default function Checkbox({ id, label, value, description, onChange, defaultChecked, name }) {
	return (
		<div className="relative flex items-start">
			<div className="flex h-5 items-center">
				<input
					id={id}
					aria-describedby={`${id}-label`}
					name={name}
					value={value}
					type="checkbox"
					className="h-6 w-6 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 border-2"
					onChange={onChange}
					defaultChecked={defaultChecked}
				/>
			</div>
			<div className="ml-3 text-sm">
				<label htmlFor={id} className="font-medium text-gray-700">
					{label}
				</label>
				{description && (
					<p id={`${id}-description`} className="text-gray-500">
						{description}
					</p>
				)}
			</div>
		</div>
	)
}
