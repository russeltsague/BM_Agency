# =============================================
# BM AGENCY - CLIENT CONFIGURATION FILE
# =============================================
# This file contains all the information needed to personalize
# the BM Agency application for your specific business/enterprise.
#
# INSTRUCTIONS:
# 1. Fill in all the sections below with your specific information
# 2. Replace placeholder values with your actual data
# 3. Ensure all URLs, phone numbers, and email addresses are correct
# 4. Provide high-quality images for logos and branding
# 5. Update the content to reflect your business messaging
#
# SUPPORTED FILE FORMATS:
# - Images: PNG, JPG, JPEG, SVG, WebP
# - Documents: PDF, DOC, DOCX
# - Maximum file size: 5MB per file
#
# =============================================

# =============================================================================
# 1. BASIC COMPANY INFORMATION
# =============================================================================

COMPANY_NAME: "Votre Entreprise"
COMPANY_TAGLINE: "Votre slogan accrocheur ici"
COMPANY_DESCRIPTION: "Description complète de votre entreprise et de vos services. Décrivez ce qui vous rend unique et les problèmes que vous résolvez pour vos clients."

# Legal Information
BUSINESS_TYPE: "SARL"  # SARL, SA, Entreprise Individuelle, etc.
SIRET_NUMBER: "123 456 789 00012"  # Numéro SIRET/SIREN
TAX_ID: "FR123456789"  # Numéro de TVA intracommunautaire

# Location & Address
COUNTRY: "Cameroun"
CITY: "Douala/Yaoundé"
ADDRESS: "123 Avenue des Affaires, Quartier Business"
POSTAL_CODE: "BP 12345"

# =============================================================================
# 2. CONTACT INFORMATION
# =============================================================================

# Primary Contact
PHONE_PRIMARY: "+237 6XX XXX XXX"
PHONE_SECONDARY: "+237 2XX XXX XXX"  # Optional

# Email Addresses
EMAIL_PRIMARY: "contact@votreentreprise.com"
EMAIL_SUPPORT: "support@votreentreprise.com"
EMAIL_SALES: "commercial@votreentreprise.com"

# WhatsApp Business (for customer support)
WHATSAPP_NUMBER: "+237 6XX XXX XXX"
WHATSAPP_MESSAGE: "Bonjour! Comment pouvons-nous vous aider aujourd'hui?"

# Social Media Links
WEBSITE_URL: "https://www.votreentreprise.com"
FACEBOOK_URL: "https://facebook.com/votreentreprise"
INSTAGRAM_URL: "https://instagram.com/votreentreprise"
LINKEDIN_URL: "https://linkedin.com/company/votreentreprise"
TWITTER_URL: "https://twitter.com/votreentreprise"
YOUTUBE_URL: "https://youtube.com/@votreentreprise"

# Google Business Profile
GOOGLE_MAPS_URL: "https://maps.google.com/?q=Votre+Entreprise+Douala"
GOOGLE_BUSINESS_URL: "https://business.google.com/locations"

# =============================================================================
# 3. BRANDING & VISUAL IDENTITY
# =============================================================================

# Brand Colors (Hex codes without #)
PRIMARY_COLOR: "1e40af"      # Main brand color (blue-600)
SECONDARY_COLOR: "06b6d4"    # Secondary color (cyan-500)
ACCENT_COLOR: "f59e0b"       # Accent color (amber-500)

# Color Scheme Preferences
DARK_MODE_ENABLED: true      # Enable dark mode toggle
THEME_PREFERENCE: "auto"     # light, dark, or auto

# Typography
FONT_PRIMARY: "Inter"        # Primary font family
FONT_SECONDARY: "Poppins"    # Secondary font family

# Logo Files (provide these files)
LOGO_MAIN: "logo-main.png"           # Main logo (square/rectangle)
LOGO_WHITE: "logo-white.png"         # White version for dark backgrounds
LOGO_ICON: "logo-icon.png"           # Small icon version (favicon)
LOGO_DARK: "logo-dark.png"           # Dark version for light backgrounds

# Brand Assets
HERO_BACKGROUND_IMAGE: "hero-bg.jpg" # Main hero section background
FAVICON: "favicon.ico"               # Browser tab icon

