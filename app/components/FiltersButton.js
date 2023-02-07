import { FunnelIcon } from '@heroicons/react/20/solid';

export default function FiltersButton({ open, setOpen }) {
	const handleClick = () => {
		setOpen(!open);
	};

	return (
		<button
			className='inline-flex items-center rounded-md border border-cyan-600 bg-white p-2 m-2 text-sm font-medium leading-4 text-cyan-600 shadow-sm hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 hover:scale-110 transition-all duration-700 ease-in transform'
			onClick={handleClick}
		>
			<FunnelIcon
				className='-ml-1 mr-2 h-5 w-5 text-cyan-500'
				aria-hidden='true'
			/>
			Filters - Filter by sounds, song, bands, years
		</button>
	);
}
{
	/* <button
        type="button"
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
      >
        Button text
      </button> */
}
