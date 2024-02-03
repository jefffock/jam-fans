import { FunnelIcon } from '@heroicons/react/20/solid'

export default function OpenFiltersButton({ open, setOpen }) {
	const handleClick = () => {
		setOpen(!open) // Toggle open state
	}

	return (
		<div className="w-min">
			<button
				className="bg-customPink inline-flex items-center rounded-md px-4 py-2 m-2 text-sm font-medium leading-4 shadow-sm focus:outline-none transform transition duration-500 ease-in-out bg-gradient-to-br from-mondegreen to-mondegreenDark20 hover:bg-gradient-to-br hover:from-mondegreenDark10 hover:to-mondegreenDark20 active:scale-95 active:shadow-none active:bg-gradient-to-br active:from-customPink active:to-customPinkDark10 from-customPink to-customPinkDark20"
				onClick={handleClick}
			>
				<FunnelIcon className=" mr-2 h-5 w-5 text-white" aria-hidden="true" />
				<p className="text-lg text-white">explore</p>
			</button>
		</div>
	)
}
