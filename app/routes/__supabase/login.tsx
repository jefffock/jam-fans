import { Link } from "@remix-run/react";

export default function SignIn() {
  return (
    <div>
      <h1>Sign In</h1>
      <Link to='join'>Sign Up</Link>
    </div>
  );
}