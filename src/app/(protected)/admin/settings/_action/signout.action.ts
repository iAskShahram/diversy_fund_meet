"use server";

import { signOut } from "@/server/auth";

export async function signoutAction() {
  await signOut();
}
