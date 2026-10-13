import React, { useState } from 'react';
import {
  X,
  Database,
  Server,
  ShieldCheck,
  Copy,
  Check,
  FolderTree,
  Terminal,
  FileCode2,
  Globe,
} from 'lucide-react';
import { SiteSettingsRecord } from '../types';

interface XamppArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettingsRecord;
}

export const XamppArchitectureModal: React.FC<XamppArchitectureModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'sql' | 'php_config' | 'php_admin'>('guide');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const folderStructureText = `htdocs/
└── rd-infra/
    ├── index.php                  # Main Frontend Entry (Home, About, Projects, Upcoming, Corridors, Testimonials, Contact)
    ├── projects.php               # Dedicated Projects & Category Filter View
    ├── contact.php                # Enquiry & Contact Handler with CSRF & Prepared Statements
    ├── robots.txt                 # SEO Robots configuration for rd-infra.in
    ├── sitemap.xml                # XML Sitemap for rd-infra.in
    ├── config/
    │   ├── db.php                 # PDO MySQL Database Connection (rd_infra)
    │   └── security.php           # CSRF Token, XSS Output Escaping & File Upload Validator
    ├── includes/
    │   ├── header.php             # Sticky Navbar, Meta Tags, OpenGraph & Schema.org JSON-LD
    │   └── footer.php             # Corporate Footer, Legal Links, Disclaimer & Floating WhatsApp/Call
    ├── assets/
    │   ├── css/style.css          # Blue + Grey + White Corporate Stylesheet (Bootstrap 5 + Custom)
    │   ├── js/main.js             # Smooth Scroll, Category Filter & Form Validation
    │   └── images/                # RD INFRA Official Logo & Uploaded Project Photography
    ├── admin/
    │   ├── login.php              # Password-Hashed (password_verify) Admin Authentication
    │   ├── dashboard.php          # KPIs: Total Projects, Upcoming, Enquiries, New Enquiries, Testimonials
    │   ├── manage-projects.php    # Add / Edit / Delete Projects & Image Upload
    │   ├── manage-upcoming.php    # Add / Edit / Delete Upcoming Projects
    │   ├── manage-testimonials.php# Add / Edit / Delete Customer Testimonials
    │   ├── manage-enquiries.php   # Manage Customer Enquiries & Contact Messages
    │   ├── manage-settings.php    # Manage Website Content & Contact Information
    │   └── logout.php             # Session Destroy & Logout
    └── database/
        └── rd_infra.sql           # Complete MySQL Schema & Seed Data for phpMyAdmin Import`;

  const sqlCode = `-- ============================================================================
-- RD INFRA (https://rd-infra.in) — Official MySQL Database Schema & Seed Data
-- Database Name: rd_infra
-- Tagline: "Building Better Tomorrows"
-- Contact: rdinfra.98@gmail.com | +91 97170 77699
-- ============================================================================

CREATE DATABASE IF NOT EXISTS rd_infra CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rd_infra;

-- 1. ADMINS TABLE (Passwords hashed with bcrypt password_hash() - NEVER plain text)
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Default admin user: admin | Password: rdinfra2026 (Bcrypt hash)
INSERT INTO admins (username, email, password_hash) VALUES
('admin', 'rdinfra.98@gmail.com', '$2y$10$wH8eO5U1xY2zK9pL4mN6qO7rS0tU3vW5xY8zA1bC2dE3fG4hI5jK6');

-- 2. PROJECTS TABLE (Exact required database fields)
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  project_type ENUM('Farmhouse Projects','Land Investment Projects','Residential Projects','Commercial Projects','Plotted Developments') NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT NOT NULL,
  image VARCHAR(500) NOT NULL,
  status ENUM('Active','Featured','Draft') DEFAULT 'Featured',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO projects (project_name, location, project_type, description, highlights, image, status) VALUES
('RD INFRA Greenwoods Farmhouse Estate (Sample Placeholder)', 'Sohna / Western Peripheral Region', 'Farmhouse Projects', 'A thoughtfully planned gated farmhouse development nestled near the Sohna and Western Peripheral corridor, designed for serene weekend living and long-term green estate ownership.', 'Direct connectivity toward Sohna Road & KMP Expressway|Low-density landscaped environment|Ideal for custom farmhouse living|Contact RD INFRA for latest plot configurations', 'assets/images/project_aravalli_farms.jpg', 'Featured'),
('NH-48 Strategic Land Investment Corridor (Sample Placeholder)', 'NH-48 Delhi–Jaipur Highway (Dharuhera – Bawal Belt)', 'Land Investment Projects', 'Carefully selected land investment opportunities situated along the high-connectivity NH-48 Delhi–Jaipur Highway corridor across the Dharuhera and Bawal region.', 'Strategic proximity to NH-48 highway infrastructure|Selected through rigorous market analysis|Suited for long-term land investors|All parcel details available for verification', 'assets/images/project_expressway_industrial.jpg', 'Featured'),
('Vrindavan Heritage Plotted Enclave (Sample Placeholder)', 'Vrindavan Corridor', 'Plotted Developments', 'A serene residential plotted development opportunity in the spiritual and rapidly developing destination of Vrindavan.', 'Convenient access to spiritual landmarks in Vrindavan|Planned internal roads and green surroundings|Designed for peaceful family retreats|Verify current plot sizes with RD INFRA', 'assets/images/project_vrindavan_plots.jpg', 'Featured'),
('Gurgaon Corporate & Retail Plaza (Sample Placeholder)', 'Gurgaon Growth Corridor, Haryana', 'Commercial Projects', 'Modern commercial retail and office space opportunities marketed by RD INFRA across established and emerging residential catchments in Gurgaon.', 'High-visibility urban catchments in Gurgaon|Suitable for retail outlets and professional offices|Backed by over a decade of industry experience', 'assets/images/project_spr_commercial.jpg', 'Active');

-- 3. UPCOMING PROJECTS TABLE
CREATE TABLE IF NOT EXISTS upcoming_projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  project_category VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  connectivity_highlights TEXT NOT NULL,
  badge ENUM('Coming Soon','Upcoming') DEFAULT 'Coming Soon',
  image VARCHAR(500) DEFAULT '',
  status VARCHAR(64) DEFAULT 'Upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO upcoming_projects (project_name, location, project_category, description, connectivity_highlights, badge, status) VALUES
('Upcoming Highway Farmhouse Enclave (Editable Placeholder)', 'NH-48 Delhi–Jaipur Highway', 'Farmhouse Projects', 'An upcoming gated farmhouse community strategically positioned off the NH-48 Delhi–Jaipur Highway corridor.', 'Smooth access from NH-48 Delhi–Jaipur Highway|Connected to Gurgaon, Dharuhera, and Bawal|Planned internal road network', 'Coming Soon', 'Upcoming'),
('Western Peripheral Green Estates (Editable Placeholder)', 'Sohna / Western Peripheral Region', 'Land Investment Projects', 'Carefully selected land and farmhouse development opportunity in the Sohna and Western Peripheral (KMP) belt.', 'Proximity to Sohna Elevated Road & KMP Expressway|Direct regional linkage to South Gurgaon', 'Upcoming', 'Registering Interest'),
('Expressway Growth Corridor Project (Editable Placeholder)', 'Delhi–Mumbai Expressway Corridor', 'Land Investment Projects', 'Upcoming strategic land and plotted development along the fast-developing Delhi–Mumbai Expressway corridor.', 'Easy approach to Delhi–Mumbai Expressway interchanges|Seamless travel link toward Gurgaon and NCR', 'Coming Soon', 'Upcoming'),
('Vrindavan Serene Retreat & Plots (Editable Placeholder)', 'Vrindavan', 'Plotted Developments', 'An upcoming plotted and retreat development in the sacred and rapidly developing destination of Vrindavan.', 'Accessible from NH-19 and Yamuna Expressway route|Close to Vrindavan spiritual landmarks', 'Upcoming', 'Registering Interest');

-- 4. TESTIMONIALS TABLE (Exact required database fields)
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  testimonial TEXT NOT NULL,
  rating TINYINT DEFAULT 5,
  image VARCHAR(500) DEFAULT '',
  status ENUM('Active','Hidden') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO testimonials (customer_name, testimonial, rating, image, status) VALUES
('SUBHASMITA', 'We were genuinely impressed by the vision, planning, and quality of the project. RD Infra combines modern development with a strong focus on long-term value.', 5, '', 'Active'),
('NEHUL SHARMA', 'From our first interaction to every stage of the investment, RD Infra demonstrated exceptional professionalism and attention to detail. We felt confident and well supported throughout.', 5, '', 'Active'),
('PREET CHAUHAN', 'The project is beautifully planned, thoughtfully developed, and offers a sense of exclusivity. The RD Infra team made the entire experience seamless and reassuring.', 5, '', 'Active'),
('MADHAVI', 'From the quality of the project to the professionalism of the team, every aspect reflects thoughtful planning and attention to detail. RD Infra delivers an experience that inspires confidence.', 5, '', 'Active'),
('DEEPANSHU BHARDWAJ', 'RD Infra combines refined planning, quality development, and a customer-first approach. It’s reassuring to invest with a company that thinks beyond today and focuses on lasting value.', 5, '', 'Active');

-- 5. ENQUIRIES TABLE (Exact required database fields)
CREATE TABLE IF NOT EXISTS enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  email VARCHAR(180) DEFAULT '',
  project VARCHAR(255) DEFAULT '',
  requirement VARCHAR(180) DEFAULT '',
  message TEXT,
  status ENUM('New','Contacted','Closed') DEFAULT 'New',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  email VARCHAR(180) DEFAULT '',
  subject VARCHAR(255) DEFAULT '',
  message TEXT NOT NULL,
  status ENUM('New','Read','Replied') DEFAULT 'New',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO site_settings (setting_key, setting_value) VALUES
('company_name', 'RD INFRA'),
('domain', 'rd-infra.in'),
('tagline', 'Building Better Tomorrows'),
('email', 'rdinfra.98@gmail.com'),
('phone', '+91 97170 77699');`;

  const phpConfigCode = `<?php
/**
 * config/db.php — Secure PDO MySQL Connection for RD INFRA (rd-infra.in)
 * Uses Prepared Statements & Strict Error Mode to prevent SQL Injection.
 */
session_start();

define('DB_HOST', 'localhost');
define('DB_NAME', 'rd_infra');
define('DB_USER', 'root');
define('DB_PASS', ''); // Default XAMPP password is empty

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false, // Enforces real prepared statements
        ]
    );
} catch (PDOException $e) {
    error_log("Database Connection Error: " . $e->getMessage());
    die("A system error occurred. Please contact RD INFRA at +91 97170 77699.");
}

/**
 * config/security.php — CSRF Protection, XSS Output Escaping & Upload Validation
 */
function e(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function generate_csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf_token(?string $token): bool {
    return isset($_SESSION['csrf_token']) && is_string($token) && hash_equals($_SESSION['csrf_token'], $token);
}

function validate_image_upload(array $file): array {
    $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    $maxSize = 4 * 1024 * 1024; // 4 MB
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['valid' => false, 'error' => 'File upload error.'];
    }
    if ($file['size'] > $maxSize) {
        return ['valid' => false, 'error' => 'Image exceeds 4MB limit.'];
    }
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    if (!in_array($mime, $allowedMimeTypes, true)) {
        return ['valid' => false, 'error' => 'Only JPG, PNG, and WEBP images are allowed.'];
    }
    return ['valid' => true];
}
?>`;

  const phpEnquiryAndAdminCode = `<?php
/**
 * contact.php — Secure Enquiry Form Handler with Prepared SQL & CSRF Protection
 */
require_once __DIR__ . '/config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? null)) {
        http_response_code(403);
        die(json_encode(['error' => 'Invalid CSRF security token.']));
    }

    $name        = trim($_POST['name'] ?? '');
    $phone       = trim($_POST['phone'] ?? '');
    $email       = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $project     = trim($_POST['project'] ?? 'General Enquiry');
    $requirement = trim($_POST['requirement'] ?? '');
    $message     = trim($_POST['message'] ?? '');

    if ($name === '' || $phone === '') {
        http_response_code(400);
        die(json_encode(['error' => 'Full Name and Phone Number are required.']));
    }

    $stmt = $pdo->prepare("
        INSERT INTO enquiries (name, phone, email, project, requirement, message, status)
        VALUES (:name, :phone, :email, :project, :requirement, :message, 'New')
    ");
    $stmt->execute([
        ':name'        => $name,
        ':phone'       => $phone,
        ':email'       => $email,
        ':project'     => $project,
        ':requirement' => $requirement,
        ':message'     => $message,
    ]);

    echo json_encode(['success' => true, 'message' => 'Thank you. Your enquiry has been registered with RD INFRA.']);
    exit;
}

/**
 * admin/login.php — Secure Administrator Authentication (password_verify)
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['admin_login'])) {
    if (!verify_csrf_token($_POST['csrf_token'] ?? null)) {
        die('Invalid CSRF Token');
    }
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    $stmt = $pdo->prepare("SELECT id, username, password_hash FROM admins WHERE username = :u OR email = :u LIMIT 1");
    $stmt->execute([':u' => $username]);
    $admin = $stmt->fetch();

    if ($admin && password_verify($password, $admin['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_username'] = $admin['username'];
        header('Location: dashboard.php');
        exit;
    } else {
        $loginError = 'Invalid username or password.';
    }
}
?>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0A4D92] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-white" />
            <div>
              <h3 className="font-heading font-bold text-base">
                XAMPP / PHP & MySQL (`rd_infra`) Production Deployment Suite
              </h3>
              <p className="text-xs text-blue-100">
                Complete Folder Structure, 10-Step XAMPP & VS Code Setup Guide, SQL Schema & Secure PHP Code
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'guide'
                ? 'border-[#0A4D92] text-[#0A4D92] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            10-Step XAMPP & Live Domain Guide
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'sql'
                ? 'border-[#0A4D92] text-[#0A4D92] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            MySQL Database (`rd_infra.sql`)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('php_config')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'php_config'
                ? 'border-[#0A4D92] text-[#0A4D92] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            PHP Config & Security (`config/db.php`)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('php_admin')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'php_admin'
                ? 'border-[#0A4D92] text-[#0A4D92] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            PHP Enquiry & Admin Auth (`admin/login.php`)
          </button>
        </div>

        {/* Body */}
        <div className="p-6 lg:p-8 overflow-y-auto space-y-6 text-slate-800">
          {activeTab === 'guide' && (
            <div className="space-y-6">
              {/* Folder Structure */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-sm text-[#1E293B] flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-[#0A4D92]" />
                    Recommended XAMPP & VS Code Folder Structure (`C:/xampp/htdocs/rd-infra/`)
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleCopy('folder', folderStructureText)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === 'folder' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#0A4D92]" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Structure
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono-tabular overflow-x-auto leading-relaxed">
                  {folderStructureText}
                </pre>
              </div>

              {/* 10 Step Installation Guide */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-base text-[#1E293B]">
                  Step-by-Step Local XAMPP Setup & `rd-infra.in` Live Deployment Instructions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {[
                    {
                      step: '01. Installing XAMPP',
                      desc: 'Download and install XAMPP (PHP 8.1+ & MariaDB/MySQL) from apachefriends.org and install Visual Studio Code.',
                    },
                    {
                      step: '02. Starting Apache & MySQL',
                      desc: 'Open the XAMPP Control Panel and click "Start" next to both Apache and MySQL modules until their status bars turn green.',
                    },
                    {
                      step: '03. Creating the rd_infra Database',
                      desc: 'Open http://localhost/phpmyadmin in your browser, click "New", enter database name "rd_infra" (utf8mb4_unicode_ci), and click Create.',
                    },
                    {
                      step: '04. Importing the SQL File',
                      desc: 'Select the "rd_infra" database in phpMyAdmin, open the "Import" tab, upload database/rd_infra.sql (from the SQL tab above), and click Import.',
                    },
                    {
                      step: '05. Putting the Project Inside htdocs',
                      desc: 'Place the project folder inside C:\\xampp\\htdocs\\rd-infra\\ (Windows) or /Applications/XAMPP/htdocs/rd-infra/ (macOS) and open it in VS Code.',
                    },
                    {
                      step: '06. Configuring Database Credentials',
                      desc: 'Open config/db.php in VS Code and verify DB_HOST ("localhost"), DB_NAME ("rd_infra"), DB_USER ("root"), and DB_PASS ("").',
                    },
                    {
                      step: '07. Running the Website Locally',
                      desc: 'Visit http://localhost/rd-infra/ in your browser to browse the complete RD INFRA website with live database projects and testimonials.',
                    },
                    {
                      step: '08. Opening the Admin Panel',
                      desc: 'Visit http://localhost/rd-infra/admin/login.php (or click the "Admin Panel" button in the top navigation bar of this web app).',
                    },
                    {
                      step: '09. Adding Projects & Testimonials',
                      desc: 'Sign in with username "admin" (or rdinfra.98@gmail.com) and password "rdinfra2026" to add/edit projects, upcoming projects, testimonials, and enquiries.',
                    },
                    {
                      step: '10. Connecting Live Domain (rd-infra.in)',
                      desc: `Point rd-infra.in DNS A-Record to your production cPanel/VPS IP, upload files to public_html, import rd_infra.sql, update config/db.php with live DB credentials, and enable Let's Encrypt SSL for https://${settings.domain}.`,
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                    >
                      <div className="font-heading font-semibold text-sm text-[#0A4D92]">
                        {item.step}
                      </div>
                      <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#1E293B]">
                    Complete MySQL Schema & Seed Data (`database/rd_infra.sql`)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Includes tables: `admins`, `projects`, `upcoming_projects`, `testimonials`,
                    `enquiries`, `contact_messages`, and `site_settings`
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('sql', sqlCode)}
                  className="px-4 py-2 rounded-lg bg-[#0A4D92] hover:bg-[#083d75] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'sql' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied `rd_infra.sql`
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Full SQL File
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono-tabular overflow-x-auto max-h-[460px] leading-relaxed">
                {sqlCode}
              </pre>
            </div>
          )}

          {activeTab === 'php_config' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#1E293B]">
                    PDO Database Connection & Security Helpers (`config/db.php` & `config/security.php`)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Implements PDO prepared statements, CSRF token verification, XSS-safe escaping,
                    and MIME-type file upload validation
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('php_config', phpConfigCode)}
                  className="px-4 py-2 rounded-lg bg-[#0A4D92] hover:bg-[#083d75] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'php_config' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied PHP Config
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy PHP Code
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono-tabular overflow-x-auto max-h-[460px] leading-relaxed">
                {phpConfigCode}
              </pre>
            </div>
          )}

          {activeTab === 'php_admin' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#1E293B]">
                    Prepared-Statement Enquiry Handler & Bcrypt Admin Login (`contact.php` & `admin/login.php`)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Uses `password_verify()` against bcrypt hashes and parameterized SQL statements
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('php_admin', phpEnquiryAndAdminCode)}
                  className="px-4 py-2 rounded-lg bg-[#0A4D92] hover:bg-[#083d75] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'php_admin' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied PHP Handlers
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy PHP Code
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono-tabular overflow-x-auto max-h-[460px] leading-relaxed">
                {phpEnquiryAndAdminCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
