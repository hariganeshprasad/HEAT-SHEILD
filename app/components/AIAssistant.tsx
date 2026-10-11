"use client";

import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function AIAssistant() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: "ai" | "user"; text: string; time: string }>>([
    {
      sender: "ai",
      text: "HeatShield Sentinel AI is active. Currently monitoring real-time solar radiation, temperature, wind velocity, and humidity across all national sectors. Choose a topic below or ask any question in your language (English, తెలుగు, हिन्दी, etc.).",
      time: "10:45 AM",
    },
  ]);

  const quickPrompts = [
    {
      category: "☀️ Solar & Weather",
      prompt: "What is a dangerous Solar Radiation level and UV risk?",
    },
    {
      category: "🌡️ Labour SOP",
      prompt: "What is the stand-down WBGT temperature for outdoor workers?",
    },
    {
      category: "💧 Humidity & UTCI",
      prompt: "How does high humidity increase heat stroke danger?",
    },
    {
      category: "🚩 తెలుగు సలహా (Telugu)",
      prompt: "తెలుగు: హీట్‌వేవ్ సమయంలో ప్రాణరక్షణ జాగ్రత్తలు ఏమిటి?",
    },
    {
      category: "🚩 తెలుగు చికిత్స (Telugu)",
      prompt: "తెలుగు: వడదెబ్బ (Heat Stroke) తగిలితే ప్రథమ చికిత్స ఎలా చేయాలి?",
    },
    {
      category: "🚑 Emergency First Aid",
      prompt: "What are the step-by-step first aid actions for heat stroke?",
    },
    {
      category: "🏥 Cooling Centers",
      prompt: "Where can citizens find cooling shelters and what facilities exist?",
    },
    {
      category: "🌾 Agriculture & Cattle",
      prompt: "What are the heatwave advisories for farmers, crops, and livestock?",
    },
    {
      category: "👶 Vulnerable Groups",
      prompt: "What special precautions are mandated for elderly and infants?",
    },
    {
      category: "🥤 Hydration Guide",
      prompt: "Which drinks provide rapid hydration vs drinks to strictly avoid?",
    },
    {
      category: "⚡ Power Grid Tips",
      prompt: "How to prevent electrical grid overload and transformer fire during peak heat?",
    },
    {
      category: "🚗 Vehicle Safety",
      prompt: "How to prevent tire blowouts and cabin heat danger in vehicles?",
    },
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");

    setTimeout(() => {
      let reply = "Processing thermal telemetry and HeatShield standard operating guidelines...";
      const q = query.toLowerCase();

      if (query.includes("తెలుగు") || query.includes("జాగ్రత్తలు") || query.includes("వడదెబ్బ")) {
        if (query.includes("ప్రథమ చికిత్స") || query.includes("చికిత్స")) {
          reply = `🚩 **వడదెబ్బ (Heat Stroke) ప్రథమ చికిత్స సూచనలు:**
1. **నీడ లేదా చల్లని ప్రదేశానికి తరలించండి:** బాధితుడిని వెంటనే ఏసీ లేదా ఫ్యాన్ ఉన్న గదిలోకి తీసుకువెళ్లండి.
2. **వేగంగా శరీరాన్ని చల్లబరచండి:** మెడ, చంకలు, గజ్జలు మరియు నుదిటిపై చల్లటి తడి గుడ్డలు ఉంచండి.
3. **ద్రవాలు అందించండి:** బాధితుడు స్పృహలో ఉంటే ఓఆర్‌ఎస్ (ORS) నీరు లేదా నిమ్మరసం కొద్దికొద్దిగా తాగించండి.
4. **అత్యవసర కాల్ చేయండి:** తీవ్ర జ్వరం (103°F+), వాంతులు లేదా స్పృహ తప్పితే వెంటనే **108 అంబులెన్స్** లేదా **1077 విపత్తు నియంత్రణ**కు కాల్ చేయండి.`;
        } else {
          reply = `🚩 **హీట్‌షీల్డ్ (HeatShield) ముఖ్యమైన జాగ్రత్తలు:**
1. **మధ్యాహ్నం 11 నుండి సాయంత్రం 4 గంటల వరకు** ఎండలో తిరగవద్దు.
2. దాహం వేయకపోయినా గంటకు కనీసం 1 లీటరు నీరు లేదా మజ్జిగ, కొబ్బరి నీళ్లు తాగండి.
3. లేత రంగు కాటన్ దుస్తులు ధరించండి మరియు బయటకు వెళ్లేటప్పుడు గొడుగు, టోపీ వాడండి.
4. ఆరుబయట పనిచేసే కార్మికులకు యజమానులు తప్పనిసరిగా నీడ మరియు ఓఆర్‌ఎస్ సౌకర్యాలు కల్పించాలి.`;
        }
      } else if (q.includes("solar") || q.includes("radiation") || q.includes("uv")) {
        reply = `☀️ **Solar Radiation & UV Threshold Guidelines:**
- **Normal Range:** < 600 W/m² (UV Index 1-5, Moderate).
- **Dangerous Threshold:** > 800 W/m² (UV Index 8-10, Very High Risk of erythema and heat stress within 15-20 minutes).
- **Extreme Fatal Threshold:** > 950 W/m² (UV Index 11+, Extreme danger recorded in Rajasthan/Gujarat).
- **Action:** Mandatory shaded canopies, UV-protective eyewear, and reflective white roofing.`;
      } else if (q.includes("wbgt") || q.includes("stand-down") || q.includes("work")) {
        reply = `🌡️ **Occupational Stand-Down Standard (NDMA & MoES SOP):**
- When **WBGT exceeds 32.0°C** (or UTCI > 40°C), all direct outdoor construction, road paving, and heavy physical labour are **mandatorily suspended between 11:00 AM and 4:00 PM**.
- Employers must provide unlimited potable electrolyte water and air-cooled/shaded rest areas every 200 meters.`;
      } else if (q.includes("humidity") || q.includes("utci")) {
        reply = `💧 **Relative Humidity & Apparent Heat Danger:**
High humidity prevents sweat evaporation (the human body's primary cooling mechanism). A dry temperature of 39°C with 60% humidity produces an apparent 'Feel-Like' UTCI heat index above **48°C**, leading to rapid heat exhaustion even under mild exertion.`;
      } else if (q.includes("first aid") || q.includes("heat stroke") || q.includes("ambulance")) {
        reply = `🚑 **Heat Stroke Emergency Action Plan:**
1. **Call 108 Immediately:** Heat stroke is a medical emergency with potential organ failure.
2. **Rapid Evaporative Cooling:** Strip excess clothing and apply cold wet towels to major vascular arteries (neck, groin, armpits).
3. **Fan Aggressively:** Create airflow to accelerate evaporative heat transfer.
4. **Hydration Warning:** Never force liquids into an unconscious or semi-conscious individual to prevent choking.`;
      } else if (q.includes("cooling center") || q.includes("shelter")) {
        reply = `🏥 **Public Cooling Shelters Deployment:**
Cooling centers are equipped in community halls, metro stations, and government schools. Each facility provides:
- High-volume air coolers / air conditioning
- Oral Rehydration Salts (ORS) depots and IV saline infusion
- On-duty paramedics and vitals monitoring
- Open daily from 8:00 AM to 8:00 PM during Code Red alerts.`;
      } else if (q.includes("farmer") || q.includes("agriculture") || q.includes("livestock") || q.includes("crop")) {
        reply = `🌾 **Agricultural & Livestock Heatwave Advisory:**
- **Irrigation:** Irrigate crops only in early morning (5:00-7:00 AM) or late evening to prevent solar scalding.
- **Livestock:** Keep cattle in thatched/shaded sheds, provide clean drinking water 4-5 times daily with mineral salt mixtures, and spray water on animal roofs during 12:00-3:00 PM.`;
      } else if (q.includes("elderly") || q.includes("infant") || q.includes("children")) {
        reply = `👶 **Elderly (>65) & Pediatric Care Directives:**
- Thermoregulation is slower in elderly and children. Never leave infants or seniors in parked vehicles (cabin temps exceed 60°C within 10 minutes).
- Check blood pressure medications as vasodilators and diuretics exacerbate dehydration risks. Keep rooms shaded with dark curtains.`;
      } else if (q.includes("drink") || q.includes("hydration") || q.includes("beverage")) {
        reply = `🥤 **Hydration Recommendation Matrix:**
- **Recommended:** ORS solution, coconut water, buttermilk (chaas), lemon water with salt, and barley water.
- **Strictly Avoid:** Alcohol, energy drinks, heavy caffeinated coffee, and high-sugar sodas (these act as diuretics and accelerate kidney dehydration).`;
      } else if (q.includes("power") || q.includes("grid") || q.includes("electricity") || q.includes("transformer")) {
        reply = `⚡ **Power Grid & Transformer Fire Prevention:**
- High solar radiation and thermal heat reduce transformer cooling oil efficiency.
- Discoms must enforce scheduled non-peak industrial shifting. Residential consumers are advised to set AC thermostats at 25-26°C to prevent neighborhood transformer tripping.`;
      } else if (q.includes("tire") || q.includes("vehicle") || q.includes("car")) {
        reply = `🚗 **Vehicle Safety in Extreme Heat:**
- Road surface temperatures reach 65-70°C in peak summer. Maintain 2-3 PSI below maximum cold tire pressure to avoid high-speed blowouts.
- Never store pressurized sanitizer bottles, lighters, or electronic powerbanks on car dashboards.`;
      } else {
        reply = `Analyzing query regarding "${query}". HeatShield recommends cross-referencing real-time telemetry on the GIS Dashboard and verifying active SMS/WhatsApp dispatch queues in the HAP Center.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      {isOpen && (
        <div className="w-88 sm:w-[440px] h-[520px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-primary text-white p-3.5 flex items-center justify-between border-b border-primary-container">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white shadow-xs">
                <span className="material-symbols-outlined text-lg">smart_toy</span>
              </div>
              <div>
                <h4 className="font-bold text-xs leading-tight flex items-center gap-1.5">
                  HeatShield Sentinel AI
                  <span className="text-[9px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded font-mono">
                    ONLINE
                  </span>
                </h4>
                <p className="text-[10px] text-primary-fixed leading-tight">
                  Multilingual Thermal Early Warning & First Aid Advisor
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded text-white text-xs transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div className="p-2.5 bg-surface-container-low border-b border-outline-variant flex flex-col gap-1">
            <span className="text-[10px] font-bold text-on-surface-variant font-mono uppercase tracking-wider">
              Common Citizen & Officer Inquiries:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className="shrink-0 text-[11px] bg-surface-container-lowest hover:bg-secondary-container hover:text-on-secondary-container border border-outline-variant rounded-full px-3 py-1 text-on-surface transition-colors whitespace-nowrap font-medium shadow-xs"
                >
                  <span className="text-[9px] text-secondary font-bold mr-1">[{item.category}]</span>
                  {item.prompt.length > 38 ? item.prompt.slice(0, 38) + "..." : item.prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-surface text-xs font-sans">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "bg-secondary text-white rounded-br-none shadow-xs font-medium"
                      : "bg-surface-container-lowest border border-outline-variant text-on-surface rounded-tl-none shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-outline mt-0.5 px-1 font-mono">
                  {m.time}
                </span>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-surface-container-lowest border-t border-outline-variant flex gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask in English, తెలుగు, or हिन्दी..."
              className="flex-1 px-3.5 py-2 bg-surface border border-outline-variant rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary font-sans"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-lg transition-colors shrink-0 flex items-center justify-center font-bold text-xs shadow-xs"
            >
              <span className="material-symbols-outlined text-sm mr-1">send</span>
              Ask
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <div className="flex items-center gap-2">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 shadow-lg text-xs text-on-surface hidden sm:block max-w-[240px]">
            <p className="text-[11px] leading-tight font-medium">
              ☀️ Live solar flux & temperature telemetry active. Click to ask questions in your language!
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="w-13 h-13 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-xl hover:bg-secondary/90 transition-all hover:scale-105 active:scale-95 group ring-4 ring-secondary/20"
          >
            <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">
              smart_toy
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
