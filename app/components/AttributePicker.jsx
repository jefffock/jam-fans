import { useFetcher } from '@remix-run/react'
import Accordion from './Accordion'
import Button from './Button'

export default function AttributePicker({
	attributes,
	defaults,
	handleAttributesChange,
	cantUncheckDefaults,
	parsedSelectedAttributes,
	title,
	inCard = true,
	previousAttributes = [],
	previewAboveLabel = false,
	newAttributes = [],
	disableButton = true,
	entityType,
	entityId,
}) {
	const fetcher = useFetcher()
	function isDefaultChecked(attribute) {
		if (defaults) {
			return defaults.some((defaultAttribute) => JSON.parse(defaultAttribute).id === attribute.id)
		}
		return false
	}

	function isDisabled(attribute) {
		if (cantUncheckDefaults) {
			return (
				isDefaultChecked(attribute) &&
				previousAttributes.some((prevAttribute) => JSON.parse(prevAttribute).id === attribute.id)
			)
		}
	}

	const sortedAttributes = parsedSelectedAttributes
		.filter((attr) => attr.id && !previousAttributes.includes(attr.id))
		.sort((a, b) => a.label.localeCompare(b.label))

	return (
		<Accordion
			title={title}
			isPreviewEnabled={true}
			previewItems={newAttributes ?? sortedAttributes}
			previewItemLabelKey="label"
			previewAboveLabel={previewAboveLabel}
			defaultOpen={inCard}
			inCard={inCard}
		>
			<>
				{inCard && entityType && (
					<div className="flex justify-center mb-2">
						<fetcher.Form method="post" action="/resources/attributes" className="flex justify-center">
							<input type="hidden" name="entityType" value={entityType} />
							<input type="hidden" name="entityId" value={entityId} />
							<input type="hidden" name="attributes" value={JSON.stringify(parsedSelectedAttributes)} />
							<Button
								type="submit"
								text={`${fetcher?.state === 'idle' ? 'update' : 'updating'} ${entityType.toLowerCase()}${fetcher?.state === 'idle' ? '' : '...'}`}
								disabled={fetcher?.state !== 'idle' || disableButton}
							/>
						</fetcher.Form>
						<br />
					</div>
				)}
				<div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 mb-4">
					<div className="sm:col-span-6 mx-4">
						<div className="mt-1 flex rounded-md shadow-sm">
							<fieldset>
								<legend className="text-2xl text-gray-900 hidden">attributes</legend>
								<div className="divide-y divide-gray-200 border-t border-b border-gray-200 max-h-60 overflow-y-scroll sm:col-span-6">
									{attributes &&
										attributes?.map((attribute) => (
											<div key={attribute.id} className="relative flex items-start py-4">
												<div className="min-w-0 flex-1 text-lg">
													<label
														htmlFor={`${attribute.text}`}
														className="select-none font-medium text-gray-700 mx-2"
													>
														{attribute?.label}
													</label>
												</div>
												<div className="ml-3 flex h-5 items-center">
													<input
														value={JSON.stringify(attribute)}
														id={`${attribute.text}`}
														name="attributes"
														type="checkbox"
														className="h-6 w-6 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500  border-2 mr-2"
														onChange={handleAttributesChange}
														defaultChecked={isDefaultChecked(attribute)}
														disabled={isDisabled(attribute)}
													/>
												</div>
											</div>
										))}
								</div>
							</fieldset>
						</div>
					</div>
				</div>
			</>
		</Accordion>
	)
}
