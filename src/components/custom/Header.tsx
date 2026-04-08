"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"
import { signOut, useSession } from "next-auth/react"


export function Header() {
  const { data: session, status } = useSession()

  // stable auth check
  const isAuthenticated = !!session

  // optional loading guard
  if (status === "loading") {
    return null // or <Spinner />
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    window.location.reload()
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">FutsalHub</span>
        </Link>

        <nav className="flex items-center gap-2">
          

          {isAuthenticated  ? (
            <>
              <Link href="/my-bookings">
                <Button variant="ghost" className="text-sm font-medium">
                  My Booking
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" >
                  <DropdownMenuLabel>{session.user.name?.toUpperCase()}</DropdownMenuLabel>
                  <DropdownMenuLabel>{session.user.role}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="text-sm font-medium">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
