"use client";
import { useState, useCallback } from "react";
import Link from "next/link";

const MODULES = [
  { id: "Sales Intelligence", icon: "📈", name: "Sales", desc: "Revenue, targets & forecasts" },
  { id: "Inventory Intelligence", icon: "📦", name: "Inventory", desc: "Stock levels & reorder alerts" },
  { id: "HR & Payroll", icon: "👥", name: "HR & Payroll", desc: "Headcount, salary & attrition" },
  { id: "Finance & Accounting", icon: "💰", name: "Finance", desc: "P&L, budgets & cash flow" },
  { id: "Retail & E-commerce", icon: "🛒", name: "Retail", desc: "Orders, returns & channels" },
  { id: "Healthcare", icon: "🏥", name: "Healthcare", desc: "Patients, revenue & outcomes" },
  { id: "Manufacturing", icon: "🏭", name: "Manufacturing", desc: "Output, downtime & quality" },
  { id: "Marketing", icon: "📣", name: "Marketing", desc: "CAC, ROAS & campaigns" },
  { id: "Logistics", icon: "🚚", name: "Logistics", desc: "Routes, delivery & costs" },
  { id: "Banking", icon: "🏦", name: "Banking", desc: "Loans, NPA & collections" },
  { id: "Restaurant", icon: "🍽️", name: "Restaurant", desc: "Revenue, waste & ratings" },
  { id: "Education", icon: "🎓", name: "Education", desc: "Attendance, scores & fees" },
];

type Step = "module" | "upload" | "analysing" | "results";
type Tab = "overview" | "products" | "salesperson" | "customers" | "forecast" | "alerts";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "products", label: "Products", icon: "📦" },
  { id: "salesperson", label: "Salesperson", icon: "👤" },
  { id: "customers", label: "Customers", icon: "👥" },
  { id: "forecast", label: "Forecast", icon: "🔮" },
  { id: "alerts", label: "Smart Alerts", icon: "🚨" },
];

const REGIONS = ["All Regions", "North", "South", "East", "West"];
const CATEGORIES = ["All Categories", "Electronics", "Furniture", "Clothing", "Food", "Pharma"];
const PERIODS = ["Last 12 Months", "Last 6 Months", "Last 3 Months", "This Month"];

