import React from 'react'
import JamsTitle from './JamsTitle' // Adjust the import path as needed
import FiltersButton from './FiltersButton' // Adjust the import path as needed

export default function EntityListHeader({ title, open, setOpen, headerRef }) {
	return (
		<div className="flex-column justify-center items-center pt-3 pb-2 mb-0" ref={headerRef}>
			<JamsTitle title={title} />
			<div className="flex justify-center gap-8 items-center">
				<FiltersButton open={open} setOpen={setOpen} />
			</div>
		</div>
	)
}
