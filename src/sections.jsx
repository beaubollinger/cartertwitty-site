/* global React */
const { useEffect, useRef, useState, useCallback } = React;

// ────────────────────────────────────────────────────────────
// Hooks
// ────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    el.querySelectorAll('.reveal').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return p;
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 140;
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids.join(',')]);
  return active;
}

// ────────────────────────────────────────────────────────────
// NAV + PROGRESS
// ────────────────────────────────────────────────────────────
function Nav({ bookingUrl, onNav }) {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(['top', 'story', 'program', 'fit', 'apply']);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    { id: 'story', label: 'Origin' },
    { id: 'program', label: 'The Foundation' },
    { id: 'fit', label: 'Is This You' },
  ];
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-left">
        <span className="nav-mark">c</span>
        <span className="nav-name">Carter <em>Twitty</em></span>
      </div>
      <div className="nav-links">
        {links.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className={`nav-link ${active === l.id ? 'active' : ''}`}
          >
            {l.label}
          </a>
        ))}
      </div>
      <a href={bookingUrl} target="_blank" rel="noreferrer" className="nav-cta">
        Apply <span className="arrow">→</span>
      </a>
    </nav>
  );
}

function Progress() {
  const p = useScrollProgress();
  return <div className="progress-bar" style={{ width: `${p * 100}%` }} />;
}

// ────────────────────────────────────────────────────────────
// CURSOR AURA
// ────────────────────────────────────────────────────────────
function CursorAura() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; el.classList.add('ready'); };
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove);
    loop();
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);
  return <div className="cursor-aura" ref={ref} />;
}