export default function AppPage() {
  const [step, setStep] = useState<Step>("module");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [region, setRegion] = useState("All Regions");
  const [category, setCategory] = useState("All Categories");
  const [period, setPeriod] = useState("Last 12 Months");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const handleAnalyse = () => {
    setStep("analysing");
    setTimeout(() => setStep("results"), 2500);
  };

  const mod = MODULES.find(m => m.id === selectedModule);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-14 flex items-center px-6 gap-4">
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-black">V</span>
          </div>
          <span className="font-black text-gray-900">Velytics</span>
        </Link>
        <div className="flex items-center gap-1 text-sm overflow-x-auto">
          {(["module","upload","analysing","results"] as Step[]).map((s, i, arr) => (
            <div key={s} className="flex items-center gap-1 shrink-0">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all text-xs ${step === s ? "bg-indigo-600 text-white" : i < arr.indexOf(step) ? "text-indigo-600" : "text-gray-400"}`}>
                <span className="font-black">{i+1}</span>
                <span className="hidden sm:inline capitalize">{s === "module" ? "Choose Module" : s === "analysing" ? "Analysing" : s === "upload" ? "Upload Data" : "Results"}</span>
              </div>
              {i < arr.length - 1 && <span className="text-gray-300">›</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-14 min-h-screen flex flex-col">

        {/* STEP 1: Choose Module */}
        {step === "module" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
            <div className="max-w-4xl w-full">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">What would you like to analyse?</h1>
                <p className="text-gray-500 text-sm">Choose your industry. We'll run the right analyses automatically.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {MODULES.map(m => (
                  <button key={m.id} onClick={() => { setSelectedModule(m.id); setStep("upload"); }}
                    className="text-left p-5 rounded-xl border-2 border-gray-100 bg-white transition-all hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 group">
                    <div className="text-2xl mb-2">{m.icon}</div>
                    <div className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{m.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Upload */}
        {step === "upload" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
            <div className="max-w-2xl w-full">
              <button onClick={() => setStep("module")} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors">← Back</button>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                  {mod?.icon} {selectedModule}
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Upload your data file</h1>
                <p className="text-gray-500 text-sm">Excel, CSV, or JSON · Any size · Any format</p>
              </div>
              <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all cursor-pointer ${dragging ? "border-indigo-500 bg-indigo-50" : file ? "border-green-400 bg-green-50" : "border-gray-200 bg-white hover:border-indigo-300"}`}>
                {file ? (
                  <div>
                    <div className="text-4xl mb-3">✅</div>
                    <div className="font-bold text-gray-900">{file.name}</div>
                    <div className="text-sm text-gray-400 mt-1">{(file.size/1024).toFixed(1)} KB · Ready to analyse</div>
                    <button onClick={() => setFile(null)} className="mt-3 text-xs text-gray-400 hover:text-red-500 transition-colors">Remove</button>
                  </div>
                ) : (
                  <div>
                    <div className="text-5xl mb-4">📂</div>
                    <div className="font-bold text-gray-900 mb-2">Drop your file here</div>
                    <div className="text-sm text-gray-400 mb-6">or click to browse</div>
                    <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
                      Browse files
                      <input type="file" accept=".xlsx,.csv,.json" className="hidden" onChange={e => e.target.files?.[0] && setFile(e.target.files[0])} />
                    </label>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 mt-4 p-4 bg-white border border-gray-100 rounded-xl text-sm text-gray-500">
                <span>🔒</span><span>Your data is processed in memory and <strong className="text-gray-700">never stored</strong>.</span>
              </div>
              {file && (
                <button onClick={handleAnalyse} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-base transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5">
                  Run Analysis →
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Analysing */}
        {step === "analysing" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-black text-gray-900 mb-2">Analysing your data</h2>
              <p className="text-gray-400 text-sm">Cleaning · Detecting columns · Running {selectedModule} analysis</p>
              <div className="mt-6 space-y-2 text-sm text-gray-500">
                {["✅ File loaded","✅ Auto-cleaning complete","⚡ Running statistical models..."].map((s,i) => <div key={i}>{s}</div>)}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Results */}
        {step === "results" && (
          <div className="flex-1 flex">
            {/* Left sidebar filters */}
            <div className="w-56 shrink-0 bg-white border-r border-gray-100 p-5 space-y-6">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Filters</div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Period</label>
                    <select value={period} onChange={e => setPeriod(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-indigo-400">
                      {PERIODS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Region</label>
                    <select value={region} onChange={e => setRegion(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-indigo-400">
                      {REGIONS.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-indigo-400">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-5">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">File Info</div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="font-semibold text-gray-700 truncate">{file?.name ?? "sales_test_data.xlsx"}</div>
                  <div>200 rows · 13 columns</div>
                  <div className="text-green-600 font-semibold">✅ Auto-cleaned</div>
                </div>
              </div>
              <button onClick={() => { setStep("module"); setFile(null); setSelectedModule(null); setActiveTab("overview"); }}
                className="w-full text-xs font-semibold text-gray-500 hover:text-indigo-600 py-2 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all">
                ← New analysis
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
              {/* Header */}
              <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span>{mod?.icon}</span>
                    <h1 className="text-lg font-black text-gray-900">{selectedModule} Report</h1>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{file?.name ?? "sales_test_data.xlsx"} · {region} · {category} · {period}</p>
                </div>
                <button className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2">
                  ⬇ Download PDF
                </button>
              </div>

              {/* Tabs */}
              <div className="bg-white border-b border-gray-100 px-6 flex gap-1">
                {TABS.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${activeTab === t.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-700"}`}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-5">

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <>
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: "Total Revenue", value: "₹4.82Cr", sub: "+12% vs last month", color: "#6366f1" },
                        { label: "Target Achievement", value: "94.3%", sub: "↑ 6 pts vs target", color: "#10b981" },
                        { label: "Units Sold", value: "2,847", sub: "Across all products", color: "#6366f1" },
                        { label: "Avg Order Value", value: "₹16,930", sub: "Per transaction", color: "#8b5cf6" },
                      ].map(k => (
                        <div key={k.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm" style={{ borderTopWidth: 3, borderTopColor: k.color }}>
                          <div className="text-2xl font-black text-gray-900 tracking-tight">{k.value}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">{k.label}</div>
                          <div className="text-xs font-semibold mt-2" style={{ color: k.color }}>{k.sub}</div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-bold text-gray-900 text-sm">Revenue Trend</span>
                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">{period}</span>
                        </div>
                        <div className="flex items-end gap-1.5 h-28">
                          {[40,55,48,70,65,80,72,88,76,95,82,100].map((h,i) => (
                            <div key={i} className="flex-1 rounded-t" style={{ height:`${h}%`, background: i===11?"#6366f1":"#e0e7ff" }} />
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-300 mt-2"><span>Jan</span><span>Jun</span><span>Dec</span></div>
                      </div>
                      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                        <div className="font-bold text-gray-900 text-sm mb-4">Revenue by Region</div>
                        <div className="space-y-3">
                          {[["West","₹1.40Cr",100],["East","₹1.34Cr",96],["South","₹1.24Cr",89],["North","₹0.81Cr",58]].map(([r,v,p]) => (
                            <div key={String(r)} className="flex items-center gap-3">
                              <div className="w-12 text-xs font-semibold text-gray-500">{r}</div>
                              <div className="flex-1 bg-gray-100 rounded-full h-2">
                                <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width:`${p}%` }} />
                              </div>
                              <div className="w-14 text-xs font-bold text-gray-700 text-right">{v}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* PRODUCTS TAB */}
                {activeTab === "products" && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      {[["Total SKUs","47","Active products"],["Top Product","Laptop Pro","₹98L revenue"],["Worst Performer","USB Hub","₹1.2L revenue"]].map(([l,v,s]) => (
                        <div key={String(l)} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm" style={{ borderTopWidth:3, borderTopColor:"#6366f1" }}>
                          <div className="text-xl font-black text-gray-900">{v}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">{l}</div>
                          <div className="text-xs text-indigo-500 font-semibold mt-2">{s}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                      <div className="font-bold text-gray-900 text-sm mb-4">Top 10 Products by Revenue</div>
                      <div className="space-y-3">
                        {[["Laptop Pro","₹98L",100],["Office Chair","₹76L",78],["Wireless Mouse","₹54L",55],["Standing Desk","₹48L",49],["Monitor 27\"","₹42L",43],["Keyboard Mech","₹38L",39],["Webcam HD","₹31L",32],["Headphones BT","₹27L",28],["USB-C Hub","₹19L",19],["Mouse Pad XL","₹12L",12]].map(([name,rev,pct],i) => (
                          <div key={String(name)} className="flex items-center gap-3">
                            <div className="w-5 text-xs font-black text-gray-300">{i+1}</div>
                            <div className="w-36 text-xs font-semibold text-gray-700 truncate">{name}</div>
                            <div className="flex-1 bg-gray-100 rounded-full h-2">
                              <div className="bg-indigo-500 h-2 rounded-full" style={{ width:`${pct}%` }} />
                            </div>
                            <div className="w-10 text-xs font-bold text-gray-700 text-right">{rev}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* SALESPERSON TAB */}
                {activeTab === "salesperson" && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      {[["Top Performer","Ravi Kumar","₹1.2Cr · 124% of target"],["Needs Support","Priya Sharma","₹34L · 68% of target"],["Avg Achievement","Team","94.3% across 8 reps"]].map(([l,v,s]) => (
                        <div key={String(l)} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm" style={{ borderTopWidth:3, borderTopColor: String(l).includes("Support")?"#ef4444":"#6366f1" }}>
                          <div className="text-base font-black text-gray-900">{v}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">{l}</div>
                          <div className="text-xs font-semibold mt-2 text-indigo-500">{s}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                      <div className="font-bold text-gray-900 text-sm mb-4">Salesperson Performance vs Target</div>
                      <div className="space-y-3">
                        {[["Ravi Kumar","₹1.2Cr",124,"#10b981"],["Amit Singh","₹98L",102,"#10b981"],["Neha Gupta","₹87L",97,"#6366f1"],["Raj Mehta","₹82L",91,"#6366f1"],["Sunita Rao","₹76L",84,"#f59e0b"],["Ankit Shah","₹61L",76,"#f59e0b"],["Deepa Nair","₹48L",72,"#f59e0b"],["Priya Sharma","₹34L",68,"#ef4444"]].map(([name,rev,pct,color]) => (
                          <div key={String(name)} className="flex items-center gap-3">
                            <div className="w-28 text-xs font-semibold text-gray-700 truncate">{name}</div>
                            <div className="flex-1 bg-gray-100 rounded-full h-3">
                              <div className="h-3 rounded-full transition-all" style={{ width:`${Math.min(Number(pct),100)}%`, background:String(color) }} />
                            </div>
                            <div className="w-16 text-right">
                              <span className="text-xs font-black" style={{ color:String(color) }}>{pct}%</span>
                              <span className="text-xs text-gray-400 ml-1">{rev}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* CUSTOMERS TAB */}
                {activeTab === "customers" && (
                  <>
                    <div className="grid grid-cols-4 gap-4">
                      {[["Total Customers","284","Unique buyers"],["New Customers","38%","First-time buyers"],["Repeat Rate","62%","Returning buyers"],["Avg LTV","₹1.7L","Per customer"]].map(([l,v,s]) => (
                        <div key={String(l)} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm" style={{ borderTopWidth:3, borderTopColor:"#8b5cf6" }}>
                          <div className="text-2xl font-black text-gray-900">{v}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">{l}</div>
                          <div className="text-xs text-purple-500 font-semibold mt-2">{s}</div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                        <div className="font-bold text-gray-900 text-sm mb-4">Customer Type Split</div>
                        <div className="space-y-3">
                          {[["Corporate","48%",100,"#6366f1"],["SMB","31%",65,"#818cf8"],["Individual","21%",44,"#c7d2fe"]].map(([t,p,w,c]) => (
                            <div key={String(t)} className="flex items-center gap-3">
                              <div className="w-20 text-xs font-semibold text-gray-700">{t}</div>
                              <div className="flex-1 bg-gray-100 rounded-full h-3">
                                <div className="h-3 rounded-full" style={{ width:`${w}%`, background:String(c) }} />
                              </div>
                              <div className="text-xs font-bold text-gray-700">{p}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                        <div className="font-bold text-gray-900 text-sm mb-4">Payment Mode</div>
                        <div className="space-y-3">
                          {[["Bank Transfer","44%",100,"#6366f1"],["Credit Card","28%",64,"#10b981"],["UPI","18%",41,"#f59e0b"],["Cash","10%",23,"#9ca3af"]].map(([m,p,w,c]) => (
                            <div key={String(m)} className="flex items-center gap-3">
                              <div className="w-24 text-xs font-semibold text-gray-700">{m}</div>
                              <div className="flex-1 bg-gray-100 rounded-full h-3">
                                <div className="h-3 rounded-full" style={{ width:`${w}%`, background:String(c) }} />
                              </div>
                              <div className="text-xs font-bold text-gray-700">{p}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* FORECAST TAB */}
                {activeTab === "forecast" && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      {[["Next Month Forecast","₹52L","Based on trend + seasonality"],["6-Month Projection","₹3.1Cr","Linear regression model"],["YoY Growth","+18%","vs same period last year"]].map(([l,v,s]) => (
                        <div key={String(l)} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm" style={{ borderTopWidth:3, borderTopColor:"#10b981" }}>
                          <div className="text-2xl font-black text-gray-900">{v}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">{l}</div>
                          <div className="text-xs text-green-600 font-semibold mt-2">{s}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-gray-900 text-sm">6-Month Revenue Forecast</span>
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded font-semibold">Linear Regression</span>
                      </div>
                      <div className="flex items-end gap-2 h-32">
                        {[{h:82,actual:true},{h:88,actual:true},{h:95,actual:true},{h:100,actual:true},{h:104,actual:false},{h:109,actual:false},{h:115,actual:false},{h:121,actual:false},{h:127,actual:false},{h:134,actual:false}].map((b,i) => (
                          <div key={i} className="flex-1 rounded-t" style={{ height:`${b.h}%`, background: b.actual?"#6366f1":"#bbf7d0", border: b.actual?"none":"2px dashed #10b981" }} />
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-indigo-500" /><span className="text-gray-500">Actual</span></div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-200 border border-dashed border-green-500" /><span className="text-gray-500">Forecast</span></div>
                      </div>
                    </div>
                  </>
                )}

                {/* ALERTS TAB */}
                {activeTab === "alerts" && (
                  <div className="space-y-3">
                    <div className="text-sm font-bold text-gray-700 mb-2">3 alerts require attention</div>
                    {[
                      { color:"#ef4444", bg:"#fef2f2", title:"🔴 Critical", text:"North region is 34% below target — immediate intervention needed. Consider reassigning leads or running a campaign." },
                      { color:"#f59e0b", bg:"#fffbeb", title:"⚠️ Warning", text:"Product category 'Electronics' showing declining trend for 3 consecutive months. Review pricing or bundling strategy." },
                      { color:"#f59e0b", bg:"#fffbeb", title:"⚠️ Warning", text:"Priya Sharma is at 68% of target with 8 days left in the month. Consider coaching or reassignment." },
                      { color:"#10b981", bg:"#f0fdf4", title:"✅ Opportunity", text:"West region exceeded target by 18%. Replicate this territory's playbook in South region to close the gap." },
                      { color:"#10b981", bg:"#f0fdf4", title:"✅ Opportunity", text:"Corporate customers have 3.2x higher LTV vs Individual. Increase B2B outreach to improve portfolio quality." },
                    ].map((a,i) => (
                      <div key={i} className="p-4 rounded-xl text-sm" style={{ background:a.bg, borderLeft:`3px solid ${a.color}` }}>
                        <div className="font-bold mb-1" style={{ color:a.color }}>{a.title}</div>
                        <div className="text-gray-700">{a.text}</div>
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
