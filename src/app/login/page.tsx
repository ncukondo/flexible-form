export default function Login() {
  return (
    <div className="grid justify-center items-center min-h-[100dvh]">
      <form action="/auth/login" method="post" className="grid gap-10">
        <h1 className="text-3xl">Flexible Form Sign In</h1>
        <div className="flex gap-4 items-center">
          <label htmlFor="email" className="text-lg">
            Email
          </label>
          <input
            className="input input-bordered"
            placeholder="Your email address"
            type="email"
            name="email"
          />
        </div>
        <button className="btn btn-primary">Send Magic Link to Sign In</button>
      </form>
    </div>
  );
}
