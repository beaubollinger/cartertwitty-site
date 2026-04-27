/* global React, ReactDOM */
const { useEffect: useEffectA, useRef: useRefA } = React;

function App() {
  const { tweaks, setTweak, active, setActive } = window.useTweaks();
  const rootRef = useRefA(null);

  // IntersectionObserver for reveal elements (single global)
  useEffectA(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    const wire = () => {
      document.querySelectorAll('.reveal:not(.visible):not(.observed)').forEach((el) => {
        el.classList.add('observed');
        io.observe(el);
      });
    };
    wire();
    // re-wire briefly after layout shifts (tweak changes can re-mount sections)
    const t = setTimeout(wire, 120);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [tweaks.heroVariant, tweaks.showTestimonials]);

  const Hero =
    tweaks.heroVariant === 'centered' ? window.HeroCentered
    : tweaks.heroVariant === 'fullbleed' ? window.HeroFullbleed
    : window.HeroSplit;

  return (
    <div ref={rootRef}>
      <window.Progress />
      <window.CursorAura />
      <window.Nav bookingUrl={tweaks.bookingUrl} />
      <Hero bookingUrl={tweaks.bookingUrl} />
      <window.Story />
      <window.Problem />
      <window.Program />
      <window.Fit />
      {tweaks.showTestimonials && <window.Testimonials />}
      <window.FinalCTA bookingUrl={tweaks.bookingUrl} />
      <window.Footer />
      <window.TweaksPanel
        tweaks={tweaks}
        setTweak={setTweak}
        active={active}
        onClose={() => setActive(false)}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
