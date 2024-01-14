import { type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export async function loader({}: LoaderFunctionArgs) {
	return {}
}

export default function Index() {
	return (
		<div>
			<p>test</p>
			<p>test</p>
			<p>test</p>

			<p>test</p>
			<p>test</p>
			<p>test</p>
		</div>
	)
}
