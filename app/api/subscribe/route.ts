import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { isValidEmail } from '@/lib/utils/isValidEmail'

const MAILCHIMP_LIST_ID = 'f13ffe3703'

// Same reply whether or not the address is already on the list, so the
// endpoint can't be used to look up who subscribes
const SUCCESS_MESSAGE =
  "Almost finished! If you aren't already subscribed, check your email to confirm your subscription."

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json(
      { error: 'Email is required.' },
      { status: 400 },
    )
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    )
  }

  const apiKey = process.env.MAILCHIMP_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Newsletter subscription is not configured. Please try again later.' },
      { status: 500 },
    )
  }

  // Extract data center from API key (e.g., "....-us19" → "us19")
  const dc = apiKey.split('-').pop()
  const subscriberHash = createHash('md5')
    .update(email.toLowerCase())
    .digest('hex')

  // Use PUT for add-or-update (idempotent — no error if already subscribed)
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${subscriberHash}`

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: 'pending',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      // Mailchimp's detail can reveal a member's status, so keep it server-side
      console.error('Mailchimp subscribe failed:', response.status, data.title, data.detail)
      return NextResponse.json(
        { error: "We couldn't subscribe that address. Please check it and try again." },
        { status: response.status >= 500 ? 502 : 400 },
      )
    }

    return NextResponse.json({ message: SUCCESS_MESSAGE })
  } catch {
    return NextResponse.json(
      { error: 'Newsletter subscription is temporarily unavailable. Please try again later.' },
      { status: 500 },
    )
  }
}
