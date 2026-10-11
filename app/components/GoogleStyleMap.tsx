"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { fetchLiveWeatherTelemetry } from "../services/weatherService";

export interface LocationTelemetry {
  id: string;
  name: string;
  state: string;
  region: "North" | "South" | "West" | "East" | "Central" | "Northeast";
  lat: number;
  lng: number;
  temp: number;
  solarRadiation: number; // W/m²
  windSpeed: number; // km/h
  humidity: number; // %
  wbgt: number; // °C
  risk: "FATAL" | "EXTREME" | "HIGH" | "MODERATE";
  color: string;
  wards: number;
  description: string;
  source?: string;
}

export const HOTSPOTS_DATA: LocationTelemetry[] = [
  // --- NORTH INDIA ---
  {
    id: "DL-01",
    name: "Delhi-NCR Central",
    state: "Delhi",
    region: "North",
    lat: 28.6139,
    lng: 77.2090,
    temp: 43.2,
    solarRadiation: 890,
    windSpeed: 18.2,
    humidity: 38,
    wbgt: 32.8,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 28,
    description: "National Capital urban heat island with dense concrete thermal trapping.",
  },
  {
    id: "RJ-01",
    name: "Phalodi & Jodhpur",
    state: "Rajasthan",
    region: "North",
    lat: 27.1303,
    lng: 72.3626,
    temp: 46.2,
    solarRadiation: 995,
    windSpeed: 25.5,
    humidity: 16,
    wbgt: 34.5,
    risk: "FATAL",
    color: "#ba1a1a",
    wards: 14,
    description: "Thar desert hot dry loo windstorm. Solar flux exceeds safe physiological limits.",
  },
  {
    id: "RJ-02",
    name: "Jaipur",
    state: "Rajasthan",
    region: "North",
    lat: 26.9124,
    lng: 75.7873,
    temp: 44.5,
    solarRadiation: 935,
    windSpeed: 19.0,
    humidity: 22,
    wbgt: 33.2,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 22,
    description: "Pink City arid thermal basin with intense diurnal heating.",
  },
  {
    id: "RJ-03",
    name: "Bikaner",
    state: "Rajasthan",
    region: "North",
    lat: 28.0229,
    lng: 73.3119,
    temp: 45.4,
    solarRadiation: 970,
    windSpeed: 22.0,
    humidity: 17,
    wbgt: 33.9,
    risk: "FATAL",
    color: "#ba1a1a",
    wards: 16,
    description: "High daytime radiative flux and desert soil heating.",
  },
  {
    id: "UP-01",
    name: "Lucknow",
    state: "Uttar Pradesh",
    region: "North",
    lat: 26.8467,
    lng: 80.9462,
    temp: 43.8,
    solarRadiation: 915,
    windSpeed: 14.5,
    humidity: 42,
    wbgt: 33.1,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 24,
    description: "Gangetic plains humid heat combination with elevated apparent index.",
  },
  {
    id: "UP-02",
    name: "Kanpur",
    state: "Uttar Pradesh",
    region: "North",
    lat: 26.4499,
    lng: 80.3319,
    temp: 44.2,
    solarRadiation: 925,
    windSpeed: 15.2,
    humidity: 39,
    wbgt: 33.4,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 20,
    description: "Industrial heat core along the Ganges river basin.",
  },
  {
    id: "UP-03",
    name: "Varanasi",
    state: "Uttar Pradesh",
    region: "North",
    lat: 25.3176,
    lng: 82.9739,
    temp: 43.6,
    solarRadiation: 905,
    windSpeed: 13.8,
    humidity: 44,
    wbgt: 33.2,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 18,
    description: "High humidity and high temperature leading to dangerous heat index.",
  },
  {
    id: "UP-04",
    name: "Prayagraj (Allahabad)",
    state: "Uttar Pradesh",
    region: "North",
    lat: 25.4358,
    lng: 81.8463,
    temp: 44.6,
    solarRadiation: 930,
    windSpeed: 16.0,
    humidity: 38,
    wbgt: 33.6,
    risk: "FATAL",
    color: "#ba1a1a",
    wards: 16,
    description: "Confluence river valley high thermal exposure zone.",
  },
  {
    id: "UP-05",
    name: "Agra",
    state: "Uttar Pradesh",
    region: "North",
    lat: 27.1767,
    lng: 78.0081,
    temp: 44.8,
    solarRadiation: 940,
    windSpeed: 17.5,
    humidity: 30,
    wbgt: 33.5,
    risk: "FATAL",
    color: "#ba1a1a",
    wards: 19,
    description: "Semi-arid Yamuna river basin experiencing extreme daytime heat spikes.",
  },
  {
    id: "PB-01",
    name: "Amritsar",
    state: "Punjab",
    region: "North",
    lat: 31.6340,
    lng: 74.8723,
    temp: 42.8,
    solarRadiation: 885,
    windSpeed: 17.0,
    humidity: 36,
    wbgt: 32.4,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 14,
    description: "Northwest agricultural plains high solar irradiance.",
  },
  {
    id: "PB-02",
    name: "Ludhiana",
    state: "Punjab",
    region: "North",
    lat: 30.9010,
    lng: 75.8573,
    temp: 43.1,
    solarRadiation: 890,
    windSpeed: 16.2,
    humidity: 35,
    wbgt: 32.5,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 16,
    description: "Industrial hub with high paved surface thermal retention.",
  },
  {
    id: "CH-01",
    name: "Chandigarh",
    state: "Punjab / Haryana",
    region: "North",
    lat: 30.7333,
    lng: 76.7794,
    temp: 41.5,
    solarRadiation: 860,
    windSpeed: 14.8,
    humidity: 37,
    wbgt: 31.6,
    risk: "HIGH",
    color: "#d97706",
    wards: 12,
    description: "Sub-Himalayan foothills urban plain zone.",
  },
  {
    id: "UK-01",
    name: "Dehradun",
    state: "Uttarakhand",
    region: "North",
    lat: 30.3165,
    lng: 78.0322,
    temp: 37.4,
    solarRadiation: 810,
    windSpeed: 11.5,
    humidity: 48,
    wbgt: 29.2,
    risk: "MODERATE",
    color: "#059669",
    wards: 8,
    description: "Doon valley moderate thermal risk with evening valley breeze.",
  },
  {
    id: "JK-01",
    name: "Srinagar",
    state: "Jammu & Kashmir",
    region: "North",
    lat: 34.0837,
    lng: 74.7973,
    temp: 31.2,
    solarRadiation: 760,
    windSpeed: 10.2,
    humidity: 52,
    wbgt: 24.8,
    risk: "MODERATE",
    color: "#059669",
    wards: 6,
    description: "Kashmir valley high altitude cool climate baseline.",
  },
  {
    id: "HP-01",
    name: "Shimla",
    state: "Himachal Pradesh",
    region: "North",
    lat: 31.1048,
    lng: 77.1734,
    temp: 27.5,
    solarRadiation: 780,
    windSpeed: 12.0,
    humidity: 55,
    wbgt: 22.4,
    risk: "MODERATE",
    color: "#059669",
    wards: 5,
    description: "Himalayan hill station with safe thermal indices.",
  },

  // --- WEST INDIA ---
  {
    id: "MH-01",
    name: "Mumbai",
    state: "Maharashtra",
    region: "West",
    lat: 19.0760,
    lng: 72.8777,
    temp: 36.8,
    solarRadiation: 820,
    windSpeed: 22.4,
    humidity: 78,
    wbgt: 33.6,
    risk: "FATAL",
    color: "#ba1a1a",
    wards: 32,
    description: "Coastal hyper-humidity creates dangerous heat index > 50°C apparent feel.",
  },
  {
    id: "GJ-01",
    name: "Ahmedabad West",
    state: "Gujarat",
    region: "West",
    lat: 23.0225,
    lng: 72.5714,
    temp: 44.8,
    solarRadiation: 945,
    windSpeed: 15.8,
    humidity: 40,
    wbgt: 33.8,
    risk: "FATAL",
    color: "#ba1a1a",
    wards: 24,
    description: "Extreme industrial heat dome with high ground solar flux.",
  },
  {
    id: "GJ-02",
    name: "Surat",
    state: "Gujarat",
    region: "West",
    lat: 21.1702,
    lng: 72.8311,
    temp: 41.6,
    solarRadiation: 895,
    windSpeed: 19.2,
    humidity: 62,
    wbgt: 33.4,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 18,
    description: "Tapi river delta with severe humid heat stress on textile workforce.",
  },
  {
    id: "GJ-03",
    name: "Rajkot",
    state: "Gujarat",
    region: "West",
    lat: 22.3039,
    lng: 70.8022,
    temp: 43.5,
    solarRadiation: 930,
    windSpeed: 18.0,
    humidity: 35,
    wbgt: 32.6,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 14,
    description: "Saurashtra plateau dry heat with strong afternoon solar radiation.",
  },
  {
    id: "MH-02",
    name: "Pune",
    state: "Maharashtra",
    region: "West",
    lat: 18.5204,
    lng: 73.8567,
    temp: 39.5,
    solarRadiation: 870,
    windSpeed: 16.5,
    humidity: 46,
    wbgt: 31.4,
    risk: "HIGH",
    color: "#d97706",
    wards: 18,
    description: "Deccan plateau elevated city experiencing rising summer peak heat.",
  },
  {
    id: "GA-01",
    name: "Panaji & Goa",
    state: "Goa",
    region: "West",
    lat: 15.4909,
    lng: 73.8278,
    temp: 35.2,
    solarRadiation: 790,
    windSpeed: 18.5,
    humidity: 76,
    wbgt: 32.2,
    risk: "HIGH",
    color: "#d97706",
    wards: 6,
    description: "Konkan coast tropical humidity with sustained marine airflow.",
  },

  // --- SOUTH INDIA ---
  {
    id: "TG-01",
    name: "Hyderabad",
    state: "Telangana",
    region: "South",
    lat: 17.3850,
    lng: 78.4867,
    temp: 43.2,
    solarRadiation: 910,
    windSpeed: 16.8,
    humidity: 42,
    wbgt: 33.1,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 26,
    description: "హైదరాబాద్ మహా నగరంలో అధిక ఉష్ణోగ్రత మరియు తీవ్రమైన సౌర వికిరణం.",
  },
  {
    id: "AP-01",
    name: "Vijayawada & Guntur",
    state: "Andhra Pradesh",
    region: "South",
    lat: 16.5062,
    lng: 80.6480,
    temp: 44.6,
    solarRadiation: 940,
    windSpeed: 15.4,
    humidity: 52,
    wbgt: 34.2,
    risk: "FATAL",
    color: "#ba1a1a",
    wards: 18,
    description: "కృష్ణా డెల్టాలో అధిక ఉష్ణోగ్రత మరియు విపరీతమైన ఉక్కపోత (Fatal Heat Stress).",
  },
  {
    id: "AP-02",
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    region: "South",
    lat: 17.6868,
    lng: 83.2185,
    temp: 39.2,
    solarRadiation: 860,
    windSpeed: 21.0,
    humidity: 74,
    wbgt: 33.5,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 16,
    description: "తీరప్రాంత తేమ మరియు అధిక ఉక్కపోతతో కూడిన తీవ్ర వడగాల్పులు.",
  },
  {
    id: "AP-03",
    name: "Tirupati",
    state: "Andhra Pradesh",
    region: "South",
    lat: 13.6288,
    lng: 79.4192,
    temp: 42.4,
    solarRadiation: 890,
    windSpeed: 14.5,
    humidity: 48,
    wbgt: 32.8,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 12,
    description: "రాయలసీమ పీఠభూమిలో అధిక ఉష్ణోగ్రతలు మరియు భక్తుల రద్దీ ప్రాంతం.",
  },
  {
    id: "KA-01",
    name: "Bengaluru",
    state: "Karnataka",
    region: "South",
    lat: 12.9716,
    lng: 77.5946,
    temp: 36.5,
    solarRadiation: 840,
    windSpeed: 16.0,
    humidity: 54,
    wbgt: 29.8,
    risk: "MODERATE",
    color: "#059669",
    wards: 28,
    description: "High plateau topography maintaining relatively cooler baselines.",
  },
  {
    id: "KA-02",
    name: "Mysuru",
    state: "Karnataka",
    region: "South",
    lat: 12.2958,
    lng: 76.6394,
    temp: 37.2,
    solarRadiation: 835,
    windSpeed: 14.2,
    humidity: 52,
    wbgt: 30.1,
    risk: "MODERATE",
    color: "#059669",
    wards: 10,
    description: "South Karnataka heritage district with moderate heat profile.",
  },
  {
    id: "KA-03",
    name: "Mangaluru",
    state: "Karnataka",
    region: "South",
    lat: 12.9141,
    lng: 74.8560,
    temp: 35.8,
    solarRadiation: 810,
    windSpeed: 19.5,
    humidity: 78,
    wbgt: 32.8,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 12,
    description: "Arabian Sea coastline with intense apparent heat index.",
  },
  {
    id: "TN-01",
    name: "Chennai",
    state: "Tamil Nadu",
    region: "South",
    lat: 13.0827,
    lng: 80.2707,
    temp: 41.2,
    solarRadiation: 870,
    windSpeed: 21.5,
    humidity: 68,
    wbgt: 33.8,
    risk: "FATAL",
    color: "#ba1a1a",
    wards: 26,
    description: "Severe coastal thermal stress with 'Feel-Like' index exceeding 48°C.",
  },
  {
    id: "TN-02",
    name: "Coimbatore",
    state: "Tamil Nadu",
    region: "South",
    lat: 11.0168,
    lng: 76.9558,
    temp: 38.6,
    solarRadiation: 850,
    windSpeed: 17.2,
    humidity: 50,
    wbgt: 31.0,
    risk: "HIGH",
    color: "#d97706",
    wards: 14,
    description: "Palghat gap airflow mitigating extreme heat peaks.",
  },
  {
    id: "TN-03",
    name: "Madurai",
    state: "Tamil Nadu",
    region: "South",
    lat: 9.9252,
    lng: 78.1198,
    temp: 42.1,
    solarRadiation: 900,
    windSpeed: 15.0,
    humidity: 54,
    wbgt: 33.0,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 16,
    description: "Vaigai river basin inland dry hot zone.",
  },
  {
    id: "KL-01",
    name: "Thiruvananthapuram",
    state: "Kerala",
    region: "South",
    lat: 8.5241,
    lng: 76.9366,
    temp: 34.6,
    solarRadiation: 790,
    windSpeed: 18.0,
    humidity: 80,
    wbgt: 32.1,
    risk: "HIGH",
    color: "#d97706",
    wards: 14,
    description: "High relative humidity with coastal sea breezes.",
  },
  {
    id: "KL-02",
    name: "Kochi & Ernakulam",
    state: "Kerala",
    region: "South",
    lat: 9.9312,
    lng: 76.2673,
    temp: 35.0,
    solarRadiation: 800,
    windSpeed: 19.0,
    humidity: 82,
    wbgt: 32.6,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 16,
    description: "Port commercial hub experiencing high apparent temperature load.",
  },

  // --- CENTRAL INDIA ---
  {
    id: "MH-03",
    name: "Nagpur & Vidarbha",
    state: "Maharashtra",
    region: "Central",
    lat: 21.1458,
    lng: 79.0882,
    temp: 45.2,
    solarRadiation: 960,
    windSpeed: 16.5,
    humidity: 28,
    wbgt: 33.8,
    risk: "FATAL",
    color: "#ba1a1a",
    wards: 22,
    description: "Central India geographical core with intense ground radiative heating.",
  },
  {
    id: "MP-01",
    name: "Bhopal",
    state: "Madhya Pradesh",
    region: "Central",
    lat: 23.2599,
    lng: 77.4126,
    temp: 43.8,
    solarRadiation: 920,
    windSpeed: 15.0,
    humidity: 32,
    wbgt: 32.7,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 18,
    description: "Central plateau lake city under persistent summer heatwave.",
  },
  {
    id: "MP-02",
    name: "Indore",
    state: "Madhya Pradesh",
    region: "Central",
    lat: 22.7196,
    lng: 75.8577,
    temp: 43.2,
    solarRadiation: 915,
    windSpeed: 17.4,
    humidity: 30,
    wbgt: 32.2,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 20,
    description: "Malwa plateau commercial capital experiencing strong solar flux.",
  },
  {
    id: "MP-03",
    name: "Gwalior",
    state: "Madhya Pradesh",
    region: "Central",
    lat: 26.2183,
    lng: 78.1828,
    temp: 45.6,
    solarRadiation: 975,
    windSpeed: 18.0,
    humidity: 22,
    wbgt: 33.9,
    risk: "FATAL",
    color: "#ba1a1a",
    wards: 16,
    description: "Chambal region notorious for extreme blistering 45°C+ summer peaks.",
  },
  {
    id: "MP-04",
    name: "Jabalpur",
    state: "Madhya Pradesh",
    region: "Central",
    lat: 23.1815,
    lng: 79.9864,
    temp: 43.5,
    solarRadiation: 910,
    windSpeed: 14.8,
    humidity: 34,
    wbgt: 32.5,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 15,
    description: "Narmada valley thermal corridor.",
  },
  {
    id: "CG-01",
    name: "Raipur",
    state: "Chhattisgarh",
    region: "Central",
    lat: 21.2514,
    lng: 81.6296,
    temp: 44.2,
    solarRadiation: 935,
    windSpeed: 15.5,
    humidity: 36,
    wbgt: 33.2,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 18,
    description: "Mahanadi basin industrial plain with elevated thermal radiation.",
  },
  {
    id: "CG-02",
    name: "Bilaspur",
    state: "Chhattisgarh",
    region: "Central",
    lat: 22.0797,
    lng: 82.1409,
    temp: 44.5,
    solarRadiation: 940,
    windSpeed: 14.8,
    humidity: 35,
    wbgt: 33.4,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 12,
    description: "High solar irradiance zone over mining and power belt.",
  },

  // --- EAST & NORTHEAST INDIA ---
  {
    id: "WB-01",
    name: "Kolkata",
    state: "West Bengal",
    region: "East",
    lat: 22.5726,
    lng: 88.3639,
    temp: 40.5,
    solarRadiation: 865,
    windSpeed: 17.5,
    humidity: 75,
    wbgt: 34.0,
    risk: "FATAL",
    color: "#ba1a1a",
    wards: 30,
    description: "Hyper-humid Gangetic delta creates suffocating wet-bulb temperatures.",
  },
  {
    id: "BR-01",
    name: "Patna",
    state: "Bihar",
    region: "East",
    lat: 25.5941,
    lng: 85.1376,
    temp: 44.1,
    solarRadiation: 925,
    windSpeed: 16.0,
    humidity: 45,
    wbgt: 33.6,
    risk: "FATAL",
    color: "#ba1a1a",
    wards: 22,
    description: "Ganges plain intense heat with high vulnerable demographic exposure.",
  },
  {
    id: "BR-02",
    name: "Gaya",
    state: "Bihar",
    region: "East",
    lat: 24.7914,
    lng: 85.0002,
    temp: 45.0,
    solarRadiation: 955,
    windSpeed: 17.2,
    humidity: 34,
    wbgt: 33.7,
    risk: "FATAL",
    color: "#ba1a1a",
    wards: 14,
    description: "Surrounded by hills that trap extreme summer heat.",
  },
  {
    id: "OD-01",
    name: "Bhubaneswar",
    state: "Odisha",
    region: "East",
    lat: 20.2961,
    lng: 85.8245,
    temp: 42.8,
    solarRadiation: 890,
    windSpeed: 18.0,
    humidity: 65,
    wbgt: 34.1,
    risk: "FATAL",
    color: "#ba1a1a",
    wards: 18,
    description: "Coastal Odisha combination of heat and moisture triggering red alerts.",
  },
  {
    id: "JH-01",
    name: "Ranchi",
    state: "Jharkhand",
    region: "East",
    lat: 23.3441,
    lng: 85.3096,
    temp: 40.2,
    solarRadiation: 875,
    windSpeed: 15.0,
    humidity: 44,
    wbgt: 31.5,
    risk: "HIGH",
    color: "#d97706",
    wards: 16,
    description: "Chota Nagpur plateau with afternoon intense solar radiation.",
  },
  {
    id: "JH-02",
    name: "Jamshedpur",
    state: "Jharkhand",
    region: "East",
    lat: 22.8046,
    lng: 86.2029,
    temp: 43.8,
    solarRadiation: 930,
    windSpeed: 14.5,
    humidity: 48,
    wbgt: 33.4,
    risk: "EXTREME",
    color: "#ea580c",
    wards: 15,
    description: "Heavy industrial steel city micro-climate.",
  },
  {
    id: "AS-01",
    name: "Guwahati",
    state: "Assam",
    region: "Northeast",
    lat: 26.1445,
    lng: 91.7362,
    temp: 37.8,
    solarRadiation: 820,
    windSpeed: 12.0,
    humidity: 72,
    wbgt: 32.2,
    risk: "HIGH",
    color: "#d97706",
    wards: 12,
    description: "Brahmaputra valley gateway with tropical humidity profile.",
  },
];

