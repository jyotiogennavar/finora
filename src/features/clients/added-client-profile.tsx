"use client"

import Link from "next/link"

import { EmptyState } from "@/components/data/empty-state"
import { Button } from "@/components/ui/button"
import {
  parseAddedClients,
  useAddedClientsRaw,
  useHydrated,
} from "@/features/clients/added-clients"
import { ClientProfileView } from "@/features/clients/client-profile-view"
import { profileFromAddedClient } from "@/features/clients/queries/get-client-profile"

export function AddedClientProfile({ id }: { id: string }) {
  const hydrated = useHydrated()
  const raw = useAddedClientsRaw()

  if (!hydrated) return null

  const client = parseAddedClients(raw).find((item) => item.id === id)

  if (!client) {
    return (
      <EmptyState
        title="This client isn't on the book"
        description="The link may be out of date, or the client was added in another tab."
        action={
          <Button variant="outline" render={<Link href="/clients" />}>
            All clients
          </Button>
        }
      />
    )
  }

  return <ClientProfileView profile={profileFromAddedClient(client)} />
}
