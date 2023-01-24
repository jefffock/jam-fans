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
      <h1>Jams Layout</h1>
			<Outlet context={{ supabase, session }}/>
			<button>Add Jam</button>
		</div>
	);
}
