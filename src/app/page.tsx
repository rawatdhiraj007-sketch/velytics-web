"use client";
import Link from "next/link";
import {
  TrendingUp, Package, Users, DollarSign, ShoppingCart, Activity,
  Factory, Megaphone, Truck, Landmark, UtensilsCrossed, GraduationCap,
  ShieldCheck, Zap, BarChart3, Database, FileSpreadsheet, FileText,
  Presentation, Image as ImageIcon, Video as VideoIcon, Mail, EyeOff,
  Lock, Check, Sparkles, MapPin,
} from "lucide-react";

const NAV_LINKS = [["Analytics", "#analytics"], ["Privacy", "#privacy"], ["How it works", "#how"], ["Pricing", "#pricing"]];

const MODULES = [
  { Icon: TrendingUp,     name: "Sales",         desc: "Revenue, targets, forecasts",  color: "#818cf8" },
  { Icon: Package,        name: "Inventory",     desc: "Stock, reorder, dead stock",    color: "#fbbf24" },
  { Icon: DollarSign,     name: "Finance",       desc: "P&L, budgets, cash flow",       color: "#38bdf8" },
  { Icon: ShoppingCart,   name: "Retail",        desc: "Orders, returns, channels",     color: "#a78bfa" },
  { Icon: Users,          name: "HR & Payroll",  desc: "Attrition, pay gap, headcount", color: "#34d399" },
  { Icon: Truck,          name: "Logistics",     desc: "On-time, damage, route cost",   color: "#fb923c" },
  { Icon: UtensilsCrossed,name: "Restaurant",    desc: "Food cost, waste, occupancy",   color: "#facc15" },
  { Icon: Activity,       name: "Healthcare",    desc: "Readmission, payer, beds",      color: "#fb7185" },
  { Icon: Factory,        name: "Manufacturing", desc: "OEE, defects, downtime",        color: "#94a3b8" },
  { Icon: Megaphone,      name: "Marketing",     desc: "ROAS, CAC, funnel",             color: "#f472b6" },
  { Icon: GraduationCap,  name: "Education",     desc: "Pass rate, attendance, fees",   color: "#c084fc" },
  { Icon: Landmark,       name: "Banking",       desc: "NPA, collection, overdue",      color: "#22d3ee" },
];

const FILETYPES = [
  { Icon: FileSpreadsheet, label: "Excel / CSV", color: "#10b981" },
  { Icon: FileText,        label: "PDF",         color: "#ef4444" },
  { Icon: Presentation,    label: "Word / PPT",  color: "#3b82f6" },
  { Icon: ImageIcon,       label: "Photos",      color: "#a855f7" },
  { Icon: VideoIcon,       label: "Video",       color: "#f59e0b" },
  { Icon: Mail,            label: "Email",       color: "#06b6d4" },
];

const PRIVACY_FEATURES = [
  { Icon: MapPin,      title: "Finds the hidden stuff",  desc: "GPS location in photos & videos, document authors, IP addresses in emails, PDF redaction failures, hidden sheets — the things you can't see." },
  { Icon: EyeOff,      title: "Anonymize, don't delete", desc: "Replace names, emails & IDs with consistent fake values — your data stays fully usable for analysis, just anonymous." },
  { Icon: ShieldCheck, title: "GDPR-safe to share",      desc: "A plain-English verdict on every file, plus a downloadable Privacy & Compliance report. Supports GDPR · DPDP · CCPA." },
];

const TRUST = [
  { Icon: Lock,        title: "Never stored",   desc: "Every file is processed in memory and deleted immediately. We never keep your data.", color: "#34d399" },
  { Icon: Zap,         title: "Real maths, no AI guesses", desc: "Deterministic, auditable statistics — not a chatbot making things up.", color: "#fbbf24" },
  { Icon: BarChart3,   title: "Any file, any mess", desc: "Messy headers, blanks, mixed formats, German/Spanish columns — it just works.", color: "#818cf8" },
];

const STEPS = [
  { n: "01", title: "Upload",  desc: "Drop any file — spreadsheet, PDF, Word, photo, video or email. Any size, any mess.", icon: "↑" },
  { n: "02", title: "We check", desc: "Auto-clean + analyse for dashboards, OR scan for hidden private data — your choice.", icon: "✦" },
  { n: "03", title: "You review", desc: "Plain-English insights and a clear report of exactly what we found.", icon: "◈" },
  { n: "04", title: "Decide", desc: "Download a dashboard report, or a clean, safe-to-share copy of your file.", icon: "→" },
];

