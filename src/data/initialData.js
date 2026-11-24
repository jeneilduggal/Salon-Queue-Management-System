export const initialServices = [
  {
    id: "bespoke_cut",
    category: "hair",
    nameEn: "The Bespoke Signature Haircut",
    nameGu: "સિગ્નેચર બેસ્પોક હેરકટ",
    description: "Precision shear sculpting, hot towel nape rinse & luxury styling finish.",
    duration: 45,
    price: 650,
    icon: "Scissors",
    active: true
  },
  {
    id: "executive_cut",
    category: "hair",
    nameEn: "Executive Scissor Cut & Finish",
    nameGu: "એક્ઝિક્યુટિવ સીઝર કટ",
    description: "Classic silhouette tailoring, bespoke consultation & botanical rinse.",
    duration: 35,
    price: 500,
    icon: "Scissors",
    active: true
  },
  {
    id: "royal_shave",
    category: "grooming",
    nameEn: "Traditional Hot Towel Royal Shave",
    nameGu: "રોયલ હોટ ટોવેલ શેવ",
    description: "Pre-shave essential oils, straight-edge razor ritual & chilled aloe compress.",
    duration: 30,
    price: 420,
    icon: "Sparkles",
    active: true
  },
  {
    id: "beard_sculpt",
    category: "grooming",
    nameEn: "Beard Sculpting & Conditioning",
    nameGu: "દાઢી સ્કલ્પ્ટિંગ અને કંડિશનિંગ",
    description: "Line contouring with straight razor, organic balm infusion & steam soften.",
    duration: 25,
    price: 350,
    icon: "Sparkles",
    active: true
  },
  {
    id: "japanese_spa",
    category: "treatment",
    nameEn: "Japanese Scalp Therapy & Spa",
    nameGu: "જાપાનીઝ સ્કેલ્પ થેરાપી સ્પા",
    description: "Deep clarifying scalp detox, pressure-point shiatsu massage & herbal mist.",
    duration: 50,
    price: 850,
    icon: "ShowerHead",
    active: true
  },
  {
    id: "charcoal_facial",
    category: "treatment",
    nameEn: "Artisan Charcoal Detox Facial",
    nameGu: "આર્ટિસન ચારકોલ ડીટોક્સ ફેશિયલ",
    description: "Volcanic clay pore cleansing, warm steam extraction & antioxidant veil.",
    duration: 35,
    price: 550,
    icon: "Smile",
    active: true
  },
  {
    id: "color_blending",
    category: "color",
    nameEn: "Natural Grey Blending & Glaze",
    nameGu: "નેચરલ ગ્રે બ્લેન્ડિંગ અને ગ્લેઝ",
    description: "Subtle tone integration, ammonia-free pigment & luminous seal.",
    duration: 45,
    price: 750,
    icon: "Palette",
    active: true
  }
];

export const initialBarbers = [
  {
    id: "alexandre",
    name: "Alexandre Vance",
    role: "Master Stylist & Creative Director",
    specialty: "Haute Cut & Editorial Styling",
    avatar: "✂️",
    chair: 1,
    onDuty: true,
    onBreak: false,
    status: "busy", // 'busy' | 'available' | 'on_break' | 'off_duty'
    currentTicketId: "Q-101"
  },
  {
    id: "marcus",
    name: "Marcus Sterling",
    role: "Senior Grooming Artisan",
    specialty: "Classic Scissor Cut & Hot Towel Shave",
    avatar: "🪒",
    chair: 2,
    onDuty: true,
    onBreak: false,
    status: "busy",
    currentTicketId: "Q-102"
  },
  {
    id: "elena",
    name: "Elena Rostova",
    role: "Senior Colorist & Spa Specialist",
    specialty: "Scalp Therapy & Luminous Color",
    avatar: "🎨",
    chair: 3,
    onDuty: true,
    onBreak: false,
    status: "available",
    currentTicketId: null
  },
  {
    id: "julian",
    name: "Julian Thorne",
    role: "Contemporary Stylist",
    specialty: "Texture Fades & Silhouette Design",
    avatar: "✨",
    chair: 4,
    onDuty: true,
    onBreak: true,
    status: "on_break",
    currentTicketId: null
  }
];

export const initialTickets = [
  {
    id: "Q-101",
    token: "Q-101",
    name: "Lord Sterling",
    phone: "9876543210",
    serviceIds: ["bespoke_cut"],
    barberPreference: "alexandre",
    status: "in_chair", // 'waiting' | 'called' | 'in_chair' | 'done' | 'cancelled' | 'no_show'
    assignedBarberId: "alexandre",
    createdAt: Date.now() - 35 * 60 * 1000,
    startedAt: Date.now() - 20 * 60 * 1000,
    completedAt: null
  },
  {
    id: "Q-102",
    token: "Q-102",
    name: "Julian Ross",
    phone: "9825012345",
    serviceIds: ["executive_cut", "beard_sculpt"],
    barberPreference: "marcus",
    status: "in_chair",
    assignedBarberId: "marcus",
    createdAt: Date.now() - 28 * 60 * 1000,
    startedAt: Date.now() - 10 * 60 * 1000,
    completedAt: null
  },
  {
    id: "Q-103",
    token: "Q-103",
    name: "Arthur Pendelton",
    phone: "9898011223",
    serviceIds: ["bespoke_cut", "royal_shave"],
    barberPreference: "alexandre",
    status: "waiting",
    assignedBarberId: null,
    createdAt: Date.now() - 22 * 60 * 1000,
    startedAt: null,
    completedAt: null
  },
  {
    id: "Q-104",
    token: "Q-104",
    name: "David Sterling",
    phone: "9712345678",
    serviceIds: ["royal_shave"],
    barberPreference: "any",
    status: "waiting",
    assignedBarberId: null,
    createdAt: Date.now() - 16 * 60 * 1000,
    startedAt: null,
    completedAt: null
  },
  {
    id: "Q-105",
    token: "Q-105",
    name: "Harrison Blake",
    phone: "9909988776",
    serviceIds: ["japanese_spa"],
    barberPreference: "elena",
    status: "waiting",
    assignedBarberId: null,
    createdAt: Date.now() - 10 * 60 * 1000,
    startedAt: null,
    completedAt: null
  },
  {
    id: "Q-106",
    token: "Q-106",
    name: "Oliver Vance",
    phone: "9426033445",
    serviceIds: ["bespoke_cut"],
    barberPreference: "any",
    status: "waiting",
    assignedBarberId: null,
    createdAt: Date.now() - 4 * 60 * 1000,
    startedAt: null,
    completedAt: null
  }
];

export const initialStats = {
  servedCount: 19,
  avgWait: 18,
  noShowCount: 1,
  totalRevenue: 12450
};
