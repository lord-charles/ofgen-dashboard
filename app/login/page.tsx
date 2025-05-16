
import type React from "react"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form"

export default async function LoginPage() {

  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }



  return (
    <div>
      <LoginForm />
    </div>
  )
}
