import React, { useState } from 'react';
import { 
  DollarSign, TrendingDown, Layers, PieChart, ShieldCheck, 
  ArrowRight, Info, ChevronDown, ChevronUp, Sliders, CheckCircle2 
} from 'lucide-react';

export default function FinOpsCenter({
  simState,
  expertMode
}) {
  const [isLedgerOpen, setIsLedgerOpen] = useState(true);
  const [costWeightPriority, setCostWeightPriority] = useState(50); // slider 0 (low cost priority) to 100 (high cost priority)

  const financials = simState?.financials || {};
  const resources = simState?.resources || {};
  const activeWorkers = simState?.activeWorkers || 2;
  const cdnPops = simState?.cdnPops || 0;
  const transcoders = simState?.transcodersNeeded || 0;
  const attendees = simState?.attendees || 0;
  const publishers = simState?.publishers || 0;

  const totalCost = financials.totalHourlyCost || '0.00';
  const naiveCost = financials.naiveBaselineHourlyCost || '0.00';
  const savings = financials.hourlySavings || '0.00';
  const savingsPct = financials.savingsPercent || '0.0';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">
              FINOPS TRANSPARENT COST & UNIT ECONOMICS CENTER
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              ALGORITHMIC FinOps
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time accounting of compute, network egress, CDN edge delivery, multi-tier databases, and Spot transcoding discounts.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 block uppercase font-mono">Simulated Monthly Run-Rate</span>
          <span className="text-lg font-black text-emerald-400 font-mono">
            ${(parseFloat(totalCost) * 730).toFixed(0)} <span className="text-xs text-slate-500 font-normal">/ mo</span>
          </span>
        </div>
      </div>

      {/* Naive Baseline vs KubeStream Optimized (Prompt Item 27) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Naive Architecture */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Naive Fixed Architecture</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/70 border border-rose-800 text-rose-300">
              NO OPTIMIZATION
            </span>
          </div>

          <div className="text-3xl font-black text-slate-400 line-through">
            ${naiveCost} <span className="text-xs font-normal text-slate-500">/ hr</span>
          </div>

          <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
            <li>• Overprovisioned static SFU fleet running 24/7</li>
            <li>• Direct SFU spectator fan-out (no CDN offload)</li>
            <li>• Standard on-demand transcoding ($0.45/hr)</li>
            <li>• Idle capacity wasted during low-traffic valleys</li>
          </ul>
        </div>

        {/* KubeStream Dynamic Architecture */}
        <div className="bg-slate-900 border border-cyan-700/60 p-5 rounded-xl space-y-3 shadow-lg shadow-cyan-950/20">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">KubeStream Dynamic</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 font-bold">
              OPTIMIZED
            </span>
          </div>

          <div className="text-3xl font-black text-emerald-400">
            ${totalCost} <span className="text-xs font-normal text-slate-500">/ hr</span>
          </div>

          <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
            <li>• Predictive autoscaler warms workers just-in-time</li>
            <li>• CloudFront edge shields 98%+ spectator egress</li>
            <li>• Spot Fargate transcoders (70% compute discount)</li>
            <li>• Rapid consolidation and connection draining</li>
          </ul>
        </div>

        {/* Quantified Savings */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-700/60 p-5 rounded-xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Quantified FinOps Savings</span>
              <TrendingDown className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-4xl font-black text-emerald-400">
              {savingsPct}%
            </div>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              Net Savings: <strong className="text-emerald-300">${savings} / hour</strong>
            </p>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded border border-slate-800">
            Mathematically evaluated against counterfactual un-offloaded all-SFU mesh at current attendee scale.
          </div>
        </div>
      </div>

      {/* Unit Economics 3-Metric Row (Prompt Item 26) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Cost Per Participant-Hour</span>
          <div className="text-2xl font-black text-cyan-300 font-mono">
            ${financials.costPerParticipantPerHour || '0.0024'}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Total hourly cost / {attendees.toLocaleString()} attendees</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Cost Per Active Publisher</span>
          <div className="text-2xl font-black text-cyan-300 font-mono">
            ${financials.costPerPublisherPerHour || '0.450'}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Inbound stream processing & simulcast generation</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Cost Per Delivered Gigabyte</span>
          <div className="text-2xl font-black text-cyan-300 font-mono">
            ${financials.costPerDeliveredGb || '0.032'} <span className="text-xs font-normal text-slate-500">/ GB</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Blended direct AWS egress + CloudFront tier</span>
        </div>
      </div>

      {/* Resource Utilization Gauges (Prompt Item 28) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-cyan-400" /> Resource Efficiency & Packing Ratios (Used / Provisioned)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400">CPU Packing Efficiency:</span>
              <span className="font-bold text-cyan-300">{resources.cpuEfficiency || 70}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full" style={{ width: `${resources.cpuEfficiency || 70}%` }} />
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">Target range: 60% - 80% safe envelope</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400">Memory Efficiency:</span>
              <span className="font-bold text-indigo-300">{resources.memoryEfficiency || 64}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-400 h-full" style={{ width: `${resources.memoryEfficiency || 64}%` }} />
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">Buffer allocations & kernel socket pools</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400">Bandwidth NIC Efficiency:</span>
              <span className="font-bold text-emerald-300">{resources.bandwidthEfficiency || 78}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${resources.bandwidthEfficiency || 78}%` }} />
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">Outbound 5 Gbps per-instance NIC utilization</span>
          </div>
        </div>
      </div>

      {/* Expandable Ledger (Prompt Item 29) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <button
          onClick={() => setIsLedgerOpen(!isLedgerOpen)}
          className="w-full p-4 flex justify-between items-center hover:bg-slate-850 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-slate-100">Itemized AWS Infrastructure Cost Ledger</span>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              Expandable
            </span>
          </div>
          {isLedgerOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {isLedgerOpen && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                  <th className="py-2">Category</th>
                  <th className="py-2">Simulated AWS Resource</th>
                  <th className="py-2">Quantity</th>
                  <th className="py-2">Unit Rate</th>
                  <th className="py-2 text-right">Hourly Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {/* Compute */}
                <tr>
                  <td className="py-2 font-bold text-cyan-300">COMPUTE</td>
                  <td>EKS SFU Media Workers (c6i.2xlarge)</td>
                  <td>{activeWorkers} Pods</td>
                  <td>$0.340 / hr</td>
                  <td className="py-2 text-right font-bold">${financials.computeCostPerHour}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-cyan-300">COMPUTE</td>
                  <td>Live Transcoders (AWS Fargate Spot 70% Off)</td>
                  <td>{transcoders} Nodes</td>
                  <td>$0.135 / hr</td>
                  <td className="py-2 text-right">${(transcoders * 0.135).toFixed(3)}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-cyan-300">COMPUTE</td>
                  <td>Signalling & Room Controller (EKS Core)</td>
                  <td>2 Pods</td>
                  <td>$0.085 / hr</td>
                  <td className="py-2 text-right">$0.170</td>
                </tr>

                {/* Network */}
                <tr>
                  <td className="py-2 font-bold text-amber-300">NETWORK</td>
                  <td>Direct AWS SFU Egress Data</td>
                  <td>{resources.sfuEgressGbps} Gbps</td>
                  <td>$0.080 / GB</td>
                  <td className="py-2 text-right font-bold">${((resources.sfuEgressGbps * 3600 / 8) * 0.08).toFixed(3)}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-amber-300">NETWORK</td>
                  <td>Amazon CloudFront CDN Delivery (Spectators)</td>
                  <td>{resources.cdnEgressGbps} Gbps ({cdnPops} Edge PoPs)</td>
                  <td>$0.025 / GB</td>
                  <td className="py-2 text-right font-bold">${financials.cdnCostPerHour}</td>
                </tr>

                {/* Data & Storage */}
                <tr>
                  <td className="py-2 font-bold text-indigo-300">DATA</td>
                  <td>Amazon ElastiCache Redis (Session Presence)</td>
                  <td>cache.r6g.large</td>
                  <td>$0.260 / hr</td>
                  <td className="py-2 text-right">$0.260</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-indigo-300">DATA</td>
                  <td>Amazon DynamoDB (Interactive Event Q&A / Polls)</td>
                  <td>{simState?.controlPlane?.dynamoDbWritesPerSec || 0} writes/s</td>
                  <td>$1.25 / 1M writes</td>
                  <td className="py-2 text-right">${((simState?.controlPlane?.dynamoDbWritesPerSec || 0) * 3600 / 1000000 * 1.25).toFixed(3)}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-indigo-300">DATA</td>
                  <td>Amazon Aurora PostgreSQL (Billing & Accounts)</td>
                  <td>db.r6g.large</td>
                  <td>$0.260 / hr</td>
                  <td className="py-2 text-right">$0.260</td>
                </tr>

                {/* Edge Security */}
                <tr>
                  <td className="py-2 font-bold text-slate-400">SECURITY</td>
                  <td>AWS WAF & Shield Advanced (DDoS Protection)</td>
                  <td>{attendees.toLocaleString()} clients</td>
                  <td>$0.00005 / client</td>
                  <td className="py-2 text-right">${financials.edgeCostPerHour}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-700 text-sm font-bold text-slate-100">
                  <td colSpan={4} className="py-3 text-right">TOTAL DYNAMIC CLOUD COST:</td>
                  <td className="py-3 text-right text-emerald-400">${totalCost} / hr</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
