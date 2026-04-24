import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// --- DATABASE CONFIG ---
const SUPABASE_URL = 'https://jujmdykstsmtduclzvqr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1am1keWtzdHNtdGR1Y2x6dnFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMjkyMTIsImV4cCI6MjA5MjYwNTIxMn0.cm1Rly-GO_8Fi3V8O3Csvo9c7SdpSI4AvpYp35LbeNg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_PIN = "22568";

const S = {
  bg: "#080616",
  bg2: "#120d2d",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  borderLight: "rgba(255,255,255,0.03)",
  gold: "#f4c430",
  goldGlow: "rgba(244,196,48,0.3)",
  success: "#10b981",
  successBg: "rgba(16,185,129,0.1)",
  error: "#ff4d4d",
  errorBg: "rgba(255,77,77,0.1)",
  text: "#f1f0f8",
  textMuted: "#a19ebf",
  textDim: "#636185",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body { 
    background: ${S.bg}; 
    color: ${S.text}; 
    font-family: 'DM Sans', system-ui, sans-serif; 
    height: 100vh; 
    height: 100dvh;
    width: 100vw;
    overflow: hidden; 
  }
  #root { height: 100%; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes shine { from { left: -100%; } to { left: 100%; } }
  @keyframes shimmer { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
  @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
  @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.03); opacity: 0.8; } }

  .view-enter { animation: fadeIn 0.6s cubic-bezier(0.19, 1, 0.22, 1) both; }
  .floating { animation: float 5s ease-in-out infinite; }
  .shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
  .pulse { animation: pulse 2s infinite ease-in-out; }

  .glass-card {
    background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
    border-radius: 28px; border: 1px solid ${S.border};
    backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  input, select {
    background: rgba(255,255,255,0.02); border: 1px solid ${S.border}; color: ${S.text};
    border-radius: 14px; padding: 14px 18px; width: 100%; font-size: 15px;
    outline: none; transition: all 0.3s; backdrop-filter: blur(12px);
    appearance: none;
  }
  input:focus { border-color: ${S.gold}; background: rgba(244,196,48,0.06); box-shadow: 0 0 15px rgba(244,196,48,0.1); }

  .shine-btn { 
    position: relative; overflow: hidden; border: none; cursor: pointer;
    background: linear-gradient(135deg, ${S.gold}, #e8a820);
    color: #1a1000; fontWeight: 800; fontSize: 14px; padding: 16px 24px; borderRadius: 16px; width: 100%;
    box-shadow: 0 8px 30px rgba(244,196,48,0.2); letter-spacing: 0.05em; text-transform: uppercase;
  }
  .shine-btn::after {
    content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transform: skewX(-25deg); transition: 0.6s;
  }
  .shine-btn:hover::after { animation: shine 0.8s forwards; }
  .shine-btn:active { transform: scale(0.97); }

  .icon-glow { filter: drop-shadow(0 0 10px ${S.goldGlow}); }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  
  @media (max-width: 480px) {
    .glass-card { padding: 24px !important; border-radius: 20px; }
    h1 { font-size: 32px !important; }
  }
`;

function StarsBg() {
  const stars = Array.from({length: 40}, (_, i) => ({
    id: i, x: Math.random()*100, y: Math.random()*100, size: Math.random()*1.2+0.5, delay: Math.random()*8,
  }));
  return (
    <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0, background:`radial-gradient(circle at 50% 50%, ${S.bg2} 0%, ${S.bg} 100%)`}}>
      {stars.map(s => (
        <div key={s.id} style={{
          position:"absolute", left:`${s.x}%`, top:`${s.y}%`, width:s.size, height:s.size,
          borderRadius:"50%", background:"white", opacity:0.2,
          animation:`shimmer ${4+Math.random()*4}s ${s.delay}s infinite`
        }}/>
      ))}
    </div>
  );
}

const Icon = {
  Check: () => (
    <svg className="icon-glow" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={S.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  Lock: () => (
    <svg className="icon-glow" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={S.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  User: () => (
    <svg className="icon-glow" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={S.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Vault: () => (
    <svg className="icon-glow" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={S.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
      <circle cx="12" cy="12" r="3"></circle>
      <line x1="12" y1="2" x2="12" y2="5"></line>
      <line x1="12" y1="19" x2="12" y2="22"></line>
      <line x1="2" y1="12" x2="5" y2="12"></line>
      <line x1="19" y1="12" x2="22" y2="12"></line>
    </svg>
  )
};

function GoldBtn({children, onClick, style={}, className=""}) {
  return (
    <button className={`shine-btn ${className}`} onClick={onClick} style={{
      color: "#1a1000", fontWeight:800, fontSize:15, padding:"20px 32px", borderRadius:20, width:"100%",
      boxShadow: `0 12px 40px rgba(244,196,48,0.25)`, letterSpacing:"0.08em", textTransform:"uppercase", ...style
    }}>{children}</button>
  );
}

export default function FarewellApp() {
  const [view, setView] = useState("form");
  const [students, setStudents] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({name:"", rollNo:""});
  const [result, setResult] = useState(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [adminTab, setAdminTab] = useState("database");
  const [search, setSearch] = useState("");
  const [addStudent, setAddStudent] = useState({roll_no:"", name:"", course:"", payment_status:"Paid"});
  const [dbMsg, setDbMsg] = useState("");

  useEffect(() => {
    fetchStudents();
    const channel = supabase.channel('realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, fetchStudents).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchStudents = async () => {
    const { data } = await supabase.from('students').select('*').order('name', { ascending: true });
    setStudents(data || []);
    setLoaded(true);
  };

  const handleCheckEligibility = async () => {
    if (!form.name || !form.rollNo) { alert("Please complete your details"); return; }
    setView("loading");
    await new Promise(r => setTimeout(r, 1800));
    const rInput = form.rollNo.trim().toUpperCase();
    const nInput = form.name.trim().toUpperCase();
    const student = students.find(s => s.roll_no.toUpperCase() === rInput && s.name.toUpperCase() === nInput);

    if (!student) setResult({ status: "not_found" });
    else setResult({ status: student.payment_status === "Paid" ? "eligible" : "not_eligible", student });
    setView("result");
  };

  const handleAddStudent = async () => {
    if (!addStudent.roll_no || !addStudent.name) { setDbMsg("⚠️ Required fields missing"); return; }
    const { error } = await supabase.from('students').insert([addStudent]);
    if (error) setDbMsg(`❌ ${error.message}`);
    else {
      setDbMsg("✨ Added to list!");
      setAddStudent({roll_no:"", name:"", course:"", payment_status:"Paid"});
      fetchStudents();
    }
    setTimeout(() => setDbMsg(""), 4000);
  };

  const togglePayment = async (id, currentStatus) => {
    const newStatus = currentStatus === "Paid" ? "Not Paid" : "Paid";
    await supabase.from('students').update({ payment_status: newStatus }).eq('id', id);
    fetchStudents();
  };

  if (!loaded) return <div style={{minHeight:"100vh", background:S.bg}} />;

  return (
    <div style={{minHeight:"100vh", position:"relative"}}>
      <StarsBg/><style>{css}</style>

      {view === "form" && (
        <div className="view-enter" style={{padding:"80px 24px", maxWidth:500, margin:"0 auto", position:"relative", zIndex:1}}>
          <div style={{textAlign:"center", marginBottom:56}} className="floating">
            <div style={{marginBottom:24}}><Icon.User/></div>
            <h1 style={{fontFamily:"'Playfair Display', serif", fontSize:44, color:S.gold, fontWeight:700, letterSpacing:"-0.02em"}}>Farewell Entry</h1>
            <p style={{color:S.textMuted, marginTop:12, letterSpacing:"0.2em", fontSize:12, fontWeight:700}}>VERIFY YOUR STATUS</p>
          </div>
          <div className="glass-card" style={{padding:40}}>
            <div style={{marginBottom:24}}>
              <label style={{fontSize:11, color:S.textMuted, fontWeight:700, display:"block", marginBottom:10, letterSpacing:"0.1em"}}>GUEST NAME</label>
              <input placeholder="Ex: Mohammad Asim" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            </div>
            <div style={{marginBottom:40}}>
              <label style={{fontSize:11, color:S.textMuted, fontWeight:700, display:"block", marginBottom:10, letterSpacing:"0.1em"}}>ROLL NUMBER</label>
              <input placeholder="Ex: 24201..." value={form.rollNo} onChange={e=>setForm({...form,rollNo:e.target.value})}/>
            </div>
            <GoldBtn onClick={handleCheckEligibility}>Verify Eligibility ✦</GoldBtn>
          </div>
          <button onClick={() => setView("adminLogin")} style={{display:"block", width:"100%", background:"none", border:"none", color:S.textDim, marginTop:40, cursor:"pointer", fontSize:11, letterSpacing:"0.25em", fontWeight:700}}>🛡️ SECURE SYSTEM ACCESS</button>
        </div>
      )}

      {view === "loading" && (
        <div style={{minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
          <div style={{width:60, height:60, border:`4px solid rgba(255,255,255,0.05)`, borderTopColor:S.gold, borderRadius:"50%", animation:"shimmer 1s infinite"}} />
          <p style={{color:S.gold, letterSpacing:"0.4em", fontSize:11, fontWeight:700, marginTop:32, animation:"shimmer 2s infinite"}}>SYNCING WITH VAULT</p>
        </div>
      )}

      {view === "result" && (
        <div className="view-enter" style={{padding:"100px 24px", textAlign:"center", position:"relative", zIndex:1}}>
          <div style={{marginBottom:40}} className="pulse">
            {result.status === "eligible" ? <Icon.Check/> : <Icon.Lock/>}
          </div>
          <h1 style={{color: result.status === "eligible" ? S.success : S.error, fontSize:42, fontFamily:"'Playfair Display', serif", marginBottom:20, fontWeight:700}}>
            {result.status === "eligible" ? "Access Granted" : "Access Restricted"}
          </h1>
          <div className="glass-card" style={{padding:32, maxWidth:420, margin:"0 auto 48px"}}>
            <p style={{color:S.text, fontSize:17, lineHeight:1.7}}>
              {result.status === "eligible" ? "Welcome to the Grand Farewell. Your presence is honored and entry is fully cleared." : 
               result.status === "not_found" ? "We couldn't locate your invitation in our archives. Please verify your credentials." :
               "Your payment status is currently flagged as pending. Please settle requirements to unlock your entry pass."}
            </p>
          </div>
          <GoldBtn onClick={()=>setView("form")} style={{maxWidth:280, margin:"0 auto"}}>Verify Another</GoldBtn>
        </div>
      )}

      {view === "adminLogin" && (
        <div className="view-enter" style={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24}}>
          <div className={`glass-card ${pinError ? 'shake' : ''}`} style={{padding:48, maxWidth:420, width:"100%", textAlign:"center"}}>
            <div style={{marginBottom:28}}><Icon.Vault/></div>
            <h2 style={{color:S.gold, fontSize:26, fontFamily:"'Playfair Display', serif", marginBottom:36, letterSpacing:"0.05em"}}>Security Clearance</h2>
            <div style={{marginBottom:36}}>
              <input type="password" placeholder="••••" value={pinInput} onChange={e=>{setPinInput(e.target.value); setPinError(false);}} style={{textAlign:"center", fontSize:32, letterSpacing:"0.6em", fontWeight:700}}/>
            </div>
            <GoldBtn onClick={() => { if(pinInput===ADMIN_PIN){setView("admin");setPinError(false);}else{setPinError(true); setTimeout(()=>setPinError(false), 500);} }}>Unlock System</GoldBtn>
            <button onClick={()=>setView("form")} style={{background:"none", border:"none", color:S.textDim, marginTop:32, fontSize:12, fontWeight:700, cursor:"pointer"}}>TERMINATE REQUEST</button>
          </div>
        </div>
      )}

      {view === "admin" && (
        <div className="view-enter" style={{display:"flex", flexDirection:"column", height:"100vh", maxWidth:1100, margin:"0 auto", padding:"20px 24px", boxSizing:"border-box"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20}}>
            <div>
              <h2 style={{color:S.gold, fontSize:28, fontFamily:"'Playfair Display', serif", fontWeight:700}}>Admin Dashboard</h2>
              <p style={{color:S.textMuted, fontSize:11, letterSpacing:"0.1em", fontWeight:700}}>MANAGE STUDENTS</p>
            </div>
            <button onClick={()=>setView("form")} style={{padding:"10px 20px", borderRadius:12, background:S.card, border:`1px solid ${S.border}`, color:S.textMuted, fontSize:11, fontWeight:700, cursor:"pointer"}}>SECURE LOGOUT</button>
          </div>

          <div style={{display:"flex", gap:15, marginBottom:20}}>
            <div className="glass-card" style={{padding:"16px 20px", flex:1, textAlign:"center"}}>
              <div style={{fontSize:10, color:S.textMuted, marginBottom:4, fontWeight:700, letterSpacing:"0.05em"}}>GUESTS</div>
              <div style={{fontSize:28, fontWeight:800, color:S.purple}}>{students.length}</div>
            </div>
            <div className="glass-card" style={{padding:"16px 20px", flex:1, textAlign:"center"}}>
              <div style={{fontSize:10, color:S.textMuted, marginBottom:4, fontWeight:700, letterSpacing:"0.05em"}}>CLEARED</div>
              <div style={{fontSize:28, fontWeight:800, color:S.success}}>{students.filter(s=>s.payment_status==='Paid').length}</div>
            </div>
            <div className="glass-card" style={{padding:"16px 20px", flex:1, textAlign:"center"}}>
              <div style={{fontSize:10, color:S.textMuted, marginBottom:4, fontWeight:700, letterSpacing:"0.05em"}}>PENDING</div>
              <div style={{fontSize:28, fontWeight:800, color:S.error}}>{students.filter(s=>s.payment_status!=='Paid').length}</div>
            </div>
          </div>

          <div style={{display:"flex", background:S.card, padding:6, borderRadius:20, marginBottom:20, border:`1px solid ${S.border}`, flexShrink:0}}>
            <button onClick={()=>setAdminTab("database")} style={{flex:1, padding:14, borderRadius:15, background:adminTab==='database'?S.gold:"transparent", color:adminTab==='database'?"#1a1000":S.textMuted, fontWeight:800, fontSize:12, transition:"0.3s"}}>GUEST ARCHIVE</button>
            <button onClick={()=>setAdminTab("add")} style={{flex:1, padding:14, borderRadius:15, background:adminTab==='add'?S.gold:"transparent", color:adminTab==='add'?"#1a1000":S.textMuted, fontWeight:800, fontSize:12, transition:"0.3s"}}>NEW ENROLLMENT</button>
          </div>

          <div style={{flex:1, minHeight:0, display:"flex", flexDirection:"column"}}>
            {adminTab === "database" && (
              <div className="glass-card scrollbar-hide" style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden"}}>
                <div style={{padding:20, borderBottom:`1px solid ${S.border}`}}>
                  <input placeholder="Search guests..." onChange={e=>setSearch(e.target.value)} style={{padding:12, borderRadius:12}}/>
                </div>
                <div style={{flex:1, overflowY:"auto"}} className="scrollbar-hide">
                  {students.filter(s=>s.name.toLowerCase().includes(search.toLowerCase()) || s.roll_no.includes(search)).map(s=>(
                    <div key={s.id} style={{padding:"18px 24px", borderBottom:`1px solid ${S.borderLight}`, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                      <div>
                        <div style={{fontWeight:700, fontSize:16, color:S.text}}>{s.name}</div>
                        <div style={{fontSize:12, color:S.textMuted, marginTop:4, fontWeight:500}}>{s.roll_no} • {s.course || "General"}</div>
                      </div>
                      <button onClick={()=>togglePayment(s.id, s.payment_status)} style={{
                        padding:"8px 18px", borderRadius:10, 
                        background:s.payment_status==='Paid'?S.successBg:S.errorBg, 
                        color:s.payment_status==='Paid'?S.success:S.error, 
                        border:`1px solid ${s.payment_status==='Paid'?S.success:S.error}33`, 
                        fontWeight:800, fontSize:10, letterSpacing:"0.05em", cursor:"pointer"
                      }}>
                        {s.payment_status.toUpperCase()}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminTab === "add" && (
              <div style={{flex:1, display:"flex", alignItems:"center", justifyContent:"center"}}>
                <div className="glass-card" style={{padding:"32px 40px", maxWidth:550, width:"100%"}}>
                   <div style={{marginBottom:16}}>
                     <label style={{fontSize:10, color:S.textMuted, fontWeight:700, display:"block", marginBottom:8, letterSpacing:"0.05em"}}>UNIQUE IDENTIFICATION</label>
                     <input placeholder="Enter Roll Number" value={addStudent.roll_no} onChange={e=>setAddStudent({...addStudent,roll_no:e.target.value})} style={{padding:14, borderRadius:12}}/>
                   </div>
                   <div style={{marginBottom:16}}>
                     <label style={{fontSize:10, color:S.textMuted, fontWeight:700, display:"block", marginBottom:8, letterSpacing:"0.05em"}}>FULL GUEST NAME</label>
                     <input placeholder="Enter Full Name" value={addStudent.name} onChange={e=>setAddStudent({...addStudent,name:e.target.value})} style={{padding:14, borderRadius:12}}/>
                   </div>
                   <div style={{marginBottom:16}}>
                     <label style={{fontSize:10, color:S.textMuted, fontWeight:700, display:"block", marginBottom:8, letterSpacing:"0.05em"}}>ACADEMIC COURSE</label>
                     <input placeholder="Enter Course Name" value={addStudent.course} onChange={e=>setAddStudent({...addStudent,course:e.target.value})} style={{padding:14, borderRadius:12}}/>
                   </div>
                   <div style={{marginBottom:32}}>
                     <label style={{fontSize:10, color:S.textMuted, fontWeight:700, display:"block", marginBottom:8, letterSpacing:"0.05em"}}>ENROLLMENT STATUS</label>
                     <select value={addStudent.payment_status} onChange={e=>setAddStudent({...addStudent,payment_status:e.target.value})}>
                       <option value="Paid">CLEARED (PAID)</option>
                       <option value="Not Paid">PENDING (UNPAID)</option>
                     </select>
                   </div>
                   {dbMsg && <p style={{color:S.gold, marginBottom:20, textAlign:"center", fontWeight:700, fontSize:13}}>{dbMsg}</p>}
                   <GoldBtn onClick={handleAddStudent} style={{padding:16, borderRadius:14}}>COMMIT TO ARCHIVE ✦</GoldBtn>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
