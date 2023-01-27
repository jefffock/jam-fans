//import components used below
import JamFiltersSlideout from './JamFilters';
import ArtistBar from './ArtistBar';
import FiltersButton from './FiltersButton';
import JamList from './JamList';

export default function JamsHome({ supabase, session, artists, songs, versions, sounds, open, setOpen, title, subtitle }) {
  if (!artists) return <div>Loading...</div>;

	return (
		<div>
      <div className='flex justify-end p-4'>
        <FiltersButton open={open} setOpen={setOpen} />
      </div>
      <ArtistBar artists={artists} />
      <JamFiltersSlideout sounds={sounds} artists={artists} songs={songs} open={open} setOpen={setOpen}/>
      <JamList jams={versions} sounds={sounds} title={title} subtitle={subtitle}/>
		</div>
	);
}
