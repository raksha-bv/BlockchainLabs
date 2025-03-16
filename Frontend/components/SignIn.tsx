import { signInWithGoogle } from "./auth-actions";

export default function SignIn() {
  return (
    <form action={signInWithGoogle}>
      <button type="submit">Signin with Google</button>
    </form>
  );
}
