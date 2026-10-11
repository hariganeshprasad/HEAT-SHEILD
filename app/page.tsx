"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import AIAssistant from "./components/AIAssistant";
import EmergencyModal from "./components/EmergencyModal";
import GoogleStyleMap, { HOTSPOTS_DATA, LocationTelemetry } from "./components/GoogleStyleMap";
import { useLanguage } from "./context/LanguageContext";
import { fetchLiveWeatherTelemetry } from "./services/weatherService";

export default function GISDashboardPage() {
  const { t } = useLanguage();
  const [selectedHotspot, setSelectedHotspot] = useState<LocationTelemetry>(HOTSPOTS_DATA[0]);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dataSource, setDataSource] = useState("Google Weather API / Live Satellite");
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>("ALL");
  const [citySearchTerm, setCitySearchTerm] = useState<string>("");

  // Initial and Periodic Fetch from Weather API
  const refreshLiveTelemetry = async (loc?: LocationTelemetry) => {
    const target = loc || selectedHotspot;
    setIsRefreshing(true);
    const live = await fetchLiveWeatherTelemetry(target.lat, target.lng);
    setIsRefreshing(false);

    setDataSource(live.source);
    setSelectedHotspot((prev) => ({
      ...prev,
      temp: live.temp,
      solarRadiation: live.solarRadiation,
      windSpeed: live.windSpeed,
      humidity: live.humidity,
      wbgt: live.wbgt,
      risk: live.risk,
      source: live.source,
    }));
  };

  useEffect(() => {
    refreshLiveTelemetry(HOTSPOTS_DATA[0]);
    const interval = setInterval(() => {
      refreshLiveTelemetry();
    }, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const filteredHotspots = HOTSPOTS_DATA.filter((spot) => {
    const matchesRegion = selectedRegionFilter === "ALL" || spot.region === selectedRegionFilter;
    const matchesSearch =
      spot.name.toLowerCase().includes(citySearchTerm.toLowerCase()) ||
      spot.state.toLowerCase().includes(citySearchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const [tickerItems, setTickerItems] = useState([
    "[ALERT] 10:42 AM - SMS pushed to Jodhpur & Phalodi District officials.",
    "[UPDATE] 10:40 AM - WhatsApp advisory dispatched to Telangana & AP community leaders.",
    "[SYSTEM] 10:35 AM - Google Weather API lookup active across 48 monitored Indian cities.",
    "[DISPATCH] 10:20 AM - 12 Water Tankers mobilized to Ahmedabad West & Surat.",
    "[ALERT] 10:15 AM - High WBGT reading (33.8°C) detected at Delhi Airport station.",
  ]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-on-surface">
      <Header onOpenEmergency={() => setIsEmergencyOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar onOpenEmergency={() => setIsEmergencyOpen(true)} />

        <main className="flex-1 flex flex-col relative bg-surface overflow-hidden">
          {/* Critical Alert Banner */}
          <div className="w-full bg-error text-on-error px-6 py-2 flex items-center justify-between blink-bg border-b border-error-container shrink-0 z-20 shadow-sm">
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wide">
              <span className="material-symbols-outlined text-lg fill">error</span>
              <span>{t("fatalBanner")}</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/ward-analytics"
                className="text-white underline font-semibold text-xs hover:opacity-90 transition-opacity hidden sm:inline"
              >
                {t("viewDetails")}
              </Link>
              <button
                onClick={() => setIsEmergencyOpen(true)}
                className="bg-white text-error font-bold text-xs px-3 py-1 rounded hover:bg-error-container transition-colors uppercase tracking-wider"
              >
                {t("dispatchDirective")}
              </button>
            </div>
          </div>

          {/* Real-Time Live Weather Telemetry Header Bar */}
          <div className="bg-surface-container-lowest border-b border-outline-variant px-4 py-2.5 shrink-0 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-primary uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-secondary">LIVE TELEMETRY:</span>
                  <span className="text-on-surface bg-surface-container px-2 py-0.5 rounded">
                    {selectedHotspot.name} ({selectedHotspot.state})
                  </span>
                </div>
                <div className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-emerald-600">cloud_done</span>
                  <span>{selectedHotspot.source || dataSource}</span>
                </div>
                <button
                  onClick={() => refreshLiveTelemetry()}
                  disabled={isRefreshing}
                  className="text-[11px] font-mono text-secondary hover:underline flex items-center gap-1 disabled:opacity-50"
                  title="Force Refresh Weather API"
                >
                  <span className={`material-symbols-outlined text-sm ${isRefreshing ? "animate-spin" : ""}`}>
                    refresh
                  </span>
                  <span>{isRefreshing ? "Fetching..." : "Refresh"}</span>
                </button>
              </div>

              {/* Real-Time 4-Metric Grid: Temperature, Solar Radiation, Wind Speed, Humidity */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 xl:gap-4 font-mono">
                {/* 1. Real-Time Temperature */}
                <div className="flex items-center gap-2.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-error flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg font-bold">thermostat</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-semibold block leading-tight">
                      {t("temperature")}
                    </span>
                    <div className="text-sm font-extrabold text-error leading-tight">
                      {selectedHotspot.temp}°C
                    </div>
                  </div>
                </div>

                {/* 2. Real-Time Solar Radiation */}
                <div className="flex items-center gap-2.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg font-bold">sunny</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-semibold block leading-tight">
                      {t("solarRadiation")}
                    </span>
                    <div className="text-sm font-extrabold text-amber-900 leading-tight">
                      {selectedHotspot.solarRadiation} <span className="text-[10px] font-normal">W/m²</span>
                    </div>
                  </div>
                </div>

                {/* 3. Real-Time Wind Speed */}
                <div className="flex items-center gap-2.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg font-bold">air</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-semibold block leading-tight">
                      {t("windSpeed")}
                    </span>
                    <div className="text-sm font-extrabold text-secondary leading-tight">
                      {selectedHotspot.windSpeed} <span className="text-[10px] font-normal">km/h</span>
                    </div>
                  </div>
                </div>

                {/* 4. Real-Time Humidity */}
                <div className="flex items-center gap-2.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg font-bold">water_drop</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-semibold block leading-tight">
                      {t("humidity")}
                    </span>
                    <div className="text-sm font-extrabold text-cyan-900 leading-tight">
                      {selectedHotspot.humidity}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas & Sidebar Split */}
          <div className="flex-1 flex flex-col lg:flex-row p-3 gap-3 overflow-hidden">
            {/* Central Map Canvas (Google Maps Architecture with all major cities) */}
            <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg relative overflow-hidden flex flex-col shadow-xs min-h-[380px]">
              <div className="flex-1 relative w-full h-full">
                <GoogleStyleMap
                  selectedLocation={selectedHotspot}
                  onSelectLocation={(loc) => {
                    setSelectedHotspot(loc);
                    setDataSource(loc.source || "Google Weather API");
                  }}
                />
              </div>

              {/* Live Ticker (Bottom of Map) */}
              <div className="bg-primary text-on-primary-container px-4 py-2 flex items-center gap-3 border-t border-primary-container shrink-0 z-20 overflow-hidden">
                <span className="material-symbols-outlined text-base text-secondary-container animate-pulse shrink-0">
                  podcasts
                </span>
                <div className="overflow-hidden flex-1 relative h-5">
                  <div className="whitespace-nowrap absolute left-0 flex gap-8 animate-[ticker_25s_linear_infinite] font-mono text-xs text-white">
                    {tickerItems.map((item, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Data Telemetry Sidebar with All Cities Explorer */}
            <div className="w-full lg:w-80 xl:w-92 flex flex-col gap-3 shrink-0 overflow-y-auto pr-0.5">
              {/* Selected Location Card */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3.5 shadow-xs flex flex-col gap-2">
                <div className="flex justify-between items-center border-b border-outline-variant pb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1 font-mono">
                    <span className="material-symbols-outlined text-sm text-secondary">my_location</span>
                    {t("monitoredLocation")}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono text-white ${
                      selectedHotspot.risk === "FATAL"
                        ? "bg-error"
                        : selectedHotspot.risk === "EXTREME"
                        ? "bg-orange-600"
                        : selectedHotspot.risk === "HIGH"
                        ? "bg-amber-600"
                        : "bg-emerald-600"
                    }`}
                  >
                    {selectedHotspot.risk}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-base font-bold text-on-surface">{selectedHotspot.name}</span>
                  <span className="text-xs text-outline font-mono">{selectedHotspot.state}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant font-sans">{selectedHotspot.description}</p>
                <div className="grid grid-cols-2 gap-2 mt-1 bg-surface-container-low p-2 rounded border border-outline-variant">
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-mono block">Solar Flux</span>
                    <span className="font-mono text-sm font-bold text-on-surface">{selectedHotspot.solarRadiation} W/m²</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-mono block">Wind Gusts</span>
                    <span className="font-mono text-sm font-bold text-secondary">{selectedHotspot.windSpeed} km/h</span>
                  </div>
                </div>
              </div>

              {/* National Summary Card */}
              <div className="bg-surface-container-lowest border-l-4 border-error border-y border-r border-y-outline-variant border-r-outline-variant rounded-r-lg p-3.5 shadow-xs flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                  <h3 className="font-bold text-sm text-primary uppercase font-mono tracking-tight">
                    {t("nationalSummary")}
                  </h3>
                  <span className="text-[10px] bg-error-container text-on-error-container px-2 py-0.5 rounded font-mono font-bold">
                    CODE RED
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant uppercase font-mono">{t("extremeRiskWards")}</span>
                    <span className="text-3xl font-extrabold text-error font-mono tracking-tight">48 Cities</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant uppercase font-mono">{t("activeDirectives")}</span>
                    <span className="text-3xl font-extrabold text-secondary font-mono tracking-tight">24 Active</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEmergencyOpen(true)}
                  className="w-full py-2 bg-secondary text-on-secondary font-bold text-xs uppercase tracking-wider rounded hover:bg-secondary/90 transition-colors shadow-xs"
                >
                  {t("generateDirective")}
                </button>
              </div>

              {/* All Major Cities Telemetry Explorer */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3.5 shadow-xs flex flex-col flex-1">
                <div className="flex flex-col gap-2 border-b border-outline-variant pb-2 mb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-primary uppercase font-mono tracking-wider">
                      Major Cities Weather Index
                    </h3>
                    <span className="text-[10px] bg-secondary-container text-on-secondary-container font-mono px-2 py-0.5 rounded font-bold">
                      {filteredHotspots.length} / {HOTSPOTS_DATA.length} Cities
                    </span>
                  </div>

                  {/* City Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={citySearchTerm}
                      onChange={(e) => setCitySearchTerm(e.target.value)}
                      placeholder="Filter city (e.g. Mumbai, Hyderabad)..."
                      className="w-full px-2.5 py-1.5 bg-surface border border-outline-variant rounded text-xs text-on-surface font-sans placeholder-outline focus:outline-none focus:ring-1 focus:ring-secondary"
                    />
                  </div>

                  {/* Regional Filters */}
                  <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar text-[10px] font-mono font-bold">
                    {["ALL", "North", "South", "West", "East", "Central"].map((r) => (
                      <button
                        key={r}
                        onClick={() => setSelectedRegionFilter(r)}
                        className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                          selectedRegionFilter === r
                            ? "bg-secondary text-white shadow-xs"
                            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cities Scrollable List */}
                <div className="flex flex-col gap-1.5 font-mono text-xs max-h-72 overflow-y-auto pr-1">
                  {filteredHotspots.map((spot) => (
                    <div
                      key={spot.id}
                      onClick={async () => {
                        setSelectedHotspot(spot);
                        refreshLiveTelemetry(spot);
                      }}
                      className={`flex justify-between items-center p-2 rounded cursor-pointer transition-colors border ${
                        selectedHotspot.id === spot.id
                          ? "bg-secondary-container/20 border-secondary ring-1 ring-secondary"
                          : "hover:bg-surface border-outline-variant/40"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-on-surface font-bold">{spot.name}</span>
                          <span className="text-[9px] text-outline font-sans">({spot.state})</span>
                        </div>
                        <span className="text-[10px] text-outline">
                          ☀️ {spot.solarRadiation} W/m² | 💨 {spot.windSpeed} km/h | 💧 {spot.humidity}%
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold text-white ${
                            spot.risk === "FATAL"
                              ? "bg-error"
                              : spot.risk === "EXTREME"
                              ? "bg-orange-600"
                              : spot.risk === "HIGH"
                              ? "bg-amber-600"
                              : "bg-emerald-600"
                          }`}
                        >
                          {spot.risk}
                        </span>
                        <span className="text-[11px] font-bold text-error mt-0.5">{spot.temp}°C</span>
                      </div>
                    </div>
                  ))}
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
        onBroadcastSuccess={(details) => {
          setTickerItems((prev) => [
            `[EMERGENCY] Just Now - Manual Broadcast executed for ${details.region} (${details.reach.toLocaleString()} reached)`,
            ...prev,
          ]);
        }}
      />
    </div>
  );
}
