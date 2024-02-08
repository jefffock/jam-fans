import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { addAttributesToEntity } from '~/modules/attribute/service.server'

export async function action({ request }: ActionFunctionArgs) {
	let formData = await request.formData()
	console.log('formData', formData)
	let { _action, ...values } = Object.fromEntries(formData)
	console.log('in add attributes', values)
	const addedAttributes = await addAttributesToEntity(values)
	return json({ addedAttributes })
}
