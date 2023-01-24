import { Link } from '@remix-run/react';
import type { MaybeSession, TypedSupabaseClient } from '~/routes/__supabase';

export default function BottomNav({
	supabase,
	session,
}: {
	supabase: TypedSupabaseClient;
	session: MaybeSession;
}) {
	return (
		<section
			id='bottom-navigation'
			className='block fixed inset-x-0 bottom-0 z-10 bg-white shadow'
		>
			<nav className='flex justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='-mb-px flex space-x-8'>
					<Link
						to='/'
						className='border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
					>
						Explore
					</Link>
					<Link
						to='/add'
						className='border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
					>
						Add
					</Link>
				</div>
			</nav>
		</section>
	);
}
