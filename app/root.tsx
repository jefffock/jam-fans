import { Links, LiveReload, Outlet, Scripts, ScrollRestoration, useRouteError, useLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import TopNav from './components/TopNav'
import BottomNav from './components/BottomNav'
import { AuthSession } from '@supabase/supabase-js'
import { getAuthSession } from './modules/auth'
import { json } from '@remix-run/node'
import { getProfile, getProfileFromRequest } from './modules/profile/index.server'

// import type { LinksFunction } from "@remix-run/node";

import styles from './tailwind.css'
import otherStyles from './customStyles.css'

export const links = () => [
	{ rel: 'stylesheet', href: styles },
	{ rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
	{ rel: 'stylesheet', href: otherStyles },
]

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Jam Fans | Find and add great jams by Grateful Dead, Phish, SCI, UM, moe. WSMFP, BMFS, Goose, and more',
		},
		{ description: 'Find and add great jams by Grateful Dead, Phish, SCI, UM, moe., WSMFP, BMFS, Goose, and more' },
	]
}

export function ErrorBoundary() {
	const error = useRouteError()

	console.error(error)
	return (
		<html>
			<head>
				<title>My bad...</title>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Links />
			</head>
			<body>
				<p className="mx-auto p-10">
					Something went wrong :&#40; Please let me know on{' '}
					<a className="color-blue underline" href="https://www.instagram.com/jefffocks/">
						insta
					</a>{' '}
					or{' '}
					<a className="color-blue underline" href="https://twitter.com/jeffphox">
						bird app
					</a>
				</p>
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
