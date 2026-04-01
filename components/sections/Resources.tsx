import SectionHeading from '@/components/SectionHeading'
import { resources } from '@/config/resources'

export default function Resources() {
  return (
    <section id="resources">
      <div className="lc-bg-rtl-gradient lc-bg-upright-trapezoid bg-white h-40">
        <div className="container mx-auto flex sm:justify-end flex-nowrap content-center">
          <SectionHeading
            white
            heading="Beginner Resources"
            subheading="where to start if you're new to coding"
            className="w-full sm:w-2/5 mb-0 mt-10 mx-auto sm:mx-0"
          />
        </div>
      </div>
      <div className="lc-bg-rtl-gradient">
        <div className="container mx-auto flex flex-wrap content-center justify-around pt-0 sm:pt-16 pb-16">
          {resources.map((resource) => (
            <div
              key={resource.title}
              className="font-serif w-full max-w-sm px-4 my-6 md:w-1/2"
            >
              <h3 className="text-2xl font-sans font-normal mb-2">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="no-underline !text-white hover:underline hover:!text-white"
                >
                  {resource.title}
                </a>
              </h3>
              <div className="text-white">{resource.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden sm:block lc-bg-downright-trapezoid bg-white h-32" />
    </section>
  )
}
