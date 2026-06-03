"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp, Package, Users, DollarSign, ShoppingCart,
  Activity, Factory, Megaphone, Truck, Landmark,
  UtensilsCrossed, GraduationCap, UploadCloud, ChevronRight,
  BarChart2, User, PieChart, Zap, AlertTriangle, FileText,
  X, ArrowLeft
} from "lucide-react";

const MODULES = [
  { id: "Sales Intelligence",     Icon: TrendingUp,      name: "Sales",          desc: "Revenue, targets & forecasts",      color: "#6366f1", bg: "#eef2ff" },
  { id: "Inventory Intelligence", Icon: Package,          name: "Inventory",      desc: "Stock levels & reorder alerts",     color: "#f59e0b", bg: "#fffbeb" },
  { id: "HR & Payroll",           Icon: Users,            name: "HR & Payroll",   desc: "Headcount, salary & attrition",     color: "#10b981", bg: "#f0fdf4" },
  { id: "Finance & Accounting",   Icon: DollarSign,       name: "Finance",        desc: "P&L, budgets & cash flow",          color: "#3b82f6", bg: "#eff6ff" },
  { id: "Retail & E-commerce",    Icon: ShoppingCart,     name: "Retail",         desc: "Orders, returns & channels",        color: "#8b5cf6", bg: "#f5f3ff" },
  { id: "Healthcare",             Icon: Activity,         name: "Healthcare",     desc: "Patients, revenue & outcomes",      color: "#ef4444", bg: "#fef2f2" },
  { id: "Manufacturing",          Icon: Factory,          name: "Manufacturing",  desc: "Output, downtime & quality",        color: "#64748b", bg: "#f8fafc" },
  { id: "Marketing",              Icon: Megaphone,        name: "Marketing",      desc: "CAC, ROAS & campaigns",             color: "#ec4899", bg: "#fdf2f8" },
  { id: "Logistics",              Icon: Truck,            name: "Logistics",      desc: "Routes, delivery & costs",          color: "#f97316", bg: "#fff7ed" },
  { id: "Banking",                Icon: Landmark,         name: "Banking",        desc: "Loans, NPA & collections",          color: "#0ea5e9", bg: "#f0f9ff" },
  { id: "Restaurant",             Icon: UtensilsCrossed,  name: "Restaurant",     desc: "Revenue, waste & ratings",          color: "#d97706", bg: "#fffbeb" },
  { id: "Education",              Icon: GraduationCap,    name: "Education",      desc: "Attendance, scores & fees",         color: "#7c3aed", bg: "#faf5ff" },
];

type Step = "module" | "upload" | "analysing" | "results";
type Tab  = "overview" | "products" | "salesperson" | "customers" | "forecast" | "alerts";

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "overview",    label: "Overview",      Icon: BarChart2     },
  { id: "products",    label: "Products",      Icon: Package       },
  { id: "salesperson", label: "Salesperson",   Icon: User          },
  { id: "customers",   label: "Customers",     Icon: Users         },
  { id: "forecast",    label: "Forecast",      Icon: TrendingUp    },
  { id: "alerts",      label: "Smart Alerts",  Icon: Zap           },
];

