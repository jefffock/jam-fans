//create loader function
import { createServerClient, parse, serialize } from '@supabase/ssr'
import { json } from '@remix-run/node'
import { getSetlist } from '~/modules/setlist/service.server'

export const loader = async ({ request, params }) => {
	const url = new URL(request.url)
	const queryParams = Object.fromEntries(url.searchParams.entries())
	const artist = JSON.parse(queryParams?.artist)
	const date = queryParams?.date
	console.log('artist, date', artist, date)
	try {
		const { setlist, location } = await getSetlist({ artist, date })
		return json({ setlist, location })
	} catch (error) {
		console.error('error in loader', error)
		return json({ error: error.message })
	}
}
