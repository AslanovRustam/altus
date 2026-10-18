export type TourId = 'kilimanjaro' | 'ararat' | 'kazbek' | 'montblanc' | 'mera' | 'amadablam'
export type Level = 'start' | 'advanced' | 'expedition'

export type Tour = {
  id: TourId
  altitude: number
  days: number
  difficulty: 1 | 2 | 3 | 4 | 5
  priceUsd: number
  level: Level
}

export const TOURS: Tour[] = [
  { id: 'kilimanjaro', altitude: 5895, days: 9, difficulty: 2, priceUsd: 3450, level: 'start' },
  { id: 'ararat', altitude: 5137, days: 7, difficulty: 2, priceUsd: 1290, level: 'start' },
  { id: 'kazbek', altitude: 5033, days: 9, difficulty: 3, priceUsd: 1190, level: 'advanced' },
  { id: 'montblanc', altitude: 4808, days: 7, difficulty: 3, priceUsd: 2750, level: 'advanced' },
  { id: 'mera', altitude: 6476, days: 18, difficulty: 4, priceUsd: 4600, level: 'expedition' },
  { id: 'amadablam', altitude: 6812, days: 26, difficulty: 5, priceUsd: 8900, level: 'expedition' },
]

export const STATS = [
  { value: 14, suffix: '' },
  { value: 2300, suffix: '+' },
  { value: 94, suffix: '%' },
  { value: 11, suffix: '' },
]

export const CONTACTS = {
  phone: '+38 063 999 37 77',
  phoneHref: 'tel:+380639993777',
  email: 'office@clickable.agency',
}
