'use client'

import { useState } from 'react'
import SectionHeading from '@/components/SectionHeading'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!email.trim()) {
      setMessage('Please enter your email address.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Something went wrong.')
      } else {
        setSubscribed(true)
        setMessage(data.message || 'Successfully subscribed!')
      }
    } catch {
      setMessage('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="newsletter" className="lc-newsletter-bg bg-blue px-4 py-20">
      <SectionHeading
        white
        heading="Stay Informed"
        subheading="sign up for our newsletter so you never miss out"
        className="w-full"
      />
      {!subscribed ? (
        <form noValidate onSubmit={subscribe}>
          <div className="text-center mt-4">
            <input
              id="EMAIL"
              name="EMAIL"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="outline-none focus:shadow-outline bg-white border-grey-dark rounded-full p-4 w-3/4 md:max-w-sm text-sm"
              placeholder="Email address"
              aria-label="Email address"
            />
            <button
              className="outline-none focus-visible:ring-2 focus-visible:ring-white bg-white border border-white rounded-full text-blue py-4 w-28 -ml-16 uppercase font-bold text-sm transition-colors hover:bg-blue-lightest active:bg-blue-lighter disabled:cursor-wait"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Subscribe'}
            </button>
          </div>
          {message && (
            <div className="w-3/4 md:max-w-sm mx-auto">
              <div className="mt-1 ml-4 border-blue-50 border-b-0 border-l-[10px] border-r-[10px] border-t-[10px] border-solid h-0 w-0" />
              <div
                className="bg-blue-50 text-blue-800 font-bold px-4 py-3 mx-auto"
                role="alert"
              >
                <p className="text-sm">{message}</p>
              </div>
            </div>
          )}
        </form>
      ) : (
        <div className="w-3/4 md:max-w-sm mx-auto text-center mt-4">
          <div
            className="bg-blue-50 text-blue-800 font-bold px-4 py-3 mx-auto"
            role="alert"
          >
            <p className="text-sm">{message}</p>
          </div>
        </div>
      )}
    </section>
  )
}
