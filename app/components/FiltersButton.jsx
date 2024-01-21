import { FunnelIcon } from '@heroicons/react/20/solid'

export default function FiltersButton({ open, setOpen }) {
	const handleClick = () => {
		setOpen(!open) // Toggle open state
	}

	return (
		<div className="w-min">
			<button
				className="inline-flex items-center rounded-md border-2 border-white bg-cyan-600 px-4 py-2 m-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transform hover:scale-105 transition duration-300 ease-in-out"
				onClick={handleClick}
			>
				<FunnelIcon className=" mr-2 h-5 w-5 text-white" aria-hidden="true" />
				<p className="text-lg">explore</p>
			</button>
		</div>
	)
}