# =============================================================================
# 4. HERO SECTION CONTENT
# =============================================================================

HERO_TITLE_LINE_1: "Communication"
HERO_TITLE_LINE_2: "Digitale 360°"

HERO_SUBTITLE: "Nous créons des expériences digitales exceptionnelles qui transforment votre présence en ligne et boostent votre croissance."

HERO_CTA_BUTTON_TEXT: "Découvrir nos services"
HERO_CTA_BUTTON_LINK: "#services"

# Hero Statistics/Badges
HERO_STATS:
  - label: "Projets Réalisés"
    value: "150+"
  - label: "Clients Satisfaits"
    value: "95%"
  - label: "Années d'Expérience"
    value: "8+"

# =============================================================================
# 5. SERVICES CONFIGURATION
# =============================================================================

SERVICES:
  - name: "Communication Digitale"
    description: "Stratégie digitale complète, gestion des réseaux sociaux, création de contenu engageant"
    icon: "smartphone"  # Icon name from Lucide React
    features:
      - "Community Management"
      - "Publicité digitale"
      - "Relations presse"
      - "Création de contenu"
    pricing: "À partir de 250 000 FCFA/mois"
    duration: "6-12 mois"
    case_study: "E-commerce +300% trafic social"

  - name: "Développement Web"
    description: "Sites web modernes, applications web performantes, boutiques e-commerce"
    icon: "code"
    features:
      - "Sites vitrines"
      - "E-commerce"
      - "Applications web"
      - "Maintenance"
    pricing: "À partir de 500 000 FCFA"
    duration: "2-8 semaines"
    case_study: "Plateforme e-commerce +150% conversion"

  - name: "Marketing Digital"
    description: "SEO, publicité en ligne, email marketing, analytics et reporting"
    icon: "trending-up"
    features:
      - "Référencement SEO"
      - "Publicité Google Ads"
      - "Email marketing"
      - "Analytics"
    pricing: "À partir de 300 000 FCFA/mois"
    duration: "3-6 mois"
    case_study: "Campagne Google Ads +200% ROI"

  - name: "Objets Publicitaires"
    description: "Goodies personnalisés, cadeaux d'entreprise, matériel promotionnel"
    icon: "gift"
    features:
      - "Stylos personnalisés"
      - "T-shirts et polos"
      - "Cadeaux d'entreprise"
      - "Matériel événementiel"
    pricing: "À partir de 5 000 FCFA/pièce"
    duration: "1-3 semaines"
    case_study: "Événement corporate 500+ participants"

# =============================================================================
# 6. PORTFOLIO/REALISATIONS
# =============================================================================

PORTFOLIO_PROJECTS:
  - title: "Plateforme E-commerce Mode Africaine"
    description: "Refonte complète d'une plateforme e-commerce spécialisée dans la mode africaine avec optimisation UX/UI et intégration de solutions de paiement locales."
    client: "Maison de la Mode Africaine"
    category: "E-commerce"
    tags: ["React", "Node.js", "MTN MoMo", "SEO"]
    link: "https://maison-mode-africaine.cm"
    featured: true
    image: "portfolio-1.jpg"

  - title: "Application Mobile Bancaire"
    description: "Développement d'une application mobile bancaire avec authentification biométrique et gestion des comptes en temps réel pour les clients camerounais."
    client: "Banque Atlantique Cameroun"
    category: "Application Mobile"
    tags: ["React Native", "Node.js", "MongoDB", "Biometric"]
    featured: true
    image: "portfolio-2.jpg"

  - title: "Site Web Corporate International"
    description: "Création d'un site web institutionnel pour une entreprise internationale avec support multilingue et intégration CRM."
    client: "Groupe International Corp"
    category: "Site Web"
    tags: ["Next.js", "TypeScript", "i18n", "CRM"]
    link: "https://groupe-international.com"
    featured: false
    image: "portfolio-3.jpg"

# =============================================================================
# 7. BLOG ARTICLES
# =============================================================================

