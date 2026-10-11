"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  onOpenEmergency?: () => void;
}

export default function Sidebar({ onOpenEmergency }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    {
      name: "GIS Dashboard",
      href: "/",
      icon: "map",
      exact: true,
      badge: "LIVE",
      badgeColor: "bg-error text-white animate-pulse",
    },
    {
      name: "Thermal Stress",
      href: "/ward-analytics",
      icon: "thermostat",
    },
    {
      name: "Risk Predictor",
      href: "/ward-analytics#risk",
      icon: "warning",
    },
    {
      name: "HAP Center",
      href: "/hap-center",
      icon: "campaign",
      badge: "ACTIVE",
      badgeColor: "bg-secondary text-white",
    },
    {
      name: "Alert Builder",
      href: "/alert-builder",
      icon: "send_to_mobile",
    },
    {
      name: "Healthcare & Safety",
      href: "/healthcare",
      icon: "health_and_safety",
    },
  ];

  return (
    <aside className="w-64 xl:w-72 bg-surface-container-low border-r border-outline-variant flex flex-col h-full shrink-0 select-none">
      {/* Top Emblem */}
      <div className="p-4 border-b border-outline-variant bg-surface-container-low">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-fixed shadow-sm">
            <span className="material-symbols-outlined text-2xl font-bold">shield</span>
          </div>
          <div>
            <h2 className="font-bold text-sm text-primary tracking-tight uppercase font-mono">
              HeatShield EWS
            </h2>
            <p className="text-[11px] text-on-surface-variant leading-tight">
              NCMRWF / MoES Early Warning
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Fast Trigger */}
      <div className="p-3 border-b border-outline-variant bg-error-container/20">
        <button
          onClick={onOpenEmergency}
          className="w-full py-2 px-3 bg-error text-on-error hover:bg-red-800 transition-colors rounded flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider shadow-sm active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-base">campaign</span>
          Trigger Emergency Alert
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase px-3 py-1 font-mono">
          System Modules
        </div>
        {links.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href.split("#")[0]);

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-150 group ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container font-bold border-l-4 border-secondary shadow-xs translate-x-1"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-l-4 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined text-lg transition-transform group-hover:scale-110 ${
                    isActive ? "text-secondary font-bold fill" : "text-outline"
                  }`}
                >
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </div>
              {link.badge && (
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded tracking-normal ${link.badgeColor}`}
                >
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div className="p-3 border-t border-outline-variant bg-surface-container-low text-xs space-y-2">
        <div className="bg-surface-container-lowest p-2.5 rounded border border-outline-variant text-[11px]">
          <div className="flex justify-between items-center text-on-surface-variant font-mono mb-1">
            <span>HeatShield Engine v4.2</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              ONLINE
            </span>
          </div>
          <div className="text-outline text-[10px]">
            GIS sync: IMD INSAT-3D Satellite
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-on-surface-variant px-1 pt-1">
          <Link href="/healthcare" className="hover:text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">help_outline</span>
            Support
          </Link>
          <button
            onClick={() => alert("HeatShield Archive: Access historical heat wave event datasets (2020-2026).")}
            className="hover:text-secondary flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">history</span>
            Archive
          </button>
        </div>
      </div>
    </aside>
  );
}
