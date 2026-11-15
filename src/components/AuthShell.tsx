import Image from 'next/image';
import Link from 'next/link';
import { Logo } from './SiteChrome';
import type { CSSProperties, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { CalendarDays, LockKeyhole, MonitorPlay, Star, Unlock } from 'lucide-react';

export const RED = '#C8102E';
export const YELLOW = '#D4A24C';
export const INK = '#0B0507';
// Plain, easy-to-read faces: Poppins for Latin, Mukta picks up Devanagari
export const FONT = "'Poppins', 'Mukta', system-ui, sans-serif";

// Word with an animated red→yellow shine
export function Hot({ children }: { children: ReactNode }) {
  return <span className="ka-hot">{children}</span>;
}

export function BrandLogo() {
  return <Logo size={44} adult={false} className="ka-logo" />;
}

const CDN = 'https://image-kaamaott.b-cdn.net';

// Real series posters — the spotlight cycles through them
const POSTERS = [
  { title: 'Gore Gore Gal', genre: 'Romance', img: `${CDN}/gore_gore_gal-poster.png` },
  { title: 'Farebi Yaar', genre: 'Thriller', img: `${CDN}/farebi_yaar-poster.png` },
  { title: 'Love Guru', genre: 'Comedy', img: `${CDN}/love_guru-poster.png` },
  { title: 'De De Pyar De', genre: 'Romance', img: `${CDN}/de_De_pyar_de-poster.png` },
];
// Each poster holds the spotlight for SLOT seconds; the full loop is SLOT × count
const SLOT = 4;
const CYCLE = SLOT * POSTERS.length;

const PERKS: { icon: LucideIcon; text: string }[] = [
  { icon: MonitorPlay, text: 'Full HD' },
  { icon: CalendarDays, text: 'New every week' },
  { icon: LockKeyhole, text: '100% private' },
];

// Fonts + animations shared by every /auth layout (ka-btn, ka-shake, ka-hot…)
export function AuthStyles() {
  // Share of the loop each poster is fully visible, as keyframe percentages
  const on = 100 / POSTERS.length;
  const fade = on * 0.2;
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Mukta:wght@400;600;700;800&display=swap');
      @keyframes kaRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes kaShine { to { background-position: 200% center; } }
      @keyframes kaGlow { 0%,100% { box-shadow: 0 10px 30px -10px ${RED}cc; } 50% { box-shadow: 0 10px 40px -6px ${YELLOW}aa; } }
      .ka-rise { animation: kaRise .7s cubic-bezier(.22,1,.36,1) both; }
      .ka-hot {
        background: linear-gradient(90deg, #E8344F, ${YELLOW}, #F3D58A, #E8344F);
        background-size: 200% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: kaShine 2.5s linear infinite;
        font-weight: 800;
      }
      @keyframes kaLogoGlow {
        0%,100% { filter: drop-shadow(0 0 8px ${YELLOW}33); }
        50%     { filter: drop-shadow(0 0 16px ${YELLOW}66); }
      }
      .ka-logo { animation: kaLogoGlow 2.4s ease-in-out infinite; }
      .ka-btn {
        background: linear-gradient(90deg, #8E0B22, ${RED}, #A8772B, ${YELLOW}, #A8772B, ${RED}, #8E0B22);
        background-size: 300% auto;
        animation: kaShine 4s linear infinite, kaGlow 2.4s ease-in-out infinite;
      }
      .ka-btn:disabled { animation: none; }
      @keyframes kaShake { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-7px); } 40%,80% { transform: translateX(7px); } }
      .ka-shake { animation: kaShake .4s ease-in-out; }
      @keyframes kaNudge { 0%,100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
      .ka-nudge { animation: kaNudge 1s ease-in-out infinite; }

      /* Spotlight: one poster at a time, cross-fading; staggered by animation-delay */
      @keyframes kaSpot {
        0%                 { opacity: 0; transform: scale(1.04); }
        ${fade}%           { opacity: 1; transform: scale(1); }
        ${on}%             { opacity: 1; }
        ${on + fade}%, 100% { opacity: 0; }
      }
      .ka-spot { opacity: 0; animation: kaSpot ${CYCLE}s ease-in-out infinite; }
      @keyframes kaFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      .ka-float { animation: kaFloat 6s ease-in-out infinite; }
      @keyframes kaBeam { 0%,100% { opacity: .55; } 50% { opacity: .85; } }
      .ka-beam { animation: kaBeam 5s ease-in-out infinite; }
      @keyframes kaRail { to { transform: translateX(-50%); } }
      .ka-rail { animation: kaRail 32s linear infinite; }
      .ka-rail:hover { animation-play-state: paused; }

      /* Premiere searchlights: tall beams swinging from the bottom corners */
      @keyframes kaSweepL { 0%,100% { transform: rotate(-32deg); } 50% { transform: rotate(6deg); } }
      @keyframes kaSweepR { 0%,100% { transform: rotate(32deg); } 50% { transform: rotate(-6deg); } }
      .ka-sweep-l { transform-origin: 50% 100%; animation: kaSweepL 14s ease-in-out infinite; }
      .ka-sweep-r { transform-origin: 50% 100%; animation: kaSweepR 17s ease-in-out infinite; }
      /* Gold dust drifting up and fading */
      @keyframes kaDust {
        0%   { transform: translate3d(0, 0, 0); opacity: 0; }
        15%  { opacity: var(--o); }
        85%  { opacity: var(--o); }
        100% { transform: translate3d(var(--dx), -55vh, 0); opacity: 0; }
      }
      .ka-dust { animation: kaDust var(--t) linear infinite; animation-delay: var(--d); }

      @media (prefers-reduced-motion: reduce) {
        .ka-hot, .ka-btn, .ka-logo, .ka-nudge, .ka-float, .ka-beam, .ka-sweep-l, .ka-sweep-r, .ka-rail { animation: none; }
        .ka-dust { display: none; }
        .ka-spot { animation: none; }
        .ka-spot:first-child { opacity: 1; }
      }
    `}</style>
  );
}

// Fixed pseudo-random dust specks — deterministic so server and client render the same
const DUST = Array.from({ length: 34 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return {
    left: `${(r(1) * 100).toFixed(2)}%`,
    top: `${(55 + r(2) * 50).toFixed(2)}%`,
    size: 1.5 + r(3) * 3,
    o: (0.35 + r(4) * 0.55).toFixed(2),
    t: `${(14 + r(5) * 16).toFixed(1)}s`,
    d: `-${(r(6) * 30).toFixed(1)}s`,
    dx: `${((r(7) - 0.5) * 120).toFixed(0)}px`,
    gold: r(8) > 0.3,
  };
});

// Searchlight beam: a soft cone from the bottom edge, blended additively over the backdrop
function Beam({ side, color }: { side: 'l' | 'r'; color: string }) {
  return (
    <div
      className={`absolute bottom-[-6%] h-[125%] w-[38vw] min-w-[260px] max-w-[560px] ${side === 'l' ? 'ka-sweep-l left-[6%]' : 'ka-sweep-r right-[6%]'}`}
      style={{
        background: `linear-gradient(to top, ${color}, transparent 85%)`,
        clipPath: 'polygon(46% 100%, 54% 100%, 100% 0, 0 0)',
        filter: 'blur(18px)',
        mixBlendMode: 'screen',
      }}
    />
  );
}

// Same backdrop as /auth for other pages (subscription): styles + ambient layer
export function PremiereBackdrop() {
  return (
    <>
      <AuthStyles />
      <Ambient />
    </>
  );
}

// Page backdrop: poster colour wash, premiere searchlights, rising gold dust and film grain
function Ambient() {
  return (
    <div className="fixed inset-0 overflow-hidden" aria-hidden style={{ background: INK }}>
      {POSTERS.map((p, i) => (
        <div key={p.img} className="ka-spot absolute inset-0" style={{ animationDelay: `${i * SLOT}s` }}>
          <Image
            src={p.img}
            alt=""
            fill
            sizes="200px"
            className="object-cover"
            style={{ filter: 'blur(70px) saturate(1.4)', transform: 'scale(1.8)', opacity: 0.55 }}
          />
        </div>
      ))}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(80% 60% at 30% 40%, transparent, ${INK}e6 70%),
            linear-gradient(to bottom, ${INK}66, ${INK}cc 70%, ${INK})`,
        }}
      />

      <Beam side="l" color={`${YELLOW}38`} />
      <Beam side="r" color={`${RED}55`} />

      {/* Glowing stage floor along the bottom edge */}
      <div
        className="absolute inset-x-0 bottom-0 h-[35%]"
        style={{ background: `radial-gradient(60% 100% at 50% 100%, ${RED}40, transparent 70%)` }}
      />

      {DUST.map((s, i) => (
        <span
          key={i}
          className="ka-dust absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: s.gold ? '#F3D58A' : '#ffffff',
            boxShadow: `0 0 ${s.size * 3}px ${s.gold ? YELLOW : '#ffffff'}`,
            ['--o' as string]: s.o,
            ['--t' as string]: s.t,
            ['--d' as string]: s.d,
            ['--dx' as string]: s.dx,
          }}
        />
      ))}

      {/* Fine film grain so the gradients don't band */}
      <svg className="absolute inset-0 h-full w-full opacity-[.07] mix-blend-overlay">
        <filter id="ka-grain">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ka-grain)" />
      </svg>
    </div>
  );
}

