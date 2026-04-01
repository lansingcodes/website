import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'

interface LogoMediumProps {
  iconSet?: string
  iconName?: string
  iconText?: string
  imgSrc?: string
  imgAlt?: string
}

export default function LogoMedium({
  iconSet = 'fas',
  iconName = 'code',
  iconText,
  imgSrc,
  imgAlt,
}: LogoMediumProps) {
  if (imgSrc) {
    return (
      <div className="flex justify-center h-24 mb-4">
        <Image
          src={imgSrc}
          alt={imgAlt || ''}
          className="flex-initial max-h-full px-2 self-center"
          width={244}
          height={96}
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>
    )
  }

  if (iconText) {
    return (
      <span className="font-bold font-sans inline-block text-5xl h-24 pt-5">
        {iconText}
      </span>
    )
  }

  if (iconSet === 'mfizz') {
    return (
      <div className="text-6xl h-24 fa fa-3x pt-6">
        <span className={iconName} />
      </div>
    )
  }

  if (iconSet === 'lansing-codes') {
    return (
      <span className={`${iconName} text-6xl h-24 fa fa-4x pt-3`} />
    )
  }

  return (
    <FontAwesomeIcon
      icon={[iconSet, iconName] as IconProp}
      className="text-5xl h-24"
    />
  )
}
