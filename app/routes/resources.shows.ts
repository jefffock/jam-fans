import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { addShow } from '~/modules/show/service.server'

export async function action({ request }: ActionFunctionArgs) {
	let formData = await request.formData()
	console.log('formData', formData)
	let { _action, ...values } = Object.fromEntries(formData)
	if (_action === 'add-show') {
		console.log('in add show', values)
		const addedShow = await addShow(values)
		console.log('addedshow', addedShow)
	}
	return json({ ok: true })
}
