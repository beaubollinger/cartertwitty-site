/* global React */
const { useEffect, useState: useStateT } = React;

function TweaksPanel({ tweaks, setTweak, active, onClose }) {
  if (!active) return null;
  const accents = [
    { name: 'Burnt Orange', value: '#E87534' },
    { name: 'Clay', value: '#C9623C' },
    { name: 'Ember', value: '#D4843E' },
    { name: 'Sage', value: '#8FA78A' },
    { name: 'Stone', value: '#A8A29E' },
  ];
  const fonts = [
    { label: 'Playfair', value: 'Playfair Display' },
    { label: 'Fraunces', value: 'Fraunces' },
    { label: 'Cormorant', value: 'Cormorant Garamond' },
  ];
  const heroes = [
    { label: 'Split', value: 'split' },
    { label: 'Centered', value: 'centered' },
    { label: 'Full-bleed', value: 'fullbleed' },
  ];
  const motions = [
    { label: 'Tasteful', value: 'tasteful' },
    { label: 'Minimal', value: 'minimal' },
  ];

  return (
    <div className="tweaks-panel">
      <div className="tweaks-header">
        <span className="tweaks-title">Tweaks</span>
        <button className="tweaks-close" onClick={onClose} aria-label="Close tweaks">×</button>
      </div>

      <div className="tweak-group">
        <label className="tweak-label">Accent</label>
        <div className="tweak-swatches">
          {accents.map((a) => (
            <button key={a.value}
              title={a.name}
              className={`tweak-swatch ${tweaks.accent === a.value ? 'active' : ''}`}
              style={{ background: a.value }}
              onClick={() => setTweak('accent', a.value)} />
          ))}
        </div>
      </div>

      <div className="tweak-group">
        <label className="tweak-label">Hero Layout</label>
        <div className="tweak-options">
          {heroes.map((h) => (
            <button key={h.value}
              className={`tweak-chip ${tweaks.heroVariant === h.value ? 'active' : ''}`}
              onClick={() => setTweak('heroVariant', h.value)}>{h.label}</button>
          ))}
        </div>
      </div>

      <div className="tweak-group">
        <label className="tweak-label">Heading Font</label>
        <div className="tweak-options">
          {fonts.map((f) => (
            <button key={f.value}
              className={`tweak-chip ${tweaks.headingFont === f.value ? 'active' : ''}`}
              onClick={() => setTweak('headingFont', f.value)}>{f.label}</button>
          ))}
        </div>
      </div>

      <div className="tweak-group">
        <label className="tweak-label">Motion</label>
        <div className="tweak-options">
          {motions.map((m) => (
            <button key={m.value}
              className={`tweak-chip ${tweaks.motion === m.value ? 'active' : ''}`}
              onClick={() => setTweak('motion', m.value)}>{m.label}</button>
          ))}
        </div>
      </div>

      <div className="tweak-group">
        <div className="tweak-toggle">
          <label className="tweak-label" style={{ marginBottom: 0 }}>Show Testimonials</label>
          <button className={`tweak-switch ${tweaks.showTestimonials ? 'on' : ''}`}
            onClick={() => setTweak('showTestimonials', !tweaks.showTestimonials)}
            aria-label="Toggle testimonials" />
        </div>
      </div>
    </div>
  );
}

function useTweaks() {
  const [tweaks, setTweaks] = useStateT(window.TWEAK_DEFAULTS);
  const [active, setActive] = useStateT(false);

  // apply CSS vars + body classes whenever tweaks change
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', tweaks.accent);
    // derive hover + soft variants
    root.style.setProperty('--accent-hover', tweaks.accent);
    root.style.setProperty('--accent-soft', hexA(tweaks.accent, 0.12));
    root.style.setProperty('--accent-line', hexA(tweaks.accent, 0.35));
    root.style.setProperty('--heading-font', `'${tweaks.headingFont}', serif`);
    document.body.classList.toggle('motion-minimal', tweaks.motion === 'minimal');
  }, [tweaks]);

  // wire up edit mode protocol
  useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setActive(true);
      if (d.type === '__deactivate_edit_mode') setActive(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const setTweak = (k, v) => {
    setTweaks((t) => {
      const next = { ...t, [k]: v };
      try {
        window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
      } catch (_) {}
      return next;
    });
  };

  return { tweaks, setTweak, active, setActive };
}

function hexA(hex, a) {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

Object.assign(window, { TweaksPanel, useTweaks });