function PosterFrame({ children, className = '', style }: { children?: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`absolute aspect-[2/3] overflow-hidden rounded-2xl ${className}`}
      style={{ boxShadow: '0 30px 60px -20px rgba(0,0,0,.9), inset 0 0 0 1px rgba(255,255,255,.08)', ...style }}
    >
      {children}
    </div>
  );
}

// Three-poster stage: two dimmed side posters and a lit centre one that cycles through the series
export function Spotlight({ compact = false }: { compact?: boolean }) {
  const size = compact
    ? 'h-[250px] max-w-[340px] lg:h-[380px] lg:max-w-[460px]'
    : 'h-[250px] max-w-[340px] sm:h-[320px] sm:max-w-[420px] lg:h-[480px] lg:max-w-[560px]';
  return (
    <div className={`relative mx-auto w-full ${size}`} aria-hidden>
      {/* Stage light from above */}
      <div
        className="ka-beam pointer-events-none absolute left-1/2 top-[-30%] h-[130%] w-[90%] -translate-x-1/2"
        style={{
          background: `radial-gradient(50% 60% at 50% 0%, ${YELLOW}40, transparent 70%)`,
          maskImage: 'linear-gradient(to bottom, transparent, #000 40%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 40%)',
        }}
      />

      <PosterFrame className="left-[2%] top-[14%] h-[72%]" style={{ transform: 'rotate(-9deg)', filter: 'brightness(.45) saturate(.8)' }}>
        <Image src={POSTERS[2].img} alt="" fill sizes="(min-width:1024px) 230px, 140px" className="object-cover" />
      </PosterFrame>
      <PosterFrame className="right-[2%] top-[14%] h-[72%]" style={{ transform: 'rotate(9deg)', filter: 'brightness(.45) saturate(.8)' }}>
        <Image src={POSTERS[3].img} alt="" fill sizes="(min-width:1024px) 230px, 140px" className="object-cover" />
      </PosterFrame>

      <div className="ka-float absolute inset-0">
        <PosterFrame
          className="left-1/2 top-0 h-[88%] -translate-x-1/2"
          style={{
            boxShadow: `0 40px 80px -24px #000, 0 0 0 1px ${YELLOW}66, 0 0 70px -10px ${RED}aa`,
          }}
        >
          {POSTERS.map((p, i) => (
            <div key={p.img} className="ka-spot absolute inset-0" style={{ animationDelay: `${i * SLOT}s` }}>
              <Image
                src={p.img}
                alt=""
                fill
                priority={i === 0}
                sizes="(min-width:1024px) 290px, 180px"
                className="object-cover"
              />
              <div
                className="absolute inset-x-0 bottom-0 hidden items-end justify-between gap-2 px-3 pb-3 pt-14 sm:flex"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,.92), transparent)' }}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-extrabold leading-tight sm:text-[15px]">{p.title}</span>
                  <span className="block text-[10px] font-medium text-white/60 sm:text-[11px]">{p.genre} · Original</span>
                </span>
                <span
                  className="shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider"
                  style={{ background: RED }}
                >
                  #{i + 1}
                </span>
              </div>
            </div>
          ))}
        </PosterFrame>
      </div>
    </div>
  );
}

