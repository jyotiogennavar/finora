"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconBell, IconSearch } from "@tabler/icons-react"

import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs"
import { getBreadcrumbs } from "@/config/navigation"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { useWorkspaceSettings } from "@/features/settings/workspace-settings"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AppHeader() {
  const [searchOpen, setSearchOpen] = useState(false)
  const modifierKey = useModifierKey()
  const pathname = usePathname()
  const profile = useWorkspaceSettings().profile
  const showBreadcrumbs = getBreadcrumbs(pathname).length > 1

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k") return
      if (!event.metaKey && !event.ctrlKey) return
      event.preventDefault()
      setSearchOpen((open) => !open)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-20 border-b bg-background pt-[env(safe-area-inset-top)]">
      <div className="flex h-12 items-center gap-2 px-3 md:px-4">
        <SidebarTrigger className="relative -ml-1 before:absolute before:-inset-1.5 before:content-['']" />
        {showBreadcrumbs ? (
          <>
            <Separator
              orientation="vertical"
              className="mr-1 h-4! self-center!"
            />
            <div className="min-w-0 flex-1">
              <AppBreadcrumbs />
            </div>
          </>
        ) : (
          <div className="min-w-0 flex-1" />
        )}
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="outline"
            className="hidden h-8 w-64 justify-between px-2.5 font-normal text-muted-foreground md:inline-flex"
            aria-label="Search"
            aria-keyshortcuts="Control+K Meta+K"
            onClick={() => setSearchOpen(true)}
          >
            <span className="flex items-center gap-2">
              <IconSearch />
              Search
            </span>
            <kbd className="rounded-md border bg-muted px-1.5 py-px font-sans text-[11px] font-medium text-muted-foreground">
              {modifierKey} K
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Search"
            aria-keyshortcuts="Control+K Meta+K"
            onClick={() => setSearchOpen(true)}
          >
            <IconSearch />
          </Button>
          <ThemeToggle />
          <Popover>
            <PopoverTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Notifications" />
              }
            >
              <IconBell />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 gap-0 p-0">
              <PopoverHeader className="border-b px-3 py-2.5">
                <PopoverTitle>Notifications</PopoverTitle>
              </PopoverHeader>
              <PopoverDescription className="px-3 py-8 text-center">
                You’re all caught up.
              </PopoverDescription>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="h-8 gap-2 px-1.5"
                  aria-label="Account menu"
                />
              }
            >
              <Avatar size="sm">
                <AvatarFallback>{profileInitials(profile.name)}</AvatarFallback>
              </Avatar>
              <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
                {profile.name}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-1.5 py-1.5">
                <p className="truncate text-sm font-medium text-foreground">
                  {profile.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {profile.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/settings" />}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <p className="px-1.5 py-1.5 text-xs text-muted-foreground">
                Sign-in is not connected yet.
              </p>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {searchOpen ? (
        <CommandDialog
          open
          onOpenChange={setSearchOpen}
          title="Search"
          description="Search across clients, portfolios, and transactions is not available yet."
          className="sm:max-w-lg"
        >
          <Command>
            <CommandInput
              placeholder="Search clients, portfolios, transactions…"
              className="text-base md:text-sm"
            />
            <CommandList>
              <CommandEmpty>
                Search across clients, portfolios, and transactions is not
                available yet.
              </CommandEmpty>
            </CommandList>
          </Command>
        </CommandDialog>
      ) : null}
    </header>
  )
}

function profileInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "A"
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
}

function useModifierKey() {
  return useSyncExternalStore(subscribeModifierKey, getModifierKey, () => "Ctrl")
}

function subscribeModifierKey() {
  return () => {}
}

function getModifierKey() {
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string }
  }
  const platform = nav.userAgentData?.platform ?? navigator.platform
  return /mac/i.test(platform) ? "⌘" : "Ctrl"
}
