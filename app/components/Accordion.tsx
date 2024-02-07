import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

export default function Accordion({
	title,
	children,
	isPreviewEnabled,
	previewItems,
	previewItemLabelKey,
	previewAboveLabel,
	defaultOpen = false,
	inCard = false,
}) {
	const [isOpen, setIsOpen] = useState(defaultOpen)

	const toggleOpen = () => {
		setIsOpen(!isOpen)
	}

	return (
		<div>
			{isPreviewEnabled && previewAboveLabel && (
				<div className="font-semibold">{previewItems?.map((item) => item[previewItemLabelKey]).join(', ')}</div>
			)}
			<div
				className={`flex justify-between items-center cursor-pointer p-4 ${inCard ? '' : 'mt-4'}`}
				onClick={toggleOpen}
			>
				<h3 className="text-2xl text-gray-900">{title}</h3>
				{isOpen ? <MinusIcon className="h-8" /> : <PlusIcon className="h-8" />}
			</div>
			{isOpen ? (
				<div className="mt-1 rounded-md shadow-sm">{children}</div>
			) : (
				isPreviewEnabled &&
				!previewAboveLabel && (
					<div className="pb-4 px-4">{previewItems?.map((item) => item[previewItemLabelKey]).join(', ')}</div>
				)
			)}
		</div>
	)
}
