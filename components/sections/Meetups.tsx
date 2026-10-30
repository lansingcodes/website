import SectionHeading from '@/components/SectionHeading'
import MeetupCard from '@/components/cards/MeetupCard'
import type { Group } from '@/lib/types'

interface MeetupsProps {
  groups: Group[]
}

export default function Meetups({ groups }: MeetupsProps) {
  return (
    <section
      id="meetups"
      className="container mx-auto px-4 md:px-12 mb-16 sm:mb-0"
    >
      <SectionHeading
        blue
        heading="Free Meetups"
        subheading="regular meetups to help you become a better coder"
        className="w-full lg:w-1/2"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
        {groups.map((group) => (
          <MeetupCard key={group.id} group={group} />
        ))}
      </div>
    </section>
  )
}
