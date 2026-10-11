"use client";

import React, { useState } from "react";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcastSuccess?: (details: { region: string; severity: string; reach: number }) => void;
}

export default function EmergencyModal({
  isOpen,
  onClose,
  onBroadcastSuccess,
}: EmergencyModalProps) {
  const [selectedRegion, setSelectedRegion] = useState("Western Rajasthan (14 Wards)");
  const [severity, setSeverity] = useState("FATAL");
  const [channels, setChannels] = useState({
    sms: true,
    whatsapp: true,
    sirens: false,
    discoms: true,
  });
  const [messageNote, setMessageNote] = useState(
    "HEATSHIELD DIRECTIVE: Universal Thermal Climate Index (UTCI) projected > 42°C. Mandatory stand-down of outdoor operations effective immediately."
  );
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSent(true);
      if (onBroadcastSuccess) {
        onBroadcastSuccess({
          region: selectedRegion,
          severity,
          reach: 52400,
        });
      }
      setTimeout(() => {
        setBroadcastSent(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface-container-lowest border-2 border-error rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-error text-on-error p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-2xl font-bold">campaign</span>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider font-mono">
                HeatShield Emergency Broadcast Trigger
              </h3>
              <p className="text-[11px] text-error-container">
                National Heatwave Response Protocol (HAP)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/20 rounded text-white"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {broadcastSent ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h4 className="text-lg font-bold text-primary">HeatShield Emergency Directive Dispatched!</h4>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto font-mono">
              Successfully transmitted via SMS Gateway & WhatsApp API to 52,400 registered recipients in {selectedRegion}.
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4 text-xs">
            {/* Region selection */}
            <div>
              <label className="block font-bold text-on-surface uppercase tracking-wider text-[11px] mb-1">
                Targeted Impact Zone
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-2.5 bg-surface border border-outline-variant rounded font-mono text-xs focus:ring-2 focus:ring-secondary focus:outline-none"
              >
                <option value="Western Rajasthan (14 Wards)">Western Rajasthan (14 Wards - Phalodi/Jodhpur/Bikaner)</option>
                <option value="Delhi-NCR Metro Region (28 Wards)">Delhi-NCR Metro Region (28 Wards)</option>
                <option value="Ahmedabad Metro Area (Ward 42/Zone West)">Ahmedabad Metro Area (Ward 42/Zone West)</option>
                <option value="Vidarbha & Nagpur District">Vidarbha & Nagpur District (Central Zone)</option>
              </select>
            </div>

            {/* Severity level */}
            <div>
              <label className="block font-bold text-on-surface uppercase tracking-wider text-[11px] mb-1">
                Risk Escalation Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "CAUTION", label: "Caution (Yellow)", border: "border-amber-400 bg-amber-50 text-amber-900" },
                  { id: "EXTREME", label: "Extreme (Orange)", border: "border-orange-500 bg-orange-50 text-orange-900" },
                  { id: "FATAL", label: "Fatal (Red)", border: "border-red-600 bg-red-50 text-red-950" },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSeverity(lvl.id)}
                    className={`p-2 rounded border-2 text-[11px] font-bold transition-all ${
                      severity === lvl.id ? lvl.border + " shadow-sm scale-[1.02]" : "border-outline-variant bg-surface text-on-surface-variant opacity-70"
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Channels */}
            <div>
              <label className="block font-bold text-on-surface uppercase tracking-wider text-[11px] mb-1">
                Active Dispatch Channels
              </label>
              <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-2.5 rounded border border-outline-variant">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channels.sms}
                    onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                    className="rounded accent-secondary"
                  />
                  <span>SMS Gateway (Fast Push)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channels.whatsapp}
                    onChange={(e) => setChannels({ ...channels, whatsapp: e.target.checked })}
                    className="rounded accent-secondary"
                  />
                  <span>WhatsApp Verified API</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channels.discoms}
                    onChange={(e) => setChannels({ ...channels, discoms: e.target.checked })}
                    className="rounded accent-secondary"
                  />
                  <span>Discom Grid Alert</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channels.sirens}
                    onChange={(e) => setChannels({ ...channels, sirens: e.target.checked })}
                    className="rounded accent-secondary"
                  />
                  <span>Public Siren Network</span>
                </label>
              </div>
            </div>

            {/* Directive content */}
            <div>
              <label className="block font-bold text-on-surface uppercase tracking-wider text-[11px] mb-1">
                Directive Text / Action Plan
              </label>
              <textarea
                rows={3}
                value={messageNote}
                onChange={(e) => setMessageNote(e.target.value)}
                className="w-full p-2.5 bg-surface border border-outline-variant rounded font-mono text-[11px] text-on-surface focus:ring-2 focus:ring-secondary focus:outline-none"
              />
            </div>

            {/* Footer actions */}
            <div className="pt-2 flex items-center justify-between border-t border-outline-variant">
              <div className="text-[11px] text-on-surface-variant font-mono">
                Est. Citizen Reach: <span className="font-bold text-primary">~52,400</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 border border-outline-variant rounded hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isBroadcasting}
                  onClick={handleSend}
                  className="px-4 py-1.5 bg-error text-on-error hover:bg-red-800 font-bold rounded flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  {isBroadcasting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Broadcasting...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">send</span>
                      Execute Broadcast
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
