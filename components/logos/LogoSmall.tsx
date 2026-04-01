import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'

interface LogoSmallProps {
  iconSet?: string
  iconName?: string
  iconText?: string
  imgSrc?: string
  imgAlt?: string
  className?: string
}

export default function LogoSmall({
  iconSet = 'fas',
  iconName = 'code',
  iconText,
  imgSrc,
  imgAlt,
  className = '',
}: LogoSmallProps) {
  if (imgSrc) {
    return (
      <div className={`flex justify-center h-8 mb-4 ${className}`}>
        <Image
          src={imgSrc}
          alt={imgAlt || ''}
          className="flex-initial max-h-full px-2 self-center"
          width={122}
          height={32}
        />
      </div>
    )
  }

  if (iconText) {
    return (
      <span className={`font-bold font-sans inline-block text-3xl w-5 ${className}`}>
        {iconText}
      </span>
    )
  }

  if (iconSet === 'mfizz') {
    return <span className={`${iconName} inline text-3xl px-1 ${className}`} />
  }

  if (iconSet === 'lansing-codes') {
    return <span className={`${iconName} inline text-3xl px-1 ${className}`} />
  }

  return (
    <FontAwesomeIcon
      icon={[iconSet, iconName] as IconProp}
      fixedWidth
      className={`text-3xl w-5 ${className}`}
    />
  )
}
