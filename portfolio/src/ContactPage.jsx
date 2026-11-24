import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useToast } from './Toast.jsx'
import { FORMSPREE_FORM_ID } from './contactConfig.js'

// Contact page — its own route at /contact. Same fixed video behind it
// (VideoBackground lives at App level), so scrolling here scrubs the
// video frame by frame exactly like home. The page is laid out tall on
// purpose: intro, then the form, with generous spacing between them.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const loadIn = (delay) => ({
  initial: { opacity: 0, filter: 'blur(12px)', y: 18 },
  animate: { opacity: 1, filter: 'blur(0px)', y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
})

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please add your name.'
  if (!values.email.trim()) {
    errors.email = 'Please add your email.'
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "That email doesn't look right."
  }
  if (values.message.trim().length < 10) {
    errors.message = 'Say a little more — at least 10 characters.'
  }
  return errors
}

export default function ContactPage() {
  const { showToast } = useToast()
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)

  const setValue = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }))
    // Clear that field's error as soon as the user starts fixing it.
    setErrors((e) => {
      if (!e[field]) return e
      const next = { ...e }
      delete next[field]
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSending(true)
    try {
      const formData = new FormData()
      formData.append('name', values.name.trim())
      formData.append('email', values.email.trim())
      formData.append('message', values.message.trim())
      const res = await fetch(
        `https://formspree.io/f/${FORMSPREE_FORM_ID}`,
        {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        },
      )
      if (res.ok) {
        showToast('success', "Message sent — I'll get back to you.")
        setValues({ name: '', email: '', message: '' })
        setErrors({})
      } else {
        let reason =
          "Couldn't send — check your connection and try again."
        try {
          const data = await res.json()
          const formspreeMessage = data?.errors?.[0]?.message
          if (formspreeMessage) reason = formspreeMessage
        } catch {
          // Keep the plain fallback reason.
        }
        showToast('error', reason)
      }
    } catch {
      showToast(
        'error',
        "Couldn't send — check your connection and try again.",
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="page contact-page">
      <nav className="contact-topbar">
        <Link to="/" className="contact-back">
          &larr; xforge.git
        </Link>
      </nav>

      <div className="contact-wrap">
        <motion.div {...loadIn(0.1)} className="contact-intro">
          <p className="section-kicker">Contact</p>
          <h1 className="contact-title">Ask the founder.</h1>
          <p className="contact-intro-text">
            Have something to ask? A question, an idea, feedback, or just want
            to say hi — it goes straight to me.
          </p>
        </motion.div>

        <motion.section {...loadIn(0.25)} className="contact-form-card">
          <h2 className="contact-form-title">Ask the founder</h2>
          <p className="contact-form-sub">
            Send me a message — I read everything myself.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="contact-field">
              <label htmlFor="contact-name" className="contact-label">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={values.name}
                onChange={(e) => setValue('name', e.target.value)}
                className={`contact-input${errors.name ? ' contact-input-error' : ''}`}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="contact-error">{errors.name}</p>
              )}
            </div>

            <div className="contact-field">
              <label htmlFor="contact-email" className="contact-label">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={(e) => setValue('email', e.target.value)}
                className={`contact-input${errors.email ? ' contact-input-error' : ''}`}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="contact-error">{errors.email}</p>
              )}
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message" className="contact-label">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                placeholder="What's on your mind?"
                value={values.message}
                onChange={(e) => setValue('message', e.target.value)}
                className={`contact-input contact-textarea${errors.message ? ' contact-input-error' : ''}`}
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <p className="contact-error">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-gold contact-submit"
              disabled={sending}
            >
              {sending ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </motion.section>

        <p className="contact-footnote">
          No newsletter, no spam — just a reply from me.
        </p>
      </div>
    </main>
  )
}
