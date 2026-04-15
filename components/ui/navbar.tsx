"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { LogIn, LogOut, Menu, Settings, User, UserPlus, X } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const menuItems = [
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Events", href: "/events" },
  { name: "Team", href: "/team" },
  { name: "Biodiversity Assessment", href: "/biodiversity-assessment" },
]

type Navbar1Props = {
  isLoggedIn?: boolean
  isLoading?: boolean
  userName?: string
  userEmail?: string
  userAvatar?: string
  onLogout?: () => void
}

const Navbar1 = ({
  isLoggedIn = true,
  isLoading = false,
  userName = "TGA Member",
  userEmail = "member@rvu.edu.in",
  userAvatar =
    "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
  onLogout,
}: Navbar1Props) => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  const getInitials = (name?: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header>
      <nav data-state={menuState && "active"} className="group fixed z-20 w-full px-2">
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 ease-in-out lg:px-12",
            isScrolled &&
              "bg-background/50 max-w-4xl rounded-2xl border border-border/80 shadow-lg shadow-black/5 backdrop-blur-lg lg:px-5"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 transition-all duration-300 ease-in-out lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="m-auto size-6 duration-200 group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background/95 group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-border/80 p-6 shadow-2xl shadow-zinc-300/20 backdrop-blur-xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        onClick={() => setMenuState(false)}
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full items-center justify-end gap-3 md:w-fit">
                {isLoading ? (
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full" disabled>
                    <Avatar size="sm">
                      <AvatarFallback className="animate-pulse bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                ) : isLoggedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar size="sm">
                          <AvatarImage src={userAvatar || undefined} alt={userName || "User"} />
                          <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                            {getInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="flex items-center gap-2 p-2">
                        <Avatar size="sm">
                          <AvatarImage src={userAvatar || undefined} alt={userName || "User"} />
                          <AvatarFallback className="bg-gray-200 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                            {getInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{userName || "User"}</span>
                          <span className="truncate text-xs text-gray-500 dark:text-gray-400">{userEmail}</span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 dark:text-red-400"
                        onClick={onLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                    <Button asChild variant="outline" size="sm" className={cn(isScrolled && "lg:hidden")}>
                      <Link href="/sign-in" onClick={() => setMenuState(false)}>
                        <LogIn className="mr-1 h-4 w-4" />
                        <span>Login</span>
                      </Link>
                    </Button>

                    <Button asChild size="sm" className={cn(isScrolled && "lg:hidden")}>
                      <Link href="/sign-up" onClick={() => setMenuState(false)}>
                        <UserPlus className="mr-1 h-4 w-4" />
                        <span>Sign Up</span>
                      </Link>
                    </Button>

                    <Button asChild size="sm" className={cn(isScrolled ? "lg:inline-flex" : "hidden")}>
                      <Link href="/sign-up" onClick={() => setMenuState(false)}>
                        <span>Get Started</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-9 w-30.5 overflow-hidden rounded-md sm:h-10 sm:w-35">
        <Image
          src="/assets/logo/TGA_Main_Logo.jpeg"
          alt="The Green Alliance"
          fill
          className="object-contain"
          sizes="(max-width: 640px) 122px, 140px"
          priority
        />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-foreground sm:text-base">The Green Alliance</span>
        <span className="text-[11px] text-muted-foreground">RV University</span>
      </div>
    </div>
  )
}

export { Navbar1 }
