# Project Requirements Specification
## Safety & Awareness in the LPG Sector — Website with Learning Management System (LMS)

---

## 1. Executive Summary

| Attribute | Details |
| :--- | :--- |
| **Project Name** | Safety & Awareness in the LPG Sector |
| **Platform Type** | Informational Portal, Learning Management System (LMS) & Subscription Hub |
| **Organization** | STAR IT LTD. |
| **Address** | House No-8A/10 (Doreen Tower), Suite-5B, Road No 13, Dhanmondi, Dhaka 1209 |
| **Contact** | +88 09603 44 66 89 \| info@staritltd.com \| www.staritltd.com |
| **Reference Design** | [CLIM Template Reference](https://templates.hibotheme.com/clim/default/index.html) |
| **Target Launch Period** | August 2026 |

### Primary Goals
1. **Promote LPG Safety Awareness**: Nationwide public and industrial awareness across Bangladesh for consumers, dealers, distributors, auto-gas stations, and industrial users.
2. **Subscription & Knowledge Hub**: Deliver verified circulars, incident reports, regulatory guidelines (BERC, LOAB, DoE, Civil Defense), and market news.
3. **Full LMS with Digital Certification**: Host free and paid safety training courses with modular video lessons, randomized quiz engines, and QR-verifiable digital certificates.
4. **Communication & Revenue Engine**: Support targeted bulk SMS/Email campaigns, commercial banner ad placements, and automated payment gateway integrations (SSLCommerz, bKash, Nagad).
5. **Secure Role-Based Administration**: Dynamic role management for admins and subscribers with comprehensive analytics and subscriber database handling.

---

## 2. Stakeholders & User Roles

### User Role & Permission Matrix

| Feature / Access | Guest / Public | Free Subscriber | Paid Subscriber | Professional / Dealer | Admin Team |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **View Public Pages** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Newsletter Subscribe** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Comment on Blog / News** | ❌ | ✅ *(moderated)* | ✅ *(moderated)* | ✅ *(moderated)* | ✅ |
| **Access Free Courses** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Access Paid Courses** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Take Quizzes & Earn Certificate** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Download Premium Regulatory PDFs** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Access Professional Compliance Modules** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Admin Panel Access** | ❌ | ❌ | ❌ | ❌ | ✅ |

### Dynamic Admin Roles
- **Super Admin**: Complete platform ownership, financial records, role configuration, database access, settings.
- **Content Admin**: Creates, schedules, and publishes blog posts, safety circulars, news updates, and moderates comments.
- **Course Admin**: Manages LMS categories, courses, lessons, video URLs, question banks, quiz thresholds, and certificates.
- **Advertisement Manager**: Manages commercial ad slots, schedules campaigns, uploads creatives, monitors impression and click analytics.
- **SMS / Email Campaign Manager**: Configures recipient lists, composes Unicode Bangla SMS, designs email campaigns, and tracks delivery.

---

## 3. Public Website Modules & Pages

### 1. Home Page (`/`)
- **Branded Hero Section**: LPG safety awareness tagline, hero visuals, dynamic CTA buttons for training enrollment.
- **Featured LPG News / Incidents Carousel**: Breaking incidents and official updates.
- **Latest Blog & Circulars Grid**: 3–4 recent posts with category badges and reading time.
- **Commercial Ad Banners**: Standard ad placement slots (header, mid-page, footer).
- **Impact Counter / Statistics**: Real-time counters (e.g., Trained Users, Certified Technicians, Safe Installations).
- **LMS Course Enrollment CTA**: Direct jump to featured free and premium certifications.
- **Quick Newsletter Widget**: Compact Name, Phone (+88 autofill), and Email form with OTP validation.
- **Emergency Hotlines & Regulatory PDF Downloads**: Quick access to Civil Defense, Fire Service, BERC, and police hotlines.
- **Footer**: Institutional links, disclaimers, social media channels, and copyright.

### 2. Safety Guidelines Page (`/safety-guidelines`)
- **Audience-Segmented Tabs**:
  - Regular Consumers (Domestic Cylinder Handling, Leak Checks, Kitchen Safety)
  - Dealers & Retailers (Storage Norms, Handling, Weight Verification)
  - Distributors (Transportation, Warehousing, Emergency Protocols)
  - Auto Gas Stations (Dispenser Safety, Pressure Vessels, Refueling Rules)
  - Industrial Customers (Bulk Storage Tanks, Vaporizers, Pipeline Standards)
- **Global & National Standards**: Directives from DoE (Department of Environment), Fire Service & Civil Defense, and LOAB.
- **Downloadable PDF Guides**: Public documents and locked premium guidelines for logged-in subscribers.

### 3. LPG Market Update Page (`/market-updates`)
- **Incident Reports**: Chronological feed of domestic and industrial LPG incidents with search and filter.
- **Inquiry & Investigation Reports**: Official findings linked to each reported incident.
- **Official Message Board**: Direct messages and press releases from BERC (Bangladesh Energy Regulatory Commission).
- **Stakeholder Announcements**: LOAB circulars, policy notifications, and market updates.
- **Global LPG Market Feed**: International price index, freight updates, and LPG import trends.
- **Historical Archive Link**: Dedicated navigation to archived incident history.

### 4. Blog & Articles Page (`/blogs`)
- **Categorized Grid & List View**: Seminars, training programs, association meetings, technical articles.
- **Detailed Blog View**: Rich text, embedded YouTube/S3 videos, image galleries, and author bio.
- **Subscriber Interactive Comment Section**:
  - Restricted to authenticated subscribers.
  - Configurable admin pre-moderation.
  - 1-level nested replies.
  - Anti-spam rate limiting (max 5 comments/hour per user).
- **Social Sharing**: One-click sharing to Facebook, WhatsApp, LinkedIn, X.

### 5. About Us & Consultant Pool (`/about`)
- **Organizational Overview**: Mission, vision, and legal mandate in promoting national LPG safety.
- **Dynamic Consultant Pool**:
  - Managed dynamically via Admin CMS (no hardcoding).
  - Profile card: Photograph, Full Name, Designation, Sector Expertise, Bio.
- **Partner & Stakeholder Recognition**: Logos and affiliations (BERC, LOAB, International safety councils).

### 6. Contact Us Page (`/contact`)
- **Contact Form**: Name, Email, Phone, Subject, Message with reCAPTCHA.
- **Interactive Map**: Google Maps embed for the Dhanmondi headquarters.
- **Floating WhatsApp Live Chat**: Auto-reply greetings routing directly to designated support agent.

---

## 4. Learning Management System (LMS) & Quiz Engine

### Course Hierarchy
```
Category (e.g., Consumer Safety / Dealer Compliance / Industrial)
└── Course (Title, Description, Price [Free/Paid], Thumbnail, Target Audience)
    └── Section / Module (e.g., "Module 1: Cylinder Handling Basics")
        └── Lesson (Video Lesson [S3/Vimeo], Duration, Attached PDF Notes)
            └── Course Quiz (Configurable Pass %, Random Question Pool)
                └── Digital Certificate (Auto-generated PDF with unique ID & QR code)
```

### Course Enrollment & Learning Workflow
1. **Catalog Browsing**: Filter by Category, Price (Free vs Paid), Audience Tier.
2. **Preview Mode**: First introductory lesson viewable without full enrollment.
3. **Enrollment**:
   - **Free Course**: One-click instant enrollment for authenticated users.
   - **Paid Course**: Checkout redirect -> SSLCommerz gateway -> Instant webhook activation.
4. **Learning Room (`/courses/learn/[courseId]`)**:
   - Responsive sidebar lesson playlist.
   - HTML5 video player with auto-save progress every 10 seconds.
   - Lesson marked complete when watched $\ge$ threshold percentage (e.g., 85%).
5. **Quiz Engine**:
   - Unlocks only after 100% of required lessons are completed.
   - Question Pool: Randomly pulls $N$ questions (e.g., 20 out of 100).
   - Question Types: Single Choice, Multiple Choice, True/False.
   - Anti-cheat measures: Shuffled answer options, no immediate review during attempt, optional timer.
6. **Certification**:
   - **Score $\ge$ Pass Threshold**: Server-side PDF certificate generated immediately.
   - Contains: Learner's Full Name, Course Title, Issue Date, Unique Certificate ID, and dynamic QR Code.
   - Public verification URL confirms validity against database ID.
   - **Score < Threshold**: Configurable cooldown period (e.g., 24 hours) before retake.

---

## 5. Subscription & Payment Engine

### Subscription Plans

| Plan Tier | Validity | Target User | Key Inclusions |
| :--- | :---: | :--- | :--- |
| **Free / Newsletter** | Ongoing | General Visitors | Weekly email newsletter, public articles, free safety courses |
| **Monthly Plan** | 30 Days | Active Trainees | All premium courses, certificate downloads, full incident archive |
| **Half-Yearly Plan** | 180 Days | Commercial Technicians | All monthly features + discounted pricing + priority comment review |
| **Yearly Plan** | 365 Days | Dealers & Station Staff | All premium features + maximum discount + compliance support |
| **Professional Tier** | 365 Days | Engineers & Inspectors | Professional engineering modules, raw regulatory datasets, bulk data |

### Payment Gateway Workflow (SSLCommerz)
1. User chooses Subscription or Paid Course.
2. System generates pending order invoice in database.
3. User completes payment via bKash, Nagad, Visa, Mastercard, or Internet Banking.
4. SSLCommerz IPN (Instant Payment Notification) validates signature.
5. System upgrades user role, logs financial transaction, and auto-generates downloadable PDF receipt.
6. Expiry reminders triggered 7 days prior to plan expiration via automated Email & SMS.

---

## 6. Communications (Bulk SMS & Email Campaigns)

### 1. Bulk SMS Dashboard
- **Gateway Integration**: Configurable local SMS Gateway (Banglalink / Grameenphone / Teletalk / Aggregator).
- **Target Segmentation**: All users, Paid subscribers, Dealers only, Custom CSV phone upload.
- **Language Support**: English and Unicode Bangla (160 characters English / 70 characters Unicode limit counter).
- **Scheduling**: Immediate dispatch or date/time scheduled queues.

### 2. Bulk Email System
- **Provider**: Resend API or SMTP relay with dedicated transactional queues.
- **Visual Template Builder**: Subject line, pre-header, rich HTML email layout.
- **Compliance & Unsubscribe**: Automatic CAN-SPAM compliant 1-click unsubscribe links injected in footer.
- **Analytics**: Real-time Open Rate, Click-Through Rate (CTR), and bounce rate tracking.

---

## 7. Commercial Advertisement Management

| Slot Identifier | Page Location | Allowed Creatives | Purpose |
| :--- | :--- | :--- | :--- |
| **Header Banner** | Top of all pages (sticky or static) | Image / HTML5 / GIF | High-visibility brand sponsorships |
| **Sidebar Slot** | Right sidebar of Blog and News | 300x250 or 300x600 Image | Industry equipment ads, accessories |
| **Mid-Content Banner** | After 3rd paragraph of blog/news | Responsive banner | High CTR contextual sponsorships |
| **Footer Banner** | Global footer banner | Image / Text link | Corporate partner branding |
| **Sponsored Posts** | Integrated in blog & news feed | Featured article badge | Sponsored case studies & product launches |
| **Popup Modal** | Homepage or sitewide load | Modal with close button | Urgent safety alerts or special promos |

- **Ad Engine Capabilities**:
  - Campaign date scheduling (auto-activates and auto-expires).
  - Impression counter & unique click tracking.
  - Analytics exportable to Excel/CSV for advertisers.

---

## 8. Incident & Regulatory Archive Module

- **Categorization**: Incident Reports \| Official Meeting Records \| Stakeholder Notices \| Technical Circulars.
- **Entry Metadata**: Title, Incident Date, Geographic Location (District/Thana), Summary, Official Cause, Attached Inquiry PDF, Impact Category.
- **Search & Filter**: Keyword search, date range picker, category filter, district-based sorting.
- **Batch Import**: Admin ability to upload bulk historical records via Excel/CSV.

---

## 9. Admin Panel Architecture

```
Admin Control Center
├── 1. Overview Dashboard (Revenue metrics, Active enrollments, Pending approvals)
├── 2. User & Role Management (Subscriber list, Role editor, Ban/Suspend, Password reset)
├── 3. Content Management System (Blog, News, Guidelines, Consultant directory)
├── 4. LMS Course Manager (Course builder, Video lesson URLs, Quiz banks, Cert templates)
├── 5. Subscription & Order Logs (Plans, Expirations, Invoice downloads, Refund ledger)
├── 6. Advertisement Manager (Ad slots, Creative upload, Schedule, Click stats)
├── 7. Bulk SMS & Email Center (Composer, Recipient filter, Scheduled queues, Analytics)
├── 8. Archive & Incident Manager (Historical records, PDF attachments, Bulk import)
├── 9. Certificate Registry (Issued certificate records, Verification audit, Revoke toggle)
├── 10. Database Manager (Optimized indexing for 1Cr+ consumer records, 60k+ dealer records)
└── 11. Platform Settings (SEO defaults, Gateway API credentials, Maintenance mode)
```

---

## 10. Security & Compliance Standards

1. **Transport & Data Security**: Full site TLS/SSL encryption, HTTPS enforcement.
2. **Authentication Security**: Encrypted passwords (bcrypt/argon2), JWT session tokens with auto-expiration on 401.
3. **Comment Moderation & Anti-Spam**: Rate limits, mandatory email/phone verification before commenting.
4. **Data Protection & Privacy**: Explicit Terms & Conditions and Data Security consent at subscription.
5. **Database Redundancy**: Automated scheduled database backups.
