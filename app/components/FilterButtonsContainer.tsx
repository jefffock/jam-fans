import Button from './Button'

export const FilterButtonsContainer = ({
	musicalEntitiesLength,
	noFiltersSelected,
	handleCloseFilters,
	buildFiltersButtonText,
	clearFilters,
	musicalEntitiesFilters,
}) => {
	return (
		<div className="absolute flex justify-center items-center flex-col bottom-0 py-2 bg-white w-96 px-2 mx-auto">
			<button
				className={
					`m-2 w-fit transition duration-300 ease-in-out text-xl motion-reduce:transition-none hover:transition-all inline-flex justify-center rounded-md py-2 px-4 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ` +
					(musicalEntitiesLength !== 0
						? ' bg-gradient-to-br from-cyan-500 to-cyan-700  text-white shadow-lg hover:bg-gradient-to-br hover:from-cyan-600 hover:to-cyan-800  focus:ring-cyan-500 active:scale-95 active:shadow-none'
						: ' border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-cyan-400 cursor-not-allowed')
				}
				onClick={handleCloseFilters}
				disabled={musicalEntitiesLength === 0}
			>
				{buildFiltersButtonText(musicalEntitiesFilters, musicalEntitiesLength)}
			</button>

			<div className="m-2 flex flex-row justify-center">
				{!noFiltersSelected && <Button size="small" onClick={clearFilters} text="clear filters" />}
			</div>
		</div>
	)
}
