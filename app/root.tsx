import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
	Link,
	Links,
	LiveReload,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useRouteError,
} from '@remix-run/react'
import TopNav from './components/TopNav'
import { getProfileFromRequest } from './modules/profile/index.server'

// import type { LinksFunction } from "@remix-run/node";

import otherStyles from './customStyles.css'
import styles from './tailwind.css'

export const links = () => [
	{ rel: 'stylesheet', href: styles },
	{ rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
	{ rel: 'stylesheet', href: otherStyles },
]

export const meta: MetaFunction = () => {
	return [
		{
			title: 'sharing jams is caring',
		},
		{
			description:
				'explore and share jams and shows by the grateful dead, phish, sci, um, moe., tdb, wsmfp, bmfs, goose, eggy, spafford, and more',
		},
	]
}

export function ErrorBoundary() {
	const error = useRouteError()

	console.error(error)
	return (
		<html>
			<head>
				<title>my bad...</title>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Links />
			</head>
			<body>
				<div className="flex flex-col">
					<p className="text-center p-10 pt-20">something went wrong... sorry about that :/</p>
					<p className="text-center mx-auto w-fit p-10">
						let me know -{' '}
						<a className=" underline" href="mailto:hi@jam.fans">
							hi@jam.fans
						</a>{' '}
					</p>
					<p className="text-center p-10">
						<Link to="/">refreshing the page</Link> should get things going again
					</p>
				</div>
				<Scripts />
			</body>
		</html>
	)
}

export async function loader({ request }: LoaderFunctionArgs) {
	const profile = await getProfileFromRequest(request)

	return json({ profile })
}

export default function Root({}) {
	const { profile } = useLoaderData()
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Links />
			</head>
			<body>
				<div className="w-full h-full">
					<TopNav profile={profile} />
				</div>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
