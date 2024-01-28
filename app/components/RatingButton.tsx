import { Form } from '@remix-run/react'

export default function RatingButton({ rating, entityId, entityType, actionName, fetcher, currentRating }) {
	console.log('rating', rating)
	return (
		<fetcher.Form method="post" action="/resources/upsertRating">
			<input type="hidden" name="entity_id" value={entityId} />
			<input type="hidden" name="entity_type" value={entityType} />
			<input type="hidden" name="rating" value={rating} />
			<button
				type="submit"
				name="_action"
				value={actionName}
				className={`${currentRating === rating || fetcher?.state !== 'idle' ? 'text-cyan-700 border-cyan-700 hover' : 'text-gray-400 hover:text-gray-500 hover:border-gray-500 border-gray-400'} text-2xl border-2 rounded-2xl  p-2 w-12 text-center`}
				disabled={currentRating === rating}
			>
				{rating}
			</button>
		</fetcher.Form>
	)
}
