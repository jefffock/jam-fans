import { Form } from '@remix-run/react'

export default function FiltersForm({ children }) {
	return (
		<Form
			method="post"
			className="space-y-6 divide-y divide-gray-200 w-96 max-w-full mx-auto"
			id="jam-filter-form"
			onSubmit={() => e.preventDefault()}
		>
			{children}
		</Form>
	)
}
