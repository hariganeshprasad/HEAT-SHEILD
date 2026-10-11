"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AIAssistant from "../components/AIAssistant";
import EmergencyModal from "../components/EmergencyModal";
import RecipientModal from "../components/RecipientModal";

export default function HAPCenterPage() {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isRecipientModalOpen, setIsRecipientModalOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const [thresholds, setThresholds] = useState({
    utciFatal: 42.0,
    wbgtHigh: 32.0,
    utciCaution: 36.0,
  });

  const [channels, setChannels] = useState({
    sms: true,
    whatsapp: true,
    discom: true,
    ivr: false,
  });

  const [targetAudience, setTargetAudience] = useState([
    { role: "District Collectors", contacts: 74, active: true },
    { role: "Chief Medical Officers (CMO)", contacts: 112, active: true },
    { role: "Emergency First Responders", contacts: 340, active: true },
    { role: "Municipal Ward Engineers", contacts: 198, active: true },
  ]);

  const [dispatchHistory, setDispatchHistory] = useState([
    {
      id: 1,
      time: "10:42 AM, Today",
      region: "NCR, Delhi",
      trigger: "WBGT > 38.0°C",
      triggerSeverity: "fatal",
      reach: "1,420 Officers",
      status: "Delivered",
    },
    {
      id: 2,
      time: "08:15 AM, Today",
      region: "Jaipur, Rajasthan",
      trigger: "UTCI > 36.5°C",
      triggerSeverity: "warning",
      reach: "845 Officers",
      status: "Delivered",
    },
    {
      id: 3,
      time: "16:30 PM, Yesterday",
      region: "Ahmedabad, Gujarat",
      trigger: "Manual Override",
      triggerSeverity: "fatal",
      reach: "2,100 Officers",
      status: "Delivered",
    },
    {
      id: 4,
      time: "12:10 PM, Yesterday",
      region: "Nagpur, Maharashtra",
      trigger: "WBGT > 32.5°C",
      triggerSeverity: "warning",
      reach: "612 Officers",
      status: "Delivered",
    },
  ]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-on-surface">
      <Header onOpenEmergency={() => setIsEmergencyOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar onOpenEmergency={() => setIsEmergencyOpen(true)} />

        <main className="flex-1 bg-surface flex flex-col overflow-y-auto p-4 lg:p-6">
          {/* Active Alert Banner */}
          {!acknowledged && (
            <div className="mb-4 bg-error-container text-on-error-container p-4 rounded-lg flex items-center justify-between gap-4 border border-error pulse-urgent shadow-xs">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-error text-3xl font-bold">warning</span>
                <div>
                  <h2 className="font-bold text-sm text-error uppercase font-mono tracking-wide">
                    Extreme Heat Advisory Active - NCR & Western Rajasthan
                  </h2>
                  <p className="text-xs text-on-surface mt-0.5">
                    WBGT levels exceeding 38.0°C. Automated stand-down broadcast armed.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEmergencyOpen(true)}
                  className="bg-error text-on-error px-4 py-1.5 rounded font-bold text-xs uppercase tracking-wider hover:bg-red-800 transition-colors shadow-xs"
                >
                  Manual Override
                </button>
                <button
                  onClick={() => setAcknowledged(true)}
                  className="border border-outline-variant bg-surface px-3 py-1.5 rounded font-bold text-xs uppercase tracking-wider hover:bg-surface-container transition-colors"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          )}

          {/* Page Title & Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-primary font-mono tracking-tight uppercase">
                Heat Action Plan (HAP) Command
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Configure automated telemetry triggers, manage multi-channel dispatch pipelines, and monitor real-time reach.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRecipientModalOpen(true)}
                className="bg-surface border border-secondary text-secondary px-3.5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-secondary-fixed transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-base">ring_volume</span>
                Manage Alert Numbers
              </button>
              <button
                onClick={() => setIsEmergencyOpen(true)}
                className="bg-error text-on-error px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-red-800 transition-colors shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-base">campaign</span>
                Trigger Manual Broadcast
              </button>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-4">
            {/* 1. Alert Trigger Configuration */}
            <div className="xl:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-primary font-mono flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">settings_suggest</span>
                  Automated Trigger Thresholds
                </h3>
                <span className="text-[11px] font-mono text-on-surface-variant">
                  Telemetry Frequency: 15 mins
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                {/* UTCI Fatal */}
                <div className="border border-outline-variant rounded-lg p-4 bg-surface flex flex-col justify-between border-l-4 border-l-error">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-error font-mono uppercase">
                      Fatal Risk (UTCI)
                    </span>
                    <span className="material-symbols-outlined text-outline text-lg">thermostat</span>
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-primary my-2">
                    &gt; {thresholds.utciFatal}°C
                  </div>
                  <p className="text-[11px] text-on-surface-variant mb-3">
                    Universal Thermal Climate Index (Extreme Mortality)
                  </p>
                  <button
                    onClick={() => {
                      const val = prompt("Enter new Fatal UTCI threshold (°C):", thresholds.utciFatal.toString());
                      if (val && !isNaN(Number(val))) {
                        setThresholds({ ...thresholds, utciFatal: Number(val) });
                      }
                    }}
                    className="text-secondary text-xs font-bold uppercase tracking-wider hover:underline text-left"
                  >
                    Edit Threshold →
                  </button>
                </div>

                {/* WBGT High Stress */}
                <div className="border border-outline-variant rounded-lg p-4 bg-surface flex flex-col justify-between border-l-4 border-l-orange-500">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-orange-600 font-mono uppercase">
                      High Stress (WBGT)
                    </span>
                    <span className="material-symbols-outlined text-outline text-lg">device_thermostat</span>
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-primary my-2">
                    &gt; {thresholds.wbgtHigh}°C
                  </div>
                  <p className="text-[11px] text-on-surface-variant mb-3">
                    Wet Bulb Globe Temperature (Stand-Down Trigger)
                  </p>
                  <button
                    onClick={() => {
                      const val = prompt("Enter new High WBGT threshold (°C):", thresholds.wbgtHigh.toString());
                      if (val && !isNaN(Number(val))) {
                        setThresholds({ ...thresholds, wbgtHigh: Number(val) });
                      }
                    }}
                    className="text-secondary text-xs font-bold uppercase tracking-wider hover:underline text-left"
                  >
                    Edit Threshold →
                  </button>
                </div>

                {/* UTCI Caution */}
                <div className="border border-outline-variant rounded-lg p-4 bg-surface flex flex-col justify-between border-l-4 border-l-amber-400">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-amber-700 font-mono uppercase">
                      Caution Risk (UTCI)
                    </span>
                    <span className="material-symbols-outlined text-outline text-lg">wb_sunny</span>
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-primary my-2">
                    &gt; {thresholds.utciCaution}°C
                  </div>
                  <p className="text-[11px] text-on-surface-variant mb-3">
                    Early Advisory for Vulnerable Demographics
                  </p>
                  <button
                    onClick={() => {
                      const val = prompt("Enter new Caution UTCI threshold (°C):", thresholds.utciCaution.toString());
                      if (val && !isNaN(Number(val))) {
                        setThresholds({ ...thresholds, utciCaution: Number(val) });
                      }
                    }}
                    className="text-secondary text-xs font-bold uppercase tracking-wider hover:underline text-left"
                  >
                    Edit Threshold →
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Communication Dispatch Channels */}
            <div className="xl:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs flex flex-col">
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary font-mono mb-4 flex items-center gap-2 border-b border-outline-variant pb-2">
                <span className="material-symbols-outlined text-secondary">podcasts</span>
                Dispatch Channels
              </h3>
              <div className="flex-1 flex flex-col gap-2.5">
                {/* SMS */}
                <div className="flex items-center justify-between p-3 border border-outline-variant rounded-lg bg-surface">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">sms</span>
                    <div>
                      <div className="font-bold text-xs text-primary font-mono">National SMS Gateway</div>
                      <div className="text-[11px] text-emerald-600 font-semibold font-mono">
                        {channels.sms ? "● Operational (NIC Push)" : "○ Disabled"}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={channels.sms}
                    onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                    className="h-5 w-5 rounded accent-secondary cursor-pointer"
                  />
                </div>

                {/* WhatsApp */}
                <div className="flex items-center justify-between p-3 border border-outline-variant rounded-lg bg-surface">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-600">chat</span>
                    <div>
                      <div className="font-bold text-xs text-primary font-mono">WhatsApp Official API</div>
                      <div className="text-[11px] text-emerald-600 font-semibold font-mono">
                        {channels.whatsapp ? "● Operational (Meta Cloud)" : "○ Disabled"}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={channels.whatsapp}
                    onChange={(e) => setChannels({ ...channels, whatsapp: e.target.checked })}
                    className="h-5 w-5 rounded accent-secondary cursor-pointer"
                  />
                </div>

                {/* Power Discom */}
                <div className="flex items-center justify-between p-3 border border-outline-variant rounded-lg bg-surface">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-600">bolt</span>
                    <div>
                      <div className="font-bold text-xs text-primary font-mono">Discom Grid Alert</div>
                      <div className="text-[11px] text-on-surface-variant font-mono">
                        {channels.discom ? "● Automated Sync Active" : "○ Disabled"}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={channels.discom}
                    onChange={(e) => setChannels({ ...channels, discom: e.target.checked })}
                    className="h-5 w-5 rounded accent-secondary cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Recipient Groups & 4. Live Alert Status */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            {/* Recipient Groups */}
            <div className="xl:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs flex flex-col">
              <div className="flex justify-between items-center mb-3 border-b border-outline-variant pb-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-primary font-mono flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">group</span>
                  Target Recipient Pools
                </h3>
                <span className="text-[11px] font-mono text-on-surface-variant">724 Active</span>
              </div>
              <div className="space-y-2 flex-1">
                {targetAudience.map((group, idx) => (
                  <div
                    key={idx}
                    onClick={() => setIsRecipientModalOpen(true)}
                    className="flex items-center justify-between p-2.5 bg-surface border border-outline-variant rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-xs text-primary font-mono">{group.role}</div>
                      <div className="text-[11px] text-on-surface-variant font-mono">
                        {group.contacts} Verified Contacts
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIsRecipientModalOpen(true)}
                className="w-full mt-3 py-2 border border-secondary text-secondary rounded font-bold text-xs uppercase tracking-wider hover:bg-secondary-fixed transition-colors font-mono flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">ring_volume</span>
                Manage Recipient Numbers
              </button>
            </div>

            {/* Live 24-Hour Dispatch History */}
            <div className="xl:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-xs flex flex-col">
              <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <h3 className="font-bold text-xs uppercase tracking-wider text-primary font-mono flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">history</span>
                  Protocol Dispatch History (Past 24 Hours)
                </h3>
                <span className="text-[10px] font-mono font-bold bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                  AUTO-RECORDED
                </span>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead className="bg-surface text-on-surface-variant uppercase text-[10px] border-b border-outline-variant">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Impacted Region</th>
                      <th className="p-3">Trigger Condition</th>
                      <th className="p-3">Recipients Reached</th>
                      <th className="p-3">Delivery Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60">
                    {dispatchHistory.map((row) => (
                      <tr key={row.id} className="hover:bg-surface transition-colors">
                        <td className="p-3 text-on-surface-variant">{row.time}</td>
                        <td className="p-3 font-bold text-primary">{row.region}</td>
                        <td className="p-3">
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                              row.triggerSeverity === "fatal"
                                ? "bg-red-100 text-error"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {row.trigger}
                          </span>
                        </td>
                        <td className="p-3 text-primary">{row.reach}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                            <span className="material-symbols-outlined text-sm text-emerald-600">
                              check_circle
                            </span>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AIAssistant />
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onBroadcastSuccess={(details) => {
          setDispatchHistory((prev) => [
            {
              id: Date.now(),
              time: "Just Now",
              region: details.region,
              trigger: "Manual Protocol Override",
              triggerSeverity: "fatal",
              reach: `${details.reach.toLocaleString()} Citizens/Officers`,
              status: "Delivered",
            },
            ...prev,
          ]);
        }}
      />
      <RecipientModal
        isOpen={isRecipientModalOpen}
        onClose={() => setIsRecipientModalOpen(false)}
      />
    </div>
  );
}