BLOG_ARTICLES:
  - title: "Les tendances du marketing digital au Cameroun en 2024"
    excerpt: "Découvrez les stratégies digitales qui fonctionnent le mieux dans le contexte camerounais et comment les adapter à votre entreprise."
    content: "Contenu détaillé de l'article..."
    author: "Marie Dubois"
    category: "Marketing Digital"
    tags: ["Tendances", "Marketing", "Cameroun", "2024"]
    featured: true
    published: true
    read_time: "8 min"
    image: "blog-1.jpg"

  - title: "Le SEO pour les entreprises camerounaises : Guide complet"
    excerpt: "Le SEO (Search Engine Optimization) reste un pilier fondamental du marketing digital camerounais..."
    content: "Contenu détaillé de l'article..."
    author: "Thomas Martin"
    category: "SEO"
    tags: ["SEO", "Référencement", "Google", "Cameroun"]
    featured: false
    published: true
    read_time: "12 min"
    image: "blog-2.jpg"

# =============================================================================
# 8. TESTIMONIALS
# =============================================================================

TESTIMONIALS:
  - name: "Jean-Paul Nguema"
    content: "BM Agency a complètement transformé notre présence digitale. Leur expertise et leur professionnalisme sont exceptionnels."
    role: "Directeur Marketing"
    company: "Cameroun Télécom"
    rating: 5
    image: "testimonial-1.jpg"

  - name: "Fatima Mbarga"
    content: "L'équipe de BM Agency comprend parfaitement les spécificités du marché camerounais. Résultats au-delà de nos attentes."
    role: "CEO"
    company: "Fashion Africa Group"
    rating: 5
    image: "testimonial-2.jpg"

# =============================================================================
# 9. TECHNICAL CONFIGURATION
# =============================================================================

# Database Configuration
DATABASE_NAME: "bm_agency_enterprise"  # Unique database name for your client
DATABASE_HOST: "localhost"              # Database server
DATABASE_PORT: 27017                   # MongoDB port

# API Configuration
API_BASE_URL: "http://localhost:5000/api/v1"
CORS_ORIGINS: ["http://localhost:3000", "https://votreentreprise.com"]

# Authentication
JWT_SECRET_KEY: "votre_clé_jwt_unique_et_sécurisée"
ADMIN_EMAIL: "admin@votreentreprise.com"
ADMIN_PASSWORD: "mot_de_passe_admin_sécurisé"

# File Upload Configuration
MAX_FILE_SIZE: "5MB"           # Maximum file size for uploads
ALLOWED_IMAGE_TYPES: ["png", "jpg", "jpeg", "webp", "svg"]
ALLOWED_DOCUMENT_TYPES: ["pdf", "doc", "docx"]

# Email Configuration (for notifications)
SMTP_HOST: "smtp.gmail.com"
SMTP_PORT: 587
SMTP_USER: "notifications@votreentreprise.com"
SMTP_PASS: "mot_de_passe_app_smtp"

# =============================================================================
# 10. SEO & METADATA
# =============================================================================

# Global SEO
SEO_TITLE: "Votre Entreprise - Communication Digitale 360°"
SEO_DESCRIPTION: "Votre partenaire de confiance pour la communication digitale, le marketing, les objets publicitaires et la création de contenu au Cameroun."
SEO_KEYWORDS: ["communication digitale", "marketing digital", "Cameroun", "agence digitale", "réseaux sociaux", "site web"]

# Open Graph / Social Media
OG_TITLE: "Votre Entreprise - Experts en Communication Digitale"
OG_DESCRIPTION: "Transformez votre présence digitale avec nos solutions innovantes"
OG_IMAGE: "og-image.jpg"
OG_URL: "https://www.votreentreprise.com"

# Google Analytics & Tracking
GOOGLE_ANALYTICS_ID: "GA-XXXXXXXXX"  # Your GA4 Measurement ID
GOOGLE_TAG_MANAGER_ID: "GTM-XXXXXXX" # Your GTM Container ID

# =============================================================================
# 11. FEATURE TOGGLES & SETTINGS
# =============================================================================

