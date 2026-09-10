// src/app/(pages)/courses/_data/coursesData.js

export const ALL_COURSES = [
  {
    id: "1",
    title: "LPG Safety for Regular Consumers",
    slug: "1",
    description:
      "Essential safety guidelines for safe handling, soap-bubble leak testing, kitchen ventilation, and emergency incident response for household LPG users.",
    category: "Consumer Safety",
    badge: "FREE",
    badgeColor: "bg-amber-500",
    audience: "Consumers & Homemakers",
    level: "Beginner",
    duration: "1h 45m",
    totalLessons: 8,
    totalQuizzes: 1,
    rating: 4.9,
    enrolledCount: "12,480",
    price: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
    instructor: {
      name: "Engr. Mahmudul Hasan",
      role: "Lead Safety Auditor, Ex-DoE",
      experience: "15+ Years Industrial Experience",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    },
    learningPoints: [
      "Proper positioning and upright orientation of LPG cylinders in domestic kitchens.",
      "Recognizing defective regulator O-rings and verifying pin connections.",
      "Conducting standard non-flammable soap-solution leak checks safely.",
      "Immediate action sequence when LPG gas odor (ethyl mercaptan) is detected.",
      "Preventing electrical spark ignition (switches, refrigerators, matches).",
      "Selecting certified hoses conforming to BDS/ISO national safety standards.",
    ],
    curriculum: [
      {
        moduleTitle: "Module 1: Introduction to Liquefied Petroleum Gas (LPG)",
        lessons: [
          { title: "Physical Properties & Hazards of LPG", duration: "10 mins", freePreview: true },
          { title: "Understanding Cylinder Construction & Valves", duration: "12 mins", freePreview: true },
          { title: "Safety Markings: Tare Weight, Expiry & Test Dates", duration: "14 mins", freePreview: false },
        ],
      },
      {
        moduleTitle: "Module 2: Daily Kitchen Storage & Safe Connection",
        lessons: [
          { title: "Step-by-Step Regulator Connection Protocol", duration: "15 mins", freePreview: false },
          { title: "Conducting the 2-Minute Soap Water Test", duration: "11 mins", freePreview: false },
          { title: "Ventilation Requirements & Avoidance of Closed Pits", duration: "13 mins", freePreview: false },
        ],
      },
      {
        moduleTitle: "Module 3: Emergency Management & Final Assessment",
        lessons: [
          { title: "What to Do When Gas Leak is Detected", duration: "15 mins", freePreview: false },
          { title: "Extinguishing Small Kitchen Fires: Blanket & DCP Method", duration: "15 mins", freePreview: false },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "LPG Dealer Safety & Regulatory Compliance",
    slug: "2",
    description:
      "Operational standards, DoE license conditions, stacking heights, fire mitigation requirements, and inventory safety for licensed LPG retailers across Bangladesh.",
    category: "Dealer Compliance",
    badge: "FREE",
    badgeColor: "bg-blue-600",
    audience: "Retail Dealers & Point-of-Sale Operators",
    level: "Intermediate",
    duration: "2h 30m",
    totalLessons: 10,
    totalQuizzes: 1,
    rating: 4.8,
    enrolledCount: "8,920",
    price: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
    instructor: {
      name: "Sharmin Sultana",
      role: "Compliance Specialist, LOAB",
      experience: "12+ Years Regulatory Advisory",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    },
    learningPoints: [
      "Department of Explosives (DoE) licensing checklist and retail clearances.",
      "Maximum vertical stacking height limitations for empty vs full cylinders.",
      "Fire extinguisher placement, regular hydro-testing, and staff drill routines.",
      "Safe handling during unloading from delivery trucks to avoid brass valve damage.",
      "Documentation of cylinder serial numbers and batch tracking.",
      "Legal penalties regarding unauthorized cross-brand refilling.",
    ],
    curriculum: [
      {
        moduleTitle: "Module 1: Legal Framework & Explosives Rules 2004",
        lessons: [
          { title: "Statutory Requirements for Dealer Warehouses", duration: "14 mins", freePreview: true },
          { title: "Fire Service & Civil Defense NOC Procedures", duration: "16 mins", freePreview: true },
        ],
      },
      {
        moduleTitle: "Module 2: Warehouse Layout & Stacking Safety",
        lessons: [
          { title: "Distance Clearances from Property Lines & Electric Mains", duration: "15 mins", freePreview: false },
          { title: "Cylinder Floor Stacking Limits & Stability", duration: "18 mins", freePreview: false },
          { title: "Material Handling: Trolleys vs Rolling Prohibition", duration: "12 mins", freePreview: false },
        ],
      },
      {
        moduleTitle: "Module 3: Emergency Preparedness & Certification",
        lessons: [
          { title: "Emergency Water Reservoirs & Dry Chemical Powder (DCP)", duration: "20 mins", freePreview: false },
          { title: "Comprehensive Dealer Compliance Assessment", duration: "15 mins", freePreview: false },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "LPG Safety for High-Pressure Industrial Use",
    slug: "4",
    description:
      "Engineering best practices for vaporizers, manifold installations, gas leak detection telemetry, and pressure reduction stations in manufacturing plants.",
    category: "Industrial Use",
    badge: "৳ 500",
    badgeColor: "bg-emerald-600",
    audience: "Engineers, Boiler Operators & Plant Managers",
    level: "Advanced",
    duration: "3h 45m",
    totalLessons: 14,
    totalQuizzes: 1,
    rating: 4.9,
    enrolledCount: "3,410",
    price: 500,
    imageUrl:
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
    instructor: {
      name: "Dr. Kazi Ariful Islam",
      role: "Professor of Chemical Engineering (BUET)",
      experience: "20+ Years Oil & Gas Consultant",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    learningPoints: [
      "Design principles of liquid-withdrawal manifold and vaporizer skids.",
      "Flameproof (Ex-d) electrical standards for hazardous Zone 1 / Zone 2 areas.",
      "Piping isometric inspections and hydro-testing at 1.5x design pressure.",
      "Emergency Shutdown Valves (ESDV) and remote nitrogen actuation.",
      "Automated optical flame sensors and fixed gas detection arrays.",
      "Standard Operating Procedures (SOP) for hot work permits.",
    ],
    curriculum: [
      {
        moduleTitle: "Module 1: Industrial Manifolds & Vaporization Systems",
        lessons: [
          { title: "Design of Multi-Cylinder LOT (Liquid Off-Take) Banks", duration: "20 mins", freePreview: true },
          { title: "Water Bath vs Direct Fired Vaporizers Safety", duration: "25 mins", freePreview: false },
        ],
      },
      {
        moduleTitle: "Module 2: Piping Standards & Hazardous Area Classification",
        lessons: [
          { title: "Seamless Carbon Steel Pipe Specs (ASTM A106 Gr B)", duration: "22 mins", freePreview: false },
          { title: "Zone 1 vs Zone 2 Hazardous Boundaries & Ventilation", duration: "18 mins", freePreview: false },
        ],
      },
      {
        moduleTitle: "Module 3: Instrumentation & Final Examination",
        lessons: [
          { title: "ESDV Control Philosophy & Gas Telemetry Alarms", duration: "25 mins", freePreview: false },
          { title: "Certified Industrial Safety Engineer Exam", duration: "30 mins", freePreview: false },
        ],
      },
    ],
  },
];
