import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { Link } from '@remix-run/react'

export default function InfoAlert({ title, description, linkTo, linkText }) {
	return (
		<div className={`rounded-md bg-blue-50 p-4 my-4 max-w-80`}>
			<div className="flex">
				<div className="flex-shrink-0">
					<InformationCircleIcon className={`h-5 w-5 text-blue-400`} aria-hidden="true" />
				</div>
				<div className="ml-3">
					<h3 className={`text-sm font-medium text-black-800`}>{title}</h3>
					<div className={`mt-2 text-sm text-black-700`}>
						<p>{description}</p>
						{linkTo && linkText && (
							<Link to={linkTo} className="text-blue-500 hover:underline">
								{linkText}
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
