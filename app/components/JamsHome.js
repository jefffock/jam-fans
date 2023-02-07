//import components used below
import JamFiltersSlideout from './JamFilters';
import ArtistBar from './ArtistBar';
import FiltersButton from './FiltersButton';
import JamList from './JamList';

export default function JamsHome({
	supabase,
	session,
	artists,
	songs,
	jams,
	sounds,
	open,
	setOpen,
	title,
	count,
	search,
  user,
  profile
}) {
	if (!artists) return <div>Loading...</div>;

	return (
		<div className='bg-gray-100'>
			<div className='flex justify-center pt-3 pb-0 mb-0'>
				<FiltersButton
					open={open}
					setOpen={setOpen}
				/>
			</div>
			<ArtistBar artists={artists} search={search}/>
			<JamFiltersSlideout
				sounds={sounds}
				artists={artists}
				songs={songs}
				open={open}
				setOpen={setOpen}
				totalCount={count}
				search={search}
			/>
			<JamList
				jams={jams}
				sounds={sounds}
				title={title}
        user={user}
        profile={profile}
        search={search}
			/>
		</div>
	);
}
