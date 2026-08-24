# 📊 Chapter 03: Karnataka Police 2025 Dataset & Data Dictionary

## 📌 1. Dataset Provenance & Authority

The statistical backbone of **CrimeScope AI 2.0** is compiled directly from the official **Karnataka Police Annual Statistics Report (2025)** published by the Government of Karnataka. The dataset encompasses **202,533 verified and investigated police records** covering all 31 revenue districts, 6 major city police commissionerates, and the specialized Karnataka Railways Police jurisdiction.

Every incident in the platform is cataloged according to the Indian Penal Code (IPC) / Bharatiya Nyaya Sanhita (BNS) and Special & Local Laws (SLL), providing an authentic, verifiable baseline for predictive modeling.

---

## 📈 2. Statewide Totals & Macro Distribution

```
2025 Karnataka State Crime Distribution
┌────────────────────────────────────────────────────────┬─────────────┬──────────┐
│ Category                                               │ Total Cases │ Share %  │
├────────────────────────────────────────────────────────┼─────────────┼──────────┤
│ Total Recorded Crimes                                  │ 202,533     │ 100.0%   │
│ Indian Penal Code (IPC) / BNS Offences                 │ 138,666     │ 68.5%    │
│ Special and Local Laws (SLL) Violations                │ 63,867      │ 31.5%    │
│ Statewide Crime Resolution Rate                        │ 72.0%       │ —        │
│ Total Administrative Jurisdictions Tracked             │ 37          │ —        │
└────────────────────────────────────────────────────────┴─────────────┴──────────┘
```

---

## 🏛️ 3. Administrative Range Distribution Breakdown

The 37 policing jurisdictions of Karnataka are administratively clustered across 8 regional Police Ranges:

```
Karnataka State Crime Distribution by Range (IPC Cases)
├── 🏙️ Commissionerates (6 Cities + Rlys) : 46,554 IPC cases (33.6% state share)
│   ├── Bengaluru City                    : 37,181 IPC | 19,291 SLL
│   ├── Mangaluru City                    : 2,278 IPC  | 1,205 SLL
│   ├── Mysuru City                       : 2,224 IPC  | 1,040 SLL
│   ├── Kalaburagi City                   : 1,730 IPC  | 1,010 SLL
│   ├── Belagavi City                     : 1,655 IPC  | 652 SLL
│   ├── Hubballi Dharwad City             : 1,488 IPC  | 1,160 SLL
│   └── Karnataka Railways                : 662 IPC    | 138 SLL
│
├── 🏛️ Central Range                      : 21,607 IPC cases (15.6% state share)
│   ├── Bengaluru District                : 6,433 IPC  | 1,187 SLL
│   ├── Tumakuru                          : 5,961 IPC  | 2,509 SLL
│   ├── Bengaluru South                   : 3,644 IPC  | 936 SLL
│   ├── Chickballapura                    : 2,542 IPC  | 1,619 SLL
│   ├── Kolar                             : 2,245 IPC  | 505 SLL
│   └── K.G.F                             : 782 IPC    | 360 SLL
│
├── 🌲 Southern Range                     : 18,305 IPC cases (13.2% state share)
│   ├── Mysuru District                   : 4,952 IPC  | 912 SLL
│   ├── Hassan                            : 4,781 IPC  | 1,366 SLL
│   ├── Mandya                            : 4,780 IPC  | 1,150 SLL
│   ├── Chamarajanagar                    : 2,068 IPC  | 844 SLL
│   └── Kodagu                            : 1,724 IPC  | 600 SLL
│
├── 🌾 Eastern Range                      : 14,729 IPC cases (10.6% state share)
│   ├── Shivamogga                        : 4,840 IPC  | 2,155 SLL
│   ├── Chitradurga                       : 4,098 IPC  | 1,740 SLL
│   ├── Davanagere                        : 3,385 IPC  | 1,386 SLL
│   └── Haveri                            : 2,406 IPC  | 1,155 SLL
│
├── 🏰 Northern Range                     : 11,864 IPC cases (8.6% state share)
│   ├── Belagavi District                 : 4,535 IPC  | 2,059 SLL
│   ├── Vijayapur                         : 3,062 IPC  | 1,992 SLL
│   ├── Bagalkot                          : 2,208 IPC  | 1,362 SLL
│   ├── Gadag                             : 1,043 IPC  | 1,225 SLL
│   └── Dharwad                           : 1,016 IPC  | 625 SLL
│
├── 🌊 Western Range                      : 9,121 IPC cases (6.6% state share)
│   ├── Chikkamagaluru                    : 2,722 IPC  | 1,488 SLL
│   ├── Uttara Kannada                    : 2,334 IPC  | 1,596 SLL
│   ├── Udupi                             : 2,249 IPC  | 752 SLL
│   └── Dakshina Kannada                  : 1,816 IPC  | 417 SLL
│
├── ⛏️ Ballari Range                      : 8,463 IPC cases (6.1% state share)
│   ├── Raichur                           : 2,813 IPC  | 1,458 SLL
│   ├── Koppal                            : 1,945 IPC  | 1,255 SLL
│   ├── Ballari                           : 1,924 IPC  | 1,961 SLL
│   └── Vijayanagara                      : 1,781 IPC  | 1,467 SLL
│
└── ☀️ North Eastern Range                : 7,359 IPC cases (5.3% state share)
    ├── Bidar                             : 3,054 IPC  | 1,172 SLL
    ├── Kalaburagi District               : 2,683 IPC  | 1,025 SLL
    └── Yadgir                            : 1,622 IPC  | 1,093 SLL
```

