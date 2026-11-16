import type { Metadata, Viewport } from "next"

import Grainient from "@/components/grainient/Grainient"

import { SignInForm } from "./sign-in-form"

export const metadata: Metadata = {
  title: "Sign in",
}

export const viewport: Viewport = {
  themeColor: "#120f17",
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh w-full flex-1 flex-col overflow-y-auto overscroll-y-contain bg-[#120f17] px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <Grainient
        colors={["#120f17", "#6366f1", "#06b6d4", "#94a3b8"]}
        angle={55}
        flow={0.8}
        silk={0.35}
        grainAmount={0.08}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />
      <div className="relative z-10 mx-auto my-auto w-full max-w-sm">
        <SignInForm />
      </div>
    </main>
  )
}