const REGIONS    = ["All Regions","North","South","East","West"];
const CATEGORIES = ["All Categories","Electronics","Furniture","Clothing","Food","Pharma"];
const PERIODS    = ["Last 12 Months","Last 6 Months","Last 3 Months","This Month"];

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
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* ── Top bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 h-14 flex items-center px-6 gap-4">
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">V</span>
          </div>
          <span className="font-black text-gray-900 tracking-tight">Velytics</span>
        </Link>
        <div className="flex items-center gap-1 text-xs overflow-x-auto">
          {(["module","upload","analysing","results"] as Step[]).map((s, i, arr) => {
            const labels = ["Choose Module","Upload Data","Analysing","Results"];
            const done = arr.indexOf(step) > i;
            const active = step === s;
            return (
              <div key={s} className="flex items-center gap-1 shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${active ? "bg-indigo-600 text-white" : done ? "text-indigo-500" : "text-gray-400"}`}>
                  <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center font-black ${active ? "bg-white/20" : done ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"}`}>{done ? "✓" : i+1}</span>
                  <span className="hidden sm:inline">{labels[i]}</span>
                </div>
                {i < arr.length-1 && <ChevronRight size={12} className="text-gray-300 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

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
                    className="group text-left p-5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
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
                <p className="text-gray-400 text-sm">Excel · CSV · JSON · Any size · Any format</p>
              </div>

              <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-14 text-center transition-all ${dragging ? "border-indigo-400 bg-indigo-50/50" : file ? "border-green-400 bg-green-50/50" : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20"}`}>
                {file ? (
                  <div>
                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText size={24} className="text-green-600" />
                    </div>
                    <div className="font-bold text-gray-900 mb-1">{file.name}</div>
                    <div className="text-sm text-gray-400">{(file.size/1024).toFixed(1)} KB · Ready to analyse</div>
                    <button onClick={() => setFile(null)} className="mt-3 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
                      <X size={12} /> Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <UploadCloud size={24} className="text-indigo-500" />
                    </div>
                    <div className="font-bold text-gray-900 mb-1">Drop your file here</div>
                    <div className="text-sm text-gray-400 mb-5">or click to browse</div>
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                      <UploadCloud size={16} /> Browse files
                      <input type="file" accept=".xlsx,.csv,.json" className="hidden" onChange={e => e.target.files?.[0] && setFile(e.target.files[0])} />
                    </label>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 mt-4 p-4 bg-white border border-gray-100 rounded-xl text-sm text-gray-500">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs">🔒</span>
                </div>
                <span>Processed in memory · <strong className="text-gray-700">never stored</strong> · deleted immediately after analysis</span>
              </div>

              {file && (
                <button onClick={handleAnalyse} className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-base transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5 flex items-center justify-center gap-2">
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
                {["✅  File loaded successfully","✅  Auto-cleaning complete","⚡  Running statistical models..."].map((s,i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-500">{s}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Results ── */}
        {step === "results" && (
          <div className="flex-1 flex overflow-hidden">

            {/* Sidebar */}
            <div className="w-56 shrink-0 bg-white border-r border-gray-100 flex flex-col">
              <div className="p-5 border-b border-gray-100">
                {mod && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: mod.bg }}>
                      <mod.Icon size={16} style={{ color: mod.color }} strokeWidth={2} />
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{mod.name}</span>
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 space-y-5 overflow-auto">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Filters</div>
                  <div className="space-y-3">
                    {[{ label:"Period", value:period, setter:setPeriod, opts:PERIODS },
                      { label:"Region", value:region, setter:setRegion, opts:REGIONS },
                      { label:"Category", value:category, setter:setCategory, opts:CATEGORIES }
                    ].map(f => (
                      <div key={f.label}>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">{f.label}</label>
                        <select value={f.value} onChange={e => f.setter(e.target.value)}
                          className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-2 bg-white text-gray-700 focus:outline-none focus:border-indigo-400 cursor-pointer">
                          {f.opts.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">File</div>
                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-gray-800 truncate">{file?.name ?? "sales_test_data.xlsx"}</div>
                    <div className="text-gray-400">200 rows · 13 columns</div>
                    <div className="text-green-600 font-semibold flex items-center gap-1"><span>✓</span> Auto-cleaned</div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <button onClick={() => { setStep("module"); setFile(null); setSelectedModule(null); setActiveTab("overview"); }}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 py-2 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all">
                  <ArrowLeft size={12} /> New analysis
                </button>
              </div>
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
                <div>
                  <h1 className="text-base font-black text-gray-900">{selectedModule} Report</h1>
                  <p className="text-xs text-gray-400 mt-0.5">{period} · {region} · {category}</p>
                </div>
                <button className="flex items-center gap-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all">
                  <FileText size={14} /> Download PDF
                </button>
              </div>

              {/* Tabs */}
              <div className="bg-white border-b border-gray-100 px-6 flex gap-0.5 shrink-0">
                {TABS.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${activeTab===t.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-700"}`}>
                    <t.Icon size={13} /> {t.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-6 space-y-4">

                {activeTab === "overview" && (
                  <>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label:"Total Revenue",      value:"₹4.82Cr",  sub:"+12% vs last month",    color:"#6366f1" },
                        { label:"Target Achievement", value:"94.3%",    sub:"↑ 6 pts vs target",     color:"#10b981" },
                        { label:"Units Sold",         value:"2,847",    sub:"Across all products",   color:"#8b5cf6" },
                        { label:"Avg Order Value",    value:"₹16,930",  sub:"Per transaction",       color:"#f59e0b" },
                      ].map(k => (
                        <div key={k.label} className="bg-white rounded-xl p-5 border border-gray-100" style={{ borderTopWidth:3, borderTopColor:k.color }}>
                          <div className="text-2xl font-black text-gray-900 tracking-tight">{k.value}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1 mb-2">{k.label}</div>
                          <div className="text-xs font-semibold" style={{ color:k.color }}>{k.sub}</div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-5 border border-gray-100">
                        <div className="flex justify-between items-center mb-5">
                          <span className="font-bold text-gray-900 text-sm">Revenue Trend</span>
                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">{period}</span>
                        </div>
                        <div className="flex items-end gap-1.5 h-28">
                          {[40,55,48,70,65,80,72,88,76,95,82,100].map((h,i) => (
                            <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80"
                              style={{ height:`${h}%`, background:i===11?"#6366f1":"#e0e7ff" }} />
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-300 mt-2"><span>Jan</span><span>Jun</span><span>Dec</span></div>
                      </div>
                      <div className="bg-white rounded-xl p-5 border border-gray-100">
                        <div className="font-bold text-gray-900 text-sm mb-5">Revenue by Region</div>
                        <div className="space-y-3.5">
                          {[["West","₹1.40Cr",100],["East","₹1.34Cr",96],["South","₹1.24Cr",89],["North","₹0.81Cr",58]].map(([r,v,p]) => (
                            <div key={String(r)} className="flex items-center gap-3">
                              <div className="w-12 text-xs font-semibold text-gray-500">{r}</div>
                              <div className="flex-1 bg-gray-100 rounded-full h-2">
                                <div className="bg-indigo-500 h-2 rounded-full" style={{ width:`${p}%` }} />
                              </div>
                              <div className="w-14 text-xs font-bold text-gray-700 text-right">{v}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "products" && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      {[["Total SKUs","47","Active products","#6366f1"],["Top Product","Laptop Pro","₹98L revenue","#10b981"],["Worst Performer","USB Hub","₹1.2L revenue","#ef4444"]].map(([l,v,s,c]) => (
                        <div key={String(l)} className="bg-white rounded-xl p-5 border border-gray-100" style={{ borderTopWidth:3, borderTopColor:String(c) }}>
                          <div className="text-xl font-black text-gray-900">{v}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1 mb-2">{l}</div>
                          <div className="text-xs font-semibold" style={{ color:String(c) }}>{s}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-100">
                      <div className="font-bold text-gray-900 text-sm mb-5">Top 10 Products by Revenue</div>
                      <div className="space-y-3">
                        {[["Laptop Pro","₹98L",100],["Office Chair","₹76L",78],["Wireless Mouse","₹54L",55],["Standing Desk","₹48L",49],["Monitor 27\"","₹42L",43],["Keyboard Mech","₹38L",39],["Webcam HD","₹31L",32],["Headphones BT","₹27L",28],["USB-C Hub","₹19L",19],["Mouse Pad XL","₹12L",12]].map(([n,r,p],i) => (
                          <div key={String(n)} className="flex items-center gap-3">
                            <div className="w-5 text-xs font-black text-gray-300">{i+1}</div>
                            <div className="w-32 text-xs font-semibold text-gray-700 truncate">{n}</div>
                            <div className="flex-1 bg-gray-100 rounded-full h-2">
                              <div className="bg-indigo-500 h-2 rounded-full" style={{ width:`${p}%` }} />
                            </div>
                            <div className="w-10 text-xs font-bold text-gray-700 text-right">{r}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "salesperson" && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      {[["Top Performer","Ravi Kumar","₹1.2Cr · 124% target","#10b981"],["Needs Support","Priya Sharma","₹34L · 68% target","#ef4444"],["Team Avg","94.3%","Across 8 reps","#6366f1"]].map(([l,v,s,c]) => (
                        <div key={String(l)} className="bg-white rounded-xl p-5 border border-gray-100" style={{ borderTopWidth:3, borderTopColor:String(c) }}>
                          <div className="text-base font-black text-gray-900">{v}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1 mb-2">{l}</div>
                          <div className="text-xs font-semibold" style={{ color:String(c) }}>{s}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-100">
                      <div className="font-bold text-gray-900 text-sm mb-5">Performance vs Target</div>
                      <div className="space-y-3">
                        {[["Ravi Kumar","₹1.2Cr",124,"#10b981"],["Amit Singh","₹98L",102,"#10b981"],["Neha Gupta","₹87L",97,"#6366f1"],["Raj Mehta","₹82L",91,"#6366f1"],["Sunita Rao","₹76L",84,"#f59e0b"],["Ankit Shah","₹61L",76,"#f59e0b"],["Deepa Nair","₹48L",72,"#f59e0b"],["Priya Sharma","₹34L",68,"#ef4444"]].map(([n,r,p,c]) => (
                          <div key={String(n)} className="flex items-center gap-3">
                            <div className="w-28 text-xs font-semibold text-gray-700 truncate">{n}</div>
                            <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                              <div className="h-2.5 rounded-full" style={{ width:`${Math.min(Number(p),100)}%`, background:String(c) }} />
                            </div>
                            <div className="w-20 text-right">
                              <span className="text-xs font-black" style={{ color:String(c) }}>{p}%</span>
                              <span className="text-xs text-gray-400 ml-1.5">{r}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "customers" && (
                  <>
                    <div className="grid grid-cols-4 gap-3">
                      {[["Total Customers","284","Unique buyers","#8b5cf6"],["New Customers","38%","First-time buyers","#6366f1"],["Repeat Rate","62%","Returning buyers","#10b981"],["Avg LTV","₹1.7L","Per customer","#f59e0b"]].map(([l,v,s,c]) => (
                        <div key={String(l)} className="bg-white rounded-xl p-5 border border-gray-100" style={{ borderTopWidth:3, borderTopColor:String(c) }}>
                          <div className="text-2xl font-black text-gray-900">{v}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1 mb-2">{l}</div>
                          <div className="text-xs font-semibold" style={{ color:String(c) }}>{s}</div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[{ title:"Customer Type", data:[["Corporate","48%",100,"#6366f1"],["SMB","31%",65,"#818cf8"],["Individual","21%",44,"#c7d2fe"]] },
                        { title:"Payment Mode",  data:[["Bank Transfer","44%",100,"#6366f1"],["Credit Card","28%",64,"#10b981"],["UPI","18%",41,"#f59e0b"],["Cash","10%",23,"#9ca3af"]] }
                      ].map(({ title, data }) => (
                        <div key={title} className="bg-white rounded-xl p-5 border border-gray-100">
                          <div className="font-bold text-gray-900 text-sm mb-5">{title}</div>
                          <div className="space-y-3.5">
                            {data.map(([n,p,w,c]) => (
                              <div key={String(n)} className="flex items-center gap-3">
                                <div className="w-24 text-xs font-semibold text-gray-700">{n}</div>
                                <div className="flex-1 bg-gray-100 rounded-full h-2">
                                  <div className="h-2 rounded-full" style={{ width:`${w}%`, background:String(c) }} />
                                </div>
                                <div className="text-xs font-bold text-gray-700 w-8 text-right">{p}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeTab === "forecast" && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      {[["Next Month","₹52L","Based on trend + seasonality","#10b981"],["6-Month Total","₹3.1Cr","Linear regression model","#6366f1"],["YoY Growth","+18%","vs same period last year","#8b5cf6"]].map(([l,v,s,c]) => (
                        <div key={String(l)} className="bg-white rounded-xl p-5 border border-gray-100" style={{ borderTopWidth:3, borderTopColor:String(c) }}>
                          <div className="text-2xl font-black text-gray-900">{v}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1 mb-2">{l}</div>
                          <div className="text-xs font-semibold" style={{ color:String(c) }}>{s}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-100">
                      <div className="flex justify-between items-center mb-5">
                        <span className="font-bold text-gray-900 text-sm">6-Month Revenue Forecast</span>
                        <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-semibold border border-green-100">Linear Regression</span>
                      </div>
                      <div className="flex items-end gap-2 h-32">
                        {[{h:82,a:true},{h:88,a:true},{h:95,a:true},{h:100,a:true},{h:104,a:false},{h:109,a:false},{h:115,a:false},{h:121,a:false},{h:127,a:false},{h:134,a:false}].map((b,i) => (
                          <div key={i} className="flex-1 rounded-t" style={{ height:`${b.h}%`, background:b.a?"#6366f1":"#bbf7d0", border:b.a?"none":"2px dashed #10b981" }} />
                        ))}
                      </div>
                      <div className="flex items-center gap-5 mt-3 text-xs">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-indigo-500" /><span className="text-gray-500">Actual</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-200 border border-dashed border-green-500" /><span className="text-gray-500">Forecast</span></div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "alerts" && (
                  <div className="space-y-3 max-w-3xl">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle size={16} className="text-amber-500" />
                      <span className="text-sm font-bold text-gray-700">5 alerts — 2 critical, 1 warning, 2 opportunities</span>
                    </div>
                    {[
                      { c:"#ef4444", bg:"#fef2f2", bdr:"#fecaca", tag:"Critical", text:"North region is 34% below target — immediate intervention needed. Consider reassigning leads or launching a campaign." },
                      { c:"#ef4444", bg:"#fef2f2", bdr:"#fecaca", tag:"Critical", text:"2 salespersons below 70% target with 8 days remaining. Schedule a 1:1 and review pipeline quality." },
                      { c:"#f59e0b", bg:"#fffbeb", bdr:"#fed7aa", tag:"Warning",  text:"Electronics category declining for 3 consecutive months. Review pricing strategy or launch a bundle offer." },
                      { c:"#10b981", bg:"#f0fdf4", bdr:"#bbf7d0", tag:"Opportunity", text:"West region exceeded target by 18%. Document and replicate this territory's playbook in South." },
                      { c:"#10b981", bg:"#f0fdf4", bdr:"#bbf7d0", tag:"Opportunity", text:"Corporate customers have 3.2x higher LTV. Increase B2B outreach to improve portfolio quality." },
                    ].map((a,i) => (
                      <div key={i} className="p-4 rounded-xl border" style={{ background:a.bg, borderColor:a.bdr, borderLeftWidth:3, borderLeftColor:a.c }}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background:a.c+"20", color:a.c }}>{a.tag}</span>
                        </div>
                        <div className="text-sm text-gray-700">{a.text}</div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
