import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faUserFriends, faSchool, faHandHoldingHeart, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faSlack } from '@fortawesome/free-brands-svg-icons'
import SectionHeading from '@/components/SectionHeading'
import LogoSmall from '@/components/logos/LogoSmall'
import { formatReadableDateTime } from '@/lib/utils/formatDateTime'
import { cleanEventDescription } from '@/lib/utils/cleanEventDescription'
import { boldMarkdownToHtml } from '@/lib/utils/boldMarkdownToHtml'
import { groupForEvent } from '@/lib/utils/groupForEvent'
import urls from '@/config/urls.json'
import type { Event, Group } from '@/lib/types'

interface WelcomeProps {
  now: number
  events: Event[]
  groups: Group[]
}

const links = [
  { name: 'Slack', href: urls.slack, icon: faSlack },
  { name: 'Events', href: '#events', icon: faCalendarAlt },
  { name: 'Groups', href: '#meetups', icon: faUserFriends },
  { name: 'Resources', href: '#resources', icon: faSchool },
  { name: 'Sponsors', href: '#sponsors', icon: faHandHoldingHeart },
  { name: 'Newsletter', href: '#newsletter', icon: faEnvelope },
]

export default function Welcome({ events, groups, now }: WelcomeProps) {
  const nextEvent = events.find((e) => e && e.startTime > now) || null
  const nextGroup = nextEvent ? groupForEvent(nextEvent, groups) : null

  return (
    <div id="welcome" className="lc-background-image py-16 sm:py-24">
      <div className="flex flex-wrap justify-center">
        {/* Left card */}
        <nav className="flex-none w-full sm:w-1/2 sm:max-w-md overflow-hidden sm:shadow-lg bg-white text-center py-8 px-6 sm:mb-24">
          <Image
            className="h-32 w-32 mx-auto"
            src="/icon-tall-square-fixed-300-transparent.png"
            alt="Lansing Codes Logo"
            width={128}
            height={128}
          />
          <SectionHeading
            h1
            blue
            heading="Lansing Codes"
            subheading="events and resources for Lansing coders"
          />
          <ul className="flex flex-wrap justify-center list-none mt-0 mb-4 font-medium">
            {links.map((link) => (
              <li key={link.name} className="w-1/2">
                <a
                  href={link.href}
                  className="inline-block no-underline uppercase mb-4 leading-tight"
                >
                  <FontAwesomeIcon icon={link.icon} fixedWidth className="leading-tight mr-1" />
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right card — Next Event */}
        <section className="hidden sm:block sm:w-1/2 max-w-md overflow-hidden shadow-lg bg-blue-dark text-white p-8 sm:mt-24 sm:-ml-4">
          <SectionHeading white heading="Next Event" />
          {nextEvent ? (
            <div className="text-left font-normal">
              <div className="flex flex-nowrap items-center mb-2 min-h-12">
                {nextGroup && (
                  <LogoSmall
                    iconSet={nextGroup.iconSet}
                    iconName={nextGroup.iconName}
                    iconText={nextGroup.iconText}
                    className="mr-3"
                  />
                )}
                <h3 className="font-bold">{nextEvent.name}</h3>
              </div>
              <p className="flex flex-wrap justify-between text-sm mb-4 mt-0">
                <span className="mb-1 mr-2">
                  {formatReadableDateTime(nextEvent.startTime)}
                </span>
                {nextEvent.venue && <span>{nextEvent.venue}</span>}
              </p>
              <p
                className="lc-event-description mb-6"
                dangerouslySetInnerHTML={{
                  __html: boldMarkdownToHtml(
                    cleanEventDescription(nextEvent.description || ''),
                  ),
                }}
              />
              <div className="text-center">
                <a
                  href={nextEvent.url}
                  className="inline-block bg-white no-underline text-blue font-bold uppercase text-center py-4 mt-2 px-8 min-w-24 rounded-full hover:bg-blue-lighter"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Learn More and RSVP
                </a>
              </div>
            </div>
          ) : (
            <div className="text-left font-normal">
              <div className="flex flex-nowrap items-center mb-2 min-h-12">
                <LogoSmall iconSet="far" iconName="grin-beam-sweat" className="mr-3" />
                <h3 className="font-bold">Well, this is awkward!</h3>
              </div>
              <div className="lc-event-description my-6 leading-tight">
                <p>
                  There don&apos;t appear to be any upcoming events on the
                  calendar for the next few weeks. It may be a slow time of the
                  year or it could be a mistake.
                </p>
                <p>
                  Check back in a few days or ask about it in Slack and we&apos;ll
                  get this cleared up for you soon.
                </p>
                <p>Sorry we couldn&apos;t help you find what you&apos;re looking for!</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
