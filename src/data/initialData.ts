import {
  ProjectRecord,
  UpcomingProjectRecord,
  TestimonialRecord,
  EnquiryRecord,
  ContactMessageRecord,
  SiteSettingsRecord,
  CorridorItem,
} from '../types';

export const HERO_BANNER_IMAGE = '/src/assets/images/hero_luxury_farmhouse_1791631632360.jpg';

export const INITIAL_SITE_SETTINGS: SiteSettingsRecord = {
  company_name: 'RD INFRA',
  domain: 'rd-infra',
  tagline: 'Building Better Tomorrows',
  email: 'rdinfra.98@gmail.com',
  phone: '+91 97170 77699',
  phone_raw: '9717077699',
  whatsapp: '919717077699',
  hero_headline: 'Invest in Locations. Build Your Future.',
  hero_subheadline:
    'Since 2014, RD INFRA has guided investors and families across North India’s most promising real estate corridors with transparent advisory, thorough market analysis, and long-term value focus.',
  about_paragraphs: [
    'RD Infra is a trusted real estate company built on over a decade of industry experience. Since 2014, we have been actively involved in the real estate sector, successfully marketing and selling residential plots, floors, apartments, commercial projects, and plotted developments across Gurgaon, Karnal, Dharuhera, Bawal, and surrounding regions.',
    'With extensive experience in project underwriting, sales, and market analysis, we understand the dynamics of the real estate market and help our clients make informed investment decisions. Over the years, we have worked with a wide range of real estate developments, delivering value-driven opportunities to investors and end users alike.',
    "Today, RD Infra specializes in premium farmhouse and land investment projects located in some of North India's fastest-growing corridors. We are currently working on carefully selected farmhouse developments along the NH-48 Delhi–Jaipur Highway, Sohna Western Peripheral region, Delhi–Mumbai Expressway corridor, and the spiritual and rapidly developing destination of Vrindavan.",
    'At RD Infra, our focus is on identifying strategic locations with strong growth potential, excellent connectivity, and long-term investment value. We are committed to maintaining the highest standards of transparency, professionalism, and customer service, ensuring that every client receives expert guidance throughout their investment journey.',
    'Whether you are looking for a premium farmhouse, a secure land investment, or a future growth opportunity, RD Infra is dedicated to helping you invest with confidence and build a stronger future through real estate.',
  ],
  our_story:
    'Established in 2014, RD INFRA began with a clear commitment to professionalize real estate advisory across Gurgaon and surrounding Haryana growth markets. Over the past decade, we have evolved from residential and commercial project marketing into a specialized advisory house for strategic land and premium farmhouse developments.',
  our_experience:
    'With 10+ years of active on-ground experience across Gurgaon, Karnal, Dharuhera, and Bawal, our team brings deep hands-on knowledge of regional infrastructure expansion, micro-market demand, and project lifecycle execution.',
  our_expertise:
    'We specialize in project underwriting, strategic market analysis, farmhouse estates, plotted developments, and carefully selected land investment opportunities along major expressway and highway corridors.',
  our_vision:
    'To be North India’s most trusted real estate and land investment organization—empowering families and investors to build lasting futures in high-potential locations.',
  our_mission:
    'To identify strategic real estate corridors early, uphold complete transparency in client guidance, and deliver thoughtfully planned developments with enduring utility and value.',
  our_commitment:
    'Every client engagement at RD INFRA is anchored in clarity, honest communication, and personalized support from initial inquiry and site inspection through final documentation.',
  map_placeholder_note:
    'Corporate Office Location Placeholder — Configure exact office coordinates and Google Maps embed URL from the RD INFRA Admin Panel.',
  disclaimer_text:
    'Disclaimer: All property information, project layouts, availability, pricing, approvals, specifications, and other project details presented on this website (rd-infra) are for general informational purposes only and should be independently verified with RD INFRA before making any purchase or investment decision. Past market trends do not guarantee future appreciation, and RD INFRA does not present or promise any investment returns as guaranteed.',
  director: {
    section_heading: 'MEET OUR DIRECTOR',
    name: 'Mr. Ravinder Deshwal',
    title: 'Founder & Director | Visionary Entrepreneur',
    photo_url: '/director-portrait.jpg',
    bio_paragraphs: [
      'With over 12 years of experience in the real estate industry, Mr. Ravinder Deshwal is the Founder & Director of RD Infra, a real estate advisory and investment company specializing in premium residential, commercial, farmhouse, and land investments.',
      'Over the years, he has guided 900+ families and investors in making strategic property investment decisions across key markets of Gurugram, Delhi-NCR, Karnal, Rohtak, Dharuhera, Rewari, Jind, and other emerging growth corridors.',
      'He has been professionally associated with reputed developers including DLF, M3M, Elan, AIPL, SS Group, Amaya, Emaar, Smart World, Signature Global, and Godrej Properties, gaining extensive experience across luxury residential, commercial, and large-scale developments.',
      'With 2 years of experience in the Dubai real estate market, he also brings an international perspective to property investment and wealth creation.',
    ],
    core_expertise: [
      'Residential & Commercial Real Estate',
      'Farmhouse & Land Investments',
      'Investment Advisory & Wealth Creation',
      'Market Research & Project Evaluation',
      'Strategic Sales & Business Development',
      'Dubai Real Estate Opportunities',
    ],
    vision_statement:
      'To redefine real estate consultancy through trust, transparency, strategic guidance, and long-term value creation.',
    developer_associations: [
      'DLF',
      'M3M',
      'Elan',
      'AIPL',
      'SS Group',
      'Amaya',
      'Emaar',
      'Smart World',
      'Signature Global',
      'Godrej Properties',
    ],
  },
};

