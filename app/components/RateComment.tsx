import { useFetcher } from '@remix-run/react'
import { useRef, useState } from 'react'
import Button from './Button'

export default function RateComment({ profile, entity, entityType }) {
	const fetcher = useFetcher()
	const formRef = useRef(null)
	const currentRating = entity?.userRating?.rating
	const previousComment = entity?.userRating?.comment
	const [currentComment, setCurrentComment] = useState(previousComment)
	const commentHasChanged = currentComment && currentComment !== previousComment

	let buttonText = 'add comment'

	const loading = fetcher?.state !== 'idle'

	if (loading) {
		if (!previousComment) {
			buttonText = 'adding comment'
		} else if (commentHasChanged) {
			buttonText = 'updating comment'
		}
	} else {
		if (!previousComment) {
			buttonText = 'add comment'
		} else if (previousComment || commentHasChanged) {
			buttonText = 'update comment'
		}
	}

	async function handleRatingCommentSubmit(e) {
		const formData = new FormData(formRef?.current)
		console.log('formData', formData.get('rating'))
		console.log('formData', formData.get('comment'))
		await fetcher.submit(e.currentTarget.form, {
			method: 'POST',
		})
	}

	function handleCommentChange(e) {
		setCurrentComment(e.target.value)
	}

	return (
		<div className="w-100">
			<fetcher.Form method="post" action="/resources/ratings" className="w-full" ref={formRef}>
				<input type="hidden" name="entity_id" value={entity.id} />
				<input type="hidden" name="entity_type" value={entityType} />
				<input type="hidden" name="current_rating" value={currentRating} />
				{/* {!profile && (
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
				)} */}

				{profile && (
					<div className="w-full">
						<textarea
							className="w-full p-4 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 resize-none"
							placeholder="comments (optional)"
							defaultValue={previousComment}
							name="comment"
							onChange={handleCommentChange}
						/>
						<div className="flex justify-between">
							<select
								className="p-3 text-gray-700 bg-white border border-gray-300 rounded-md"
								defaultValue={currentRating}
								name="rating"
								onChange={handleRatingCommentSubmit}
							>
								<option value="">your rating</option>
								<option value="10">10</option>
								<option value="9">9</option>
								<option value="8">8</option>
								<option value="7">7</option>
								<option value="6">6</option>
							</select>
							<Button
								onClick={handleRatingCommentSubmit}
								name="_action"
								value="add-comment"
								text={buttonText}
								size="large"
								color="mondegreen"
								disabled={loading || (!currentComment && !previousComment) || !commentHasChanged}
							/>
						</div>
					</div>
				)}
			</fetcher.Form>
		</div>
	)
}
