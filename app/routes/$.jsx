import { redirect } from '@remix-run/node'
import { Link } from '@remix-run/react'

export const loader = async () => {
	return redirect('/')
}

export default function Index({}) {
	return <Link to="/">Home</Link>
}
