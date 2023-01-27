import { FunnelIcon } from '@heroicons/react/20/solid';

export default function FiltersButton({ open, setOpen }) {
	const handleClick = () => {
		setOpen(!open);
	};

	return (
		<button
			className='inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 mx-3 mb-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
			onClick={handleClick}
		>
			<FunnelIcon
				className='-ml-1 mr-2 h-5 w-5 text-gray-500'
				aria-hidden='true'
			/>
			Filters
		</button>
	);
}
{
	/* <button
        type="button"
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Button text
      </button> */
}
