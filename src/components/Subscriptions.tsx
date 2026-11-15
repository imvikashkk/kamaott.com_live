'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SupportButton from './SupportButton';
import { HeaderAction, IconBack, SiteHeader } from './SiteChrome';
import { INK, LINE, RED, YELLOW } from '@/lib/brand';
import { FONT, Hot, PosterRail, PremiereBackdrop, Spotlight } from './AuthShell';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, BadgeCheck, CalendarDays, ChevronDown, Clapperboard, Clock, Crown, LockKeyhole, MonitorPlay, ShieldCheck, Smartphone, Zap } from 'lucide-react';

const PERKS: { icon: LucideIcon; text: string }[] = [
  { icon: MonitorPlay, text: 'Full HD' },
  { icon: CalendarDays, text: 'New every week' },
  { icon: LockKeyhole, text: '100% private' },
];
// What the plan gets you — only claims the site already makes elsewhere
const BENEFITS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Clapperboard, title: 'Exclusive Originals', text: 'Web series jo sirf yahan milengi' },
  { icon: CalendarDays, title: 'Har hafte naye episodes', text: 'Library lagatar badhti rehti hai' },
  { icon: MonitorPlay, title: 'Full HD streaming', text: 'Smooth playback, bina rukawat' },
  { icon: Smartphone, title: 'Mobile ya laptop', text: 'Jahan chaho, jab chaho dekho' },
];
const STEPS: { title: string; text: string }[] = [
  { title: 'Plan chuno', text: 'Upar se apna pass select karo' },
  { title: 'Pay karo', text: 'Secure online payment, 1 minute mein' },
  { title: 'Turant dekho', text: 'Payment hote hi poori library unlock' },
];
const FAQS: { q: string; a: string }[] = [
  { q: 'Kya har mahine paise apne aap katenge?', a: 'Nahi. Koi auto-debit nahi hai — sirf ek baar ka payment. Plan khatam hone par chaho to dobara le sakte ho.' },
  { q: 'Plan kab se shuru hoga?', a: 'Payment successful hote hi turant. Plan ke din usi waqt se gine jaate hain.' },
  { q: 'Kis device par dekh sakte hain?', a: 'Mobile aur laptop dono par, browser mein — koi app install karne ki zarurat nahi.' },
  { q: 'Paise kat gaye par plan active nahi hua?', a: 'Upar Support button dabao aur apna mobile number bhejo — hum check karke plan active kar denge.' },
];
const TRUST: { icon: LucideIcon; text: string }[] = [
  { icon: ShieldCheck, text: 'Secure payment' },
  { icon: Zap, text: 'Instant access' },
  { icon: BadgeCheck, text: 'No auto-debit' },
];

// Ticket stamp by plan length, so it survives price changes and reordering
function badgeFor(days: number): string | null {
  if (days === 365) return 'Best value';
  if (days === 30) return 'Most popular';
  return null;
}

// Ticket order by plan length: 7 Days (₹199), 1 Month (₹299), 1 Year (₹399), 2 Days (₹169); anything else after
const ORDER = [7, 30, 365, 2];
const rank = (days: number) => (ORDER.includes(days) ? ORDER.indexOf(days) : ORDER.length);

// "₹1.1/din" — per-day cost makes the long plans' value visible next to the cheap ones
function perDay(price: number, days: number): string | null {
  if (days >= 36500) return 'Ek baar ka payment';
  const v = price / days;
  return `₹${v >= 10 ? Math.round(v) : Number(v.toFixed(1))}/din`;
}

interface ApiPlan {
  id: number;
  name: string;
  price: number;
  original_price: number;
  duration_days: number;
  description: string;
}

interface Plan extends ApiPlan {
  badge: string | null;
  duration: string;
}

function formatDuration(days: number): string {
  if (days >= 36500) return '∞ Lifetime';
  if (days >= 365) return `${Math.round(days / 365)} Year`;
  if (days >= 30)
    return `${Math.round(days / 30)} Month${Math.round(days / 30) > 1 ? 's' : ''}`;
  return `${days} Day${days > 1 ? 's' : ''}`;
}

