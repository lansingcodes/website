import { notFound } from 'next/navigation'
import SponsorSignupForm from './SponsorSignupForm'
import { sponsorSignupEnabled } from './config'

export default function SponsorsSignupPage() {
  if (!sponsorSignupEnabled) notFound()

  return <SponsorSignupForm />
}
