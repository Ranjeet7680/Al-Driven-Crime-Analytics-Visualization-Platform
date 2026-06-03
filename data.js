// ================================================
//   CrimeScope AI — Real Karnataka Crime Data 2025
// ================================================

const CRIME_DATA = {

  // --- District-wise Crimes 2025 ---
  districts: [
    { name: 'Bengaluru City',    range: 'Commissionerates', ipc: 37181, sll: 19291 },
    { name: 'Mysuru City',       range: 'Commissionerates', ipc: 2224,  sll: 1040  },
    { name: 'Hubballi Dharwad City', range: 'Commissionerates', ipc: 1488, sll: 1160 },
    { name: 'Mangaluru City',    range: 'Commissionerates', ipc: 2278,  sll: 1205  },
    { name: 'Belagavi City',     range: 'Commissionerates', ipc: 1655,  sll: 652   },
    { name: 'Kalaburagi City',   range: 'Commissionerates', ipc: 1730,  sll: 1010  },
    { name: 'Bengaluru Dist',    range: 'Central Range',    ipc: 6433,  sll: 1187  },
    { name: 'Bengaluru South',   range: 'Central Range',    ipc: 3644,  sll: 936   },
    { name: 'Tumakuru',          range: 'Central Range',    ipc: 5961,  sll: 2509  },
    { name: 'Kolar',             range: 'Central Range',    ipc: 2245,  sll: 505   },
    { name: 'Chickballapura',    range: 'Central Range',    ipc: 2542,  sll: 1619  },
    { name: 'K.G.F',             range: 'Central Range',    ipc: 782,   sll: 360   },
    { name: 'Chitradurga',       range: 'Eastern Range',    ipc: 4098,  sll: 1740  },
    { name: 'Davanagere',        range: 'Eastern Range',    ipc: 3385,  sll: 1386  },
    { name: 'Shivamogga',        range: 'Eastern Range',    ipc: 4840,  sll: 2155  },
    { name: 'Haveri',            range: 'Eastern Range',    ipc: 2406,  sll: 1155  },
    { name: 'Dakshina Kannada',  range: 'Western Range',    ipc: 1816,  sll: 417   },
    { name: 'Udupi',             range: 'Western Range',    ipc: 2249,  sll: 752   },
    { name: 'Chikkamagaluru',    range: 'Western Range',    ipc: 2722,  sll: 1488  },
    { name: 'Uttara Kannada',    range: 'Western Range',    ipc: 2334,  sll: 1596  },
    { name: 'Belagavi Dist',     range: 'Northern Range',   ipc: 4535,  sll: 2059  },
    { name: 'Bagalkot',          range: 'Northern Range',   ipc: 2208,  sll: 1362  },
    { name: 'Vijayapur',         range: 'Northern Range',   ipc: 3062,  sll: 1992  },
    { name: 'Dharwad',           range: 'Northern Range',   ipc: 1016,  sll: 625   },
    { name: 'Gadag',             range: 'Northern Range',   ipc: 1043,  sll: 1225  },
    { name: 'Kalaburagi',        range: 'North Eastern Range', ipc: 2683, sll: 1025 },
    { name: 'Bidar',             range: 'North Eastern Range', ipc: 3054, sll: 1172 },
    { name: 'Yadgir',            range: 'North Eastern Range', ipc: 1622, sll: 1093 },
    { name: 'Mysuru Dist',       range: 'Southern Range',   ipc: 4952,  sll: 912   },
    { name: 'Mandya',            range: 'Southern Range',   ipc: 4780,  sll: 1150  },
    { name: 'Chamarajanagar',    range: 'Southern Range',   ipc: 2068,  sll: 844   },
    { name: 'Hassan',            range: 'Southern Range',   ipc: 4781,  sll: 1366  },
    { name: 'Kodagu',            range: 'Southern Range',   ipc: 1724,  sll: 600   },
    { name: 'Ballari',           range: 'Ballari Range',    ipc: 1924,  sll: 1961  },
    { name: 'Koppal',            range: 'Ballari Range',    ipc: 1945,  sll: 1255  },
    { name: 'Raichur',           range: 'Ballari Range',    ipc: 2813,  sll: 1458  },
    { name: 'Vijayanagara',      range: 'Ballari Range',    ipc: 1781,  sll: 1467  },
    { name: 'Karnataka Railways', range: 'Commissionerates', ipc: 662,  sll: 138   },
  ],

  // --- Major IPC Crime Categories 2025 ---
  ipcCrimes: [
    { category: 'Murder',                   total: 1210,  subcats: [
      { name: 'For gain', val: 43 }, { name: 'Property Dispute', val: 24 },
      { name: 'Personal Vendetta', val: 34 }, { name: 'Sexual Jealousy', val: 23 },
      { name: 'Revenge/Enmity', val: 45 }, { name: 'Sudden Quarrel', val: 96 },
      { name: 'Civil Disputes', val: 49 }, { name: 'Love Intrigue', val: 23 },
      { name: 'Due to Adultery', val: 20 }, { name: 'Other Causes', val: 829 },
    ]},
    { category: 'Attempt to Murder',        total: 3258,  subcats: [
      { name: 'Revenge/Enmity', val: 237 }, { name: 'Sudden Quarrel', val: 308 },
      { name: 'Civil Disputes', val: 334 }, { name: 'Personal Vendetta', val: 83 },
      { name: 'Property Dispute', val: 80 }, { name: 'Other Causes', val: 2095 },
    ]},
    { category: 'Rape',                      total: 656,   subcats: [
      { name: 'Known Person', val: 317 }, { name: 'Other Causes', val: 205 },
      { name: 'Relatives', val: 31 }, { name: 'Neighbours', val: 38 },
      { name: 'By a Gang', val: 16 }, { name: 'Unknown Person', val: 21 },
    ]},
    { category: 'Kidnapping & Abduction',    total: 4209,  subcats: [
      { name: 'Missing Boy', val: 2673 }, { name: 'Missing Girl', val: 997 },
      { name: 'Others', val: 391 }, { name: 'For Ransom (Others)', val: 65 },
    ]},
    { category: 'Dacoity',                   total: 143   },
    { category: 'Robbery',                   total: 1084,  subcats: [
      { name: 'Chain Snatching', val: 459 }, { name: 'Other Places', val: 359 },
      { name: 'Residential', val: 107 }, { name: 'Highways', val: 61 },
    ]},
    { category: 'Burglary (Night)',          total: 3905,  subcats: [
      { name: 'Residential', val: 2379 }, { name: 'Commercial', val: 642 },
      { name: 'Other Places', val: 461 }, { name: 'Temple Theft', val: 391 },
    ]},
    { category: 'Burglary (Day)',            total: 1101  },
    { category: 'Theft',                     total: 20531, subcats: [
      { name: 'Two Wheelers', val: 8860 }, { name: 'House Theft', val: 1936 },
      { name: 'Of Sand', val: 1293 }, { name: 'Jewellery', val: 1478 },
      { name: 'Other Items', val: 1706 }, { name: 'Servant Theft', val: 527 },
      { name: 'Cash', val: 510 }, { name: 'Electronic Goods', val: 985 },
      { name: 'Of Cattle', val: 544 }, { name: 'Of Snatching', val: 543 },
      { name: 'Cars/Jeeps', val: 250 }, { name: 'Extortion', val: 283 },
    ]},
    { category: 'Riots',                     total: 3391  },
    { category: 'Cheating',                  total: 5839  },
    { category: 'Cases of Hurt',             total: 16713, subcats: [
      { name: 'Simple Hurt', val: 15513 }, { name: 'Grievous Hurt', val: 1190 },
      { name: 'Acid Attack', val: 2 }, { name: 'Attempt Acid Attack', val: 6 },
    ]},
    { category: 'Criminal Intimidation',     total: 3299  },
    { category: 'Molestation',               total: 5840,  subcats: [
      { name: 'Other Places', val: 2602 }, { name: 'Public Place', val: 2189 },
      { name: 'Private Place', val: 972 }, { name: 'Attempt', val: 65 },
    ]},
    { category: 'Fatal Road Accidents',      total: 11408, subcats: [
      { name: 'Other Roads', val: 4097 }, { name: 'National Highways', val: 4015 },
      { name: 'State Highways', val: 3135 }, { name: 'Other Places', val: 161 },
    ]},
    { category: 'Non-Fatal Road Accidents',  total: 31751, subcats: [
      { name: 'Other Roads', val: 13939 }, { name: 'National Highways', val: 10233 },
      { name: 'State Highways', val: 7158 }, { name: 'Other Places', val: 421 },
    ]},
    { category: 'Cruelty by Husband',        total: 2830,  subcats: [
      { name: 'Husband & Relatives', val: 1328 }, { name: 'Husband', val: 1059 },
      { name: 'Dowry Harassment', val: 407 }, { name: 'Relatives in Law', val: 36 },
    ]},
    { category: 'Dowry Deaths',              total: 116,   subcats: [
      { name: 'By Hanging', val: 62 }, { name: 'Husband & Relatives', val: 40 },
      { name: 'By Other Means', val: 10 }, { name: 'By Husband', val: 2 },
    ]},
    { category: 'Criminal Trespass',         total: 2794  },
    { category: 'Forgery',                   total: 616   },
    { category: 'Arson',                     total: 194   },
    { category: 'Public Safety',             total: 5240  },
    { category: 'Negligent Act',             total: 3921  },
    { category: 'Deaths-Negligence',         total: 329   },
    { category: 'Suicide',                   total: 749,   subcats: [
      { name: 'Abetment of Suicide', val: 401 }, { name: 'Other Reasons', val: 264 },
      { name: 'Attempt', val: 76 }, { name: 'Dowry', val: 8 },
    ]},
    { category: 'Sexual Intercourse (Deceit)', total: 249, subcats: [
      { name: 'False Marriage Promise', val: 236 }, { name: 'Job Promotion Claim', val: 2 },
      { name: 'Others', val: 10 },
    ]},
    { category: 'Eve Teasing',               total: 403   },
    { category: 'Communal / Religion',        total: 260   },
    { category: 'Failure to Appear in Court', total: 1370 },
    { category: 'Offences vs Public Servants', total: 1163 },
    { category: 'Human Trafficking',          total: 15   },
  ],

  // --- December 2025 Monthly Comparison Data ---
  monthlyComparison: [
    { crime: 'Murder',              ytd: 1210, prevYearMonth: 62,  prevMonth: 67,  currentMonth: 57  },
    { crime: 'Attempt to Murder',   ytd: 3258, prevYearMonth: 196, prevMonth: 253, currentMonth: 262 },
    { crime: 'Rape',                ytd: 656,  prevYearMonth: 55,  prevMonth: 44,  currentMonth: 41  },
    { crime: 'Kidnapping',          ytd: 4209, prevYearMonth: 307, prevMonth: 404, currentMonth: 402 },
    { crime: 'Robbery',             ytd: 1084, prevYearMonth: 91,  prevMonth: 108, currentMonth: 102 },
    { crime: 'Burglary Night',      ytd: 3905, prevYearMonth: 338, prevMonth: 288, currentMonth: 345 },
    { crime: 'Theft',               ytd: 20531, prevYearMonth: 1826, prevMonth: 1638, currentMonth: 1706 },
    { crime: 'Riots',               ytd: 3391, prevYearMonth: 256, prevMonth: 251, currentMonth: 281 },
    { crime: 'Hurt',                ytd: 16713, prevYearMonth: 1327, prevMonth: 1318, currentMonth: 1474 },
    { crime: 'Molestation',         ytd: 5840, prevYearMonth: 425, prevMonth: 464, currentMonth: 521 },
    { crime: 'Cheating',            ytd: 5839, prevYearMonth: 554, prevMonth: 479, currentMonth: 632 },
    { crime: 'Fatal Accidents',     ytd: 11408, prevYearMonth: 1093, prevMonth: 926, currentMonth: 1004 },
  ],

  // --- Crimes Against Women 2024 vs 2025 ---
  womenCrimes: [
    { crime: 'Rape',                    y2024: 656,  y2025: 656  },
    { crime: 'Sexual Intercourse (Deceit)', y2024: 220, y2025: 249 },
    { crime: 'Molestation',             y2024: 5480, y2025: 5840 },
    { crime: 'Eve Teasing',             y2024: 380,  y2025: 403  },
    { crime: 'Cruelty by Husband',      y2024: 2700, y2025: 2830 },
    { crime: 'Dowry Deaths',            y2024: 105,  y2025: 116  },
    { crime: 'Kidnapping of Women',     y2024: 180,  y2025: 195  },
    { crime: 'Assault on Women',        y2024: 28,   y2025: 29   },
    { crime: 'Human Trafficking (Women)', y2024: 12, y2025: 9   },
  ],

  // --- Crimes Against Children 2025 ---
  childrenCrimes: [
    { crime: 'Missing Boy',        val: 2673 },
    { crime: 'Missing Girl',       val: 997  },
    { crime: 'Kidnapping (Minor)', val: 540  },
    { crime: 'Rape on Minor',      val: 0    },
    { crime: 'Infanticide',        val: 5    },
    { crime: 'Exposure/Abandonment', val: 65 },
    { crime: 'Molestation (Minor)', val: 320 },
    { crime: 'Child Labour Offences', val: 45 },
  ],

  // --- Crimes Against SCs/STs 2025 ---
  scstCrimes: [
    { crime: 'Murder',        val: 94  },
    { crime: 'Rape',          val: 113 },
    { crime: 'Kidnapping',    val: 182 },
    { crime: 'Hurt',          val: 320 },
    { crime: 'Assault',       val: 48  },
    { crime: 'Intimidation',  val: 165 },
    { crime: 'Mischief',      val: 75  },
    { crime: 'Other Crimes',  val: 203 },
  ],

  // --- State Totals ---
  stateTotals: { ipc: 138666, sll: 63867, total: 202533 },

  // --- Chart color palette ---
  colors: {
    purple:  '#a855f7',
    blue:    '#3b82f6',
    emerald: '#10b981',
    amber:   '#f59e0b',
    red:     '#ef4444',
    pink:    '#ec4899',
    cyan:    '#06b6d4',
    violet:  '#8b5cf6',
    orange:  '#f97316',
    teal:    '#14b8a6',
    lime:    '#84cc16',
    rose:    '#f43f5e',
  },

  // Chart global config
  chartDefaults: {
    bgColor: '#111827',
    gridColor: 'rgba(255,255,255,0.05)',
    textColor: '#94a3b8',
    fontFamily: "'Inter', sans-serif",
  }
};
