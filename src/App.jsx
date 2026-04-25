import React, { useState, useEffect, useMemo, useRef, useCallback, startTransition } from "react";
import { createClient } from '@supabase/supabase-js';
import { FixedSizeList as List } from "react-window";

// --- CONFIG ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://jujmdykstsmtduclzvqr.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1am1keWtzdHNtdGR1Y2x6dnFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMjkyMTIsImV4cCI6MjA5MjYwNTIxMn0.cm1Rly-GO_8Fi3V8O3Csvo9c7SdpSI4AvpYp35LbeNg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const S = {
  bg: "#04030a",
  bg2: "#0c0822",
  card: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.08)",
  borderLight: "rgba(255,255,255,0.02)",
  gold: "#f4c430",
  goldDark: "#b88a00",
  goldGlow: "rgba(244,196,48,0.35)",
  success: "#10b981",
  successBg: "rgba(16,185,129,0.1)",
  error: "#ff4d4d",
  errorBg: "rgba(255,77,77,0.1)",
  warning: "#f59e0b",
  warningBg: "rgba(245,158,11,0.1)",
  text: "#f1f0f8",
  textMuted: "#a19ebf",
  textDim: "#545271",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body { 
    background: ${S.bg}; 
    color: ${S.text}; 
    font-family: 'DM Sans', system-ui, sans-serif; 
    min-height: 100vh; 
    width: 100vw;
    overflow-x: hidden;
    overflow-y: auto;
    line-height: 1.5;
  }
  #root { min-height: 100vh; display: flex; flex-direction: column; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeScale { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  @keyframes slideLeft { from { transform: translateX(15px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes shimmer { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.5; } }
  @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
  @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.02); opacity: 0.9; } }
  @keyframes shine { from { left: -100%; } to { left: 100%; } }
  @keyframes moveNebula { 
    0% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(3%, 2%) scale(1.03); }
    66% { transform: translate(-1%, 3%) scale(0.97); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes textShimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes borderRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .pin-input {
    background: transparent !important;
    border: 1px solid rgba(244, 196, 48, 0.3) !important;
    color: white !important;
    text-align: center;
    font-size: 32px;
    letter-spacing: 0.6em;
    font-weight: 800;
    border-radius: 20px;
    padding: 24px;
    outline: none;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  .pin-input:focus {
    border-color: ${S.gold} !important;
    box-shadow: 0 0 25px rgba(244, 196, 48, 0.15);
    background: rgba(244, 196, 48, 0.03) !important;
  }
  .pin-input::placeholder {
    letter-spacing: normal;
    font-size: 16px;
    font-weight: 500;
    opacity: 0.3;
  }

  .view-transition { animation: fadeScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .tab-transition { animation: slideLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .floating { animation: float 8s ease-in-out infinite; will-change: transform; }
  .shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
  .pulse { animation: pulse 3s infinite ease-in-out; }

  .premium-text {
    background: linear-gradient(90deg, ${S.gold}, #fff, ${S.gold});
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: textShimmer 5s linear infinite;
    display: inline-block;
    max-width: 100%;
    word-break: break-word;
  }

  .glass-card {
    position: relative;
    background: rgba(12, 12, 22, 0.95);
    border-radius: 32px; 
    border: 1px solid ${S.border};
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    width: 100%;
    overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.34, 1, 0.64, 1);
  }
  .glass-card:hover { transform: translateY(-4px); }

  .border-beam-container {
    position: absolute; inset: -1px; pointer-events: none; border-radius: inherit;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude; -webkit-mask-composite: xor;
    padding: 2px;
  }
  .border-beam {
    position: absolute; inset: -50%; border-radius: inherit;
    background: conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${S.gold} 40deg, transparent 80deg);
    animation: borderRotate 5s linear infinite;
  }

  input {
    background: rgba(0,0,0,0.3); border: 1px solid ${S.border}; color: ${S.text};
    border-radius: 18px; padding: 18px 22px; width: 100%; font-size: 15px;
    outline: none; transition: border-color 0.3s ease;
  }
  input::placeholder { opacity: 0.5; }
  input:focus { border-color: ${S.gold}; background: rgba(0,0,0,0.4); }

  select {
    width: 100%;
    padding: 10px 12px;
    border-radius: 10px;
    background: rgba(20, 20, 30, 0.95);
    color: #ffffff;
    border: 1px solid rgba(255, 215, 0, 0.3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 13px;
    min-width: 0;
    flex: 1;
    outline: none;
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,215,0,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 12px;
    padding-right: 32px;
  }
  select option { background: #1a1a2e; color: #ffffff; }
  select:focus { border-color: ${S.gold}; }

  .filter-bar {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 100%;
  }

  .shine-btn { 
    position: relative; overflow: hidden; border: none; cursor: pointer;
    background: linear-gradient(135deg, ${S.gold}, #e8a820);
    color: #1a1000; font-weight: 800; font-size: 15px; padding: 20px 32px; border-radius: 20px; width: 100%;
    box-shadow: 0 8px 25px rgba(244,196,48,0.2); letter-spacing: 0.08em; text-transform: uppercase;
    transition: all 0.3s ease;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    white-space: normal;
    text-align: center;
    word-break: break-word;
  }
  .shine-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(244,196,48,0.3); }
  .shine-btn:active:not(:disabled) { transform: translateY(0); }
  .shine-btn::after {
    content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transform: skewX(-25deg);
  }
  .shine-btn:hover::after { animation: shine 1.2s forwards; }

  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  
  @media (max-width: 768px) {
    .glass-card { padding: 32px 20px !important; border-radius: 24px; }
    .premium-text { font-size: 32px !important; animation-duration: 8s !important; }
    .stats-container { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    .stats-container > div:last-child { grid-column: span 2; }
    .list-item { 
      flex-direction: column !important; 
      align-items: stretch !important; 
      gap: 12px !important; 
      padding: 16px 20px !important; 
      border-bottom-width: 2px !important;
    }
    .shine-btn { padding: 14px 18px !important; font-size: 13px !important; }
    .admin-header {
      flex-direction: column !important;
      gap: 20px !important;
      align-items: flex-start !important;
    }
    .admin-header > button {
      width: 100% !important;
      justify-content: center !important;
    }
    .tab-container { padding: 6px !important; }
    .tab-container button { padding: 12px 6px !important; font-size: 11px !important; }

    /* SOFTENED MOBILE ANIMATIONS */
    .view-transition { animation-duration: 1.2s !important; }
    .tab-transition { animation-duration: 1s !important; }
    .floating { animation-duration: 12s !important; }
    .pulse { animation-duration: 5s !important; }
    .border-beam { animation-duration: 8s !important; }
    * { transition-duration: 0.5s !important; }
  }

  @media (max-width: 600px) {
    .filter-bar { grid-template-columns: 1fr; }
    .premium-text { font-size: 28px !important; }
  }

  .confetti {
    position: fixed; width: 10px; height: 10px; pointer-events: none; z-index: 100; border-radius: 3px;
    will-change: transform, opacity;
  }
`;

// --- UI COMPONENTS ---

const NebulaBg = React.memo(() => (
  <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:0,background:S.bg,overflow:"hidden"}}>
    <div style={{
      position:"absolute", top:"-10%", left:"-5%", width:"60%", height:"60%",
      background:`radial-gradient(circle, rgba(123, 44, 191, 0.08) 0%, transparent 70%)`,
      animation:`moveNebula 30s ease-in-out infinite`, filter:"blur(80px)"
    }}/>
    <div style={{
      position:"absolute", bottom:"-15%", right:"-5%", width:"70%", height:"70%",
      background:`radial-gradient(circle, rgba(244, 196, 48, 0.04) 0%, transparent 75%)`,
      animation:`moveNebula 35s ease-in-out infinite alternate`, filter:"blur(100px)"
    }}/>
    <StarsBg />
  </div>
));

const StarsBg = React.memo(() => {
  const stars = useMemo(() => Array.from({length: 25}, (_, i) => ({
    id: i, x: Math.random()*100, y: Math.random()*100, size: Math.random()*1.0+0.5, delay: Math.random()*10,
  })), []);
  return (
    <>
      {stars.map(s => (
        <div key={s.id} style={{
          position:"absolute", left:`${s.x}%`, top:`${s.y}%`, width:s.size, height:s.size,
          borderRadius:"50%", background:"white", opacity:0.12,
          animation:`shimmer ${6+Math.random()*6}s ${s.delay}s infinite`
        }}/>
      ))}
    </>
  );
});

const BorderBeam = React.memo(() => (
  <div className="border-beam-container">
    <div className="border-beam" />
  </div>
));

const Confetti = React.memo(() => {
  const particles = useMemo(() => Array.from({length: 20}, (_, i) => ({
    id: i,
    left: 50 + (Math.random() - 0.5) * 50,
    delay: Math.random() * 0.4,
    duration: 1.8 + Math.random() * 1.8,
    angle: Math.random() * 360,
    distance: 150 + Math.random() * 250,
    color: [S.gold, "#fff", "#e8a820", "#fffaeb"][Math.floor(Math.random() * 4)]
  })), []);

  return (
    <div style={{position:"fixed", inset:0, pointerEvents:"none", zIndex:100}}>
      {particles.map(p => (
        <style key={p.id}>{`
          @keyframes conf-${p.id} {
            0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); opacity: 1; }
            100% { transform: translate(calc(-50% + ${Math.cos(p.angle*Math.PI/180)*p.distance}px), calc(-50% + ${Math.sin(p.angle*Math.PI/180)*p.distance}px)) rotate(${p.angle*4}deg) scale(0); opacity: 0; }
          }
        `}</style>
      ))}
      {particles.map(p => (
        <div key={p.id} className="confetti" style={{
          left:`${p.left}%`, top:"45%", background:p.color,
          animation: `conf-${p.id} ${p.duration}s ${p.delay}s cubic-bezier(0, .8, .5, 1) forwards`
        }} />
      ))}
    </div>
  );
});

const Icon = {
  Check: React.memo(({color=S.success, size=80}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" style={{strokeDasharray:60, strokeDashoffset:60, animation:"draw 0.7s ease forwards"}}></path>
      <polyline points="22 4 12 14.01 9 11.01" style={{strokeDasharray:20, strokeDashoffset:20, animation:"draw 0.5s 0.7s ease forwards"}}></polyline>
      <style>{`@keyframes draw { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  )),
  Lock: React.memo(({color=S.error, size=80}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  )),
  Alert: React.memo(({color=S.warning, size=80}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  )),
  User: React.memo(() => (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke={S.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  )),
  Vault: React.memo(() => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={S.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
      <circle cx="12" cy="12" r="3"></circle>
      <line x1="12" y1="2" x2="12" y2="5"></line>
      <line x1="12" y1="19" x2="12" y2="22"></line>
      <line x1="2" y1="12" x2="5" y2="12"></line>
      <line x1="19" y1="12" x2="22" y2="12"></line>
    </svg>
  )),
  Power: React.memo(() => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
      <line x1="12" y1="2" x2="12" y2="12"></line>
    </svg>
  ))
};

const StudentCard = React.memo(({ student, onVerify, onReset, isMaster }) => (
  <div className="list-item" style={{
    padding:"18px 40px", borderBottom:`1px solid ${S.borderLight}`, 
    display:"flex", justifyContent:"space-between", alignItems:"center",
    height: "100%", width: "100%", boxSizing: "border-box"
  }}>
    <div style={{flex:1, minWidth:0}}>
      <div style={{display:"flex", alignItems:"center", gap:14, flexWrap:"wrap"}}>
        <div style={{fontWeight:800, fontSize:19, color:S.text, wordBreak:"break-all"}}>{student.name}</div>
        {student.payment_status !== 'Paid' && <span style={{fontSize:10, background:S.errorBg, color:S.error, padding:"2px 8px", borderRadius:6, fontWeight:900, border:`1px solid ${S.error}33`}}>UNPAID</span>}
      </div>
      <div style={{fontSize:14, color:S.textMuted, marginTop:6, fontWeight:500}}>
        {student.roll_no} • {student.program} {student.year}yr {student.section && `Sec ${student.section}`}
      </div>
      {student.is_verified && <div style={{color:S.success, marginTop:8, fontSize:12, fontWeight:800}}>✦ CLEARED ({student.verified_by.split('(')[1]?.replace(')','')})</div>}
    </div>
    <div className="list-actions" style={{display:"flex", gap:12, flexShrink:0}}>
      <button disabled={student.is_verified || student.payment_status !== 'Paid'} onClick={() => onVerify(student)} style={{
        padding:"12px 24px", borderRadius:14, 
        background: student.is_verified ? S.successBg : student.payment_status === 'Paid' ? S.gold : "rgba(255,255,255,0.02)", 
        color: student.is_verified ? S.success : student.payment_status === 'Paid' ? "#000" : S.textDim, 
        fontWeight:900, fontSize:11, border: student.is_verified ? `1px solid ${S.success}33` : "none"
      }}>
        {student.is_verified ? "VERIFIED" : "VERIFY"}
      </button>
      {isMaster && student.is_verified && (
        <button onClick={() => onReset(student.id)} style={{padding:"12px", borderRadius:14, background:S.errorBg, color:S.error, border:`1px solid ${S.error}44`}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
        </button>
      )}
    </div>
  </div>
));

const AdminCard = React.memo(({ admin, onToggle }) => (
  <div className="list-item" style={{padding:"24px 40px", borderBottom:`1px solid ${S.borderLight}`, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
    <div style={{minWidth:0}}>
      <div style={{fontWeight:800, color: admin.is_active ? S.text : S.textDim, fontSize:18}}>{admin.name} <span style={{fontSize:11, color:S.textDim, marginLeft:10, background:S.card, padding:"3px 8px", borderRadius:6}}>PIN: {admin.pin}</span></div>
      <div style={{fontSize:12, color:S.textMuted, marginTop:6, fontWeight:700}}>{admin.role.toUpperCase()} • {admin.gate}</div>
    </div>
    <button onClick={() => onToggle(admin.id, admin.is_active)} style={{padding:"8px 20px", borderRadius:12, background: admin.is_active ? S.successBg : S.errorBg, color: admin.is_active ? S.success : S.error, border: `1px solid ${admin.is_active ? S.success : S.error}44`, fontSize:11, fontWeight:900, minWidth:100}}>
      {admin.is_active ? "ACTIVE" : "INACTIVE"}
    </button>
  </div>
));

const StudentRow = React.memo(({ index, style, data }) => {
  const { students, onVerify, onReset, isMaster } = data;
  const student = students[index];
  if (!student) return null;
  return (
    <div style={style}>
      <StudentCard student={student} onVerify={onVerify} onReset={onReset} isMaster={isMaster} />
    </div>
  );
});

// --- MAIN APP ---

export default function FarewellApp() {
  const [view, setView] = useState("form");
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ program: "All", year: "All", section: "All", sort: "name" });
  const [search, setSearch] = useState("");
  const [admins, setAdmins] = useState([]);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({name:"", rollNo:""});
  const [result, setResult] = useState(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [adminTab, setAdminTab] = useState("database");
  const [addForm, setAddForm] = useState({roll_no:"", name:"", program:"BTech", year:2, section:"A", payment_status:"Paid"});
  const [dbMsg, setDbMsg] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const newAdminRef = useRef({ name: "", pin: "", gate: "Gate-1" });

  useEffect(() => {
    fetchData();
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const applyPatches = (payload, setState) => {
      if (payload.eventType === "UPDATE") {
        if (
          payload.old?.is_verified === payload.new?.is_verified &&
          payload.old?.payment_status === payload.new?.payment_status &&
          payload.old?.name === payload.new?.name &&
          payload.old?.is_active === payload.new?.is_active
        ) return;
      }

      setState(prev => {
        const map = new Map(prev.map(s => [s.id, s]));
        
        if (payload.eventType === "UPDATE") {
          const existing = map.get(payload.new.id);
          map.set(payload.new.id, { ...existing, ...payload.new });
        } else if (payload.eventType === "INSERT") {
          map.set(payload.new.id, payload.new);
        } else if (payload.eventType === "DELETE") {
          map.delete(payload.old.id);
        }
        
        return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
      });
    };

    const studentSub = supabase.channel('student-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, (payload) => {
      applyPatches(payload, setStudents);
    }).subscribe();

    const adminSub = supabase.channel('admin-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'admins' }, (payload) => {
      applyPatches(payload, setAdmins);
    }).subscribe();

    return () => { 
      supabase.removeChannel(studentSub); 
      supabase.removeChannel(adminSub); 
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (currentAdmin) {
      const liveAdmin = admins.find(a => a.id === currentAdmin.id);
      if (liveAdmin && !liveAdmin.is_active) {
        setCurrentAdmin(null);
        setView("form");
        setPinInput("");
        alert("SECURITY ALERT: Your session has been revoked by the administrator.");
      }
    }
  }, [admins, currentAdmin]);

  const filteredStudents = useMemo(() => {
    const sInput = search.toLowerCase();
    const rInput = search.toUpperCase();
    return students
      .filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(sInput) || s.roll_no.toUpperCase().includes(rInput);
        const matchesProgram = filters.program === "All" || s.program === filters.program;
        const matchesYear = filters.year === "All" || s.year === parseInt(filters.year);
        const matchesSection = filters.section === "All" || s.section === filters.section;
        return matchesSearch && matchesProgram && matchesYear && matchesSection;
      })
      .sort((a, b) => {
        const isEligible = (s) => s.payment_status === "Paid" && !s.is_verified;
        let res = 0;
        if (filters.sort === "eligible") res = (isEligible(b) ? 1 : 0) - (isEligible(a) ? 1 : 0);
        if (filters.sort === "ineligible") res = (isEligible(a) ? 1 : 0) - (isEligible(b) ? 1 : 0);
        return res !== 0 ? res : a.name.localeCompare(b.name);
      });
  }, [students, search, filters]);

  const fetchData = async () => {
    const [{ data: sData }, { data: aData }] = await Promise.all([
      supabase.from('students').select('*').order('name', { ascending: true }),
      supabase.from('admins').select('*').order('name', { ascending: true })
    ]);
    setStudents(sData || []);
    setAdmins(aData || []);
    setLoaded(true);
  };

  const handleAdminLogin = useCallback(async (manualPin) => {
    const pinToVerify = manualPin || pinInput;
    const admin = admins.find(a => a.pin === pinToVerify && a.is_active);
    if (admin) {
      setCurrentAdmin(admin);
      setPinInput("");
      setPinError(false);
      setView(admin.role === "master" ? "masterAdmin" : "subAdmin");
    } else if (pinToVerify.length >= 5) {
      setPinError(true);
      setPinInput("");
      setTimeout(() => setPinError(false), 500);
    }
  }, [admins, pinInput]);

  useEffect(() => {
    if (pinInput.length === 5) {
      handleAdminLogin(pinInput);
    }
  }, [pinInput, handleAdminLogin]);

  const handleCheckEligibility = useCallback(async () => {
    if (!form.name || !form.rollNo) { alert("Please complete your details"); return; }
    setView("loading");
    await new Promise(r => setTimeout(r, 800));
    const rInput = form.rollNo.trim().toUpperCase();
    const nInput = form.name.trim().toUpperCase();
    const student = students.find(s => s.roll_no.toUpperCase() === rInput && s.name.toUpperCase() === nInput);

    if (!student) setResult({ status: "not_found" });
    else if (student.is_verified) setResult({ status: "already_entered", student });
    else if (student.payment_status !== "Paid") setResult({ status: "not_eligible", student });
    else setResult({ status: "eligible", student });
    setView("result");
  }, [form, students]);

  const verifyStudent = useCallback(async (student) => {
    if (!currentAdmin) return;
    setStudents(prev => prev.map(s => s.id === student.id ? {
      ...s, is_verified: true, verified_at: new Date().toISOString(),
      verified_by: `${currentAdmin.name} (${currentAdmin.gate})`
    } : s));
    await supabase.from('students').update({
      is_verified: true, verified_at: new Date().toISOString(),
      verified_by: `${currentAdmin.name} (${currentAdmin.gate})`
    }).eq('id', student.id);
  }, [currentAdmin]);

  const resetVerification = useCallback(async (id) => {
    if (currentAdmin?.role !== "master") return;
    setStudents(prev => prev.map(s => s.id === id ? {
      ...s, is_verified: false, verified_at: null, verified_by: null
    } : s));
    await supabase.from('students').update({ 
      is_verified: false, verified_at: null, verified_by: null 
    }).eq('id', id);
  }, [currentAdmin]);

  const toggleAdminStatus = useCallback(async (id, status) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, is_active: !status } : a));
    await supabase.from('admins').update({ is_active: !status }).eq('id', id);
  }, []);

  const handleAddStudent = useCallback(async () => {
    if (!addForm.roll_no || !addForm.name) { setDbMsg("⚠️ Required fields missing"); return; }
    const { error } = await supabase.from('students').insert([addForm]);
    if (error) setDbMsg(`❌ ${error.message}`);
    else {
      setDbMsg("✨ Added to list!");
      setAddForm({roll_no:"", name:"", program:"BTech", year:2, section:"A", payment_status:"Paid"});
    }
    setTimeout(() => setDbMsg(""), 4000);
  }, [addForm]);

  const handleAddAdmin = useCallback(async () => {
    const { name, pin, gate } = newAdminRef.current;
    if(!name || !pin) return;
    const { error } = await supabase.from('admins').insert([{name, pin, gate, role:'sub', is_active:true}]);
    if (error) alert(error.message);
    else {
      document.getElementById('admName').value = '';
      document.getElementById('admPin').value = '';
      newAdminRef.current = { name: "", pin: "", gate: "Gate-1" };
    }
  }, []);

  const onNameChange = useCallback(e => setForm(f => ({...f, name: e.target.value})), []);
  const onRollChange = useCallback(e => setForm(f => ({...f, rollNo: e.target.value})), []);
  const onPinChange = useCallback(e => { setPinInput(e.target.value); setPinError(false); }, []);
  const onSearchChange = useCallback(e => setSearch(e.target.value), []);
  const onFilterChange = useCallback(e => {
    const { name, value } = e.target;
    setFilters(f => ({...f, [name]: value}));
  }, []);
  const onAddFormChange = useCallback(e => {
    const { name, value } = e.target;
    setAddForm(f => ({...f, [name]: name === 'year' ? parseInt(value) : value}));
  }, []);
  const onNewAdminFieldChange = useCallback(e => {
    const { name, value } = e.target;
    newAdminRef.current[name] = value;
  }, []);

  const virtualData = useMemo(() => ({
    students: filteredStudents,
    onVerify: verifyStudent,
    onReset: resetVerification,
    isMaster: view === "masterAdmin"
  }), [filteredStudents, verifyStudent, resetVerification, view]);

  const listItemHeight = windowWidth <= 768 ? 160 : 100;

  if (!loaded) return (
    <div style={{minHeight:"100vh", background:S.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
      <NebulaBg />
      <div style={{position:"relative", zIndex:1, textAlign:"center"}}>
        <div style={{width:100, height:100, border:`3px solid rgba(255,255,255,0.03)`, borderTopColor:S.gold, borderRadius:"50%", animation:"borderRotate 1.2s infinite", margin:"0 auto 40px"}} />
        <h1 className="premium-text" style={{fontFamily:"'Playfair Display', serif", fontSize:44, fontWeight:700, letterSpacing:"0.18em"}}>GRAND FAREWELL</h1>
        <p style={{color:S.textDim, letterSpacing:"0.5em", fontSize:11, fontWeight:800, marginTop:24}}>ESTABLISHING ENCRYPTED LINK</p>
      </div>
    </div>
  );

  const stats = [
    {l:"TOTAL MANIFEST", v:students.length, c:S.text},
    {l:"CLEARED ENTRY", v:students.filter(s=>s.is_verified).length, c:S.success},
    {l:"PENDING ARRIVAL", v:students.length - students.filter(s=>s.is_verified).length, c:S.warning}
  ];

  return (
    <div style={{minHeight:"100vh", position:"relative"}}>
      <NebulaBg/><style>{css}</style>

      {view === "form" && (
        <div key="form" className="view-transition" style={{padding:"60px 24px 100px", maxWidth:500, margin:"0 auto", position:"relative", zIndex:1}}>
          <div style={{textAlign:"center", marginBottom:56}} className="floating">
            <div style={{marginBottom:32}} className="pulse"><Icon.User/></div>
            <h1 className="premium-text" style={{fontFamily:"'Playfair Display', serif", fontSize:52, fontWeight:700, letterSpacing:"-0.02em"}}>Farewell Entry</h1>
            <p style={{color:S.textMuted, marginTop:16, letterSpacing:"0.35em", fontSize:13, fontWeight:800}}>IDENTITY CLEARANCE</p>
          </div>
          <div className="glass-card" style={{padding:56}}>
            <BorderBeam />
            <div style={{marginBottom:32}}>
              <label style={{fontSize:11, color:S.gold, fontWeight:900, display:"block", marginBottom:14, letterSpacing:"0.18em"}}>GUEST FULL NAME</label>
              <input placeholder="Mohammad Asim" value={form.name} onChange={onNameChange}/>
            </div>
            <div style={{marginBottom:56}}>
              <label style={{fontSize:11, color:S.gold, fontWeight:900, display:"block", marginBottom:14, letterSpacing:"0.18em"}}>ROLL NUMBER</label>
              <input placeholder="2420101..." value={form.rollNo} onChange={onRollChange}/>
            </div>
            <button className="shine-btn" onClick={handleCheckEligibility}>Verify Eligibility ✦</button>
          </div>
          <button onClick={() => setView("adminLogin")} style={{display:"block", width:"100%", background:"none", border:"none", color:S.textDim, marginTop:56, cursor:"pointer", fontSize:11, letterSpacing:"0.35em", fontWeight:800, transition:"color 0.3s"}}>🛡️ SECURE GATEWAY ACCESS</button>
        </div>
      )}

      {view === "loading" && (
        <div key="loading" style={{minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
          <div style={{width:80, height:80, border:`3px solid rgba(255,255,255,0.03)`, borderTopColor:S.gold, borderRadius:"50%", animation:"borderRotate 1s infinite"}} />
          <p style={{color:S.gold, letterSpacing:"0.5em", fontSize:11, fontWeight:900, marginTop:48}}>SYNCING WITH VAULT</p>
        </div>
      )}

      {view === "result" && (
        <div key="result" className="view-transition" style={{padding:"80px 24px", textAlign:"center", position:"relative", zIndex:1, maxWidth:640, margin:"0 auto"}}>
          {result.status === "eligible" && <Confetti />}
          <div style={{marginBottom:48}} className={result.status === "eligible" ? "pulse" : ""}>
            {result.status === "eligible" ? <Icon.Check/> : 
             result.status === "already_entered" ? <Icon.Lock/> :
             result.status === "not_eligible" ? <Icon.Alert/> : <Icon.Lock color={S.textDim}/>}
          </div>
          <h1 className="premium-text" style={{fontSize:48, fontFamily:"'Playfair Display', serif", marginBottom:28, fontWeight:700}}>
            {result.status === "eligible" ? "Access Granted" : result.status === "already_entered" ? "Entry Denied" : result.status === "not_eligible" ? "Access Restricted" : "Not Found"}
          </h1>
          {result.student && (
            <div style={{marginBottom:48}}>
              <div style={{fontSize:13, color:S.gold, letterSpacing:"0.3em", fontWeight:900, marginBottom:14}}>GUEST RECOGNIZED</div>
              <div style={{fontSize:32, fontWeight:800, color:S.text, textTransform:"uppercase", wordBreak:"break-all"}}>{result.student.name}</div>
              <div style={{fontSize:16, color:S.textMuted, marginTop:12, fontWeight:500}}>
                {result.student.roll_no} • {result.student.program} {result.student.year}yr {result.student.section && `Sec ${result.student.section}`}
              </div>
            </div>
          )}
          <div className="glass-card" style={{padding:40, marginBottom:60}}>
            <BorderBeam />
            <p style={{color:S.text, fontSize:17, lineHeight:1.8, fontWeight:400}}>
              {result.status === "eligible" ? "IDENTITY CLEARANCE: Your digital invitation has been authenticated. Please proceed to the checkpoint and present this screen for final entry logging." : 
               result.status === "already_entered" ? `SECURITY ALERT: This invitation was already used for entry at ${new Date(result.student.verified_at).toLocaleTimeString()} via ${result.student.verified_by.split('(')[1]?.replace(')','') || 'Main Gate'}. Duplicate entry is prohibited.` :
               result.status === "not_found" ? "ARCHIVE MISMATCH: Your credentials do not exist in the guest directory. Please verify your Roll Number or visit the Registration Desk." :
               "INVITATION SUSPENDED: Your digital clearance is on hold due to pending registration formalities. Please resolve this at the Accounts Terminal."}
            </p>
          </div>
          <button className="shine-btn" onClick={()=>setView("form")} style={{maxWidth:320, margin:"0 auto"}}>Return to Entry</button>
        </div>
      )}

      {view === "adminLogin" && (
        <div key="login" className="view-transition" style={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24}}>
          <div className={`glass-card ${pinError ? 'shake' : ''}`} style={{padding:"60px 40px", maxWidth:480, width:"100%", textAlign:"center"}}>
            <BorderBeam />
            <div style={{marginBottom:32}} className="floating"><Icon.Vault/></div>
            <h2 className="premium-text" style={{fontSize:32, fontFamily:"'Playfair Display', serif", marginBottom:12, letterSpacing:"0.05em"}}>Security Clearance</h2>
            <p style={{color:S.textDim, fontSize:12, fontWeight:800, letterSpacing:"0.2em", marginBottom:48}}>ACCESSING ENCRYPTED TERMINAL</p>
            
            <div style={{marginBottom:48, position:"relative"}}>
              <input 
                type="password" 
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={5}
                placeholder="Enter Admin PIN" 
                className="pin-input"
                value={pinInput} 
                onChange={onPinChange}
                autoFocus
              />
            </div>

            <button onClick={()=>setView("form")} style={{background:"none", border:"none", color:S.textDim, marginTop:12, fontSize:11, fontWeight:900, cursor:"pointer", letterSpacing:"0.15em", transition:"color 0.3s"}}>
              <span style={{opacity:0.5}}>— OR —</span><br/><br/>
              ABORT SECURITY REQUEST
            </button>
          </div>
        </div>
      )}

      {(view === "subAdmin" || view === "masterAdmin") && (
        <div key="admin" className="view-transition" style={{display:"flex", flexDirection:"column", minHeight:"100vh", maxWidth:1150, margin:"0 auto", padding:"40px 20px", boxSizing:"border-box", position:"relative", zIndex:1}}>
          <div className="admin-header" style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:40}}>
            <div>
              <div style={{display:"flex", alignItems:"center", gap:14, flexWrap:"wrap"}}>
                <h2 className="premium-text" style={{fontSize:36, fontFamily:"'Playfair Display', serif", fontWeight:700}}>{view === "masterAdmin" ? "Master Control" : "Gate Terminal"}</h2>
                <span style={{background:S.gold, color:"#000", fontSize:11, fontWeight:900, padding:"4px 12px", borderRadius:7, textTransform:"uppercase"}}>{currentAdmin?.gate}</span>
              </div>
              <p style={{color:S.textMuted, fontSize:13, letterSpacing:"0.2em", fontWeight:900, marginTop:10}}>OPERATOR: {currentAdmin?.name.toUpperCase()}</p>
            </div>
            <button onClick={()=>{setView("form"); setCurrentAdmin(null);}} style={{padding:"14px 24px", borderRadius:16, background:S.card, border:`1px solid ${S.border}`, color:S.textMuted, fontSize:11, fontWeight:900, cursor:"pointer", display:"flex", alignItems:"center", gap:10, transition:"all 0.3s"}}>
              <Icon.Power />
              TERMINATE
            </button>
          </div>

          <div className="stats-container" style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:20, marginBottom:40}}>
            {stats.map(st => (
              <div key={st.l} className="glass-card" style={{padding:20, textAlign:"center"}}>
                <BorderBeam />
                <div style={{fontSize:10, color:S.textMuted, marginBottom:8, fontWeight:900, letterSpacing:"0.1em"}}>{st.l}</div>
                <div style={{fontSize:32, fontWeight:900, color:st.c}}>{st.v}</div>
              </div>
            ))}
          </div>

          <div className="tab-container" style={{display:"flex", background:S.card, padding:8, borderRadius:24, marginBottom:32, border:`1px solid ${S.border}`}}>
            <button onClick={()=>setAdminTab("database")} style={{flex:1, padding:16, borderRadius:18, background:adminTab==='database'?S.gold:"transparent", color:adminTab==='database'?"#1a1000":S.textMuted, fontWeight:900, fontSize:13, transition:"all 0.2s"}}>GUEST ARCHIVE</button>
            {view === "masterAdmin" && (
              <>
                <button onClick={()=>setAdminTab("add")} style={{flex:1, padding:16, borderRadius:18, background:adminTab==='add'?S.gold:"transparent", color:adminTab==='add'?"#1a1000":S.textMuted, fontWeight:900, fontSize:13, transition:"all 0.2s"}}>ENROLL NEW</button>
                <button onClick={()=>setAdminTab("manageAdmins")} style={{flex:1, padding:16, borderRadius:18, background:adminTab==='manageAdmins'?S.gold:"transparent", color:adminTab==='manageAdmins'?"#1a1000":S.textMuted, fontWeight:900, fontSize:13, transition:"all 0.2s"}}>OPERATORS</button>
              </>
            )}
          </div>

          <div style={{flex:1, minHeight:0, display:"flex", flexDirection:"column"}}>
            {adminTab === "database" && (
              <div key="db" className="tab-transition" style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden"}}>
                <div className="glass-card scrollbar-hide" style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden", borderBottomLeftRadius:0, borderBottomRightRadius:0}}>
                  <div style={{padding:24, borderBottom:`1px solid ${S.border}`, display:"flex", flexDirection:"column", gap:20, background:"rgba(0,0,0,0.15)"}}>
                    <input placeholder="Search encrypted records..." onChange={onSearchChange} style={{background:"rgba(0,0,0,0.3)"}}/>
                    <div className="filter-bar">
                      <select name="program" value={filters.program} onChange={onFilterChange}>
                        <option value="All">Program: All</option>
                        <option value="BTech">BTech</option>
                        <option value="BCA">BCA</option>
                      </select>
                      <select name="year" value={filters.year} onChange={onFilterChange}>
                        <option value="All">Year: All</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                      <select name="section" value={filters.section} onChange={onFilterChange}>
                        <option value="All">Section: All</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                      <select name="sort" value={filters.sort} onChange={onFilterChange} style={{borderColor:`${S.gold}44`}}>
                        <option value="name">A-Z</option>
                        <option value="eligible">Eligible</option>
                        <option value="ineligible">Ineligible</option>
                      </select>
                    </div>
                  </div>
                  <div style={{flex:1, overflow:"hidden"}} className="scrollbar-hide">
                    {filteredStudents.length > 0 ? (
                      <List
                        height={600}
                        itemCount={filteredStudents.length}
                        itemSize={listItemHeight}
                        width="100%"
                        itemData={virtualData}
                        className="scrollbar-hide"
                      >
                        {StudentRow}
                      </List>
                    ) : (
                      <div style={{padding:40, textAlign:"center", color:S.textDim, fontWeight:800, letterSpacing:"0.2em"}}>NO RECORDS FOUND</div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {adminTab === "add" && view === "masterAdmin" && (
              <div key="add" className="tab-transition" style={{flex:1, display:"flex", alignItems:"center", justifyContent:"center", paddingBottom:40}}>
                <div className="glass-card" style={{padding:"40px 32px", maxWidth:600, width:"100%"}}>
                   <BorderBeam />
                   <div style={{marginBottom:20}}><label style={{fontSize:11, color:S.gold, fontWeight:900, display:"block", marginBottom:10}}>ROLL NUMBER</label><input name="roll_no" placeholder="Ex: 24201" value={addForm.roll_no} onChange={onAddFormChange}/></div>
                   <div style={{marginBottom:20}}><label style={{fontSize:11, color:S.gold, fontWeight:900, display:"block", marginBottom:10}}>FULL NAME</label><input name="name" placeholder="Ex: Mohammad Asim" value={addForm.name} onChange={onAddFormChange}/></div>
                   <div className="filter-bar" style={{marginBottom:20}}>
                     <div><label style={{fontSize:10, color:S.textMuted, fontWeight:900, display:"block", marginBottom:8}}>PROGRAM</label><select name="program" value={addForm.program} onChange={onAddFormChange}><option value="BTech">BTech</option><option value="BCA">BCA</option></select></div>
                     <div><label style={{fontSize:10, color:S.textMuted, fontWeight:900, display:"block", marginBottom:8}}>YEAR</label><select name="year" value={addForm.year} onChange={onAddFormChange}><option value={2}>2</option><option value={3}>3</option></select></div>
                     <div><label style={{fontSize:10, color:S.textMuted, fontWeight:900, display:"block", marginBottom:8}}>SECTION</label><select name="section" value={addForm.section} onChange={onAddFormChange}><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></div>
                   </div>
                   <div style={{marginBottom:40}}><label style={{fontSize:11, color:S.gold, fontWeight:900, display:"block", marginBottom:10}}>PAYMENT STATUS</label><select name="payment_status" value={addForm.payment_status} onChange={onAddFormChange}><option value="Paid">PAID</option><option value="Not Paid">UNPAID</option></select></div>
                   {dbMsg && <p style={{color:S.gold, marginBottom:20, textAlign:"center", fontWeight:900, fontSize:14}}>{dbMsg}</p>}
                   <button className="shine-btn" onClick={handleAddStudent}>Commit to Database ✦</button>
                </div>
              </div>
            )}
            {adminTab === "manageAdmins" && view === "masterAdmin" && (
              <div key="admins" className="tab-transition" style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden"}}>
                <div className="glass-card scrollbar-hide" style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden"}}>
                  <div style={{padding:24, borderBottom:`1px solid ${S.border}`, background:"rgba(0,0,0,0.2)"}}>
                    <h3 style={{fontSize:13, color:S.gold, marginBottom:20, fontWeight:900, letterSpacing:"0.1em"}}>REGISTER NEW SUB-ADMIN</h3>
                    <div className="filter-bar" style={{gap:12}}>
                      <input name="name" placeholder="Name" id="admName" onChange={onNewAdminFieldChange}/>
                      <input name="pin" placeholder="PIN" id="admPin" onChange={onNewAdminFieldChange}/>
                      <select name="gate" id="admGate" onChange={onNewAdminFieldChange}><option value="Gate-1">Gate 1</option><option value="Gate-2">Gate 2</option><option value="Gate-3">Gate 3</option></select>
                      <button onClick={handleAddAdmin} className="shine-btn" style={{padding:0, height:"56px"}}>ADD</button>
                    </div>
                  </div>
                  <div style={{flex:1, overflowY:"auto"}} className="scrollbar-hide">
                    {admins.map(adm => (
                      <AdminCard key={adm.id} admin={adm} onToggle={toggleAdminStatus} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
