"use client"

import { useSyncExternalStore } from "react"

import type { Client } from "@/features/clients/types"

const STORAGE_KEY = "finora.added-clients"
const CHANGE_EVENT = "finora-clients"

const riskProfiles = new Set(["CONSERVATIVE", "MODERATE", "AGGRESSIVE"])
const statuses = new Set(["ACTIVE", "INACTIVE"])

function isClient(value: unknown): value is Client {
  if (!value || typeof value !== "object") return false
  const client = value as Partial<Client>
  return (
    typeof client.id === "string" &&
    typeof client.clientCode === "string" &&
    typeof client.firstName === "string" &&
    typeof client.lastName === "string" &&
    typeof client.email === "string" &&
    typeof client.phone === "string" &&
    typeof client.dateOfBirth === "string" &&
    typeof client.occupation === "string" &&
    typeof client.riskProfile === "string" &&
    riskProfiles.has(client.riskProfile) &&
    typeof client.status === "string" &&
    statuses.has(client.status)
  )
}

export function parseAddedClients(raw: string): Client[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isClient)
  } catch {
    return []
  }
}

export function readAddedClients(): Client[] {
  if (typeof window === "undefined") return []
  return parseAddedClients(sessionStorage.getItem(STORAGE_KEY) ?? "")
}

export function saveAddedClient(client: Client) {
  const next = [...readAddedClients(), client]
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function clearAddedClients() {
  sessionStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange)
  window.addEventListener(CHANGE_EVENT, onStoreChange)
  return () => {
    window.removeEventListener("storage", onStoreChange)
    window.removeEventListener(CHANGE_EVENT, onStoreChange)
  }
}

function getSnapshot() {
  return sessionStorage.getItem(STORAGE_KEY) ?? ""
}

function getServerSnapshot() {
  return ""
}

export function useAddedClientsRaw() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

function emptySubscribe() {
  return () => {}
}

function getHydratedSnapshot() {
  return true
}

function getHydratedServerSnapshot() {
  return false
}

export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    getHydratedSnapshot,
    getHydratedServerSnapshot
  )
}
