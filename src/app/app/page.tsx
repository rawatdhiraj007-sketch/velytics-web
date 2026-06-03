"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp, Package, Users, DollarSign, ShoppingCart,
  Activity, Factory, Megaphone, Truck, Landmark,
  UtensilsCrossed, GraduationCap, UploadCloud, ChevronRight,
  BarChart2, User, PieChart, Zap, AlertTriangle, FileText,
  X, ArrowLeft, SlidersHorizontal, Download, RefreshCw,
  TrendingDown, Minus, ArrowUpRight, ArrowDownRight
} from "lucide-react";

const MODULES = [
  { id: "Sales Intelligence",     Icon: TrendingUp,     name: "Sales",         desc: "Revenue, targets & forecasts",   color: "#6366f1", bg: "#eef2ff" },
  { id: "Inventory Intelligence", Icon: Package,         name: "Inventory",     desc: "Stock levels & reorder alerts",  color: "#f59e0b", bg: "#fffbeb" },
  { id: "HR & Payroll",           Icon: Users,           name: "HR & Payroll",  desc: "Headcount, salary & attrition",  color: "#10b981", bg: "#f0fdf4" },
  { id: "Finance & Accounting",   Icon: DollarSign,      name: "Finance",       desc: "P&L, budgets & cash flow",       color: "#3b82f6", bg: "#eff6ff" },
  { id: "Retail & E-commerce",    Icon: ShoppingCart,    name: "Retail",        desc: "Orders, returns & channels",     color: "#8b5cf6", bg: "#f5f3ff" },
  { id: "Healthcare",             Icon: Activity,        name: "Healthcare",    desc: "Patients, revenue & outcomes",   color: "#ef4444", bg: "#fef2f2" },
  { id: "Manufacturing",          Icon: Factory,         name: "Manufacturing", desc: "Output, downtime & quality",     color: "#64748b", bg: "#f8fafc" },
  { id: "Marketing",              Icon: Megaphone,       name: "Marketing",     desc: "CAC, ROAS & campaigns",          color: "#ec4899", bg: "#fdf2f8" },
  { id: "Logistics",              Icon: Truck,           name: "Logistics",     desc: "Routes, delivery & costs",       color: "#f97316", bg: "#fff7ed" },
  { id: "Banking",                Icon: Landmark,        name: "Banking",       desc: "Loans, NPA & collections",       color: "#0ea5e9", bg: "#f0f9ff" },
  { id: "Restaurant",             Icon: UtensilsCrossed, name: "Restaurant",    desc: "Revenue, waste & ratings",       color: "#d97706", bg: "#fffbeb" },
  { id: "Education",              Icon: GraduationCap,   name: "Education",     desc: "Attendance, scores & fees",      color: "#7c3aed", bg: "#faf5ff" },
];

type Step = "module" | "upload" | "analysing" | "results";
type Tab  = "overview" | "products" | "salesperson" | "customers" | "forecast" | "alerts";

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "overview",    label: "Overview",     Icon: BarChart2   },
  { id: "products",    label: "Products",     Icon: Package     },
  { id: "salesperson", label: "Salesperson",  Icon: User        },
  { id: "customers",   label: "Customers",    Icon: Users       },
  { id: "forecast",    label: "Forecast",     Icon: TrendingUp  },
  { id: "alerts",      label: "Alerts",       Icon: Zap         },
];

const REGIONS    = ["All Regions","North","South","East","West"];
const CATEGORIES = ["All Categories","Electronics","Furniture","Clothing","Food","Pharma"];
const PERIODS    = ["Last 12 Months","Last 6 Months","Last 3 Months","This Month"];

