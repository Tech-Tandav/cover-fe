"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, TLoginSchema } from "@/domain/schema/LoginSchema";
import { signIn } from "next-auth/react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from "lucide-react";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("callbackUrl") || "/";
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: TLoginSchema) => {
    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
      callbackUrl: redirect,
    });
    if (!res) {
      toast.error("Something went wrong");
      return;
    }
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Logged in successfully");
    router.push(redirect);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px,transparent 1px),linear-gradient(to right,currentColor 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
        {/* Brand / marketing pane */}
        <div className="hidden flex-col gap-8 lg:flex">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>

          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" />
              Welcome back
            </div>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight xl:text-5xl">
              Sign in to keep
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                shopping smarter.
              </span>
            </h1>
            <p className="max-w-md text-muted-foreground">
              Access your orders, wishlist and saved addresses. Pick up right
              where you left off.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              {
                icon: ShieldCheck,
                title: "Secure & private",
                sub: "Your data stays on our servers, never sold.",
              },
              {
                icon: Zap,
                title: "Fast checkout",
                sub: "Saved details, one-tap re-orders.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{f.title}</div>
                  <div className="text-xs text-muted-foreground">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form pane */}
        <Card className="w-full border-border/60 bg-card/80 shadow-xl backdrop-blur-xl">
          <CardHeader className="space-y-2">
            <Link
              href="/"
              className="mb-2 inline-flex w-fit items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            >
              <ArrowLeft className="h-3 w-3" />
              Back
            </Link>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm">
              <Lock className="h-5 w-5" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...register("username")}
                    id="username"
                    type="text"
                    placeholder="your.username"
                    autoComplete="username"
                    className="pl-9"
                    aria-invalid={!!errors.username}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-destructive">
                    {errors.username.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pl-9 pr-10"
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message as string}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full gap-2 rounded-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-2 border-t border-border/40 pt-4 text-center text-sm text-muted-foreground">
            <p>
              Don&apos;t have an account?{" "}
              <Link
                href={`/register?redirect=${redirect}`}
                className="font-medium text-primary hover:underline"
              >
                Create one
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
