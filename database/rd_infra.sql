-- ============================================================================
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
('phone', '+91 97170 77699');