// Sparkline SVG
function Sparkline({ data, color, up }: { data: number[]; color: string; up: boolean }) {
  const max = Math.max(...data), min = Math.min(...data);
  const norm = data.map(v => 32 - ((v - min) / (max - min || 1)) * 28);
  const pts = data.map((_, i) => `${(i / (data.length - 1)) * 80},${norm[i]}`).join(" ");
  return (
    <svg width="80" height="32" viewBox="0 0 80 32" className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <circle cx={(data.length-1)/(data.length-1)*80} cy={norm[norm.length-1]} r="2.5" fill={color} />
    </svg>
  );
}

// Bar chart SVG
function BarChart({ data }: { data: { label: string; value: number; highlight?: boolean }[] }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <svg viewBox={`0 0 ${data.length * 40} 100`} className="w-full h-28">
      {data.map((d, i) => {
        const h = (d.value / max) * 72;
        const x = i * 40 + 8;
        return (
          <g key={i}>
            <rect x={x} y={100 - h - 20} width="24" height={h} rx="4"
              fill={d.highlight ? "#6366f1" : "#e0e7ff"} />
            <text x={x + 12} y="98" textAnchor="middle" fontSize="8" fill="#9ca3af">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// Horizontal bar
function HBar({ value, max, color = "#6366f1" }: { value: number; max: number; color?: string }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function AppPage() {
  const [step,           setStep]           = useState<Step>("module");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [file,           setFile]           = useState<File | null>(null);
  const [dragging,       setDragging]       = useState(false);
  const [activeTab,      setActiveTab]      = useState<Tab>("overview");
  const [region,         setRegion]         = useState("All Regions");
  const [category,       setCategory]       = useState("All Categories");
  const [period,         setPeriod]         = useState("Last 12 Months");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if (f) setFile(f);
  }, []);

  const handleAnalyse = () => { setStep("analysing"); setTimeout(() => setStep("results"), 2500); };
  const mod = MODULES.find(m => m.id === selectedModule);

  return (
    <div className="min-h-screen" style={{ background: "#f7f8fc" }}>

      {/* ── Topbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 gap-4"
        style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid #f1f5f9" }}>
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#6366f1" }}>
            <span className="text-white text-xs font-black">V</span>
          </div>
          <span className="font-black text-gray-900 tracking-tight">Velytics</span>
        </Link>
        <div className="flex items-center gap-1 text-xs">
          {(["module","upload","analysing","results"] as Step[]).map((s, i, arr) => {
            const labels = ["Choose Module","Upload Data","Analysing","Results"];
            const done = arr.indexOf(step) > i;
            const active = step === s;
            return (
              <div key={s} className="flex items-center gap-1 shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all
                  ${active ? "text-white" : done ? "text-indigo-500" : "text-gray-400"}`}
                  style={active ? { background: "#6366f1" } : {}}>
                  <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center font-black
                    ${active ? "bg-white/20 text-white" : done ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"}`}>
                    {done ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:inline">{labels[i]}</span>
                </div>
                {i < arr.length - 1 && <ChevronRight size={12} className="text-gray-300 shrink-0" />}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="pt-14 min-h-screen flex flex-col">

        {/* ── STEP 1: Choose Module ── */}
        {step === "module" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
            <div className="max-w-4xl w-full">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">What would you like to analyse?</h1>
                <p className="text-gray-400 font-medium">Choose your industry — we configure the right analyses automatically.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {MODULES.map(m => (
                  <button key={m.id} onClick={() => { setSelectedModule(m.id); setStep("upload"); }}
                    className="group text-left p-5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{ background: m.bg }}>
                      <m.Icon size={20} style={{ color: m.color }} strokeWidth={1.75} />
                    </div>
                    <div className="font-bold text-gray-900 text-sm mb-0.5">{m.name}</div>
                    <div className="text-xs text-gray-400 leading-relaxed">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Upload ── */}
        {step === "upload" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
            <div className="max-w-xl w-full">
              <button onClick={() => setStep("module")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors">
                <ArrowLeft size={14} /> Back
              </button>
              <div className="text-center mb-8">
                {mod && (
                  <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full border border-gray-200 bg-white">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: mod.bg }}>
                      <mod.Icon size={14} style={{ color: mod.color }} strokeWidth={2} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{selectedModule}</span>
                  </div>
                )}
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Upload your data</h1>
                <p className="text-gray-400 text-sm">Excel · CSV · JSON · Any size</p>
              </div>
              <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-14 text-center transition-all bg-white
                  ${dragging ? "border-indigo-400 bg-indigo-50/30" : file ? "border-green-400 bg-green-50/30" : "border-gray-200 hover:border-indigo-300"}`}>
                {file ? (
                  <div>
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText size={24} className="text-green-600" />
                    </div>
                    <div className="font-bold text-gray-900 mb-1">{file.name}</div>
                    <div className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB · Ready</div>
                    <button onClick={() => setFile(null)} className="mt-3 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
                      <X size={12} /> Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <UploadCloud size={24} style={{ color: "#6366f1" }} />
                    </div>
                    <div className="font-bold text-gray-900 mb-1">Drop your file here</div>
                    <div className="text-sm text-gray-400 mb-5">or click to browse</div>
                    <label className="cursor-pointer inline-flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
                      style={{ background: "#6366f1" }}>
                      <UploadCloud size={16} /> Browse files
                      <input type="file" accept=".xlsx,.csv,.json" className="hidden" onChange={e => e.target.files?.[0] && setFile(e.target.files[0])} />
                    </label>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 mt-4 p-4 bg-white border border-gray-100 rounded-xl text-sm text-gray-500">
                <span className="text-base">🔒</span>
                <span>Processed in memory · <strong className="text-gray-700">never stored</strong> · deleted immediately</span>
              </div>
              {file && (
                <button onClick={handleAnalyse}
                  className="w-full mt-5 text-white font-bold py-4 rounded-xl text-base transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                  style={{ background: "#6366f1", boxShadow: "0 8px 24px rgba(99,102,241,0.3)" }}>
                  Run Analysis <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3: Analysing ── */}
        {step === "analysing" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-8" />
              <h2 className="text-2xl font-black text-gray-900 mb-2">Analysing your data</h2>
              <p className="text-gray-400 text-sm mb-6">Running {selectedModule} analysis</p>
              <div className="space-y-2 text-sm text-left inline-block">
                {["✅  File loaded","✅  Auto-cleaning complete","⚡  Running statistical models..."].map((s, i) => (
                  <div key={i} className="text-gray-500">{s}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Results ── */}
        {step === "results" && (
          <div className="flex-1 flex overflow-hidden">

            {/* ── Sidebar ── */}
            <aside className="w-52 shrink-0 flex flex-col" style={{ background: "white", borderRight: "1px solid #f1f5f9" }}>
              {/* Module badge */}
              <div className="p-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
                {mod && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: mod.bg }}>
                      <mod.Icon size={15} style={{ color: mod.color }} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-900">{mod.name}</div>
                      <div className="text-xs text-gray-400">Intelligence</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Filters */}
              <div className="p-4 flex-1 overflow-auto space-y-5">
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <SlidersHorizontal size={11} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filters</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Period",   value: period,   setter: setPeriod,   opts: PERIODS    },
                      { label: "Region",   value: region,   setter: setRegion,   opts: REGIONS    },
                      { label: "Category", value: category, setter: setCategory, opts: CATEGORIES },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
                        <select value={f.value} onChange={e => f.setter(e.target.value)}
                          className="w-full text-xs rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none transition-all"
                          style={{ border: "1px solid #e2e8f0", background: "#fafafa", color: "#374151" }}>
                          {f.opts.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dataset info */}
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1.25rem" }}>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Dataset</div>
                  <div className="rounded-xl p-3 space-y-2" style={{ background: "#fafafa", border: "1px solid #f1f5f9" }}>
                    <div className="text-xs font-bold text-gray-800 truncate">{file?.name ?? "sales_test_data.xlsx"}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">200 rows</span>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs text-gray-400">13 cols</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Auto-cleaned
                    </div>
                  </div>
                </div>
              </div>

              {/* New analysis button */}
              <div className="p-4" style={{ borderTop: "1px solid #f1f5f9" }}>
                <button onClick={() => { setStep("module"); setFile(null); setSelectedModule(null); setActiveTab("overview"); }}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition-all hover:bg-indigo-50 hover:text-indigo-600 text-gray-500"
                  style={{ border: "1px solid #e2e8f0" }}>
                  <ArrowLeft size={12} /> New analysis
                </button>
              </div>
            </aside>

            {/* ── Main panel ── */}
            <main className="flex-1 flex flex-col overflow-hidden">

              {/* Header */}
              <div className="px-7 py-4 flex items-center justify-between shrink-0" style={{ background: "white", borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h1 className="text-base font-black text-gray-900">{selectedModule} Report</h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">Live</span>
                  </div>
                  <p className="text-xs text-gray-400">{period} · {region} · {category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg transition-all" style={{ border: "1px solid #e2e8f0" }}>
                    <RefreshCw size={12} /> Refresh
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 rounded-lg transition-all hover:-translate-y-0.5"
                    style={{ background: "#6366f1", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}>
                    <Download size={12} /> Download PDF
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-7 flex gap-0 shrink-0" style={{ background: "white", borderBottom: "1px solid #f1f5f9" }}>
                {TABS.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all
                      ${activeTab === t.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                    <t.Icon size={12} /> {t.label}
                  </button>
                ))}
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-auto px-7 py-6">

                {/* ── OVERVIEW ── */}
                {activeTab === "overview" && (
                  <div className="space-y-5 max-w-5xl">

                    {/* KPI row */}
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: "Total Revenue",      value: "₹4.82Cr",  change: "+12%",  up: true,  spark: [40,45,42,55,58,62,59,68,72,78,82,94], color: "#6366f1" },
                        { label: "Target Achievement", value: "94.3%",    change: "+6 pts", up: true, spark: [75,78,80,82,85,84,88,87,90,91,93,94], color: "#10b981" },
                        { label: "Units Sold",         value: "2,847",    change: "+8%",   up: true,  spark: [200,220,210,245,255,265,258,280,270,290,285,310], color: "#8b5cf6" },
                        { label: "Avg Order Value",    value: "₹16,930",  change: "-2%",   up: false, spark: [17500,17200,17100,16900,17000,16800,16900,16700,16800,16750,16900,16930], color: "#f59e0b" },
                      ].map(k => (
                        <div key={k.label} className="bg-white rounded-2xl p-5 flex flex-col gap-3"
                          style={{ border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide leading-tight">{k.label}</span>
                            <span className={`flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${k.up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                              {k.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                              {k.change}
                            </span>
                          </div>
                          <div className="text-2xl font-black text-gray-900 tracking-tight leading-none">{k.value}</div>
                          <Sparkline data={k.spark} color={k.color} up={k.up} />
                        </div>
                      ))}
                    </div>

                    {/* Charts row */}
                    <div className="grid grid-cols-5 gap-4">
                      {/* Revenue trend */}
                      <div className="col-span-3 bg-white rounded-2xl p-5" style={{ border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <div className="flex items-center justify-between mb-5">
                          <div>
                            <div className="font-bold text-gray-900 text-sm">Revenue Trend</div>
                            <div className="text-xs text-gray-400 mt-0.5">Monthly performance</div>
                          </div>
                          <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">{period}</span>
                        </div>
                        <BarChart data={[
                          {label:"Jan",value:40},{label:"Feb",value:55},{label:"Mar",value:48},
                          {label:"Apr",value:70},{label:"May",value:65},{label:"Jun",value:80},
                          {label:"Jul",value:72},{label:"Aug",value:88},{label:"Sep",value:76},
                          {label:"Oct",value:95},{label:"Nov",value:82},{label:"Dec",value:100,highlight:true}
                        ]} />
                      </div>

                      {/* Region breakdown */}
                      <div className="col-span-2 bg-white rounded-2xl p-5" style={{ border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <div className="font-bold text-gray-900 text-sm mb-1">By Region</div>
                        <div className="text-xs text-gray-400 mb-5">Revenue distribution</div>
                        <div className="space-y-4">
                          {[
                            { r: "West",  v: "₹1.40Cr", pct: 100, color: "#6366f1" },
                            { r: "East",  v: "₹1.34Cr", pct: 96,  color: "#818cf8" },
                            { r: "South", v: "₹1.24Cr", pct: 89,  color: "#a5b4fc" },
                            { r: "North", v: "₹0.81Cr", pct: 58,  color: "#c7d2fe" },
                          ].map(d => (
                            <div key={d.r}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-semibold text-gray-600">{d.r}</span>
                                <span className="text-xs font-bold text-gray-900">{d.v}</span>
                              </div>
                              <HBar value={d.pct} max={100} color={d.color} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick insight strip */}
                    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                      <div className="font-bold text-gray-900 text-sm mb-4">Key Findings</div>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { icon: "🟢", text: "West region leads at ₹1.40Cr — 29% of total revenue", action: "Replicate" },
                          { icon: "🔴", text: "North is ₹34L behind target — 6 days left in month", action: "Review" },
                          { icon: "📈", text: "Revenue trending +18% YoY — above industry average", action: "Report" },
                        ].map((f, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "#fafafa", border: "1px solid #f1f5f9" }}>
                            <span className="text-base shrink-0 mt-0.5">{f.icon}</span>
                            <div className="flex-1">
                              <p className="text-xs text-gray-600 leading-relaxed">{f.text}</p>
                              <button className="text-xs font-bold text-indigo-600 mt-2 hover:text-indigo-800">{f.action} →</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* ── PRODUCTS ── */}
                {activeTab === "products" && (
                  <div className="space-y-5 max-w-5xl">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label:"Total SKUs",     value:"47",          sub:"Active products",  color:"#6366f1" },
                        { label:"Top Product",    value:"Laptop Pro",  sub:"₹98L revenue",    color:"#10b981" },
                        { label:"Worst Performer",value:"USB Hub",     sub:"₹1.2L · Review",  color:"#ef4444" },
                      ].map(k => (
                        <div key={k.label} className="bg-white rounded-2xl p-5" style={{ border: "1px solid #f1f5f9", borderTopWidth: 3, borderTopColor: k.color, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                          <div className="text-xl font-black text-gray-900 mb-1">{k.value}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{k.label}</div>
                          <div className="text-xs font-semibold" style={{ color: k.color }}>{k.sub}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                      <div className="font-bold text-gray-900 text-sm mb-5">Top 10 Products by Revenue</div>
                      <div className="space-y-3">
                        {[["Laptop Pro","₹98L",100],["Office Chair","₹76L",78],["Wireless Mouse","₹54L",55],
                          ["Standing Desk","₹48L",49],["Monitor 27\"","₹42L",43],["Keyboard Mech","₹38L",39],
                          ["Webcam HD","₹31L",32],["Headphones BT","₹27L",28],["USB-C Hub","₹19L",19],["Mouse Pad","₹12L",12]
                        ].map(([n, r, p], i) => (
                          <div key={String(n)} className="flex items-center gap-3">
                            <span className="w-5 text-xs font-black text-gray-300 shrink-0">{i + 1}</span>
                            <span className="w-32 text-xs font-semibold text-gray-700 truncate shrink-0">{n}</span>
                            <HBar value={Number(p)} max={100} />
                            <span className="text-xs font-bold text-gray-700 w-10 text-right shrink-0">{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── SALESPERSON ── */}
                {activeTab === "salesperson" && (
                  <div className="space-y-5 max-w-5xl">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label:"Top Performer", value:"Ravi Kumar",   sub:"₹1.2Cr · 124% of target", color:"#10b981" },
                        { label:"Needs Support",  value:"Priya Sharma", sub:"₹34L · 68% of target",   color:"#ef4444" },
                        { label:"Team Average",   value:"94.3%",         sub:"Across 8 salespeople",   color:"#6366f1" },
                      ].map(k => (
                        <div key={k.label} className="bg-white rounded-2xl p-5" style={{ border: "1px solid #f1f5f9", borderTopWidth: 3, borderTopColor: k.color, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                          <div className="text-base font-black text-gray-900 mb-1">{k.value}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{k.label}</div>
                          <div className="text-xs font-semibold" style={{ color: k.color }}>{k.sub}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                      <div className="font-bold text-gray-900 text-sm mb-5">Performance vs Target</div>
                      <div className="space-y-3.5">
                        {[
                          ["Ravi Kumar",   "₹1.2Cr", 124, "#10b981"],
                          ["Amit Singh",   "₹98L",   102, "#10b981"],
                          ["Neha Gupta",   "₹87L",    97, "#6366f1"],
                          ["Raj Mehta",    "₹82L",    91, "#6366f1"],
                          ["Sunita Rao",   "₹76L",    84, "#f59e0b"],
                          ["Ankit Shah",   "₹61L",    76, "#f59e0b"],
                          ["Deepa Nair",   "₹48L",    72, "#f59e0b"],
                          ["Priya Sharma", "₹34L",    68, "#ef4444"],
                        ].map(([n, r, p, c]) => (
                          <div key={String(n)} className="flex items-center gap-3">
                            <span className="w-28 text-xs font-semibold text-gray-700 truncate shrink-0">{n}</span>
                            <HBar value={Math.min(Number(p), 100)} max={100} color={String(c)} />
                            <span className="text-xs font-black w-10 text-right shrink-0" style={{ color: String(c) }}>{p}%</span>
                            <span className="text-xs text-gray-400 w-10 text-right shrink-0">{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── CUSTOMERS ── */}
                {activeTab === "customers" && (
                  <div className="space-y-5 max-w-5xl">
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label:"Total Customers", value:"284",    sub:"Unique buyers",      color:"#8b5cf6" },
                        { label:"New Customers",   value:"38%",    sub:"First-time buyers",  color:"#6366f1" },
                        { label:"Repeat Rate",     value:"62%",    sub:"Returning buyers",   color:"#10b981" },
                        { label:"Avg LTV",         value:"₹1.7L", sub:"Per customer",       color:"#f59e0b" },
                      ].map(k => (
                        <div key={k.label} className="bg-white rounded-2xl p-5" style={{ border: "1px solid #f1f5f9", borderTopWidth: 3, borderTopColor: k.color, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                          <div className="text-2xl font-black text-gray-900 mb-1">{k.value}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{k.label}</div>
                          <div className="text-xs font-semibold" style={{ color: k.color }}>{k.sub}</div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { title: "Customer Type", data: [["Corporate","48%",100,"#6366f1"],["SMB","31%",65,"#818cf8"],["Individual","21%",44,"#c7d2fe"]] },
                        { title: "Payment Mode",  data: [["Bank Transfer","44%",100,"#6366f1"],["Credit Card","28%",64,"#10b981"],["UPI","18%",41,"#f59e0b"],["Cash","10%",23,"#9ca3af"]] },
                      ].map(({ title, data }) => (
                        <div key={title} className="bg-white rounded-2xl p-5" style={{ border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                          <div className="font-bold text-gray-900 text-sm mb-5">{title}</div>
                          <div className="space-y-4">
                            {data.map(([n, p, w, c]) => (
                              <div key={String(n)}>
                                <div className="flex justify-between mb-1.5">
                                  <span className="text-xs font-semibold text-gray-600">{n}</span>
                                  <span className="text-xs font-bold text-gray-900">{p}</span>
                                </div>
                                <HBar value={Number(w)} max={100} color={String(c)} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── FORECAST ── */}
                {activeTab === "forecast" && (
                  <div className="space-y-5 max-w-5xl">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label:"Next Month",   value:"₹52L",  sub:"Based on trend + seasonality", color:"#10b981" },
                        { label:"6-Month Total",value:"₹3.1Cr",sub:"Linear regression model",      color:"#6366f1" },
                        { label:"YoY Growth",   value:"+18%",  sub:"vs same period last year",      color:"#8b5cf6" },
                      ].map(k => (
                        <div key={k.label} className="bg-white rounded-2xl p-5" style={{ border: "1px solid #f1f5f9", borderTopWidth: 3, borderTopColor: k.color, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                          <div className="text-2xl font-black text-gray-900 mb-1">{k.value}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{k.label}</div>
                          <div className="text-xs font-semibold" style={{ color: k.color }}>{k.sub}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <div className="font-bold text-gray-900 text-sm">6-Month Revenue Forecast</div>
                          <div className="text-xs text-gray-400 mt-0.5">Actual + projected</div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>
                          Linear Regression
                        </span>
                      </div>
                      <svg viewBox="0 0 400 100" className="w-full h-32">
                        {[82,88,95,100,104,109,115,121,127,134].map((h, i) => {
                          const actual = i < 4;
                          const x = i * 40 + 8;
                          const barH = h * 0.72;
                          return (
                            <g key={i}>
                              <rect x={x} y={100 - barH - 4} width="24" height={barH} rx="4"
                                fill={actual ? "#6366f1" : "#bbf7d0"}
                                stroke={actual ? "none" : "#10b981"} strokeDasharray={actual ? "0" : "3,2"} strokeWidth="1" />
                            </g>
                          );
                        })}
                      </svg>
                      <div className="flex items-center gap-5 mt-2 text-xs">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "#6366f1" }} /><span className="text-gray-500">Actual</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "#bbf7d0", border: "1px dashed #10b981" }} /><span className="text-gray-500">Forecast</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── ALERTS ── */}
                {activeTab === "alerts" && (
                  <div className="max-w-3xl space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-amber-500" />
                        <span className="text-sm font-bold text-gray-900">5 alerts</span>
                        <span className="text-xs text-gray-400">· 2 critical · 1 warning · 2 opportunities</span>
                      </div>
                    </div>
                    {[
                      { type:"Critical",    c:"#dc2626", bg:"#fef2f2", bc:"#fecaca", text:"North region is 34% below target — immediate intervention needed. Consider reassigning leads or launching a campaign." },
                      { type:"Critical",    c:"#dc2626", bg:"#fef2f2", bc:"#fecaca", text:"2 salespersons below 70% target with 8 days remaining. Schedule 1:1 and review pipeline quality." },
                      { type:"Warning",     c:"#d97706", bg:"#fffbeb", bc:"#fed7aa", text:"Electronics category declining for 3 consecutive months. Review pricing or launch a bundle offer." },
                      { type:"Opportunity", c:"#059669", bg:"#f0fdf4", bc:"#bbf7d0", text:"West region exceeded target by 18%. Document this territory's playbook and replicate in South." },
                      { type:"Opportunity", c:"#059669", bg:"#f0fdf4", bc:"#bbf7d0", text:"Corporate customers have 3.2× higher LTV. Increase B2B outreach to improve portfolio quality." },
                    ].map((a, i) => (
                      <div key={i} className="p-4 rounded-xl flex items-start gap-3"
                        style={{ background: a.bg, border: `1px solid ${a.bc}`, borderLeftWidth: 3, borderLeftColor: a.c }}>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5"
                          style={{ background: a.c + "18", color: a.c }}>{a.type}</span>
                        <p className="text-sm text-gray-700 leading-relaxed">{a.text}</p>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
