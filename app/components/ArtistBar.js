export default function ArtistBar({ artists }) {
  return (
    <div className="flex h-30 w-screen overflow-x-scroll space-x-10 items-starts justify-items-center px-2">
      {artists.map((artist, index) => {
        return (
          <div key={index} className='text-center min-w-40 mb-2'>
            <p className='text-center text-2xl'>{String.fromCodePoint(artist.emoji_code)}</p>
            <p className='text-center whitespace-nowrap'>{artist.nickname}</p>
          </div>
        );
      }
      )}
    </div>
  );
}