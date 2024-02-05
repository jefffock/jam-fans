import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { addSet } from '~/modules/set/service.server'

export async function action({ request }: ActionFunctionArgs) {
	//get action name

	let formData = await request.formData()
	console.log('formData', formData)
	let { _action, ...values } = Object.fromEntries(formData)

	if (_action === 'add-set') {
		console.log('in add set', values)
		const addedSet = await addSet(values)
		console.log('addedSet', addedSet)
	}
	return json({ ok: true })
}
