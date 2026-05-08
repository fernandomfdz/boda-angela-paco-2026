export interface Guest {
  slug: string
  displayName: string
  names: string[]
  greeting: string
  message: string
  allowedGuests: number
  tableNumber: number | null
}
