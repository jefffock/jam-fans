import { addLike } from '~/modules/likes/service.server'

export async function action({ request, params }) {
	let formData = await request.formData()
	console.log('formData', formData)
	let { _action, ...values } = Object.fromEntries(formData)
	console.log('values', values)
	const like = await addLike({
		userId: values.user_id,
		entityType: values.entity_type,
		entityId: values.entity_id,
	})
	console.log('like in addLike', like)
	return null
}
