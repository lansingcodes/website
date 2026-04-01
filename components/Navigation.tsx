'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTh, faTimes, faArrowUp, faHome, faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import { faSlack } from '@fortawesome/free-brands-svg-icons'
import { faThumbsUp as farThumbsUp } from '@fortawesome/free-regular-svg-icons'
import urls from '@/config/urls.json'

const links = [
  {
    name: 'To Top',
    href: '#mainContent',
    icon: faArrowUp,
    top: false,
    bottom: true,
  },
  {
    name: 'Home',
    href: '/',
    icon: faHome,
    top: false,
    bottom: true,
  },
  {
    name: 'Slack',
    href: urls.slack,
    icon: faSlack,
    top: true,
    bottom: true,
  },
  {
    name: 'Code of Conduct',
    href: '/code-of-conduct',
    icon: faShieldAlt,
    top: true,
    bottom: true,
  },
  {
    name: 'Contact',
    href: '#contact',
    icon: farThumbsUp,
    top: true,
    bottom: true,
  },
]

const topLinks = links.filter((l) => l.top)
const bottomLinks = links.filter((l) => l.bottom)

export default function Navigation() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow font-heading w-full">
      {/* Desktop nav */}
      <div className="hidden lg:flex items-center justify-between flex-wrap bg-white p-4 border-b border-blue-300 w-full">
        <Link
          href="/"
          className="flex items-center shrink-0 text-blue-dark no-underline hover:text-blue-dark"
        >
          <Image
            className="h-12 mr-2"
            src="/icon-tall-square-fixed-300-transparent.png"
            alt="Lansing Codes Logo"
            width={48}
            height={48}
          />
          <span className="font-bold text-xl uppercase">Lansing Codes</span>
        </Link>
        <div className="block text-base flex-grow text-right font-medium">
          {topLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              className={`inline-block text-blue-dark no-underline uppercase mt-0${index ? ' ml-4' : ''}`}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Mobile menu toggle button */}
      <div className="static block lg:hidden fixed bottom-0 right-0 z-50 p-4">
        <button
          aria-label={open ? 'Close Menu' : 'Open Menu'}
          className="block p-4 rounded-full shadow-lg leading-normal bg-white text-blue border-blue border-2 font-medium focus:outline-none"
          type="button"
          aria-controls="navBarSupportedContentWrapper"
          onClick={() => setOpen(!open)}
        >
          <FontAwesomeIcon
            icon={open ? faTimes : faTh}
            fixedWidth
            className="text-xl text-blue align-middle"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div id="navBarSupportedContentWrapper">
        {open && (
          <div
            id="navBarSupportedContent"
            className="static block lg:hidden fixed bottom-0 left-0 right-0 z-30 p-4 pb-0 border-blue border-t-2 bg-white font-medium"
          >
            <ul className="list-none mr-24 p-0">
              {bottomLinks.map((link) => (
                <li key={link.name} className="text-right">
                  <a
                    href={link.href}
                    className="inline-block no-underline uppercase mb-4 leading-tight"
                    onClick={() => setOpen(false)}
                  >
                    {link.name}{' '}
                    <FontAwesomeIcon icon={link.icon} fixedWidth className="leading-tight" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}
