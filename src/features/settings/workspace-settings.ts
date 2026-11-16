"use client"

import { useState, useSyncExternalStore } from "react"

import type { TimeRange } from "@/components/charts/time-range-selector"

const STORAGE_KEY = "finora.settings"
const CHANGE_EVENT = "finora-settings"

export type AdvisorProfile = {
  name: string
  email: string
  phone: string
  firm: string
  registration: string
  city: string
}

export type WorkspaceSettings = {
  profile: AdvisorProfile
  chartRange: TimeRange
  benchmarkId: string
  compactMoney: boolean
  reviewReminder: boolean
}

export const defaultAdvisorProfile: AdvisorProfile = {
  name: "Advisor",
  email: "advisor@finora.app",
  phone: "",
  firm: "Finora",
  registration: "",
  city: "",
}

export const defaultWorkspaceSettings: WorkspaceSettings = {
  profile: defaultAdvisorProfile,
  chartRange: "1Y",
  benchmarkId: "BMK001",
  compactMoney: false,
  reviewReminder: false,
}

const chartRanges = new Set<TimeRange>(["1M", "3M", "6M", "1Y"])

function clip(value: unknown, max: number) {
  if (typeof value !== "string") return ""
  const trimmed = value.trim()
  if (trimmed.length > max) return ""
  return trimmed
}

function parseProfile(value: unknown): AdvisorProfile {
  if (!value || typeof value !== "object") return defaultAdvisorProfile
  const profile = value as Partial<AdvisorProfile>
  const name = clip(profile.name, 80)
  const email = clip(profile.email, 120)
  const firm = clip(profile.firm, 80)
  return {
    name: name || defaultAdvisorProfile.name,
    email: email || defaultAdvisorProfile.email,
    phone: clip(profile.phone, 20),
    firm: firm || defaultAdvisorProfile.firm,
    registration: clip(profile.registration, 40),
    city: clip(profile.city, 60),
  }
}

export function parseWorkspaceSettings(raw: string): WorkspaceSettings {
  if (!raw) return defaultWorkspaceSettings
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") return defaultWorkspaceSettings
    const value = parsed as Partial<WorkspaceSettings>
    const chartRange = chartRanges.has(value.chartRange as TimeRange)
      ? (value.chartRange as TimeRange)
      : defaultWorkspaceSettings.chartRange
    const benchmarkId =
      typeof value.benchmarkId === "string" && /^BMK\d{3}$/.test(value.benchmarkId)
        ? value.benchmarkId
        : defaultWorkspaceSettings.benchmarkId

    return {
      profile: parseProfile(value.profile),
      chartRange,
      benchmarkId,
      compactMoney: value.compactMoney === true,
      reviewReminder: value.reviewReminder === true,
    }
  } catch {
    return defaultWorkspaceSettings
  }
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
  return localStorage.getItem(STORAGE_KEY) ?? ""
}

function getServerSnapshot() {
  return ""
}

export function useWorkspaceSettings() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return parseWorkspaceSettings(raw)
}

export function useChartRange() {
  const { chartRange } = useWorkspaceSettings()
  const [override, setOverride] = useState<TimeRange | null>(null)
  return [override ?? chartRange, setOverride] as const
}

function writeSettings(settings: WorkspaceSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function updateWorkspaceSettings(patch: Partial<WorkspaceSettings>) {
  const current = parseWorkspaceSettings(localStorage.getItem(STORAGE_KEY) ?? "")
  writeSettings({ ...current, ...patch })
}

export function clearWorkspaceSettings() {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event(CHANGE_EVENT))
}
