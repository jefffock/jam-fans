import { FunnelIcon } from '@heroicons/react/20/solid'

export default function FiltersButton({ open, setOpen }) {
	const handleClick = () => {
		setOpen(!open) // Toggle open state
	}

	return (
		<div className="w-min">
			<button
				className="inline-flex items-center rounded-md border border-cyan-600 bg-white px-4 py-2 m-2 text-sm font-medium leading-4 text-cyan-600 shadow-sm hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 transform hover:scale-105 transition duration-300 ease-in-out"
				onClick={handleClick}
			>
				<FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-cyan-500" aria-hidden="true" />
				Filters
			</button>
		</div>
	)
}