interface GoogleStyleMapProps {
  selectedLocation: LocationTelemetry;
  onSelectLocation: (loc: LocationTelemetry) => void;
}

export default function GoogleStyleMap({
  selectedLocation,
  onSelectLocation,
}: GoogleStyleMapProps) {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const thermalLayerRef = useRef<any[]>([]);

  const [mapType, setMapType] = useState<"roadmap" | "satellite" | "terrain">("roadmap");
  const [showThermalLayer, setShowThermalLayer] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Default Center: India
      const map = L.map(mapContainerRef.current, {
        center: [22.5937, 78.9629],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      const tileLayers: Record<string, string> = {
        roadmap: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        satellite: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        terrain: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
      };

      const currentLayer = L.tileLayer(tileLayers[mapType] || tileLayers.roadmap, {
        maxZoom: 19,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(map);

      (map as any)._baseTileLayer = currentLayer;

      // Allow clicking ANY coordinate on the map to query the Weather API!
      map.on("click", async (e: any) => {
        const { lat, lng } = e.latlng;
        setIsSyncing(true);
        const live = await fetchLiveWeatherTelemetry(lat, lng);
        setIsSyncing(false);

        const customLoc: LocationTelemetry = {
          id: `coord-${Date.now()}`,
          name: `Lat: ${lat.toFixed(2)}°, Lng: ${lng.toFixed(2)}°`,
          state: "Custom Selected Coordinate",
          region: "Central",
          lat,
          lng,
          temp: live.temp,
          solarRadiation: live.solarRadiation,
          windSpeed: live.windSpeed,
          humidity: live.humidity,
          wbgt: live.wbgt,
          risk: live.risk,
          color: live.risk === "FATAL" ? "#ba1a1a" : live.risk === "EXTREME" ? "#ea580c" : "#d97706",
          wards: 1,
          description: `Telemetry Source: ${live.source}`,
          source: live.source,
        };

        onSelectLocation(customLoc);
      });

      renderAllCityMarkers(L, map);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (map._baseTileLayer) {
        map.removeLayer(map._baseTileLayer);
      }

      const tileLayers: Record<string, string> = {
        roadmap: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        satellite: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        terrain: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
      };

      const newLayer = L.tileLayer(tileLayers[mapType] || tileLayers.roadmap, {
        maxZoom: 19,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(map);

      map._baseTileLayer = newLayer;
    });
  }, [mapType]);

  // Update Thermal circles visibility
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    thermalLayerRef.current.forEach((circle) => {
      if (showThermalLayer) {
        circle.addTo(mapInstanceRef.current);
      } else {
        circle.remove();
      }
    });
  }, [showThermalLayer]);

  // Re-render markers when filter/region changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import("leaflet").then((L) => {
      renderAllCityMarkers(L, mapInstanceRef.current);
    });
  }, [searchFilter, selectedRegion]);

  // Pan to selected location
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;
    mapInstanceRef.current.flyTo([selectedLocation.lat, selectedLocation.lng], 8, {
      duration: 1.2,
    });
  }, [selectedLocation]);

  const renderAllCityMarkers = (L: any, map: any) => {
    markersRef.current.forEach((m) => m.remove());
    thermalLayerRef.current.forEach((c) => c.remove());
    markersRef.current = [];
    thermalLayerRef.current = [];

    const filteredCities = HOTSPOTS_DATA.filter((spot) => {
      const matchesSearch =
        spot.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        spot.state.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesRegion = selectedRegion === "ALL" || spot.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });

    filteredCities.forEach((spot) => {
      // 1. Thermal Circle
      const radius = spot.risk === "FATAL" ? 110000 : spot.risk === "EXTREME" ? 85000 : spot.risk === "HIGH" ? 60000 : 40000;
      const circle = L.circle([spot.lat, spot.lng], {
        radius,
        color: spot.color,
        fillColor: spot.color,
        fillOpacity: spot.risk === "FATAL" ? 0.35 : spot.risk === "EXTREME" ? 0.25 : 0.15,
        weight: 1.5,
        dashArray: "3, 5",
      });

      if (showThermalLayer) {
        circle.addTo(map);
      }
      thermalLayerRef.current.push(circle);

      // 2. Custom Google Maps Pin Icon with real-time temperature badge
      const isSelected = selectedLocation?.id === spot.id;
      const customIcon = L.divIcon({
        className: "custom-google-pin",
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group" style="transform: translate(-50%, -100%);">
            <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-2xl border-2 ${
              isSelected ? "border-yellow-300 ring-4 ring-yellow-400/50 scale-125" : "border-white"
            } transition-all hover:scale-110 active:scale-95" style="background-color: ${spot.color};">
              <span class="material-symbols-outlined text-white text-base font-bold">thermostat</span>
            </div>
            <div class="absolute -bottom-1.5 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px]" style="border-t-color: ${spot.color};"></div>
            <div class="absolute -top-6 whitespace-nowrap bg-slate-900/90 text-white text-[9px] font-mono px-1.5 py-0.2 rounded shadow font-bold border border-slate-700 pointer-events-none">
              ${spot.name.split(" ")[0]} ${spot.temp}°C
            </div>
          </div>
        `,
        iconSize: [32, 38],
        iconAnchor: [16, 38],
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; padding: 4px; min-width: 240px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
            <div>
              <strong style="font-size: 13px; color: #041627; display: block;">${spot.name}</strong>
              <span style="font-size: 10px; color: #64748b; font-family: monospace;">${spot.state} (${spot.region} Zone)</span>
            </div>
            <span style="font-size: 9px; font-weight: bold; background: ${spot.color}; color: white; padding: 2px 6px; border-radius: 4px;">${spot.risk}</span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">${spot.description}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; font-family: monospace; background: #f8fafc; padding: 6px; border-radius: 6px;">
            <div>🌡️ <strong>Temp:</strong> ${spot.temp}°C</div>
            <div>☀️ <strong>Solar:</strong> ${spot.solarRadiation} W/m²</div>
            <div>💨 <strong>Wind:</strong> ${spot.windSpeed} km/h</div>
            <div>💧 <strong>Humidity:</strong> ${spot.humidity}%</div>
          </div>
          <div style="margin-top: 6px; font-size: 10px; color: #ba1a1a; font-weight: bold; font-family: monospace;">
            🔥 Peak WBGT: ${spot.wbgt}°C (${spot.wards} Wards under alert)
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("click", async () => {
        setIsSyncing(true);
        const live = await fetchLiveWeatherTelemetry(spot.lat, spot.lng);
        setIsSyncing(false);
        onSelectLocation({
          ...spot,
          temp: live.temp,
          solarRadiation: live.solarRadiation,
          windSpeed: live.windSpeed,
          humidity: live.humidity,
          wbgt: live.wbgt,
          risk: live.risk,
          source: live.source,
        });
      });

      markersRef.current.push(marker);
    });
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetLocation = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([22.5937, 78.9629], 5);
      onSelectLocation(HOTSPOTS_DATA[0]);
    }
  };

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col bg-slate-100 select-none">
      {/* 1. Google Maps Styled Top-Left Map Type Switcher & City Search */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex items-center bg-white rounded shadow-md border border-slate-300 overflow-hidden text-xs font-medium">
          <button
            onClick={() => setMapType("roadmap")}
            className={`px-3 py-1.5 transition-colors font-semibold ${
              mapType === "roadmap"
                ? "bg-slate-100 text-secondary border-b-2 border-secondary font-bold"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t("roadmap")}
          </button>
          <div className="w-px h-5 bg-slate-200" />
          <button
            onClick={() => setMapType("satellite")}
            className={`px-3 py-1.5 transition-colors font-semibold ${
              mapType === "satellite"
                ? "bg-slate-100 text-secondary border-b-2 border-secondary font-bold"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t("satellite")}
          </button>
          <div className="w-px h-5 bg-slate-200" />
          <button
            onClick={() => setMapType("terrain")}
            className={`px-3 py-1.5 transition-colors font-semibold ${
              mapType === "terrain"
                ? "bg-slate-100 text-secondary border-b-2 border-secondary font-bold"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t("terrain")}
          </button>
        </div>

        {/* Quick Map City Search */}
        <div className="relative bg-white rounded shadow-md border border-slate-300 flex items-center px-2 py-1">
          <span className="material-symbols-outlined text-sm text-slate-400 mr-1">search</span>
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search city (e.g. Mumbai, Hyderabad)..."
            className="bg-transparent border-0 text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-36 sm:w-48 font-sans"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter("")}
              className="text-slate-400 hover:text-slate-600 text-xs ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. Top-Right Heatwave Layer & Sync Indicator */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
        {isSyncing && (
          <div className="bg-white px-2.5 py-1 rounded shadow border border-slate-300 text-[10px] font-mono font-bold text-secondary flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            <span>Syncing Weather API...</span>
          </div>
        )}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded shadow-md border border-slate-300 text-xs font-mono">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showThermalLayer}
              onChange={(e) => setShowThermalLayer(e.target.checked)}
              className="rounded accent-error cursor-pointer"
            />
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
              {t("thermalLayer")}
            </span>
          </label>
        </div>
      </div>

      {/* 3. Bottom-Right Google Maps Styled Zoom & Fullscreen Controls */}
      <div className="absolute bottom-6 right-3 z-[1000] flex flex-col gap-2 items-end">
        <div className="flex flex-col bg-white rounded shadow-md border border-slate-300 overflow-hidden">
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-700 hover:bg-slate-100 transition-colors"
            title="Toggle Fullscreen"
          >
            <span className="material-symbols-outlined text-lg block">
              {isFullscreen ? "fullscreen_exit" : "fullscreen"}
            </span>
          </button>
          <div className="w-full h-px bg-slate-200" />
          <button
            onClick={handleResetLocation}
            className="p-2 text-slate-700 hover:bg-slate-100 transition-colors"
            title="Reset to India Overview"
          >
            <span className="material-symbols-outlined text-lg block">my_location</span>
          </button>
        </div>

        <div className="flex flex-col bg-white rounded shadow-md border border-slate-300 overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="p-2 text-slate-700 hover:bg-slate-100 transition-colors"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-lg block">add</span>
          </button>
          <div className="w-full h-px bg-slate-200" />
          <button
            onClick={handleZoomOut}
            className="p-2 text-slate-700 hover:bg-slate-100 transition-colors"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-lg block">remove</span>
          </button>
        </div>
      </div>

      {/* 4. Bottom-Left Map Legend & Cities Counter */}
      <div className="absolute bottom-6 left-3 z-[1000] bg-white/95 backdrop-blur-xs p-2.5 rounded shadow-md border border-slate-300 text-[11px] font-mono flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <span className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">
            Heat Stress Scale ({HOTSPOTS_DATA.length} Cities Monitored)
          </span>
          <span className="text-[9px] text-secondary font-semibold">💡 Click any pin for live API</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" />
            <span>Fatal (&gt;44°C)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" />
            <span>Extreme (42-44°C)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]" />
            <span>High (40-42°C)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
            <span>Moderate (&lt;40°C)</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
}
