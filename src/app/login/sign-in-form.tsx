"use client"

import { useEffect, useRef, useState } from "react"
import { IconEye, IconEyeOff } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"

export function SignInForm() {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches
    if (finePointer) emailRef.current?.focus()
  }, [])

  return (
    <Card className="w-full shadow-[0_1px_1px_rgb(0_0_0/0.05),0_12px_28px_rgb(18_15_23/0.18),0_32px_64px_rgb(18_15_23/0.24)] [--card-spacing:--spacing(6)]">
      <CardHeader className="gap-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground">
            F
          </span>
          <span className="text-sm font-medium">Finora</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="font-heading text-2xl font-medium tracking-tight text-balance">
            Sign in
          </h1>
          <p className="text-sm text-pretty text-muted-foreground">
            Use the account your firm issued.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
              placeholder="name@firm.com"
              className="h-11 text-base md:text-base"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <InputGroup className="h-11">
              <InputGroupInput
                ref={passwordRef}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                spellCheck={false}
                required
                className="h-11 text-base md:text-base"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-sm"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="size-9"
                  onClick={() => {
                    setShowPassword((current) => !current)
                    passwordRef.current?.focus()
                  }}
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-h-11 items-center gap-2.5">
              <Checkbox id="remember" name="remember" />
              <Label htmlFor="remember" className="cursor-pointer font-normal">
                Remember me
              </Label>
            </div>
            <button
              type="button"
              className="min-h-11 shrink-0 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password
            </button>
          </div>
          <Button type="submit" className="h-11 w-full text-base">
            Sign in
          </Button>
          <p className="text-center text-xs leading-5 text-muted-foreground">
            Accounts are issued by your firm.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
