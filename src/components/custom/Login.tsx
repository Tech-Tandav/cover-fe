"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, TLoginSchema } from "@/domain/schema/LoginSchema"
import { signIn } from "next-auth/react";


export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const redirect = searchParams.get("callbackUrl") || "/"

  const { register, handleSubmit, formState:{errors, isSubmitting}, reset} = useForm({
    resolver: zodResolver(LoginSchema)
  })

  const onSubmit = async (data: TLoginSchema) => {
    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
      callbackUrl: redirect,
    })
    if (!res) {
      toast.error("Something went wrong")
      return
    }

    if (res.error) {
      toast.error(res.error)
      return
    }

    toast.success("Logged in successfully")
    router.push(redirect )
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                {...register("username")}
                id="username"
                type="text"
                placeholder="username"
                // required
              />
              { errors.username &&
                 <p className="text-red-500">{errors.username.message as string} </p>
              }
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                // name="password"
                // onChange={handleChange}
                // required
              />
              { errors.password &&
                 <p className="text-red-500">{errors.password.message as string} </p>
              }
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging..." : "Login"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href={`/register?redirect=${redirect}`} className="text-primary hover:underline">
                Register here
              </Link><br/>
              <Link href="/" className="text-primary">
                Home
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
