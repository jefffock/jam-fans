export default function SoundPicker({ sounds }) {
	return (
		<fieldset>
			<legend className="text-lg font-medium text-gray-900">Sounds</legend>
			<div className="mt-4 divide-y divide-gray-200 border-t border-b border-gray-200 max-h-52 overflow-y-scroll">
				{sounds.map((sound, soundIdx) => (
					<div key={soundIdx} className="relative flex items-start py-4">
						<div className="min-w-0 flex-1 text-sm">
							<label htmlFor={`sound-${sound.text}`} className="select-none font-medium text-gray-700">
								{sound.label}
							</label>
						</div>
						<div className="ml-3 flex h-5 items-center">
							<input
								id={`sound-${sound.text}`}
								name={`sound-${sound.text}`}
								type="checkbox"
								className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
							/>
						</div>
					</div>
				))}
			</div>
		</fieldset>
	)
}
