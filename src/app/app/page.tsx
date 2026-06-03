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

export default function AppPage() {
  const [step, setStep] = useState<Step>("module");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); }
  }, []);

  const handleAnalyse = () => {
    setStep("analysing");
    setTimeout(() => setStep("results"), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-14 flex items-center px-6 gap-4">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-black">V</span>
          </div>
          <span className="font-black text-gray-900">Velytics</span>
        </Link>
        {/* Steps */}
        <div className="flex items-center gap-1 text-sm">
          {[["module","Choose Module"],["upload","Upload Data"],["analysing","Analysing"],["results","Results"]].map(([s,l],i,arr) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${step === s ? 'bg-indigo-600 text-white' : (arr.indexOf(arr.find(a=>a[0]===step)!) > i ? 'text-indigo-600' : 'text-gray-400')}`}>
                <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center ${step === s ? 'bg-white/20 text-white' : ''}`}>{i+1}</span>
                <span className="hidden sm:inline">{l}</span>
              </div>
              {i < arr.length-1 && <span className="text-gray-300 mx-1">›</span>}
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
                <p className="text-gray-500">Choose your industry. We'll configure the right analyses automatically.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {MODULES.map(m => (
                  <button key={m.id} onClick={() => { setSelectedModule(m.id); setStep("upload"); }}
                    className={`text-left p-5 rounded-xl border-2 transition-all hover:-translate-y-0.5 hover:shadow-md ${selectedModule === m.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 bg-white hover:border-indigo-200'}`}>
                    <div className="text-2xl mb-2">{m.icon}</div>
                    <div className="font-bold text-gray-900 text-sm">{m.name}</div>
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
              <button onClick={() => setStep("module")} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors">
                ← Back
              </button>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                  {MODULES.find(m=>m.id===selectedModule)?.icon} {selectedModule}
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Upload your data file</h1>
                <p className="text-gray-500 text-sm">Excel, CSV, or JSON · Any size · Any format</p>
              </div>

              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all ${dragging ? 'border-indigo-500 bg-indigo-50' : file ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'}`}
              >
                {file ? (
                  <div>
                    <div className="text-4xl mb-3">✅</div>
                    <div className="font-bold text-gray-900">{file.name}</div>
                    <div className="text-sm text-gray-400 mt-1">{(file.size/1024).toFixed(1)} KB · Ready to analyse</div>
                    <button onClick={() => setFile(null)} className="mt-4 text-xs text-gray-400 hover:text-red-500 transition-colors">Remove</button>
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
                <span className="text-base">🔒</span>
                <span>Your data is processed in memory and <strong className="text-gray-700">never stored</strong>. Deleted immediately after analysis.</span>
              </div>

              {file && (
                <button onClick={handleAnalyse}
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-base transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5">
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
              <div className="mt-6 space-y-2 text-left max-w-xs mx-auto">
                {["✅ File loaded successfully","✅ Auto-cleaning complete","⚡ Running statistical models..."].map((s,i) => (
                  <div key={i} className="text-sm text-gray-500 flex items-center gap-2">{s}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Results */}
        {step === "results" && (
          <div className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{MODULES.find(m=>m.id===selectedModule)?.icon}</span>
                  <h1 className="text-xl font-black text-gray-900">{selectedModule} Report</h1>
                </div>
                <p className="text-sm text-gray-400">{file?.name} · {new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setStep("module"); setFile(null); setSelectedModule(null); }}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
                  ← New analysis
                </button>
                <button className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all">
                  Download PDF
                </button>
              </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Revenue", value: "₹4.82Cr", sub: "+12% vs last month", color: "#6366f1" },
                { label: "Target Achievement", value: "94.3%", sub: "↑ 6 points vs target", color: "#10b981" },
                { label: "Unique Products", value: "47", sub: "Across 5 categories", color: "#6366f1" },
                { label: "Smart Alerts", value: "3", sub: "Needs attention", color: "#ef4444" },
              ].map(k => (
                <div key={k.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm" style={{ borderTopWidth: 3, borderTopColor: k.color }}>
                  <div className="text-2xl font-black text-gray-900 tracking-tight">{k.value}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">{k.label}</div>
                  <div className="text-xs font-semibold mt-2" style={{ color: k.color }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-gray-900 text-sm">Revenue Trend</span>
                  <span className="text-xs text-gray-400">Last 12 months</span>
                </div>
                <div className="flex items-end gap-1.5 h-32">
                  {[40,55,48,70,65,80,72,88,76,95,82,100].map((h,i) => (
                    <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80"
                      style={{ height: `${h}%`, background: i === 11 ? '#6366f1' : '#e0e7ff' }} />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-300 mt-2">
                  <span>Jan</span><span>Jun</span><span>Dec</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="font-bold text-gray-900 text-sm mb-4">Revenue by Region</div>
                <div className="space-y-3">
                  {[["West","₹1.40Cr",100],["East","₹1.34Cr",96],["South","₹1.24Cr",89],["North","₹0.81Cr",58]].map(([r,v,p]) => (
                    <div key={r} className="flex items-center gap-3">
                      <div className="w-16 text-xs font-semibold text-gray-500">{r}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${p}%` }} />
                      </div>
                      <div className="w-16 text-xs font-bold text-gray-700 text-right">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="font-bold text-gray-900 text-sm mb-4">🚨 Smart Alerts</div>
              <div className="space-y-3">
                {[
                  { color: "#ef4444", bg: "#fef2f2", text: "🔴 North region is 34% below target — needs immediate attention" },
                  { color: "#f59e0b", bg: "#fffbeb", text: "⚠️ Product category 'Electronics' showing declining trend for 3 consecutive months" },
                  { color: "#10b981", bg: "#f0fdf4", text: "✅ West region exceeded target by 18% — replicate this strategy" },
                ].map((a,i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl text-sm font-medium" style={{ background: a.bg, borderLeft: `3px solid ${a.color}`, color: '#1f2937' }}>
                    {a.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
