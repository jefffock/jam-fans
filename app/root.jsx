
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
	useLoaderData
} from "@remix-run/react";
import { json, redirect } from '@remix-run/node';
import { createBrowserClient } from '@supabase/auth-helpers-remix';
import { useEffect, useState } from 'react';
import { createServerClient } from 'utils/supabase.server';
import TopNav from 'app/components/TopNav';
import BottomNav from 'app/components/BottomNav';

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

export const loader = async ({ request, params }) => {
	console.log('params in root.tsx', params)
	// if (Object.keys(params).length === 0) {
	// 	return redirect('/jams');
	// }
  // environment variables may be stored somewhere other than
  // `process.env` in runtimes other than node
  // we need to pipe these Supabase environment variables to the browser
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
  };

  // We can retrieve the session on the server and hand it to the client.
  // This is used to make sure the session is available immediately upon rendering
  const response = new Response();

  const supabase = createServerClient({ request, response });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  // in order for the set-cookie header to be set,
  // headers must be returned as part of the loader response
  return json(
    {
      env,
      session
    },
    {
      headers: response.headers
    }
  );
};

export default function Root() {
	const { env, session } = useLoaderData();
  const fetcher = useFetcher();

  const [supabase] = useState(() =>
    createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        console.log('server and client are out of sync.')
        // Remix recalls active loaders after actions complete
        fetcher.submit(null, {
          method: 'post',
          action: '/handle-supabase-auth'
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, supabase, fetcher]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
	  <div className='w-full h-full'>
      <TopNav supabase={supabase} session={session}/>
      <Outlet supabase={supabase} session={session}/>
      <BottomNav supabase={supabase} session={session}/>
      </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
