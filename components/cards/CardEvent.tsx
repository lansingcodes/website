import LogoSmall from '@/components/logos/LogoSmall'
import { formatReadableDateTime } from '@/lib/utils/formatDateTime'
import { cleanEventDescription } from '@/lib/utils/cleanEventDescription'
import type { Event, Group } from '@/lib/types'

interface CardEventProps {
  event: Event
  group?: Group | null
}

export default function CardEvent({ event, group }: CardEventProps) {
  const venue = event.venue || null
  const address = event.address || null
  const safeDescription = cleanEventDescription(event.description || '')

  return (
    <article className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-8 md:mx-4 h-full max-w-xs bg-white shadow-md">
      <header className="overflow-hidden relative bg-blue-800 text-white p-4 shadow">
        <div className="flex flex-nowrap items-center font-normal mb-2 min-h-12">
          {group && (
            <LogoSmall
              iconSet={group.iconSet}
              iconName={group.iconName}
              iconText={group.iconText}
            />
          )}
          <h3 className="text-white m-0 ml-3">
            <a
              href={event.url}
              rel="noreferrer noopener"
              target="_blank"
              className="text-white no-underline hover:text-white hover:underline focus:text-white focus:underline focus:bg-transparent"
            >
              {event.name}
            </a>
          </h3>
        </div>
        {group && (
          <section className="text-sm mb-1 truncate">{group.name}</section>
        )}
        <section className="text-sm">
          {formatReadableDateTime(event.startTime)}
        </section>
      </header>

      <div className="max-h-50 overflow-y-hidden overflow-x-hidden bg-white shadow">
        <div className="m-4 overflow-x-hidden overflow-y-hidden">
          {venue && (
            <div className="mb-2 overflow-x-hidden">
              <p className="font-bold mb-1">{venue}</p>
              {address && (
                <address className="text-gray-700 not-italic">{address}</address>
              )}
            </div>
          )}
          <p className="bg-transparent overflow-x-hidden overflow-y-hidden">
            {safeDescription}
          </p>
        </div>
      </div>
    </article>
  )
}
