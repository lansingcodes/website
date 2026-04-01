import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'

interface LogoExtraSmallProps {
  iconSet?: string
  iconName?: string
  iconText?: string
  imgSrc?: string
  imgAlt?: string
}

export default function LogoExtraSmall({
  iconSet = 'fas',
  iconName = 'code',
  iconText,
  imgSrc,
  imgAlt,
}: LogoExtraSmallProps) {
  if (imgSrc) {
    return (
      <div className="flex justify-center h-8 mb-4">
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
      <span className="font-bold font-sans inline-block text-base w-5">
        {iconText}
      </span>
    )
  }

  if (iconSet === 'mfizz') {
    return <span className={`${iconName} inline text-base px-1`} />
  }

  if (iconSet === 'lansing-codes') {
    return <span className={`${iconName} inline text-base px-1`} />
  }

  return (
    <FontAwesomeIcon
      icon={[iconSet, iconName] as IconProp}
      fixedWidth
      className="text-base w-5"
    />
  )
}
