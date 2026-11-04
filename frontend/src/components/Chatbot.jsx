
import { useEffect, useRef, useState } from 'react'
import {
  Bot,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
const RESUME_URL =
  'https://gowtham-portfolio-swart.vercel.app/Gowtham_GB_Resume.pdf'

// Suggested recruiter questions
const suggestions = [
  'Tell me about Gowtham',
  'What projects has he built?',
  'What are his technical skills?',
  'What is his professional experience?',
  'What kind of internship is he looking for?',
  'Share his resume',
]

// Welcome message
const initialMessage = {
  role: 'assistant',
  content:
    "Hi! I'm Gowtham's portfolio assistant. 👋\n\nAsk me about his skills, projects, experience or how to contact him.",
}

// Render bold text and clickable Markdown links
function renderInline(text) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*.*?\*\*)/g)

  return parts.map((part, index) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)

    if (linkMatch) {
      const label = linkMatch[1]
      let url = linkMatch[2].trim()

      // Use the known working portfolio URL for resume links.
      const isResumeLink =
        /resume|curriculum vitae|\bcv\b/i.test(label) ||
        /\.pdf(?:[?#].*)?$/i.test(url)

      if (isResumeLink && !RESUME_URL.startsWith('PASTE_')) {
        url = RESUME_URL
      }

      const isSafeUrl =
        url.startsWith('https://') ||
        url.startsWith('http://') ||
        url.startsWith('mailto:') ||
        url.startsWith('tel:') ||
        url.startsWith('/')

      if (!isSafeUrl) {
        return <span key={index}>{label}</span>
      }

      const isPdf = /\.pdf(?:[?#].*)?$/i.test(url)

      return (
        <a
          key={index}
          href={url}
          target={isPdf ? '_self' : '_blank'}
          rel="noreferrer"
          download={isPdf ? 'Gowtham%20GB_CV.pdf' : undefined}
          className="font-semibold text-emerald-500 underline underline-offset-4 transition hover:text-emerald-400"
        >
          {label}
        </a>
      )
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-[var(--text)]">
          {part.slice(2, -2)}
        </strong>
      )
    }

    return <span key={index}>{part}</span>
  })
}

// Format paragraphs and bullet points
function FormattedMessage({ content }) {
  const lines = content.split('\n')

  return (
    <div className="space-y-1.5">
      {lines.map((line, index) => {
        const trimmed = line.trim()

        if (!trimmed) {
          return <div key={index} className="h-1" />
        }

        if (/^[•*-]\s/.test(trimmed)) {
          return (
            <div key={index} className="flex gap-2 pl-1">
              <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span className="min-w-0 flex-1">
                {renderInline(trimmed.replace(/^[•*-]\s/, ''))}
              </span>
            </div>
          )
        }

        return <p key={index}>{renderInline(trimmed)}</p>
      })}
    </div>
  )
}

