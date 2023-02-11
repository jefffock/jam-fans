export const loader = async ({ request, params }) => {
	const response = new Response();
	return json(
		{},
		{
			headers: response.headers,
		}
	);
};
