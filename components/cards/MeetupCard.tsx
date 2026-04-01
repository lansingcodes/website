import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import LogoMedium from '@/components/logos/LogoMedium'
import type { Group } from '@/lib/firestore/groups'

interface MeetupCardProps {
  group: Group
}

export default function MeetupCard({ group }: MeetupCardProps) {
  return (
    <figure className="grid grid-rows-subgrid row-span-5 text-center font-serif p-4 m-0">
      <a
        href={group.url}
        rel="noreferrer noopener"
        target="_blank"
        className="no-underline text-blue contents"
      >
        <div className="flex items-end justify-center">
          <LogoMedium
            iconSet={group.iconSet}
            iconName={group.iconName}
            iconText={group.iconText}
          />
        </div>
        <h3 className="font-normal text-2xl mb-2 text-blue">{group.name}</h3>
      </a>
      <p className="text-lg text-grey-darker m-0">
        {group.schedule}
      </p>
      <figcaption className="text-grey-darker text-base my-3">
        {group.description}
      </figcaption>
      <div>
        {group.youtube && (
          <a
            href={group.youtube}
            className="block text-blue fill-current no-underline"
            rel="noreferrer noopener"
            target="_blank"
          >
            <FontAwesomeIcon icon={faYoutube} /> YouTube
          </a>
        )}
      </div>
    </figure>
  )
}
