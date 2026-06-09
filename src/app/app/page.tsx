"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp, Package, Users, DollarSign, ShoppingCart,
  Activity, Factory, Megaphone, Truck, Landmark,
  UtensilsCrossed, GraduationCap, UploadCloud, ChevronRight,
  BarChart2, Zap, FileText, X, ArrowLeft,
  SlidersHorizontal, Download, RefreshCw, Sparkles, Database, FileSpreadsheet,
  PieChart, LineChart as LineIcon, BarChart3, AreaChart,
  Maximize2, Check, Table2, Pencil
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://velytics-api.onrender.com";

const MODULES = [
  { id:"Sales Intelligence",     Icon:TrendingUp,     name:"Sales",         desc:"Revenue, targets & forecasts",   color:"#6366f1", bg:"#eef2ff" },
  { id:"Inventory Intelligence", Icon:Package,         name:"Inventory",     desc:"Stock levels & reorder alerts",  color:"#f59e0b", bg:"#fffbeb" },
  { id:"HR & Payroll",           Icon:Users,           name:"HR & Payroll",  desc:"Headcount, salary & attrition",  color:"#10b981", bg:"#f0fdf4" },
  { id:"Finance & Accounting",   Icon:DollarSign,      name:"Finance",       desc:"P&L, budgets & cash flow",       color:"#3b82f6", bg:"#eff6ff" },
  { id:"Retail & E-commerce",    Icon:ShoppingCart,    name:"Retail",        desc:"Orders, returns & channels",     color:"#8b5cf6", bg:"#f5f3ff" },
  { id:"Healthcare",             Icon:Activity,        name:"Healthcare",    desc:"Patients, revenue & outcomes",   color:"#ef4444", bg:"#fef2f2" },
  { id:"Manufacturing",          Icon:Factory,         name:"Manufacturing", desc:"Output, downtime & quality",     color:"#64748b", bg:"#f8fafc" },
  { id:"Marketing",              Icon:Megaphone,       name:"Marketing",     desc:"CAC, ROAS & campaigns",          color:"#ec4899", bg:"#fdf2f8" },
  { id:"Logistics",              Icon:Truck,           name:"Logistics",     desc:"Routes, delivery & costs",       color:"#f97316", bg:"#fff7ed" },
  { id:"Banking",                Icon:Landmark,        name:"Banking",       desc:"Loans, NPA & collections",       color:"#0ea5e9", bg:"#f0f9ff" },
  { id:"Restaurant",             Icon:UtensilsCrossed, name:"Restaurant",    desc:"Revenue, waste & ratings",       color:"#d97706", bg:"#fffbeb" },
  { id:"Education",              Icon:GraduationCap,   name:"Education",     desc:"Attendance, scores & fees",      color:"#7c3aed", bg:"#faf5ff" },
  { id:"Hospitality",            Icon:Landmark,        name:"Hospitality",   desc:"Occupancy, ADR & RevPAR",        color:"#0d9488", bg:"#f0fdfa" },
  { id:"Agriculture",            Icon:Activity,        name:"Agriculture",   desc:"Yield, cost & seasons",          color:"#16a34a", bg:"#f0fdf4" },
  { id:"Construction",           Icon:Factory,         name:"Construction",  desc:"Projects, phases & cost",        color:"#ca8a04", bg:"#fefce8" },
];

// The two tools (one shared engine underneath). More coming later.
const TOOLS = [
  { id:"analyze",  name:"Analyze & Dashboard", desc:"Charts, KPIs & insights from your data", Icon:BarChart2, color:"#6366f1", bg:"#eef2ff" },
  { id:"metadata", name:"Metadata",            desc:"Inspect every column — type, quality & structure", Icon:Database, color:"#0ea5e9", bg:"#f0f9ff" },
];

type Step = "module"|"upload"|"analysing"|"results";
type Tab  = "overview"|"alerts"|"data";


// ── Formatting / generic helpers (work for ANY module) ──────────────────────
let CUR = "$";   // detected per file (set in render); Western default
function fmt(v:number):string {
  if(v==null||isNaN(v)) return "—";
  const c=CUR, n=Math.abs(v);
  if(n>=1e9) return `${c}${(v/1e9).toFixed(2)}B`;
  if(n>=1e6) return `${c}${(v/1e6).toFixed(2)}M`;
  if(n>=1e3) return `${c}${(v/1e3).toFixed(1)}K`;
  return `${c}${Math.round(v).toLocaleString()}`;
}

const ACRONYMS:Record<string,string> = {
  roas:"ROAS", npa:"NPA", skus:"SKUs", sku:"SKU", aov:"AOV", hr:"HR",
  hrs:"Hrs", id:"ID", pct:"%", kpi:"KPI",
};
function humanize(key:string):string {
  return String(key).replace(/_/g," ").trim().split(/\s+/)
    .map(w => ACRONYMS[w.toLowerCase()] ?? (w.charAt(0).toUpperCase()+w.slice(1)))
    .join(" ");
}

const PCTISH = ["rate","pct","achievement","efficiency","conversion","margin"];
function kpiValue(kpis:any, key:string):string {
  if(kpis[key+"_fmt"]!=null) return kpis[key+"_fmt"];
  const v = kpis[key];
  if(v==null) return "—";
  if(typeof v==="number"){
    if(PCTISH.some(p => key.toLowerCase().includes(p))) return `${v}%`;
    return Number.isInteger(v) ? v.toLocaleString() : v.toLocaleString(undefined,{maximumFractionDigits:2});
  }
  return String(v);
}

const CURRENCY_KEYS = ["value","revenue","amount","cost","spend","payroll","fees","salary","disbursed","outstanding","budget","sum","mean"];
function valFmt(v:any, key:string):string {
  const n = Number(v);
  if(v==null || isNaN(n)) return v==null ? "—" : String(v);
  return CURRENCY_KEYS.includes(String(key).toLowerCase()) ? fmt(n) : n.toLocaleString();
}

function labelKeyOf(o:any):string {
  for(const p of ["name","region","product","type","method","category","column","class","label","month"])
    if(p in o) return p;
  return Object.keys(o).find(k => typeof o[k]==="string") ?? Object.keys(o)[0];
}
function valueKeyOf(o:any, labelKey:string):string {
  for(const p of ["value","revenue","amount","cost","spend","units","count","salary","sum"])
    if(p in o && typeof o[p]==="number") return p;
  return Object.keys(o).find(k => k!==labelKey && typeof o[k]==="number") ?? "";
}

// ── Reusable visual bits ────────────────────────────────────────────────────
function HBar({value,max,color="#6366f1"}:{value:number;max:number;color?:string}) {
  return (
    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{width:`${Math.min((value/(max||1))*100,100)}%`,background:color}}/>
    </div>
  );
}