// Small line under the day count on the ticket stub: 7 → "1 Week", 30 → "1 Month", 365 → "1 Year"
function periodLabel(days: number): string | null {
  const unit = (n: number, w: string) => `${n} ${w}${n > 1 ? 's' : ''}`;
  if (days % 365 === 0) return unit(days / 365, 'Year');
  if (days % 30 === 0) return unit(days / 30, 'Month');
  if (days % 7 === 0) return unit(days / 7, 'Week');
  return null;
}

// "Special offer" strip on the yearly ticket — valid till tonight 11:59 PM, ticking down every second.
// Own component so the 1s tick re-renders only this strip, not the whole page.
function OfferCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  const left = Math.max(0, Math.floor((end.getTime() - now) / 1000));
  const date = new Date(end.getTime() - 1).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const parts: [number, string][] = [
    [Math.floor(left / 3600), 'hrs'],
    [Math.floor((left % 3600) / 60), 'min'],
    [left % 60, 'sec'],
  ];

  return (
    <div
      className="mt-2 inline-flex flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-md px-2 py-1.5"
      style={{ background: `linear-gradient(90deg, ${RED}2e, ${RED}0a)`, border: `1px solid ${RED}55` }}
    >
      <div className="leading-tight">
        <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[.14em]" style={{ color: '#E8566A' }}>
          <Clock size={11} strokeWidth={2.75} className="k-tick" aria-hidden /> Special offer
        </span>
        <span className="block text-[10px] text-white/55">Valid till {date}, 11:59 PM</span>
      </div>
      <div className="flex items-center gap-0.5" role="timer" aria-label="Offer ends in">
        {parts.map(([v, unit], i) => (
          <span key={unit} className="flex items-center gap-0.5">
            {i > 0 && <span className="text-[12px] font-bold text-white/40 -mt-2.5">:</span>}
            <span className="flex flex-col items-center">
              <span
                className="min-w-[24px] rounded-[4px] px-1 py-0.5 text-center text-[13px] font-extrabold leading-none tabular-nums text-white"
                style={{ background: i === 2 ? RED : 'rgba(0,0,0,.45)', border: `1px solid ${i === 2 ? RED : 'rgba(246,236,221,.12)'}` }}
              >
                {String(v).padStart(2, '0')}
              </span>
              <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wider text-white/40">{unit}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Quiet saving strip on the 1 Month ticket (vs renewing the weekly plan for a month) — kept low-key so the yearly offer stays the loudest
function MonthPerks({ month, weekly }: { month: Plan; weekly: Plan | null }) {
  const saving = weekly ? Math.round((weekly.price * month.duration_days) / weekly.duration_days) - month.price : 0;
  if (saving <= 0) return null;
  return (
    <p
      className="m-0 mt-2 inline-block rounded-md px-2 py-1 text-[11px] font-semibold leading-snug text-white/65"
      style={{ background: 'rgba(246,236,221,.05)', border: '1px solid rgba(246,236,221,.12)' }}
    >
      Har hafte recharge se <span style={{ color: `${YELLOW}cc` }}>₹{saving} ki bachat</span>
    </p>
  );
}

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [paying, setPaying] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  // Came from a short plan (expired or about to) — pitch the yearly pass instead
  const [upgradeOffer, setUpgradeOffer] = useState(false);
  const userPicked = useRef(false);
  const router = useRouter();
  const sel = plans.find((p) => p.id === selected) ?? null;
  const yearly = plans.find((p) => p.duration_days === 365) ?? null;

  // Shortest plan selected → offer the next one up if it costs only a little more
  const byDays = [...plans].sort((a, b) => a.duration_days - b.duration_days);
  const nextUp =
    sel && byDays[0]?.id === sel.id && byDays[1] && byDays[1].price - sel.price <= 100 ? byDays[1] : null;

  const pick = (id: number) => {
    userPicked.current = true;
    setSelected(id);
  };

  useEffect(() => {
    if (upgradeOffer && yearly && !userPicked.current) setSelected(yearly.id);
  }, [upgradeOffer, yearly]);

  // Back from the gateway's checkout restores this page from bfcache with the button still spinning
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setPaying(false);
    };
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  useEffect(() => {
    // Check subscription via API (cookie-based auth)
    fetch('/api/user/profile')
      .then(async (r) => {
        if (r.status === 401) {
          // Token invalid/expired — force re-login
          await fetch('/api/auth/logout', { method: 'POST' });
          localStorage.removeItem('mr_mobile');
          localStorage.removeItem('mr_pending_plan');
          window.location.href = '/auth';
          return;
        }
        const data = await r.json();
        // Subscription got activated in the background (e.g. checkout left before confirmation);
        // the response just refreshed the cookies, so go home
        if (data.success && data.subActivated) {
          localStorage.removeItem('mr_campaign');
          localStorage.removeItem('mr_meta_campaign_id');
          localStorage.removeItem('mr_meta_campaign_name');
          ['mr_meta_adset_id', 'mr_meta_adset_name', 'mr_meta_ad_id', 'mr_meta_ad_name'].forEach((k) => localStorage.removeItem(k));
          window.location.replace('/');
          return;
        }
        if (data.success && data.data.plan_name && data.data.sub_status === 'active') {
          setIsSubscribed(true);
        }
        if (data.success && data.data.last_plan_days && data.data.last_plan_days < 30) {
          setUpgradeOffer(true);
        }
      })
      .catch(() => setIsSubscribed(false));

    fetch('/api/plans')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const mapped: Plan[] = data.data
            .map((p: ApiPlan) => ({
              ...p,
              duration: formatDuration(p.duration_days),
              badge: badgeFor(p.duration_days),
            }))
            .sort((a: Plan, b: Plan) => rank(a.duration_days) - rank(b.duration_days));
          setPlans(mapped);
          // ?plan=year comes from the upgrade card on /profile
          if (new URLSearchParams(window.location.search).get('plan') === 'year') setUpgradeOffer(true);
          // Default to the 1 Month plan
          const def = mapped.find((p) => p.duration_days === 30) ?? mapped[0];
          setSelected(def?.id ?? null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('mr_mobile');
    localStorage.removeItem('mr_pending_plan');
    window.location.href = '/auth';
  };

  const handlePay = async () => {
    setError('');

    if (!selected) {
      setError('Please select a plan first.');
      return;
    }

    setPaying(true);
    try {
      const getCookie = (name: string) =>
        document.cookie.split('; ').find((r) => r.startsWith(name + '='))?.split('=')[1] ?? '';

      const slug             = localStorage.getItem('mr_campaign') ?? '';
      const metaCampaignId   = localStorage.getItem('mr_meta_campaign_id') ?? '';
      const metaCampaignName = localStorage.getItem('mr_meta_campaign_name') ?? '';
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selected,
          fbp: getCookie('_fbp'),
          fbc: getCookie('_fbc'),
          campaignSlug: slug,
          metaCampaignId:   metaCampaignId   || null,
          metaCampaignName: metaCampaignName || null,
          metaAdsetId:      localStorage.getItem('mr_meta_adset_id')   || null,
          metaAdsetName:    localStorage.getItem('mr_meta_adset_name') || null,
          metaAdId:         localStorage.getItem('mr_meta_ad_id')      || null,
          metaAdName:       localStorage.getItem('mr_meta_ad_name')    || null,
        }),
      });
      if (res.status === 401) {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.clear();
        window.location.href = '/auth';
        return;
      }
      const data = await res.json();
      if (data.success) {
        // Hand off to SabPaisa's hosted checkout — it returns the browser to /api/payment/callback
        window.location.href = data.data.redirectUrl;
      } else {
        setError(data.message ?? 'Payment failed. Try again.');
        setPaying(false);
      }
    } catch {
      setError('Could not start the payment. Please try again.');
      setPaying(false);
    }
  };

  // Plan name + price and the pay button — sticky bar on mobile, inline at the end of the plan panel on desktop
  const payRow = (
    <div className="flex flex-col gap-1.5">
      {error && <p className="m-0 text-[12px] text-center" style={{ color: '#f87171' }}>{error}</p>}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 text-[10px] font-bold uppercase tracking-[.2em] text-white/45">Your plan</p>
          <p className="m-0 mt-0.5 text-[15px] font-bold text-white truncate">
            {sel ? (
              <>
                {sel.name} <span style={{ color: YELLOW }}>₹{sel.price}</span>
              </>
            ) : (
              '—'
            )}
          </p>
        </div>
        <button
          onClick={handlePay}
          disabled={paying || !sel}
          className={`${sel && !paying ? 'ka-btn' : ''} shrink-0 h-12 px-6 rounded-2xl text-[15px] font-extrabold text-white cursor-pointer disabled:cursor-wait disabled:opacity-70 inline-flex items-center gap-2 transition-transform active:scale-[.98]`}
          style={{ border: 0, background: sel && !paying ? undefined : 'rgba(200,16,46,.45)', textShadow: '0 1px 3px rgba(0,0,0,.5)' }}
        >
          {paying ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent" style={{ animation: 'kSpin .8s linear infinite' }} />
              Please wait...
            </>
          ) : (
            <>
              Unlock ₹{sel?.price ?? ''}
              <ArrowRight size={18} strokeWidth={2.5} className="ka-nudge" aria-hidden />
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <main className="k-body relative min-h-[100dvh] overflow-x-hidden pb-40 lg:pb-12" style={{ background: INK }}>
      <style>{`
        .k-ticket { transition: border-color .2s ease, box-shadow .25s ease, transform .2s ease; }
        .k-ticket:hover { transform: translateY(-1px); }
        .k-ticket:focus-visible { box-shadow: 0 0 0 3px rgba(212,162,76,.35); }
        @keyframes kSpin { to { transform: rotate(360deg); } }
        @keyframes kTick { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
        .k-tick { animation: kTick 1s steps(2, jump-none) infinite; }
        .k-faq summary::-webkit-details-marker { display: none; }
        @media (prefers-reduced-motion: reduce) { .k-tick { animation: none; } .k-ticket:hover { transform: none; } }
      `}</style>

      {/* Same premiere backdrop as /auth: poster colour wash, searchlights, gold dust */}
      <PremiereBackdrop />

      <SiteHeader
        right={
          <>
            {isSubscribed && (
              <HeaderAction href="/">
                <IconBack s={14} /> <span className="hidden sm:inline">Home</span>
              </HeaderAction>
            )}
            <SupportButton />
            <HeaderAction onClick={handleLogout}>Logout</HeaderAction>
          </>
        }
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 pt-4 md:pt-10 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-12 lg:px-8">
        {/* ── Left: pitch + poster spotlight (spotlight on desktop only) ── */}
        <section className="min-w-0 lg:sticky lg:top-24">
          <div className="ka-rise text-center lg:text-left">
            <p
              className="m-0 hidden items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[.2em] lg:inline-flex"
              style={{ background: `${RED}26`, color: '#F3D58A', border: `1px solid ${RED}66` }}
            >
              <Crown size={13} strokeWidth={2.5} aria-hidden /> Go Premium
            </p>
            <h1 className="m-0 text-[26px] font-extrabold leading-tight text-white md:text-[38px] lg:mt-4" style={{ fontFamily: FONT }}>
              Choose your <Hot>plan</Hot>
            </h1>
            <p className="m-0 mt-2 hidden text-[14px] text-white/65 lg:block">
              Unlock the full library · Watch on mobile or laptop, anywhere
            </p>
            <p className="m-0 mt-1.5 inline-flex items-center gap-2 text-[12px] font-semibold text-white/80 lg:mt-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full opacity-60" style={{ background: '#22c55e' }} />
                <span className="relative h-2 w-2 rounded-full" style={{ background: '#22c55e' }} />
              </span>
              1 Lakh+ members abhi active hain
            </p>
          </div>

          {/* Mobile: what the plan unlocks */}
          <div className="ka-rise mt-3 lg:hidden">
            <p className="m-0 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-[.14em] text-white/70">
              <Crown size={13} strokeWidth={2.5} style={{ color: YELLOW }} aria-hidden />
              Plan lete hi ye sab <span style={{ color: YELLOW }}>unlock</span>
            </p>
            <div className="-mx-4">
              <PosterRail />
            </div>
          </div>

          <div className="mt-10 hidden lg:block">
            <Spotlight compact />
            <ul className="m-0 mt-8 flex list-none flex-wrap items-center justify-center gap-x-6 gap-y-2 p-0">
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-white/80">
                  <Icon size={18} strokeWidth={2.25} style={{ color: YELLOW }} aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Right: plan panel ── */}
        <section className="min-w-0">
          <div
            className="ka-rise relative overflow-hidden rounded-[28px] p-4 sm:p-6"
            style={{
              background: 'linear-gradient(180deg, rgba(24,10,13,.94), rgba(14,6,8,.97))',
              border: '1px solid rgba(255,255,255,.08)',
              boxShadow: `0 40px 90px -30px #000, 0 0 80px -40px ${RED}`,
            }}
          >
            {/* Red → gold hairline across the top edge, same as the sign-in panel */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{ background: `linear-gradient(90deg, transparent, ${RED}, ${YELLOW}, ${RED}, transparent)` }}
            />

            {/* ── Upgrade offer for short-plan users ── */}
            {upgradeOffer && yearly && (
              <div
                className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-3"
                style={{ background: 'rgba(212,162,76,.08)', border: `1.5px dashed ${YELLOW}` }}
              >
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-[14px] font-extrabold text-white">
                    {isSubscribed ? 'Upgrade karo' : 'Wapas aane ka shukriya!'} · 1 Year sirf <span style={{ color: YELLOW }}>₹{yearly.price}</span>
                  </p>
                  <p className="m-0 mt-0.5 text-[12px] text-white/55">
                    {perDay(yearly.price, yearly.duration_days)} · baar baar recharge ka jhanjhat khatam
                    {isSubscribed && ' · bache hue din jud jayenge'}
                  </p>
                </div>
                {selected !== yearly.id && (
                  <button
                    onClick={() => pick(yearly.id)}
                    className="shrink-0 h-9 px-3 rounded-xl text-[12px] font-extrabold cursor-pointer"
                    style={{ background: YELLOW, color: INK, border: 0 }}
                  >
                    Chuno
                  </button>
                )}
              </div>
            )}

            {/* ── Plans ── */}
            <div className="flex flex-col gap-3 pt-2" role="radiogroup" aria-label="Plans">
              {loading &&
                [0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-[92px] rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,.04)', border: `1px solid ${LINE}` }} />
                ))}

              {!loading &&
                plans.map((plan, i) => {
                  const isSel = selected === plan.id;
                  const off =
                    plan.original_price > plan.price
                      ? Math.round(((plan.original_price - plan.price) / plan.original_price) * 100)
                      : 0;
                  return (
                    <div
                      key={plan.id}
                      role="radio"
                      aria-checked={isSel}
                      tabIndex={0}
                      onClick={() => pick(plan.id)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pick(plan.id)}
                      className="k-ticket ka-rise relative flex items-stretch rounded-2xl cursor-pointer select-none outline-none"
                      style={{
                        animationDelay: `${0.05 + i * 0.06}s`,
                        background: isSel ? 'linear-gradient(90deg, rgba(212,162,76,.10), rgba(200,16,46,.08))' : 'rgba(255,255,255,.035)',
                        border: `1.5px solid ${isSel ? YELLOW : 'rgba(255,255,255,.09)'}`,
                        boxShadow: isSel ? `0 0 0 1px ${YELLOW}40, 0 18px 50px -20px ${RED}` : 'none',
                      }}
                    >
                      {/* Stub */}
                      <div
                        className="w-[88px] sm:w-[104px] shrink-0 flex flex-col items-center justify-center rounded-l-[14px] py-3"
                        style={{
                          background: isSel ? 'linear-gradient(180deg, #F3D58A, #D4A24C 55%, #A8772B)' : 'rgba(255,255,255,.04)',
                          color: isSel ? INK : '#fff',
                        }}
                      >
                        {plan.duration_days >= 36500 ? (
                          <>
                            <span className="k-display text-[34px] sm:text-[38px] leading-none">{plan.duration.split(' ')[0]}</span>
                            <span className="text-[10px] font-bold tracking-[.18em] uppercase mt-1 opacity-70">
                              {plan.duration.split(' ').slice(1).join(' ')}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="k-display text-[34px] sm:text-[38px] leading-none">{plan.duration_days}</span>
                            <span className="text-[10px] font-bold tracking-[.18em] uppercase mt-1 opacity-70">
                              Day{plan.duration_days > 1 ? 's' : ''}
                            </span>
                            {periodLabel(plan.duration_days) && (
                              <span className="text-[10px] font-semibold mt-0.5 opacity-60">{periodLabel(plan.duration_days)}</span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Perforation */}
                      <div className="w-0 shrink-0" style={{ borderLeft: `2px dashed ${isSel ? `${YELLOW}66` : 'rgba(255,255,255,.1)'}` }} />

                      {/* Body */}
                      <div className="flex-1 min-w-0 flex items-center gap-3 px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className={`k-display text-[30px] leading-none ${isSel ? 'k-gold' : 'text-white'}`}>₹{plan.price}</span>
                            {off > 0 && (
                              <>
                                <span className="text-[13px] text-white/40 line-through">₹{plan.original_price}</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white" style={{ background: RED }}>
                                  {off}% OFF
                                </span>
                              </>
                            )}
                          </div>
                          <p className="m-0 mt-1 text-[12px] font-semibold text-white/85">
                            {plan.name}
                            <span className="ml-2 font-bold" style={{ color: plan.duration_days >= 30 ? YELLOW : 'rgba(246,236,221,.45)' }}>
                              {perDay(plan.price, plan.duration_days)}
                            </span>
                          </p>
                          {plan.description && <p className="m-0 mt-0.5 text-[12px] text-white/50 leading-snug">{plan.description}</p>}
                          {plan.duration_days === 365 && <OfferCountdown />}
                          {plan.duration_days === 30 && (
                            <MonthPerks month={plan} weekly={plans.find((p) => p.duration_days === 7) ?? null} />
                          )}
                        </div>

                        {/* Radio */}
                        <span
                          className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center transition-colors"
                          style={{
                            border: `2px solid ${isSel ? YELLOW : 'rgba(246,236,221,.25)'}`,
                            boxShadow: isSel ? `0 0 14px ${YELLOW}66` : 'none',
                          }}
                        >
                          {isSel && <span className="w-3 h-3 rounded-full" style={{ background: YELLOW }} />}
                        </span>
                      </div>

                      {/* Badge */}
                      {plan.badge && (
                        <span
                          className="absolute -top-2.5 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[.12em] pointer-events-none text-white"
                          style={{ background: `linear-gradient(90deg, ${RED}, #E8344F)`, boxShadow: `0 4px 14px -4px ${RED}` }}
                        >
                          {plan.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Nudge off the shortest plan */}
            {sel && nextUp && (
              <div className="mt-3 rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: `${RED}14`, border: `1.5px solid ${RED}88` }}>
                <p className="m-0 min-w-0 flex-1 text-[13px] text-white/85 leading-snug">
                  Sirf <b style={{ color: YELLOW }}>₹{nextUp.price - sel.price}</b> aur mein{' '}
                  <b className="text-white">{nextUp.duration}</b> ka pass —{' '}
                  {Math.round(nextUp.duration_days / sel.duration_days)}x zyada din
                </p>
                <button
                  onClick={() => pick(nextUp.id)}
                  className="shrink-0 h-9 px-3 rounded-xl text-[12px] font-extrabold cursor-pointer"
                  style={{ background: YELLOW, color: INK, border: 0 }}
                >
                  ₹{nextUp.price} lo
                </button>
              </div>
            )}

            {/* Trust */}
            <ul className="m-0 mt-5 flex list-none items-center justify-between gap-2 border-t border-white/10 p-0 pt-4">
              {TRUST.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold text-white/70 sm:text-[12px]">
                  <Icon size={14} strokeWidth={2.25} style={{ color: YELLOW }} aria-hidden />
                  {text}
                </li>
              ))}
            </ul>

            {/* Desktop: pay right inside the panel */}
            <div className="mt-5 hidden border-t border-white/10 pt-5 lg:block">{payRow}</div>
          </div>

          {/* ── What you get ── */}
          <div className="mt-10">
            <h2 className="m-0 text-center text-[20px] font-extrabold text-white lg:text-left" style={{ fontFamily: FONT }}>
              Aapko kya <Hot>milega</Hot>
            </h2>
            <ul className="m-0 mt-4 grid list-none grid-cols-2 gap-3 p-0">
              {BENEFITS.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="rounded-2xl p-3.5"
                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ background: `${RED}2e`, color: YELLOW, boxShadow: `inset 0 0 0 1px ${RED}55` }}
                  >
                    <Icon size={18} strokeWidth={2.25} aria-hidden />
                  </span>
                  <span className="mt-2.5 block text-[14px] font-bold leading-tight text-white">{title}</span>
                  <span className="mt-1 block text-[12px] leading-snug text-white/60">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── How it works ── */}
          <div className="mt-10">
            <h2 className="m-0 text-center text-[20px] font-extrabold text-white lg:text-left" style={{ fontFamily: FONT }}>
              3 steps mein <Hot>shuru</Hot>
            </h2>
            <ol className="m-0 mt-4 grid list-none gap-3 p-0">
              {STEPS.map((st, i) => (
                <li key={st.title} className="relative flex items-center gap-3.5">
                  {i < STEPS.length - 1 && (
                    <span aria-hidden className="absolute left-[17px] top-9 h-[calc(100%-12px)] w-px" style={{ background: `linear-gradient(${YELLOW}88, transparent)` }} />
                  )}
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold"
                    style={{ background: 'linear-gradient(180deg, #F3D58A, #D4A24C 55%, #A8772B)', color: INK }}
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold text-white">{st.title}</span>
                    <span className="block text-[12px] text-white/60">{st.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* ── FAQ ── */}
          <div className="mt-10">
            <h2 className="m-0 text-center text-[20px] font-extrabold text-white lg:text-left" style={{ fontFamily: FONT }}>
              Aapke <Hot>sawaal</Hot>
            </h2>
            <div className="mt-4 flex flex-col gap-2.5">
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="k-faq group rounded-2xl px-4 py-3.5"
                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-bold text-white">
                    {f.q}
                    <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" style={{ color: YELLOW }} aria-hidden />
                  </summary>
                  <p className="m-0 mt-2 text-[13px] leading-relaxed text-white/65">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Closing nudge back to the plans */}
          <div className="mt-8 mb-2 text-center">
            <button
              onClick={() => document.querySelector('[role=radiogroup]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold cursor-pointer"
              style={{ background: `${YELLOW}1a`, color: '#F3D58A', border: `1px solid ${YELLOW}55` }}
            >
              <Crown size={14} strokeWidth={2.5} aria-hidden /> Plans dobara dekho
            </button>
          </div>
        </section>
      </div>

      {/* Mobile: sticky pay bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 px-4 pt-3 pb-[max(.75rem,env(safe-area-inset-bottom))] lg:hidden"
        style={{
          background: 'rgba(11,5,7,.88)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderTop: '1px solid rgba(255,255,255,.08)',
        }}
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${RED}, ${YELLOW}, ${RED}, transparent)` }}
        />
        <div className="mx-auto max-w-xl">
          {payRow}
          <p className="m-0 mt-1.5 flex items-center justify-center gap-3 text-[10px] font-semibold text-white/50">
            <span className="flex items-center gap-1"><Zap size={11} style={{ color: YELLOW }} aria-hidden /> Instant access</span>
            <span className="flex items-center gap-1"><BadgeCheck size={11} style={{ color: YELLOW }} aria-hidden /> No auto-debit</span>
            <span className="flex items-center gap-1"><ShieldCheck size={11} style={{ color: YELLOW }} aria-hidden /> Secure</span>
          </p>
        </div>
      </div>
    </main>
  );
}
