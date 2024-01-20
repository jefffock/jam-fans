import React, { useState } from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid'

export default function Accordion({ title, children }) {
	const [isOpen, setIsOpen] = useState(false)

	const toggleOpen = () => {
		setIsOpen(!isOpen)
	}

	return (
		<div>
			<div className="flex justify-between items-center cursor-pointer my-4" onClick={toggleOpen}>
				<h3 className="text-2xl text-gray-900">{title}</h3>
				{isOpen ? <MinusIcon className="h-8" /> : <PlusIcon className="h-8" />}
			</div>
			{isOpen && <div className="mt-1 flex rounded-md shadow-sm">{children}</div>}
		</div>
	)
}
