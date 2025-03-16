"use server";

import { auth,signIn,signOut } from "@/auth";

export async function signInWithGoogle() {
  await signIn("google");
}

export async function signOutUser() {
    await signOut()
}

export async function getSessionDetails(){
    const session = await auth();
    console.log(session)
}