---

## 📋 4. Top 10 Crime Heads & Tactical Countermeasures

| Rank | Crime Category Head | 2025 Cases | Subcategory Breakdown & Modus Operandi | Primary AI Tactical Directive |
|:---:|---|:---:|---|---|
| 1 | 💰 **Total Theft** | **20,531** | Two-Wheelers: 8,860 • House: 1,936 • Jewellery: 1,478 • Sand: 1,293 • Electronics: 985 | ANPR camera checkpoints, parking surveillance & midnight beat sweeps |
| 2 | 🚗 **Fatal Road Accidents** | **11,408** | Other Roads: 4,097 • National Highways: 4,015 • State Highways: 3,135 | Highway speed radar interceptors & high-mast illumination at blackspots |
| 3 | 🛵 **Two-Wheeler Thefts** | **8,860** | Transit nodes, metro station parkings, commercial market zones | Transit barricades & automated vehicle registration scanning |
| 4 | 📱 **Cheating & Cybercrime** | **5,839** | UPI fraud, OTP phishing, loan app scams, identity impersonation | Cyber forensics taskforce alerts & multi-channel citizen SMS advisories |
| 5 | 🛡️ **Molestation & Assault** | **5,840** | Public Places: 2,189 • Private Places: 972 • Other Locations: 2,602 | Pink Patrol vehicle deployment, SOS corridor tracking & park beats |
| 6 | 🚸 **Kidnapping & Abduction** | **4,209** | Missing Boys: 2,673 • Missing Girls: 997 • Ransom Cases: 65 | School zone surveillance & inter-district border barricade alerts |
| 7 | 🏠 **Cruelty by Husband (498A)** | **2,830** | Husband & Relatives: 1,328 • Husband: 1,059 • Dowry Harassment: 407 | Specialized women counseling cells & fast-track mediation desks |
| 8 | ⚖️ **Murder Incidents** | **1,210** | Sudden Quarrel: 96 • Civil Disputes: 49 • Enmity: 45 • Property: 24 | Preventive land dispute mediation & history-sheeter surveillance |
| 9 | 🚨 **Robbery Offences** | **1,084** | Chain Snatching: 459 • Residential: 107 • Highways: 61 | Nocturnal motorcycle patrols & gold loan / commercial hub beats |
| 10 | ⚔️ **Dacoity Incidents** | **143** | Interstate gangs, highway freight interception, remote estates | Armed highway taskforces & interstate border checkposts |

---

## 🗄️ 5. Data Schema & Programmatic Data Structures (`data.js`)

The structured data store in `data.js` exposes structured arrays and associative lookup tables used by all visualization and forecasting engines:

```javascript
const CRIME_DATA = {
  // District Master Structure
  districts: [
    { name: 'Bengaluru City', range: 'Commissionerates', ipc: 37181, sll: 19291 },
    { name: 'Tumakuru',       range: 'Central Range',    ipc: 5961,  sll: 2509  },
    // ... 37 jurisdictions
  ],

  // Crime Head Hierarchy
  ipcCrimes: [
    {
      category: 'Theft',
      total: 20531,
      subcats: [
        { name: 'Two Wheelers', val: 8860 },
        { name: 'House Theft',  val: 1936 },
        { name: 'Jewellery',    val: 1478 },
        { name: 'Of Sand',      val: 1293 },
        { name: 'Electronics',  val: 985  }
      ]
    },
    // ... 76 crime heads
  ]
};
```
