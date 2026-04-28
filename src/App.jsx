import React, { useState, useMemo } from 'react';
import * as htmlToImage from 'html-to-image';

// --- KOMPONEN IKON SVG (Custom Climbing) ---
const IconUser = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconScale = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>;
const IconDownload = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const IconReset = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>;
const IconMountain = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>;

// --- FUNGSI SCORING LOGIC PANJAT TEBING ---
const getScoreClimbing = (test, gender, value) => {
  if (value === '' || value === null || isNaN(value)) return 0;
  const v = parseFloat(value); const isM = gender === 'Putra';
  switch(test) {
    case 'sitReach': 
      return isM ? (v >= 30.6 ? 100 : v >= 24.5 ? 80 : v >= 21.4 ? 70 : v >= 18.4 ? 60 : 40) 
                 : (v >= 32.1 ? 100 : v >= 25.7 ? 80 : v >= 22.5 ? 70 : v >= 19.3 ? 60 : 40);
    case 'verticalJump': 
      return isM ? (v >= 80 ? 100 : v >= 64 ? 80 : v >= 56 ? 70 : v >= 48 ? 60 : 40) 
                 : (v >= 65 ? 100 : v >= 52 ? 80 : v >= 46 ? 70 : v >= 39 ? 60 : 40);
    case 'pullUp': 
      return isM ? (v >= 33 ? 100 : v >= 26 ? 80 : v >= 23 ? 70 : v >= 20 ? 60 : 40) 
                 : (v >= 21 ? 100 : v >= 17 ? 80 : v >= 15 ? 70 : v >= 13 ? 60 : 40);
    case 'sitUp': 
      return isM ? (v >= 110 ? 100 : v >= 88 ? 80 : v >= 77 ? 70 : v >= 66 ? 60 : 40) 
                 : (v >= 90 ? 100 : v >= 72 ? 80 : v >= 63 ? 70 : v >= 54 ? 60 : 40);
    case 'pushUp': 
      return isM ? (v >= 75 ? 100 : v >= 60 ? 80 : v >= 53 ? 70 : v >= 45 ? 60 : 40) 
                 : (v >= 50 ? 100 : v >= 40 ? 80 : v >= 35 ? 70 : v >= 30 ? 60 : 40);
    case 'shuttleRun': // Inverse (Makin Kecil Makin Baik)
      return isM ? (v <= 5.0 ? 100 : v <= 6.0 ? 80 : v <= 6.5 ? 70 : v <= 7.0 ? 60 : 40) 
                 : (v <= 6.0 ? 100 : v <= 7.2 ? 80 : v <= 7.8 ? 70 : v <= 8.4 ? 60 : 40);
    case 'sprint20': // Inverse (Makin Kecil Makin Baik)
      return isM ? (v <= 2.75 ? 100 : v <= 3.30 ? 80 : v <= 3.58 ? 70 : v <= 3.85 ? 60 : 40) 
                 : (v <= 3.20 ? 100 : v <= 3.84 ? 80 : v <= 4.16 ? 70 : v <= 4.48 ? 60 : 40);
    case 'beep': 
      return isM ? (v >= 55 ? 100 : v >= 47 ? 80 : v >= 41 ? 70 : v >= 36 ? 60 : 40) 
                 : (v >= 50 ? 100 : v >= 43 ? 80 : v >= 38 ? 70 : v >= 33 ? 60 : 40);
    default: return 0;
  }
};

// --- FUNGSI TARGET PLACEHOLDER ---
const getTargetPlaceholder = (test, gender) => {
  const isM = gender === 'Putra';
  switch(test) {
    case 'sitReach': return isM ? '≥ 30.6' : '≥ 32.1';
    case 'verticalJump': return isM ? '≥ 80' : '≥ 65';
    case 'pullUp': return isM ? '≥ 33' : '≥ 21';
    case 'sitUp': return isM ? '≥ 110' : '≥ 90';
    case 'pushUp': return isM ? '≥ 75' : '≥ 50';
    case 'shuttleRun': return isM ? '≤ 5.00' : '≤ 6.00';
    case 'sprint20': return isM ? '≤ 2.75' : '≤ 3.20';
    case 'beep': return isM ? '≥ 55' : '≥ 50';
    default: return '';
  }
};

