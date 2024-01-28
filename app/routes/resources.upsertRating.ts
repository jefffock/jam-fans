import { upsertRating } from '~/modules/rating/service.server'
import { getAuthSession } from '~/modules/auth'
import { getProfileFromRequest } from '~/modules/profile/service.server'

export async function action({ request, params }) {
	//get userid from request
	const profile = await getProfileFromRequest(request)
	if (!profile) {
		throw new Error('Not logged in')
	}

	let formData = await request.formData()
	console.log('formData', formData)
	let { _action, ...values } = Object.fromEntries(formData)
	console.log('values', values)
	const rating = await upsertRating({
		userId: profile.id,
		rating: values.rating,
		entityType: values.entity_type,
		entityId: values.entity_id,
	})
	console.log('rating in upsertRating', rating)
	return null
}
