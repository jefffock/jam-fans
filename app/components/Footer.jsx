import { Link } from "@remix-run/react"

export default function Footer() {
  return(
    <div className='fixed bottom-0 w-full flex justify-center'>
    <div className='flex max-w-60 py-20 mx-auto'>
      <Link className='underline' href='/privacy'>Privacy Policy</Link>
      <p>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</p>
      <Link className='underline' href='/terms'>Terms of Service</Link>
    </div>

    </div>
  )

}