export const INITIAL_PROJECTS: ProjectRecord[] = [
  {
    id: 1,
    project_name: 'RD INFRA Greenwoods Farmhouse Estate (Sample Placeholder)',
    location: 'Sohna / Western Peripheral Region',
    project_type: 'Farmhouse Projects',
    description:
      'A thoughtfully planned gated farmhouse development nestled near the Sohna and Western Peripheral corridor, designed for serene weekend living and long-term green estate ownership.',
    highlights: [
      'Direct connectivity toward Sohna Road & KMP Western Peripheral Expressway',
      'Low-density landscaped environment with wide internal approach roads',
      'Ideal for custom farmhouse living and nature-focused family retreats',
      'Contact RD INFRA for latest plot configurations, availability, and verification documents',
    ],
    image: '/src/assets/images/project_sohna_farmhouse_estate_1791763451656.jpg',
    status: 'Featured',
    created_at: '2026-01-15',
  },
  {
    id: 2,
    project_name: 'NH-48 Strategic Land Investment Corridor (Sample Placeholder)',
    location: 'NH-48 Delhi–Jaipur Highway (Dharuhera – Bawal Belt)',
    project_type: 'Land Investment Projects',
    description:
      'Carefully selected land investment opportunities situated along the high-connectivity NH-48 Delhi–Jaipur Highway corridor across the Dharuhera and Bawal region.',
    highlights: [
      'Strategic proximity to NH-48 highway infrastructure and industrial hubs',
      'Selected through rigorous market analysis and location underwriting',
      'Suited for long-term land investors seeking highway-corridor exposure',
      'All parcel details and documentation available for review with our team',
    ],
    image: '/src/assets/images/project_nh48_land_corridor_1791763465693.jpg',
    status: 'Featured',
    created_at: '2026-02-10',
  },
  {
    id: 3,
    project_name: 'Vrindavan Heritage Plotted Enclave (Sample Placeholder)',
    location: 'Vrindavan Corridor',
    project_type: 'Plotted Developments',
    description:
      'A serene residential plotted development opportunity in the spiritual and rapidly developing destination of Vrindavan, tailored for peaceful living and second-home buyers.',
    highlights: [
      'Convenient access to key spiritual landmarks and highway approaches in Vrindavan',
      'Planned internal roads, green surroundings, and community-oriented layout',
      'Designed for families seeking a spiritual retreat or plotted residence',
      'Editable sample project — verify current plot sizes and specifications with RD INFRA',
    ],
    image: '/src/assets/images/project_vrindavan_heritage_plots_1791763476928.jpg',
    status: 'Featured',
    created_at: '2026-03-01',
  },
  {
    id: 4,
    project_name: 'Gurgaon Corporate & Retail Plaza (Sample Placeholder)',
    location: 'Gurgaon Growth Corridor, Haryana',
    project_type: 'Commercial Projects',
    description:
      'Modern commercial retail and office space opportunities marketed by RD INFRA across established and emerging residential catchments in Gurgaon.',
    highlights: [
      'Positioned within high-visibility urban catchments in Gurgaon',
      'Suitable for retail outlets, professional offices, and service enterprises',
      'Backed by RD INFRA’s decade-long experience in commercial sales & underwriting',
      'Schedule a consultation for current commercial inventory and layout details',
    ],
    image: '/src/assets/images/project_gurgaon_commercial_plaza_1791763490215.jpg',
    status: 'Active',
    created_at: '2026-03-18',
  },
  {
    id: 5,
    project_name: 'Prime Residential Floors & Plots (Sample Placeholder)',
    location: 'Gurgaon & Karnal Residential Sectors',
    project_type: 'Residential Projects',
    description:
      'Curated residential plots, independent builder floors, and family apartments across well-connected sectors in Gurgaon and Karnal.',
    highlights: [
      'Located in established residential neighborhoods with civic infrastructure',
      'Options spanning residential plots, low-rise floors, and modern apartments',
      'Guided end-to-end by RD INFRA’s customer-focused advisory team',
      'Enquire directly to verify available units and site visit schedules',
    ],
    image: '/src/assets/images/project_gurgaon_residential_floors_1791763502666.jpg',
    status: 'Active',
    created_at: '2026-04-02',
  },
  {
    id: 6,
    project_name: 'Expressway Corridor Land & Farmhouse Parcel (Sample Placeholder)',
    location: 'Delhi–Mumbai Expressway Corridor',
    project_type: 'Farmhouse Projects',
    description:
      'Selected farmhouse and land investment parcels benefiting from the expanding connectivity of the Delhi–Mumbai Expressway corridor.',
    highlights: [
      'Situated near key interchanges along the Delhi–Mumbai Expressway region',
      'Focused on long-term location utility and regional infrastructure growth',
      'Comprehensive site tours and orientation provided by RD INFRA',
      'Editable placeholder — reach out to our team for current project briefs',
    ],
    image: '/src/assets/images/project_dme_expressway_estate_1791763512527.jpg',
    status: 'Featured',
    created_at: '2026-04-10',
  },
];