# Enable/Disable Features
FEATURE_BLOG: true              # Enable blog functionality
FEATURE_PORTFOLIO: true         # Enable portfolio showcase
FEATURE_SERVICES: true          # Enable services section
FEATURE_TESTIMONIALS: true      # Enable customer testimonials
FEATURE_PRODUCTS: false         # Enable e-commerce products (future)
FEATURE_ANALYTICS: true         # Enable analytics dashboard

# Admin Panel Settings
ADMIN_ITEMS_PER_PAGE: 10        # Number of items per page in admin
ADMIN_SESSION_TIMEOUT: 60       # Minutes before admin logout
ADMIN_PASSWORD_MIN_LENGTH: 8    # Minimum password length

# Performance & Caching
CACHE_ENABLED: true             # Enable caching for better performance
CDN_ENABLED: false              # Enable CDN (future feature)

# =============================================================================
# 12. INTEGRATIONS & THIRD-PARTY SERVICES
# =============================================================================

# Payment Gateways
PAYMENT_STRIPE_ENABLED: false   # Enable Stripe payments
PAYMENT_PAYPAL_ENABLED: false   # Enable PayPal payments
PAYMENT_MTNMOMO_ENABLED: true   # Enable MTN MoMo (Cameroon)

# Payment Configuration
MTN_MOMO_API_KEY: "votre_clé_api_mtn_momo"
MTN_MOMO_MERCHANT_ID: "votre_merchant_id"

# Analytics & Tracking
FACEBOOK_PIXEL_ID: "XXXXXXXXXXXXXXX"  # Facebook Pixel ID

# Chat & Communication
WHATSAPP_BUSINESS_API: false    # Enable WhatsApp Business API
TELEGRAM_BOT_TOKEN: ""          # Telegram bot for notifications

# =============================================================================
# 13. LOCALIZATION & LANGUAGES
# =============================================================================

# Supported Languages
LANGUAGES:
  - code: "fr"                  # French (primary)
    name: "Français"
    enabled: true
  - code: "en"                  # English
    name: "English"
    enabled: false

# Default Language
DEFAULT_LANGUAGE: "fr"

# Currency & Localization
CURRENCY: "XAF"                 # FCFA (Franc CFA)
LOCALE: "fr-CM"                 # French Cameroon locale
TIMEZONE: "Africa/Douala"       # Cameroon timezone

# =============================================================================
# 14. BACKUP & SECURITY
# =============================================================================

# Backup Configuration
BACKUP_ENABLED: true            # Enable automatic backups
BACKUP_FREQUENCY: "daily"       # daily, weekly, monthly
BACKUP_RETENTION_DAYS: 30       # Days to keep backups

# Security Settings
SSL_ENABLED: true               # Enable SSL/HTTPS
FIREWALL_ENABLED: true          # Enable firewall protection
RATE_LIMITING: true             # Enable API rate limiting

# =============================================================================
# 15. DEPLOYMENT & HOSTING
# =============================================================================

# Deployment Configuration
DEPLOYMENT_PLATFORM: "vercel"   # vercel, netlify, heroku, custom
DEPLOYMENT_REGION: "fr-par-1"   # France (Paris) for EU compliance

# Domain Configuration
PRODUCTION_DOMAIN: "www.votreentreprise.com"
STAGING_DOMAIN: "staging.votreentreprise.com"

# SSL Certificate
SSL_PROVIDER: "letsencrypt"     # letsencrypt, custom

# =============================================================================
# 16. SUPPORT & MAINTENANCE
# =============================================================================

# Support Contact
SUPPORT_EMAIL: "support@votreentreprise.com"
SUPPORT_PHONE: "+237 6XX XXX XXX"

# Maintenance Windows
MAINTENANCE_WINDOW_START: "02:00"  # 2 AM
MAINTENANCE_WINDOW_END: "04:00"    # 4 AM
MAINTENANCE_DAYS: ["sunday"]       # Days for maintenance

# Monitoring
MONITORING_ENABLED: true        # Enable application monitoring
ERROR_TRACKING: true            # Enable error tracking/reporting

# =============================================================================
# 17. COMPLIANCE & LEGAL
# =============================================================================

# GDPR Compliance
GDPR_COMPLIANT: true            # Enable GDPR compliance features
COOKIE_CONSENT: true            # Show cookie consent banner

