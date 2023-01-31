import { Form } from "@remix-run/react"

export async function action(request) {
  const { supabase } = request.locals
  const data = new URLSearchParams(await request.text())
  const username = data.get("username")
  const { error } = await supabase.auth.signUp({ email: username, password: "password" })
  if (error) {
    return json({ error: error.message }, { status: error.status })
  }
  return json({ username }, { status: 201 })
}

export default function Welcome() {
  return (
    <div className="flex flex-col max-w-xs justify-center mx-auto text-center my-20">
      <img src='/icon-circle.png' className='mx-auto h-12 my-4 w-auto' alt='Jam Fans' />
      <p className="my-4">
      Choose a name to start rating!
      </p>
      <div className="my-4">
      <label htmlFor="username" className="block text-sm font-medium text-gray-700 text-left">
        Username
      </label>
      <div className="mt-1">
        <input
          type="username"
          name="username"
          id="username"
          className="block w-full rounded-md border-gray-300 border-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-2"
          placeholder=""
        />
      </div>
      <button
        type="button"
        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 my-4"
      >
        Choose this name
      </button>
    </div>
    </div>
  )
}