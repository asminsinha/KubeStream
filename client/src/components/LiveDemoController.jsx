import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, RotateCcw, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { WORKLOAD_PRESETS, CHAOS_PRESETS, PRESET_CLIENT_CITIES } from '../services/simulationEngine.js';

export const DEMO_STAGES = [
  {
    stage: 1,
    title: 'Small Student Webinar (300 Attendees)',
    subtitle: 'Minimal Footprint, No Wasteful CDN',
    durationSec: 10,
    action: (applyInputs) => {
      applyInputs({
        attendees: 300,
        publishers: 3,
        audioOnly: 0,
        spectators: 297,
        joinRate: 5,
        leaveRate: 1,
        interactionRate: 20,
        clientLocation: PRESET_CLIENT_CITIES[0], // Mumbai
        chaos: CHAOS_PRESETS['stable'],
        failures: { failedRegion: null, failedAz: null }
      });
    },
    narrative: 'Demonstrates economic right-sizing: 300 users need only 1-2 SFU workers. The optimizer avoids spinning up unnecessary CDN edge distributions or heavy GPU transcoders, keeping hourly cost below $2.50/hr.',
    expectedMetric: 'SFU Workers: 2 | Topology: CENTRAL_SFU | Hourly Cost: ~$2.10'
  },
  {
    stage: 2,
    title: 'Interactive Team Growth (1,500 Attendees)',
    subtitle: 'Autonomous SFU Pod Scaling',
    durationSec: 10,
    action: (applyInputs) => {
      applyInputs({
        attendees: 1500,
        publishers: 12,
        audioOnly: 35,
        spectators: 1453,
        joinRate: 40,
        leaveRate: 5,
        interactionRate: 50,
        chaos: CHAOS_PRESETS['stable']
      });
    },
    narrative: 'As attendee and publisher count grows, SFU forwarding pressure rises. The capacity bottleneck engine calculates CPU and connection limits, scaling out SFU workers to absorb inbound streams without frame drops.',
    expectedMetric: 'SFU Workers: 4-5 | Egress: ~2.5 Gbps | P95 Latency: <60ms'
  },
  {
    stage: 3,
    title: 'Audience Explosion: National Summit (20,000 Spectators)',
    subtitle: 'Dynamic Architectural Shift: SFU -> Hybrid Broadcast',
    durationSec: 12,
    action: (applyInputs) => {
      applyInputs({
        attendees: 20000,
        publishers: 15,
        audioOnly: 10,
        spectators: 19975,
        joinRate: 250,
        leaveRate: 20,
        interactionRate: 200,
        chaos: CHAOS_PRESETS['stable']
      });
    },
    narrative: 'A naive system would attempt 20,000 WebRTC SFU peer connections and collapse. KubeStream detects 99.8% passive spectators and automatically shifts topology to HYBRID_BROADCAST_CDN: ingest via SFU, transcode to LL-HLS, and offload 98.4% of traffic to CloudFront.',
    expectedMetric: 'Topology: HYBRID_BROADCAST_CDN | CloudFront CDN Offload: 98.4% | Savings: >60%'
  },
  {
    stage: 4,
    title: 'Regional Network Congestion (Mumbai Overload)',
    subtitle: 'Multi-Attribute Routing Optimization Reroute',
    durationSec: 10,
    action: (applyInputs) => {
      applyInputs({
        chaos: CHAOS_PRESETS['edge-overload']
      });
    },
    narrative: 'Local ISP peering and edge queue buffer in Mumbai spike to 95% congestion. The routing optimizer evaluates normalized multi-attribute scores (latency, capacity, congestion, reliability, cost) and shifts traffic to Frankfurt or Singapore.',
    expectedMetric: 'Routing: Candidate Score Evaluated | Alternate Edge Selected | QoE Preserved'
  },
  {
    stage: 5,
    title: 'Client Enters Dead Zone / Basement',
    subtitle: 'Real-Time ML QoE & Simulcast Downscale',
    durationSec: 10,
    action: (applyInputs) => {
      applyInputs({
        chaos: CHAOS_PRESETS['deadzone']
      });
    },
    narrative: 'Client transport degrades: packet loss reaches 22%, jitter 85ms, bandwidth drops to 350 kbps. The Random Forest model predicts imminent failure and downscales simulcast: 720p -> 180p -> AUDIO_ONLY priority to guarantee speech intelligibility.',
    expectedMetric: 'Simulcast: AUDIO_ONLY Priority | ML State: CRITICAL_DEADZONE | Video Suppressed'
  },
  {
    stage: 6,
    title: 'Predictive Join Storm (+10,000 Entering)',
    subtitle: 'Proactive Pre-Scaling Before Saturation',
    durationSec: 10,
    action: (applyInputs) => {
      applyInputs({
        attendees: 30000,
        joinRate: 500,
        leaveRate: 10,
        chaos: CHAOS_PRESETS['stable']
      });
    },
    narrative: 'A surge of 500 users/sec joins the room. The short-horizon predictor forecasts 45,000 attendees within 30 seconds. Rather than waiting for CPU saturation at 85%, KubeStream begins warming SFU workers early to prevent cold-start queuing.',
    expectedMetric: 'Autoscaler: PREDICTIVE_SCALING_UP | Lookahead: +45s | Zero Cold-Start Stall'
  },
  {
    stage: 7,
    title: 'Availability Zone Hardware Failure (ap-south-1a Crash)',
    subtitle: 'Multi-AZ Resilience & Automatic Traffic Drain',
    durationSec: 10,
    action: (applyInputs) => {
      applyInputs({
        failures: { failedAz: 'ap-south-1a' },
        chaos: CHAOS_PRESETS['az-failure']
      });
    },
    narrative: 'AZ-A experiences catastrophic hypervisor loss. The control plane immediately initiates graceful traffic drain, redistributing sessions across AZ-B and AZ-C while verifying remaining headroom.',
    expectedMetric: 'AZ-A: OFFLINE | AZ-B/C: Absorb Load | Zero Disconnected Attendees'
  },
  {
    stage: 8,
    title: 'Token-Bucket Virtual Queue: Poll Flood',
    subtitle: 'Dual-Pipeline Protection Against Database Amplification',
    durationSec: 10,
    action: (applyInputs) => {
      applyInputs({
        interactionRate: 900,
        chaos: CHAOS_PRESETS['db-storm']
      });
    },
    narrative: '10,000 users vote in a live poll simultaneously. Sending all requests directly to Aurora PostgreSQL would cause connection exhaustion. The Token-Bucket Virtual Queue admits 1,200 req/sec, queues the surplus, and decouples event traffic from the media plane.',
    expectedMetric: 'Token Bucket: 1,200 allowed/s | DB Protected | Media Plane Jitter: 0ms impact'
  },
  {
    stage: 9,
    title: 'Audience Leaves (Event Concludes)',
    subtitle: 'Hysteresis & Graceful Connection Draining',
    durationSec: 10,
    action: (applyInputs) => {
      applyInputs({
        attendees: 150,
        publishers: 2,
        spectators: 148,
        joinRate: 0,
        leaveRate: 120,
        interactionRate: 10,
        failures: { failedRegion: null, failedAz: null },
        chaos: CHAOS_PRESETS['stable']
      });
    },
    narrative: 'As attendees depart, the cluster avoids abrupt instance termination. Surplus SFU instances enter DRAINING state with a 30s cooldown hysteresis, allowing active WebRTC sessions to conclude cleanly before container deprovisioning.',
    expectedMetric: 'Autoscaler: SCALING_DOWN_DRAINING | Cooldown Active | Zero Abrupt Drops'
  },
  {
    stage: 10,
    title: 'Resource Consolidation & Final FinOps Audit',
    subtitle: 'Baseline vs KubeStream Verified Unit Economics',
    durationSec: 12,
    action: (applyInputs) => {
      applyInputs({
        attendees: 8,
        publishers: 8,
        spectators: 0,
        joinRate: 0,
        leaveRate: 0,
        interactionRate: 5,
        chaos: CHAOS_PRESETS['stable']
      });
    },
    narrative: 'Infrastructure safely consolidates back to warm baseline. Final FinOps audit verifies 58%-68% cloud cost reduction compared to naive static over-provisioning or non-CDN SFU architecture.',
    expectedMetric: 'Total Savings: >60% | Final Cost: ~$1.45/hr | SLA Availability: 99.99%'
  }
];