function Avatar({ small = false }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-slate-950 ${
        small ? 'h-8 w-8' : 'h-11 w-11'
      }`}
    >
      <Bot size={small ? 16 : 22} />
    </div>
  )
}

// Typing animation
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <Avatar small />

      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[var(--border)] bg-[var(--muted)] px-4 py-3.5">
        {[0, 1, 2].map((item) => (
          <span
            key={item}
            className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"
            style={{ animationDelay: `${item * 0.15}s` }}
          />
        ))}

        <span className="sr-only">Assistant is typing</span>
      </div>
    </div>
  )
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [history, setHistory] = useState([initialMessage])

  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const busyRef = useRef(false)

  const isFresh = history.length === 1

  // Scroll to the latest message
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }
  }, [history, busy, open])

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open])

  // Close with Escape key
  useEffect(() => {
    if (!open) return

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKey)

    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Reset chat
  function resetChat() {
    if (busyRef.current) return

    setHistory([initialMessage])
    setInput('')
  }

  // Send message to FastAPI backend
  async function sendMessage(text = input) {
    const message = text.trim()

    if (!message || busyRef.current) return

    busyRef.current = true

    const startTime = Date.now()

    const previousHistory = history
      .filter(
        (item) =>
          item.role === 'user' || item.role === 'assistant'
      )
      .slice(-6)

    setHistory((items) => [
      ...items,
      { role: 'user', content: message },
    ])

    setInput('')
    setBusy(true)

    const waitMinimum = async () => {
      const remaining = Math.max(
        0,
        1000 - (Date.now() - startTime)
      )

      if (remaining > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, remaining)
        )
      }
    }

    try {
      const base = (
        import.meta.env.VITE_API_BASE_URL ||
        'http://127.0.0.1:8000'
      ).replace(/\/$/, '')

      const response = await fetch(`${base}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: previousHistory,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail ||
            'The assistant could not answer. Please try again.'
        )
      }

      await waitMinimum()

      setHistory((items) => [
        ...items,
        {
          role: 'assistant',
          content:
            typeof data.answer === 'string'
              ? data.answer
              : 'The assistant returned an unexpected response.',
        },
      ])
    } catch (error) {
      console.error('Portfolio chatbot error:', error)

      await waitMinimum()

      setHistory((items) => [
        ...items,
        {
          role: 'assistant',
          content:
            'I could not reach the assistant right now. Please check that the backend is running, or email Gowtham directly.',
        },
      ])
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }

  return (
    <>
      {open && (
        <section
          className="chat-pop fixed inset-x-3 bottom-24 z-50 flex h-[min(640px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/30 sm:inset-x-auto sm:right-6 sm:w-[410px]"
          aria-label="Portfolio assistant chat"
        >
          {/* Header */}
          <header className="relative flex items-center justify-between border-b border-[var(--border)] px-4 py-3.5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-500/10 to-transparent" />

            <div className="relative flex items-center gap-3">
              <div className="relative">
                <Avatar />

                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--surface)] bg-teal-400" />
              </div>

              <div>
                <p className="font-display font-bold leading-tight">
                  Gowtham's assistant
                </p>

                <p className="text-xs text-[var(--subtext)]">
                  Answers from his portfolio data
                </p>
              </div>
            </div>

            <div className="relative flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                disabled={isFresh || busy}
                aria-label="Start a new chat"
                title="New chat"
                className="rounded-full p-2 text-[var(--subtext)] transition hover:bg-[var(--muted)] hover:text-[var(--text)] disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <RotateCcw size={17} />
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-2 text-[var(--subtext)] transition hover:bg-[var(--muted)] hover:text-[var(--text)]"
              >
                <X size={19} />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div
            className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
            aria-live="polite"
          >
            {history.map((item, index) => (
              <div
                key={`${index}-${item.role}`}
                className={`flex items-end gap-2 ${
                  item.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                {item.role === 'assistant' && <Avatar small />}

                <div
                  className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    item.role === 'user'
                      ? 'rounded-br-md bg-emerald-500 font-medium text-slate-950'
                      : 'rounded-bl-md border border-[var(--border)] bg-[var(--muted)] text-[var(--subtext)]'
                  }`}
                >
                  <FormattedMessage content={item.content} />
                </div>
              </div>
            ))}

            {busy && <TypingIndicator />}

            {/* Starter questions */}
            {isFresh && !busy && (
              <div className="space-y-2.5 pt-2">
                <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--subtext)]">
                  <Sparkles
                    size={13}
                    className="text-emerald-500"
                  />
                  Try asking
                </p>

                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => sendMessage(suggestion)}
                      className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-left text-xs text-[var(--subtext)] transition hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Follow-up suggestions */}
          {!isFresh && (
            <div className="flex gap-2 overflow-x-auto border-t border-[var(--border)] px-3 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={busy}
                  onClick={() => sendMessage(suggestion)}
                  className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--subtext)] transition hover:border-emerald-500 hover:text-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage()
            }}
            className="flex items-center gap-2 border-t border-[var(--border)] p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about skills, projects, resume..."
              maxLength={2000}
              className="min-w-0 flex-1 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--subtext)] focus:border-emerald-500"
              aria-label="Message the assistant"
            />

            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      {/* Floating chatbot button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        aria-expanded={open}
        className="fixed bottom-5 right-4 z-50 flex items-center gap-2.5 rounded-full bg-emerald-500 py-3.5 pl-5 pr-5 font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:-translate-y-1 hover:bg-emerald-400 sm:right-6"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}

        <span>{open ? 'Close' : 'Ask my AI'}</span>

        {!open && (
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-950/40" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-slate-950/70" />
          </span>
        )}
      </button>
    </>
  )
}
