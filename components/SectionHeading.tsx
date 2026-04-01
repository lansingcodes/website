interface SectionHeadingProps {
  id?: string
  heading: string
  subheading?: string
  subpage?: string
  h1?: boolean
  white?: boolean
  blue?: boolean
  className?: string
}

export default function SectionHeading({
  id,
  heading,
  subheading,
  subpage,
  h1 = false,
  white = false,
  blue = false,
  className = '',
}: SectionHeadingProps) {
  const headingColor = white
    ? 'text-white'
    : blue
    ? 'text-blue'
    : 'text-gray-700'
  const hrColor = white
    ? 'border-white'
    : blue
    ? 'border-blue'
    : 'border-gray-700'

  const HeadingTag = h1 ? 'h1' : 'h2'

  return (
    <header id={id} className={`p-2 justify-center text-center ${className}`}>
      <HeadingTag className={`uppercase text-3xl mb-1 ${headingColor}`}>
        {heading}
      </HeadingTag>
      {subheading && (
        <p className={`mt-0 ${white ? 'text-white' : ''}`}>{subheading}</p>
      )}
      <hr className={`border-4 my-6 w-16 mx-auto ${hrColor}`} />
      {subpage && (
        <h2 className={`text-2xl ${headingColor}`}>
          <a href="/sponsors-signup" className="no-underline">
            {subpage}
          </a>
        </h2>
      )}
    </header>
  )
}