export default function LiveDemoController({
  isDemoRunning,
  currentStage,
  setCurrentStage,
  stopDemo,
  applyInputs
}) {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [isPaused, setIsPaused] = useState(false);

  const stageData = DEMO_STAGES[currentStage - 1] || DEMO_STAGES[0];

  useEffect(() => {
    if (!isDemoRunning) return;
    setSecondsLeft(stageData.durationSec);
    stageData.action(applyInputs);
  }, [currentStage, isDemoRunning]);

  useEffect(() => {
    if (!isDemoRunning || isPaused) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (currentStage < DEMO_STAGES.length) {
            setCurrentStage((s) => s + 1);
          } else {
            stopDemo();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isDemoRunning, currentStage, isPaused]);

  if (!isDemoRunning) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 bg-slate-900/95 border-2 border-cyan-500/80 rounded-xl shadow-2xl backdrop-blur-md p-4 text-slate-100 font-sans animate-in fade-in slide-in-from-bottom-5">
      {/* Top row */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            KUBESTREAM NARRATIVE WALKTHROUGH
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            title={isPaused ? 'Resume Demo' : 'Pause Demo'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              if (currentStage < DEMO_STAGES.length) setCurrentStage(currentStage + 1);
              else stopDemo();
            }}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            title="Skip to next stage"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          <button
            onClick={stopDemo}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400"
            title="Exit Demo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stage Title */}
      <div className="mb-2">
        <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
          <span className="font-semibold text-cyan-300">STAGE {currentStage} OF {DEMO_STAGES.length}</span>
          <span className="font-mono text-[11px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
            {secondsLeft}s remaining
          </span>
        </div>
        <h4 className="font-bold text-sm text-slate-100">{stageData.title}</h4>
        <p className="text-xs text-cyan-400/90 font-medium">{stageData.subtitle}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full mb-3 overflow-hidden">
        <div
          className="bg-cyan-400 h-full transition-all duration-300 ease-out"
          style={{ width: `${(currentStage / DEMO_STAGES.length) * 100}%` }}
        />
      </div>

      {/* Narrative Explanation */}
      <p className="text-xs text-slate-300 leading-relaxed mb-3 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
        {stageData.narrative}
      </p>

      {/* Expected Outcome */}
      <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2.5 py-1.5 rounded">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{stageData.expectedMetric}</span>
      </div>
    </div>
  );
}
