# 🗺️ Chapter 05: Geospatial Hotspot Intelligence & Map Engine

## 📌 1. Spatial Engine Architecture

Geospatial intelligence is the tactical cornerstone of proactive law enforcement. The **CrimeScope AI 2.0 Geospatial Hotspot Canvas** maps all **202,533 verified crime incidents** across the geographical landscape of Karnataka, providing commanders with immediate visual awareness of spatial clusters, jurisdiction borders, and emerging hotspots.

```
Geospatial Processing Flow
┌────────────────────────────────────────────────────────┐
│ 1. Ingest Karnataka Police 2025 Incident Geocodes      │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ 2. Calculate District Centroids & Normalised X/Y Coords │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ 3. Compute Quantile Risk Thresholds (Safe to Critical)  │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ 4. Render Animated Radar Pulses & Layer Filter Overlays │
└────────────────────────────────────────────────────────┘
```

---

## 🎨 2. Quantile Risk Classification Engine

To avoid arbitrary subjective risk labeling, CrimeScope AI 2.0 calculates risk scores on a normalized 0–100 scale using statewide quantile distribution:

```
Quantile Risk Tiers
┌───────────┬──────────────┬─────────────┬────────────────────────────────────────────┐
│ Risk Tier │ Score Range  │ Node Color  │ Tactical Operational Directive             │
├───────────┼──────────────┼─────────────┼────────────────────────────────────────────┤
│ 🟢 SAFE   │ 0 – 34       │ Emerald     │ Standard routine beat patrols; monitoring  │
│ 🔵 MODERATE│ 35 – 64     │ Sapphire    │ Enhanced evening patrols; checkpost checks │
│ 🟠 HIGH   │ 65 – 84      │ Amber       │ Intensive night beats; highway interceptors│
│ 🔴 CRITICAL│ 85 – 100    │ Ruby/Crimson│ Taskforce deployment; Pink Patrol priority │
└───────────┴──────────────┴─────────────┴────────────────────────────────────────────┘
```

---

## 🌊 3. Concentric Radar Wave Animation

High-risk urban coordinates feature continuous animated radar pulses rendered via pure CSS keyframe transformations:

```css
@keyframes radarWave {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(2.2);
    opacity: 0.3;
  }
  100% {
    transform: scale(3.2);
    opacity: 0;
  }
}
```

This delivers an intuitive military-style tactical HUD visual, alerting dispatchers immediately to critical urban pressure points without distracting from tabular data.

---

## 🏆 4. Statewide Hotspot vs. Safest Jurisdictions Ranking

### 🔴 Top 5 Highest Crime Volume Jurisdictions (Hotspots)

| Rank | Jurisdiction | Administrative Range | 2025 IPC Cases | 2025 SLL Cases | Total Incidents | Risk Index |
|:---:|---|---|:---:|:---:|:---:|:---:|
| 1 | 🏙️ **Bengaluru City** | Commissionerates | 37,181 | 19,291 | **56,472** | **98.4 (Critical)** |
| 2 | 🏛️ **Bengaluru District** | Central Range | 6,433 | 1,187 | **7,620** | **78.2 (High)** |
| 3 | 🏛️ **Tumakuru** | Central Range | 5,961 | 2,509 | **8,470** | **82.5 (High)** |
| 4 | 🌲 **Mysuru District** | Southern Range | 4,952 | 912 | **5,864** | **74.1 (High)** |
| 5 | 🌾 **Shivamogga** | Eastern Range | 4,840 | 2,155 | **6,995** | **77.8 (High)** |

### 🟢 Top 5 Lowest Crime Volume Jurisdictions (Safest)

| Rank | Jurisdiction | Administrative Range | 2025 IPC Cases | 2025 SLL Cases | Total Incidents | Risk Index |
|:---:|---|---|:---:|:---:|:---:|:---:|
| 1 | 🚂 **Karnataka Railways** | Commissionerates | 662 | 138 | **800** | **18.5 (Safe)** |
| 2 | 🏛️ **K.G.F** | Central Range | 782 | 360 | **1,142** | **22.4 (Safe)** |
| 3 | 🏰 **Dharwad (Rural)** | Northern Range | 1,016 | 625 | **1,641** | **28.1 (Safe)** |
| 4 | 🏰 **Gadag** | Northern Range | 1,043 | 1,225 | **2,268** | **31.2 (Safe)** |
| 5 | 🏙️ **Hubballi Dharwad City** | Commissionerates | 1,488 | 1,160 | **2,648** | **34.8 (Safe)** |

---

## 🎯 5. Spatial Layer Filtering Controls

The map canvas provides three real-time filter overlays:
1. **IPC / BNS Crimes Layer**: Renders circles proportional to core penal offences (Theft, Burglary, Robbery, Assault).
2. **SLL Offences Layer**: Focuses on Special and Local Laws (Excise violations, Gambling, Narcotics, Arms Act).
3. **Compound Risk Score Layer**: Computes multi-factor risk indexes incorporating population density, transit proximity, and seasonal factors.
