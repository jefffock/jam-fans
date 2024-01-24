import React from 'react'

export default function ConfigurableAddItemModal({ isOpen, onClose, config, date, artist }) {
	if (!isOpen) return null
	console.log('config', config)

	return (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-100">
			<div className="bg-white p-5 rounded">
				<h2 className="text-xl font-bold mb-4">{config.title}</h2>
				{config.fields.map((field, index) => (
					<div key={index} className="mb-3">
						<label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
							{field.label}
						</label>
						<input
							type={field.type}
							name={field.name}
							id={field.name}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
							defaultValue={field.name === 'date' ? date : field.name === 'artist' ? artist : null}
						/>
					</div>
				))}
				<div className="mt-4">
					<button
						type="submit"
						name="_action"
						value={config.action}
						className="bg-blue-500 text-white rounded p-2"
					>
						{config.submitButtonName}
					</button>
					<button type="button" onClick={onClose} className="ml-2 bg-gray-500 text-white rounded p-2">
						Cancel
					</button>
				</div>
			</div>
		</div>
	)
}
