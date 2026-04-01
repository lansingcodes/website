import Link from 'next/link'
import PageHeading from '@/components/PageHeading'

export default function NotFound() {
  return (
    <article>
      <PageHeading heading="Page Not Found" subheading="404" />
      <section className="p-6 md:px-5 mb-16 max-w-xl mx-auto text-center">
        <p className="text-grey-darker text-lg mb-6">
          Sorry, we couldn&apos;t find the page you were looking for.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue no-underline text-white font-bold uppercase text-center py-4 px-8 rounded-full hover:bg-blue-dark"
        >
          Back to Home
        </Link>
      </section>
    </article>
  )
}