export const INITIAL_UPCOMING_PROJECTS: UpcomingProjectRecord[] = [
  {
    id: 1,
    project_name: 'Upcoming Highway Farmhouse Enclave (Editable Placeholder)',
    location: 'NH-48 Delhi–Jaipur Highway',
    project_category: 'Farmhouse Projects',
    description:
      'An upcoming gated farmhouse community strategically positioned off the NH-48 Delhi–Jaipur Highway corridor, offering expansive green spaces and modern infrastructure planning.',
    connectivity_highlights: [
      'Smooth access from NH-48 Delhi–Jaipur Highway',
      'Well-connected to Gurgaon, Dharuhera, and Bawal regional hubs',
      'Planned internal road network and gated entry',
    ],
    badge: 'Coming Soon',
    image: '/src/assets/images/project_sohna_farmhouse_estate_1791763451656.jpg',
    status: 'Upcoming',
    created_at: '2026-05-01',
  },
  {
    id: 2,
    project_name: 'Western Peripheral Green Estates (Editable Placeholder)',
    location: 'Sohna / Western Peripheral Region',
    project_category: 'Land Investment Projects',
    description:
      'Carefully selected land and farmhouse development opportunity in the Sohna and Western Peripheral (KMP) belt, tailored for discerning buyers seeking natural surroundings.',
    connectivity_highlights: [
      'Proximity to Sohna Elevated Road & Western Peripheral Expressway',
      'Direct regional linkage to South Gurgaon and NCR corridors',
      'Scenic backdrop with peaceful low-density surroundings',
    ],
    badge: 'Upcoming',
    image: '/src/assets/images/project_dme_expressway_estate_1791763512527.jpg',
    status: 'Registering Interest',
    created_at: '2026-05-05',
  },
  {
    id: 3,
    project_name: 'Expressway Growth Corridor Project (Editable Placeholder)',
    location: 'Delhi–Mumbai Expressway Corridor',
    project_category: 'Land Investment Projects',
    description:
      'Upcoming strategic land and plotted development along the fast-developing Delhi–Mumbai Expressway corridor, selected for strong regional connectivity.',
    connectivity_highlights: [
      'Easy approach to Delhi–Mumbai Expressway interchanges',
      'Seamless travel link toward Gurgaon, Sohna, and NCR',
      'Designed for long-term land and estate buyers',
    ],
    badge: 'Coming Soon',
    image: '/src/assets/images/project_nh48_land_corridor_1791763465693.jpg',
    status: 'Upcoming',
    created_at: '2026-05-10',
  },
  {
    id: 4,
    project_name: 'Vrindavan Serene Retreat & Plots (Editable Placeholder)',
    location: 'Vrindavan',
    project_category: 'Plotted Developments',
    description:
      'An upcoming plotted and retreat development in the sacred and rapidly developing destination of Vrindavan, planned with peaceful avenues and modern civic provisions.',
    connectivity_highlights: [
      'Accessible from NH-19 (Delhi–Agra Highway) and Yamuna Expressway route',
      'Close to Vrindavan’s revered spiritual and cultural landmarks',
      'Thoughtfully planned community environment',
    ],
    badge: 'Upcoming',
    image: '/src/assets/images/project_vrindavan_heritage_plots_1791763476928.jpg',
    status: 'Registering Interest',
    created_at: '2026-05-12',
  },
];

