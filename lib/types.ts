export interface Group {
  id: string
  name: string
  description: string
  iconSet?: string
  iconName?: string
  iconText?: string
  url: string
  schedule?: string
  slug?: string
  youtube?: string
}

export interface Sponsor {
  id: string
  name: string
  description: string
  logoUrl: string
  url: string
  youtube?: string
}

export interface Event {
  id: string
  group: string
  name: string
  description: string
  url: string
  startTime: number
  venue: string
  address: string
}
