import SectionHeading from '@/components/SectionHeading'
import CardFigure from '@/components/cards/CardFigure'
import type { Sponsor } from '@/lib/types'

interface SponsorsProps {
  sponsors: Sponsor[]
}

export default function Sponsors({ sponsors }: SponsorsProps) {
  return (
    <section
      id="sponsors"
      className="container mx-auto flex flex-wrap justify-center px-4 my-16 md:px-12 md:-mt-48"
    >
      <SectionHeading
        blue
        heading="Our Sponsors"
        subheading="the companies that make all this possible!"
        subpage="Become a Sponsor"
        className="md:mb-16 self-end w-full md:w-1/3"
      />
      <div className="hidden md:block md:mb-16 md:w-2/3">
        <picture>
          <source srcSet="/sponsors-feature.webp" type="image/webp" />
          <source srcSet="/sponsors-feature.jpg" type="image/jpeg" />
          <img
            src="/sponsors-feature.jpg"
            alt="Sponsors provide us with space, sustenance, and other resources that help us collaborate"
            className="ml-8 mb-8 block shadow-lg"
            width={736}
            height={394}
          />
        </picture>
      </div>
      {sponsors.map((sponsor) => (
        <CardFigure
          key={sponsor.id}
          heading={sponsor.name}
          url={sponsor.url}
          description={sponsor.description}
          imgSrc={sponsor.logoUrl}
          imgAlt={`${sponsor.name} logo`}
          youtube={sponsor.youtube}
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-2 md:mb-4"
        />
      ))}
    </section>
  )
}
