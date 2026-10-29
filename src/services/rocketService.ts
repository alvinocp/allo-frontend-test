export interface Rocket {
  id: number | string
  name: string
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: {
    name: string
    country_code: string | null
  } | null
}

export interface RocketListResponse {
  results: Rocket[]
}

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher/'

export async function getRockets(): Promise<RocketListResponse> {
  const response = await fetch(
    `${BASE_URL}?manufacturer__name=SpaceX&mode=detailed&limit=20`,
  )

  if (!response.ok) {
    throw new Error('Gagal mengambil daftar roket.')
  }

  return response.json() as Promise<RocketListResponse>
}

export async function getRocketById(id: number | string): Promise<Rocket> {
  const response = await fetch(`${BASE_URL}${id}/`)

  if (!response.ok) {
    throw new Error('Gagal mengambil detail roket.')
  }

  return response.json() as Promise<Rocket>
}
