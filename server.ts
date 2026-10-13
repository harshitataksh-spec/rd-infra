import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_PROJECTS,
  INITIAL_UPCOMING_PROJECTS,
  INITIAL_TESTIMONIALS,
  INITIAL_ENQUIRIES,
  INITIAL_CONTACT_MESSAGES,
  INITIAL_SITE_SETTINGS,
  INVESTMENT_CORRIDORS,
  WHY_CHOOSE_FEATURES,
} from './src/data/initialData';
import {
  ProjectRecord,
  UpcomingProjectRecord,
  TestimonialRecord,
  EnquiryRecord,
  ContactMessageRecord,
  SiteSettingsRecord,
} from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory state store mirroring MySQL database `rd_infra` tables:
// admins, projects, upcoming_projects, testimonials, enquiries, contact_messages, site_settings
let projectsTable: ProjectRecord[] = [...INITIAL_PROJECTS];
let upcomingProjectsTable: UpcomingProjectRecord[] = [...INITIAL_UPCOMING_PROJECTS];
let testimonialsTable: TestimonialRecord[] = [...INITIAL_TESTIMONIALS];
let enquiriesTable: EnquiryRecord[] = [...INITIAL_ENQUIRIES];
let contactMessagesTable: ContactMessageRecord[] = [...INITIAL_CONTACT_MESSAGES];
let siteSettingsTable: SiteSettingsRecord = { ...INITIAL_SITE_SETTINGS };

// Password Hashing Utility (PBKDF2 SHA-512 — never stores plain text passwords)
const ADMIN_SALT = 'rd_infra_2014_secure_salt';
function hashPassword(plain: string): string {
  return crypto.pbkdf2Sync(plain, ADMIN_SALT, 10000, 64, 'sha512').toString('hex');
}

// `admins` table seed with hashed passwords
const adminsTable = [
  {
    id: 1,
    username: 'admin',
    email: 'rdinfra.98@gmail.com',
    password_hash: hashPassword('rdinfra2026'),
    role: 'Super Admin',
  },
];

// Active Admin Sessions & CSRF Tokens
const activeSessions = new Map<
  string,
  { username: string; csrfToken: string; loginAt: string }
>();