// ────────────────────────────────────────────────────────────
// HERO
// ────────────────────────────────────────────────────────────
function HeroSplit({ bookingUrl }) {
  const heroRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const y = window.scrollY;
      const offset = Math.min(y * 0.15, 60);
      heroRef.current.style.setProperty('--hero-parallax', `-${offset}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="hero-grid-lines" style={{ transform: 'translateY(var(--hero-parallax, 0))' }} />
      <div className="hero-split">
        <div style={{ transform: 'translateY(calc(var(--hero-parallax, 0) * 0.5))' }}>
          <div className="hero-label reveal visible">Integrated 1:1 Mentorship · 9 Weeks</div>
          <h1 className="reveal visible reveal-delay-1">
            Practice the <em>how</em> of doing everything in your life <em>with quality.</em>
          </h1>
          <p className="hero-sub reveal visible reveal-delay-2">
            A mentorship for people performing at a high level in the places others can see —
            while quietly coming apart in the places they can't.
          </p>
          <div className="hero-cta-row reveal visible reveal-delay-3">
            <a href={bookingUrl} target="_blank" rel="noreferrer" className="btn-primary">
              Apply for Mentorship <span className="arrow">→</span>
            </a>
            <a href="#story" className="btn-ghost">
              Read the origin <span className="arrow">↓</span>
            </a>
          </div>
          <div className="hero-meta reveal visible reveal-delay-4">
            <div className="hero-meta-item"><span className="hero-meta-dot" /> Application required</div>
            <div className="hero-meta-item"><span className="hero-meta-dot" /> Limited spots</div>
            <div className="hero-meta-item"><span className="hero-meta-dot" /> Now enrolling</div>
          </div>
        </div>
        <HeroPortrait />
      </div>
    </section>
  );
}

function HeroPortrait() {
  return (
    <div className="hero-portrait hero-portrait--photo reveal visible reveal-delay-2"
         style={{ transform: 'translateY(calc(var(--hero-parallax, 0) * 0.25))' }}>
      <img src="assets/carter-portrait.jpg" alt="Carter Twitty" className="ph-img" />
      <span className="ph-corner tl" /><span className="ph-corner tr" />
      <span className="ph-corner bl" /><span className="ph-corner br" />
    </div>
  );
}

function HeroCentered({ bookingUrl }) {
  return (
    <section className="hero" id="top">
      <div className="hero-grid-lines" />
      <div className="hero-centered">
        <div className="hero-label reveal visible">Integrated 1:1 Mentorship · 9 Weeks</div>
        <h1 className="reveal visible reveal-delay-1">
          Practice the <em>how</em> of doing everything in your life <em>with quality.</em>
        </h1>
        <p className="hero-sub reveal visible reveal-delay-2">
          A mentorship for people performing at a high level in the places others can see —
          while quietly coming apart in the places they can't.
        </p>
        <div className="hero-cta-row reveal visible reveal-delay-3">
          <a href={bookingUrl} target="_blank" rel="noreferrer" className="btn-primary">
            Apply for Mentorship <span className="arrow">→</span>
          </a>
          <a href="#story" className="btn-ghost">Read the origin <span className="arrow">↓</span></a>
        </div>
        <div className="hero-meta reveal visible reveal-delay-4">
          <div className="hero-meta-item"><span className="hero-meta-dot" /> Application required</div>
          <div className="hero-meta-item"><span className="hero-meta-dot" /> Limited spots</div>
          <div className="hero-meta-item"><span className="hero-meta-dot" /> Now enrolling</div>
        </div>
      </div>
    </section>
  );
}

function HeroFullbleed({ bookingUrl }) {
  return (
    <section className="hero" id="top">
      <div className="hero-fullbleed">
        <div className="fb-stage">
          <div>
            <div className="hero-label reveal visible">Integrated 1:1 Mentorship</div>
            <h1 className="reveal visible reveal-delay-1">
              Practice the <em>how</em> of doing everything<br />in your life <em>with quality.</em>
            </h1>
          </div>
          <div className="fb-bottom reveal visible reveal-delay-2">
            <p className="hero-sub">
              A mentorship for people performing at a high level in the places others can see —
              while quietly coming apart in the places they can't.
            </p>
            <div className="hero-cta-row">
              <a href={bookingUrl} target="_blank" rel="noreferrer" className="btn-primary">
                Apply <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// STORY
// ────────────────────────────────────────────────────────────
function Story() {
  return (
    <section className="story" id="story">
      <div className="container">
        <div className="eyebrow reveal">The Origin</div>
        <h2 className="section-heading reveal reveal-delay-1">
          I built the body.<br />Then I lost myself inside it.
        </h2>

        <p className="body-copy reveal reveal-delay-2">
          For years I lived two lives. One was the life I wanted — movement practice, deep reading,
          showing up fully. The other I kept hidden: drinking, using, cycling through guilt and shame
          by morning. From the outside it looked like discipline. From the inside I was coming apart.
        </p>

        <p className="body-copy reveal reveal-delay-2">
          <strong>During the pandemic, the hiding stopped working.</strong> My weight climbed fifty
          pounds. My wife asked me to leave. I went to my brother's house. A week later I fell off
          again. He gave me one choice: rehab or AA, or lose the family.
        </p>

        <p className="body-copy reveal">I chose the group.</p>

        <p className="body-copy reveal">
          What saved me wasn't a method. It was people. My family, who stayed. My sponsor, who showed
          up. My movement teacher and community, who held the door open even when I'd stopped walking
          through it.
        </p>

        <div className="pull-quote reveal">
          Real change doesn't happen through information or intensity. It happens through sustained,
          honest support from someone who has been somewhere dark and came back.
        </div>

        <p className="body-copy reveal">
          My circumstances may not be yours. But I know this pattern:{' '}
          <strong>performing at a high level in the places people can see, while quietly coming
          apart in the places they can't.</strong>{' '}
          Knowing something is wrong and being unable to name it, let alone fix it alone. Living at
          a fraction of your actual capacity — not from lack of effort, but from lack of the right
          support.
        </p>

        <p className="body-copy reveal">
          That's what I work with. Not the surface. <strong>The structure underneath it.</strong>
        </p>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// PROBLEM
// ────────────────────────────────────────────────────────────
function Problem() {
  const items = [
    "You're disciplined in the areas people can see — but privately struggling with the ones they can't.",
    "You've tried to think or push your way through it, but the pattern keeps repeating.",
    "You're living at a fraction of your actual capacity — not from lack of effort, but from lack of the right support.",
    "You know information isn't the problem — you've read the books, done the research, tried the protocols.",
    "You're looking for someone who's actually been through it, not someone who only studied it.",
  ];
  return (
    <section className="problem" id="problem">
      <div className="container">
        <div className="eyebrow reveal">Sound Familiar?</div>
        <h2 className="section-heading reveal reveal-delay-1">
          You know something is off —<br />you just can't fix it alone.
        </h2>
        <ul className="problem-list">
          {items.map((t, i) => (
            <li key={i} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>{t}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// PROGRAM
// ────────────────────────────────────────────────────────────
function Program() {
  const cards = [
    {
      t: 'Movement Practice',
      d: 'Custom programming that goes beyond exercise. Movement is the entry point — the place where you learn to pay attention, show up honestly, and build something that is actually yours.',
    },
    {
      t: '1:1 Mentorship',
      d: 'Real dialogue, not check-ins. We work on what is actually going on — in your practice, your habits, your life. The kind of honest conversation that only happens with someone who has been through it.',
    },
    {
      t: 'The Structure Underneath',
      d: 'Philosophy, self-study, and the hard work of examining the patterns that keep you stuck. Not theory — practical tools for rebuilding how you show up in every area of your life.',
    },
    {
      t: 'Sustained Support',
      d: 'Direct access to me between sessions. What saved me was people who stayed. That is what I offer — I am in it with you, not watching from the sidelines.',
    },
  ];
  return (
    <section className="program" id="program">
      <div className="container-wide">
        <div className="eyebrow reveal">The Foundation</div>
        <h2 className="section-heading reveal reveal-delay-1">
          9 weeks to practice the <em>how</em><br />of doing everything with quality.
        </h2>
        <p className="program-lede reveal reveal-delay-2">
          This isn't a fitness program or a self-help protocol. It's a structured mentorship that
          uses movement as the entry point — then works on the structure underneath. How you show up
          physically, in your relationships, and for yourself. We rebuild the pattern, together.
        </p>

        <div className="program-grid">
          {cards.map((c, i) => (
            <div key={i} className="program-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <span className="pc-index">
                {String(i + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
              </span>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </div>
          ))}
        </div>

        <div className="program-meta">
          {[
            { v: '9', l: 'Weeks' },
            { v: '1:1', l: 'Mentorship' },
            { v: <em>Custom</em>, l: 'Programming' },
            { v: <em>Direct</em>, l: 'Access' },
          ].map((m, i) => (
            <div key={i} className="meta-item reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
              <span className="meta-value">{m.v}</span>
              <span className="meta-label">{m.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// FIT
// ────────────────────────────────────────────────────────────
function Fit() {
  const yes = [
    "You're high-functioning on the outside but know something deeper isn't working.",
    "You're willing to be honest — really honest — about where you actually are.",
    "You want support from someone who's lived through the dark part, not just studied it.",
    "You're ready to do the work on the structure underneath, not just the surface.",
  ];
  const no = [
    "You want a workout plan with no self-examination.",
    "You're looking for a quick fix or a 30-day transformation.",
    "You're not ready to look at the patterns you've been avoiding.",
    "You want someone to tell you what to do without asking why.",
  ];
  return (
    <section className="fit" id="fit">
      <div className="container">
        <div className="eyebrow reveal">Is This for You?</div>
        <h2 className="section-heading reveal reveal-delay-1">
          Built for a specific kind of person.
        </h2>
        <div className="fit-columns">
          <div className="fit-col yes reveal reveal-delay-2">
            <h3>This is for you if —</h3>
            <ul>{yes.map((t, i) => <li key={i}>{t}</li>)}</ul>
          </div>
          <div className="fit-col no reveal reveal-delay-3">
            <h3>This is not for you if —</h3>
            <ul>{no.map((t, i) => <li key={i}>{t}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// TESTIMONIALS (placeholder — clearly labeled)
// ────────────────────────────────────────────────────────────
function Testimonials() {
  const slides = [
    {
      q: "I came in thinking I needed a better training program. What I got was someone who could actually see what I was doing — and not doing. Nine weeks later I'm not just moving better. I'm showing up differently everywhere.",
      name: 'M. — Client',
      role: 'Founder · 9-week cohort',
      initial: 'M',
    },
    {
      q: "Carter doesn't let you hide. He also doesn't shame you for the places you've been hiding. That combination is rare, and it's the whole reason the work actually moved me.",
      name: 'J. — Client',
      role: 'Writer · 9-week cohort',
      initial: 'J',
    },
    {
      q: "The movement piece was just the doorway. What I really needed was someone who'd been through the dark part and could name what I was carrying. That's what I found here.",
      name: 'S. — Client',
      role: 'Operator · 9-week cohort',
      initial: 'S',
    },
  ];
  const [i, setI] = useState(0);
  const n = slides.length;
  const next = useCallback(() => setI((x) => (x + 1) % n), [n]);
  const prev = useCallback(() => setI((x) => (x - 1 + n) % n), [n]);

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="testimonials" id="testimonials">
      <div className="container-wide">
        <div className="eyebrow reveal">
          In Their Words
          <span className="t-placeholder-tag">Placeholder — pending real testimonials</span>
        </div>
        <h2 className="section-heading reveal reveal-delay-1">
          What people say after<br />working through it together.
        </h2>

        <div className="t-carousel reveal reveal-delay-2">
          <div className="t-stage">
            {slides.map((s, idx) => (
              <div key={idx} className={`t-slide ${idx === i ? 'active' : ''}`}>
                <p className="t-quote">{s.q}</p>
                <div className="t-attrib">
                  <div className="t-avatar">{s.initial}</div>
                  <div>
                    <div className="t-name">{s.name}</div>
                    <div className="t-role">{s.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="t-controls">
            <div className="t-dots">
              {slides.map((_, idx) => (
                <button key={idx}
                  className={`t-dot ${idx === i ? 'active' : ''}`}
                  onClick={() => setI(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
            <div className="t-nav">
              <button className="t-arrow" onClick={prev} aria-label="Previous">←</button>
              <button className="t-arrow" onClick={next} aria-label="Next">→</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// FINAL CTA
// ────────────────────────────────────────────────────────────
function FinalCTA({ bookingUrl }) {
  return (
    <section className="final-cta" id="apply">
      <div className="reveal">
        <div className="eyebrow">Next Step</div>
        <h2 className="section-heading">
          If this resonates,<br />let's talk.
        </h2>
        <p className="lede">
          The first step is a short conversation — honest, no pitch. Just to see if we're the right
          fit and if I can actually help with what you're dealing with.
        </p>
        <a href={bookingUrl} target="_blank" rel="noreferrer" className="btn-primary">
          Apply for a Discovery Call <span className="arrow">→</span>
        </a>
        <p className="note">Application takes 2 minutes · no cost to apply</p>

        <div className="container-stats">
          <div>
            <span className="cta-stat-value">9 weeks</span>
            <span className="cta-stat-label">Full Commitment</span>
          </div>
          <div>
            <span className="cta-stat-value">1:1</span>
            <span className="cta-stat-label">Mentorship Only</span>
          </div>
          <div>
            <span className="cta-stat-value">Honest</span>
            <span className="cta-stat-label">Conversation First</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// FOOTER
// ────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-name">Carter <em>Twitty</em></div>
        <div className="footer-links">
          <a href="https://www.instagram.com/cartertwitty" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://substack.com/@cartertwitty" target="_blank" rel="noreferrer">Substack</a>
          <a href="#apply">Apply</a>
        </div>
        <div className="footer-rights">© 2026 · Carter Twitty</div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  useReveal, Nav, Progress, CursorAura,
  HeroSplit, HeroCentered, HeroFullbleed,
  Story, Problem, Program, Fit, Testimonials, FinalCTA, Footer,
});
