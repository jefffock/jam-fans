//create loader function
import { json } from '@remix-run/node'
import { getSetlist } from '~/modules/setlist/service.server'

export const loader = async ({ request, params }) => {
	const url = new URL(request.url)
	const queryParams = Object.fromEntries(url.searchParams.entries())
	const artist = JSON.parse(queryParams?.artist)
	const date = queryParams?.date
	try {
		const enrichedSetlist = await getSetlist({ artist, date })
		return json({ enrichedSetlist })
	} catch (error) {
		console.error('error in loader', error)
		return json({ error: error.message })
	}
}