# Legal Pages
TERMS_OF_SERVICE_URL: "https://www.votreentreprise.com/mentions-legales"
PRIVACY_POLICY_URL: "https://www.votreentreprise.com/politique-confidentialite"
LEGAL_NOTICE_URL: "https://www.votreentreprise.com/mentions-legales"

# Data Retention
USER_DATA_RETENTION_DAYS: 365   # Days to keep user data

# =============================================================================
# 18. CUSTOM INTEGRATIONS
# =============================================================================

# Custom API Integrations
CRM_INTEGRATION: false          # Enable CRM integration
ERP_INTEGRATION: false          # Enable ERP integration
ACCOUNTING_SOFTWARE: false      # Enable accounting software integration

# Custom Fields (for future extensibility)
CUSTOM_FIELD_1: ""              # Custom field for specific business needs
CUSTOM_FIELD_2: ""              # Custom field for specific business needs
CUSTOM_FIELD_3: ""              # Custom field for specific business needs

# =============================================================================
# SUBMISSION CHECKLIST
# =============================================================================
#
# BEFORE SUBMITTING THIS FILE:
# ✅ [ ] All company information is accurate and up-to-date
# ✅ [ ] Contact details are correct and tested
# ✅ [ ] Logo files are provided and high quality
# ✅ [ ] Service descriptions match your actual offerings
# ✅ [ ] Portfolio projects are real and verifiable
# ✅ [ ] Social media links are active and correct
# ✅ [ ] Technical configuration matches your hosting setup
# ✅ [ ] All URLs are properly formatted
# ✅ [ ] Required images are provided (see file list below)
# ✅ [ ] Legal information is accurate
# ✅ [ ] SEO metadata is optimized for your business
#
# =============================================================================

# =============================================================================
# REQUIRED FILES TO PROVIDE
# =============================================================================
#
# Please provide the following files along with this configuration:
#
# LOGO FILES:
# - logo-main.png (Main logo, transparent background recommended)
# - logo-white.png (White version for dark backgrounds)
# - logo-icon.png (Small square icon for favicon)
# - logo-dark.png (Dark version for light backgrounds)
#
# BRANDING ASSETS:
# - hero-bg.jpg (Hero section background image)
# - favicon.ico (Browser tab icon)
# - og-image.jpg (Social media preview image)
#
# PORTFOLIO IMAGES:
# - portfolio-1.jpg (First portfolio project image)
# - portfolio-2.jpg (Second portfolio project image)
# - portfolio-3.jpg (Third portfolio project image)
#
# BLOG IMAGES:
# - blog-1.jpg (First blog article featured image)
# - blog-2.jpg (Second blog article featured image)
#
# TESTIMONIAL IMAGES:
# - testimonial-1.jpg (First testimonial profile image)
# - testimonial-2.jpg (Second testimonial profile image)
#
# LEGAL DOCUMENTS (Optional but recommended):
# - terms-of-service.pdf
# - privacy-policy.pdf
# - legal-notice.pdf
#
# =============================================================================

# =============================================================================
# NEXT STEPS AFTER CONFIGURATION
# =============================================================================
#
# 1. SETUP & DEPLOYMENT:
#    - Database will be created/configured
#    - Environment variables will be set
#    - SSL certificate will be installed
#    - Domain will be configured
#
# 2. CONTENT POPULATION:
#    - All services will be added to the database
#    - Portfolio projects will be imported
#    - Blog articles will be published
#    - Testimonials will be activated
#
# 3. TESTING & VALIDATION:
#    - All features will be tested
#    - Contact forms will be validated
#    - Payment integration will be tested (if enabled)
#    - SEO optimization will be verified
#
# 4. TRAINING & HANDOVER:
#    - Admin panel access will be provided
#    - Training session will be scheduled
#    - Documentation will be delivered
#    - Support contact will be established
#
# 5. GO-LIVE:
#    - Site will be made live
#    - Final testing will be conducted
#    - Performance monitoring will be enabled
#    - Backup systems will be activated
#
# =============================================================================

# For questions or clarifications, contact:
# Email: support@votreentreprise.com
# Phone: +237 6XX XXX XXX
# WhatsApp: +237 6XX XXX XXX
