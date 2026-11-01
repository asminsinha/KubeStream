import React from 'react';
import { 
  Layers, Network, Server, Database, Shield, 
  ArrowRight, Radio, Cpu, HardDrive, CheckCircle2, Zap 
} from 'lucide-react';

export default function ArchitectureGuide({
  simState,
  expertMode
}) {
  const currentTopology = simState?.topology || 'CENTRAL_SFU';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">
              SYSTEM ARCHITECTURE & PRODUCTION AWS CLOUD MAPPING
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              DIGITAL TWIN SPECIFICATION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounded in the Scalable Web Infrastructure for Real-Time Video & Interactive Events architecture defined in the project specification.
          </p>
        </div>

        <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
          Current State: <strong className="text-cyan-300">{currentTopology}</strong>
        </div>
      </div>

      {/* Dual Pipeline: Media Plane vs Control Plane (Prompt Item 39) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" /> Decoupled Dual Pipeline: Media Plane vs Control/Event Plane
            </h4>
            <p className="text-xs text-slate-400">
              UDP real-time video transport is isolated from TCP WebSocket event pipelines via Amazon MSK (Kafka) and ElastiCache.
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            FAULT ISOLATION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pipeline 1: Media Plane (UDP) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-cyan-900/60 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-cyan-300 font-bold border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-cyan-400" /> MEDIA PLANE (UDP / RTP / SRTP)
              </span>
              <span className="text-[10px] text-cyan-500 font-normal">Sub-150ms Latency SLA</span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                1. WebRTC Publishers (VP9 / OPUS / H.264 RTP over UDP)
              </div>
              <div className="text-center text-cyan-400">↓ UDP Ingress (Port 10000-20000)</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                2. Selective Forwarding Units (SFUs on AWS EKS c6i.2xlarge)
              </div>
              <div className="text-center text-cyan-400">↓ Forwarded Subscriptions / LL-HLS</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                3. Amazon CloudFront CDN Shield (Spectator Edge Relays)
              </div>
            </div>

            <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800/60 text-[11px] text-cyan-200">
              <strong>Reliability Characteristic:</strong> Loss-tolerant, zero retransmissions for stale packets, dynamic simulcast layer adaptation.
            </div>
          </div>

          {/* Pipeline 2: Control & Event Plane (TCP) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-900/60 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-indigo-300 font-bold border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-indigo-400" /> CONTROL & EVENT PLANE (TCP / WSS / KAFKA)
              </span>
              <span className="text-[10px] text-indigo-400 font-normal">Guaranteed Delivery SLA</span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                1. Client Interactions (Live Polls, Q&A, Chat over WebSocket)
              </div>
              <div className="text-center text-indigo-400">↓ TCP / WSS (Port 443)</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                2. Token-Bucket Queue & Amazon MSK (Apache Kafka Event Bus)
              </div>
              <div className="text-center text-indigo-400">↓ Async Microservice Consumers</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                3. ElastiCache Redis (Presence) & DynamoDB (Interactions)
              </div>
            </div>

            <div className="p-2 rounded bg-indigo-950/40 border border-indigo-800/60 text-[11px] text-indigo-200">
              <strong>Reliability Characteristic:</strong> Decoupled from media stream. A flash poll storm of 10,000 writes/sec will NOT drop audio packets!
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Mode Matrix (Prompt Item 17) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" /> Workload-Aware Architectural Modes
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* Mode 1 */}
          <div className={`p-4 rounded-xl border ${
            currentTopology === 'P2P_MESH'
              ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950/50'
              : 'bg-slate-950 border-slate-800'
          }`}>
            <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">MODE 1</span>
            <h5 className="font-bold text-sm text-slate-100 mb-1">P2P Direct Mesh</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Suitable for 1-to-1 interviews or small meetings (&le; 6 peers). Zero SFU compute or egress cost.
            </p>
            <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
              Cost: $0.17/hr (Signalling only)
            </div>
          </div>

          {/* Mode 2 */}
          <div className={`p-4 rounded-xl border ${
            currentTopology === 'CENTRAL_SFU'
              ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950/50'
              : 'bg-slate-950 border-slate-800'
          }`}>
            <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">MODE 2</span>
            <h5 className="font-bold text-sm text-slate-100 mb-1">Central SFU Cluster</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              For interactive meetings up to 500 users. Clustered EKS workers handle selective forwarding.
            </p>
            <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
              Latency: &lt;50ms | 100% Interactive
            </div>
          </div>

          {/* Mode 3 */}
          <div className={`p-4 rounded-xl border ${
            currentTopology === 'CASCADED_SFU'
              ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950/50'
              : 'bg-slate-950 border-slate-800'
          }`}>
            <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">MODE 3</span>
            <h5 className="font-bold text-sm text-slate-100 mb-1">Cascaded SFU Fabric</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              For multi-track conferences with 20+ publishers. Primary ingress SFU feeds regional distribution relays.
            </p>
            <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
              Multi-Region Cross-Relay
            </div>
          </div>

          {/* Mode 4 */}
          <div className={`p-4 rounded-xl border ${
            currentTopology === 'HYBRID_BROADCAST_CDN'
              ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950/50'
              : 'bg-slate-950 border-slate-800'
          }`}>
            <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">MODE 4</span>
            <h5 className="font-bold text-sm text-slate-100 mb-1">Hybrid Broadcast CDN</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              For webinars and summits up to 100,000 attendees. SFU feeds transcoders; CloudFront absorbs 98.4% of fan-out.
            </p>
            <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
              CloudFront Offload: 98.4%
            </div>
          </div>
        </div>
      </div>

      {/* Production AWS Architecture Mapping Table (Prompt Item 30) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" /> AWS Architecture Mapping Specification
          </h4>
          <span className="text-[10px] font-mono text-slate-400">
            SIMULATED CLOUD CONTROL-PLANE MODEL
          </span>
        </div>

        <div className="overflow-x-auto text-xs font-mono">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                <th className="py-2">System Plane</th>
                <th className="py-2">Simulated Architectural Role</th>
                <th className="py-2">Production AWS Cloud Service</th>
                <th className="py-2">Sizing / Scaling Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 font-bold text-cyan-300">MEDIA PLANE</td>
                <td>SFU Media Streaming Workers</td>
                <td className="text-slate-100 font-semibold">Amazon EKS (c6i.2xlarge EC2 Nodes)</td>
                <td>KEDA-driven predictive autoscaling by PPS & CPU</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-cyan-300">MEDIA PLANE</td>
                <td>Spectator CDN Edge Delivery</td>
                <td className="text-slate-100 font-semibold">Amazon CloudFront + Route 53 Geolocation</td>
                <td>Global edge PoP caching with Origin Shield</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-cyan-300">MEDIA PLANE</td>
                <td>Live Video Transcoding (LL-HLS)</td>
                <td className="text-slate-100 font-semibold">AWS Fargate Spot (70% Compute Discount)</td>
                <td>Stateless Spot workers with graceful drain</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-indigo-300">CONTROL PLANE</td>
                <td>Signalling & Room Coordination</td>
                <td className="text-slate-100 font-semibold">Amazon ECS / EKS Microservices + NLB</td>
                <td>WebSocket connection pooling with sticky sessions</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-indigo-300">CONTROL PLANE</td>
                <td>Asynchronous Event Bus</td>
                <td className="text-slate-100 font-semibold">Amazon MSK (Managed Apache Kafka)</td>
                <td>Topic partition hashing by RoomID</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-emerald-300">DATA PLANE</td>
                <td>Presence & Ephemeral Session State</td>
                <td className="text-slate-100 font-semibold">Amazon ElastiCache (Redis Cluster)</td>
                <td>Multi-AZ replication with sub-millisecond latency</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-emerald-300">DATA PLANE</td>
                <td>Live Interactive Polls & Q&A</td>
                <td className="text-slate-100 font-semibold">Amazon DynamoDB (On-Demand Capacity)</td>
                <td>Single-digit millisecond key-value persistence</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-emerald-300">DATA PLANE</td>
                <td>User Accounts, Registration & Billing</td>
                <td className="text-slate-100 font-semibold">Amazon Aurora PostgreSQL (Serverless v2)</td>
                <td>ACID transactional financial accounting</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-amber-300">EDGE SECURITY</td>
                <td>WAF, DDoS & Admission Queue</td>
                <td className="text-slate-100 font-semibold">AWS WAF + AWS Shield Advanced</td>
                <td>Virtual token-bucket admission rate limiting</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
