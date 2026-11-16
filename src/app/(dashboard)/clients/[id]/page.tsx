import type { Metadata } from "next"

import { AddedClientProfile } from "@/features/clients/added-client-profile"
import { ClientProfileView } from "@/features/clients/client-profile-view"
import { getClientProfile } from "@/features/clients/queries/get-client-profile"
import { fullName } from "@/lib/format/labels"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const profile = getClientProfile(id)
  return {
    title: profile
      ? fullName(profile.client.firstName, profile.client.lastName)
      : "Client",
  }
}

export default async function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const profile = getClientProfile(id)
  if (!profile) return <AddedClientProfile id={id} />
  return <ClientProfileView profile={profile} />
}
