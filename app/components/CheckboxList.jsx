export default function Example() {
	return (
		<fieldset className="space-y-5">
			<legend className="sr-only">Options</legend>
			<div className="relative flex items-start">
				<div className="flex h-5 items-center">
					<input
						id="show-links"
						aria-describedby="show-links-description"
						name="show-links"
						type="checkbox"
						className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
					/>
				</div>
				<div className="ml-3 text-sm">
					<label htmlFor="show-links" className="font-medium text-gray-700">
						Must have a link
					</label>
					<p id="show-links-description" className="text-gray-500">
						Only show jams that have a link to a recording.
					</p>
				</div>
			</div>
			<div className="relative flex items-start">
				<div className="flex h-5 items-center">
					<input
						id="show-ratings"
						aria-describedby="show-ratings-description"
						name="show-ratings"
						type="checkbox"
						className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
					/>
				</div>
				<div className="ml-3 text-sm">
					<label htmlFor="show-ratings" className="font-medium text-gray-700">
						Show ratings
					</label>
					<p id="show-ratings-description" className="text-gray-500">
						Show jam ratings on the cards.
					</p>
				</div>
			</div>
		</fieldset>
	)
}
