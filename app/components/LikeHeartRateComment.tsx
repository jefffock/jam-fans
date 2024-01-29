import { useFetcher } from '@remix-run/react'
import Button from './Button'

export default function LikeHeartRateComment({
	profile,
	entity,
	entityType,
	actionName,
	currentRating,
	currentComment,
}) {
	const fetcher = useFetcher()

	return (
		<div className="flex flex-wrap justify-center space-x-5 space-y-2">
			<fetcher.Form method="post" action="/resources/likes">
				<input type="hidden" name="entity_id" value={entity.id} />
				<input type="hidden" name="entity_type" value={entityType} />
				<input type="hidden" name="user_id" value={profile?.id} />
				<Button type="submit" name="_action" value={actionName} children={'👍'} size="large" />
			</fetcher.Form>
			{profile && (
				<fetcher.Form method="post" action="/resources/favorites">
					<input type="hidden" name="entity_id" value={entity.id} />
					<input type="hidden" name="entity_type" value={entityType} />
					<input type="hidden" name="user_id" value={profile?.id} />
					<input type="hidden" name="is_favorite" value={entity.isUserFavorite} />
					<Button type="submit" name="_action" value={actionName} children={'❤️'} size="large" />
				</fetcher.Form>
			)}
			<fetcher.Form method="post" action="/resources/ratings">
				<input type="hidden" name="entity_id" value={entity.id} />
				<input type="hidden" name="entity_type" value={entityType} />
				<input type="hidden" name="user_id" value={profile?.id} />
				<select
					className="p-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
					defaultValue={currentRating}
					name="rating"
				>
					<option value="">your rating</option>
					<option value="10">10</option>
					<option value="9">9</option>
					<option value="8">8</option>
					<option value="7">7</option>
					<option value="6">6</option>
				</select>
				<Button type="submit" name="_action" value={actionName} children="add rating" size="large" />
			</fetcher.Form>
			{profile && (
				<textarea
					className="w-full p-4 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 resize-none"
					placeholder="comments (optional)"
					defaultValue={currentComment}
				/>
			)}
		</div>
	)
}