function BarChartSVG({data}:{data:{label:string;value:number;highlight?:boolean}[]}) {
  const max=Math.max(...data.map(d=>d.value),0);
  const W=Math.max(data.length*36,36);
  return (
    <svg viewBox={`0 0 ${W} 90`} className="w-full h-28" preserveAspectRatio="none">
      {data.map((d,i)=>{
        const h=max>0?(d.value/max)*68:0;
        const x=i*36+6;
        return (
          <g key={i}>
            <rect x={x} y={88-h} width="22" height={h} rx="3" fill={d.highlight?"#6366f1":"#e0e7ff"}/>
            <text x={x+11} y="89" textAnchor="middle" fontSize="7" fill="#cbd5e1">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

const PALETTE=["#6366f1","#818cf8","#a5b4fc","#c7d2fe","#10b981","#f59e0b","#ec4899","#0ea5e9"];

function BreakdownCard({title,rows}:{title:string;rows:any[]}) {
  const lk=labelKeyOf(rows[0]);
  const vk=valueKeyOf(rows[0],lk);
  const hasPct = "pct" in rows[0];
  const max=Math.max(...rows.map(r=>Number(r[vk])||0),1);
  return (
    <div className="bg-white rounded-2xl p-5" style={{border:"1px solid rgba(255,255,255,0.08)",boxShadow:"0 8px 30px rgba(0,0,0,0.25)",background:"rgba(255,255,255,0.04)",backdropFilter:"blur(16px)"}}>
      <div className="font-bold text-white text-sm mb-4">{title}</div>
      <div className="space-y-3">
        {rows.slice(0,10).map((r,i)=>(
          <div key={i} className="flex items-center gap-3">
            <span className="w-36 text-xs font-semibold text-slate-200 truncate shrink-0">{String(r[lk])}</span>
            <HBar value={hasPct?Number(r.pct):Number(r[vk])} max={hasPct?100:max} color={PALETTE[i%PALETTE.length]}/>
            <span className="text-xs font-bold text-slate-200 w-16 text-right shrink-0">{vk?valFmt(r[vk],vk):(hasPct?`${r.pct}%`:"")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataTable({title,rows,onZoom}:{title:string;rows:any[];onZoom?:()=>void}) {
  const cols=Object.keys(rows[0]);
  return (
    <div className="rounded-xl overflow-hidden" style={PANEL}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="font-bold text-white text-sm">{title}</div>
        {onZoom&&<button onClick={onZoom} title="Focus & view data"
          className="p-1.5 rounded-md text-slate-500 hover:text-indigo-300 hover:bg-white/10 transition-colors"><Maximize2 size={14}/></button>}
      </div>
      <div className="p-4 overflow-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-slate-400 border-b border-white/10">
            {cols.map(c=><th key={c} className="text-left font-semibold py-2 px-2 whitespace-nowrap">{humanize(c)}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0,15).map((r,i)=>(
            <tr key={i} className="border-b border-white/5">
              {cols.map(c=><td key={c} className="py-2 px-2 text-slate-200 whitespace-nowrap">{typeof r[c]==="number"?valFmt(r[c],c):String(r[c])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

const DCARD = {border:"1px solid rgba(255,255,255,0.08)",boxShadow:"0 8px 30px rgba(0,0,0,0.25)",background:"rgba(255,255,255,0.04)",backdropFilter:"blur(16px)"} as React.CSSProperties;

// Value → colour heat scale: lowest = red, mid = amber, highest = green.
function heat(frac:number){ const h=Math.max(0,Math.min(1, Number.isFinite(frac)?frac:0.5))*120; return `hsl(${Math.round(h)},72%,52%)`; }
const colorScale = (v:number, mn:number, mx:number)=> mx>mn ? heat((v-mn)/(mx-mn)) : "#6366f1";

function Donut({rows,big=false}:{rows:any[];big?:boolean}) {
  const lk=labelKeyOf(rows[0]); const vk=valueKeyOf(rows[0],lk);
  const data=rows.slice(0,8).map((r:any)=>({name:String(r[lk]), value:Math.max(0,Number(r[vk])||0)}));
  const total=data.reduce((s,d)=>s+d.value,0)||1;
  const vals=data.map(d=>d.value); const mn=Math.min(...vals), mx=Math.max(...vals);
  const R=54, C=70, sw=20, circ=2*Math.PI*R; let acc=0;
  return (
    <div className={`flex items-center ${big?"gap-10":"gap-6"}`}>
      <svg viewBox="0 0 140 140" className={`${big?"w-56 h-56":"w-36 h-36"} shrink-0`} style={{transform:"rotate(-90deg)"}}>
        <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw}/>
        {data.map((d,i)=>{ const len=(d.value/total)*circ; const el=<circle key={i} cx={C} cy={C} r={R} fill="none" stroke={colorScale(d.value,mn,mx)} strokeWidth={sw} strokeDasharray={`${len} ${circ-len}`} strokeDashoffset={-acc}/>; acc+=len; return el; })}
      </svg>
      <div className={`${big?"space-y-2.5":"space-y-1.5"} flex-1 min-w-0`}>
        {data.map((d,i)=>(
          <div key={i} className={`flex items-center gap-2 ${big?"text-sm":"text-xs"}`}>
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{background:colorScale(d.value,mn,mx)}}/>
            <span className="text-slate-300 truncate flex-1">{d.name}</span>
            {big&&<span className="text-slate-200 font-semibold shrink-0">{valFmt(d.value,vk)}</span>}
            <span className="text-slate-400 shrink-0 w-9 text-right">{Math.round(d.value/total*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendLine({data, fill=true, big=false}:{data:{label:string;value:number}[]; fill?:boolean; big?:boolean}) {
  const max=Math.max(...data.map(d=>d.value),0)||1;
  const W=Math.max(data.length*40,80), H=96;
  const pts=data.map((d,i)=>[(data.length>1?i/(data.length-1):0)*(W-16)+8, H-16-(d.value/max)*(H-30)]);
  const line=pts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area=pts.length?`${line} L ${pts[pts.length-1][0].toFixed(1)},${H-16} L ${pts[0][0].toFixed(1)},${H-16} Z`:'';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`w-full ${big?"h-72":"h-28"}`} preserveAspectRatio={big?"xMidYMid meet":"none"}>
      <defs><linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8" stopOpacity="0.35"/><stop offset="100%" stopColor="#818cf8" stopOpacity="0"/></linearGradient></defs>
      {fill && area && <path d={area} fill="url(#vg)"/>}
      <path d={line} fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="#a5b4fc"/>)}
      {data.map((d,i)=><text key={i} x={pts[i][0]} y={H-3} fontSize="7" fill="#64748b" textAnchor="middle">{d.label}</text>)}
    </svg>
  );
}

// Vertical columns, heat-coloured by value (low = red → high = green)
function ColumnChart({data,big=false}:{data:{label:string;value:number}[];big?:boolean}) {
  const vals=data.map(d=>d.value); const mx=Math.max(...vals,0)||1, mn=Math.min(...vals,0);
  const W=Math.max(data.length*44,60), H=112;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`w-full ${big?"h-72":"h-32"}`} preserveAspectRatio={big?"xMidYMid meet":"none"}>
      {data.map((d,i)=>{ const h=Math.max((d.value/mx)*(H-28),1); const x=i*44+8; return (
        <g key={i}>
          <rect x={x} y={H-18-h} width="28" height={h} rx="3" fill={colorScale(d.value,mn,mx)}/>
          <text x={x+14} y={H-5} fontSize="7" fill="#94a3b8" textAnchor="middle">{String(d.label).slice(0,6)}</text>
        </g>); })}
    </svg>
  );
}

const PANEL = {border:"1px solid rgba(255,255,255,0.10)",boxShadow:"0 8px 30px rgba(0,0,0,0.25)",background:"rgba(255,255,255,0.04)",backdropFilter:"blur(16px)"} as React.CSSProperties;

// Renders one chart of a given type — shared by the small card and the big focus modal.
function Viz({rows,type,big=false}:{rows:any[];type:string;big?:boolean}) {
  const item=rows[0]||{};
  const isTrend="month" in item;
  const lk=labelKeyOf(item); const vk=valueKeyOf(item,lk);
  const hasPct="pct" in item;
  const vals=rows.map((r:any)=>Number(r[vk])||0); const mn=Math.min(...vals), mx=Math.max(...vals,1);
  const lv=(limit=rows.length)=>rows.slice(0,limit).map((r:any)=>({label:isTrend?String(r.month).slice(-3):String(r[lk]), value:Number(r[vk]??r.value)||0}));
  if(type==="pie")    return <Donut rows={rows} big={big}/>;
  if(type==="line")   return <TrendLine fill={false} data={lv()} big={big}/>;
  if(type==="area")   return <TrendLine fill={true}  data={lv()} big={big}/>;
  if(type==="column") return <ColumnChart data={lv(big?24:12)} big={big}/>;
  // bar (default)
  return (
    <div className={big?"space-y-4":"space-y-3"}>
      {rows.slice(0,big?20:10).map((r:any,i:number)=>{ const v=Number(r[vk])||0; return (
        <div key={i} className="flex items-center gap-3">
          <span className={`${big?"w-48 text-sm":"w-36 text-xs"} font-semibold text-slate-200 truncate shrink-0`}>{String(r[lk])}</span>
          <HBar value={hasPct?Number(r.pct):v} max={hasPct?100:mx} color={colorScale(v,mn,mx)}/>
          <span className={`${big?"text-sm w-24":"text-xs w-16"} font-bold text-slate-200 text-right shrink-0`}>{vk?valFmt(r[vk],vk):(hasPct?`${r.pct}%`:"")}</span>
        </div>); })}
    </div>
  );
}

const chartIcon=(o:string)=> o==="pie"?PieChart:o==="line"?LineIcon:o==="area"?AreaChart:o==="column"?BarChart2:BarChart3;
function TypeSwitch({opts,type,setType}:{opts:string[];type:string;setType:(t:string)=>void}) {
  return (
    <div className="flex gap-0.5">
      {opts.map(o=>{ const Icon=chartIcon(o); return (
        <button key={o} onClick={()=>setType(o)} title={o}
          className={`p-1.5 rounded-md transition-colors ${type===o?"bg-white/10 text-indigo-300":"text-slate-500 hover:text-slate-300"}`}>
          <Icon size={14}/>
        </button>); })}
    </div>
  );
}

// One adaptive chart card — boxed panel, bar-default, with a focus/zoom button.
function ChartCard({title,rows,onZoom}:{title:string;rows:any[];onZoom?:()=>void}) {
  const item=rows[0]||{};
  const isTrend = "month" in item;
  const isShortTrend = isTrend && rows.length<=4;          // 3-mo forecast → don't stretch a flat line
  const isBreakdown = ("pct" in item) || Object.keys(item).length<=2;
  const opts:string[] = isTrend ? ["line","area","column"] : ["bar","pie","column"];
  const [type,setType] = useState<string>(isTrend ? (isShortTrend?"column":"line") : "bar");
  if(!isTrend && !isBreakdown) return <div className="lg:col-span-3"><DataTable title={title} rows={rows} onZoom={onZoom}/></div>;
  const fullWidth = isTrend && !isShortTrend;
  return (
    <div className={`${fullWidth?"lg:col-span-3":""} rounded-xl flex flex-col overflow-hidden`} style={PANEL}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="font-bold text-white text-sm truncate">{title}</div>
        <div className="flex items-center gap-1 shrink-0">
          <TypeSwitch opts={opts} type={type} setType={setType}/>
          {onZoom&&<button onClick={onZoom} title="Focus & view data"
            className="p-1.5 rounded-md text-slate-500 hover:text-indigo-300 hover:bg-white/10 transition-colors"><Maximize2 size={14}/></button>}
        </div>
      </div>
      <div className="p-4 flex-1"><Viz rows={rows} type={type}/></div>
    </div>
  );
}

// Click-to-zoom focus view: enlarged chart + the full data table behind it.
function FocusModal({title,rows,onClose}:{title:string;rows:any[];onClose:()=>void}) {
  const item=rows[0]||{};
  const isTrend="month" in item;
  const isBreakdown=("pct" in item)||Object.keys(item).length<=2;
  const chartable=isTrend||isBreakdown;
  const opts:string[]=isTrend?["line","area","column"]:["bar","pie","column"];
  const [type,setType]=useState<string>(isTrend?"line":"bar");
  const cols=Object.keys(item);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{background:"rgba(3,3,12,0.78)",backdropFilter:"blur(6px)"}} onClick={onClose}>
      <div className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden" style={PANEL} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0" style={{background:"rgba(10,10,20,0.9)"}}>
          <div className="font-black text-white text-lg truncate">{title}</div>
          <div className="flex items-center gap-2 shrink-0">
            {chartable&&<TypeSwitch opts={opts} type={type} setType={setType}/>}
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"><X size={18}/></button>
          </div>
        </div>
        <div className="p-6 space-y-6 overflow-auto">
          {chartable&&(
            <div className="rounded-xl p-5" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
              <Viz rows={rows} type={type} big/>
            </div>
          )}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-3">Data behind this chart · {rows.length} rows</div>
            <div className="overflow-auto rounded-xl" style={{border:"1px solid rgba(255,255,255,0.08)"}}>
              <table className="w-full text-sm">
                <thead><tr className="text-slate-400 border-b border-white/10" style={{background:"rgba(255,255,255,0.03)"}}>
                  {cols.map(c=><th key={c} className="text-left font-semibold py-2.5 px-3 whitespace-nowrap">{humanize(c)}</th>)}
                </tr></thead>
                <tbody>
                  {rows.map((r:any,i:number)=>(
                    <tr key={i} className="border-b border-white/5">
                      {cols.map(c=><td key={c} className="py-2 px-3 text-slate-200 whitespace-nowrap">{typeof r[c]==="number"?valFmt(r[c],c):String(r[c])}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const HEALTH_SEV: Record<string,{bg:string;c:string;label:string}> = {
  high:   {bg:"#fef2f2", c:"#dc2626", label:"High"},
  medium: {bg:"#fffbeb", c:"#d97706", label:"Medium"},
  low:    {bg:"#eff6ff", c:"#2563eb", label:"Low"},
  fixed:  {bg:"#f0fdf4", c:"#059669", label:"Fixed"},
};
function healthColor(s:number){ return s>=85?"#10b981":s>=70?"#84cc16":s>=50?"#f59e0b":"#ef4444"; }
const FP_SEV: Record<string,{bg:string;c:string;label:string}> = {
  high:   {bg:"#fef2f2", c:"#dc2626", label:"Risk"},
  medium: {bg:"#fffbeb", c:"#d97706", label:"Check"},
  ok:     {bg:"#f0fdf4", c:"#059669", label:"OK"},
};

function HealthGauge({score}:{score:number}) {
  const R=80, CX=100, CY=100, SW=16, len=Math.PI*R;
  const s=Math.max(0,Math.min(100,score||0));
  const color=healthColor(s);
  const ang=Math.PI*(1 - s/100);
  const nx=CX+(R-24)*Math.cos(ang), ny=CY-(R-24)*Math.sin(ang);
  const track=`M ${CX-R} ${CY} A ${R} ${R} 0 0 1 ${CX+R} ${CY}`;
  return (
    <svg viewBox="0 0 200 110" className="w-40">
      <path d={track} fill="none" stroke="#eef2f7" strokeWidth={SW} strokeLinecap="round"/>
      <path d={track} fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round" strokeDasharray={`${len*s/100} ${len}`}/>
      <line x1={CX} y1={CY} x2={nx} y2={ny} stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx={CX} cy={CY} r="6" fill="#0f172a"/>
    </svg>
  );
}

// Tiny in-card trend line (sparkline), no axes/labels
function MiniSpark({data,color="#818cf8"}:{data:number[];color?:string}) {
  if(!data||data.length<2) return null;
  const max=Math.max(...data), min=Math.min(...data), rng=(max-min)||1;
  const W=120,H=28;
  const pts=data.map((v,i)=>[i/(data.length-1)*W, H-((v-min)/rng)*(H-6)-3]);
  const line=pts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area=`${line} L ${W},${H} L 0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-7" preserveAspectRatio="none">
      <defs><linearGradient id="spk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <path d={area} fill="url(#spk)"/>
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2" fill={color}/>
    </svg>
  );
}

// Rich KPI card: value + ▲/▼ delta colouring + optional progress bar / sparkline
function KpiCard({k,kpis,spark,wide}:{k:string;kpis:any;spark?:number[];wide?:boolean}) {
  const raw=kpis[k];
  const isGrowth=/growth|\bmom\b|\byoy\b|change|delta/i.test(k) && typeof raw==="number";
  const isProgress=/achievement|attainment|on.?track|target %/i.test(k) && typeof raw==="number";
  const up=typeof raw==="number" && raw>=0;
  return (
    <div className={`${wide?"lg:col-span-2":""} rounded-xl p-3.5 flex flex-col gap-1.5`} style={DCARD}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-tight">{humanize(k)}</span>
      {isGrowth ? (
        <div className="text-xl font-black tracking-tight leading-none" style={{color:up?"#34d399":"#f87171"}}>
          {up?"▲":"▼"} {Math.abs(raw)}%
        </div>
      ) : (
        <div className="text-xl font-black text-white tracking-tight leading-none">{kpiValue(kpis,k)}</div>
      )}
      {isProgress && (
        <div className="mt-0.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full" style={{width:`${Math.max(2,Math.min(raw,100))}%`,background:raw>=100?"#34d399":raw>=80?"#fbbf24":"#f87171"}}/>
        </div>
      )}
      {wide && spark && spark.length>=2 && <div className="mt-auto pt-1"><MiniSpark data={spark}/></div>}
    </div>
  );
}

export default function AppPage() {
  const [step,           setStep]           = useState<Step>("module");
  const [selectedModule, setSelectedModule] = useState<string|null>(null);
  const [tool,           setTool]           = useState<"metadata"|"analyze"|null>(null);
  const [scrubOpts,      setScrubOpts]      = useState<any>({identity:true,hidden_sheets:true,comments:true,unhide:true,redact_pii:true});
  const [removeCols,     setRemoveCols]     = useState<string[]>([]);   // manual: columns to delete
  const [removeWords,    setRemoveWords]    = useState("");             // manual: words to blank (comma-separated)
  const [photoStrip,     setPhotoStrip]     = useState<any>({gps:true,camera:true,owner:true,date:true}); // image: what to remove
  const [filters,        setFilters]        = useState<any>({});   // {col: {values:[...]} | {min,max}}
  const [file,           setFile]           = useState<File|null>(null);
  const [dragging,       setDragging]       = useState(false);
  const [activeTab,      setActiveTab]      = useState<Tab>("overview");
  const [region,         setRegion]         = useState("All Regions");
  const [category,       setCategory]       = useState("All Categories");
  const [period,         setPeriod]         = useState("Last 12 Months");
  const [sheet,          setSheet]          = useState("");
  const [data,           setData]           = useState<any>(null);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState<string|null>(null);
  const [focus,          setFocus]          = useState<{title:string;rows:any[]}|null>(null);   // zoom modal
  const [edits,          setEdits]          = useState<{row:number;col:string;value:any}[]>([]); // manual corrections
  const [cleanOpts,      setCleanOpts]      = useState<any>({blanks:"leave"});   // cleaning-with-approval choices

  const handleDrop=useCallback((e:React.DragEvent)=>{
    e.preventDefault();setDragging(false);
    const f=e.dataTransfer.files[0];if(f)setFile(f);
  },[]);

  const runAnalysis=async(sh=sheet, flt=filters, edts=edits, copts=cleanOpts)=>{
    if(!file)return;
    setLoading(true);setError(null);
    try{
      const form=new FormData();
      form.append("file",file);
      form.append("sheet",sh);
      form.append("filters",JSON.stringify(flt||{}));
      form.append("edits",JSON.stringify(edts||[]));
      form.append("clean_options",JSON.stringify(copts||{}));
      if(tool==="analyze"&&selectedModule) form.append("module",selectedModule); // chosen industry forces its pack
      const res=await fetch(`${API}/analyze`,{method:"POST",body:form});
      if(!res.ok){const e=await res.json();throw new Error(e.detail||"Analysis failed");}
      const json=await res.json();
      setData(json);
    }catch(e:any){
      setError(e.message||"Could not connect to analysis server.");
    }finally{setLoading(false);}
  };

  // ── Version A editing: correct raw cells, then re-analyze ──
  const cellOrig=(row:number,col:string)=> data?.preview?.[row]?.[col] ?? "";
  const cellVal=(row:number,col:string)=>{ const e=edits.find(e=>e.row===row&&e.col===col); return e?e.value:cellOrig(row,col); };
  const isEdited=(row:number,col:string)=> edits.some(e=>e.row===row&&e.col===col);
  const setCell=(row:number,col:string,v:string)=>{
    setEdits(prev=>{
      const rest=prev.filter(e=>!(e.row===row&&e.col===col));
      return String(v)===String(cellOrig(row,col)??"") ? rest : [...rest,{row,col,value:v}];
    });
  };
  const applyEdits=()=>{ runAnalysis(sheet,filters,edits); };
  const discardEdits=()=>{ setEdits([]); runAnalysis(sheet,filters,[]); };

  // ── Cleaning with approval: client chooses how to handle blank cells ──
  const setBlanks=(mode:string)=>{ const next={...cleanOpts,blanks:mode}; setCleanOpts(next); runAnalysis(sheet,filters,edits,next); };

  const handleAnalyse=()=>{
    setStep("analysing");
    setEdits([]); setCleanOpts({blanks:"leave"});   // fresh file → drop prior corrections & cleaning choices
    runAnalysis(sheet,filters,[],{blanks:"leave"}).then(()=>setStep("results"));
  };

  const handleFilter=async()=>{          // Refresh button
    setLoading(true);
    await runAnalysis();
    setLoading(false);
  };

  const handleSheet=async(newSheet:string)=>{
    setSheet(newSheet);
    setLoading(true);
    await runAnalysis(newSheet);
    setLoading(false);
  };

  const handleDownload=async(fmtType:"xlsx"|"csv")=>{
    if(!file)return;
    try{
      const form=new FormData();
      form.append("file",file); form.append("sheet",sheet); form.append("fmt",fmtType);
      const res=await fetch(`${API}/download`,{method:"POST",body:form});
      if(!res.ok) throw new Error("Download failed");
      const blob=await res.blob();
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url; a.download=file.name.replace(/\.[^.]+$/,"")+"_cleaned."+fmtType;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    }catch{/* ignore */}
  };

  const [reporting,setReporting]=useState(false);
  const handleReport=async()=>{           // Full Excel report: all sheets + native charts
    if(!file)return;
    setReporting(true);
    try{
      const form=new FormData();
      form.append("file",file); form.append("sheet",sheet);
      form.append("filters",JSON.stringify(filters||{}));
      form.append("edits",JSON.stringify(edits||[]));
      form.append("clean_options",JSON.stringify(cleanOpts||{}));
      if(tool==="analyze"&&selectedModule) form.append("module",selectedModule);
      const res=await fetch(`${API}/report`,{method:"POST",body:form});
      if(!res.ok) throw new Error("Report failed");
      const blob=await res.blob();
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url; a.download=file.name.replace(/\.[^.]+$/,"")+"_report.xlsx";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    }catch{ setError("Could not build the Excel report."); }
    finally{ setReporting(false); }
  };

  const handleScrub=async()=>{
    if(!file)return;
    try{
      const form=new FormData(); form.append("file",file);
      Object.entries(scrubOpts).forEach(([k,v])=>form.append(k, v?"true":"false"));
      form.append("remove_columns", JSON.stringify(removeCols));
      form.append("remove_words", JSON.stringify(removeWords.split(",").map(w=>w.trim()).filter(Boolean)));
      form.append("strip_categories", JSON.stringify(Object.keys(photoStrip).filter(k=>photoStrip[k])));
      const res=await fetch(`${API}/scrub`,{method:"POST",body:form});
      if(!res.ok) throw new Error("Scrub failed");
      const blob=await res.blob();
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      const isImg=/\.(jpe?g|png|tiff?|webp|bmp)$/i.test(file.name);
      const ext=isImg?(file.name.match(/\.([a-z0-9]+)$/i)?.[1]||"jpg"):"xlsx";
      a.href=url; a.download=file.name.replace(/\.[^.]+$/,"")+(isImg?"_cleaned.":"_safe.")+ext;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    }catch{/* ignore */}
  };

  const applyFilter=(col:string, crit:any)=>{
    const next={...filters};
    const empty = crit==null || (crit.values && crit.values.length===0) || (("min" in crit||"max" in crit) && !crit.min && !crit.max);
    if(empty) delete next[col]; else next[col]=crit;
    setFilters(next);
    runAnalysis(sheet, next);
  };
  const clearFilters=()=>{ setFilters({}); runAnalysis(sheet, {}); };

  const toolDef=TOOLS.find(t=>t.id===tool);
  const pickViz:any = tool==="metadata"
    ? {name:"Metadata", Icon:Database, color:"#0ea5e9"}
    : (MODULES.find(m=>m.name===selectedModule) || {name:selectedModule||"Analyze", Icon:BarChart2, color:"#6366f1"});
  const detected:string=data?.detected_type||"Data";
  CUR = data?.currency || "$";   // drive all money formatting off the detected currency
  const typeViz:any=MODULES.find(m=>m.name===detected)||{name:detected,Icon:Database,color:"#6366f1",bg:"#eef2ff"};
  const result=data?.result||{};
  const kpis=result.kpis||null;
  const alerts:any[]=result.alerts||[];
  const summary:any[]=data?.summary||[];
  const fixes:any[]=data?.fixes||[];
  const health=data?.health||null;
  const footprint=data?.footprint||null;
  const kpiKeys:string[]=kpis?Object.keys(kpis).filter(k=>!k.endsWith("_fmt")):[];
  // Every list of records the backend returned (by_category, monthly_trend, abc_analysis, …)
  const sections=Object.entries(result).filter(
    ([k,v])=>Array.isArray(v)&&v.length>0&&typeof (v as any[])[0]==="object"&&!["alerts","columns"].includes(k)
  ) as [string,any[]][];
  // headline KPI gets a sparkline from the monthly trend section
  const trendSection=sections.find(([_k,rows])=>rows[0]&&"month" in rows[0]);
  const sparkData:number[]=trendSection?trendSection[1].map((r:any)=>Number(r.value)||0):[];
  const headlineKey=kpis?(kpiKeys.find(k=>kpis[k+"_fmt"]!=null)||kpiKeys[0]):undefined;

  const dark = true;   // whole app matches the landing's dark aurora/glass
  return (
    <div className="relative min-h-screen" style={{background:"#060611"}}>

      {/* Aurora background — onboarding steps only */}
      {dark&&(
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="aurora-1 absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-indigo-600/40 blur-[140px]" />
          <div className="aurora-2 absolute top-1/4 right-0 h-[520px] w-[520px] rounded-full bg-fuchsia-600/30 blur-[150px]" />
          <div className="aurora-3 absolute bottom-0 left-1/4 h-[480px] w-[480px] rounded-full bg-sky-500/30 blur-[150px]" />
          <div className="grid-overlay absolute inset-0 opacity-50" />
        </div>
      )}

      {/* Topbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 gap-4"
        style={dark
          ? {background:"rgba(255,255,255,0.05)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.08)"}
          : {background:"rgba(255,255,255,0.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-fuchsia-500">
            <span className="text-white text-xs font-black">V</span>
          </div>
          <span className={`font-black tracking-tight ${dark?"text-white":"text-white"}`}>Velytics</span>
        </Link>
        <div className="flex items-center gap-1 text-xs">
          {(["module","upload","analysing","results"] as Step[]).map((s,i,arr)=>{
            const labels=["Choose Tool","Upload Data","Analysing","Results"];
            const done=arr.indexOf(step)>i;
            const active=step===s;
            return (
              <div key={s} className="flex items-center gap-1 shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all
                  ${active?"text-white":done?"text-indigo-500":"text-slate-400"}`}
                  style={active?{background:"#6366f1"}:{}}>
                  <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center font-black
                    ${active?"bg-white/20 text-white":done?"bg-indigo-100 text-indigo-600":"bg-white/10 text-slate-400"}`}>
                    {done?"✓":i+1}
                  </span>
                  <span className="hidden sm:inline">{labels[i]}</span>
                </div>
                {i<arr.length-1&&<ChevronRight size={12} className="text-slate-600 shrink-0"/>}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="relative z-10 pt-14 min-h-screen flex flex-col">

        {/* STEP 1 */}
        {step==="module"&&(
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-14">
            <div className="max-w-5xl w-full">
              <div className="text-center mb-9 float-up">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-3">What do you want to analyse?</h1>
                <p className="text-slate-400 font-medium">Pick your industry — we tailor the report. Or inspect your data's structure.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {MODULES.map((m,i)=>(
                  <button key={m.id} onClick={()=>{setTool("analyze");setSelectedModule(m.name);setStep("upload");}}
                    className="group glass float-up text-left p-4 rounded-2xl transition-all hover:-translate-y-1 hover:bg-white/[0.08] hover:border-white/20"
                    style={{animationDelay:`${i*0.025}s`}}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                      style={{background:`${m.color}1f`,border:`1px solid ${m.color}33`}}>
                      <m.Icon size={20} style={{color:m.color}} strokeWidth={1.75}/>
                    </div>
                    <div className="font-bold text-white text-sm mb-0.5">{m.name}</div>
                    <div className="text-[11px] text-slate-400 leading-snug">{m.desc}</div>
                  </button>
                ))}
              </div>
              <button onClick={()=>{setTool("metadata");setSelectedModule(null);setStep("upload");}}
                className="group glass float-up w-full text-left mt-4 p-5 rounded-2xl flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:bg-white/[0.08] hover:border-white/20">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{background:"#0ea5e91f",border:"1px solid #0ea5e933"}}>
                  <Database size={24} style={{color:"#0ea5e9"}} strokeWidth={1.75}/>
                </div>
                <div>
                  <div className="font-black text-white text-base">Metadata &amp; Privacy</div>
                  <div className="text-sm text-slate-400">Inspect columns, data quality &amp; remove hidden footprint (GDPR-safe)</div>
                </div>
                <ChevronRight size={18} className="ml-auto text-slate-500"/>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step==="upload"&&(
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
            <div className="max-w-xl w-full float-up">
              <button onClick={()=>setStep("module")} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft size={14}/> Back
              </button>
              <div className="text-center mb-8">
                <div className="glass inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:`${pickViz.color}26`}}>
                    <pickViz.Icon size={14} style={{color:pickViz.color}} strokeWidth={2}/>
                  </div>
                  <span className="text-sm font-semibold text-slate-200">{pickViz.name}</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Upload your data</h1>
                <p className="text-slate-400 text-sm">{tool==="metadata"?"Excel · CSV · JSON · Photos (JPG / PNG)":"Excel · CSV · JSON · Any size"}</p>
              </div>
              <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={handleDrop}
                className={`rounded-2xl p-14 text-center transition-all border-2 border-dashed
                  ${dragging?"border-indigo-400 bg-indigo-500/10":file?"border-emerald-400 bg-emerald-500/10":"border-white/15 bg-white/[0.03] hover:border-white/30"}`}>
                {file?(
                  <div>
                    <div className="w-14 h-14 bg-emerald-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText size={24} className="text-emerald-400"/>
                    </div>
                    <div className="font-bold text-white mb-1">{file.name}</div>
                    <div className="text-sm text-slate-400">{(file.size/1024).toFixed(1)} KB · Ready</div>
                    <button onClick={()=>setFile(null)} className="mt-3 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors">
                      <X size={12}/> Remove
                    </button>
                  </div>
                ):(
                  <div>
                    <div className="w-14 h-14 bg-indigo-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <UploadCloud size={24} className="text-indigo-300"/>
                    </div>
                    <div className="font-bold text-white mb-1">Drop your file here</div>
                    <div className="text-sm text-slate-400 mb-5">or click to browse</div>
                    <label className="cursor-pointer inline-flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl text-sm bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/30">
                      <UploadCloud size={16}/> Browse files
                      <input type="file" accept={tool==="metadata"?".xlsx,.csv,.json,.jpg,.jpeg,.png,.tif,.tiff,.webp,.bmp,.heic,.heif":".xlsx,.csv,.json"} className="hidden" onChange={e=>e.target.files?.[0]&&setFile(e.target.files[0])}/>
                    </label>
                  </div>
                )}
              </div>
              <div className="glass flex items-center gap-3 mt-4 p-4 rounded-xl text-sm text-slate-300">
                <span>🔒</span>
                <span>Processed in memory · <strong className="text-white">never stored</strong> · deleted immediately</span>
              </div>
              {file&&(
                <button onClick={handleAnalyse}
                  className="w-full mt-5 text-white font-bold py-4 rounded-xl text-base flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/40">
                  {tool==="metadata"?"Inspect data":"Run Analysis"} <ChevronRight size={18}/>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step==="analysing"&&(
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="text-center float-up">
              <div className="w-16 h-16 border-4 border-white/10 border-t-fuchsia-400 rounded-full animate-spin mx-auto mb-8"/>
              <h2 className="text-2xl font-black text-white mb-2">{tool==="metadata"?"Reading your data":"Analysing your data"}</h2>
              <p className="text-slate-400 text-sm">{tool==="metadata"?"Mapping every column & checking quality":"Crunching the numbers"}</p>
              {error&&<p className="text-red-300 text-sm mt-4 bg-red-500/10 px-4 py-2 rounded-lg">{error}</p>}
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step==="results"&&(
          <div className="flex-1 flex overflow-hidden">

            {/* Sidebar */}
            <aside className="w-52 shrink-0 flex flex-col" style={{background:"rgba(13,16,28,0.5)",backdropFilter:"blur(16px)",borderRight:"1px solid rgba(255,255,255,0.08)"}}>
              <div className="p-4" style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:typeViz.bg}}>
                    <typeViz.Icon size={15} style={{color:typeViz.color}} strokeWidth={2}/>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">{detected}</div>
                    <div className="text-xs text-slate-400">{tool==="metadata"?"Metadata":"Analyze"}</div>
                  </div>
                </div>
              </div>
              <div className="p-4 flex-1 overflow-auto space-y-5">
                {/* Dynamic filters — built from the sheet's real columns */}
                {(() => {
                  const fs:any[] = (data?.filter_schema||[]).filter((f:any)=>f.type==="category"||f.type==="date");
                  if(fs.length===0) return null;
                  const cats = fs.filter(f=>f.type==="category").slice(0,8);
                  const dates = fs.filter(f=>f.type==="date").slice(0,2);
                  const inputStyle = {border:"1px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.05)",color:"#cbd5e1"} as any;
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <SlidersHorizontal size={11} className="text-slate-400"/>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filters</span>
                        </div>
                        {Object.keys(filters).length>0 && (
                          <button onClick={clearFilters} className="text-[10px] font-semibold text-indigo-300 hover:text-white">Clear</button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {cats.map((f:any)=>(
                          <div key={f.column}>
                            <label className="text-xs font-semibold text-slate-400 block mb-1.5 truncate">{f.column}</label>
                            <select value={filters[f.column]?.values?.[0] || "All"}
                              onChange={e=>applyFilter(f.column, e.target.value==="All"?null:{values:[e.target.value]})}
                              className="w-full text-xs rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none" style={inputStyle}>
                              <option>All</option>
                              {f.values.map((v:string)=><option key={v} value={v}>{v}</option>)}
                            </select>
                          </div>
                        ))}
                        {dates.map((f:any)=>(
                          <div key={f.column}>
                            <label className="text-xs font-semibold text-slate-400 block mb-1.5 truncate">{f.column}</label>
                            <div className="flex gap-1.5">
                              <input type="date" value={filters[f.column]?.min||""} min={f.min} max={f.max}
                                onChange={e=>applyFilter(f.column,{...(filters[f.column]||{}),min:e.target.value})}
                                className="w-full text-[11px] rounded-lg px-2 py-1.5 focus:outline-none" style={inputStyle}/>
                              <input type="date" value={filters[f.column]?.max||""} min={f.min} max={f.max}
                                onChange={e=>applyFilter(f.column,{...(filters[f.column]||{}),max:e.target.value})}
                                className="w-full text-[11px] rounded-lg px-2 py-1.5 focus:outline-none" style={inputStyle}/>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
                {data?.sheets?.length>1&&(
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Sheet ({data.sheets.length})</label>
                    <select value={data.sheet_used} onChange={e=>handleSheet(e.target.value)}
                      className="w-full text-xs rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none"
                      style={{border:"1px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.05)",color:"#cbd5e1"}}>
                      {data.sheets.map((s:string)=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
                <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:"1.25rem"}}>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Dataset</div>
                  <div className="rounded-xl p-3 space-y-2" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)"}}>
                    <div className="text-xs font-bold text-gray-800 truncate">{file?.name}</div>
                    <div className="text-xs text-slate-400">{data?.rows} rows · {data?.columns} cols</div>
                    {fixes.length>0&&(
                      <details className="group">
                        <summary className="text-xs text-green-700 font-semibold flex items-center gap-1 cursor-pointer list-none">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"/>
                          {fixes.length} thing{fixes.length>1?"s":""} cleaned
                          <ChevronRight size={11} className="ml-auto transition-transform group-open:rotate-90"/>
                        </summary>
                        <ul className="mt-2 space-y-1.5 max-h-40 overflow-auto">
                          {fixes.map((fx:string,i:number)=>(
                            <li key={i} className="text-[11px] text-slate-400 leading-snug pl-2 border-l-2 border-green-200">{fx}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4" style={{borderTop:"1px solid rgba(255,255,255,0.08)"}}>
                <button onClick={()=>{setStep("module");setFile(null);setTool(null);setSelectedModule(null);setData(null);setActiveTab("overview");setSheet("");setFilters({});setEdits([]);setFocus(null);setCleanOpts({blanks:"leave"});setRemoveCols([]);setRemoveWords("");}}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition-all hover:bg-indigo-50 hover:text-indigo-600 text-slate-400"
                  style={{border:"1px solid rgba(255,255,255,0.14)"}}>
                  <ArrowLeft size={12}/> New analysis
                </button>
              </div>
            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col overflow-hidden">
              <div className="px-7 py-4 flex items-center justify-between shrink-0" style={{background:"rgba(13,16,28,0.6)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h1 className="text-base font-black text-white">{tool==="metadata"?`${detected} — Metadata`:`${detected} Report`}</h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                      {loading?"Updating...":"Live"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{detected} · {data?.rows} rows · {data?.columns} cols</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>handleFilter()} disabled={loading}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg transition-all"
                    style={{border:"1px solid rgba(255,255,255,0.14)"}}>
                    <RefreshCw size={12} className={loading?"animate-spin":""}/> Refresh
                  </button>
                  {tool!=="metadata"&&(
                    <button onClick={handleReport} disabled={reporting||loading}
                      className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-all"
                      style={{background:"#6366f1",boxShadow:"0 4px 12px rgba(99,102,241,0.35)"}}>
                      <BarChart3 size={12} className={reporting?"animate-pulse":""}/> {reporting?"Building…":"Excel Report"}
                    </button>
                  )}
                  <button onClick={()=>handleDownload("xlsx")}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 px-3 py-2 rounded-lg transition-all"
                    style={{border:"1px solid rgba(255,255,255,0.14)"}}>
                    <FileSpreadsheet size={12}/> Clean data
                  </button>
                  <button onClick={()=>handleDownload("csv")}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 px-3 py-2 rounded-lg"
                    style={{border:"1px solid rgba(255,255,255,0.14)"}}>
                    <Download size={12}/> CSV
                  </button>
                </div>
              </div>

              {/* Tabs (only for Analyze tool) */}
              {tool!=="metadata"&&(
              <div className="px-7 flex shrink-0" style={{background:"rgba(13,16,28,0.6)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                {([["overview","Overview",BarChart2],...(alerts.length?[["alerts","Alerts",Zap] as [Tab,string,React.ElementType]]:[]),...(data?.preview?.length?[["data","Data",Table2] as [Tab,string,React.ElementType]]:[])] as [Tab,string,React.ElementType][]).map(([id,label,Icon])=>(
                  <button key={id} onClick={()=>setActiveTab(id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all outline-none focus:outline-none focus-visible:outline-none
                      ${activeTab===id?"border-indigo-400 text-indigo-300":"border-transparent text-slate-400 hover:text-slate-200"}`}>
                    <Icon size={12}/>{label}{id==="alerts"?` (${alerts.length})`:""}{id==="data"&&edits.length?` · ${edits.length} edit${edits.length!==1?"s":""}`:""}
                  </button>
                ))}
              </div>
              )}

              <div className="relative flex-1 overflow-auto px-7 py-6">
                {loading&&<div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"/></div>}
                {error&&<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}

                {/* OVERVIEW — adaptive to whatever the module returned */}
                {activeTab==="overview"&&(
                  <div className="space-y-5 max-w-5xl">
                    {/* At-a-glance — plain-English summary written from the numbers */}
                    {tool!=="metadata"&&summary.length>0&&(
                      <div className="rounded-2xl p-5" style={{border:"1px solid rgba(129,140,248,0.25)",background:"linear-gradient(135deg, rgba(99,102,241,0.12), rgba(192,132,252,0.06))",backdropFilter:"blur(16px)"}}>
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles size={15} className="text-indigo-300"/>
                          <span className="text-sm font-black text-white tracking-tight">At a glance</span>
                          <span className="text-[10px] font-bold text-indigo-300/70 uppercase tracking-wide ml-1">Auto-summary</span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                          {summary.map((p:any,i:number)=>{
                            const dot=p.tone==="good"?"#10b981":p.tone==="bad"?"#f87171":"#94a3b8";
                            return (
                              <div key={i} className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{background:dot,boxShadow:`0 0 8px ${dot}`}}/>
                                <span className="text-sm text-slate-200 leading-relaxed">{p.text}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Data Health Score — Analyze tool only */}
                    {tool!=="metadata"&&health&&(
                      <div className="bg-white rounded-2xl p-5 grid md:grid-cols-[190px_1fr] gap-6 items-center"
                        style={{border:"1px solid rgba(255,255,255,0.08)",boxShadow:"0 8px 30px rgba(0,0,0,0.25)",background:"rgba(255,255,255,0.04)",backdropFilter:"blur(16px)"}}>
                        <div className="flex flex-col items-center">
                          <HealthGauge score={health.score}/>
                          <div className="-mt-3 text-3xl font-black" style={{color:healthColor(health.score)}}>
                            {health.score}<span className="text-sm text-slate-600 font-bold">/100</span>
                          </div>
                          <div className="text-sm font-bold" style={{color:healthColor(health.score)}}>{health.rating}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5 text-center">Data Health Score</div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-white text-sm">Data Health Audit</span>
                            <span className="text-xs text-slate-400">{health.summary}</span>
                          </div>
                          <div className="space-y-2 max-h-52 overflow-auto pr-1">
                            {(health.issues||[]).map((it:any,i:number)=>{
                              const sv=HEALTH_SEV[it.severity]||HEALTH_SEV.low;
                              return (
                                <div key={i} className="flex items-start gap-2.5">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5"
                                    style={{background:sv.bg,color:sv.c}}>
                                    {it.severity==="fixed"?"✓ Fixed":sv.label}
                                  </span>
                                  <div className="text-xs leading-tight">
                                    <div className="font-semibold text-slate-200">{it.label}</div>
                                    {it.detail&&<div className="text-slate-400 text-[11px] mt-0.5">{it.detail}</div>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Cleaning with approval — the client decides how to handle blanks */}
                          {data?.raw_blanks>0&&(
                            <div className="mt-4 pt-3 border-t border-white/10">
                              <div className="flex items-center gap-1.5 mb-2">
                                <SlidersHorizontal size={12} className="text-indigo-300"/>
                                <span className="text-[11px] font-bold text-white">How should we handle the {data.raw_blanks} blank cell{data.raw_blanks!==1?"s":""}?</span>
                                <span className="text-[11px] text-slate-400">— your call</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {([["leave","Leave blank"],["zero","Fill with 0"],["mean","Average"],["median","Median"],["drop_rows","Remove rows"]] as [string,string][]).map(([mode,label])=>{
                                  const active=(cleanOpts.blanks||"leave")===mode;
                                  return (
                                    <button key={mode} onClick={()=>setBlanks(mode)} disabled={loading}
                                      className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 ${active?"text-white":"text-slate-300 hover:text-white"}`}
                                      style={active?{background:"#6366f1",boxShadow:"0 2px 8px rgba(99,102,241,0.35)"}:{border:"1px solid rgba(255,255,255,0.14)"}}>
                                      {label}{mode==="leave"?" · best":""}
                                    </button>
                                  );
                                })}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1.5">Leaving blank keeps your totals honest. Filling or removing changes the numbers — and your choice is logged in the audit.</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* GDPR plain-English verdict */}
                    {tool==="metadata"&&footprint?.gdpr&&(()=>{
                      const lv=footprint.gdpr.level;
                      const acc=lv==="high"?"#f87171":lv==="medium"?"#fbbf24":"#34d399";
                      return (
                        <div className="rounded-2xl p-4 flex items-start gap-3" style={{border:`1px solid ${acc}40`,background:`${acc}14`,backdropFilter:"blur(8px)"}}>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5" style={{background:`${acc}26`,color:acc}}>GDPR</span>
                          <div>
                            <div className="text-sm font-semibold text-white">{footprint.gdpr.verdict}</div>
                            <div className="text-[11px] text-slate-300 mt-1">
                              {footprint.gdpr.categories?.length>0?`Personal data found: ${footprint.gdpr.categories.join(", ")}. `:""}{footprint.gdpr.advice}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Metadata (Privacy) tool: hidden-footprint report */}
                    {tool==="metadata"&&footprint&&(
                      <div className="bg-white rounded-2xl p-5 grid md:grid-cols-[190px_1fr] gap-6 items-center"
                        style={{border:"1px solid rgba(255,255,255,0.08)",boxShadow:"0 8px 30px rgba(0,0,0,0.25)",background:"rgba(255,255,255,0.04)",backdropFilter:"blur(16px)"}}>
                        <div className="flex flex-col items-center">
                          <HealthGauge score={footprint.score}/>
                          <div className="-mt-3 text-3xl font-black" style={{color:healthColor(footprint.score)}}>
                            {footprint.score}<span className="text-sm text-slate-600 font-bold">/100</span>
                          </div>
                          <div className="text-sm font-bold" style={{color:healthColor(footprint.score)}}>
                            {footprint.score>=85?"Safe to share":footprint.score>=60?"Some exposure":"High exposure"}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 text-center">Privacy / Footprint Score</div>
                        </div>
                        <div>
                          <div className="mb-3">
                            <span className="font-bold text-white text-sm">{footprint.kind==="image"?"What this photo secretly reveals":"Hidden footprint in this file"}</span>
                          </div>
                          <div className="space-y-2 max-h-56 overflow-auto pr-1">
                            {(footprint.risks||[]).map((it:any,i:number)=>{
                              const sv=FP_SEV[it.severity]||FP_SEV.medium;
                              return (
                                <div key={i} className="flex items-start gap-2.5">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5" style={{background:sv.bg,color:sv.c}}>{sv.label}</span>
                                  <div className="text-xs leading-tight">
                                    <div className="font-semibold text-slate-200">{it.label}</div>
                                    {it.detail&&<div className="text-slate-400 text-[11px] mt-0.5">{it.detail}</div>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Action area — image vs spreadsheet */}
                          {footprint.kind==="image"?(
                            <div className="mt-3 pt-3" style={{borderTop:"1px solid rgba(255,255,255,0.08)"}}>
                              {footprint.maps&&(
                                <a href={footprint.maps} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 hover:text-indigo-200 mb-3">
                                  📍 See exactly where this photo was taken (Google Maps) →
                                </a>
                              )}
                              {(footprint.categories_present||[]).length>0?(
                                <>
                                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Choose what to remove</div>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
                                    {(footprint.categories_present||[]).map((cat:string)=>{
                                      const lbl:any={gps:"📍 GPS location",camera:"📷 Camera / device",owner:"👤 Owner / copyright",date:"🕓 Date taken"};
                                      return (
                                        <label key={cat} className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                                          <input type="checkbox" checked={!!photoStrip[cat]} onChange={e=>setPhotoStrip({...photoStrip,[cat]:e.target.checked})}/>
                                          {lbl[cat]||cat}
                                        </label>
                                      );
                                    })}
                                  </div>
                                  <button onClick={handleScrub} className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-white px-3 py-2 rounded-lg" style={{background:"#10b981"}}>
                                    <Sparkles size={12}/> Clean up &amp; download photo
                                  </button>
                                  <p className="mt-2 text-[10px] text-slate-500">Only the items you tick are removed. The photo looks identical — safe to post or share. Nothing is stored on our servers.</p>
                                </>
                              ):(
                                <p className="text-[11px] text-slate-400">This photo has no hidden metadata to remove — it's already safe to share.</p>
                              )}
                            </div>
                          ):(
                          <div className="mt-3 pt-3" style={{borderTop:"1px solid rgba(255,255,255,0.08)"}}>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Choose what to remove</div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                              {[
                                {key:"identity",      label:"Author / company",                                show:Object.keys(footprint.leaked||{}).length>0},
                                {key:"hidden_sheets", label:`Hidden sheets (${footprint.hidden_sheets?.length||0})`, show:(footprint.hidden_sheets?.length||0)>0},
                                {key:"comments",      label:`Comments (${footprint.comments||0})`,               show:(footprint.comments||0)>0},
                                {key:"unhide",        label:"Unhide rows/cols",                                 show:((footprint.hidden_cols||0)+(footprint.hidden_rows||0))>0},
                                {key:"redact_pii",    label:"Redact personal data",                             show:Object.keys(footprint.pii||{}).length>0},
                              ].filter(o=>o.show).map(o=>(
                                <label key={o.key} className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                                  <input type="checkbox" checked={!!scrubOpts[o.key]} onChange={e=>setScrubOpts({...scrubOpts,[o.key]:e.target.checked})}/>
                                  {o.label}
                                </label>
                              ))}
                            </div>

                            {/* Your own choices — manual control (the client knows their context) */}
                            <div className="mt-3 pt-3" style={{borderTop:"1px solid rgba(255,255,255,0.08)"}}>
                              <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wide mb-2">Your own choices</div>
                              {data?.metadata?.length>0&&(
                                <div className="mb-2.5">
                                  <div className="text-[11px] text-slate-400 mb-1.5">Remove entire columns (click to toggle):</div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {data.metadata.map((m:any)=>{ const on=removeCols.includes(m.column); return (
                                      <button key={m.column} onClick={()=>setRemoveCols(on?removeCols.filter((c:string)=>c!==m.column):[...removeCols,m.column])}
                                        className="text-[11px] font-semibold px-2 py-1 rounded-md transition-all"
                                        style={on?{background:"#f87171",color:"#fff"}:{border:"1px solid rgba(255,255,255,0.14)",color:"#cbd5e1"}}>
                                        {on?"✕ ":""}{m.column}
                                      </button>); })}
                                  </div>
                                </div>
                              )}
                              <div>
                                <div className="text-[11px] text-slate-400 mb-1.5">Remove any cell containing these words:</div>
                                <input value={removeWords} onChange={e=>setRemoveWords(e.target.value)} placeholder="e.g. Confidential, Project Falcon"
                                  className="w-full text-xs px-3 py-2 rounded-lg bg-transparent text-slate-200 outline-none focus:bg-white/5"
                                  style={{border:"1px solid rgba(255,255,255,0.14)"}}/>
                              </div>
                            </div>
                            {file?.name.toLowerCase().endsWith(".xlsx")?(
                              <button onClick={handleScrub} className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-white px-3 py-2 rounded-lg" style={{background:"#10b981"}}>
                                <Sparkles size={12}/> Download safe copy
                              </button>
                            ):(
                              <p className="mt-2 text-[11px] text-slate-400">Safe-copy download is available for .xlsx files.</p>
                            )}
                          </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Metadata tool: column data dictionary */}
                    {tool==="metadata"&&data?.metadata?.length>0&&(
                      <div className="bg-white rounded-2xl p-5 overflow-auto" style={{border:"1px solid rgba(255,255,255,0.08)",boxShadow:"0 8px 30px rgba(0,0,0,0.25)",background:"rgba(255,255,255,0.04)",backdropFilter:"blur(16px)"}}>
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-bold text-white text-sm">Columns ({data.metadata.length}) — type, quality &amp; sample</span>
                          <button onClick={()=>handleDownload("xlsx")} className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-lg" style={{background:"#0ea5e9"}}>
                            <FileSpreadsheet size={12}/> Download clean Excel
                          </button>
                        </div>
                        <table className="w-full text-xs">
                          <thead><tr className="text-slate-400 border-b border-white/10">
                            <th className="text-left font-semibold py-2 px-2">Column</th>
                            <th className="text-left font-semibold py-2 px-2">Type</th>
                            <th className="text-right font-semibold py-2 px-2">Unique</th>
                            <th className="text-right font-semibold py-2 px-2">Filled</th>
                            <th className="text-left font-semibold py-2 px-2">Sample / Range</th>
                          </tr></thead>
                          <tbody>
                            {data.metadata.map((m:any,i:number)=>{
                              const tc:Record<string,string>={number:"#3b82f6",date:"#8b5cf6",category:"#10b981",id:"#f59e0b",text:"#64748b"};
                              const col=tc[m.type]||"#64748b";
                              return (
                                <tr key={i} className="border-b border-white/5">
                                  <td className="py-2 px-2 font-semibold text-slate-200 whitespace-nowrap">{m.column}</td>
                                  <td className="py-2 px-2"><span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{background:col+"18",color:col}}>{m.type}</span></td>
                                  <td className="py-2 px-2 text-right text-slate-300">{Number(m.distinct).toLocaleString()}</td>
                                  <td className="py-2 px-2 text-right font-semibold" style={{color:m.fill_pct>=90?"#059669":m.fill_pct>=50?"#d97706":"#dc2626"}}>{m.fill_pct}%</td>
                                  <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{m.sample}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {tool!=="metadata"&&(<>
                    {/* KPI band — compact tiles like a Power BI report */}
                    {kpiKeys.length>0&&(
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 auto-rows-fr">
                        {kpiKeys.map(k=>(
                          <KpiCard key={k} k={k} kpis={kpis}
                            wide={k===headlineKey&&sparkData.length>=2}
                            spark={k===headlineKey?sparkData:undefined}/>
                        ))}
                      </div>
                    )}

                    {/* Visuals — dense tile grid like a Power BI report canvas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr">
                      {sections.map(([key,rows])=>(
                        <ChartCard key={key} title={humanize(key)} rows={rows} onZoom={()=>setFocus({title:humanize(key),rows})}/>
                      ))}
                    </div>

                    {/* Detected columns */}
                    {result.columns_detected&&Object.keys(result.columns_detected).length>0&&(
                      <div className="bg-white rounded-2xl p-4 flex flex-wrap gap-2 items-center" style={{border:"1px solid rgba(255,255,255,0.08)"}}>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mr-1">Detected columns</span>
                        {Object.entries(result.columns_detected).map(([role,col]:any)=>(
                          <span key={role} className="text-xs px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">{humanize(role)}: {String(col)}</span>
                        ))}
                      </div>
                    )}

                    {kpiKeys.length===0&&sections.length===0&&!loading&&(
                      <p className="text-sm text-slate-400">No analysable data was found in this file.</p>
                    )}
                    </>)}
                  </div>
                )}

                {/* ALERTS */}
                {tool!=="metadata"&&activeTab==="alerts"&&(
                  <div className="max-w-3xl space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap size={14} className="text-amber-500"/>
                      <span className="text-sm font-bold text-white">{alerts.length} alert{alerts.length!==1?"s":""}</span>
                    </div>
                    {alerts.map((a:any,i:number)=>{
                      const acc=a.type==="Critical"?"#f87171":a.type==="Opportunity"?"#34d399":a.type==="Warning"?"#fbbf24":"#818cf8";
                      return (
                        <div key={i} className="p-4 rounded-xl flex items-start gap-3"
                          style={{background:`${acc}14`,border:`1px solid ${acc}33`,borderLeftWidth:3,borderLeftColor:acc,backdropFilter:"blur(8px)"}}>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5"
                            style={{background:`${acc}26`,color:acc}}>{a.type}</span>
                          <p className="text-sm text-slate-100 leading-relaxed">{a.text}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* DATA — editable raw cells → re-analyze (Version A) */}
                {tool!=="metadata"&&activeTab==="data"&&data?.preview?.length>0&&(
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <Pencil size={14} className="text-indigo-300"/>
                          Your data{data.total_rows>data.preview.length?` — first ${data.preview.length} of ${Number(data.total_rows).toLocaleString()} rows`:` — ${data.preview.length} rows`}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 max-w-xl">Click any cell to correct a value, then re-analyze. Your KPIs and charts update from the corrected data — nothing is saved on our servers.</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {edits.length>0&&<button onClick={discardEdits} disabled={loading}
                          className="text-xs font-semibold text-slate-300 px-3 py-2 rounded-lg disabled:opacity-40" style={{border:"1px solid rgba(255,255,255,0.14)"}}>Discard</button>}
                        <button onClick={applyEdits} disabled={loading||edits.length===0}
                          className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 rounded-lg disabled:opacity-40 transition-all"
                          style={{background:"#6366f1",boxShadow:"0 4px 12px rgba(99,102,241,0.3)"}}>
                          <Check size={13}/> Apply &amp; re-analyze{edits.length?` (${edits.length})`:""}
                        </button>
                      </div>
                    </div>
                    <div className="overflow-auto rounded-xl" style={{...PANEL,maxHeight:"68vh"}}>
                      <table className="text-xs">
                        <thead><tr className="text-slate-400 border-b border-white/10">
                          <th className="px-3 py-2.5 font-semibold text-right sticky left-0 top-0 z-20" style={{background:"#0c0f1c"}}>#</th>
                          {Object.keys(data.preview[0]).map((c:string)=>(
                            <th key={c} className="text-left font-semibold py-2.5 px-2 whitespace-nowrap sticky top-0 z-10" style={{background:"#0c0f1c"}}>{humanize(c)}</th>
                          ))}
                        </tr></thead>
                        <tbody>
                          {data.preview.map((_r:any,i:number)=>(
                            <tr key={i} className="border-b border-white/5">
                              <td className="px-3 py-1 text-right text-slate-500 sticky left-0 z-10" style={{background:"#0c0f1c"}}>{i+1}</td>
                              {Object.keys(data.preview[0]).map((c:string)=>(
                                <td key={c} className="px-1 py-0.5">
                                  <input value={String(cellVal(i,c)??"")} onChange={e=>setCell(i,c,e.target.value)}
                                    className={`w-full min-w-[96px] bg-transparent px-2 py-1 rounded outline-none transition-colors ${isEdited(i,c)?"ring-1 ring-indigo-400 bg-indigo-500/15 text-white font-semibold":"text-slate-200 focus:bg-white/10"}`}/>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            </main>
          </div>
        )}

        {focus&&<FocusModal title={focus.title} rows={focus.rows} onClose={()=>setFocus(null)}/>}
      </div>
    </div>
  );
}
