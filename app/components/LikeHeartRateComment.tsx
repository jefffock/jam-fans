import { useFetcher } from '@remix-run/react'
import Button from './Button'
import ThumbIcon from '../assets/icons/thumb-up-outline.svg'

export default function LikeHeartRateComment({ profile, entity, entityType }) {
	const fetcher = useFetcher()
	const currentRating = entity?.userRating?.rating
	const currentFavorite = entity?.userRating?.favorite
	const currentComment = entity?.userRating?.comment

	const buttonText = (currentRating || currentComment ? 'update' : 'add') + ' rating and comment'

	async function handleRatingChange(e) {
		await fetcher.submit(e.currentTarget.form, {
			method: 'POST',
		})
		console.log('rating submitted')
	}
	return (
		<div className="flex flex-wrap justify-center space-x-5 space-y-2">
			<fetcher.Form method="post" action="/resources/ratings">
				<input type="hidden" name="entity_id" value={entity.id} />
				<input type="hidden" name="entity_type" value={entityType} />
				<input type="hidden" name="current_rating" value={currentRating} />
				<input type="hidden" name="is_favorite" value={currentFavorite} />
				{/* <Button type="submit" name="_action" value="like" children={'👍'} size="large" /> */}
				{profile && <Button type="submit" name="_action" value="favorite" children={'❤️'} size="large" />}
				<select
					className="p-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
					defaultValue={currentRating}
					name="rating"
					onChange={handleRatingChange}
				>
					<option value="">your rating</option>
					<option value="10">10</option>
					<option value="9">9</option>
					<option value="8">8</option>
					<option value="7">7</option>
					<option value="6">6</option>
				</select>
				<Button type="submit" name="_action" value="add-rating-comment" text={buttonText} size="large" />
				{profile && (
					<textarea
						className="w-full p-4 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 resize-none"
						placeholder="comments (optional)"
						defaultValue={currentComment}
						name="comment"
					/>
				)}
			</fetcher.Form>
		</div>
	)
}
