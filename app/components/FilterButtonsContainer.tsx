import { Link } from 'react-router-dom'

export const FilterButtonsContainer = ({
	musicalEntitiesLength,
	noFiltersSelected,
	handleCloseFilters,
	buildFiltersButtonText,
	clearFilters,
	setOpen,
	musicalEntitiesFilters,
}) => {
	return (
		<div className="absolute flex justify-evenly flex-col bottom-0 py-4 bg-white w-96 px-2 mx-auto">
			{musicalEntitiesLength === 0 && (
				<Link to="/add/jam" className="underline bottom-0 self-center">
					Add a Jam?
				</Link>
			)}

			<button
				className={
					`m-4` +
					(musicalEntitiesLength !== 0
						? 'inline-flex justify-center rounded-md border border-transparent bg-cyan-600 py-2 px-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2'
						: 'inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 cursor-not-allowed')
				}
				onClick={handleCloseFilters}
				disabled={musicalEntitiesLength === 0}
			>
				{buildFiltersButtonText(musicalEntitiesFilters, musicalEntitiesLength)}
			</button>

			<div className="m-4">
				{!noFiltersSelected && (
					<button
						type="button"
						className="rounded-md border border-gray-300 bg-white py-2 px-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
						onClick={clearFilters}
					>
						Clear Filters
					</button>
				)}
				{musicalEntitiesLength === 0 && (
					<button
						type="button"
						className="rounded-md border border-gray-300 bg-white py-2 px-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
						onClick={() => setOpen(false)}
					>
						Close
					</button>
				)}
			</div>
		</div>
	)
}
