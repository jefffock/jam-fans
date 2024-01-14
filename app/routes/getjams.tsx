import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { createServerClient, parse, serialize } from '@supabase/ssr'
import { getJams, loadJams } from '~/modules/jam'
import { useLoaderData } from '@remix-run/react'

export async function loader({ request, params }: LoaderFunctionArgs) {
	const requestUrl = new URL(request.url)
	const searchParams = requestUrl.searchParams
	const headers = new Headers()
	try {
		const queryParams = Object.fromEntries(searchParams)
		console.log('params', queryParams)
		const data = await loadJams(queryParams)
		console.log('is array', Array.isArray(data))
		return data
	} catch (error) {
		return redirect('/', { headers })
	}
}

export default function NewJamsPage() {
	//display data from loader
	const data = useLoaderData()

	return (
		<div>
			<h1>Get Jams</h1>
			{/* <p>{JSON.parse(data).length || ''}</p> */}
		</div>
	)
}
