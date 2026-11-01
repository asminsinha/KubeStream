import React from 'react';
import { 
  Server, Cpu, HardDrive, Network, Layers, ShieldCheck, 
  ArrowUpRight, AlertTriangle, CheckCircle2, TrendingUp, Clock, RefreshCw
} from 'lucide-react';

export default function InfrastructureLab({
  simState,
  expertMode
}) {
  const activeWorkers = simState?.activeWorkers || 2;
  const provisioningWorkers = simState?.provisioningWorkers || 0;
  const drainingWorkers = simState?.drainingWorkers || 0;
  const bottleneck = simState?.bottleneck || 'CPU-bounded';
  const cpuUtilization = simState?.resources?.cpuUtilization || 40;
  const memoryUtilization = simState?.resources?.memoryUtilization || 35;
  const totalEgressGbps = simState?.resources?.totalEgressGbps || 0;
  const forecast = simState?.forecast || {};
  const failedAz = simState?.failures?.failedAz;

  // Multi-AZ distribution for ap-south-1 (Mumbai)
  const azAWorkers = failedAz === 'ap-south-1a' ? 0 : Math.ceil(activeWorkers / 3);
  const azBWorkers = failedAz === 'ap-south-1a' ? Math.ceil(activeWorkers / 2) : Math.floor(activeWorkers / 3);
  const azCWorkers = activeWorkers - (azAWorkers + azBWorkers);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">
              INFRASTRUCTURE BOTTLENECK & CAPACITY MODEL
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              AWS EKS c6i.2xlarge PODS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Required SFU instances are governed by the most constraining resource vector: <code>max(CPU, Memory, Forwarded Connections, NIC Bandwidth, Packet Rate)</code>.
          </p>
        </div>

        {/* Bottleneck Badge */}
        <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="text-xs text-slate-400">Active Bottleneck:</span>
          <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded font-mono">
            {bottleneck}
          </span>
        </div>
      </div>

      {/* 4 Multi-Constraint Capacity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: CPU Demand */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span className="font-bold flex items-center gap-1.5 text-slate-300">
              <Cpu className="w-4 h-4 text-cyan-400" /> SFU Cluster CPU
            </span>
            <span className="font-mono text-cyan-300 font-bold">{cpuUtilization}%</span>
          </div>
          <div className="text-xl font-black text-slate-100 mb-1">
            {(activeWorkers * 8 * (cpuUtilization / 100)).toFixed(1)} / {activeWorkers * 8} <span className="text-xs font-normal text-slate-400">vCPUs</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full ${cpuUtilization > 80 ? 'bg-rose-500' : (cpuUtilization > 65 ? 'bg-amber-400' : 'bg-cyan-400')}`}
              style={{ width: `${Math.min(100, cpuUtilization)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block mt-2">
            Includes base control, VP9 packet decryption, and simulcast relay.
          </span>
        </div>

        {/* Metric 2: Memory & Buffers */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span className="font-bold flex items-center gap-1.5 text-slate-300">
              <HardDrive className="w-4 h-4 text-cyan-400" /> RAM / Jitter Buffers
            </span>
            <span className="font-mono text-cyan-300 font-bold">{memoryUtilization}%</span>
          </div>
          <div className="text-xl font-black text-slate-100 mb-1">
            {simState?.resources?.memoryDemandGb || 2.4} / {simState?.resources?.provisionedMemoryGb || 32} <span className="text-xs font-normal text-slate-400">GB RAM</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-indigo-400"
              style={{ width: `${Math.min(100, memoryUtilization)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block mt-2">
            Session state, WebRTC RTP packet reassembly buffers, and room metadata.
          </span>
        </div>

        {/* Metric 3: Forwarding Connections */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span className="font-bold flex items-center gap-1.5 text-slate-300">
              <Layers className="w-4 h-4 text-cyan-400" /> Forwarded Streams
            </span>
            <span className="font-mono text-cyan-300 font-bold">
              {simState?.resources?.sfuStreamsForwarded?.toLocaleString() || 0}
            </span>
          </div>
          <div className="text-xl font-black text-slate-100 mb-1">
            {((simState?.resources?.sfuStreamsForwarded || 0) / Math.max(1, activeWorkers * 1200) * 100).toFixed(0)}% <span className="text-xs font-normal text-slate-400">subscription capacity</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-emerald-400"
              style={{ width: `${Math.min(100, (simState?.resources?.sfuStreamsForwarded || 0) / Math.max(1, activeWorkers * 1200) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block mt-2">
            1,200 concurrent outbound streams per SFU worker ceiling.
          </span>
        </div>

        {/* Metric 4: NIC Egress Throughput */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span className="font-bold flex items-center gap-1.5 text-slate-300">
              <Network className="w-4 h-4 text-cyan-400" /> Total Egress Rate
            </span>
            <span className="font-mono text-cyan-300 font-bold">{totalEgressGbps} Gbps</span>
          </div>
          <div className="text-xl font-black text-slate-100 mb-1">
            {totalEgressGbps} / {activeWorkers * 5.0} <span className="text-xs font-normal text-slate-400">Gbps NIC limit</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-amber-400"
              style={{ width: `${Math.min(100, (totalEgressGbps / Math.max(1, activeWorkers * 5.0)) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block mt-2">
            SFU direct egress ({simState?.resources?.sfuEgressGbps}G) + CDN spectator ({simState?.resources?.cdnEgressGbps}G).
          </span>
        </div>
      </div>

      {/* Predictive Scaling & Hysteresis State Machine (Prompt Item 23 & 24) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Short-Horizon Predictive Scaler & Hysteresis State Machine
            </h4>
            <p className="text-xs text-slate-400">
              Proactively provisions media capacity before CPU saturation using arrival velocity <code>dU/dt</code>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Autoscaler State:</span>
            <span className="px-2.5 py-1 rounded text-xs font-bold font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
              {simState?.autoscalerState || 'STABLE'}
            </span>
          </div>
        </div>

        {/* Forecast Timeline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Current Attendees (t=0)</span>
            <span className="text-base font-bold text-slate-200">{simState?.attendees?.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Active Workers: {activeWorkers}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Projected (t+30s)</span>
            <span className="text-base font-bold text-cyan-300">{forecast?.attendees30s?.toLocaleString()}</span>
            <span className="text-[10px] text-cyan-500 block mt-1">Growth: +{forecast?.netGrowthPerSec * 30}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Projected (t+60s)</span>
            <span className="text-base font-bold text-cyan-300">{forecast?.attendees60s?.toLocaleString()}</span>
            <span className="text-[10px] text-cyan-500 block mt-1">Growth: +{forecast?.netGrowthPerSec * 60}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Scale Horizon Threshold</span>
            <span className="text-base font-bold text-emerald-400">&gt; 75% Scale-Up</span>
            <span className="text-[10px] text-slate-500 block mt-1">&lt; 40% Scale-Down Cooldown</span>
          </div>
        </div>

        {/* Autoscaler Action Banner */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300">
          <span className="font-bold text-cyan-400 mr-1">Predictive Scaler Log:</span>
          <span>{simState?.autoscalerReason}</span>
        </div>
      </div>

      {/* Multi-AZ Deployment Topology View (Prompt Item 36) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Multi-Availability Zone Topology: ap-south-1 (Mumbai)
            </h4>
            <p className="text-xs text-slate-400">
              SFU media pods are distributed across 3 independent availability zones with automatic session failover.
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            HIGH AVAILABILITY (99.99%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* AZ-A */}
          <div className={`p-4 rounded-xl border ${
            failedAz === 'ap-south-1a'
              ? 'bg-rose-950/40 border-rose-600/80 text-rose-300'
              : 'bg-slate-950 border-slate-800 text-slate-200'
          }`}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-xs">AZ: ap-south-1a</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                failedAz === 'ap-south-1a' ? 'bg-rose-900 text-white' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                {failedAz === 'ap-south-1a' ? 'HARDWARE OUTAGE' : 'ONLINE'}
              </span>
            </div>
            <div className="text-2xl font-black mb-1">{azAWorkers} <span className="text-xs font-normal text-slate-400">SFU Pods</span></div>
            <p className="text-[11px] text-slate-400">
              {failedAz === 'ap-south-1a' ? 'Sessions evacuated to AZ-B & AZ-C.' : 'Serving 33% of regional ingress streams.'}
            </p>
          </div>

          {/* AZ-B */}
          <div className="p-4 rounded-xl border bg-slate-950 border-slate-800 text-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-xs">AZ: ap-south-1b</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                ONLINE
              </span>
            </div>
            <div className="text-2xl font-black mb-1">{azBWorkers} <span className="text-xs font-normal text-slate-400">SFU Pods</span></div>
            <p className="text-[11px] text-slate-400">
              {failedAz === 'ap-south-1a' ? 'Absorbing evacuated sessions (+50% load).' : 'Operating within safe capacity headroom.'}
            </p>
          </div>

          {/* AZ-C */}
          <div className="p-4 rounded-xl border bg-slate-950 border-slate-800 text-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-xs">AZ: ap-south-1c</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                ONLINE
              </span>
            </div>
            <div className="text-2xl font-black mb-1">{azCWorkers} <span className="text-xs font-normal text-slate-400">SFU Pods</span></div>
            <p className="text-[11px] text-slate-400">
              {failedAz === 'ap-south-1a' ? 'Absorbing evacuated sessions (+50% load).' : 'Operating within safe capacity headroom.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
