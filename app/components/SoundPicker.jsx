export default function SoundPicker({ sounds, soundFilters, handleSoundsChange }) {
	return (
		<div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
			<div className="sm:col-span-6 mx-4">
				<div className="mt-1 flex rounded-md shadow-sm">
					<fieldset>
						<legend className="text-2xl text-gray-900 hidden">Sounds</legend>
						<div className="divide-y divide-gray-200 border-t border-b border-gray-200 max-h-60 overflow-y-scroll sm:col-span-6">
							{sounds &&
								sounds?.map((sound, soundIdx) => (
									<div key={soundIdx} className="relative flex items-start py-4">
										<div className="min-w-0 flex-1 text-sm">
											<label
												htmlFor={`${sound.text}`}
												className="select-none font-medium text-gray-700 mx-2"
											>
												{sound?.label}
											</label>
										</div>
										<div className="ml-3 flex h-5 items-center">
											<input
												value={`${sound.id}`}
												id={`${sound.text}`}
												name="sounds"
												type="checkbox"
												className="h-6 w-6 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500  border-2 mr-2"
												onChange={handleSoundsChange}
												defaultChecked={soundFilters.includes(sound.id.toString())}
											/>
										</div>
									</div>
								))}
						</div>
					</fieldset>
				</div>
			</div>
		</div>
	)
}
