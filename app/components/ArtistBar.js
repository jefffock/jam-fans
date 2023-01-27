import { useFetcher } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ArtistBar({ artists }) {
  if (!artists) return <div>Loading...</div>;
  const fetcher = useFetcher()

  function handleArtistClick(artist) {

  }

  return (
    <div className="flex h-30 w-screen overflow-x-scroll space-x-10 items-starts justify-items-center px-2">
      {artists?.map((artist, index) => {
        let url = `/jams?artists-${artist.url}=${artist.url}`
        return (
          <div key={index} className='text-center min-w-40 mb-2'>
            <Link to={url} >
            <p className='text-center text-2xl'>{String.fromCodePoint(artist.emoji_code)}</p>
            <p className='text-center whitespace-nowrap'>{artist.nickname}</p>
            </Link>
          </div>
        );
      }
      )}
    </div>
  );
}