import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import LogoMedium from '@/components/logos/LogoMedium'

interface CardFigureProps {
  url?: string
  heading?: string
  subheading?: string
  description?: string
  iconSet?: string
  iconName?: string
  iconText?: string
  imgSrc?: string
  imgAlt?: string
  youtube?: string
  className?: string
}

export default function CardFigure({
  url = 'javascript:void(0)',
  heading = 'Tech Demo Night',
  subheading = '',
  description = '',
  iconSet = 'fas',
  iconName = 'code',
  iconText,
  imgSrc,
  imgAlt,
  youtube,
  className = '',
}: CardFigureProps) {
  return (
    <figure
      className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-2 md:mb-4 text-center font-serif p-4 ${className}`}
    >
      <a
        href={url}
        rel="noreferrer noopener"
        target="_blank"
        className="no-underline text-blue"
      >
        <LogoMedium
          iconSet={iconSet}
          iconName={iconName}
          iconText={iconText}
          imgSrc={imgSrc}
          imgAlt={imgAlt}
        />
        <h3 className="font-normal text-2xl mb-2">{heading}</h3>
      </a>
      {subheading && (
        <p className="text-lg text-grey-darker">{subheading}</p>
      )}
      <figcaption className="text-grey-darker text-base my-3">
        {description}
      </figcaption>
      {youtube && (
        <a
          href={youtube}
          className="block text-blue fill-current no-underline"
          rel="noreferrer noopener"
          target="_blank"
        >
          <FontAwesomeIcon icon={faYoutube} /> YouTube
        </a>
      )}
    </figure>
  )
}
