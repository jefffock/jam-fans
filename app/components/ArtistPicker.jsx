import Accordion from './Accordion'
import Button from './Button'

export default function ArtistPicker({
	artists,
	handleArtistsChange,
	artistFilters,
	onClick,
	setActiveTab,
	setActiveAddTab,
	setArtistFilters,
}) {
	function handleAddEntityClick(e) {
		setActiveTab('add')
		setActiveAddTab('jamSetShow')
		console.log('add entity click', e.target.value)
		setArtistFilters([`${e.target.value}`])
	}

	const selectedArtists = artists?.filter((artist) => artistFilters.includes(artist.id.toString()))

	return (
		<Accordion title="bands" isPreviewEnabled={true} previewItems={selectedArtists} previewItemLabelKey="artist">
			<div className="sm:col-span-4 mx-4">
				<fieldset>
					{/* <legend className="text-2xl text-gray-900 pt-4">Bands</legend> */}
					<div className="divide-y divide-gray-200 border-t border-b border-gray-200 max-h-72 overflow-y-scroll mb-4">
						{artists &&
							artists?.map((artist) => {
								const entityCounts = [
									artist.jam_count > 0
										? `${artist.jam_count} jam${artist.jam_count > 1 ? 's' : ''}`
										: '',
									artist.set_count > 0
										? `${artist.set_count} set${artist.set_count > 1 ? 's' : ''}`
										: '',
									artist.show_count > 0
										? `${artist.show_count} show${artist.show_count > 1 ? 's' : ''}`
										: '',
								]
									.filter(Boolean)
									.join(', ')

								const entityCountLabel = `${entityCounts}`

								return (
									<div key={artist.id} className="relative flex items-start py-4">
										<div className="min-w-0 flex-1 text-middle">
											<label
												htmlFor={`${artist.artist}`}
												className="select-none text-gray-700 whitespace-normal"
											>
												<p className="font-normal text-xl min-h-8">{artist.artist}</p>
												<p className="text-sm font-normal">{entityCountLabel}</p>
												<Button
													value={artist.id}
													size="small"
													text={`add ${artist.artist} jams, shows`}
													onClick={(e) => handleAddEntityClick(e)}
													className="mt-2 font-normal"
												/>
											</label>
										</div>
										<div className="ml-3 flex items-center align-middle">
											<input
												id={`${artist.url}`}
												value={`${artist.id}`}
												name={`artists`}
												type="checkbox"
												className="h-8 w-8 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 border-2"
												// onChange={
												// 	handleArtistsChange
												// }
												onChange={handleArtistsChange}
												defaultChecked={artistFilters.includes(artist.id.toString())}
											/>
										</div>
									</div>
								)
							})}
					</div>
					{/* <div className="flex justify-center pb-4">
						<Button onClick={onClick} text="add an artist" />
					</div> */}
				</fieldset>
			</div>
		</Accordion>
	)
}
