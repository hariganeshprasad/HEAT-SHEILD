"use client";

import React, { useState, useEffect } from "react";

export interface Subscriber {
  id: string;
  name: string;
  phone: string;
  channel: "whatsapp" | "sms";
  region: string;
  threshold: "ALL" | "EXTREME" | "FATAL";
  addedAt: string;
  status: "ACTIVE" | "PAUSED";
}

interface RecipientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAlertSent?: (phone: string, channel: string) => void;
}

const DEFAULT_SUBSCRIBERS: Subscriber[] = [
  {
    id: "sub-1",
    name: "District Collectorate Control",
    phone: "+91 98765 43210",
    channel: "whatsapp",
    region: "Western Rajasthan (Phalodi/Jodhpur)",
    threshold: "ALL",
    addedAt: "2026-08-30",
    status: "ACTIVE",
  },
  {
    id: "sub-2",
    name: "CMO Emergency Desk",
    phone: "+91 98111 22334",
    channel: "sms",
    region: "Delhi-NCR (Ward 12)",
    threshold: "EXTREME",
    addedAt: "2026-08-30",
    status: "ACTIVE",
  },
  {
    id: "sub-3",
    name: "Municipal Health Officer",
    phone: "+91 99223 34455",
    channel: "whatsapp",
    region: "Ahmedabad Metro (Ward 42)",
    threshold: "ALL",
    addedAt: "2026-08-30",
    status: "ACTIVE",
  },
  {
    id: "sub-4",
    name: "Hyderabad Disaster Response Center",
    phone: "+91 98490 12345",
    channel: "whatsapp",
    region: "Hyderabad & Vijayawada",
    threshold: "ALL",
    addedAt: "2026-08-30",
    status: "ACTIVE",
  },
];