const PRICING = [
  { name: "Free", price: "€0", period: "forever", highlight: false, cta: "Start free",
    features: ["All 12 industry dashboards", "Auto-clean + data-health score", "Privacy scan & report — every file type", "Basic metadata removal", "Excel / CSV export"] },
  { name: "Pro", price: "€29", period: "/month", highlight: true, cta: "Start free trial",
    features: ["Everything in Free", "Anonymize — keep data usable", "Video & Email metadata cleaning", "Privacy & Compliance reports (PDF)", "Excel reports with charts", "Unlimited files · priority support"] },
  { name: "Business", price: "€99", period: "/month", highlight: false, cta: "Contact sales",
    features: ["Everything in Pro", "Up to 5 team seats", "Batch / bulk processing", "GDPR compliance exports", "Dedicated support"] },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060611] text-slate-200">

      {/* ── Aurora background ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="aurora-1 absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-indigo-600/40 blur-[140px]" />
        <div className="aurora-2 absolute top-1/4 right-0 h-[560px] w-[560px] rounded-full bg-fuchsia-600/30 blur-[150px]" />
        <div className="aurora-3 absolute bottom-0 left-1/4 h-[520px] w-[520px] rounded-full bg-sky-500/30 blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-[160px]" />
      </div>
      <div className="grid-overlay pointer-events-none fixed inset-0 z-0 opacity-60" />

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/40">
              <span className="text-xs font-black text-white">V</span>
            </div>
            <span className="text-lg font-black tracking-tight text-white">Velytics</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map(([l, href]) => (
              <a key={l} href={href} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/app" className="text-sm font-semibold text-slate-300 transition-colors hover:text-white">Sign in</Link>
            <Link href="/app" className="rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition-all hover:shadow-fuchsia-500/50">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 px-6 pb-24 pt-36">
        <div className="mx-auto max-w-5xl text-center">
          <div className="float-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-200 backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.7)]" />
            Analytics + Privacy · for non-technical teams
          </div>
          <h1 className="float-up mb-6 text-balance text-6xl font-black leading-[0.95] tracking-tighter text-white md:text-7xl" style={{ animationDelay: "0.05s" }}>
            Your data,<br />made <span className="gradient-text">trustworthy</span>
          </h1>
          <p className="float-up mx-auto mb-10 max-w-2xl text-xl font-medium leading-relaxed text-slate-400" style={{ animationDelay: "0.1s" }}>
            Turn any messy file into a clear dashboard — and <span className="font-semibold text-white">strip the hidden private data before you share it.</span><br />
            No coding. No data team.
          </p>
          <div className="float-up mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: "0.15s" }}>
            <Link href="/app" className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-fuchsia-500/40 transition-all hover:-translate-y-0.5 hover:shadow-fuchsia-500/60 sm:w-auto">
              Start for free →
            </Link>
            <a href="#how" className="w-full rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10 sm:w-auto">
              See how it works
            </a>
          </div>
          <div className="float-up flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-slate-500" style={{ animationDelay: "0.2s" }}>
            {[["12", "Industries"], ["6", "File types scanned"], ["GDPR", "Safe to share"], ["60s", "To insight"]].map(([n, l]) => (
              <div key={l} className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{n}</span>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two tools ── */}
      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Analytics */}
            <div className="glass-strong rounded-3xl p-8 ring-1 ring-white/10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/40">
                <BarChart3 size={22} className="text-white" />
              </div>
              <h3 className="mb-2 text-2xl font-black text-white">Analytics &amp; Dashboards</h3>
              <p className="mb-5 text-sm leading-relaxed text-slate-400">Upload any business file — we auto-clean it and build the dashboard your industry actually needs: KPIs, trends, forecasts, alerts and a polished Excel report.</p>
              <ul className="space-y-2 text-sm text-slate-300">
                {["12 industry engines (Sales, Finance, HR…)", "Plain-English “At a glance” summary", "Edit data → re-analyse instantly", "Excel report with native charts"].map(f => (
                  <li key={f} className="flex items-start gap-2"><Check size={15} className="mt-0.5 shrink-0 text-indigo-400" /> {f}</li>
                ))}
              </ul>
            </div>
            {/* Privacy */}
            <div className="glass-strong rounded-3xl p-8 ring-1 ring-white/10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/40">
                <ShieldCheck size={22} className="text-white" />
              </div>
              <h3 className="mb-2 text-2xl font-black text-white">Privacy &amp; Metadata</h3>
              <p className="mb-5 text-sm leading-relaxed text-slate-400">See and remove the hidden data inside your files before you share them — GPS in photos, authors in documents, IPs in emails, redaction leaks in PDFs.</p>
              <ul className="space-y-2 text-sm text-slate-300">
                {["Scans Excel, PDF, Word, photo, video, email", "GDPR “safe to share?” verdict", "Anonymize — keep data usable", "Download a clean, safe copy"].map(f => (
                  <li key={f} className="flex items-start gap-2"><Check size={15} className="mt-0.5 shrink-0 text-emerald-400" /> {f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product preview ── */}
      <section className="relative z-10 px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="glass-strong overflow-hidden rounded-2xl shadow-2xl shadow-indigo-900/50 ring-1 ring-white/10">
            <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-400">app.velytics.ai</div>
            </div>
            <div className="p-8">
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: "Total Revenue", value: "€4.82M", accent: "#818cf8", sub: "▲ 12% MoM" },
                  { label: "Net Profit", value: "€1.31M", accent: "#34d399", sub: "27% margin" },
                  { label: "Privacy score", value: "85/100", accent: "#fbbf24", sub: "2 risks" },
                  { label: "Alerts", value: "3", accent: "#f472b6", sub: "Needs attention" },
                ].map(k => (
                  <div key={k.label} className="glass rounded-xl p-4">
                    <div className="text-xl font-black tracking-tight text-white">{k.value}</div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">{k.label}</div>
                    <div className="mt-1.5 text-xs font-semibold" style={{ color: k.accent }}>{k.sub}</div>
                  </div>
                ))}
              </div>
              <div className="glass rounded-xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Monthly revenue</span>
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-400">Last 12 months</span>
                </div>
                <div className="flex h-24 items-end gap-3">
                  {[65, 88, 54, 100, 72, 91, 68, 84, 77, 95, 82, 88].map((h, i) => (
                    <div key={i} className="bar-grow flex-1 rounded-t-sm" style={{
                      height: `${h}%`, animationDelay: `${i * 0.05}s`,
                      background: i === 3 ? "linear-gradient(to top, #6366f1, #c084fc)" : "rgba(129,140,248,0.25)",
                      boxShadow: i === 3 ? "0 0 16px rgba(168,85,247,0.7)" : "none",
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-indigo-400">How it works</div>
            <h2 className="text-4xl font-black tracking-tight text-white">From messy file to<br />trusted result — in 4 steps</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="absolute top-8 left-full z-0 hidden h-px w-full -translate-x-6 bg-gradient-to-r from-indigo-400/40 to-transparent md:block" />
                )}
                <div className="group glass relative z-10 h-full rounded-2xl p-6 transition-all hover:border-indigo-400/40 hover:bg-white/[0.07]">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-xl font-black text-white shadow-lg shadow-fuchsia-500/40 transition-transform group-hover:scale-110">{s.icon}</div>
                  <div className="mb-1 text-xs font-bold text-indigo-300">{s.n}</div>
                  <h3 className="mb-2 text-lg font-black text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Analytics modules ── */}
      <section id="analytics" className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-indigo-400">Analytics</div>
            <h2 className="text-4xl font-black tracking-tight text-white">A dashboard built for your industry</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">Each engine knows the metrics that matter in that field — not generic charts.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {MODULES.map(m => (
              <div key={m.name} className="group glass rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:border-fuchsia-400/40 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-fuchsia-500/20">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110" style={{ background: `${m.color}1f`, border: `1px solid ${m.color}33` }}>
                  <m.Icon size={20} strokeWidth={2} style={{ color: m.color }} />
                </div>
                <div className="mb-1 text-sm font-bold text-white transition-colors group-hover:text-fuchsia-300">{m.name}</div>
                <div className="text-xs text-slate-500">{m.desc}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">…plus Hospitality, Agriculture, Construction &amp; any other sheet via the universal engine.</p>
        </div>
      </section>

      {/* ── Privacy Suite ── */}
      <section id="privacy" className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Privacy &amp; Metadata</div>
            <h2 className="text-4xl font-black tracking-tight text-white">Know what your files reveal</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">Every file you share carries hidden data. We find it, explain it in plain English, and remove it — in one place.</p>
          </div>
          {/* file types */}
          <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {FILETYPES.map(t => (
              <div key={t.label} className="glass flex items-center gap-2.5 rounded-xl px-4 py-3 transition-all hover:-translate-y-0.5 hover:bg-white/[0.08]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${t.color}1f` }}>
                  <t.Icon size={16} strokeWidth={2} style={{ color: t.color }} />
                </div>
                <span className="text-sm font-semibold text-slate-100">{t.label}</span>
              </div>
            ))}
          </div>
          {/* highlights */}
          <div className="grid gap-6 md:grid-cols-3">
            {PRIVACY_FEATURES.map(f => (
              <div key={f.title} className="glass rounded-2xl p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                  <f.Icon size={22} className="text-white" />
                </div>
                <h3 className="mb-2 text-lg font-black text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            {TRUST.map(t => (
              <div key={t.title} className="glass flex flex-col items-center rounded-2xl p-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${t.color}1f`, border: `1px solid ${t.color}33` }}>
                  <t.Icon size={22} strokeWidth={2} style={{ color: t.color }} />
                </div>
                <div className="mb-2 font-bold text-white">{t.title}</div>
                <div className="text-sm leading-relaxed text-slate-400">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-indigo-400">Pricing</div>
            <h2 className="text-4xl font-black tracking-tight text-white">Start free. Upgrade when it pays off.</h2>
            <p className="mt-4 text-slate-400">The scan is always free — pay only for advanced cleaning &amp; reports.</p>
          </div>
          <div className="grid items-start gap-6 md:grid-cols-3">
            {PRICING.map(p => (
              <div key={p.name} className={`relative rounded-2xl p-7 transition-all ${
                p.highlight
                  ? "border border-fuchsia-400/40 bg-gradient-to-b from-indigo-500/20 to-fuchsia-500/10 shadow-2xl shadow-fuchsia-500/30 md:scale-105"
                  : "glass hover:border-white/20 hover:bg-white/[0.07]"}`}>
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-fuchsia-500/50">Most popular</div>
                )}
                <div className={`mb-1 text-sm font-bold ${p.highlight ? "text-fuchsia-200" : "text-slate-400"}`}>{p.name}</div>
                <div className="flex items-end gap-1">
                  <div className="text-4xl font-black text-white">{p.price}</div>
                  <div className={`mb-1.5 text-sm ${p.highlight ? "text-fuchsia-300/80" : "text-slate-500"}`}>{p.period}</div>
                </div>
                <ul className="my-7 space-y-3">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check size={15} className={`mt-0.5 shrink-0 ${p.highlight ? "text-fuchsia-300" : "text-indigo-400"}`} /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/app" className={`block rounded-xl py-3 text-center text-sm font-bold transition-all ${
                  p.highlight
                    ? "bg-white text-indigo-700 hover:bg-fuchsia-50"
                    : "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50"}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-slate-500">Prices in EUR, excl. VAT. Cancel anytime. Your files are never stored.</p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-16 shadow-2xl shadow-indigo-900/50">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/30 blur-[100px]" />
            <Sparkles className="relative mx-auto mb-4 text-fuchsia-300" size={28} />
            <h2 className="relative mb-4 text-4xl font-black tracking-tight text-white">Clean it. Understand it.<br />Share it safely.</h2>
            <p className="relative mb-8 text-lg text-slate-300">Upload your first file in 30 seconds. No card. Nothing stored.</p>
            <Link href="/app" className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-fuchsia-500/50 transition-all hover:-translate-y-0.5">
              Start for free <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-500">
              <span className="text-xs font-black text-white">V</span>
            </div>
            <span className="font-black text-white">Velytics</span>
          </div>
          <div className="text-sm text-slate-500">© 2026 Velytics · Clean data, clear answers, shared safely.</div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300">Privacy</a>
            <a href="#" className="hover:text-slate-300">Terms</a>
            <a href="#" className="hover:text-slate-300">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
