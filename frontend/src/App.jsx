import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Github,
  GraduationCap,
  Linkedin,
  MapPin,
  Menu,
  Phone,
  X,
} from 'lucide-react'

import Chatbot from './components/Chatbot.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'

/* ------------------------------ content ------------------------------ */

const EMAIL = 'gbgowthamg@gmail.com'

const navItems = [
  ['About', 'about'],
  ['Skills', 'skills'],
  ['Projects', 'projects'],
  ['Experience', 'experience'],
  ['Contact', 'contact'],
]

const skills = [
  { title: 'Frontend', items: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Vite'] },
  { title: 'Backend', items: ['Node.js', 'Express.js', 'REST APIs', 'JWT', 'Python', 'FastAPI'], learning: ['Python', 'FastAPI'] },
  { title: 'Database & tools', items: ['MySQL', 'SQL', 'Git', 'GitHub', 'Postman', 'XAMPP'] },
]

const projects = [
  {
    title: 'BookOrder',
    kind: 'Full-stack web application',
    description:
      'An e-commerce-style book ordering application with user authentication, profile, cart, and order-related flows.',
    stack: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MySQL', 'JWT'],
    mock: 'shop',
    github: '',
    demo: '',
  },
  {
    title: 'AI-Based Student Academic Assistant',
    kind: 'Academic project / prototype',
    description:
      'A student assistant concept for academic information with a camera-based focus-monitoring prototype and ESP32 buzzer integration.',
    stack: ['Python', 'OpenCV', 'MediaPipe', 'ESP32', 'Serial'],
    mock: 'focus',
    github: '',
    demo: '',
  },
]

const terminalLines = [
  ['const ', 'developer', ' = {'],
  ['  name: ', "'Gowtham G B'", ','],
  ['  focus: ', "'Full Stack'", ','],
  ['  frontend: ', "'React'", ','],
  ['  backend: ', "'Node + Python'", ','],
  ['  mindset: ', "'Keep building'", ''],
  ['};', '', ''],
]

/* ------------------------------ helpers ------------------------------ */

function useActiveSection(ids) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [ids])
  return active
}

function useScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setP(h > 0 ? window.scrollY / h : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return p
}

const trackSpot = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}

/* Terminal that types out the developer object once, on load */
function Terminal() {
  const total = terminalLines.reduce((n, l) => n + l.join('').length, 0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(total)
      return
    }
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= total) {
          clearInterval(id)
          return c
        }
        return c + 1
      })
    }, 38)
    return () => clearInterval(id)
  }, [total])

  let left = count
  const lineColours = ['text-emerald-500', 'text-amber-400', 'text-[var(--subtext)]']

  return (
    <div className="relative">
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-emerald-500/40 via-transparent to-teal-500/30 blur-sm" />
      <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-teal-400" />
          </div>
          <span className="font-mono text-xs text-[var(--subtext)]">developer.js</span>
        </div>

        <pre className="min-h-[11.5rem] overflow-hidden font-mono text-[13px] leading-7 sm:text-sm" aria-label="developer object">
          {terminalLines.map((parts, i) => {
            const edge = i === 0 || i === terminalLines.length - 1
            const spans = parts.map((p, j) => {
              const shown = p.slice(0, Math.max(0, left))
              left -= p.length
              if (!shown) return null
              const cls = edge
                ? j === 1 ? 'text-sky-400' : 'text-violet-400'
                : lineColours[j]
              return <span key={j} className={cls}>{shown}</span>
            })
            return <div key={i}>{spans}</div>
          })}
          <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-emerald-500" />
        </pre>

        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[var(--muted)] px-4 py-3 text-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-400" />
          </span>
          <span className="text-[var(--subtext)]">Now:</span>
          <span className="font-medium">Full stack + AI</span>
        </div>
      </div>
    </div>
  )
}

