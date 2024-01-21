import { getRatingsVisible, handleRatingsVisibleChange } from '~/utils'
import Checkbox from './Checkbox'

export default function EntityDisplayPreferences({ handleLinkChange, linkFilter }) {
	const ratingsVisible = getRatingsVisible()
	return (
		<div className="px-4 py-2 pb-36">
			<fieldset className="space-y-5">
				<legend className="sr-only">Options</legend>
				<Checkbox
					id="show-links"
					label="has link"
					// description="Only show jams that have a link to a recording."
					onChange={handleLinkChange}
					defaultChecked={linkFilter}
				/>
				<Checkbox
					id="show-ratings"
					label="show ratings"
					// description="show average rating on the card"
					onChange={handleRatingsVisibleChange}
					defaultChecked={ratingsVisible}
				/>
			</fieldset>
		</div>
	)
}
