import { getProfileFromRequest } from '~/modules/profile/service.server'
import { upsertRating } from '~/modules/rating/service.server'

export async function action({ request, params }) {
	console.log('in resources/ratings')
	//get userid from request
	const profile = await getProfileFromRequest(request)
	if (!profile) {
		console.log('Not logged in')
	}

	let formData = await request.formData()
	let { _action, ...values } = Object.fromEntries(formData)
	console.log('_action', _action)
	console.log('values in resources.ratings', values)
	console.log(typeof values.like)
	const rating = await upsertRating({
		userId: profile?.id,
		entityType: values.entity_type,
		entityId: values.entity_id,
		rating: values.rating,
		ratingChange: values.rating !== values.current_rating,
		comment: values.comment,
		favorite:
			_action === 'favorite' && values.is_favorite === 'false'
				? 'add'
				: _action === 'favorite' && values.is_favorite === 'true'
					? 'remove'
					: null,
		like: _action === 'like',
	})
	console.log('rating in resources.rating', rating)
	return null
}
