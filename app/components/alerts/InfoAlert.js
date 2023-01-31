import { InformationCircleIcon } from '@heroicons/react/20/solid'

export default function InfoAlert({title, description }) {
 
  return (
    <div className={`rounded-md bg-blue-50 p-4 my-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon className={`h-5 w-5 text-blue-400`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium text-black-800`}>{title}</h3>
          <div className={`mt-2 text-sm text-black-700`}>
            <p>
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
