import { json } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { getShowById } from '~/modules/show/service.server'
import ShowCard from '~/components/cards/ShowCard'
import { useLoaderData } from '@remix-run/react'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	//get $id param
	const id = params.id
	console.log('id', id)
	const show = await getShowById(Number(id))
	if (show) {
		return json({ show })
	}
	return json({ message: 'Show not found' }, { status: 404 })
}

export default function Show() {
	const { show } = useLoaderData()
	console.log('show', show)

	return <ShowCard show={show} />
}
