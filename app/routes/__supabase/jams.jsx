import { Outlet, useLoaderData } from '@remix-run/react';

export default function JamsHome({
	supabase,
	session,
}) {

	return (
		<div>
			<Outlet context={{ supabase, session }}/>
		</div>
	);
}
