"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AIAssistant from "../components/AIAssistant";
import EmergencyModal from "../components/EmergencyModal";

export default function WardAnalyticsPage() {
  const [selectedWard, setSelectedWard] = useState("ward42");
  const [timeRange, setTimeRange] = useState("next5");
  const [activeSeries, setActiveSeries] = useState({
    utci: true,
    temp: true,
    humidity: true,
  });

  const [checklist, setChecklist] = useState({
    coolingCenter: true,
    waterTankers: true,
    medicalVans: false,
    standDownNotice: true,
  });

  const [dispatched, setDispatched] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [wardChatInput, setWardChatInput] = useState("");
  const [wardChatMessages, setWardChatMessages] = useState([
    {
      sender: "ai",
      text: "Based on the 42.4°C UTCI projection for Day 3, historical data for Ward 42 indicates a high likelihood of power outages in the eastern grid. Recommend coordinating with local discoms immediately.",
    },
  ]);

  const wardsData: Record<
    string,
    {
      name: string;
      region: string;
      coords: string;
      zone: string;
      utciPeak: number;
      ambientPeak: number;
      humidityAvg: number;
      mortalityRisk: string;
      mortalitySpike: string;
      elderly: string;
      workers: string;
      slums: string;
      chartData: Array<{ day: string; utci: number; temp: number; humidity: number }>;
    }
  > = {
    ward42: {
      name: "Ward 42, Ahmedabad",
      region: "Gujarat",
      coords: "Lat: 23.0225° N, Lon: 72.5714° E",
      zone: "West Sector",
      utciPeak: 42.4,
      ambientPeak: 44.1,
      humidityAvg: 38,
      mortalityRisk: "High",
      mortalitySpike: "+45% Expected Spike in ER Visits",
      elderly: "14,230 (18%)",
      workers: "22,500 (28%)",
      slums: "4 Dense Zones",
      chartData: [
        { day: "Day 1 (Today)", utci: 38.5, temp: 40.2, humidity: 42 },
        { day: "Day 2", utci: 40.2, temp: 42.0, humidity: 39 },
        { day: "Day 3 (Peak)", utci: 42.4, temp: 44.1, humidity: 38 },
        { day: "Day 4", utci: 41.0, temp: 43.0, humidity: 37 },
        { day: "Day 5", utci: 39.1, temp: 41.5, humidity: 41 },
      ],
    },
    ward12: {
      name: "Ward 12, Delhi NCR",
      region: "Delhi",
      coords: "Lat: 28.6139° N, Lon: 77.2090° E",
      zone: "North-East Sector",
      utciPeak: 41.2,
      ambientPeak: 43.0,
      humidityAvg: 48,
      mortalityRisk: "High",
      mortalitySpike: "+38% Expected Spike in ER Visits",
      elderly: "18,400 (15%)",
      workers: "31,200 (25%)",
      slums: "6 Dense Zones",
      chartData: [
        { day: "Day 1 (Today)", utci: 37.2, temp: 39.5, humidity: 52 },
        { day: "Day 2", utci: 39.0, temp: 41.2, humidity: 50 },
        { day: "Day 3 (Peak)", utci: 41.2, temp: 43.0, humidity: 48 },
        { day: "Day 4", utci: 40.4, temp: 42.1, humidity: 46 },
        { day: "Day 5", utci: 38.0, temp: 40.0, humidity: 49 },
      ],
    },
    ward14: {
      name: "Ward 14, Jodhpur",
      region: "Rajasthan",
      coords: "Lat: 26.2389° N, Lon: 73.0243° E",
      zone: "Thar Basin",
      utciPeak: 45.8,
      ambientPeak: 46.5,
      humidityAvg: 22,
      mortalityRisk: "Fatal",
      mortalitySpike: "+72% Expected Spike in ER Visits",
      elderly: "9,800 (12%)",
      workers: "19,400 (34%)",
      slums: "8 Rural Clusters",
      chartData: [
        { day: "Day 1 (Today)", utci: 42.1, temp: 43.8, humidity: 25 },
        { day: "Day 2", utci: 44.0, temp: 45.2, humidity: 23 },
        { day: "Day 3 (Peak)", utci: 45.8, temp: 46.5, humidity: 22 },
        { day: "Day 4", utci: 44.9, temp: 45.8, humidity: 24 },
        { day: "Day 5", utci: 43.2, temp: 44.0, humidity: 26 },
      ],
    },
  };

  const currentWard = wardsData[selectedWard] || wardsData.ward42;

  const handleDispatchAll = () => {
    setDispatched(true);
    setTimeout(() => setDispatched(false), 4000);
  };

  const handleWardChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wardChatInput.trim()) return;

    const userText = wardChatInput;
    setWardChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setWardChatInput("");

    setTimeout(() => {
      let reply = `Analysis for ${currentWard.name}: Implementing shaded cooling kiosks near high density informal settlements is recommended to mitigate the projected peak on Day 3.`;
      if (userText.toLowerCase().includes("cooling") || userText.toLowerCase().includes("center")) {
        reply = `Active cooling centers in ${currentWard.name} are equipped with ORS, IV saline hydration, and air cooling units. Operating hours extended to 8:00 AM - 8:00 PM.`;
      }
      setWardChatMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 600);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-on-surface">
      <Header onOpenEmergency={() => setIsEmergencyOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar onOpenEmergency={() => setIsEmergencyOpen(true)} />

        <main className="flex-1 bg-surface flex flex-col overflow-y-auto">
          {/* Critical Alert Banner */}
          <div className="bg-error-container text-on-error-container px-6 py-2.5 flex items-center justify-between border-b border-error blinking-bg-soft shrink-0">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-error text-xl font-bold">warning</span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="font-bold text-xs uppercase tracking-wider text-error font-mono">
                  CRITICAL ALERT: SEVERE THERMAL WAVE
                </span>
                <span className="text-xs text-on-surface">
                  Projected UTCI exceeding {currentWard.utciPeak}°C in 3 days for {currentWard.name}.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEmergencyOpen(true)}
              className="font-bold text-xs bg-error text-on-error px-3.5 py-1 rounded hover:bg-red-800 transition-colors uppercase tracking-wider shadow-xs shrink-0"
            >
              Activate Protocol
            </button>
          </div>

          {/* Main Grid Content */}
          <div className="p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1">
            {/* Left Column: Core Data & Multi-Line Chart */}
            <div className="xl:col-span-8 flex flex-col gap-4">
              {/* Header Card with Ward Selector */}
              <div className="flex flex-col md:flex-row md:items-center justify-between bg-surface-container-lowest border border-outline-variant p-4 rounded-lg shadow-xs gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-extrabold text-primary font-mono tracking-tight">
                      {currentWard.name}
                    </h1>
                    <span className="bg-error-container text-error px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                      {currentWard.mortalityRisk.toUpperCase()} RISK
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1 font-mono">
                    <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
                    {currentWard.coords} | Zone: {currentWard.zone}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Ward Switcher */}
                  <select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    className="bg-surface border border-outline-variant rounded text-primary font-mono text-xs p-2 focus:ring-1 focus:ring-secondary focus:outline-none"
                  >
                    <option value="ward42">Ward 42, Ahmedabad (West Zone)</option>
                    <option value="ward12">Ward 12, Delhi NCR (North-East)</option>
                    <option value="ward14">Ward 14, Jodhpur (Thar Basin)</option>
                  </select>

                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-surface border border-outline-variant rounded text-primary font-mono text-xs p-2 focus:ring-1 focus:ring-secondary focus:outline-none"
                  >
                    <option value="past7">Past 7 Days</option>
                    <option value="next5">Next 5 Days (Projected)</option>
                  </select>

                  <button
                    onClick={() => alert(`Exporting 5-day thermal forecast telemetry for ${currentWard.name} (CSV format).`)}
                    className="bg-secondary text-on-secondary px-3 py-2 rounded hover:bg-secondary/90 transition-colors text-xs font-bold font-mono flex items-center gap-1 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    EXPORT
                  </button>
                </div>
              </div>

              {/* Multi-Line Projection Chart Card */}
              <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg flex-1 flex flex-col min-h-[380px] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant pb-3 mb-4 gap-2">
                  <h3 className="font-bold text-sm text-primary flex items-center gap-2 font-mono uppercase tracking-wide">
                    <span className="material-symbols-outlined text-secondary">stacked_line_chart</span>
                    Environmental Stress vs UTCI Projection (5-Day Trajectory)
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-on-surface-variant font-mono">Telemetry Source:</span>
                    <span className="text-[11px] bg-surface-container px-2 py-0.5 rounded font-mono font-bold text-primary">
                      IMD WRF 3km
                    </span>
                  </div>
                </div>

                {/* Visual Chart Canvas */}
                <div className="flex-1 relative w-full min-h-[260px] bg-surface-container-low border border-outline-variant/60 rounded p-4 flex flex-col justify-between">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="w-full h-px bg-outline-variant" />
                    <div className="w-full h-px bg-outline-variant" />
                    <div className="w-full h-px bg-outline-variant" />
                    <div className="w-full h-px bg-outline-variant" />
                  </div>

                  {/* SVG Multi-Line Trend */}
                  <div className="relative w-full h-44 flex items-end justify-between px-6 pt-4">
                    {/* SVG Line visualization */}
                    <svg className="absolute inset-0 w-full h-full p-6 overflow-visible">
                      {/* UTCI Curve (Red) */}
                      {activeSeries.utci && (
                        <polyline
                          fill="none"
                          stroke="#ba1a1a"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points="30,90 140,65 250,20 360,45 470,80"
                          className="transition-all duration-300"
                        />
                      )}
                      {/* Ambient Temp (Orange) */}
                      {activeSeries.temp && (
                        <polyline
                          fill="none"
                          stroke="#f57c00"
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                          points="30,80 140,55 250,15 360,35 470,65"
                          className="transition-all duration-300"
                        />
                      )}
                      {/* Humidity Curve (Blue) */}
                      {activeSeries.humidity && (
                        <polyline
                          fill="none"
                          stroke="#115cb9"
                          strokeWidth="2"
                          points="30,70 140,85 250,105 360,95 470,75"
                          className="transition-all duration-300"
                        />
                      )}
                    </svg>

                    {/* Interactive Data Points Columns */}
                    {currentWard.chartData.map((d, index) => (
                      <div
                        key={index}
                        className="relative z-10 flex flex-col items-center group cursor-pointer"
                      >
                        {/* Hover Popup */}
                        <div className="absolute -top-20 bg-primary text-white text-[11px] p-2 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-mono pointer-events-none z-30">
                          <div className="font-bold text-secondary-fixed">{d.day}</div>
                          <div>UTCI: {d.utci}°C</div>
                          <div>Ambient: {d.temp}°C</div>
                          <div>Humidity: {d.humidity}%</div>
                        </div>

                        {/* Peak indicator */}
                        {index === 2 && (
                          <div className="absolute -top-7 px-2 py-0.5 bg-error text-white text-[9px] font-bold font-mono rounded-full animate-bounce">
                            PEAK {d.utci}°C
                          </div>
                        )}

                        <div className="w-3 h-3 rounded-full bg-error ring-4 ring-red-100 group-hover:scale-125 transition-transform" />
                      </div>
                    ))}
                  </div>

                  {/* X-Axis Day Labels */}
                  <div className="w-full flex justify-between px-4 font-mono text-xs text-on-surface-variant border-t border-outline-variant/80 pt-2">
                    {currentWard.chartData.map((d, idx) => (
                      <span
                        key={idx}
                        className={`text-center ${
                          idx === 2 ? "font-bold text-error" : ""
                        }`}
                      >
                        {d.day}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Series Toggles & Legend */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-3 border-t border-outline-variant">
                  <button
                    onClick={() =>
                      setActiveSeries({ ...activeSeries, utci: !activeSeries.utci })
                    }
                    className={`flex items-center gap-2 text-xs font-mono font-bold px-2 py-1 rounded transition-opacity ${
                      activeSeries.utci ? "opacity-100 bg-red-50 text-red-900" : "opacity-40"
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-error" />
                    <span>UTCI Stress (°C)</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveSeries({ ...activeSeries, temp: !activeSeries.temp })
                    }
                    className={`flex items-center gap-2 text-xs font-mono font-bold px-2 py-1 rounded transition-opacity ${
                      activeSeries.temp ? "opacity-100 bg-orange-50 text-orange-900" : "opacity-40"
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>Ambient Temp (°C)</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveSeries({ ...activeSeries, humidity: !activeSeries.humidity })
                    }
                    className={`flex items-center gap-2 text-xs font-mono font-bold px-2 py-1 rounded transition-opacity ${
                      activeSeries.humidity ? "opacity-100 bg-blue-50 text-blue-900" : "opacity-40"
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                    <span>Relative Humidity (%)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Mortality Index, Demographic Vulnerability & SOP */}
            <div className="xl:col-span-4 flex flex-col gap-4">
              {/* Mortality Risk Index Gauge */}
              <div
                id="risk"
                className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg flex flex-col items-center justify-center shadow-xs"
              >
                <div className="w-full flex justify-between items-center border-b border-outline-variant pb-2 mb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-primary font-mono">
                    Mortality Risk Index
                  </h3>
                  <span className="text-[10px] bg-red-100 text-error px-2 py-0.5 rounded font-mono font-bold">
                    MODEL: AI-UTCI 72H
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant w-full text-left mb-3">
                  Projected health impact based on UTCI duration and demographic density.
                </p>

                <div className="relative w-44 h-24 overflow-hidden mb-1 flex items-end justify-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#e0e3e5"
                      strokeLinecap="round"
                      strokeWidth="10"
                    />
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#ba1a1a"
                      strokeDasharray="125"
                      strokeDashoffset="28"
                      strokeLinecap="round"
                      strokeWidth="10"
                    />
                  </svg>
                  <div className="absolute bottom-0 text-center">
                    <span className="text-2xl font-extrabold text-error font-mono tracking-tight">
                      {currentWard.mortalityRisk}
                    </span>
                  </div>
                </div>
                <div className="font-mono text-xs text-error font-bold mt-1 text-center bg-error-container/20 px-3 py-1 rounded w-full">
                  {currentWard.mortalitySpike}
                </div>
              </div>

              {/* Demographic Vulnerability Profile */}
              <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg shadow-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-primary font-mono mb-3 border-b border-outline-variant pb-1.5">
                  Demographic Vulnerability Profile
                </h3>
                <ul className="space-y-2.5 text-xs font-mono">
                  <li className="flex justify-between items-center pb-2 border-b border-outline-variant/60">
                    <span className="flex items-center gap-2 text-on-surface">
                      <span className="material-symbols-outlined text-outline text-base">elderly</span>
                      Elderly Population (&gt;65)
                    </span>
                    <span className="font-bold text-primary">{currentWard.elderly}</span>
                  </li>
                  <li className="flex justify-between items-center pb-2 border-b border-outline-variant/60">
                    <span className="flex items-center gap-2 text-on-surface">
                      <span className="material-symbols-outlined text-outline text-base">construction</span>
                      Outdoor Laborers
                    </span>
                    <span className="font-bold text-primary">{currentWard.workers}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-on-surface">
                      <span className="material-symbols-outlined text-outline text-base">home_work</span>
                      Informal Settlements
                    </span>
                    <span className="font-bold text-error">{currentWard.slums}</span>
                  </li>
                </ul>
              </div>

              {/* Actionable SOP Protocol Checklist */}
              <div className="bg-surface-container-lowest border-l-4 border-error border-y border-r border-y-outline-variant border-r-outline-variant p-4 rounded-r-lg shadow-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-primary font-mono mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-error">assignment_turned_in</span>
                  Required Actions ({currentWard.name})
                </h3>
                <div className="space-y-2 mt-3 text-xs">
                  <label className="flex items-start gap-2.5 p-2 bg-surface-container-low hover:bg-surface-container rounded cursor-pointer transition-colors border border-outline-variant">
                    <input
                      type="checkbox"
                      checked={checklist.coolingCenter}
                      onChange={(e) =>
                        setChecklist({ ...checklist, coolingCenter: e.target.checked })
                      }
                      className="mt-0.5 rounded accent-secondary"
                    />
                    <span className="text-on-surface">
                      Open Cooling Center at Ward Primary School & Community Hall
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 bg-surface-container-low hover:bg-surface-container rounded cursor-pointer transition-colors border border-outline-variant">
                    <input
                      type="checkbox"
                      checked={checklist.waterTankers}
                      onChange={(e) =>
                        setChecklist({ ...checklist, waterTankers: e.target.checked })
                      }
                      className="mt-0.5 rounded accent-secondary"
                    />
                    <span className="text-on-surface">
                      Dispatch 8 Mobile Water Tankers to Informal Settlements
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 bg-surface-container-low hover:bg-surface-container rounded cursor-pointer transition-colors border border-outline-variant">
                    <input
                      type="checkbox"
                      checked={checklist.standDownNotice}
                      onChange={(e) =>
                        setChecklist({ ...checklist, standDownNotice: e.target.checked })
                      }
                      className="mt-0.5 rounded accent-secondary"
                    />
                    <span className="text-on-surface">
                      Transmit Mandatory 11 AM - 4 PM Stand-Down Advisory to Construction Sites
                    </span>
                  </label>

                  {dispatched && (
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-300 font-mono text-[11px] flex items-center gap-2 animate-in fade-in">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                      Dispatches successfully transmitted to municipal nodal officers!
                    </div>
                  )}

                  <button
                    onClick={handleDispatchAll}
                    className="w-full mt-2 bg-secondary text-on-secondary py-2 rounded font-bold text-xs uppercase tracking-wider hover:bg-secondary/90 transition-colors shadow-xs"
                  >
                    DISPATCH ALL DIRECTIVES
                  </button>
                </div>
              </div>

              {/* Embedded Ward Context AI Chat */}
              <div className="bg-surface-container-lowest border border-primary rounded-lg overflow-hidden flex flex-col flex-1 min-h-[220px] shadow-xs">
                <div className="bg-primary text-white px-3 py-2 flex items-center gap-2 border-b border-primary-container">
                  <span className="material-symbols-outlined text-base text-secondary-container">smart_toy</span>
                  <span className="font-bold text-xs uppercase font-mono tracking-wider">
                    HAP Assistant ({currentWard.name})
                  </span>
                </div>
                <div className="p-3 flex-1 overflow-y-auto space-y-2 bg-surface text-xs font-sans max-h-44">
                  {wardChatMessages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded text-xs leading-relaxed ${
                        m.sender === "user"
                          ? "bg-secondary text-white ml-auto max-w-[85%]"
                          : "bg-surface-container-low border border-outline-variant text-on-surface max-w-[90%]"
                      }`}
                    >
                      {m.text}
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={handleWardChatSend}
                  className="p-2 bg-surface-container-low border-t border-outline-variant flex gap-2"
                >
                  <input
                    type="text"
                    value={wardChatInput}
                    onChange={(e) => setWardChatInput(e.target.value)}
                    placeholder="Ask about local power grid or hydration points..."
                    className="flex-1 bg-surface-container-lowest border border-outline-variant rounded px-2.5 py-1.5 text-xs text-on-surface focus:ring-1 focus:ring-secondary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-3 py-1.5 rounded hover:bg-primary-container transition-colors text-xs font-bold"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AIAssistant />
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />
    </div>
  );
}
