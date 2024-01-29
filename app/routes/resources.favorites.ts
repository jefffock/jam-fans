import { updateFavorites } from '~/modules/favorites/service.server'

export async function action({ request, params }) {
	let formData = await request.formData()
	console.log('formData in favorites', formData)
	let { _action, ...values } = Object.fromEntries(formData)
	console.log('values', values)
	const favorite = await updateFavorites({
		userId: values.user_id,
		entityType: values.entity_type,
		entityId: values.entity_id,
		isFavorite: values.is_favorite,
	})
	console.log('favorite in addfavorite', favorite)
	return null
}
