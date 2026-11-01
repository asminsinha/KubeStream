import React from 'react';
import { 
  Activity, Play, CheckCircle2, AlertTriangle, ShieldCheck, 
  HelpCircle, Sparkles, Server, Zap, Globe, Layers, Video, 
  Sliders, Cpu, DollarSign, BookOpen, FlaskConical, FileText, ArrowRight
} from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  simState,
  isDemoRunning,
  startDemo,
  stopDemo,
  demoStage,
  demoStageTitle,
  expertMode,
  setExpertMode
}) {
  const isHealthy = simState?.sla?.status === 'SATISFIED' && !simState?.failures?.failedRegion;
  const topologyName = simState?.topologyName || 'Auto-Scaled SFU Cluster';

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'orchestrator', label: 'Edge Orchestrator', icon: Globe },
    { id: 'video', label: 'Live Video & WebRTC', icon: Video },
    { id: 'infrastructure', label: 'Infrastructure & Capacity', icon: Server },
    { id: 'chaos', label: 'Chaos & Resilience', icon: Sliders },
    { id: 'xai', label: 'XAI Decision Center', icon: Cpu },
    { id: 'finops', label: 'FinOps & Cost', icon: DollarSign },
    { id: 'architecture', label: 'Architecture & AWS', icon: Layers },
    { id: 'experiments', label: 'A/B Experiments', icon: FlaskConical },
    { id: 'logs', label: 'System Logs', icon: FileText },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-40 backdrop-blur-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold shadow-lg shadow-cyan-950/40">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-wider text-slate-100">KUBESTREAM</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/50 text-cyan-300">
                CONTROL PLANE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Intelligent Scalable Web Infrastructure for Real-Time Video & Interactive Events
            </p>
          </div>
        </div>

        {/* Live System State Badges */}
        <div className="flex items-center gap-3">
          {/* Health Pill */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border ${
            isHealthy 
              ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300' 
              : 'bg-rose-950/70 border-rose-800 text-rose-300 animate-pulse'
          }`}>
            {isHealthy ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            <span>{isHealthy ? 'SYSTEM HEALTHY' : 'SLA COMPROMISED'}</span>
          </div>

          {/* Active Topology Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-slate-500">Topology:</span>
            <span className="text-cyan-300 font-bold">{simState?.topology || 'CENTRAL_SFU'}</span>
          </div>

          {/* Expert Mode Toggle */}
          <button
            onClick={() => setExpertMode(!expertMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              expertMode 
                ? 'bg-indigo-950/80 border-indigo-700 text-indigo-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle between simplified executive explanations and deep RFC/system-level analysis"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{expertMode ? 'Expert SRE Mode' : 'Beginner Mode'}</span>
          </button>

          {/* Run Live Demo Button */}
          {isDemoRunning ? (
            <div className="flex items-center gap-2 bg-amber-950/80 border border-amber-600 px-3 py-1 rounded text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold text-amber-300">DEMO STAGE {demoStage}/10:</span>
              <span className="text-slate-200 max-w-[140px] truncate">{demoStageTitle}</span>
              <button
                onClick={stopDemo}
                className="ml-1 text-[10px] bg-amber-900/80 hover:bg-amber-800 text-white px-1.5 py-0.5 rounded font-bold"
              >
                STOP
              </button>
            </div>
          ) : (
            <button
              onClick={startDemo}
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs px-3.5 py-1.5 rounded shadow-lg shadow-cyan-950/50 border border-cyan-400/30 transition-all transform hover:scale-[1.02]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>RUN LIVE DEMO</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-1 border-t border-slate-900/80 pt-1 pb-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-800/90 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
