
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useRouteError,
	isRouteErrorResponse,
	useFetcher,
	useLoaderData,
} from "@remix-run/react";
import { json, redirect, LoaderFunctionArgs } from '@remix-run/node';
import { createServerClient, parse, serialize } from '@supabase/ssr'
import { useEffect, useState } from 'react';
import TopNav from 'app/components/TopNav';
import BottomNav from 'app/components/BottomNav';
import { createBrowserClient } from "@supabase/ssr";


// import type { MetaFunction } from "@remix-run/node";
// import type { LinksFunction } from "@remix-run/node";

import styles from "./tailwind.css";

export const links = () => [
  { rel: "stylesheet", href: styles },
  {rel: "stylesheet", href: "https://rsms.me/inter/inter.css"},
];

//tslint:disable-next-line
export const meta = () => {
	 	return [
  { charset: "utf-8"},
  { title: "Jam Fans | Find and add great jams by Grateful Dead, Phish, SCI, UM, moe. WSMFP, BMFS, Goose, and more"},
  { description: "Find and add great jams by Grateful Dead, Phish, SCI, UM, moe., WSMFP, BMFS, Goose, and more"},
  { viewport: "width=device-width,initial-scale=1"},
]};

export function ErrorBoundary() {
	const error = useRouteError();

  console.error(error);
  return (
    <html>
      <head>
        <title>What's goin on?</title>
        <Meta />
        <Links />
      </head>
      <body>
        <p className="mx-auto p-10">Something went wrong :&#40; Please let me know on <a className="color-blue underline" href='https://www.instagram.com/jefffocks/'>insta</a> or <a className="color-blue underline" href='https://twitter.com/jeffphox'>twatter</a></p>
        <Scripts />
      </body>
    </html>
  );
}

export async function loader({}: LoaderFunctionArgs) {
	return {
		env: {
		  SUPABASE_URL: process.env.SUPABASE_URL!,
		  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
		},
	  };
};

export default function Root() {
	const { env } = useLoaderData<typeof loader>();

  const supabase = createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  async function getSession() {
	const { data: session, error } = await supabase.auth.getSession()
	return session
  }

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
	  <div className='w-full h-full'>
      <TopNav supabase={supabase} session={() => getSession()}/>
      <Outlet />
      <BottomNav />
      </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
