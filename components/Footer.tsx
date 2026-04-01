import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faSlack, faGithub, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons'
import SectionHeading from '@/components/SectionHeading'
import urls from '@/config/urls.json'

const links = [
  { name: 'Slack', href: urls.slack, icon: faSlack },
  { name: 'GitHub', href: urls.github, icon: faGithub },
  { name: 'Email', href: urls.email, icon: faEnvelope },
  { name: 'Facebook', href: urls.facebook, icon: faFacebook },
  { name: 'Twitter', href: urls.twitter, icon: faTwitter },
]

export default function Footer() {
  return (
    <footer id="contact" className="bg-black py-12 flex flex-wrap justify-center">
      <SectionHeading
        id="contactUs"
        white
        heading="Contact Us"
        subheading="know an event or resource we're missing? let us know or follow us"
        className="w-full"
      />
      <nav className="flex justify-center my-8" aria-labelledby="contactUs">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            title={link.name}
            aria-label={link.name}
            className="inline-block mx-2 md:mx-4"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon
              icon={link.icon}
              className="text-5xl text-blue fill-current hover:text-blue-300"
            />
          </a>
        ))}
      </nav>
    </footer>
  )
}
