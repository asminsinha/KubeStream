import React, { useState } from 'react';
import { 
  FileText, Filter, CheckCircle2, AlertTriangle, 
  ArrowRight, Clock, ChevronDown, ChevronUp, Code 
} from 'lucide-react';

export default function SystemAuditLog({
  events = [],
  expertMode
}) {
  const [filterType, setFilterType] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);

  const filteredEvents = events.filter((e) => {
    if (filterType === 'ALL') return true;
    return e.type.includes(filterType);
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">
              OPERATOR CONTROL-PLANE AUDIT LOG & DECISION TIMELINE
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              IMMUTABLE AUDIT TRAIL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Structured timeline of every scaling event, routing adjustment, simulcast downgrade, failure detection, and FinOps ledger entry.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-lg text-xs font-mono">
          <span className="text-slate-500 px-2">Filter:</span>
          {['ALL', 'SCALING', 'DRAINING', 'STABLE'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterType === f
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table / Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-4 space-y-3 font-mono text-xs">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            No events recorded yet. Adjust workload or run simulation ticks to generate audit logs.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredEvents.map((ev, idx) => {
              const isExpanded = expandedId === idx;
              const isScaleUp = ev.type?.includes('SCALING_UP');
              const isDrain = ev.type?.includes('DRAINING');

              return (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 transition-colors hover:border-slate-700"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {ev.timestamp}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isScaleUp
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : isDrain
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>
                        {ev.type}
                      </span>
                      <span className="text-slate-300 font-bold">Region: {ev.region}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-[11px]">
                        Workers: <strong className="text-slate-200">{ev.activeWorkers}</strong> | 
                        Cost: <strong className="text-emerald-400">${ev.totalHourlyCost}/hr</strong>
                      </span>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : idx)}
                        className="text-slate-500 hover:text-slate-300 p-1"
                        title="Toggle JSON audit payload"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs mt-1.5 leading-relaxed font-sans">
                    {ev.reason}
                  </p>

                  {/* Expanded JSON Inspector */}
                  {isExpanded && (
                    <div className="mt-3 pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono">
                        <Code className="w-3.5 h-3.5" /> Structured Event Audit Schema
                      </div>
                      <pre className="bg-slate-900 p-3 rounded text-[11px] text-cyan-300 overflow-x-auto border border-slate-800">
                        {JSON.stringify(ev, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
