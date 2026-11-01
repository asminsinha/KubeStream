import React, { useState } from 'react';
import { 
  Globe, Compass, MapPin, Zap, Radio, CheckCircle2, 
  AlertTriangle, Navigation, Sliders, ChevronRight, Info
} from 'lucide-react';
import { 
  REGIONS, EDGE_NODES, PRESET_CLIENT_CITIES, 
  calculateHaversineDistance, calculateLatencyComponents 
} from '../services/simulationEngine.js';

export default function GlobalEdgeOrchestrator({
  simState,
  applyInputs,
  expertMode
}) {
  const clientLocation = simState?.clientLocation || PRESET_CLIENT_CITIES[0];
  const selectedRegion = simState?.selectedRegion || REGIONS['ap-south-1'];
  const routing = simState?.routing || {};
  const candidates = routing?.candidates || [];
  const weights = simState?.weights || {
    latencyWeight: 0.35,
    capacityWeight: 0.25,
    congestionWeight: 0.20,
    reliabilityWeight: 0.15,
    costWeight: 0.05
  };

  // Convert Lat/Lon to SVG coordinate on an Equirectangular projection (width 800, height 400)
  const mapWidth = 800;
  const mapHeight = 400;

  const latLonToXY = (lat, lon) => {
    const x = ((lon + 180) / 360) * mapWidth;
    const y = ((90 - lat) / 180) * mapHeight;
    return { x, y };
  };

  const clientXY = latLonToXY(clientLocation.lat, clientLocation.lon);
  const targetXY = latLonToXY(selectedRegion.lat, selectedRegion.lon);

  // SVG arc calculation
  const dx = targetXY.x - clientXY.x;
  const dy = targetXY.y - clientXY.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const arcHeight = Math.min(80, dist * 0.25);
  const midX = (clientXY.x + targetXY.x) / 2;
  const midY = (clientXY.y + targetXY.y) / 2 - arcHeight;
  const pathD = `M ${clientXY.x} ${clientXY.y} Q ${midX} ${midY} ${targetXY.x} ${targetXY.y}`;

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const lon = parseFloat(((clickX / rect.width) * 360 - 180).toFixed(2));
    const lat = parseFloat((90 - (clickY / rect.height) * 180).toFixed(2));

    applyInputs({
      clientLocation: {
        name: `Custom Pin (${lat}°, ${lon}°)`,
        lat,
        lon,
        regionHint: null
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">
              GLOBAL EDGE ORCHESTRATOR & PROXIMITY ROUTER
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              MULTI-ATTRIBUTE OPTIMIZER
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Calculates exact great-circle Haversine physical propagation delay and optimizes edge ingress routes across AWS Core Regions and 5G Wavelength edges.
          </p>
        </div>

        {/* Quick City Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 font-mono">Simulated Client:</span>
          <select
            value={clientLocation.name}
            onChange={(e) => {
              const city = PRESET_CLIENT_CITIES.find(c => c.name === e.target.value);
              if (city) applyInputs({ clientLocation: city });
            }}
            className="bg-slate-950 text-xs text-cyan-300 border border-slate-700 rounded px-2.5 py-1.5 outline-none font-medium"
          >
            {PRESET_CLIENT_CITIES.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* World Map & Interactive Traffic Canvas */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-4 relative">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>LIVE GLOBAL TOPOLOGY & TRAFFIC PATHWAY</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Click anywhere on the map to drop a simulated client pin
          </span>
        </div>

        {/* SVG World Map Canvas */}
        <div className="relative w-full aspect-[2/1] bg-slate-950 rounded-lg border border-slate-800/80 overflow-hidden cursor-crosshair">
          <svg
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            className="w-full h-full select-none"
            onClick={handleMapClick}
          >
            {/* World Land Outline Stylized Vector */}
            <defs>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Grid Lines */}
            <line x1="0" y1="200" x2="800" y2="200" stroke="#1e293b" strokeDasharray="3,3" />
            <line x1="400" y1="0" x2="400" y2="400" stroke="#1e293b" strokeDasharray="3,3" />

            {/* Continents Simplified Polygonal Backdrop */}
            {/* North America */}
            <path d="M 80 80 L 220 80 L 240 140 L 200 180 L 150 160 L 120 120 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            {/* South America */}
            <path d="M 220 220 L 290 240 L 260 340 L 220 360 L 200 260 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            {/* Europe */}
            <path d="M 380 90 L 460 90 L 480 140 L 420 160 L 370 130 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            {/* Africa */}
            <path d="M 390 170 L 480 170 L 490 280 L 430 330 L 370 240 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            {/* Asia */}
            <path d="M 480 70 L 680 70 L 720 160 L 600 220 L 520 170 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            {/* Australia */}
            <path d="M 640 280 L 730 280 L 720 350 L 630 340 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />

            {/* Active Animated Traffic Arc from Client Pin to Selected Region */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#arcGrad)"
              strokeWidth="2.5"
              strokeDasharray="6,4"
              className="animate-pulse"
              filter="url(#glow)"
            />

            {/* AWS Regions Markers */}
            {Object.values(REGIONS).map((reg) => {
              const { x, y } = latLonToXY(reg.lat, reg.lon);
              const isSelected = selectedRegion.id === reg.id;
              const isFailed = simState?.failures?.failedRegion === reg.id;

              return (
                <g key={reg.id} className="cursor-pointer" onClick={() => applyInputs({ manualRegion: reg.id })}>
                  {/* Ping wave for selected region */}
                  {isSelected && (
                    <circle cx={x} cy={y} r="16" fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.6">
                      <animate attributeName="r" values="8;24;8" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                  )}

                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 6 : 4}
                    fill={isFailed ? '#f43f5e' : (isSelected ? '#06b6d4' : '#334155')}
                    stroke={isSelected ? '#ffffff' : '#64748b'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={x + 8}
                    y={y + 3}
                    fill={isSelected ? '#22d3ee' : '#94a3b8'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {reg.id}
                  </text>
                </g>
              );
            })}

            {/* 5G Wavelength Edge Nodes Markers */}
            {Object.values(EDGE_NODES).map((edge) => {
              const { x, y } = latLonToXY(edge.lat, edge.lon);
              return (
                <g key={edge.id} opacity="0.85">
                  <polygon
                    points={`${x},${y-5} ${x+4},${y+3} ${x-4},${y+3}`}
                    fill="#a855f7"
                    stroke="#e9d5ff"
                    strokeWidth="0.8"
                  />
                  <text x={x + 6} y={y + 2} fill="#c084fc" fontSize="7" fontFamily="monospace">
                    5G-Wav
                  </text>
                </g>
              );
            })}

            {/* Draggable/Current Client Location Pin */}
            <g transform={`translate(${clientXY.x}, ${clientXY.y})`}>
              <circle r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle r="14" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" opacity="0.7">
                <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="10" y="3" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">
                CLIENT: {clientLocation.name}
              </text>
            </g>
          </svg>

          {/* Map Overlay Badge */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-[11px] font-mono text-slate-300 backdrop-blur-sm space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Navigation className="w-3.5 h-3.5" />
              <span>ACTIVE ROUTE: {clientLocation.name} → {selectedRegion.name}</span>
            </div>
            <div className="text-slate-400">
              Total RTT: <span className="text-slate-100 font-bold">{simState?.telemetry?.rtt || 0} ms</span> | 
              Distance: <span className="text-slate-100 font-bold">{calculateHaversineDistance(clientLocation.lat, clientLocation.lon, selectedRegion.lat, selectedRegion.lon).toFixed(0)} km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Haversine Latency Breakdown & Multi-Attribute Routing Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Haversine Physical Model Breakdown (Prompt Item 9) */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" /> Haversine Physics & Latency Decomposition
              </h4>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                RFC 675 / ITU-T G.114
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Total Round-Trip Time is not an arbitrary random number. It is mathematically calculated using Great-Circle spherical trigonometry, fiber velocity factor (~200,000 km/s), transit routing hops, non-linear edge buffer queueing, and UDP kernel SRTP processing.
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Great-Circle Haversine Distance:</span>
                <span className="text-cyan-300 font-bold">
                  {calculateHaversineDistance(clientLocation.lat, clientLocation.lon, selectedRegion.lat, selectedRegion.lon).toFixed(0)} km
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Propagation Delay (5µs/km):</span>
                  <span className="text-sm font-bold text-slate-200">{simState?.telemetry?.propagationDelay || 0} ms</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Speed of light in silica fiber</span>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Routing & Peering Delay:</span>
                  <span className="text-sm font-bold text-slate-200">{simState?.telemetry?.routingDelay || 0} ms</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">BGP / Tier-1 ISP hops</span>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Edge Queueing Delay:</span>
                  <span className="text-sm font-bold text-slate-200">{simState?.telemetry?.queueingDelay || 0} ms</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">NIC bufferBloat factor</span>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Processing & SRTP Delay:</span>
                  <span className="text-sm font-bold text-slate-200">{simState?.telemetry?.processingDelay || 2.4} ms</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Kernel UDP packet decryption</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded bg-cyan-950/40 border border-cyan-800/60 text-cyan-200">
                <span className="font-bold">Total Estimated RTT:</span>
                <span className="text-base font-black text-cyan-300">
                  {simState?.telemetry?.rtt || 0} ms (Jitter: ±{simState?.telemetry?.jitter || 2}ms)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            <span className="text-slate-400 font-bold">Haversine Formula:</span>{' '}
            <code className="text-[10px] text-cyan-400">a = sin²(Δlat/2) + cos(lat1)cos(lat2)sin²(Δlon/2)</code>
          </div>
        </div>

        {/* Panel 2: Multi-Attribute Candidate Scoring Engine (Prompt Item 10) */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" /> Multi-Attribute Routing Engine
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                PARETO OPTIMIZER
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Rather than a naive nearest-server lookup, KubeStream balances <strong>Latency (35%)</strong>, <strong>Available Capacity (25%)</strong>, <strong>Congestion (20%)</strong>, <strong>Reliability (15%)</strong>, and <strong>Cost (5%)</strong>.
            </p>

            {/* Explanation Banner */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 mb-4">
              <span className="text-cyan-400 font-bold block mb-1">Routing Optimizer Verdict:</span>
              <p className="leading-relaxed">{routing?.explanation || 'Proximity and congestion within normal thresholds.'}</p>
            </div>

            {/* Candidate Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                    <th className="py-1.5">Candidate Region</th>
                    <th className="py-1.5">RTT</th>
                    <th className="py-1.5">Load</th>
                    <th className="py-1.5">Score</th>
                    <th className="py-1.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {candidates.slice(0, 5).map((cand, idx) => {
                    const isSelected = selectedRegion.id === cand.region.id;
                    return (
                      <tr key={cand.region.id} className={isSelected ? 'bg-cyan-950/30 text-cyan-300 font-bold' : 'text-slate-400'}>
                        <td className="py-1.5 flex items-center gap-1.5">
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          <span>{cand.region.name.split(' ')[0]} ({cand.region.id})</span>
                        </td>
                        <td className="py-1.5">{cand.latencyMs} ms</td>
                        <td className="py-1.5">{cand.utilization}%</td>
                        <td className="py-1.5 font-bold text-slate-200">
                          {(cand.totalScore * 100).toFixed(1)}
                        </td>
                        <td className="py-1.5">
                          {cand.isEligible ? (
                            <span className={isSelected ? 'text-emerald-400' : 'text-slate-500'}>
                              {isSelected ? 'SELECTED' : `RANK #${idx + 1}`}
                            </span>
                          ) : (
                            <span className="text-rose-400">OUTAGE</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
            <span>Weights: Latency 35% | Capacity 25% | Congestion 20% | Rel 15% | Cost 5%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
