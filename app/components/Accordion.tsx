import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

export default function Accordion({ title, children, isPreviewEnabled, previewItems, previewItemLabelKey }) {
	const [isOpen, setIsOpen] = useState(false)

	const toggleOpen = () => {
		setIsOpen(!isOpen)
	}

	return (
		<div>
			<div className="flex justify-between items-center cursor-pointer p-4" onClick={toggleOpen}>
				<h3 className="text-2xl text-gray-900">{title}</h3>
				{isOpen ? <MinusIcon className="h-8" /> : <PlusIcon className="h-8" />}
			</div>
			{isOpen ? (
				<div className="mt-1 flex rounded-md shadow-sm">{children}</div>
			) : (
				isPreviewEnabled && (
					<div className="pb-4 px-4">{previewItems?.map((item) => item[previewItemLabelKey]).join(', ')}</div>
				)
			)}
		</div>
	)
}
