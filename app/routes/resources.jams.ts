import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { addJam } from '~/modules/jam/service.server'
import { getProfileFromRequest } from '~/modules/profile/service.server'
import { getSongFromName } from '~/modules/song/service.server'

export async function action({ request }: ActionFunctionArgs) {
	let formData = await request.formData()
	console.log('formData', formData)
	let { _action, ...values } = Object.fromEntries(formData)
	console.log('in resources/ jam', values)
	//if values.song contains '☆ ', remove it
	if (values.song.includes('☆ ')) {
		values.song = values.song.slice(2)
	}
	const profile = await getProfileFromRequest(request)
	console.log('profile', profile)

	const song = await getSongFromName({ song: values.song, artist: values.artist, profile })
	console.log('song in resources.jams', song)
	const addedJam = await addJam({
		date: values.date,
		artist: values.artist,
		song,
		profile,
		location: values.location,
		show_id: values.show_id,
	})
	console.log('addedJam', addedJam)
	return json({ ok: true })
}