export const INITIAL_TESTIMONIALS: TestimonialRecord[] = [
  {
    id: 1,
    customer_name: 'SUBHASMITA',
    testimonial:
      'We were genuinely impressed by the vision, planning, and quality of the project. RD Infra combines modern development with a strong focus on long-term value.',
    rating: 5,
    image: '',
    status: 'Active',
    created_at: '2026-02-14',
  },
  {
    id: 2,
    customer_name: 'NEHUL SHARMA',
    testimonial:
      'From our first interaction to every stage of the investment, RD Infra demonstrated exceptional professionalism and attention to detail. We felt confident and well supported throughout.',
    rating: 5,
    image: '',
    status: 'Active',
    created_at: '2026-03-04',
  },
  {
    id: 3,
    customer_name: 'PREET CHAUHAN',
    testimonial:
      'The project is beautifully planned, thoughtfully developed, and offers a sense of exclusivity. The RD Infra team made the entire experience seamless and reassuring.',
    rating: 5,
    image: '',
    status: 'Active',
    created_at: '2026-03-22',
  },
  {
    id: 4,
    customer_name: 'MADHAVI',
    testimonial:
      'From the quality of the project to the professionalism of the team, every aspect reflects thoughtful planning and attention to detail. RD Infra delivers an experience that inspires confidence.',
    rating: 5,
    image: '',
    status: 'Active',
    created_at: '2026-04-09',
  },
  {
    id: 5,
    customer_name: 'DEEPANSHU BHARDWAJ',
    testimonial:
      'RD Infra combines refined planning, quality development, and a customer-first approach. It’s reassuring to invest with a company that thinks beyond today and focuses on lasting value.',
    rating: 5,
    image: '',
    status: 'Active',
    created_at: '2026-04-28',
  },
];

export const INITIAL_ENQUIRIES: EnquiryRecord[] = [
  {
    id: 1,
    name: 'Nehul Sharma',
    phone: '+91 98110 00001',
    email: 'nehul.sample@example.com',
    project: 'RD INFRA Greenwoods Farmhouse Estate (Sample Placeholder)',
    requirement: 'Farmhouse Projects',
    message: 'Interested in knowing more about farmhouse plot sizes and scheduling a site visit.',
    status: 'New',
    created_at: '2026-10-09 11:30 AM',
  },
  {
    id: 2,
    name: 'Preet Chauhan',
    phone: '+91 98110 00002',
    email: 'preet.sample@example.com',
    project: 'Vrindavan Serene Retreat & Plots (Editable Placeholder)',
    requirement: 'Plotted Developments',
    message: 'Please share updates when registrations open for the upcoming Vrindavan project.',
    status: 'Contacted',
    created_at: '2026-10-08 04:15 PM',
  },
];

export const INITIAL_CONTACT_MESSAGES: ContactMessageRecord[] = [
  {
    id: 1,
    name: 'Deepanshu Bhardwaj',
    phone: '+91 98110 00003',
    email: 'deepanshu.sample@example.com',
    subject: 'Consultation Request — NH-48 Corridor',
    message: 'Would like to discuss land investment opportunities along NH-48 Delhi–Jaipur Highway.',
    status: 'New',
    created_at: '2026-10-10 09:45 AM',
  },
];