// XSS Sanitization Helper
function sanitizeInput(value: unknown, maxLength = 2000): string {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .slice(0, maxLength)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function verifyAdminAuth(req: express.Request): {
  authorized: boolean;
  username?: string;
} {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false };
  }
  const token = authHeader.replace('Bearer ', '').trim();
  const session = activeSessions.get(token);
  if (!session) {
    return { authorized: false };
  }
  return { authorized: true, username: session.username };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Static SEO & Google Search Console verification endpoints
  app.get('/googlecc57c600f52289c8.html', (_req, res) => {
    res.type('text/html').send('google-site-verification: googlecc57c600f52289c8.html');
  });

  app.get(['/logo.jpg', '/favicon.ico'], (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rd-infra-logo.svg'));
  });

  app.get('/CNAME', (_req, res) => {
    res.type('text/plain').send('rd-infra.in\n');
  });

  app.get('/robots.txt', (_req, res) => {
    res
      .type('text/plain')
      .send(
        `User-agent: *\nAllow: /\nDisallow: /api/admin/\n\nSitemap: https://${siteSettingsTable.domain}/sitemap.xml\nHost: https://${siteSettingsTable.domain}\n`
      );
  });

  app.get('/sitemap.xml', (_req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const sections = ['', '#about', '#projects', '#upcoming', '#corridors', '#testimonials', '#contact'];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sections
  .map(
    (s, i) => `  <url>
    <loc>https://${siteSettingsTable.domain}/${s}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${i === 0 ? '1.0' : '0.85'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
    res.type('application/xml').send(xml);
  });

  // Public Bootstrap Endpoint
  app.get('/api/bootstrap', (_req, res) => {
    res.json({
      projects: projectsTable.filter((p) => p.status !== 'Draft'),
      upcomingProjects: upcomingProjectsTable,
      testimonials: testimonialsTable.filter((t) => t.status === 'Active'),
      settings: siteSettingsTable,
      corridors: INVESTMENT_CORRIDORS,
      whyChoose: WHY_CHOOSE_FEATURES,
    });
  });

  // Submit Customer Enquiry (`enquiries` table)
  app.post('/api/enquiries', (req, res) => {
    const name = sanitizeInput(req.body?.name, 150);
    const phone = sanitizeInput(req.body?.phone, 40);
    const email = sanitizeInput(req.body?.email, 150);
    const project = sanitizeInput(req.body?.project || 'General Project Enquiry', 200);
    const requirement = sanitizeInput(req.body?.requirement || 'Farmhouse / Land Investment', 150);
    const message = sanitizeInput(req.body?.message, 1500);

    if (!name || !phone) {
      res.status(400).json({ error: 'Full Name and Phone Number are required.' });
      return;
    }

    const newRecord: EnquiryRecord = {
      id: enquiriesTable.length > 0 ? Math.max(...enquiriesTable.map((e) => e.id)) + 1 : 1,
      name,
      phone,
      email,
      project,
      requirement,
      message,
      status: 'New',
      created_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    enquiriesTable = [newRecord, ...enquiriesTable];
    res.status(201).json({ success: true, enquiry: newRecord });
  });

  // Submit Contact Message (`contact_messages` table)
  app.post('/api/contact-messages', (req, res) => {
    const name = sanitizeInput(req.body?.name, 150);
    const phone = sanitizeInput(req.body?.phone, 40);
    const email = sanitizeInput(req.body?.email, 150);
    const subject = sanitizeInput(req.body?.subject || 'Website Contact Inquiry', 200);
    const message = sanitizeInput(req.body?.message, 1500);

    if (!name || !phone) {
      res.status(400).json({ error: 'Full Name and Phone Number are required.' });
      return;
    }

    const newMsg: ContactMessageRecord = {
      id:
        contactMessagesTable.length > 0
          ? Math.max(...contactMessagesTable.map((m) => m.id)) + 1
          : 1,
      name,
      phone,
      email,
      subject,
      message,
      status: 'New',
      created_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    contactMessagesTable = [newMsg, ...contactMessagesTable];
    res.status(201).json({ success: true, contactMessage: newMsg });
  });

  // Admin Login (Password Hashing Verification + CSRF token generation)
  app.post('/api/admin/login', (req, res) => {
    const usernameInput = String(req.body?.username || '').trim().toLowerCase();
    const passwordInput = String(req.body?.password || '').trim();

    const inputHash = hashPassword(passwordInput);
    const matchedAdmin = adminsTable.find(
      (a) =>
        (a.username.toLowerCase() === usernameInput ||
          a.email.toLowerCase() === usernameInput) &&
        a.password_hash === inputHash
    );

    if (!matchedAdmin) {
      res.status(401).json({
        authenticated: false,
        error: 'Invalid administrator credentials.',
      });
      return;
    }

    const sessionToken = crypto.randomBytes(24).toString('hex');
    const csrfToken = crypto.randomBytes(16).toString('hex');
    activeSessions.set(sessionToken, {
      username: matchedAdmin.username,
      csrfToken,
      loginAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    });

    res.json({
      authenticated: true,
      token: sessionToken,
      csrfToken,
      username: matchedAdmin.username,
    });
  });

  // Admin Logout
  app.post('/api/admin/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      activeSessions.delete(token);
    }
    res.json({ success: true });
  });

  // Admin Dashboard Snapshot
  app.get('/api/admin/dashboard', (req, res) => {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      res.status(401).json({ error: 'Unauthorized administrator session.' });
      return;
    }

    res.json({
      stats: {
        totalProjects: projectsTable.length,
        upcomingProjects: upcomingProjectsTable.length,
        totalEnquiries: enquiriesTable.length,
        newEnquiries: enquiriesTable.filter((e) => e.status === 'New').length,
        totalTestimonials: testimonialsTable.length,
      },
      projects: projectsTable,
      upcomingProjects: upcomingProjectsTable,
      testimonials: testimonialsTable,
      enquiries: enquiriesTable,
      contactMessages: contactMessagesTable,
      settings: siteSettingsTable,
    });
  });

  // Admin CRUD: Projects (`projects` table)
  app.post('/api/admin/projects', (req, res) => {
    if (!verifyAdminAuth(req).authorized) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const body = req.body || {};
    const newProj: ProjectRecord = {
      id: projectsTable.length > 0 ? Math.max(...projectsTable.map((p) => p.id)) + 1 : 1,
      project_name: sanitizeInput(body.project_name || 'New RD INFRA Project', 200),
      location: sanitizeInput(body.location || 'Gurgaon / NCR Corridor', 200),
      project_type: body.project_type || 'Farmhouse Projects',
      description: sanitizeInput(body.description || '', 2000),
      highlights: Array.isArray(body.highlights)
        ? body.highlights.map((h: unknown) => sanitizeInput(h, 300)).filter(Boolean)
        : [],
      image: sanitizeInput(
        body.image || '/src/assets/images/project_aravalli_farms_1791631645495.jpg',
        500
      ),
      status: body.status || 'Active',
      created_at: new Date().toISOString().split('T')[0],
    };
    projectsTable = [newProj, ...projectsTable];
    res.status(201).json({ success: true, projects: projectsTable });
  });

  app.put('/api/admin/projects/:id', (req, res) => {
    if (!verifyAdminAuth(req).authorized) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const id = Number(req.params.id);
    projectsTable = projectsTable.map((p) =>
      p.id === id
        ? {
            ...p,
            project_name: sanitizeInput(req.body.project_name ?? p.project_name, 200),
            location: sanitizeInput(req.body.location ?? p.location, 200),
            project_type: req.body.project_type ?? p.project_type,
            description: sanitizeInput(req.body.description ?? p.description, 2000),
            highlights: Array.isArray(req.body.highlights)
              ? req.body.highlights.map((h: unknown) => sanitizeInput(h, 300)).filter(Boolean)
              : p.highlights,
            image: sanitizeInput(req.body.image ?? p.image, 500),
            status: req.body.status ?? p.status,
          }
        : p
    );
    res.json({ success: true, projects: projectsTable });
  });

  app.delete('/api/admin/projects/:id', (req, res) => {
    if (!verifyAdminAuth(req).authorized) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const id = Number(req.params.id);
    projectsTable = projectsTable.filter((p) => p.id !== id);
    res.json({ success: true, projects: projectsTable });
  });

  // Admin CRUD: Upcoming Projects (`upcoming_projects` table)
  app.post('/api/admin/upcoming-projects', (req, res) => {
    if (!verifyAdminAuth(req).authorized) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const body = req.body || {};
    const newUpcoming: UpcomingProjectRecord = {
      id:
        upcomingProjectsTable.length > 0
          ? Math.max(...upcomingProjectsTable.map((u) => u.id)) + 1
          : 1,
      project_name: sanitizeInput(body.project_name || 'Upcoming Project', 200),
      location: sanitizeInput(body.location || 'NH-48 Delhi–Jaipur Highway', 200),
      project_category: body.project_category || 'Farmhouse Projects',
      description: sanitizeInput(body.description || '', 2000),
      connectivity_highlights: Array.isArray(body.connectivity_highlights)
        ? body.connectivity_highlights.map((c: unknown) => sanitizeInput(c, 300)).filter(Boolean)
        : [],
      badge: body.badge === 'Coming Soon' ? 'Coming Soon' : 'Upcoming',
      image: sanitizeInput(
        body.image || '/src/assets/images/project_aravalli_farms_1791631645495.jpg',
        500
      ),
      status: body.status || 'Upcoming',
      created_at: new Date().toISOString().split('T')[0],
    };
    upcomingProjectsTable = [newUpcoming, ...upcomingProjectsTable];
    res.status(201).json({ success: true, upcomingProjects: upcomingProjectsTable });
  });

  app.put('/api/admin/upcoming-projects/:id', (req, res) => {
    if (!verifyAdminAuth(req).authorized) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const id = Number(req.params.id);
    upcomingProjectsTable = upcomingProjectsTable.map((u) =>
      u.id === id
        ? {
            ...u,
            project_name: sanitizeInput(req.body.project_name ?? u.project_name, 200),
            location: sanitizeInput(req.body.location ?? u.location, 200),
            project_category: req.body.project_category ?? u.project_category,
            description: sanitizeInput(req.body.description ?? u.description, 2000),
            connectivity_highlights: Array.isArray(req.body.connectivity_highlights)
              ? req.body.connectivity_highlights
                  .map((c: unknown) => sanitizeInput(c, 300))
                  .filter(Boolean)
              : u.connectivity_highlights,
            badge: req.body.badge ?? u.badge,
            image: sanitizeInput(req.body.image ?? u.image, 500),
            status: req.body.status ?? u.status,
          }
        : u
    );
    res.json({ success: true, upcomingProjects: upcomingProjectsTable });
  });

  app.delete('/api/admin/upcoming-projects/:id', (req, res) => {
    if (!verifyAdminAuth(req).authorized) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const id = Number(req.params.id);
    upcomingProjectsTable = upcomingProjectsTable.filter((u) => u.id !== id);
    res.json({ success: true, upcomingProjects: upcomingProjectsTable });
  });

  // Admin CRUD: Testimonials (`testimonials` table)
  app.post('/api/admin/testimonials', (req, res) => {
    if (!verifyAdminAuth(req).authorized) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const body = req.body || {};
    const newTest: TestimonialRecord = {
      id:
        testimonialsTable.length > 0
          ? Math.max(...testimonialsTable.map((t) => t.id)) + 1
          : 1,
      customer_name: sanitizeInput(body.customer_name || 'VALUED CLIENT', 120).toUpperCase(),
      testimonial: sanitizeInput(body.testimonial || '', 1500),
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      image: sanitizeInput(body.image || '', 500),
      status: body.status || 'Active',
      created_at: new Date().toISOString().split('T')[0],
    };
    testimonialsTable = [newTest, ...testimonialsTable];
    res.status(201).json({ success: true, testimonials: testimonialsTable });
  });

  app.put('/api/admin/testimonials/:id', (req, res) => {
    if (!verifyAdminAuth(req).authorized) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const id = Number(req.params.id);
    testimonialsTable = testimonialsTable.map((t) =>
      t.id === id
        ? {
            ...t,
            customer_name: sanitizeInput(
              req.body.customer_name ?? t.customer_name,
              120
            ).toUpperCase(),
            testimonial: sanitizeInput(req.body.testimonial ?? t.testimonial, 1500),
            rating: Math.min(5, Math.max(1, Number(req.body.rating ?? t.rating))),
            status: req.body.status ?? t.status,
          }
        : t
    );
    res.json({ success: true, testimonials: testimonialsTable });
  });

  app.delete('/api/admin/testimonials/:id', (req, res) => {
    if (!verifyAdminAuth(req).authorized) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const id = Number(req.params.id);
    testimonialsTable = testimonialsTable.filter((t) => t.id !== id);
    res.json({ success: true, testimonials: testimonialsTable });
  });

  // Admin: Update Enquiry Status
  app.patch('/api/admin/enquiries/:id', (req, res) => {
    if (!verifyAdminAuth(req).authorized) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const id = Number(req.params.id);
    const status = req.body?.status || 'Contacted';
    enquiriesTable = enquiriesTable.map((e) => (e.id === id ? { ...e, status } : e));
    res.json({ success: true, enquiries: enquiriesTable });
  });

  app.delete('/api/admin/enquiries/:id', (req, res) => {
    if (!verifyAdminAuth(req).authorized) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const id = Number(req.params.id);
    enquiriesTable = enquiriesTable.filter((e) => e.id !== id);
    res.json({ success: true, enquiries: enquiriesTable });
  });

  // Admin: Update Contact Message Status
  app.patch('/api/admin/contact-messages/:id', (req, res) => {
    if (!verifyAdminAuth(req).authorized) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const id = Number(req.params.id);
    const status = req.body?.status || 'Read';
    contactMessagesTable = contactMessagesTable.map((m) =>
      m.id === id ? { ...m, status } : m
    );
    res.json({ success: true, contactMessages: contactMessagesTable });
  });

  // Admin: Update Website Content & Contact Information (`site_settings` table)
  app.put('/api/admin/settings', (req, res) => {
    if (!verifyAdminAuth(req).authorized) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    siteSettingsTable = {
      ...siteSettingsTable,
      ...req.body,
    };
    res.json({ success: true, settings: siteSettingsTable });
  });

  // Persist Original Unedited Director Portrait (`RD INFRA Executive Portrait.png`)
  app.post('/api/director/photo', async (req, res) => {
    const photoUrl = typeof req.body?.photo_url === 'string' ? req.body.photo_url : '';
    if (!photoUrl) {
      res.status(400).json({ error: 'No photo provided' });
      return;
    }
    siteSettingsTable = {
      ...siteSettingsTable,
      director: {
        ...siteSettingsTable.director,
        photo_url: photoUrl,
      },
    };
    // Also save raw binary to /public/director-portrait.png if it's a base64 data URL so it is permanently stored on disk unedited
    if (photoUrl.startsWith('data:image/')) {
      try {
        const fs = await import('fs/promises');
        const base64Data = photoUrl.split(',')[1];
        if (base64Data) {
          await fs.writeFile(
            path.join(__dirname, 'public', 'director-portrait.png'),
            Buffer.from(base64Data, 'base64')
          );
          siteSettingsTable.director.photo_url = '/director-portrait.png';
        }
      } catch {
        // fallback to in-memory data URL
      }
    }
    res.json({ success: true, photo_url: siteSettingsTable.director.photo_url });
  });

  // Server-Side Gemini AI Real Estate Agent (/api/ai/agent)
  app.post('/api/ai/agent', async (req, res) => {
    const userMessage = sanitizeInput(req.body?.message, 1000);
    const history = Array.isArray(req.body?.history) ? req.body.history : [];

    if (!userMessage) {
      res.status(400).json({ error: 'Please enter a message for the RD INFRA AI Agent.' });
      return;
    }

    const activeProjectsSummary = projectsTable
      .filter((p) => p.status !== 'Draft')
      .map(
        (p, i) =>
          `${i + 1}. ${p.project_name} (${p.project_type}) — Location: ${p.location} | Overview: ${p.description}`
      )
      .join('\n');

    const upcomingSummary = upcomingProjectsTable
      .map(
        (u, i) =>
          `${i + 1}. [${u.badge}] ${u.project_name} (${u.project_category}) — Corridor: ${u.location} | ${u.description}`
      )
      .join('\n');

    const systemInstruction = `You are the Official AI Real Estate Advisory Agent for RD INFRA (Website: https://${siteSettingsTable.domain}, Tagline: "${siteSettingsTable.tagline}", Established: 2014).
Official Contact Details:
- Phone / WhatsApp: ${siteSettingsTable.phone}
- Email: ${siteSettingsTable.email}
- Domain: https://${siteSettingsTable.domain}

Company Profile, Leadership & Expertise:
- Founder & Director: ${siteSettingsTable.director?.name || 'Mr. Ravinder Deshwal'} (${siteSettingsTable.director?.title || 'Founder & Director | Visionary Entrepreneur'}).
- Director Background: Over 12 years of experience in the real estate industry; has guided 900+ families and investors across Gurugram, Delhi-NCR, Karnal, Rohtak, Dharuhera, Rewari, Jind, and emerging growth corridors. Professionally associated with reputed developers including DLF, M3M, Elan, AIPL, SS Group, Amaya, Emaar, Smart World, Signature Global, and Godrej Properties. Also brings 2 years of international experience in the Dubai real estate market.
- Director's Core Expertise: Residential & Commercial Real Estate, Farmhouse & Land Investments, Investment Advisory & Wealth Creation, Market Research & Project Evaluation, Strategic Sales & Business Development, and Dubai Real Estate Opportunities.
- Director's Vision: "To redefine real estate consultancy through trust, transparency, strategic guidance, and long-term value creation."
- RD INFRA is a trusted real estate company built on over a decade of industry experience since 2014.
- Core Market Experience: Gurgaon, Karnal, Dharuhera, Bawal, Rohtak, Rewari, Jind, and surrounding regions (marketing and selling residential plots, floors, apartments, commercial projects, and plotted developments).
- Current Strategic Focus Corridors: Premium farmhouse and land investment projects along the NH-48 Delhi–Jaipur Highway, Sohna / Western Peripheral region, Delhi–Mumbai Expressway corridor, and the spiritual and rapidly developing destination of Vrindavan.

Current Featured & Active Projects:
${activeProjectsSummary}

Upcoming Projects:
${upcomingSummary}

Strict Compliance & Advisory Guidelines:
1. Never invent fake RERA numbers, exact project prices, or guaranteed investment returns. Always state that availability, pricing, and project approvals should be verified directly with the RD INFRA team.
2. Keep answers concise (90 to 160 words), helpful, and formatted with clear bullet points where appropriate.
3. Encourage the user to schedule a consultation, submit an enquiry right here in the chat or contact form, or reach out directly via Phone/WhatsApp at ${siteSettingsTable.phone} or Email at ${siteSettingsTable.email}.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const formattedHistory = history
          .slice(-6)
          .map(
            (msg: { role?: string; text?: string }) =>
              `${msg.role === 'user' ? 'Client' : 'RD INFRA AI Agent'}: ${sanitizeInput(msg.text, 600)}`
          )
          .join('\n');

        const promptContents = formattedHistory
          ? `${formattedHistory}\nClient: ${userMessage}`
          : userMessage;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptContents,
          config: {
            systemInstruction,
            temperature: 0.35,
          },
        });

        const textOutput = response.text;
        if (textOutput) {
          res.json({
            reply: textOutput,
            model: 'gemini-3.8-flash',
          });
          return;
        }
      } catch (err) {
        console.warn('Gemini API fallback activated:', err instanceof Error ? err.message : err);
      }
    }

    // Intelligent Domain-Trained Fallback Response
    const q = userMessage.toLowerCase();
    let fallbackReply = '';

    if (
      q.includes('director') ||
      q.includes('founder') ||
      q.includes('ravinder') ||
      q.includes('deshwal') ||
      q.includes('owner') ||
      q.includes('dubai')
    ) {
      fallbackReply = `**Meet Our Director — Mr. Ravinder Deshwal**\n*Founder & Director | Visionary Entrepreneur*\n\n• **12+ Years of Experience:** Guided **900+ families and investors** across Gurugram, Delhi-NCR, Karnal, Rohtak, Dharuhera, Rewari, Jind, and emerging growth corridors.\n• **Developer Associations:** DLF, M3M, Elan, AIPL, SS Group, Amaya, Emaar, Smart World, Signature Global, and Godrej Properties.\n• **International Exposure:** 2 years of experience in the **Dubai real estate market**.\n• **His Vision:** *"To redefine real estate consultancy through trust, transparency, strategic guidance, and long-term value creation."*\n\nConnect directly with our team at **${siteSettingsTable.phone}** or **${siteSettingsTable.email}**.`;
    } else if (q.includes('farmhouse') || q.includes('sohna') || q.includes('western peripheral')) {
      fallbackReply = `**RD INFRA Farmhouse Projects & Estates**\n\nRD INFRA specializes in carefully selected farmhouse developments across North India's fastest-growing corridors:\n• **Sohna / Western Peripheral Region:** Thoughtfully planned low-density green farmhouse estates with smooth access toward Sohna Road and the KMP Expressway.\n• **NH-48 Delhi–Jaipur Highway & Delhi–Mumbai Expressway Corridor:** Strategic farmhouse and land parcels selected for strong highway connectivity and long-term utility.\n\n*Note: Please verify current plot configurations, availability, pricing, and approvals directly with RD INFRA.*\n\nWould you like to register a consultation request or connect with our team at **${siteSettingsTable.phone}**?`;
    } else if (q.includes('vrindavan') || q.includes('plot') || q.includes('spiritual')) {
      fallbackReply = `**Vrindavan & Plotted Developments — RD INFRA**\n\nWe offer curated plotted developments and upcoming retreat projects in the spiritual and rapidly developing destination of **Vrindavan**, as well as across **Gurgaon, Karnal, Dharuhera, and Bawal**:\n• Convenient connectivity via NH-19 (Delhi–Agra Highway) and the Yamuna Expressway link.\n• Planned internal roads, green surroundings, and peaceful community layouts.\n\nCall or WhatsApp **${siteSettingsTable.phone}** or email **${siteSettingsTable.email}** to verify current plot sizes and schedule a site visit.`;
    } else if (q.includes('nh-48') || q.includes('land') || q.includes('expressway') || q.includes('corridor') || q.includes('bawal') || q.includes('dharuhera')) {
      fallbackReply = `**Strategic Land Investment Corridors — RD INFRA**\n\nBuilt on over a decade of underwriting and market analysis since 2014, RD INFRA focuses on strategic locations with strong connectivity:\n• **NH-48 Delhi–Jaipur Highway (Dharuhera – Bawal Belt)**\n• **Delhi–Mumbai Expressway Corridor**\n• **Sohna / Western Peripheral Region**\n• **Gurgaon & Karnal**\n\nAll parcel details, documentation, and availability can be verified directly with our advisory team at **${siteSettingsTable.phone}** (${siteSettingsTable.email}).`;
    } else if (q.includes('upcoming') || q.includes('coming soon') || q.includes('launch')) {
      fallbackReply = `**Upcoming Projects at RD INFRA**\n\nWe are currently registering interest for upcoming developments in:\n1. **NH-48 Delhi–Jaipur Highway** — Upcoming Highway Farmhouse Enclave\n2. **Sohna / Western Peripheral Region** — Western Peripheral Green Estates\n3. **Delhi–Mumbai Expressway Corridor** — Expressway Growth Corridor Project\n4. **Vrindavan** — Vrindavan Serene Retreat & Plots\n\nYou can click **"Book Consultation"** below inside this chat or call **${siteSettingsTable.phone}** to register your interest early.`;
    } else {
      fallbackReply = `Welcome to **RD INFRA** (*"Building Better Tomorrows"*, Since 2014), led by Founder & Director **Mr. Ravinder Deshwal**.\n\nWe assist investors and families across:\n• **Farmhouse & Land Investment Projects:** NH-48 Delhi–Jaipur Highway, Sohna / Western Peripheral region, Delhi–Mumbai Expressway corridor & Vrindavan.\n• **Residential, Commercial & Plotted Developments:** Gurugram, Delhi-NCR, Karnal, Rohtak, Dharuhera, Rewari, Jind & Bawal.\n\nAsk me about our Director, any corridor, or project category, or connect directly at **${siteSettingsTable.phone}** / **${siteSettingsTable.email}**.`;
    }

    res.json({
      reply: fallbackReply,
      model: 'rd-infra-assistant',
    });
  });

  // Vite dev middleware or production static serving
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RD INFRA Server running on http://0.0.0.0:${PORT} (Domain: https://rd-infra.in)`);
  });
}

startServer();
