import { useFetcher } from '@remix-run/react'
import Button from './Button'

export default function RateComment({ profile, entity, entityType }) {
	const fetcher = useFetcher()
	const currentRating = entity?.userRating?.rating
	const currentComment = entity?.userRating?.comment

	const buttonText =
		fetcher?.state === 'loading'
			? `${currentComment ? 'updating' : 'adding'} rating and comment`
			: `${currentComment ? 'update' : 'add'} rating and comment`

	// async function handleRatingChange(e) {
	// 	await fetcher.submit(e.currentTarget.form, {
	// 		method: 'POST',
	// 	})
	// 	console.log('rating submitted')
	// 	console.log('currentRef', ref.current)
	// 	e.currentTarget.focus()
	// }
	return (
		<div className="w-100">
			<fetcher.Form method="post" action="/resources/ratings" className="w-full">
				<input type="hidden" name="entity_id" value={entity.id} />
				<input type="hidden" name="entity_type" value={entityType} />
				<input type="hidden" name="current_rating" value={currentRating} />
				{!profile && (
					<select
						className="p-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
						defaultValue={currentRating}
						name="rating"
						// onChange={handleRatingChange}
					>
						<option value="">your rating</option>
						<option value="10">10</option>
						<option value="9">9</option>
						<option value="8">8</option>
						<option value="7">7</option>
						<option value="6">6</option>
					</select>
				)}

				{profile && (
					<div className="w-full">
						<textarea
							className="w-full p-4 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 resize-none"
							placeholder="comments (optional)"
							defaultValue={currentComment}
							name="comment"
						/>
						<div className="flex justify-between">
							<select
								className="p-3 text-gray-700 bg-white border border-gray-300 rounded-md"
								// defaultValue={currentRating}
								name="rating"
								// onChange={handleRatingChange}
							>
								<option value="">your rating</option>
								<option value="10">10</option>
								<option value="9">9</option>
								<option value="8">8</option>
								<option value="7">7</option>
								<option value="6">6</option>
							</select>
							<Button
								type="submit"
								name="_action"
								value="add-rating-comment"
								text={buttonText}
								size="large"
								color="mondegreen"
							/>
						</div>
					</div>
				)}
			</fetcher.Form>
		</div>
	)
}