// --- KOMPONEN RADAR CHART ---
const RadarChart = ({ data, labels, isBlanko }) => {
  const size = 320; const center = size / 2; const radius = 100;
  const angleStep = (Math.PI * 2) / labels.length;

  const getCoordinates = (val, i) => {
    const r = (val / 100) * radius;
    const a = i * angleStep - Math.PI / 2;
    return { x: center + r * Math.cos(a), y: center + r * Math.sin(a) };
  };

  const dataPoints = data.map((val, i) => getCoordinates(val, i));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {[20, 40, 60, 80, 100].map(level => {
        const pts = labels.map((_, i) => getCoordinates(level, i));
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return <path key={level} d={path} fill="none" stroke={level === 100 ? '#f97316' : '#334155'} strokeWidth={level === 100 ? 2 : 1} strokeDasharray={level < 100 ? "4 4" : "none"} />
      })}
      
      {labels.map((label, i) => {
        const pOuter = getCoordinates(125, i);
        const pEdge = getCoordinates(100, i);
        return (
          <g key={i}>
            <line x1={center} y1={center} x2={pEdge.x} y2={pEdge.y} stroke="#334155" strokeWidth="1" />
            <text x={pOuter.x} y={pOuter.y} textAnchor="middle" dominantBaseline="middle" className="text-[9px] font-black fill-slate-400 uppercase">{label}</text>
          </g>
        );
      })}

      {!isBlanko && (
        <>
          <path d={dataPath} fill="rgba(249, 115, 22, 0.3)" stroke="#f97316" strokeWidth="3" strokeLinejoin="round" />
          {dataPoints.map((p, i) => ( <circle key={i} cx={p.x} cy={p.y} r="4" fill="#ea580c" /> ))}
        </>
      )}
    </svg>
  );
};

