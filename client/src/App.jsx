import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Header from './components/Header.jsx';
import LiveDemoController, { DEMO_STAGES } from './components/LiveDemoController.jsx';
import OverviewDashboard from './components/OverviewDashboard.jsx';
import GlobalEdgeOrchestrator from './components/GlobalEdgeOrchestrator.jsx';
import LiveVideoLab from './components/LiveVideoLab.jsx';
import InfrastructureLab from './components/InfrastructureLab.jsx';
import ChaosResilienceLab from './components/ChaosResilienceLab.jsx';
import XaiDecisionCenter from './components/XaiDecisionCenter.jsx';
import FinOpsCenter from './components/FinOpsCenter.jsx';
import ArchitectureGuide from './components/ArchitectureGuide.jsx';
import ExperimentLab from './components/ExperimentLab.jsx';
import SystemAuditLog from './components/SystemAuditLog.jsx';

import { 
  stepSimulationState, 
  PRESET_CLIENT_CITIES, 
  CHAOS_PRESETS 
} from './services/simulationEngine.js';

let socket = null;
try {
  socket = io('http://localhost:4000', {
    reconnectionAttempts: 5,
    timeout: 2000
  });
} catch (e) {
  console.warn('[Socket.IO] Offline mode active');
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expertMode, setExpertMode] = useState(false);

  // Digital Twin Simulation State (initialized with clean state)
  const [simState, setSimState] = useState(() => stepSimulationState(null, {
    attendees: 1200,
    publishers: 6,
    spectators: 1194,
    clientLocation: PRESET_CLIENT_CITIES[0],
    chaos: CHAOS_PRESETS['stable']
  }));

  // Real WebRTC telemetry
  const [realStats, setRealStats] = useState({
    realRtt: 18,
    realJitter: 2,
    realPacketsLost: 0,
    realFps: 30,
    realBitrateKbps: 1850,
    provenance: 'REAL — Browser WebRTC getStats()'
  });

  // Telemetry chart history (bounded to last 25 points)
  const [chartHistory, setChartHistory] = useState([]);

  // Audit event log
  const [events, setEvents] = useState([]);

  // Demo walkthrough state
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);

  // Synchronize inputs with simulation engine and server
  const applyInputs = (newInputs) => {
    setSimState((prev) => {
      const next = stepSimulationState(prev, newInputs);
      return next;
    });

    if (socket && socket.connected) {
      socket.emit('update_input', newInputs);
    }
  };

  // Socket.IO event handler
  useEffect(() => {
    if (!socket) return;

    socket.on('state_update', (incoming) => {
      if (incoming) {
        setSimState(incoming);
      }
    });

    return () => {
      socket.off('state_update');
    };
  }, []);

  // 1-second local discrete simulation tick loop
  useEffect(() => {
    const timer = setInterval(() => {
      setSimState((prev) => {
        const next = stepSimulationState(prev);

        // Append to chart history (bounded to last 25 items)
        setChartHistory((hist) => [
          ...hist.slice(-24),
          {
            time: new Date().toLocaleTimeString().slice(3, 8),
            rtt: next?.telemetry?.rtt || 25,
            cost: parseFloat(next?.financials?.totalHourlyCost || '0.00'),
            workers: next?.activeWorkers || 2
          }
        ]);

        // Append to decision events if meaningful action occurred
        if (next?.lastDecisionEvent) {
          setEvents((prevEvents) => {
            const last = prevEvents[0];
            if (!last || last.type !== next.lastDecisionEvent.type || last.reason !== next.lastDecisionEvent.reason) {
              return [next.lastDecisionEvent, ...prevEvents.slice(0, 49)];
            }
            return prevEvents;
          });
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Demo controls
  const startDemo = () => {
    setIsDemoRunning(true);
    setCurrentStage(1);
    setActiveTab('overview');
  };

  const stopDemo = () => {
    setIsDemoRunning(false);
    setCurrentStage(1);
  };

  const currentStageTitle = DEMO_STAGES[currentStage - 1]?.title || 'Demo';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        simState={simState}
        isDemoRunning={isDemoRunning}
        startDemo={startDemo}
        stopDemo={stopDemo}
        demoStage={currentStage}
        demoStageTitle={currentStageTitle}
        expertMode={expertMode}
        setExpertMode={setExpertMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <OverviewDashboard
            simState={simState}
            applyInputs={applyInputs}
            chartHistory={chartHistory}
            expertMode={expertMode}
          />
        )}

        {activeTab === 'orchestrator' && (
          <GlobalEdgeOrchestrator
            simState={simState}
            applyInputs={applyInputs}
            expertMode={expertMode}
          />
        )}

        {activeTab === 'video' && (
          <LiveVideoLab
            simState={simState}
            realStats={realStats}
            setRealStats={setRealStats}
            expertMode={expertMode}
          />
        )}

        {activeTab === 'infrastructure' && (
          <InfrastructureLab
            simState={simState}
            applyInputs={applyInputs}
            expertMode={expertMode}
          />
        )}

        {activeTab === 'chaos' && (
          <ChaosResilienceLab
            simState={simState}
            applyInputs={applyInputs}
            expertMode={expertMode}
          />
        )}

        {activeTab === 'xai' && (
          <XaiDecisionCenter
            simState={simState}
            expertMode={expertMode}
          />
        )}

        {activeTab === 'finops' && (
          <FinOpsCenter
            simState={simState}
            applyInputs={applyInputs}
            expertMode={expertMode}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureGuide
            simState={simState}
            expertMode={expertMode}
          />
        )}

        {activeTab === 'experiments' && (
          <ExperimentLab
            simState={simState}
            applyInputs={applyInputs}
            expertMode={expertMode}
          />
        )}

        {activeTab === 'logs' && (
          <SystemAuditLog
            events={events}
            expertMode={expertMode}
          />
        )}
      </main>

      {/* Floating Interactive Live Demo Controller */}
      <LiveDemoController
        isDemoRunning={isDemoRunning}
        currentStage={currentStage}
        setCurrentStage={setCurrentStage}
        stopDemo={stopDemo}
        applyInputs={applyInputs}
      />

      {/* Footer: Honest Simulation Boundary & Attribution (Prompt Item 84) */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-emerald-400 font-bold">[REAL] WebRTC getStats()</span>
            <span>•</span>
            <span className="text-cyan-400 font-bold">[SIMULATED] AWS EKS SFU & CloudFront CDN</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">[MODELLED] Algorithmic FinOps</span>
            <span>•</span>
            <span className="text-indigo-400 font-bold">[PREDICTED] ITU-T P.1203 Random Forest ML</span>
          </div>
          <div>
            KubeStream Intelligent Real-Time Video Infrastructure Control Plane
          </div>
        </div>
      </footer>
    </div>
  );
}