import { useState, useEffect, useRef } from 'react'

/* ── Typing animation hook ── */
function useTypingEffect(words, speed = 80, pause = 1800) {
  const [text, setText] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause)
        } else {
          setCharIdx(c => c + 1)
        }
      } else {
        setText(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setWordIdx(w => (w + 1) % words.length)
          setCharIdx(0)
        } else {
          setCharIdx(c => c - 1)
        }
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return text
}

/* ── Scroll-reveal hook ── */
function useScrollReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, visible]
}

/* ── Animated counter hook ── */
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

/* ═══════════════════════════════════════════
   COMPONENTS
════════════════════════════════════════════ */

/* ── Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = ['Features', 'How It Works', 'Pricing', 'Testimonials']

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#" className="nav-logo">
          <span className="logo-icon">⚡</span>
          <span>NexaFlow</span>
        </a>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {links.map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
                 onClick={() => setMenuOpen(false)}>{l}</a>
            </li>
          ))}
          <li><a href="#pricing" className="nav-cta" onClick={() => setMenuOpen(false)}>Get Started Free</a></li>
        </ul>
        <button className="hamburger" onClick={() => setMenuOpen(m => !m)} aria-label="Toggle menu">
          <span className={menuOpen ? 'bar bar1 open' : 'bar bar1'}></span>
          <span className={menuOpen ? 'bar bar2 open' : 'bar bar2'}></span>
          <span className={menuOpen ? 'bar bar3 open' : 'bar bar3'}></span>
        </button>
      </div>
    </nav>
  )
}

/* ── Hero ── */
function Hero() {
  const typedText = useTypingEffect([
    'Automate Everything.',
    'Ship 10x Faster.',
    'Work Smarter.',
    'Scale Infinitely.',
  ])

  return (
    <section className="hero" id="hero">
      {/* animated orbs */}
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      <div className="hero-content">
        <div className="badge-pill">
          <span className="badge-dot" />
          Now with GPT-4o Integration — <strong>Try it free</strong>
        </div>

        <h1 className="hero-title">
          AI Built to<br />
          <span className="gradient-text typed-wrap">
            {typedText}<span className="cursor">|</span>
          </span>
        </h1>

        <p className="hero-sub">
          NexaFlow connects your tools, automates your repetitive tasks, and
          supercharges your team's productivity — all powered by cutting-edge AI.
        </p>

        <div className="hero-actions">
          <a href="#pricing" className="btn btn-primary">
            Start for Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#how-it-works" className="btn btn-ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Watch Demo
          </a>
        </div>

        <div className="hero-social-proof">
          <div className="avatars">
            {['👩‍💻','👨‍🚀','👩‍🎨','👨‍💼','👩‍🔬'].map((e,i) => (
              <span key={i} className="avatar" style={{zIndex: 5-i}}>{e}</span>
            ))}
          </div>
          <p><strong>12,000+</strong> teams already growing with NexaFlow</p>
        </div>
      </div>

      {/* Dashboard mockup */}
      <div className="hero-visual">
        <div className="dashboard-card glass">
          <div className="dash-header">
            <span className="dot red"/><span className="dot yellow"/><span className="dot green"/>
            <span className="dash-title">NexaFlow Dashboard</span>
          </div>
          <div className="dash-stats">
            <div className="stat-box">
              <span className="stat-val gradient-text">↑ 94%</span>
              <span className="stat-label">Efficiency</span>
            </div>
            <div className="stat-box">
              <span className="stat-val gradient-text">10x</span>
              <span className="stat-label">Faster Output</span>
            </div>
            <div className="stat-box">
              <span className="stat-val gradient-text">∞</span>
              <span className="stat-label">Automations</span>
            </div>
          </div>
          <div className="dash-bars">
            {[85, 62, 91, 74, 88, 55, 96].map((h, i) => (
              <div key={i} className="bar-wrap">
                <div className="bar-fill" style={{'--h': h + '%', '--delay': i * 0.1 + 's'}} />
              </div>
            ))}
          </div>
          <div className="dash-flow">
            {['Collect', '→', 'Analyze', '→', 'Automate', '→', 'Deploy'].map((s,i) => (
              <span key={i} className={s === '→' ? 'arrow' : 'flow-node'}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Features ── */
const featureData = [
  { icon: '🤖', title: 'AI-Powered Automation', desc: 'Let our AI analyze your workflows and automatically create triggers, actions, and conditions — no coding needed.' },
  { icon: '⚡', title: 'Lightning Fast', desc: 'Process millions of events per second with sub-10ms latency. Your workflows execute in real-time, every time.' },
  { icon: '🔗', title: '500+ Integrations', desc: 'Connect Slack, Notion, GitHub, Stripe, Salesforce and 495 more apps with one-click integrations.' },
  { icon: '🛡️', title: 'Enterprise Security', desc: 'SOC2 Type II, GDPR, and HIPAA compliant. End-to-end encryption with granular permission controls.' },
  { icon: '📊', title: 'Advanced Analytics', desc: 'Real-time dashboards and reports that give you complete visibility into every automation and its impact.' },
  { icon: '🌐', title: 'Global Edge Network', desc: 'Deploy workflows to 30+ edge locations worldwide. Your automations run close to your users — always.' },
]

function FeatureCard({ icon, title, desc, index }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div ref={ref} className={`feature-card glass ${visible ? 'reveal' : ''}`}
         style={{ '--delay': index * 0.1 + 's' }}>
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

function Features() {
  const [ref, visible] = useScrollReveal()
  return (
    <section className="features section" id="features">
      <div ref={ref} className={`section-header ${visible ? 'reveal' : ''}`}>
        <span className="section-tag">Features</span>
        <h2>Everything you need to<br /><span className="gradient-text">automate at scale</span></h2>
        <p>Powerful tools built for modern teams who demand speed, reliability, and intelligence.</p>
      </div>
      <div className="features-grid">
        {featureData.map((f, i) => <FeatureCard key={i} {...f} index={i} />)}
      </div>
    </section>
  )
}

/* ── How It Works ── */
const steps = [
  { num: '01', icon: '🔌', title: 'Connect Your Tools', desc: 'Link your existing apps in seconds using our one-click integration library. No technical setup needed.' },
  { num: '02', icon: '🧠', title: 'Define Your Logic', desc: 'Use our visual drag-and-drop builder or describe your workflow in plain English — our AI handles the rest.' },
  { num: '03', icon: '🚀', title: 'Launch & Scale', desc: 'Activate your automation and watch it run. Scale from 10 to 10 million events without touching a line of code.' },
]

function HowItWorks() {
  const [ref, visible] = useScrollReveal()
  return (
    <section className="how-it-works section" id="how-it-works">
      <div ref={ref} className={`section-header ${visible ? 'reveal' : ''}`}>
        <span className="section-tag">How It Works</span>
        <h2>Up and running in<br /><span className="gradient-text">under 5 minutes</span></h2>
      </div>
      <div className="steps-grid">
        {steps.map((s, i) => {
          const [sRef, sVis] = useScrollReveal()
          return (
            <div ref={sRef} key={i}
                 className={`step-card glass ${sVis ? 'reveal' : ''}`}
                 style={{ '--delay': i * 0.15 + 's' }}>
              <span className="step-num">{s.num}</span>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < steps.length - 1 && <div className="step-connector" />}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ── Stats ── */
const statsData = [
  { value: 12000, suffix: '+', label: 'Teams Using NexaFlow' },
  { value: 99, suffix: '.9%', label: 'Uptime SLA' },
  { value: 500, suffix: '+', label: 'App Integrations' },
  { value: 10, suffix: 'x', label: 'Average Productivity Boost' },
]

function StatsSection() {
  const [ref, visible] = useScrollReveal()
  return (
    <section className="stats-section" ref={ref}>
      <div className="stats-grid">
        {statsData.map((s, i) => {
          const count = useCounter(s.value, 2200, visible)
          return (
            <div key={i} className={`stat-item ${visible ? 'reveal' : ''}`}
                 style={{ '--delay': i * 0.1 + 's' }}>
              <span className="stat-big gradient-text">
                {visible ? count.toLocaleString() : '0'}{s.suffix}
              </span>
              <span className="stat-desc">{s.label}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ── Pricing ── */
const plans = [
  {
    name: 'Starter', price: 0, period: '/mo', tag: null,
    desc: 'Perfect for individuals and small projects.',
    features: ['5 active workflows', '1,000 tasks/mo', '50+ integrations', 'Email support', 'Basic analytics'],
    cta: 'Get Started Free', style: 'ghost',
  },
  {
    name: 'Pro', price: 29, period: '/mo', tag: 'Most Popular',
    desc: 'For growing teams that need more power.',
    features: ['Unlimited workflows', '100,000 tasks/mo', '500+ integrations', 'Priority support', 'Advanced analytics', 'Team collaboration', 'Custom domains'],
    cta: 'Start Pro Trial', style: 'primary',
  },
  {
    name: 'Enterprise', price: 99, period: '/mo', tag: null,
    desc: 'For large-scale operations with custom needs.',
    features: ['Everything in Pro', 'Unlimited tasks', 'Dedicated infrastructure', '24/7 phone support', 'SLA guarantee', 'SSO & SAML', 'Custom contracts'],
    cta: 'Contact Sales', style: 'ghost',
  },
]

function Pricing() {
  const [annual, setAnnual] = useState(false)
  const [ref, visible] = useScrollReveal()
  return (
    <section className="pricing section" id="pricing">
      <div ref={ref} className={`section-header ${visible ? 'reveal' : ''}`}>
        <span className="section-tag">Pricing</span>
        <h2>Simple, transparent<br /><span className="gradient-text">pricing for everyone</span></h2>
        <div className="billing-toggle">
          <span className={!annual ? 'active' : ''}>Monthly</span>
          <button className={`toggle-btn ${annual ? 'on' : ''}`} onClick={() => setAnnual(a => !a)} aria-label="Toggle billing period">
            <span className="toggle-thumb" />
          </button>
          <span className={annual ? 'active' : ''}>Annual <em className="save-badge">Save 20%</em></span>
        </div>
      </div>
      <div className="pricing-grid">
        {plans.map((plan, i) => {
          const [pRef, pVis] = useScrollReveal()
          const price = annual && plan.price > 0 ? Math.round(plan.price * 0.8) : plan.price
          return (
            <div ref={pRef} key={i}
                 className={`pricing-card glass ${plan.style === 'primary' ? 'featured' : ''} ${pVis ? 'reveal' : ''}`}
                 style={{ '--delay': i * 0.12 + 's' }}>
              {plan.tag && <span className="plan-tag">{plan.tag}</span>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="price-symbol">$</span>
                <span className="price-val gradient-text">{price}</span>
                <span className="price-period">{plan.period}</span>
              </div>
              <p className="plan-desc">{plan.desc}</p>
              <ul className="plan-features">
                {plan.features.map((f, j) => (
                  <li key={j}><span className="check">✓</span>{f}</li>
                ))}
              </ul>
              <a href="#" className={`btn btn-${plan.style} btn-full`}>{plan.cta}</a>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ── Testimonials ── */
const testimonials = [
  { name: 'Sarah Chen', role: 'CTO @ Luminary AI', avatar: '👩‍💻', stars: 5,
    text: 'NexaFlow cut our engineering overhead by 60%. We automated our entire CI/CD notification pipeline in an afternoon. Absolutely incredible product.' },
  { name: 'Marcus Webb', role: 'Founder @ Rocketship', avatar: '👨‍🚀', stars: 5,
    text: 'The AI workflow builder is genuinely magical. I described what I wanted in plain English and it built the whole automation for me. This is the future.' },
  { name: 'Priya Patel', role: 'Head of Ops @ ScaleUp', avatar: '👩‍🎨', stars: 5,
    text: 'We\'ve tried every automation tool out there. NexaFlow is the only one that actually keeps up with our growth. The reliability is unmatched.' },
  { name: 'James O\'Connor', role: 'VP Eng @ DataStream', avatar: '👨‍💼', stars: 5,
    text: 'From zero automations to 200+ running workflows in a week. Our team saved 30+ hours every single week. The ROI is off the charts.' },
]

function Testimonials() {
  const [active, setActive] = useState(0)
  const [ref, visible] = useScrollReveal()

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="testimonials section" id="testimonials">
      <div ref={ref} className={`section-header ${visible ? 'reveal' : ''}`}>
        <span className="section-tag">Testimonials</span>
        <h2>Loved by <span className="gradient-text">12,000+ teams</span></h2>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((t, i) => (
          <div key={i} className={`testimonial-card glass ${i === active ? 'active' : ''}`}
               onClick={() => setActive(i)}>
            <div className="stars">{'★'.repeat(t.stars)}</div>
            <p className="testimonial-text">"{t.text}"</p>
            <div className="testimonial-author">
              <span className="author-avatar">{t.avatar}</span>
              <div>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="dot-indicators">
        {testimonials.map((_, i) => (
          <button key={i} className={`dot-indicator ${i === active ? 'active' : ''}`}
                  onClick={() => setActive(i)} aria-label={`Testimonial ${i+1}`} />
        ))}
      </div>
    </section>
  )
}

/* ── CTA Banner ── */
function CTABanner() {
  const [ref, visible] = useScrollReveal()
  return (
    <section className="cta-banner" ref={ref}>
      <div className={`cta-inner glass ${visible ? 'reveal' : ''}`}>
        <div className="orb orb-cta1" />
        <div className="orb orb-cta2" />
        <h2>Ready to <span className="gradient-text">transform</span> your workflow?</h2>
        <p>Join thousands of teams automating the future. Start free, no credit card required.</p>
        <div className="cta-actions">
          <a href="#" className="btn btn-primary">Start for Free — It's Free!</a>
          <a href="#" className="btn btn-ghost">Schedule a Demo</a>
        </div>
        <p className="cta-note">✓ No credit card &nbsp;✓ 14-day Pro trial &nbsp;✓ Cancel anytime</p>
      </div>
    </section>
  )
}

/* ── Footer ── */
function Footer() {
  const cols = {
    Product: ['Features', 'Integrations', 'Pricing', 'Changelog', 'Roadmap'],
    Company: ['About Us', 'Blog', 'Careers', 'Press Kit', 'Contact'],
    Resources: ['Documentation', 'API Reference', 'Status Page', 'Community', 'Tutorials'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
  }
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <a href="#" className="nav-logo">
            <span className="logo-icon">⚡</span><span>NexaFlow</span>
          </a>
          <p>AI-powered workflow automation for modern teams. Build, deploy, and scale automations without code.</p>
          <div className="social-links">
            {['𝕏', '💼', '🐙', '▶️'].map((s, i) => (
              <a key={i} href="#" className="social-btn">{s}</a>
            ))}
          </div>
        </div>
        {Object.entries(cols).map(([title, links]) => (
          <div key={title} className="footer-col">
            <h4>{title}</h4>
            <ul>{links.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <p>© 2025 NexaFlow, Inc. All rights reserved.</p>
        <p>Built with ⚡ React + Vite</p>
      </div>
    </footer>
  )
}

/* ── Back to Top ── */
function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return show ? (
    <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
      ↑
    </button>
  ) : null
}

/* ═══════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════ */
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <StatsSection />
        <Pricing />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
