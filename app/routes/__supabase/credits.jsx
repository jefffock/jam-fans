export default function Credits() {
	return (
		<div className='p-4 w-full h-full pb-20'>
			<div class='flex flex-col items-center mt-10 p-4 mx-auto max-w-xl border rounded-xl text-gray-800'>
				<h1 class='text-3xl self-center pb-6'>Credits</h1>
				<p class='text-lg  mb-6'>
					When adding jams, the show and setlist data comes from:
				</p>

				<h2 class='text-2xl font-bold mb-2'>Phish.net</h2>
				<p class='text-lg  mb-6'>Phish, Trey Anastasio, TAB</p>
				<p className='text-lg mb-6'>
					<a
						className='underline text-blue-700 hover:text-blue-800'
						href='https://phish.net/credits'
					>
						phish.net
					</a>{' '}
					is an amazing resource for <em></em>all things Phish. Thanks to the{' '}
					<a
						className='underline text-blue-700 hover:text-blue-800'
						href='https://phish.net/credits'
					>
						phish.net team
					</a>
					!
				</p>
				<h2 class='text-2xl font-bold mt-8 mb-2'>Songfish</h2>
				<p class='text-lg mb-6'>Eggy, Goose, Neighbor, Umphrey's McGee</p>
				<p class='text-lg  mb-6'>
					<a
						className='underline text-blue-700 hover:text-blue-800'
						href='https://songfishapp.com/'
					>
						Songfish
					</a>{' '}
					is setlist software that "allows a band or fans to preserve concert
					setlists and data. The software allows users to search that data and
					generate statistics." Thanks{' '}
					<a
						href='https://adamscheinberg.com/'
						className='underline text-blue-700 hover:text-blue-800'
					>
						Adam Scheinberg
					</a>
					!
				</p>
				<h2 class='text-2xl font-bold mb-2'>Setlist.fm</h2>
				<p class='text-lg  mb-6'>All other artists</p>
				<p class='text-lg  mb-10 self-start'>
					<a
						className='underline text-blue-700 hover:text-blue-800'
						href='https://www.setlist.fm/'
					>
						Setlist.fm
					</a>{' '}
					has setlists by every band you can think of. Thank you to the setlist.fm contributors!
				</p>
				<p class='text-xl  mb-4'>
					Thank you to everyone involved at Phish.net, Songfish, and Setlist.fm!
				</p>
			</div>
		</div>
	);
}