/* Simple CSS "screenshots" for the two projects */
function Mock({ type }) {
  return (
    <div className="relative h-full min-h-[15rem] overflow-hidden bg-gradient-to-br from-emerald-500/20 via-[var(--muted)] to-teal-500/10 p-5 sm:p-8">
      <div className="mx-auto flex h-full max-w-md flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
        <div className="flex items-center gap-1.5 border-b border-[var(--border)] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          <span className="h-2 w-2 rounded-full bg-amber-300" />
          <span className="h-2 w-2 rounded-full bg-teal-400" />
          <span className="ml-3 h-3 flex-1 rounded bg-[var(--muted)]" />
        </div>
        {type === 'shop' ? (
          <div className="grid flex-1 grid-cols-3 gap-3 p-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex-1 rounded-md bg-gradient-to-b from-emerald-500/40 to-emerald-500/10" style={{ opacity: 1 - i * 0.08 }} />
                <div className="h-1.5 w-4/5 rounded bg-[var(--border)]" />
                <div className="h-1.5 w-2/5 rounded bg-emerald-500/60" />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative flex-1 p-3">
            <div className="grid h-full place-items-center rounded-md bg-[var(--muted)]">
              <div className="relative h-24 w-20 rounded-[45%] border-2 border-dashed border-emerald-500/70">
                <span className="absolute left-3 top-8 h-1.5 w-3 rounded bg-emerald-500" />
                <span className="absolute right-3 top-8 h-1.5 w-3 rounded bg-emerald-500" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------ page ------------------------------ */

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const nameRef = useRef(null)
  const active = useActiveSection(navItems.map(([, id]) => id))
  const progress = useScrollProgress()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((v) => (v === 'dark' ? 'light' : 'dark'))
  const closeMenu = () => setMenuOpen(false)

  const onHeroMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    nameRef.current?.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      {/* scroll progress */}
      <div
        className="fixed left-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-emerald-500 to-teal-500"
        style={{ transform: `scaleX(${progress})`, width: '100%' }}
        aria-hidden="true"
      />

      {/* NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8" aria-label="Main navigation">
          <a href="#home" onClick={closeMenu} className="font-display text-lg font-bold tracking-tight">
            Gowtham<span className="text-emerald-500"> G B</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active === id
                    ? 'bg-[var(--muted)] font-medium text-[var(--text)]'
                    : 'text-[var(--subtext)] hover:text-[var(--text)]'
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <a
              href="/Gowtham_GB_Resume.pdf"
              download="Gowtham_GB_Resume.pdf"
              className="hidden items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 sm:inline-flex"
            >
              <Download size={15} />
              Resume
            </a>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="border-t border-[var(--border)] px-5 py-3 md:hidden">
            {navItems.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={closeMenu}
                className="block rounded-lg px-3 py-3 text-sm text-[var(--subtext)] hover:bg-[var(--muted)] hover:text-[var(--text)]"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </header>

      <main>
        {/* HERO */}
        <section id="home" onMouseMove={onHeroMove} className="relative isolate overflow-hidden">
          <div className="dot-grid pointer-events-none absolute inset-0 -z-10" />
          <div className="pointer-events-none absolute -left-32 top-0 -z-10 h-96 w-96 rounded-full bg-emerald-500/15 blur-[110px]" />
          <div className="pointer-events-none absolute -right-24 top-40 -z-10 h-80 w-80 rounded-full bg-teal-500/10 blur-[110px]" />

          <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-16 sm:px-8 md:grid-cols-[1.2fr_0.8fr] lg:py-28">
            <div className="hero-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-3 pr-4 text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
                </span>
                Open to software internships
              </div>

              <h1
                ref={nameRef}
                className="name-fx font-display mt-7 text-[clamp(3.4rem,11vw,7.5rem)] font-extrabold leading-[0.95] tracking-[-0.045em]"
              >
                Gowtham G&nbsp;B
              </h1>

              <p className="font-display mt-6 text-2xl font-medium leading-snug text-[var(--subtext)] sm:text-3xl">
                I build full-stack web apps, from interface to API.
              </p>

              <p className="mt-5 max-w-lg leading-8 text-[var(--subtext)]">
                Currently sharpening my backend skills and exploring how AI can make software more useful.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                >
                  See my projects
                  <ArrowDownRight size={18} />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3.5 font-semibold transition hover:border-emerald-500"
                >
                  Get in touch
                </a>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[var(--subtext)]">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={15} className="text-emerald-500" />
                  Chennai, India
                </span>
                <a
                  href="https://www.linkedin.com/in/gbgowtham/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-emerald-500"
                >
                  <Linkedin size={15} />
                  LinkedIn
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            <div className="hero-in">
              <Terminal />
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="border-y border-[var(--border)] bg-[var(--surface)]/60">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:py-28">
            <div>
              <h2 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Building skills by building things.
              </h2>
              <p className="mt-6 max-w-md leading-8 text-[var(--subtext)]">
                I'm a Computer Science student at Anna University with a practical interest in web development. I
                enjoy connecting a clean user experience with reliable APIs and data.
              </p>
            </div>

            <dl className="divide-y divide-[var(--border)] self-start rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
              {[
                ['Studying', 'Integrated M.Sc. Computer Science, CEG, Anna University, Chennai'],
                ['Building', 'Responsive web apps, REST API integrations, authentication flows and database-backed projects'],
                ['Exploring', 'Python backend development, FastAPI and responsible AI-powered features'],
              ].map(([k, v], i) => (
                <div key={k} className="flex gap-5 p-6 sm:p-7">
                  <dt className="flex w-28 shrink-0 items-start gap-2 font-display font-bold">
                    {i === 0 && <GraduationCap size={18} className="mt-1 text-emerald-500" />}
                    {k}
                  </dt>
                  <dd className="text-sm leading-7 text-[var(--subtext)]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Technologies I work with</h2>
          <p className="mt-4 max-w-xl text-[var(--subtext)]">
            My current stack. Things I'm still picking up are marked <span className="text-amber-500">learning</span>.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {skills.map((group) => (
              <div
                key={group.title}
                onMouseMove={trackSpot}
                className="spot rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7"
              >
                <h3 className="font-display text-xl font-bold">{group.title}</h3>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const learning = group.learning?.includes(item)
                    return (
                      <li
                        key={item}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          learning
                            ? 'border-dashed border-amber-500/50 bg-amber-500/10 text-amber-500'
                            : 'border-[var(--border)] bg-[var(--muted)]'
                        }`}
                      >
                        {item}
                        {learning && <span className="ml-1.5 text-xs opacity-80">learning</span>}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="border-y border-[var(--border)] bg-[var(--surface)]/60">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Projects I've worked on</h2>
            <p className="mt-4 max-w-xl text-[var(--subtext)]">
              A full-stack application and a hardware-connected prototype.
            </p>

            <div className="mt-12 space-y-6">
              {projects.map((p, i) => (
                <article
                  key={p.title}
                  onMouseMove={trackSpot}
                  className="spot grid overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] transition hover:border-emerald-500/40 md:grid-cols-2"
                >
                  <div className={i % 2 ? 'md:order-2' : ''}>
                    <Mock type={p.mock} />
                  </div>

                  <div className="flex flex-col justify-center p-7 sm:p-10">
                    <p className="text-sm font-medium text-emerald-500">{p.kind}</p>
                    <h3 className="font-display mt-2 text-3xl font-bold leading-tight tracking-tight">{p.title}</h3>
                    <p className="mt-4 leading-7 text-[var(--subtext)]">{p.description}</p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <li key={s} className="rounded-full bg-[var(--muted)] px-3 py-1.5 font-mono text-xs text-[var(--subtext)]">
                          {s}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex flex-wrap items-center gap-5 text-sm">
                      {p.github ? (
                        <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold hover:text-emerald-500">
                          <Github size={16} /> View code <ArrowUpRight size={14} />
                        </a>
                      ) : (
                        <span className="text-[var(--subtext)]">Repository link coming soon</span>
                      )}
                      {p.demo && (
                        <a href={p.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold hover:text-emerald-500">
                          Live demo <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Learning in real project settings</h2>

          <div className="mt-12 grid gap-8 md:grid-cols-[14rem_1fr]">
            <div className="text-sm text-[var(--subtext)]">
              <p className="font-display text-lg font-bold text-[var(--text)]">August 2025 onward</p>
              <p className="mt-1">Internship</p>
            </div>

            <div className="relative border-l border-emerald-500/40 pl-8">
              <span className="absolute -left-[7px] top-2 h-3.5 w-3.5 rounded-full border-2 border-emerald-500 bg-[var(--bg)]" />
              <p className="text-sm font-semibold text-emerald-500">Muthu Soft Labs Pvt. Ltd.</p>
              <h3 className="font-display mt-1 text-2xl font-bold tracking-tight">Full Stack Web Development Intern</h3>
              <p className="mt-4 max-w-2xl leading-7 text-[var(--subtext)]">
                Worked on BookOrder, a book-ordering web application, using React and Vite on the frontend with
                Node.js, Express and MySQL for backend services and data.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--subtext)]">
                {[
                  'Built and connected pages including home, login, registration, profile and cart.',
                  'Worked with REST APIs, JWT-based authentication and a MySQL database.',
                  'Used XAMPP and phpMyAdmin during local development.',
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="border-t border-[var(--border)] bg-[var(--surface)]/60">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
            <h2 className="font-display max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Let's build something useful together.
            </h2>
            <p className="mt-6 max-w-xl leading-7 text-[var(--subtext)]">
              I'm interested in software development internships, job opportunities and collaborations.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${EMAIL}`}
                className="font-display text-xl font-bold underline decoration-emerald-500 decoration-2 underline-offset-8 transition hover:text-emerald-500 sm:text-3xl"
              >
                {EMAIL}
              </a>
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm transition hover:border-emerald-500"
                aria-live="polite"
              >
                {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                {copied ? 'Copied' : 'Copy email'}
              </button>
            </div>

            <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
              {[
                { icon: Phone, label: 'Phone', value: '+91 84899 66821', href: 'tel:+918489966821' },
                { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/gbgowtham', href: 'https://www.linkedin.com/in/gbgowtham/', ext: true },
                { icon: MapPin, label: 'Location', value: 'Saidapet, Chennai, Tamil Nadu, India' },
                { icon: Github, label: 'GitHub', value: 'Profile coming soon' },
              ].map(({ icon: Icon, label, value, href, ext }) => {
                const inner = (
                  <>
                    <Icon size={22} className="shrink-0 text-emerald-500" />
                    <div className="min-w-0">
                      <p className="text-xs text-[var(--subtext)]">{label}</p>
                      <p className="truncate font-medium">{value}</p>
                    </div>
                    {href && <ArrowUpRight size={16} className="ml-auto shrink-0 text-[var(--subtext)]" />}
                  </>
                )
                const cls = 'flex items-center gap-4 bg-[var(--surface)] p-6'
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} target={ext ? '_blank' : undefined} rel={ext ? 'noreferrer' : undefined} className={`${cls} h-full transition hover:bg-[var(--muted)]`}>
                        {inner}
                      </a>
                    ) : (
                      <div className={`${cls} h-full`}>{inner}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-[var(--subtext)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} Gowtham G B. Built with React, Tailwind CSS & Python.</p>
        <a href="#home" className="inline-flex items-center gap-2 hover:text-emerald-500">
          Back to top
          <ArrowUpRight size={15} />
        </a>
      </footer>

      <Chatbot />
    </div>
  )
}