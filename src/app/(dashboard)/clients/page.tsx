import type { Metadata } from "next"

import { ClientDirectory } from "@/features/clients/client-directory"
import { getClientDirectory } from "@/features/clients/queries/get-client-directory"

export const metadata: Metadata = {
  title: "Clients",
}

export default function ClientsPage() {
  return <ClientDirectory rows={getClientDirectory()} />
}
