"use client";
import Link from "next/link";

const NAV_LINKS = ["Product","Modules","Pricing","Docs"];
const MODULES = [
  { icon: "📈", name: "Sales", desc: "Revenue, targets, forecasts" },
  { icon: "📦", name: "Inventory", desc: "Stock, reorder, dead stock" },
  { icon: "👥", name: "HR & Payroll", desc: "Headcount, attrition, salary" },
  { icon: "💰", name: "Finance", desc: "P&L, budgets, cash flow" },
  { icon: "🛒", name: "Retail", desc: "Orders, returns, channels" },
  { icon: "🏥", name: "Healthcare", desc: "Patients, revenue, outcomes" },
  { icon: "🏭", name: "Manufacturing", desc: "Output, downtime, quality" },
  { icon: "📣", name: "Marketing", desc: "CAC, ROAS, campaigns" },
  { icon: "🚚", name: "Logistics", desc: "Routes, delivery, costs" },
  { icon: "🏦", name: "Banking", desc: "Loans, NPA, collections" },
  { icon: "🍽️", name: "Restaurant", desc: "Revenue, waste, ratings" },
  { icon: "🎓", name: "Education", desc: "Attendance, scores, fees" },
];
const STEPS = [
  { n: "01", title: "Upload", desc: "Drop any Excel, CSV, or JSON file. We handle any format, any size, any mess.", icon: "↑" },
  { n: "02", title: "Auto-Clean", desc: "23 types of data issues fixed automatically. Duplicates, missing values, wrong formats — all handled.", icon: "✦" },
  { n: "03", title: "Analyse", desc: "15 industry-specific modules run real statistical models — not AI guesses.", icon: "◈" },
  { n: "04", title: "Decide", desc: "KPIs, forecasts, alerts, and PDF reports. Actionable insights in under 60 seconds.", icon: "→" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">V</span>
            </div>
            <span className="font-black text-gray-900 tracking-tight text-lg">Velytics</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <a key={l} href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="text-sm font-semibold text-gray-600 hover:text-gray-900">Sign in</a>
            <Link href="/app" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            Now live · 15 industry modules
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.95] mb-6 text-balance">
            Transform Data<br />
            Into <span className="gradient-text">Decisions</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload any data. Clean it. Analyse it. Understand it.<br />
            <span className="text-gray-900 font-semibold">No coding required.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/app" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5">
              Start for free →
            </Link>
            <a href="#how" className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-xl text-base transition-all border border-gray-200 hover:border-gray-300">
              See how it works
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400 font-medium">
            {[["15","Industries"],["150+","Analyses"],["60s","Time to insight"],["0","Coding needed"]].map(([n,l]) => (
              <div key={l} className="flex items-center gap-2">
                <span className="font-black text-gray-900 text-lg">{n}</span>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product preview ── */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-gray-100 overflow-hidden">
            {/* Browser chrome */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 font-mono">
                app.velytics.ai
              </div>
            </div>
            {/* App preview */}
            <div className="p-8 bg-gradient-to-br from-slate-50 to-indigo-50/30">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Total Revenue", value: "₹4.82Cr", color: "indigo", sub: "+12% vs last month" },
                  { label: "Target Achievement", value: "94.3%", color: "green", sub: "↑ On track" },
                  { label: "Smart Alerts", value: "3", color: "red", sub: "Needs attention" },
                ].map(k => (
                  <div key={k.label} className={`bg-white rounded-xl p-5 border-t-3 shadow-sm border border-gray-100`}
                    style={{ borderTopWidth: 3, borderTopColor: k.color === 'indigo' ? '#6366f1' : k.color === 'green' ? '#10b981' : '#ef4444' }}>
                    <div className="text-2xl font-black text-gray-900 tracking-tight">{k.value}</div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">{k.label}</div>
                    <div className="text-xs font-semibold mt-2" style={{ color: k.color === 'red' ? '#ef4444' : '#10b981' }}>{k.sub}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-gray-900">Revenue by Region</span>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">Last 12 months</span>
                </div>
                <div className="flex items-end gap-3 h-24">
                  {[65,88,54,100,72,91,68,84,77,95,82,88].map((h,i) => (
                    <div key={i} className="flex-1 rounded-t-sm transition-all"
                      style={{ height: `${h}%`, background: i === 9 ? '#6366f1' : '#e0e7ff' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">How it works</div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">From raw data to insight<br />in four steps</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-indigo-200 to-transparent z-0 -translate-x-6" />
                )}
                <div className="bg-gray-50 rounded-2xl p-6 relative z-10 h-full border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-black mb-4 group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <div className="text-xs font-bold text-indigo-400 mb-1">{s.n}</div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Industry modules</div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Built for every industry</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Each module runs real statistical analysis tailored to that industry's KPIs, not generic charts.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MODULES.map(m => (
              <div key={m.name} className="bg-white border border-gray-100 rounded-xl p-5 hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                <div className="text-2xl mb-3">{m.icon}</div>
                <div className="font-bold text-gray-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors">{m.name}</div>
                <div className="text-xs text-gray-400">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="py-16 px-6 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: "🔒", title: "Never stored", desc: "Your data is processed in memory and deleted immediately. We never store raw data." },
              { icon: "⚡", title: "Real statistics", desc: "pandas, sklearn, statsmodels — deterministic, auditable results. Not AI hallucinations." },
              { icon: "📊", title: "1M+ rows", desc: "Chunked processing handles files of any size, from 10 rows to a million." },
            ].map(t => (
              <div key={t.title} className="flex flex-col items-center">
                <div className="text-3xl mb-3">{t.icon}</div>
                <div className="font-bold text-gray-900 mb-2">{t.title}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Pricing</div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Simple, honest pricing</h2>
            <p className="text-gray-500 mt-4">Pay per analysis or subscribe monthly. No hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "Free", period: "forever", features: ["3 analyses/month","2 modules","PDF export","Email support"], cta: "Get started", highlight: false },
              { name: "Pro", price: "₹999", period: "/month", features: ["Unlimited analyses","All 15 modules","Priority support","API access","Team sharing"], cta: "Start free trial", highlight: true },
              { name: "Enterprise", price: "Custom", period: "", features: ["Custom modules","On-premise option","SLA guarantee","Dedicated support","Custom integrations"], cta: "Contact us", highlight: false },
            ].map(p => (
              <div key={p.name} className={`rounded-2xl p-7 border transition-all ${p.highlight ? 'bg-indigo-600 border-indigo-600 shadow-2xl shadow-indigo-200 scale-105' : 'bg-white border-gray-200 hover:border-indigo-200'}`}>
                <div className={`text-sm font-bold mb-1 ${p.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>{p.name}</div>
                <div className={`text-4xl font-black mb-1 ${p.highlight ? 'text-white' : 'text-gray-900'}`}>{p.price}</div>
                <div className={`text-sm mb-6 ${p.highlight ? 'text-indigo-300' : 'text-gray-400'}`}>{p.period}</div>
                <ul className="space-y-3 mb-8">
                  {p.features.map(f => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${p.highlight ? 'text-indigo-100' : 'text-gray-600'}`}>
                      <span className={p.highlight ? 'text-indigo-300' : 'text-indigo-500'}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/app" className={`block text-center py-3 rounded-xl text-sm font-bold transition-all ${p.highlight ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-16 shadow-2xl shadow-indigo-200">
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">Ready to transform<br />your data?</h2>
            <p className="text-indigo-200 mb-8 text-lg">Upload your first file in 30 seconds. No credit card required.</p>
            <Link href="/app" className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl text-base hover:bg-indigo-50 transition-all shadow-lg">
              Start for free <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-black">V</span>
            </div>
            <span className="font-black text-gray-900">Velytics</span>
          </div>
          <div className="text-sm text-gray-400">© 2025 Velytics. Your data scientist. No hiring required.</div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600">Privacy</a>
            <a href="#" className="hover:text-gray-600">Terms</a>
            <a href="#" className="hover:text-gray-600">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
