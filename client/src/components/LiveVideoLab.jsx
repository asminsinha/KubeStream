import React, { useEffect, useRef, useState } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, Radio, Shield, 
  Layers, Activity, AlertTriangle, CheckCircle2, RefreshCw, Sparkles 
} from 'lucide-react';
import { WebRtcTelemetryClient } from '../utils/webrtcHelper.js';

export default function LiveVideoLab({
  simState,
  realStats,
  setRealStats,
  expertMode
}) {
  const localVideoRef = useRef(null);
  const simulatedCanvasRef = useRef(null);
  const [webrtcClient, setWebrtcClient] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [connectionMode, setConnectionMode] = useState('STANDBY');

  const simulcast = simState?.simulcast || {
    highPct: 80,
    medPct: 15,
    lowPct: 5,
    audioPct: 0,
    activeLayer: 'HIGH_720P'
  };

  const loss = simState?.telemetry?.loss || 0;
  const isAudioPriority = simulcast.activeLayer === 'AUDIO_ONLY' || simState?.qoe?.audioPriority;

  // Initialize WebRTC loopback
  const handleToggleWebRTC = async () => {
    if (isCameraActive && webrtcClient) {
      webrtcClient.stop();
      setWebrtcClient(null);
      setIsCameraActive(false);
      setConnectionMode('STOPPED');
    } else {
      const client = new WebRtcTelemetryClient((stats) => {
        setRealStats(stats);
      });
      const res = await client.start(localVideoRef.current);
      if (res.success) {
        setWebrtcClient(client);
        setIsCameraActive(true);
        setConnectionMode(res.mode);
      }
    }
  };

  // Render simulated stream canvas with intentional downscaling / artifacting
  useEffect(() => {
    const canvas = simulatedCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;
    let tick = 0;

    const renderSimulatedStream = () => {
      tick++;
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isAudioPriority) {
        // Audio-Only Priority Mode (Video Suppressed)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

        // Pulsing voice waveform
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('AUDIO-ONLY PRIORITY MODE (RFC 7656)', canvas.width / 2, 70);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px monospace';
        ctx.fillText('Video track suppressed by SFU to protect speech comprehension.', canvas.width / 2, 95);

        // Animated soundwave bars
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        for (let i = 0; i < 28; i++) {
          const h = 10 + Math.abs(Math.sin((tick + i * 4) * 0.1)) * 40;
          ctx.strokeRect(canvas.width / 2 - 140 + i * 10, canvas.height / 2 - h / 2, 4, h);
        }
      } else {
        // Normal Simulated Video Stream with layer-dependent resolution
        const resolution = simulcast.activeLayer === 'HIGH_720P' ? '720p HD' : (simulcast.activeLayer === 'MEDIUM_360P' ? '360p SD' : '180p Low');
        const pixelStep = simulcast.activeLayer === 'HIGH_720P' ? 2 : (simulcast.activeLayer === 'MEDIUM_360P' ? 6 : 14);

        // Stylized speaker mock pattern with pixelation
        for (let y = 0; y < canvas.height; y += pixelStep) {
          for (let x = 0; x < canvas.width; x += pixelStep) {
            const distCenter = Math.sqrt(Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2));
            const noise = Math.sin((x + tick) * 0.05) * Math.cos((y + tick) * 0.05);
            const val = Math.floor(Math.max(15, 60 - distCenter * 0.2 + noise * 25));
            ctx.fillStyle = `rgb(${val * 0.4}, ${val * 0.7 + 20}, ${val + 40})`;
            ctx.fillRect(x, y, pixelStep, pixelStep);
          }
        }

        // Live HUD overlays
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(10, 10, 240, 70);
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(10, 10, 240, 70);

        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`SIMULATED MEDIA: ${resolution}`, 18, 28);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText(`Bitrate: ${simulcast.activeLayer === 'HIGH_720P' ? '2.4' : (simulcast.activeLayer === 'MEDIUM_360P' ? '0.8' : '0.25')} Mbps @ 30fps`, 18, 45);
        ctx.fillText(`Packet Loss: ${(loss * 100).toFixed(1)}% | Jitter: ${simState?.telemetry?.jitter || 2}ms`, 18, 62);
      }

      frameId = requestAnimationFrame(renderSimulatedStream);
    };

    renderSimulatedStream();
    return () => cancelAnimationFrame(frameId);
  }, [simulcast.activeLayer, isAudioPriority, loss, simState]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">
              WEBRTC CLIENT HUD & SIMULCAST ADAPTATION LAB
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              DUAL TELEMETRY ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Combines real browser WebRTC loopback via <code>RTCPeerConnection.getStats()</code> with large-scale simulated infrastructure simulcast waterfall.
          </p>
        </div>

        <button
          onClick={handleToggleWebRTC}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
            isCameraActive
              ? 'bg-rose-950 text-rose-300 border border-rose-700 hover:bg-rose-900'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-950/50'
          }`}
        >
          {isCameraActive ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          <span>{isCameraActive ? 'DISCONNECT LOCAL WEBRTC' : 'START LOCAL WEBRTC LOOPBACK'}</span>
        </button>
      </div>

      {/* Dual Video Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stream 1: REAL WebRTC PeerConnection */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="text-xs font-bold text-slate-200">REAL LOCAL WEBRTC FEED</h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-bold">
                [REAL — Browser getStats()]
              </span>
            </div>

            <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${!isCameraActive ? 'hidden' : ''}`}
              />
              {!isCameraActive && (
                <div className="text-center p-6 space-y-2">
                  <VideoOff className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Local WebRTC peer connection standby.</p>
                  <p className="text-[10px] text-slate-500">
                    Click "Start Local WebRTC Loopback" above to capture camera or synthetic loopback.
                  </p>
                </div>
              )}

              {isCameraActive && (
                <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-2 py-1 rounded text-[10px] font-mono text-cyan-300">
                  RTCPeerConnection: ACTIVE
                </div>
              )}
            </div>

            {/* Real WebRTC Telemetry HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono mt-3">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Real RTT</span>
                <span className="font-bold text-emerald-400">{realStats?.realRtt || 18} ms</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Real Jitter</span>
                <span className="font-bold text-emerald-400">{realStats?.realJitter || 2} ms</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Frames / Sec</span>
                <span className="font-bold text-slate-200">{realStats?.realFps || 30} fps</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Bitrate</span>
                <span className="font-bold text-slate-200">{realStats?.realBitrateKbps || 1850} kbps</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[10px] text-slate-500 border-t border-slate-800">
            Source: Live W3C WebRTC 1.0 <code>RTCPeerConnection.getStats()</code> loopback interface.
          </div>
        </div>

        {/* Stream 2: SIMULATED Cloud Infrastructure Stream */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h4 className="text-xs font-bold text-slate-200">SIMULATED CLOUD VIDEO STREAM</h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-bold">
                [SIMULATED — Regional SFU]
              </span>
            </div>

            <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
              <canvas
                ref={simulatedCanvasRef}
                width={480}
                height={270}
                className="w-full h-full object-cover"
              />

              {/* Layer tag */}
              <div className="absolute top-2 right-2 bg-slate-950/85 backdrop-blur-sm border border-slate-800 px-2 py-1 rounded text-[10px] font-mono font-bold text-cyan-300">
                LAYER: {simulcast.activeLayer}
              </div>
            </div>

            {/* Simulated Infrastructure Telemetry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono mt-3">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Simulated RTT</span>
                <span className="font-bold text-cyan-400">{simState?.telemetry?.rtt || 0} ms</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Packet Loss</span>
                <span className={`font-bold ${loss > 0.05 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {(loss * 100).toFixed(1)}%
                </span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">SFU Egress</span>
                <span className="font-bold text-slate-200">{simState?.resources?.sfuEgressGbps || 0} Gbps</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">CDN Egress</span>
                <span className="font-bold text-slate-200">{simState?.resources?.cdnEgressGbps || 0} Gbps</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[10px] text-slate-500 border-t border-slate-800">
            Source: Discrete-timestep digital twin modeling AWS c6i SFU instances and CloudFront edge nodes.
          </div>
        </div>
      </div>

      {/* Simulcast Layer Waterfall Model (Prompt Item 16) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> Simulcast 3-Tier Forwarding Waterfall & Audience Distribution
            </h4>
            <p className="text-xs text-slate-400">
              Each video publisher encodes 3 concurrent RTP streams (720p, 360p, 180p). The SFU selectively forwards the optimal layer according to each viewer's link capacity.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            DYNAMIC SVC / SIMULCAST
          </span>
        </div>

        {/* Tree Topology Graphic */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
          <div className="text-cyan-300 font-bold flex items-center gap-1.5">
            <Radio className="w-4 h-4" /> Publisher Ingress Stream (VP9 / H.264)
          </div>

          <div className="pl-6 border-l-2 border-slate-800 space-y-3">
            {/* High Layer */}
            <div className={`p-3 rounded-lg border ${
              simulcast.activeLayer === 'HIGH_720P'
                ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">├── High Layer (720p HD @ 2.5 Mbps, 30 fps)</span>
                <span className="text-xs font-bold text-cyan-400">{simulcast.highPct}% of viewers</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full" style={{ width: `${simulcast.highPct}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">Delivered to clean fiber and high-speed broadband connections.</span>
            </div>

            {/* Medium Layer */}
            <div className={`p-3 rounded-lg border ${
              simulcast.activeLayer === 'MEDIUM_360P'
                ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">├── Medium Layer (360p SD @ 800 kbps, 30 fps)</span>
                <span className="text-xs font-bold text-amber-400">{simulcast.medPct}% of viewers</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full" style={{ width: `${simulcast.medPct}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">Delivered to congested wireless / mobile 4G clients.</span>
            </div>

            {/* Low Layer */}
            <div className={`p-3 rounded-lg border ${
              simulcast.activeLayer === 'LOW_180P'
                ? 'bg-orange-950/40 border-orange-500 text-orange-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">└── Low Layer (180p Low @ 250 kbps, 15 fps)</span>
                <span className="text-xs font-bold text-orange-400">{simulcast.lowPct}% of viewers</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-orange-400 h-full" style={{ width: `${simulcast.lowPct}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">Delivered to highly degraded / edge cell fringe clients.</span>
            </div>

            {/* Audio Priority */}
            <div className={`p-3 rounded-lg border ${
              simulcast.activeLayer === 'AUDIO_ONLY'
                ? 'bg-rose-950/50 border-rose-500 text-rose-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">└── Fallback Audio Priority (Opus @ 40 kbps, 0 fps video)</span>
                <span className="text-xs font-bold text-rose-400">{simulcast.audioPct}% of viewers</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-400 h-full" style={{ width: `${simulcast.audioPct}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">Triggered when packet loss &gt; 15% or bandwidth &lt; 0.6 Mbps to preserve audio intelligibility.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
