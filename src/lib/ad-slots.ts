/**
 * Billboard ad locations on the site. Prices are per week, in CAD.
 * `capacity` is how many advertisers rotate in the same location.
 */
export interface AdSlot {
  id: string
  name: string
  where: string            // plain-English location, shown to advertisers
  description: string
  weeklyCents: number
  capacity: number
  size: 'banner' | 'sidebar' | 'card'
}

export const AD_SLOTS: AdSlot[] = [
  {
    id: 'home-hero',
    name: 'Homepage Hero Banner',
    where: 'Top of the homepage, seen by every visitor who lands on the site',
    description: 'The most prominent spot on the site. Full-width banner rotated with up to 4 advertisers.',
    weeklyCents: 49900,
    capacity: 4,
    size: 'banner',
  },
  {
    id: 'directory-top',
    name: 'Directory Featured Spot',
    where: 'Top of the franchise directory, where buyers browse and compare',
    description: 'Shown to buyers while they search and filter the full directory.',
    weeklyCents: 24900,
    capacity: 4,
    size: 'banner',
  },
  {
    id: 'listing-sidebar',
    name: 'Listing Page Sidebar',
    where: 'Side panel on every franchise profile page',
    description: 'Appears next to a franchise profile, when a buyer is most interested in that category.',
    weeklyCents: 9900,
    capacity: 6,
    size: 'sidebar',
  },
  {
    id: 'insights-sidebar',
    name: 'Insights Article Sidebar',
    where: 'Side panel on franchise insight and buyer-guide articles',
    description: 'Reaches readers researching franchises before they choose a brand.',
    weeklyCents: 7900,
    capacity: 6,
    size: 'sidebar',
  },
]

export function getAdSlot(id: string): AdSlot | undefined {
  return AD_SLOTS.find((s) => s.id === id)
}

/** Monthly visitors shown to advertisers. Set NEXT_PUBLIC_MONTHLY_VISITORS to your latest analytics figure. */
export function monthlyVisitors(): number {
  return Number(process.env.NEXT_PUBLIC_MONTHLY_VISITORS ?? 15000)
}

export function formatCad(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-CA', { maximumFractionDigits: 0 })}`
}