export default function RecipientModal({
  isOpen,
  onClose,
  onAlertSent,
}: RecipientModalProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(DEFAULT_SUBSCRIBERS);
  const [activeTab, setActiveTab] = useState<"list" | "add" | "bulk">("list");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState<"whatsapp" | "sms">("whatsapp");
  const [region, setRegion] = useState("Western Rajasthan (Phalodi/Jodhpur)");
  const [threshold, setThreshold] = useState<"ALL" | "EXTREME" | "FATAL">("ALL");
  const [bulkNumbers, setBulkNumbers] = useState("");
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("heatshield_subscribers");
      if (stored) {
        setSubscribers(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const saveSubscribers = (newList: Subscriber[]) => {
    setSubscribers(newList);
    try {
      localStorage.setItem("heatshield_subscribers", JSON.stringify(newList));
    } catch {}
  };

  if (!isOpen) return null;

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    const newSub: Subscriber = {
      id: "sub-" + Date.now(),
      name: name.trim() || "Registered Recipient",
      phone: phone.trim(),
      channel,
      region,
      threshold,
      addedAt: new Date().toISOString().split("T")[0],
      status: "ACTIVE",
    };

    const updated = [newSub, ...subscribers];
    saveSubscribers(updated);
    setName("");
    setPhone("");
    setNotificationMsg(`Added ${newSub.phone} to active HeatShield ${newSub.channel.toUpperCase()} subscribers!`);
    setActiveTab("list");
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const handleBulkAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const numbers = bulkNumbers
      .split(/[\n,;]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 5);

    if (numbers.length === 0) return;

    const newSubs: Subscriber[] = numbers.map((n, i) => ({
      id: "sub-bulk-" + Date.now() + "-" + i,
      name: `Recipient ${n.slice(-4)}`,
      phone: n.startsWith("+") ? n : `+91 ${n}`,
      channel,
      region,
      threshold,
      addedAt: new Date().toISOString().split("T")[0],
      status: "ACTIVE",
    }));

    const updated = [...newSubs, ...subscribers];
    saveSubscribers(updated);
    setBulkNumbers("");
    setNotificationMsg(`Successfully imported ${newSubs.length} numbers for HeatShield early warning alerts!`);
    setActiveTab("list");
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const handleDelete = (id: string) => {
    const updated = subscribers.filter((s) => s.id !== id);
    saveSubscribers(updated);
  };

  const handleToggleStatus = (id: string) => {
    const updated = subscribers.map((s) =>
      s.id === id ? { ...s, status: s.status === "ACTIVE" ? ("PAUSED" as const) : ("ACTIVE" as const) } : s
    );
    saveSubscribers(updated);
  };

  const handleSendTestAlert = (sub: Subscriber) => {
    setNotificationMsg(`⚡ Test HeatShield ${sub.channel.toUpperCase()} advisory dispatched to ${sub.phone} (${sub.region})!`);
    if (onAlertSent) {
      onAlertSent(sub.phone, sub.channel);
    }
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-primary text-white p-4 flex items-center justify-between border-b border-primary-container">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-white font-bold">
              <span className="material-symbols-outlined text-lg">ring_volume</span>
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider font-mono">
                HeatShield Alert Numbers Registry
              </h3>
              <p className="text-[11px] text-primary-fixed">
                Register phone numbers for automated SMS & WhatsApp early warning dispatches
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded text-white transition-colors">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="flex border-b border-outline-variant bg-surface-container-low px-4 pt-2 gap-2 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab("list")}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "list" ? "border-secondary text-secondary" : "border-transparent text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
            Active Numbers ({subscribers.length})
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "add" ? "border-secondary text-secondary" : "border-transparent text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-sm">add_call</span>
            + Add Number
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "bulk" ? "border-secondary text-secondary" : "border-transparent text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            Bulk Import
          </button>
        </div>

        {notificationMsg && (
          <div className="mx-4 mt-3 p-2.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
            <span>{notificationMsg}</span>
          </div>
        )}

        <div className="p-4 flex-1 overflow-y-auto">
          {activeTab === "list" && (
            <div className="space-y-3">
              <div className="divide-y divide-outline-variant border border-outline-variant rounded-lg overflow-hidden">
                {subscribers.map((sub) => (
                  <div
                    key={sub.id}
                    className={`p-3 bg-surface hover:bg-surface-container-low transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      sub.status === "PAUSED" ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          sub.channel === "whatsapp" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {sub.channel === "whatsapp" ? "chat" : "sms"}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-primary font-mono">{sub.phone}</span>
                          <span className="text-[11px] text-on-surface-variant font-medium">({sub.name})</span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {sub.channel.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-outline font-mono mt-0.5">Target Zone: {sub.region}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleSendTestAlert(sub)}
                        className="px-2 py-1 bg-secondary text-white rounded text-[10px] font-bold font-mono hover:bg-secondary/90 transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-xs">send</span>
                        Test
                      </button>
                      <button
                        onClick={() => handleToggleStatus(sub.id)}
                        className="px-2 py-1 border border-outline-variant rounded text-[10px] font-mono text-on-surface-variant hover:bg-surface-container"
                      >
                        {sub.status === "ACTIVE" ? "Pause" : "Resume"}
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-1 text-outline hover:text-error rounded hover:bg-red-50"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "add" && (
            <form onSubmit={handleAddSubscriber} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block font-bold text-on-surface uppercase text-[11px] mb-1">
                  Mobile Phone Number <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 bg-surface border border-outline-variant rounded text-xs focus:ring-1 focus:ring-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface uppercase text-[11px] mb-1">
                  Recipient Name / Label
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. My Phone / Personal / Site Officer"
                  className="w-full p-2.5 bg-surface border border-outline-variant rounded text-xs focus:ring-1 focus:ring-secondary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface uppercase text-[11px] mb-1">Channel</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setChannel("whatsapp")}
                      className={`p-2 rounded border flex items-center justify-center gap-1.5 ${
                        channel === "whatsapp" ? "border-emerald-600 bg-emerald-50 font-bold" : "border-outline-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-emerald-600 text-base">chat</span>
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setChannel("sms")}
                      className={`p-2 rounded border flex items-center justify-center gap-1.5 ${
                        channel === "sms" ? "border-secondary bg-blue-50 font-bold" : "border-outline-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-secondary text-base">sms</span>
                      <span>SMS Text</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-on-surface uppercase text-[11px] mb-1">Severity</label>
                  <select
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value as any)}
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded text-xs"
                  >
                    <option value="ALL">All Alerts</option>
                    <option value="EXTREME">Extreme & Fatal Only</option>
                    <option value="FATAL">Fatal Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface uppercase text-[11px] mb-1">Monitored Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-outline-variant rounded text-xs"
                >
                  <option value="Western Rajasthan (Phalodi/Jodhpur)">Western Rajasthan (Phalodi/Jodhpur)</option>
                  <option value="Delhi-NCR (Ward 12)">Delhi-NCR (Ward 12)</option>
                  <option value="Ahmedabad Metro (Ward 42)">Ahmedabad Metro (Ward 42)</option>
                  <option value="Hyderabad & Vijayawada">Hyderabad & Vijayawada</option>
                  <option value="National Overview (All Cities)">National Overview (All Cities)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setActiveTab("list")} className="px-3 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-secondary text-white font-bold rounded shadow-xs">
                  Save & Subscribe to HeatShield
                </button>
              </div>
            </form>
          )}

          {activeTab === "bulk" && (
            <form onSubmit={handleBulkAdd} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block font-bold text-on-surface uppercase text-[11px] mb-1">
                  Phone Numbers (one per line)
                </label>
                <textarea
                  rows={5}
                  required
                  value={bulkNumbers}
                  onChange={(e) => setBulkNumbers(e.target.value)}
                  placeholder="+91 9876543210&#10;+91 9811122334"
                  className="w-full p-2.5 bg-surface border rounded text-xs font-mono"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-secondary text-white font-bold rounded">
                Import All Numbers to HeatShield
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
