import { Link } from "@remix-run/react";
import type { MaybeSession, TypedSupabaseClient } from '~/routes/__supabase';


export default function TopNav({ supabase, session}: {
	supabase: TypedSupabaseClient;
	session: MaybeSession;
}) {
  return (
    <nav>
      <ul className="flex">
        <li className="mr-6">
          <Link to="/">Home</Link>
        </li>
        <li className="mr-6">
          <Link to="/jams">Jams</Link>
        </li>
        <li className="mr-6">
          <Link to="/shows">Shows</Link>
        </li>
        <li className="mr-6">
          <Link to="/sets">Sets</Link>
        </li>
        {!session && (
          <li className="mr-6">
            <Link to="/login">Login</Link>
            </li>
            )}
      </ul>
    </nav>
  );
}