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
	versions,
	sounds,
	open,
	setOpen,
	title,
	count,
	search,
}) {
	if (!artists) return <div>Loading...</div>;

	return (
		<div>
			<div className='flex justify-end'>
				<FiltersButton
					open={open}
					setOpen={setOpen}
				/>
			</div>
			<ArtistBar artists={artists} />
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
				jams={versions}
				sounds={sounds}
				title={title}
			/>
		</div>
	);
}
