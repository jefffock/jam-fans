import Button from './Button'

export const FilterButtonsContainer = ({
	musicalEntitiesLength,
	noFiltersSelected,
	handleCloseFilters,
	buildFiltersButtonText,
	clearFilters,
	musicalEntitiesFilters,
	iframeOpen = false,
}) => {
	return (
		<div
			className={`absolute flex justify-center items-center flex-col bottom-0 py-2 bg-white w-96 px-2 mx-auto ${iframeOpen ? ' pb-48 lg:pb-2' : 'pb-2'}`}
		>
			<button
				className={
					`m-2 w-fit transition duration-300 ease-in-out text-xl motion-reduce:transition-none hover:transition-all inline-flex justify-center rounded-md py-2 px-4 font-medium` +
					(musicalEntitiesLength !== 0
						? ' transform hover:scale-105 transition duration-300 ease-in-out bg-gradient-to-br from-custom-pink to-mondegreen text-white shadow-lg hover:bg-gradient-to-br hover:from-pink-darker hover:to-mondegreen-darker active:scale-95 active:shadow-none'
						: ' border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 cursor-not-allowed')
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
