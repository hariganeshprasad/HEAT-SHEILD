"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AIAssistant from "../components/AIAssistant";
import EmergencyModal from "../components/EmergencyModal";

export default function AlertBuilderPage() {
  const [channel, setChannel] = useState<"whatsapp" | "sms">("whatsapp");
  const [language, setLanguage] = useState<"en" | "hi" | "reg">("en");
  const [category, setCategory] = useState("alert");
  const [buttonText, setButtonText] = useState("View Map");
  const [buttonUrl, setButtonUrl] = useState("https://heatshield.in/map?w={{WARD_ID}}");
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const initialTemplates = {
    en: `🚨 *HEATSHIELD ALERT: {{WARD_NAME}}* 🚨\n\nCurrent WBGT Temperature: *{{WBGT_TEMP}}*\nRisk Level: *{{UTCI_LEVEL}}*\n\nPlease avoid outdoor activities between 11:00 AM - 4:00 PM.\nNearest Cooling Center: {{COOLING_CENTER_ADDRESS}}\nExpected Duration: {{ESTIMATED_DURATION}}`,
    hi: `🚨 *हीटशील्ड चेतावनी: {{WARD_NAME}}* 🚨\n\nवर्तमान WBGT तापमान: *{{WBGT_TEMP}}*\nजोखिम स्तर: *{{UTCI_LEVEL}}*\n\nकृपया दोपहर 11:00 से शाम 4:00 बजे तक बाहर निकलने से बचें।\nनिकटतम कूलिंग सेंटर: {{COOLING_CENTER_ADDRESS}}\nअनुमानित अवधि: {{ESTIMATED_DURATION}}`,
    reg: `🚨 *હીટશીલ્ડ ચેતવણી: {{WARD_NAME}}* 🚨\n\nહાલનું WBGT તાપમાન: *{{WBGT_TEMP}}*\nજોખમ સ્તર: *{{UTCI_LEVEL}}*\n\nબપોરે 11:00 થી 4:00 વાગ્યા સુધી બિનજરૂરી બહાર જવાનું ટાળો.\nનજીકનું કૂલિંગ સેન્ટર: {{COOLING_CENTER_ADDRESS}}\nઅંદાજિત સમયગાળો: {{ESTIMATED_DURATION}}`,
  };

  const [message, setMessage] = useState(initialTemplates.en);

  const handleLanguageChange = (lang: "en" | "hi" | "reg") => {
    setLanguage(lang);
    setMessage(initialTemplates[lang]);
  };

  const dataTags = [
    { tag: "{{WARD_NAME}}", desc: "Affected district or ward name (e.g. Ward 42)" },
    { tag: "{{WBGT_TEMP}}", desc: "Current Wet Bulb Globe reading (e.g. 34.2°C)" },
    { tag: "{{UTCI_LEVEL}}", desc: "Semantic thermal risk level (e.g. FATAL)" },
    { tag: "{{COOLING_CENTER_ADDRESS}}", desc: "Nearest cooling shelter location" },
    { tag: "{{ESTIMATED_DURATION}}", desc: "Projected length of warning (e.g. Next 4 Hours)" },
    { tag: "{{HELPLINE_NUMBER}}", desc: "Emergency medical helpline (108 / 1077)" },
  ];

  const insertTag = (tag: string) => {
    setMessage((prev) => prev + " " + tag);
  };

  // Process message for preview rendering
  const getRenderedPreview = () => {
    return message
      .replace(/{{WARD_NAME}}/g, "Ward 42, Ahmedabad")
      .replace(/{{WBGT_TEMP}}/g, "34.2°C")
      .replace(/{{UTCI_LEVEL}}/g, "EXTREME")
      .replace(/{{COOLING_CENTER_ADDRESS}}/g, "Civic Auditorium, Sector 4")
      .replace(/{{ESTIMATED_DURATION}}/g, "Next 4 Hours")
      .replace(/{{HELPLINE_NUMBER}}/g, "108 / 1077");
  };

  const handleSendTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-on-surface">
      <Header onOpenEmergency={() => setIsEmergencyOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar onOpenEmergency={() => setIsEmergencyOpen(true)} />

        <main className="flex-1 bg-surface flex flex-col overflow-y-auto p-4 lg:p-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl font-extrabold text-primary font-mono tracking-tight uppercase">
                HeatShield Alert Template Builder
              </h1>
              <p className="text-xs text-on-surface-variant mt-1">
                Configure and preview verified SMS and WhatsApp broadcast templates with live variable interpolation.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSendTest}
                className="px-3.5 py-2 bg-surface border border-outline-variant text-primary rounded text-xs font-bold font-mono hover:bg-surface-container transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                Send Test Broadcast
              </button>
              <button
                onClick={() => alert("Template saved to National HeatShield Registry!")}
                className="px-4 py-2 bg-secondary text-white rounded text-xs font-bold font-mono hover:bg-secondary/90 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                Save Template
              </button>
            </div>
          </div>

          {testSent && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-mono flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-emerald-600">check_circle</span>
              Test broadcast simulated successfully! Dispatched to registered HeatShield administrator terminals.
            </div>
          )}

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
            {/* Left Column: Template Config & Message Editor */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
              {/* Configuration Bar */}
              <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-xs flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant pb-3 gap-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-primary font-mono">
                    Channel & Language Configuration
                  </h3>

                  {/* Language Selector */}
                  <div className="flex bg-surface-container-low rounded p-1 border border-outline-variant">
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className={`px-3 py-1 rounded text-xs font-bold font-mono transition-colors ${
                        language === "en"
                          ? "bg-secondary text-white shadow-xs"
                          : "text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLanguageChange("hi")}
                      className={`px-3 py-1 rounded text-xs font-bold font-mono transition-colors ${
                        language === "hi"
                          ? "bg-secondary text-white shadow-xs"
                          : "text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      हिन्दी
                    </button>
                    <button
                      onClick={() => handleLanguageChange("reg")}
                      className={`px-3 py-1 rounded text-xs font-bold font-mono transition-colors ${
                        language === "reg"
                          ? "bg-secondary text-white shadow-xs"
                          : "text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      Regional (ગુજરાતી)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Delivery Channel Radio Cards */}
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase font-mono mb-1.5">
                      Delivery Channel
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setChannel("whatsapp")}
                        className={`p-2.5 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                          channel === "whatsapp"
                            ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs"
                            : "border-outline-variant bg-surface text-on-surface-variant opacity-70"
                        }`}
                      >
                        <span className="material-symbols-outlined text-emerald-600 text-lg">chat</span>
                        <span className="text-xs font-mono">WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setChannel("sms")}
                        className={`p-2.5 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                          channel === "sms"
                            ? "border-secondary bg-blue-50 text-blue-950 font-bold shadow-xs"
                            : "border-outline-variant bg-surface text-on-surface-variant opacity-70"
                        }`}
                      >
                        <span className="material-symbols-outlined text-secondary text-lg">sms</span>
                        <span className="text-xs font-mono">SMS Gateway</span>
                      </button>
                    </div>
                  </div>

                  {/* Template Category */}
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase font-mono mb-1.5">
                      Message Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-lg p-2.5 text-xs text-primary font-mono focus:ring-1 focus:ring-secondary focus:outline-none"
                    >
                      <option value="alert">Emergency Advisory (High Priority)</option>
                      <option value="utility">Public Utility & Hydration Info</option>
                      <option value="auth">Officer Stand-Down Protocol</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message Body Editor Card */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col flex-1 shadow-xs overflow-hidden">
                <div className="p-3 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-primary font-mono flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">edit_note</span>
                    Template Body Editor
                  </h3>
                  <span className="font-mono text-xs text-on-surface-variant">
                    Chars: {message.length} / 1024
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col bg-surface-container-lowest">
                  <textarea
                    rows={8}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your emergency message... Click data tags on the right to insert dynamic variables."
                    className="w-full flex-1 p-3 bg-surface border border-outline-variant rounded-lg resize-none font-mono text-xs text-on-surface focus:ring-1 focus:ring-secondary focus:outline-none leading-relaxed"
                  />
                </div>

                {/* WhatsApp Interactive Button Config */}
                {channel === "whatsapp" && (
                  <div className="p-4 border-t border-outline-variant bg-surface-container-low">
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase font-mono mb-2 flex items-center gap-2">
                      <span>WhatsApp Interactive Action Buttons</span>
                      <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[9px]">
                        VERIFIED META API
                      </span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-surface border border-outline-variant rounded p-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-outline text-lg">link</span>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            placeholder="Button Text"
                            className="w-full bg-transparent border-0 p-0 text-xs font-bold text-on-surface focus:ring-0"
                          />
                          <input
                            type="text"
                            value={buttonUrl}
                            onChange={(e) => setButtonUrl(e.target.value)}
                            placeholder="URL"
                            className="w-full bg-transparent border-0 p-0 text-[10px] text-on-surface-variant focus:ring-0 mt-0.5 font-mono"
                          />
                        </div>
                      </div>

                      <div
                        onClick={() => alert("Added secondary quick reply button: 'Call Helpline 108'")}
                        className="bg-surface border border-outline-variant border-dashed rounded p-2.5 flex items-center justify-center text-on-surface-variant hover:bg-surface-container cursor-pointer transition-colors text-xs font-mono font-bold"
                      >
                        <span className="material-symbols-outlined text-base mr-1">add</span>
                        Add Action Button
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live Mobile Phone Simulator & Data Tags */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
              {/* Phone Device Preview Simulator */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col items-center">
                <div className="w-full flex justify-between items-center border-b border-outline-variant pb-2 mb-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-primary font-mono">
                    Live Device Simulator
                  </h3>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    {channel.toUpperCase()}
                  </span>
                </div>

                {/* Mock Phone Frame */}
                <div className="w-[280px] h-[480px] border-[8px] border-slate-900 rounded-[2.5rem] bg-[#efeae2] relative overflow-hidden flex flex-col shadow-2xl">
                  {/* Speaker & Notch */}
                  <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-30 pointer-events-none">
                    <div className="w-24 h-3.5 bg-slate-900 rounded-b-xl" />
                  </div>

                  {channel === "whatsapp" ? (
                    <>
                      {/* WhatsApp Header */}
                      <div className="bg-[#075e54] text-white pt-6 pb-2.5 px-3 flex items-center gap-2.5 shadow-md z-20">
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm shadow-xs">
                          🛡️
                        </div>
                        <div className="flex-1 leading-tight">
                          <div className="font-bold text-xs flex items-center gap-1">
                            HeatShield Alert
                            <span className="material-symbols-outlined text-[13px] text-blue-400 fill">
                              verified
                            </span>
                          </div>
                          <div className="text-[9px] text-white/80 font-mono">Official EWS Channel</div>
                        </div>
                      </div>

                      {/* Chat Messages Canvas */}
                      <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto bg-[radial-gradient(#c8c2b7_1px,transparent_1px)] [background-size:12px_12px]">
                        {/* Date Pill */}
                        <div className="flex justify-center my-1">
                          <span className="bg-white/80 backdrop-blur-xs text-slate-600 text-[9px] px-2.5 py-0.5 rounded-full font-mono shadow-xs">
                            TODAY
                          </span>
                        </div>

                        {/* WhatsApp Bubble */}
                        <div className="whatsapp-bubble text-[11px] text-slate-900 max-w-[95%] self-start flex flex-col gap-1 shadow-sm">
                          <div className="font-bold text-[#c13515] flex items-center gap-1 text-[10px] uppercase font-mono">
                            HeatShield Early Warning
                          </div>
                          <div className="whitespace-pre-wrap font-sans text-[11px] leading-relaxed">
                            {getRenderedPreview()}
                          </div>
                          <div className="text-[8px] text-right text-slate-500 font-mono mt-0.5">
                            10:42 AM
                          </div>
                        </div>

                        {/* Action button preview */}
                        {buttonText && (
                          <div className="bg-white text-[#00a884] text-xs font-bold py-2 rounded text-center border border-gray-200 shadow-xs self-start w-[95%] -mt-1 cursor-pointer hover:bg-slate-50 flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-sm">link</span>
                            {buttonText}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* SMS Header */}
                      <div className="bg-primary text-white pt-6 pb-2.5 px-3 flex items-center gap-2.5 shadow-md z-20">
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        <div className="flex-1 leading-tight">
                          <div className="font-bold text-xs font-mono">VK-HEATSHIELD</div>
                          <div className="text-[9px] text-primary-fixed">National Disaster Alert</div>
                        </div>
                      </div>

                      {/* SMS Chat Body */}
                      <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto bg-slate-100">
                        <div className="bg-white border border-outline-variant p-3 rounded-xl rounded-tl-none text-[11px] text-slate-900 font-mono shadow-xs whitespace-pre-wrap leading-relaxed">
                          {getRenderedPreview()}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Dynamic Variable Tags */}
              <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-xs flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b border-outline-variant pb-2 mb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-primary font-mono">
                    Dynamic Variable Tags
                  </h3>
                  <span className="material-symbols-outlined text-secondary text-base">data_object</span>
                </div>
                <p className="text-[11px] text-on-surface-variant mb-3">
                  Click any tag to append it into your template editor:
                </p>

                <div className="space-y-1.5 flex-1 overflow-y-auto max-h-56 pr-1">
                  {dataTags.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => insertTag(item.tag)}
                      className="flex items-center justify-between p-2 rounded bg-surface hover:bg-secondary-container hover:text-on-secondary-container border border-outline-variant/60 cursor-pointer transition-colors group"
                    >
                      <div className="flex flex-col">
                        <code className="text-xs font-mono font-bold text-secondary group-hover:text-primary">
                          {item.tag}
                        </code>
                        <span className="text-[10px] text-on-surface-variant leading-tight">
                          {item.desc}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-sm text-outline group-hover:text-primary">
                        add_circle
                      </span>
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
      />
    </div>
  );
}
