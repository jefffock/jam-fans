import { Outlet, useLoaderData } from '@remix-run/react';

export default function JamsHome({
	supabase,
	session,
}) {

	return (
		<div>
      <h1>Jams</h1>
      <h2>Artist Horizontal Scroll</h2>
      <button>Filters</button>
			<Outlet context={{ supabase, session }}/>
		</div>
	);
}
