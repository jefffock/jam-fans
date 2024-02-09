export default function Contact() {
	return (
		<div className="w-100 h-100">
			<div className="p-4 bg-white border border-gray-200 rounded-lg shadow m-4 mt-6 w-80 flex flex-col justify-between mx-auto sm:px-6 ">
				<div className=" flex flex-row justify-between border-b border-gray-200 bg-white px-4 py-4 pb-0 sm:px-6">
					<h3 className="text-lg self-center font-medium leading-6 text-gray-900 m-4">contact</h3>
				</div>
				<h1 className="m-4 text-gray-700">
					open to all suggestions: design, wording, features, etc. also, please let me know if you encounter
					any bugs or anything annoying. thank you!
				</h1>
				<p className="mx-4">
					email:{' '}
					<a className="underline" href="mailto:hi@jam.fans">
						hi@jam.fans
					</a>
				</p>
			</div>
		</div>
	)
}
