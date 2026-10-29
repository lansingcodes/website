import { sponsorSignupEnabled } from './config'

export const metadata = {
  title: sponsorSignupEnabled ? 'Become a Sponsor — Lansing Codes' : 'Page unavailable — Lansing Codes',
}

export default function SponsorsSignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
