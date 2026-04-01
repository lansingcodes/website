interface PageHeadingProps {
  heading: string
  subheading?: string
}

export default function PageHeading({ heading, subheading = '' }: PageHeadingProps) {
  return (
    <header>
      <div className="py-16 lg:pt-32 lc-bg-ltr-gradient bg-transparent">
        <h1 className="uppercase text-center text-white">
          <span className="text-5xl">{heading}</span>
          <hr className="border-white border-4 my-6 w-16 mx-auto" />
          <span className="block text-4xl">{subheading}</span>
        </h1>
      </div>
      <div className="lc-bg-down-triangle bg-white h-32 -mt-16" />
    </header>
  )
}
