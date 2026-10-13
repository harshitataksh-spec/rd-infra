export type ProjectCategory =
  | 'Farmhouse Projects'
  | 'Land Investment Projects'
  | 'Residential Projects'
  | 'Commercial Projects'
  | 'Plotted Developments';

export interface ProjectRecord {
  id: number;
  project_name: string;
  location: string;
  project_type: ProjectCategory;
  description: string;
  highlights: string[];
  image: string;
  status: 'Active' | 'Featured' | 'Draft';
  created_at: string;
}

export interface UpcomingProjectRecord {
  id: number;
  project_name: string;
  location: string;
  project_category: ProjectCategory;
  description: string;
  connectivity_highlights: string[];
  badge: 'Coming Soon' | 'Upcoming';
  image: string;
  status: 'Upcoming' | 'Registering Interest';
  created_at: string;
}

export interface TestimonialRecord {
  id: number;
  customer_name: string;
  testimonial: string;
  rating: number;
  image: string;
  status: 'Active' | 'Hidden';
  created_at: string;
}

export interface EnquiryRecord {
  id: number;
  name: string;
  phone: string;
  email: string;
  project: string;
  requirement: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  created_at: string;
}

export interface ContactMessageRecord {
  id: number;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Replied';
  created_at: string;
}

export interface DirectorProfileRecord {
  section_heading: string;
  name: string;
  title: string;
  photo_url: string;
  bio_paragraphs: string[];
  core_expertise: string[];
  vision_statement: string;
  developer_associations: string[];
}

export interface SiteSettingsRecord {
  company_name: string;
  domain: string;
  tagline: string;
  email: string;
  phone: string;
  phone_raw: string;
  whatsapp: string;
  hero_headline: string;
  hero_subheadline: string;
  about_paragraphs: string[];
  our_story: string;
  our_experience: string;
  our_expertise: string;
  our_vision: string;
  our_mission: string;
  our_commitment: string;
  map_placeholder_note: string;
  disclaimer_text: string;
  director: DirectorProfileRecord;
}

export interface CorridorItem {
  id: string;
  name: string;
  regionType: 'Core Market Experience' | 'Strategic Focus Corridor';
  description: string;
  connectivityNote: string;
}