// Endless strip of series posters — "this is what the plan unlocks". List rendered twice so -50% loops seamlessly.
export function PosterRail() {
  const list = [...POSTERS, ...POSTERS];
  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)',
      }}
    >
      <ul className="ka-rail m-0 flex w-max list-none gap-2.5 p-0 py-2">
        {[...list, ...list].map((p, i) => (
          <li
            key={i}
            aria-hidden={i >= POSTERS.length}
            className="relative aspect-[2/3] w-[88px] shrink-0 overflow-hidden rounded-lg"
            style={{ boxShadow: `0 14px 30px -12px #000, inset 0 0 0 1px rgba(255,255,255,.08)` }}
          >
            <Image src={p.img} alt={i < POSTERS.length ? p.title : ''} fill sizes="88px" className="object-cover" />
            <span
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full"
              style={{ background: 'rgba(11,5,7,.75)', border: `1px solid ${YELLOW}66`, color: YELLOW }}
            >
              <Unlock size={10} strokeWidth={2.5} aria-hidden />
            </span>
            <span
              className="absolute inset-x-0 bottom-0 px-1.5 pb-1.5 pt-6"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,.95), transparent)' }}
            >
              <span className="block truncate text-[10px] font-extrabold leading-tight text-white">{p.title}</span>
              <span className="block truncate text-[8px] font-medium text-white/60">{p.genre}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LegalLine() {
  return (
    <p className="text-center text-xs leading-relaxed text-white/55">
      By continuing, you agree to our{' '}
      <Link href="/terms" className="text-white/90 underline underline-offset-2">
        Terms
      </Link>{' '}
      and{' '}
      <Link href="/privacy" className="text-white/90 underline underline-offset-2">
        Privacy Policy
      </Link>
      . Need help?{' '}
      <Link href="/support" className="text-white/90 underline underline-offset-2">
        Contact
      </Link>
    </p>
  );
}

// Shared frame for /auth and /auth/otp: poster spotlight (top on mobile, left on desktop) + solid sign-in panel
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden text-white" style={{ background: INK, fontFamily: FONT }}>
      <AuthStyles />
      <Ambient />

      <div className="relative z-10 mx-auto grid min-h-[100dvh] max-w-6xl grid-cols-1 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10 lg:px-8">
        {/* Spotlight */}
        <section className="flex min-w-0 flex-col items-center justify-end px-4 pt-6 lg:justify-center lg:py-16">
          <p
            className="mb-4 hidden items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[.2em] lg:inline-flex"
            style={{ background: `${RED}26`, color: '#F3D58A', border: `1px solid ${RED}66` }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: RED }} />
            Now streaming
          </p>
          <Spotlight />
          <ul className="mt-10 hidden flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:flex">
            {PERKS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-white/80">
                <Icon size={18} strokeWidth={2.25} style={{ color: YELLOW }} aria-hidden />
                {text}
              </li>
            ))}
            <li className="flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-white/80">
              <Star size={16} fill={YELLOW} stroke="none" aria-hidden />
              Top rated originals
            </li>
          </ul>
        </section>

        {/* Sign-in panel — rises over the spotlight on mobile like a sheet */}
        <section className="relative -mt-8 flex min-w-0 justify-center px-4 pb-8 sm:-mt-6 lg:mt-0 lg:pb-0">
          <div
            className="ka-rise relative w-full max-w-sm overflow-hidden rounded-[28px] p-6 sm:p-7"
            style={{
              background: 'linear-gradient(180deg, rgba(24,10,13,.94), rgba(14,6,8,.97))',
              border: '1px solid rgba(255,255,255,.08)',
              boxShadow: `0 40px 90px -30px #000, 0 0 80px -40px ${RED}`,
            }}
          >
            {/* Red → gold hairline across the top edge */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{ background: `linear-gradient(90deg, transparent, ${RED}, ${YELLOW}, ${RED}, transparent)` }}
            />

            {children}

            <ul className="mt-6 flex items-center justify-between gap-2 border-t border-white/10 pt-4 lg:hidden">
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold text-white/70">
                  <Icon size={14} strokeWidth={2.25} style={{ color: YELLOW }} aria-hidden />
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <LegalLine />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
