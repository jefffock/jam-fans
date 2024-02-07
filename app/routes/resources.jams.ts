import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { addJam } from '~/modules/jam/service.server'
import { getProfileFromRequest } from '~/modules/profile/service.server'
import { getSongIdFromName } from '~/modules/song/service.server'

export async function action({ request }: ActionFunctionArgs) {
	let formData = await request.formData()
	console.log('formData', formData)
	let { _action, ...values } = Object.fromEntries(formData)
	console.log('in add jam', values)
	//if values.song contains '☆ ', remove it
	if (values.song.includes('☆ ')) {
		values.song = values.song.slice(2)
	}
	const profile = await getProfileFromRequest(request)
	const songId = await getSongIdFromName(values, profile)
	console.log('songId in resources.jams', songId)
	const addedJam = await addJam(values, songId)
	console.log('addedJam', addedJam)
	return json({ ok: true })
}
