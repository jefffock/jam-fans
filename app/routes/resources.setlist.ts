//create loader function
import { json } from '@remix-run/node'
import { getSetlist } from '~/modules/setlist/service.server'

export const loader = async ({ request }) => {
	const url = new URL(request.url)
	const queryParams = Object.fromEntries(url.searchParams.entries())
	const artist = {
		artist: queryParams?.artist,
		mbid: queryParams?.mbid,
		baseUrl: queryParams?.baseUrl,
		data_source: queryParams?.data_source,
	}
	const date = queryParams?.date
	try {
		const enrichedSetlist = await getSetlist({ artist, date })
		return json({ enrichedSetlist })
	} catch (error) {
		console.error('error in loader', error)
		return json({ error: error.message })
	}
}
