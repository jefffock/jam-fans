import type { ActionFunctionArgs } from '@remix-run/node'
import { addJam } from '~/modules/jam/service.server'

export async function action({ request }: ActionFunctionArgs) {
	let formData = await request.formData()
	console.log('formData', formData)
	let { _action, ...values } = Object.fromEntries(formData)
	if (_action === 'add-jam') {
		console.log('in add jam', values)
		const addedJam = await addJam(values)
		console.log('addedJam', addedJam)
	}
	return json({ ok: true })
}
