import { Outlet, useLoaderData } from '@remix-run/react';
import type { MaybeSession, TypedSupabaseClient } from '~/routes/__supabase';

export default function JamsHome({
	supabase,
	session,
}: {
	supabase: TypedSupabaseClient;
	session: MaybeSession;
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
