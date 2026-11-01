import React from 'react';
import { 
  Sliders, AlertTriangle, ShieldAlert, Zap, Skull, 
  RotateCcw, CheckCircle2, Flame, Layers, Filter 
} from 'lucide-react';
import { CHAOS_PRESETS } from '../services/simulationEngine.js';

export default function ChaosResilienceLab({
  simState,
  applyInputs,
  expertMode
}) {
  const currentChaos = simState?.chaos || CHAOS_PRESETS['stable'];
  const failures = simState?.failures || {};
  const tokenBucket = simState?.tokenBucket || {
    incomingRate: 150,
    allowed: 150,
    queued: 0,
    rejected: 0,
    avgWaitMs: 12,
    remainingTokens: 2500,
    bucketCapacity: 2500
  };

  const handleApplyPreset = (presetKey) => {
    const preset = CHAOS_PRESETS[presetKey];
    if (preset) {
      applyInputs({
        chaos: preset,
        failures: {
          failedRegion: preset.failedRegion,
          failedAz: preset.failedAz
        }
      });
    }
  };

  const handleReset = () => {
    applyInputs({
      chaos: CHAOS_PRESETS['stable'],
      failures: { failedRegion: null, failedAz: null }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-slate-100">
              CHAOS ENGINE & RESILIENCE SIMULATION LAB
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              FAULT INJECTION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Injects realistic correlated network degradation scenarios, physical cloud infrastructure outages, and virtual admission control surges.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESTORE NORMAL BASELINE</span>
        </button>
      </div>

      {/* Preset Chaos Scenario Selector (Prompt Items 33 & 34) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" /> Correlated Chaos Presets
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(CHAOS_PRESETS).map(([key, preset]) => {
            const isSelected = currentChaos.id === preset.id;
            return (
              <button
                key={key}
                onClick={() => handleApplyPreset(key)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-950/40'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-rose-300' : 'text-slate-200'}`}>
                    {preset.name}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Token-Bucket Virtual Queue Admission Control Simulator (Prompt Item 37) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-cyan-400" /> Token-Bucket Virtual Queue: Admission Control
            </h4>
            <p className="text-xs text-slate-400">
              Protects downstream Aurora PostgreSQL and DynamoDB from write amplification and connection exhaustion during mass interactive poll storms.
            </p>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            RATE LIMITER
          </span>
        </div>

        {/* Token-Bucket KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Incoming Requests</span>
            <span className="text-lg font-bold text-slate-200">{tokenBucket.incomingRate} / sec</span>
            <span className="text-[10px] text-slate-500 block mt-1">Live polls + join auth</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Allowed to Downstream DB</span>
            <span className="text-lg font-bold text-emerald-400">{tokenBucket.allowed} / sec</span>
            <span className="text-[10px] text-slate-500 block mt-1">Protected write budget</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Queued in Memory Buffer</span>
            <span className={`text-lg font-bold ${tokenBucket.queued > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
              {tokenBucket.queued} req
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Avg wait: {tokenBucket.avgWaitMs} ms</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Tokens Available</span>
            <span className="text-lg font-bold text-cyan-300">
              {tokenBucket.remainingTokens} / {tokenBucket.bucketCapacity}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Refill: 1,200 tokens/sec</span>
          </div>
        </div>

        {/* Visual Token Tank Fill Level */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Bucket Fill Level (Burst Buffer Headroom)</span>
            <span>{((tokenBucket.remainingTokens / tokenBucket.bucketCapacity) * 100).toFixed(0)}% available</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                tokenBucket.remainingTokens < 400 ? 'bg-rose-500' : (tokenBucket.remainingTokens < 1200 ? 'bg-amber-400' : 'bg-cyan-400')
              }`}
              style={{ width: `${(tokenBucket.remainingTokens / tokenBucket.bucketCapacity) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Manual Fault Injection Triggers (Prompt Item 35) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Skull className="w-4 h-4 text-rose-400" /> Manual Fault Injection Triggers
        </h4>
        <p className="text-xs text-slate-400">
          Simulate instantaneous infrastructure failures to observe traffic redistribution, failover latency, and automated recovery.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Kill AZ-A */}
          <button
            onClick={() => {
              const newAz = failures.failedAz === 'ap-south-1a' ? null : 'ap-south-1a';
              applyInputs({ failures: { ...failures, failedAz: newAz } });
            }}
            className={`p-3 rounded-lg border text-xs font-bold font-mono transition-colors text-left flex items-center justify-between ${
              failures.failedAz === 'ap-south-1a'
                ? 'bg-rose-950 border-rose-600 text-rose-300'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div>
              <span>KILL AZ-A (ap-south-1a)</span>
              <span className="text-[10px] text-slate-500 block font-normal mt-0.5">
                {failures.failedAz === 'ap-south-1a' ? 'AZ-A is DEAD. Draining...' : 'Click to trigger outage'}
              </span>
            </div>
            <AlertTriangle className={`w-4 h-4 ${failures.failedAz === 'ap-south-1a' ? 'text-rose-400' : 'text-slate-600'}`} />
          </button>

          {/* Kill Region Mumbai */}
          <button
            onClick={() => {
              const newReg = failures.failedRegion === 'ap-south-1' ? null : 'ap-south-1';
              applyInputs({ failures: { ...failures, failedRegion: newReg } });
            }}
            className={`p-3 rounded-lg border text-xs font-bold font-mono transition-colors text-left flex items-center justify-between ${
              failures.failedRegion === 'ap-south-1'
                ? 'bg-rose-950 border-rose-600 text-rose-300'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div>
              <span>KILL REGION (ap-south-1)</span>
              <span className="text-[10px] text-slate-500 block font-normal mt-0.5">
                {failures.failedRegion === 'ap-south-1' ? 'MUMBAI OFFLINE' : 'Click to cut undersea cable'}
              </span>
            </div>
            <Skull className={`w-4 h-4 ${failures.failedRegion === 'ap-south-1' ? 'text-rose-400' : 'text-slate-600'}`} />
          </button>

          {/* Simulate Heavy Cellular Deadzone */}
          <button
            onClick={() => handleApplyPreset('deadzone')}
            className="p-3 rounded-lg border bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold font-mono transition-colors text-left flex items-center justify-between"
          >
            <div>
              <span>INJECT BASEMENT DEADZONE</span>
              <span className="text-[10px] text-slate-500 block font-normal mt-0.5">
                Forces 22% loss, 85ms jitter
              </span>
            </div>
            <Flame className="w-4 h-4 text-amber-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
