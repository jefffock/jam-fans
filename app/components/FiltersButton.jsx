import { FunnelIcon } from '@heroicons/react/20/solid'

export default function FiltersButton({ open, setOpen }) {
	const handleClick = () => {
		setOpen(!open) // Toggle open state
	}

	return (
		<div className="w-min">
			<button
				className="inline-flex items-center rounded-md px-4 py-2 m-2 text-sm font-medium leading-4 transform hover:scale-105 transition duration-300 ease-in-out bg-gradient-to-br from-mondegreen to-custom-pink text-white shadow-lg hover:bg-gradient-to-br hover:from-mondgreen-darker hover:to-pink-darker active:scale-95 active:shadow-none"
				onClick={handleClick}
			>
				<FunnelIcon className=" mr-2 h-5 w-5 text-white" aria-hidden="true" />
				<p className="text-lg">explore</p>
			</button>
		</div>
	)
}
