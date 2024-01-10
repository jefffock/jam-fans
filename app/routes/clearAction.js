import { json } from '@remix-run/node';

export const action = async ({ request, params }) => {
  return { status: 200, body: 'clear' }
};
