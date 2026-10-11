"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RecipientModal from "./RecipientModal";
import FirebaseGoogleSignIn from "./FirebaseGoogleSignIn";
import { useLanguage, LANGUAGES, LanguageCode } from "../context/LanguageContext";

interface HeaderProps {
  onOpenEmergency?: () => void;
}

export default function Header({ onOpenEmergency }: HeaderProps) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [apiSavedMsg, setApiSavedMsg] = useState(false);
  const [googleUser, setGoogleUser] = useState<{ email?: string; name?: string; picture?: string; googleId?: string } | null>(null);

  useEffect(() => {
    try {
      const savedKey = localStorage.getItem("heatshield_google_api_key");
      if (savedKey) setGoogleApiKey(savedKey);

      const savedUser = localStorage.getItem("heatshield_google_user");
      if (savedUser) {
        setGoogleUser(JSON.parse(savedUser));
      }
    } catch {}

    const handleAuthChange = () => {
      try {
        const savedUser = localStorage.getItem("heatshield_google_user");
        setGoogleUser(savedUser ? JSON.parse(savedUser) : null);
      } catch {
        setGoogleUser(null);
      }
    };

    window.addEventListener("heatshield-google-auth-change", handleAuthChange);
    return () => window.removeEventListener("heatshield-google-auth-change", handleAuthChange);
  }, []);

  const handleSaveApiKey = () => {
    try {
      localStorage.setItem("heatshield_google_api_key", googleApiKey.trim());
      setApiSavedMsg(true);
      setTimeout(() => setApiSavedMsg(false), 2500);
    } catch {}
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem("heatshield_google_user");
    } catch {}
    setGoogleUser(null);
    window.dispatchEvent(new CustomEvent("heatshield-google-auth-change"));
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "FATAL ALERT: Western Rajasthan",
      desc: "14 wards exceeding UTCI 42°C threshold. Solar flux > 980 W/m². Immediate stand-down required.",
      time: "2m ago",
      type: "fatal",
    },
    {
      id: 2,
      title: "SMS Broadcast Completed: Jodhpur & Telangana",
      desc: "1,420 automated SMS alerts delivered to field health officers.",
      time: "15m ago",
      type: "info",
    },
    {
      id: 3,
      title: "Cooling Center Status Update",
      desc: "Civic Auditorium North (Ward 42) reached 85% capacity.",
      time: "42m ago",
      type: "warning",
    },
  ]);

  const navItems = [
    { name: t("nationalView"), href: "/" },
    { name: t("stateAnalytics"), href: "/ward-analytics" },
    { name: t("actionCenter"), href: "/hap-center" },
    { name: t("alertBuilder"), href: "/alert-builder" },
    { name: t("healthcare"), href: "/healthcare" },
  ];

  return (
    <>
      <header className="bg-primary text-on-primary border-b border-primary-container flex justify-between items-center w-full px-6 h-16 shrink-0 relative z-50 shadow-sm">
        {/* Left: Brand & Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded bg-secondary flex items-center justify-center text-white shadow-inner group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-colors">
              <span className="material-symbols-outlined text-2xl font-bold">shield</span>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-tight">
                {t("appTitle")}
              </span>
              <span className="text-[10px] text-primary-fixed uppercase tracking-wider block font-mono font-medium">
                {t("appSubtitle")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 h-16 pt-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-t transition-all flex items-center h-full border-b-2 ${
                    isActive
                      ? "text-white border-secondary-container bg-primary-container/40"
                      : "text-on-primary-container border-transparent hover:text-white hover:bg-primary-container/20"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Language Quick Badge, Get Alerts Button, Search, Notifications, Settings, Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Language Selector Pill */}
          <div className="relative hidden sm:block">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-primary-container text-white text-xs font-mono rounded px-2.5 py-1.5 border border-outline/40 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.flag} {lang.native} ({lang.label})
                </option>
              ))}
            </select>
          </div>

          {/* Subscribe Phone Number Button */}
          <button
            onClick={() => setShowRecipientModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-secondary/90 text-white rounded text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-xs active:scale-95 ring-2 ring-secondary/30"
          >
            <span className="material-symbols-outlined text-sm animate-pulse">ring_volume</span>
            <span>{t("getAlerts")}</span>
          </button>

          <FirebaseGoogleSignIn />

          {/* Quick Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="bg-primary-container text-white placeholder-on-primary-container text-xs rounded px-3 py-1.5 pl-8 w-44 xl:w-52 border border-outline/40 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-all"
            />
            <span className="material-symbols-outlined absolute left-2 top-2 text-on-primary-container text-sm pointer-events-none">
              search
            </span>
          </div>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowSettings(false);
              }}
              title="Notifications"
              className="p-2 rounded-full hover:bg-primary-container transition-colors text-white relative active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">notifications_active</span>
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-primary animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest text-on-surface rounded-lg shadow-xl border border-outline-variant z-50 overflow-hidden">
                <div className="p-3 bg-primary text-white flex justify-between items-center border-b border-primary-container">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">emergency</span>
                    <span className="font-bold text-xs uppercase tracking-wider">
                      Live Heat Alerts ({notifications.length})
                    </span>
                  </div>
                  <button
                    onClick={() => setNotifications([])}
                    className="text-[11px] text-primary-fixed hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-on-surface-variant">
                      No active alert triggers.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs transition-colors hover:bg-surface-container-low flex gap-2.5 items-start ${
                          n.type === "fatal" ? "bg-error-container/20 border-l-4 border-error" : ""
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-base shrink-0 mt-0.5 ${
                            n.type === "fatal"
                              ? "text-error fill"
                              : n.type === "warning"
                              ? "text-warning-orange"
                              : "text-secondary"
                          }`}
                        >
                          {n.type === "fatal" ? "warning" : n.type === "warning" ? "info" : "check_circle"}
                        </span>
                        <div className="flex-1">
                          <div className="font-bold text-on-surface">{n.title}</div>
                          <div className="text-on-surface-variant text-[11px] mt-0.5">{n.desc}</div>
                          <div className="text-[10px] text-outline font-mono mt-1">{n.time}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 bg-surface-container border-t border-outline-variant text-center">
                  <Link
                    href="/hap-center"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-secondary font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Open HeatShield Command Center →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Settings button with Language & Google Weather API Key */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setShowNotifications(false);
              }}
              title="Settings"
              className="p-2 rounded-full hover:bg-primary-container transition-colors text-white active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>

            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute right-0 mt-2 w-88 bg-surface-container-lowest text-on-surface rounded-xl shadow-2xl border border-outline-variant z-50 p-4 animate-in fade-in max-h-[85vh] overflow-y-auto">
                <div className="font-bold text-xs uppercase tracking-wider text-on-surface border-b border-outline-variant pb-2 mb-3 flex items-center justify-between">
                  <span>{t("ewsPreferences")}</span>
                  <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded font-mono font-bold">
                    v4.2
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Google Weather API Key Section */}
                  <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                    <label className="block font-bold text-primary text-[11px] uppercase font-mono mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-secondary">cloud</span>
                        Google Weather API Key
                      </span>
                      <span className="text-[9px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                        API Active
                      </span>
                    </label>
                    <p className="text-[10px] text-on-surface-variant mb-1.5">
                      Endpoint: <code className="text-[9px] font-mono text-secondary">weather.googleapis.com/v1/currentConditions:lookup</code>
                    </p>
                    <div className="flex gap-1.5">
                      <input
                        type="password"
                        value={googleApiKey}
                        onChange={(e) => setGoogleApiKey(e.target.value)}
                        placeholder="Paste your Google API Key (e.g. AIzaSy...)"
                        className="flex-1 px-2.5 py-1.5 bg-surface border border-outline-variant rounded text-xs font-mono text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                      />
                      <button
                        onClick={handleSaveApiKey}
                        className="px-3 py-1.5 bg-secondary text-white rounded font-bold font-mono text-xs hover:bg-secondary/90 shadow-xs shrink-0"
                      >
                        Save
                      </button>
                    </div>
                    {apiSavedMsg && (
                      <p className="text-[10px] font-mono text-emerald-700 font-bold mt-1 animate-in fade-in">
                        ✓ API Key saved! Live Google Weather sync updated.
                      </p>
                    )}
                  </div>

                  {/* Mother Tongue / Language Selection Section */}
                  <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                    <label className="block font-bold text-primary text-[11px] uppercase font-mono mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-secondary">translate</span>
                      {t("selectLanguage")}
                    </label>
                    <p className="text-[10px] text-on-surface-variant mb-2">
                      {t("languageSettingDesc")}
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1 font-sans">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          className={`p-2 rounded border text-left flex flex-col transition-all ${
                            language === lang.code
                              ? "bg-secondary text-white font-bold border-secondary shadow-xs scale-[1.02]"
                              : "bg-surface text-on-surface hover:bg-surface-container border-outline-variant"
                          }`}
                        >
                          <span className="text-xs">{lang.flag} {lang.native}</span>
                          <span className="text-[10px] opacity-80">{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audio Sirens */}
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface font-medium">{t("audioSirens")}</span>
                    <input type="checkbox" defaultChecked className="accent-secondary rounded cursor-pointer" />
                  </div>

                  {/* Auto Dispatch */}
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface font-medium">{t("autoDispatch")}</span>
                    <input type="checkbox" defaultChecked className="accent-secondary rounded cursor-pointer" />
                  </div>

                  {/* Telemetry Refresh */}
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface font-medium">{t("telemetryRefresh")}</span>
                    <span className="font-mono text-[11px] bg-surface-container px-2 py-0.5 rounded font-bold">
                      15s (Live Sync)
                    </span>
                  </div>

                  <div className="pt-2 border-t border-outline-variant">
                    <button
                      onClick={() => setShowSettings(false)}
                      className="w-full py-2 bg-primary text-white rounded text-xs font-bold font-mono hover:bg-primary-container transition-colors shadow-xs"
                    >
                      {t("savePreferences")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-primary-container">
            {googleUser?.picture ? (
              <img
                src={googleUser.picture}
                alt={googleUser.name || "Google user"}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-secondary/50"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold text-xs ring-2 ring-secondary/50">
                {(googleUser?.name || "KD").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden xl:block text-left min-w-0">
              <div className="text-xs font-semibold text-white leading-tight truncate max-w-[160px]">
                {googleUser?.name || "K. Dinesh"}
              </div>
              <div className="text-[10px] text-primary-fixed leading-tight">
                {googleUser ? "Google Account" : t("officerRole")}
              </div>
            </div>
            {googleUser && (
              <button
                type="button"
                onClick={handleSignOut}
                className="hidden xl:inline-flex items-center justify-center rounded px-2 py-1 text-[10px] font-mono font-bold bg-primary-container/30 text-white hover:bg-primary-container/50"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Recipient Modal */}
      <RecipientModal
        isOpen={showRecipientModal}
        onClose={() => setShowRecipientModal(false)}
      />
    </>
  );
}
