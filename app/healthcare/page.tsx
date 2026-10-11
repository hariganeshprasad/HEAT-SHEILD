"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AIAssistant from "../components/AIAssistant";
import EmergencyModal from "../components/EmergencyModal";

export default function HealthcarePage() {
  const [selectedLocation, setSelectedLocation] = useState("Ward 42 - Commercial Hub");
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [filterMedicalOnly, setFilterMedicalOnly] = useState(false);

  const coolingCenters = [
    {
      id: 1,
      name: "Civic Auditorium North",
      address: "142 Sector A Road, Ward 42",
      occupied: 425,
      capacity: 500,
      percentage: 85,
      medical: "First Aid + IV Saline Kiosk",
      hasMedical: true,
      distance: "0.8 km",
      status: "Near Capacity",
      statusColor: "text-amber-700 bg-amber-100",
    },
    {
      id: 2,
      name: "Community Hall Ward 42",
      address: "Near Market Square, Ward 42",
      occupied: 190,
      capacity: 200,
      percentage: 95,
      medical: "Basic First Aid & ORS Depot",
      hasMedical: true,
      distance: "1.2 km",
      status: "Critical Full",
      statusColor: "text-error bg-red-100",
    },
    {
      id: 3,
      name: "Metro Station Underground Hall",
      address: "Concourse Level B, Metro Gate 2",
      occupied: 400,
      capacity: 1000,
      percentage: 40,
      medical: "AC Rest Zone (No dedicated staff)",
      hasMedical: false,
      distance: "2.1 km",
      status: "Available",
      statusColor: "text-emerald-700 bg-emerald-100",
    },
    {
      id: 4,
      name: "Govt Senior Secondary School Shelter",
      address: "East Gate Road, Sector 8",
      occupied: 120,
      capacity: 350,
      percentage: 34,
      medical: "Mobile Health Van Stationed",
      hasMedical: true,
      distance: "2.8 km",
      status: "Available",
      statusColor: "text-emerald-700 bg-emerald-100",
    },
  ];

  const filteredCenters = filterMedicalOnly
    ? coolingCenters.filter((c) => c.hasMedical)
    : coolingCenters;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-on-surface">
      <Header onOpenEmergency={() => setIsEmergencyOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar onOpenEmergency={() => setIsEmergencyOpen(true)} />

        <main className="flex-1 bg-surface flex flex-col overflow-y-auto">
          {/* Extreme Alert Banner */}
          <div className="w-full bg-error text-on-error py-2 px-6 flex items-center justify-between font-mono text-xs font-bold animate-pulse shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base fill">warning</span>
              <span>HEATSHIELD ALERT: WBGT EXCEEDS SAFE OCCUPATIONAL LIMITS (&gt; 32.0°C).</span>
            </div>
            <span className="bg-white text-error px-2 py-0.5 rounded text-[10px] uppercase font-bold">
              STAND-DOWN MANDATED
            </span>
          </div>

          {/* Header Controls */}
          <div className="bg-surface-container-lowest border-b border-outline-variant px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
            <div>
              <h2 className="text-xl font-extrabold text-primary font-mono tracking-tight uppercase">
                HeatShield Healthcare & Safety Response
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Real-time cooling infrastructure locator, occupational stand-down enforcement, and heat pathology triage.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setSelectedLocation("Ward 42 - Commercial Hub (Current Location)");
                  alert("HeatShield GPS: Identified Ward 42, Ahmedabad Metro (West Sector).");
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-secondary text-white rounded text-xs font-bold font-mono hover:bg-secondary/90 transition-colors shrink-0 shadow-xs"
              >
                <span className="material-symbols-outlined text-base">my_location</span>
                Detect Location
              </button>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 bg-surface border border-outline-variant rounded text-xs font-mono text-on-surface focus:ring-1 focus:ring-secondary focus:outline-none"
              >
                <option value="Ward 42 - Commercial Hub">Ward 42 - Commercial Hub (Current)</option>
                <option value="Ward 18 - Residential North">Ward 18 - Residential North</option>
                <option value="Ward 05 - Industrial Zone">Ward 05 - Industrial Zone</option>
                <option value="Ward 99 - Central District">Ward 99 - Central District</option>
              </select>
            </div>
          </div>

          {/* Main Content Dashboard */}
          <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
            {/* Left Column: Work Hour Advisory & Cooling Centers Locator */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {/* Mandatory Work Hour Advisory Card */}
              <div className="bg-surface-container-lowest border-l-4 border-l-error border-y border-r border-outline-variant rounded-r-xl p-5 shadow-xs relative">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl font-bold fill">warning</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                      <h3 className="text-sm font-bold text-primary font-mono uppercase tracking-wide">
                        Mandatory Occupational Stand-Down Active
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded-full border border-secondary/20">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        {selectedLocation}
                      </span>
                    </div>

                    <div className="bg-surface-container p-3 rounded-lg border border-outline-variant my-2">
                      <div className="font-mono text-error font-extrabold text-xs uppercase tracking-wider mb-1">
                        MANDATORY LABOUR SUSPENSION: 11:00 AM — 4:00 PM
                      </div>
                      <p className="text-xs text-on-surface leading-relaxed">
                        No direct outdoor construction, roadwork, or heavy physical labour is permitted under HeatShield & NDMA Section 34 guidelines. All commercial sites must provide unlimited potable water and shaded hydration shelters.
                      </p>
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-mono">
                      Enforced by: HeatShield Directorate, Ministry of Earth Sciences & Health Inspectorate.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cooling Center Locator Interactive Table */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col flex-1 shadow-xs overflow-hidden">
                <div className="p-4 bg-surface-container-low border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-xl">ac_unit</span>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-primary font-mono">
                      Active HeatShield Cooling Shelters
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer font-mono">
                      <input
                        type="checkbox"
                        checked={filterMedicalOnly}
                        onChange={(e) => setFilterMedicalOnly(e.target.checked)}
                        className="rounded accent-secondary"
                      />
                      <span>Medical Staff Only</span>
                    </label>
                    <span className="text-[10px] font-mono font-bold bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                      {filteredCenters.length} Shelters
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead className="bg-surface text-on-surface-variant uppercase text-[10px] border-b border-outline-variant">
                      <tr>
                        <th className="p-3.5">Facility Name & Address</th>
                        <th className="p-3.5">Live Occupancy</th>
                        <th className="p-3.5">Medical Facilities</th>
                        <th className="p-3.5 text-right">Proximity</th>
                        <th className="p-3.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/60">
                      {filteredCenters.map((center) => (
                        <tr key={center.id} className="hover:bg-surface transition-colors">
                          <td className="p-3.5">
                            <p className="font-bold text-primary">{center.name}</p>
                            <p className="text-on-surface-variant text-[11px] mt-0.5">{center.address}</p>
                          </td>
                          <td className="p-3.5">
                            <div className="flex flex-col gap-1 w-32">
                              <div className="flex justify-between text-[10px]">
                                <span className="font-bold">{center.occupied}/{center.capacity}</span>
                                <span>{center.percentage}%</span>
                              </div>
                              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all ${
                                    center.percentage > 90
                                      ? "bg-error"
                                      : center.percentage > 75
                                      ? "bg-amber-500"
                                      : "bg-secondary"
                                  }`}
                                  style={{ width: `${center.percentage}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 bg-surface-container px-2 py-1 rounded text-[11px]">
                              <span
                                className={`material-symbols-outlined text-sm ${
                                  center.hasMedical ? "text-error" : "text-outline"
                                }`}
                              >
                                {center.hasMedical ? "medical_services" : "info"}
                              </span>
                              {center.medical}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-bold text-primary">
                            {center.distance}
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => alert(`Navigating to ${center.name} (${center.address}). Lat/Lon routed to Municipal GIS.`)}
                              className="px-2.5 py-1 bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-white rounded text-[10px] font-bold uppercase transition-colors"
                            >
                              Route
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Clinical Safety Precautions & Heat Stroke Guide */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Emergency Hotline Button */}
              <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-primary font-mono mb-3 border-b border-outline-variant pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-error">emergency</span>
                  Emergency Medical Hotlines
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:108"
                    className="p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-center transition-colors group"
                  >
                    <div className="text-xl font-extrabold text-error font-mono">108</div>
                    <div className="text-[10px] text-red-900 font-bold uppercase mt-0.5">
                      Ambulance EWS
                    </div>
                  </a>
                  <a
                    href="tel:1077"
                    className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-center transition-colors group"
                  >
                    <div className="text-xl font-extrabold text-secondary font-mono">1077</div>
                    <div className="text-[10px] text-blue-900 font-bold uppercase mt-0.5">
                      Disaster Control
                    </div>
                  </a>
                </div>
              </div>

              {/* Safety Precautions Bento */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col gap-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-primary font-mono border-b border-outline-variant pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">health_and_safety</span>
                  Clinical Safety Directives
                </h3>

                {/* Hydration */}
                <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                  <div className="flex items-center gap-2 mb-1 text-primary">
                    <span className="material-symbols-outlined text-secondary text-base">water_drop</span>
                    <h4 className="font-bold text-xs font-mono">Aggressive Hydration Protocol</h4>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Consume 1 litre of electrolyte/ORS water per hour during outdoor exposure. Do not wait for thirst. Strictly avoid caffeinated & high-sugar beverages.
                  </p>
                </div>

                {/* Rapid Cooling */}
                <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                  <div className="flex items-center gap-2 mb-1 text-primary">
                    <span className="material-symbols-outlined text-secondary text-base">device_thermostat</span>
                    <h4 className="font-bold text-xs font-mono">Rapid Evaporative Cooling</h4>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Apply cold, wet towels to major pulse vascular zones (neck, groin, armpits) if dizziness occurs. Relocate to shaded airflow or AC immediately.
                  </p>
                </div>

                {/* Heat Stroke Signs */}
                <div className="bg-error-container/20 p-3.5 rounded-lg border border-error/40">
                  <div className="flex items-center gap-2 mb-2 text-error">
                    <span className="material-symbols-outlined text-lg fill">warning</span>
                    <h4 className="font-bold text-xs font-mono uppercase">Heat Stroke Warning Signs</h4>
                  </div>
                  <ul className="space-y-1 text-xs text-on-surface font-mono">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-error" />
                      Core body temp &gt; 103°F (39.4°C)
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-error" />
                      Hot, red, dry, or non-sweating skin
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-error" />
                      Rapid, bounding arterial pulse
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-error" />
                      Confusion, slurred speech, or delirium
                    </li>
                  </ul>
                </div>
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