export default function App() {
  const [identity, setIdentity] = useState({ name: '', origin: '', dob: '', gender: 'Putra' });
  const [anthro, setAnthro] = useState({ weight: '', height: '', armSpan: '', sitHeight: '' });
  
  const [tests, setTests] = useState({ 
    sitReach: '', verticalJump: '', pullUp: '', sitUp: '', pushUp: '', shuttleRun: '', sprint20: '', beepLevel: '', beepShuttle: '' 
  });
  const [isExporting, setIsExporting] = useState(false);

  const age = useMemo(() => {
    if (!identity.dob) return '-';
    const birthDate = new Date(identity.dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) calculatedAge--;
    return calculatedAge;
  }, [identity.dob]);

  const bmiData = useMemo(() => {
    if (!anthro.weight || !anthro.height || anthro.height <= 0) return { bmi: '-', status: '-', color: 'text-slate-500' };
    const hM = anthro.height / 100;
    const bmiValue = (anthro.weight / (hM * hM));
    const bmi = bmiValue.toFixed(1);
    let status = 'Kurus'; let color = 'text-amber-500';
    if (bmi >= 18.5 && bmi <= 24.9) { status = 'Ideal'; color = 'text-orange-500'; }
    else if (bmi >= 25 && bmi <= 29.9) { status = 'Gemuk'; color = 'text-red-500'; }
    else if (bmi >= 30) { status = 'Obesitas'; color = 'text-rose-600'; }
    return { bmi, status, color };
  }, [anthro.weight, anthro.height]);

  // --- MESIN PENGHITUNG APE INDEX & RASIO TUNGKAI ---
  const proportionData = useMemo(() => {
    const h = parseFloat(anthro.height);
    const arm = parseFloat(anthro.armSpan);
    const sit = parseFloat(anthro.sitHeight);

    let apeIndex = { value: 0, text: '-', color: 'text-slate-500', desc: 'Isi Tinggi & Lengan' };
    let legRatio = { value: 0, text: '-', color: 'text-slate-500', desc: 'Isi Tinggi Duduk' };

    if (h > 0 && arm > 0) {
      const ratio = arm / h;
      if (ratio > 1.04) apeIndex = { value: ratio.toFixed(2), text: 'God-Tier', color: 'text-orange-500', desc: 'Jangkauan Poin Mustahil' };
      else if (ratio > 1.02) apeIndex = { value: ratio.toFixed(2), text: 'Superior', color: 'text-amber-500', desc: 'Keuntungan Reach Ekstra' };
      else if (ratio >= 1.0) apeIndex = { value: ratio.toFixed(2), text: 'Ideal', color: 'text-slate-400', desc: 'Proporsi Standar Pemanjat' };
      else apeIndex = { value: ratio.toFixed(2), text: 'Standar', color: 'text-rose-500', desc: 'Jangkauan Terbatas' };
    }

    if (h > 0 && sit > 0 && sit < h) {
      const legLength = h - sit;
      const legPercentage = (legLength / h) * 100;
      if (legPercentage >= 50) legRatio = { value: legPercentage.toFixed(1) + '%', text: 'Tungkai Panjang', color: 'text-orange-500', desc: 'Memudahkan High-Step' };
      else if (legPercentage >= 47) legRatio = { value: legPercentage.toFixed(1) + '%', text: 'Tungkai Ideal', color: 'text-slate-400', desc: 'Keseimbangan Statis Baik' };
      else legRatio = { value: legPercentage.toFixed(1) + '%', text: 'Tungkai Pendek', color: 'text-rose-500', desc: 'CG Dekat ke Dinding' };
    }

    return { apeIndex, legRatio };
  }, [anthro.height, anthro.armSpan, anthro.sitHeight]);

  // --- MESIN PENGHITUNG VO2MAX OTOMATIS (BEEP TEST) ---
  const calculatedVO2Max = useMemo(() => {
    const l = parseInt(tests.beepLevel);
    const s = parseInt(tests.beepShuttle);
    if (!l || !s || l < 1 || s < 1) return ''; 
    const vo2max = 3.46 * (l + s / (l * 0.4325 + 7.0048)) + 12.2;
    return parseFloat(vo2max.toFixed(2));
  }, [tests.beepLevel, tests.beepShuttle]);

  const scores = useMemo(() => ({
    sitReach: getScoreClimbing('sitReach', identity.gender, tests.sitReach),
    verticalJump: getScoreClimbing('verticalJump', identity.gender, tests.verticalJump),
    pullUp: getScoreClimbing('pullUp', identity.gender, tests.pullUp),
    sitUp: getScoreClimbing('sitUp', identity.gender, tests.sitUp),
    pushUp: getScoreClimbing('pushUp', identity.gender, tests.pushUp),
    shuttleRun: getScoreClimbing('shuttleRun', identity.gender, tests.shuttleRun),
    sprint20: getScoreClimbing('sprint20', identity.gender, tests.sprint20),
    beep: getScoreClimbing('beep', identity.gender, calculatedVO2Max),
  }), [tests, identity.gender, calculatedVO2Max]);

  const activeLabels = ['Flexibility', 'Vert Jump', 'Pull Up', 'Sit Up', 'Push Up', 'Shuttle Run', 'Sprint 20m', 'VO2 Max'];
  
  const averageScore = useMemo(() => {
    const vals = Object.values(scores);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [scores]);

  const isBlanko = !identity.name && averageScore === 0;

  const handleReset = () => { if (window.confirm("Hapus semua data isian?")) window.location.reload(); };

  const handleDownloadImage = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    try {
      const element = document.getElementById('report-container');
      const dataUrl = await htmlToImage.toPng(element, { quality: 1.0, backgroundColor: "#0f172a", pixelRatio: 2 });
      const safeName = identity?.name ? identity.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'atlet';
      const link = document.createElement("a");
      link.download = `Rapor_Climbing_Elite_${safeName}.png`;
      link.href = dataUrl; link.click();
    } catch (error) { console.error(error); alert("Gagal membuat gambar."); } finally { setIsExporting(false); }
  };

  const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 font-bold text-white focus:outline-none focus:border-orange-500 transition-all";
  const testInputClass = "w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 font-black text-white focus:outline-none focus:border-orange-500 transition-all pr-24 placeholder:text-[11px] placeholder:font-bold placeholder:text-slate-600 text-right";

  return (
    <div id="report-container" className="min-h-screen bg-[#0f172a] flex flex-col items-center py-10 px-4 font-sans text-slate-300 print:bg-[#0f172a]">
      
      {isExporting && (
        <style dangerouslySetInnerHTML={{__html: `
          #report-container input, #report-container select { appearance: none !important; -webkit-appearance: none; padding-bottom: 8px !important; color: white !important; }
          #report-container input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none !important; margin: 0 !important; }
        `}} />
      )}

      {/* HEADER: CLIMBING VERTICAL LIMIT THEME */}
      <header className="bg-slate-900 text-white p-8 shadow-2xl relative overflow-hidden w-full max-w-7xl rounded-[2.5rem] border-b-8 border-orange-600">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500 blur-[100px] rounded-full"></div>
        </div>
        
        <div className="mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-block bg-orange-600 text-white font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-4 shadow-lg">
              PERMENPORA 15 / 2024
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight italic uppercase">
              KALKULATOR FISIK <span className="text-orange-500"> PANJAT TEBING</span>
            </h1>
          </div>
          <div className="text-left md:text-right w-full md:w-auto">
            {!isExporting && (
              <div className="no-print flex flex-wrap items-center justify-start md:justify-end gap-3 mb-4">
                <button onClick={handleReset} className="bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-bold tracking-wider border border-white/10">
                  <IconReset /> <span>Reset</span>
                </button>
                <button onClick={handleDownloadImage} disabled={isExporting} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-black tracking-wider shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                  <IconDownload /> {isExporting ? 'Processing...' : 'Export PNG'}
                </button>
              </div>
            )}
            <div className="mt-2">
                <p className="font-black text-orange-500/80 text-[11px] tracking-[0.3em] uppercase">
                  Platform Olahraga <span className="text-white">by fiqhipondaa9</span>
                </p>
            </div>
          </div>
        </div>
      </header>

      <main className={`${isExporting ? 'w-[1200px]' : 'max-w-7xl w-full'} mx-auto mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8`}>
        
        {/* LEFT COLUMN: BIOMETRICS */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="bg-slate-900/50 rounded-[2.5rem] p-8 shadow-sm border border-slate-800 relative overflow-hidden backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-5 relative z-10">
              <div className="bg-orange-600 text-white p-3 rounded-2xl shadow-lg"><IconUser /></div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Identitas & Antropometri</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
              <div className="space-y-1"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Pemanjat</label><input type="text" value={identity.name} onChange={e => setIdentity({...identity, name: e.target.value})} className={inputClass} placeholder="Nama lengkap..." /></div>
              <div className="space-y-1"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Provinsi / Klub</label><input type="text" value={identity.origin} onChange={e => setIdentity({...identity, origin: e.target.value})} className={inputClass} placeholder="Asal instansi..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tgl Lahir</label><input type="date" value={identity.dob} onChange={e => setIdentity({...identity, dob: e.target.value})} className={`${inputClass} text-sm`} /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Age Index</label><div className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 font-black text-white text-center">{age !== '-' ? `${age} Thn` : '\u00A0'}</div></div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kategori Gender</label>
                <select value={identity.gender} onChange={e => setIdentity({...identity, gender: e.target.value})} className={`${inputClass} cursor-pointer`}>
                  <option value="Putra">Putra (Male)</option><option value="Putri">Putri (Female)</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              {[{label: 'Tinggi (cm)', id: 'height'}, {label: 'Berat (kg)', id: 'weight'}, {label: 'Arm Span', id: 'armSpan'}, {label: 'Sit Height', id: 'sitHeight'}].map(item => (
                 <div key={item.id} className="space-y-1">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</label>
                   <input type="number" value={anthro[item.id]} onChange={e => setAnthro({...anthro, [item.id]: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-3 font-black text-center focus:border-orange-500 outline-none text-white" placeholder="0" />
                 </div>
              ))}
            </div>
            
            <div className="mt-4 flex items-center justify-between bg-slate-900 text-white rounded-[2rem] p-6 shadow-xl border-l-8 border-orange-500 relative z-10">
               <div className="flex items-center gap-4"><IconScale /> <span className="font-black text-xs tracking-[0.2em] uppercase text-slate-500">Body Mass Index</span></div>
               <div className="flex items-center gap-5">
                 <span className="text-4xl font-black italic">{bmiData.bmi}</span>
                 {bmiData.status !== '-' && <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-800 shadow-inner ${bmiData.color}`}>{bmiData.status}</span>}
               </div>
            </div>

            {/* KOTAK APE INDEX & RASIO TUNGKAI */}
            {(anthro.height > 0 && (anthro.armSpan > 0 || anthro.sitHeight > 0)) && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 animate-in fade-in">
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-5 flex flex-col justify-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
                   <div className="flex justify-between items-start mb-2 pl-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Ape Index</span>
                      <span className={`text-[9px] bg-slate-800 border border-slate-700 px-2 py-1 rounded-lg font-black uppercase tracking-widest ${proportionData.apeIndex.color}`}>{proportionData.apeIndex.text}</span>
                   </div>
                   <div className="flex items-end gap-2 pl-2 mt-1">
                      <span className="text-3xl font-black text-white leading-none italic">{proportionData.apeIndex.value}</span>
                   </div>
                   <p className="text-[10px] font-bold text-slate-500 mt-2 pl-2 uppercase tracking-widest">{proportionData.apeIndex.desc}</p>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-5 flex flex-col justify-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-600"></div>
                   <div className="flex justify-between items-start mb-2 pl-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Rasio Tungkai</span>
                      <span className={`text-[9px] bg-slate-800 border border-slate-700 px-2 py-1 rounded-lg font-black uppercase tracking-widest ${proportionData.legRatio.color}`}>{proportionData.legRatio.text}</span>
                   </div>
                   <div className="flex items-end gap-2 pl-2 mt-1">
                      <span className="text-3xl font-black text-white leading-none italic">{proportionData.legRatio.value}</span>
                   </div>
                   <p className="text-[10px] font-bold text-slate-500 mt-2 pl-2 uppercase tracking-widest">{proportionData.legRatio.desc}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 rounded-[2.5rem] p-8 shadow-sm border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-5">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl"><IconMountain /></div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Rekam Hasil Tes Fisik</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
               {[
                 { id: 'sitReach', label: 'Sit & Reach Flexibility', unit: 'CM' },
                 { id: 'verticalJump', label: 'Vertical Jump (Dyno)', unit: 'CM' },
                 { id: 'pullUp', label: 'Pull Up (1 Menit)', unit: 'REPS' },
                 { id: 'sitUp', label: 'Sit Up (2 Menit)', unit: 'REPS' },
                 { id: 'pushUp', label: 'Push Up (1 Menit)', unit: 'REPS' },
                 { id: 'shuttleRun', label: 'Shuttle Run Test', unit: 'DETIK' },
                 { id: 'sprint20', label: 'Sprint 20m (Speed)', unit: 'DETIK' },
               ].map(item => (
                 <div key={item.id} className="flex flex-col">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">{item.label}</label>
                   <div className="relative">
                     <input type="number" step="0.01" value={tests[item.id]} onChange={e => setTests({...tests, [item.id]: e.target.value})} className={testInputClass} placeholder={getTargetPlaceholder(item.id, identity.gender)} />
                     <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.unit}</span>
                   </div>
                 </div>
               ))}

               {/* BEEP TEST AUTO CONVERTER */}
               <div className="sm:col-span-2 bg-slate-900 p-6 rounded-[2rem] border border-slate-800 mt-2 shadow-inner">
                 <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                     Beep Test Aerobic Base
                   </label>
                   <div className="flex flex-wrap items-center gap-2">
                     {calculatedVO2Max !== '' && (
                       <span className="bg-orange-600 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-sm animate-in fade-in slide-in-from-right-2 flex items-center gap-2">
                         VO2Max: {calculatedVO2Max} <span className="text-[10px] opacity-70">ML/KG/MIN</span>
                       </span>
                     )}
                     <span className="bg-slate-800 text-orange-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                       Target Emas: {getTargetPlaceholder('beep', identity.gender)}
                     </span>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="relative">
                       <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600 uppercase tracking-widest">Level</span>
                       <input type="number" value={tests.beepLevel} onChange={e => setTests({...tests, beepLevel: e.target.value})} className={`${testInputClass} pl-16 pr-6`} placeholder="0" />
                    </div>
                    <div className="relative">
                       <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600 uppercase tracking-widest">Balikan</span>
                       <input type="number" value={tests.beepShuttle} onChange={e => setTests({...tests, beepShuttle: e.target.value})} className={`${testInputClass} pl-20 pr-6`} placeholder="0" />
                    </div>
                 </div>
               </div>
            </div>
            <p className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest leading-relaxed">
              *Penghitungan skor mengacu pada tabel norma elit.<br/>Waktu Shuttle Run dan Sprint otomatis dikalkulasi berdasarkan reduksi waktu (Inverse Logic).
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: ANALYTICS */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          <div className={`rounded-[3rem] p-10 shadow-2xl text-center relative overflow-hidden transition-all duration-700 border-b-[12px] ${averageScore > 80 ? 'bg-slate-900 text-white border-orange-600' : averageScore < 60 && averageScore > 0 ? 'bg-red-900 text-white border-red-500' : 'bg-slate-900/50 border border-slate-800'}`}>
            <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-3 ${averageScore > 80 || (averageScore < 60 && averageScore > 0) ? 'text-orange-400/60' : 'text-slate-500'}`}>Climbing Performance Score</h3>
            <div className="text-[100px] font-black tracking-tighter mb-4 italic leading-none text-white">{isBlanko ? '-' : averageScore || 0}</div>
            
            <div className={`inline-flex items-center justify-center gap-3 px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-inner border ${averageScore > 80 ? 'bg-orange-600/20 text-orange-400 border-orange-500/30' : averageScore < 60 && averageScore > 0 ? 'bg-red-800/50 text-red-100 border-red-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
               {averageScore > 80 ? 'ELITE PRO CLIMBER' : averageScore < 60 && averageScore > 0 ? 'NEEDS SPECIFIC DRILL' : averageScore > 0 ? 'QUALIFIED ATHLETE' : isBlanko ? 'BLANKO RECORDING' : 'WAITING FOR DATA'}
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-[3rem] p-8 shadow-sm border border-slate-800 flex-1 flex flex-col items-center backdrop-blur-xl">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] text-center mb-8 italic">Biokinetic Radar Analysis</h3>
             <div className="flex-1 w-full flex items-center justify-center min-h-[300px] bg-slate-900/50 rounded-[2.5rem] p-6 border border-slate-800">
               <RadarChart data={Object.values(scores)} labels={activeLabels} isBlanko={isBlanko} />
             </div>
             <p className="text-[10px] font-black text-slate-500 text-center mt-6 uppercase tracking-[0.2em]">Orange Polygon = Actual Capacity • Gray Line = Elite Standard</p>
          </div>

          <div className="bg-slate-900/50 rounded-[3rem] p-10 shadow-sm border border-slate-800 relative overflow-hidden backdrop-blur-xl">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Point Distribution (0-100)</h3>
            <div className="space-y-4">
              {activeLabels.map((label, idx) => {
                const val = Object.values(scores)[idx];
                return (
                  <div key={idx} className="flex items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase w-28 tracking-tighter">{label}</span>
                    {isBlanko ? (
                      <div className="flex-1 border-b-2 border-dotted border-slate-800 mx-4"></div>
                    ) : (
                      <div className="flex-1 flex justify-end items-center gap-4 ml-2">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${val >= 80 ? 'bg-orange-500' : val >= 60 ? 'bg-slate-400' : 'bg-red-600'}`} style={{ width: `${val}%` }}></div>
                        </div>
                        <span className={`text-xs font-black w-8 text-right ${val >= 80 ? 'text-orange-500' : 'text-slate-400'}`}>{val}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
               <span className="text-[10px] font-black text-slate-700 tracking-[0.4em] uppercase">by fiqhipondaa9</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}