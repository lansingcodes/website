import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

const MAILCHIMP_LIST_ID = 'f13ffe3703'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json(
      { error: 'Email is required.' },
      { status: 400 },
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
      const detail = data.detail || 'Something went wrong.'
      return NextResponse.json({ error: detail }, { status: response.status })
    }

    if (data.status === 'pending') {
      return NextResponse.json({
        message: 'Almost finished! Check your email to confirm your subscription.',
      })
    }

    if (data.status === 'subscribed') {
      return NextResponse.json({
        message: "You're already subscribed!",
      })
    }

    return NextResponse.json({
      message: 'Almost finished! Check your email to confirm your subscription.',
    })
  } catch {
    return NextResponse.json(
      { error: 'Newsletter subscription is temporarily unavailable. Please try again later.' },
      { status: 500 },
    )
  }
}