export const INVESTMENT_CORRIDORS: CorridorItem[] = [
  {
    id: 'gurgaon',
    name: 'Gurgaon',
    regionType: 'Core Market Experience',
    description:
      'Active since 2014 in marketing and selling residential plots, independent floors, apartments, commercial projects, and plotted developments across key Gurgaon sectors.',
    connectivityNote: 'NH-48, Southern Peripheral Road, Dwarka Expressway & Sohna Road connectivity.',
  },
  {
    id: 'karnal',
    name: 'Karnal',
    regionType: 'Core Market Experience',
    description:
      'Proven track record in plotted residential developments, floors, and commercial opportunities along the NH-44 North Haryana belt.',
    connectivityNote: 'Direct NH-44 Grand Trunk Road access between Delhi NCR and Chandigarh.',
  },
  {
    id: 'dharuhera',
    name: 'Dharuhera',
    regionType: 'Core Market Experience',
    description:
      'Extensive experience in residential plots, plotted colonies, and strategic land opportunities serving the expanding industrial and residential catchment.',
    connectivityNote: 'Positioned directly on NH-48 Delhi–Jaipur Highway near Gurgaon–Manesar.',
  },
  {
    id: 'bawal',
    name: 'Bawal',
    regionType: 'Core Market Experience',
    description:
      'In-depth market understanding of residential and land developments surrounding the Bawal industrial growth hub.',
    connectivityNote: 'Connected via NH-48 and regional freight/industrial corridors.',
  },
  {
    id: 'nh48',
    name: 'NH-48 Delhi–Jaipur Highway',
    regionType: 'Strategic Focus Corridor',
    description:
      'Current focus on carefully selected farmhouse developments and strategic land investment parcels with strong highway accessibility.',
    connectivityNote: 'Primary arterial highway linking Delhi, Gurgaon, Dharuhera, Bawal, and Jaipur.',
  },
  {
    id: 'sohna-wpe',
    name: 'Sohna / Western Peripheral Region',
    regionType: 'Strategic Focus Corridor',
    description:
      'Curated farmhouse and land investment projects located in the scenic foothills and well-connected Western Peripheral (KMP) belt.',
    connectivityNote: 'Sohna Elevated Corridor & KMP Western Peripheral Expressway interchange.',
  },
  {
    id: 'dme',
    name: 'Delhi–Mumbai Expressway Corridor',
    regionType: 'Strategic Focus Corridor',
    description:
      'Selected farmhouse and land investment opportunities positioned along one of India’s premier greenfield expressway corridors.',
    connectivityNote: 'High-speed access-controlled expressway linking Delhi NCR with Western India.',
  },
  {
    id: 'vrindavan',
    name: 'Vrindavan',
    regionType: 'Strategic Focus Corridor',
    description:
      'Thoughtfully selected farmhouse, retreat, and plotted land opportunities in the spiritual and rapidly developing destination of Vrindavan.',
    connectivityNote: 'Connected via NH-19 (Delhi–Agra Highway) and Yamuna Expressway link.',
  },
];

export const WHY_CHOOSE_FEATURES = [
  {
    id: 'exp',
    title: '10+ Years of Experience',
    description:
      'Active in the real estate sector since 2014 across residential, commercial, plotted, and land developments.',
  },
  {
    id: 'loc',
    title: 'Strategic Locations',
    description:
      'Focused on identifying locations with strong connectivity and long-term utility across North India’s growth corridors.',
  },
  {
    id: 'mkt',
    title: 'Market Knowledge',
    description:
      'Deep expertise in project underwriting, sales execution, and micro-market analysis across Haryana and NCR.',
  },
  {
    id: 'trans',
    title: 'Transparent Guidance',
    description:
      'Committed to clear communication, ethical practices, and encouraging thorough verification at every stage.',
  },
  {
    id: 'cust',
    title: 'Customer-First Approach',
    description:
      'Tailored advisory for both end-users and investors, ensuring dedicated support throughout your journey.',
  },
  {
    id: 'val',
    title: 'Long-Term Value Focus',
    description:
      'We prioritize sustainable development quality and foundational location strengths over short-term speculation.',
  },
];
