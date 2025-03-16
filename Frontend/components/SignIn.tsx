import { signInWithGoogle } from "../lib/auth-actions";
import {auth} from "@/auth"

export default async function SignIn() {

  return (
    <form action={signInWithGoogle}>
      <button type="submit">Signin with Google</button>
    </form>
  );
}
