import type { Rocket } from './rocketService'

export type LocalRocket = Rocket & {
  created_at: string
}

const STORAGE_KEY = 'spacex-local-rockets'

export function getLocalRockets(): LocalRocket[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) return []

    const rockets = JSON.parse(saved) as LocalRocket[]

    return rockets.sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime(),
    )
  } catch {
    return []
  }
}

export function saveLocalRocket(rocket: LocalRocket) {
  const rockets = getLocalRockets()
  rockets.push(rocket)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(rockets))
}