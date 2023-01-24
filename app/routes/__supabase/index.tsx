import { Link, Outlet } from '@remix-run/react';
import type { MaybeSession, TypedSupabaseClient } from '~/routes/__supabase';

export default function Index({
	supabase,
	session,
}: {
	supabase: TypedSupabaseClient;
	session: MaybeSession;
}) {
	return (
		<div>
			<h1>Jam Fans</h1>
			<ul>
				<Link to='jams'>Jams</Link>
				<Link to='shows'>Shows</Link>
				<Link to='sets'>Sets</Link>
			</ul>
			<Outlet context={{ supabase, session }} />
		</div>
	);
}
