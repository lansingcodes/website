'use client'

import { useState } from 'react'
import PageHeading from '@/components/PageHeading'

export default function SponsorsSignup() {
  const [showDescription, setShowDescription] = useState('hidden-1')
  const [showContact, setShowContact] = useState('invoice-no')

  return (
    <article className="lc-code-of-conduct">
      <PageHeading heading="Become a Sponsor" subheading="Help our community grow!" />
      <section className="p-6 md:px-5 mb-16 max-w-xl mx-auto">
        <div>
          <h2 className="mb-2">Information About Sponsoring</h2>
          <div className="p-3">
            It costs money to maintain a thriving tech community: hosting costs,
            meetup fees, promotional material, equipment, food and drinks, etc.
            We&apos;re open to a variety of contributions to make supporting our
            events easy for you: one-time cash contributions, recurring cash
            contributions, event hosting, food and drinks. In return, we&apos;ll
            promote you or your organization on the Lansing Codes website, on
            relevant event pages, and give you a shout-out at the event.
          </div>
        </div>
        <div className="p-8 bg-blue block shadow-lg w-full rounded">
          <form action="https://formspree.io/f/xayagvjo" method="POST">
            <div className="flex flex-col sm:flex-row gap-4 m-2">
              <div className="flex-1">
                <label htmlFor="organization-name" className="text-white block mb-1">
                  Organization Name
                </label>
                <input
                  id="organization-name"
                  name="organization-name"
                  type="text"
                  required
                  className="rounded px-3 py-1 w-full"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="organization-website" className="text-white block mb-1">
                  Organization Website
                </label>
                <input
                  id="organization-website"
                  name="organization-website"
                  type="url"
                  className="rounded px-3 py-1 w-full"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 m-2">
              <div className="flex-1">
                <label htmlFor="contact-name" className="text-white block mb-1">
                  Contact Name
                </label>
                <input id="contact-name" name="contact-name" type="text" required className="rounded px-3 py-1 w-full" />
              </div>
              <div className="flex-1">
                <label htmlFor="contact-email" className="text-white block mb-1">
                  Contact Email
                </label>
                <input id="contact-email" name="contact-email" type="email" required className="rounded px-3 py-1 w-full" />
              </div>
            </div>
            <div className="form-row m-2">
              <div className="text-white">How would you like to contribute?</div>
              <div className="form-row m-2">
                {[
                  { id: 'monthly-lansing-codes', label: 'Monthly Contribution to Lansing Codes', extra: null },
                  { id: 'one-time-lansing-codes', label: 'One-time contribution to Lansing Codes', extra: null },
                  {
                    id: 'monthly-specific-group',
                    label: 'Monthly contribution to a particular group (specify event)',
                    extra: { id: 'monthly-specific-group-group', name: 'monthly-specific-group-group', max: 30 },
                  },
                  {
                    id: 'one-time-specific-group',
                    label: 'One-time contribution to a particular group (specify event)',
                    extra: { id: 'one-time-specific-group-group', name: 'one-time-specific-group-group', max: undefined },
                  },
                  {
                    id: 'host-event',
                    label: 'Host an event (offer space, A/V equipment, and drinks) (specify event)',
                    extra: { id: 'host-event-event', name: 'host-event-event', max: undefined },
                  },
                  {
                    id: 'provide-event',
                    label: 'Provide food and drink for an event (specify event)',
                    extra: { id: 'provide-event-event', name: 'provide-event-event', max: undefined },
                  },
                  {
                    id: 'contribute-other',
                    label: 'Other (please specify)',
                    extra: { id: 'contribute-other-description', name: 'contribute-other-description', max: undefined },
                  },
                ].map(({ id, label, extra }) => (
                  <div key={id} className="m-1">
                    <input
                      id={id}
                      value={id}
                      checked={showDescription === id}
                      onChange={(e) => setShowDescription(e.target.value)}
                      type="radio"
                      name="contribute-options"
                    />
                    <label htmlFor={id} className="text-white ml-1">
                      {label}
                    </label>
                    {extra && showDescription === id && (
                      <input
                        id={extra.id}
                        name={extra.name}
                        type="text"
                        className="rounded px-10 ml-2"
                        maxLength={extra.max}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="form-row m-2">
              <div className="text-white">Would you like to receive an invoice?</div>
              <div className="form-row m-2">
                <div className="m-1">
                  <input
                    id="invoice-yes"
                    value="invoice-yes"
                    checked={showContact === 'invoice-yes'}
                    onChange={(e) => setShowContact(e.target.value)}
                    type="radio"
                    name="invoice-options"
                  />
                  <label htmlFor="invoice-yes" className="text-white ml-1">
                    Yes
                  </label>
                  {showContact === 'invoice-yes' && (
                    <>
                      <label htmlFor="invoice-contact-name" className="m-1 p-3 text-white">
                        Contact Name
                      </label>
                      <input
                        id="invoice-contact-name"
                        name="invoice-contact-name"
                        type="text"
                        className="rounded px-10"
                      />
                      <label htmlFor="invoice-contact-email" className="m-1 p-3 text-white">
                        Contact email
                      </label>
                      <input
                        id="invoice-contact-email"
                        name="contact-email"
                        type="email"
                        className="rounded px-10"
                      />
                    </>
                  )}
                </div>
                <div className="m-1">
                  <input
                    id="invoice-no"
                    value="invoice-no"
                    checked={showContact === 'invoice-no'}
                    onChange={(e) => setShowContact(e.target.value)}
                    type="radio"
                    name="invoice-options"
                  />
                  <label htmlFor="invoice-no" className="text-white ml-1">
                    No
                  </label>
                  <div className="m-1 pl-3 text-white">
                    Send contributions via{' '}
                    <a
                      href="https://www.paypal.com/ncp/payment/V7UNAG9J544R2"
                      target="_blank"
                      className="text-grey-light no-underline"
                    >
                      PayPal
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button
                className="outline-none bg-white border border-blue rounded text-blue p-4 mt-3 uppercase font-bold text-sm hover:text-blue-800 focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Signup
              </button>
            </div>
          </form>
        </div>
      </section>
    </article>
  )
}
