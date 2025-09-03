
import type { Customer, Product, Invoice } from "./types";

export const customers: Customer[] = [
  { id: "1", name: "Innovate Inc.", email: "contact@innovateinc.com", phone: "123-456-7890", address: "123 Tech Park, Silicon Valley, CA", gstin: "29AABCU9567R1Z5", createdAt: new Date("2023-01-15") },
  { id: "2", name: "Quantum Solutions", email: "support@quantum.com", phone: "234-567-8901", address: "456 Future Ave, Metropolis, NY", gstin: "07AABCS1234G1Z2", createdAt: new Date("2023-02-20") },
  { id: "3", name: "Synergy Group", email: "hello@synergy.co", phone: "345-678-9012", address: "789 Enterprise Rd, Star City, TX", gstin: "36AAACS5678H1Z9", createdAt: new Date("2023-03-10") },
  { id: "4", name: "Apex Enterprises", email: "info@apex.net", phone: "456-789-0123", address: "101 Peak Plaza, Gotham, NJ", gstin: "24AADCE2345F1Z8", createdAt: new Date("2023-04-05") },
  { id: "5", name: "Nexus Hub", email: "admin@nexushub.io", phone: "567-890-1234", address: "210 Connector Way, Central City, CO", gstin: "08AACDN8765K1Z3", createdAt: new Date("2023-05-25") },
  { id: "6", name: "Stellar Dynamics", email: "contact@stellardynamics.com", phone: "678-901-2345", address: "321 Cosmos Blvd, Galaxy City, FL", gstin: "12AAACD4321B1Z4", createdAt: new Date("2023-01-20") },
  { id: "7", name: "Phoenix Labs", email: "support@phoenixlabs.io", phone: "789-012-3456", address: "432 Rise Ave, Crestwood, AZ", gstin: "04AABCP5678F1Z5", createdAt: new Date("2023-02-25") },
  { id: "8", name: "Vertex Innovations", email: "info@vertexinnovations.net", phone: "890-123-4567", address: "543 Summit Dr, Peakview, CO", gstin: "08AACDV1234L1Z6", createdAt: new Date("2023-03-15") },
  { id: "9", name: "Momentum Works", email: "hello@momentum.works", phone: "901-234-5678", address: "654 Progress Ln, Velocity, TX", gstin: "36AABCM9876K1Z7", createdAt: new Date("2023-04-10") },
  { id: "10", name: "Catalyst Co.", email: "admin@catalystco.com", phone: "012-345-6789", address: "765 Reaction Rd, Fusion, CA", gstin: "29AABCC6543J1Z8", createdAt: new Date("2023-05-30") },
  { id: "11", name: "Horizon Digital", email: "contact@horizondigital.com", phone: "111-222-3333", address: "1 Horizon Plaza, Skyline, WA", gstin: "53AAACH1111A1Z1", createdAt: new Date("2023-06-01") },
  { id: "12", name: "Infinity Tech", email: "support@infinity.tech", phone: "222-333-4444", address: "2 Infinite Loop, San Francisco, CA", gstin: "29AABCI2222B1Z2", createdAt: new Date("2023-06-05") },
  { id: "13", name: "Blue Ocean LLC", email: "info@blueocean.llc", phone: "333-444-5555", address: "3 Deep Sea Dr, Pacifica, OR", gstin: "41AABCB3333C1Z3", createdAt: new Date("2023-06-10") },
  { id: "14", name: "Green Leaf Solutions", email: "hello@greenleaf.eco", phone: "444-555-6666", address: "4 Evergreen Forest, Boulder, CO", gstin: "08AACDG4444D1Z4", createdAt: new Date("2023-06-15") },
  { id: "15", name: "Red Shift Systems", email: "admin@redshiftsys.com", phone: "555-666-7777", address: "5 Doppler Ave, Houston, TX", gstin: "36AABCR5555E1Z5", createdAt: new Date("2023-06-20") },
  { id: "16", name: "Silver Lining Inc.", email: "contact@silverlining.com", phone: "666-777-8888", address: "6 Cloud St, Seattle, WA", gstin: "53AAACS6666F1Z6", createdAt: new Date("2023-06-25") },
  { id: "17", name: "Golden Gate Group", email: "support@goldengate.com", phone: "777-888-9999", address: "7 Bridge Way, Oakland, CA", gstin: "29AABCG7777G1Z7", createdAt: new Date("2023-07-01") },
  { id: "18", name: "Crimson Tide Tech", email: "info@crimsontide.tech", phone: "888-999-0000", address: "8 Ocean Blvd, Miami, FL", gstin: "12AABCC8888H1Z8", createdAt: new Date("2023-07-05") },
  { id: "19", name: "Midnight Sun", email: "hello@midnightsun.io", phone: "999-000-1111", address: "9 Tundra Rd, Anchorage, AK", gstin: "02AABCM9999I1Z9", createdAt: new Date("2023-07-10") },
  { id: "20", name: "First Light Ventures", email: "admin@firstlight.vc", phone: "000-111-2222", address: "10 Dawn Ct, Aurora, IL", gstin: "17AACDF0000J1Z0", createdAt: new Date("2023-07-15") },
  { id: "21", name: "Zenith Capital", email: "contact@zenithcap.com", phone: "121-232-3434", address: "11 Summit Ave, New York, NY", gstin: "34AAACZ1111K1Z1", createdAt: new Date("2023-07-20") },
  { id: "22", name: "Nadir Analytics", email: "support@nadir.ai", phone: "232-343-4545", address: "12 Valley Rd, Death Valley, CA", gstin: "29AACDN2222L1Z2", createdAt: new Date("2023-07-25") },
  { id: "23", name: "Pinnacle Performance", email: "info@pinnacle.com", phone: "343-454-5656", address: "13 Mountain Top, Aspen, CO", gstin: "08AACDP3333M1Z3", createdAt: new Date("2023-08-01") },
  { id: "24", name: "Foundation Forward", email: "hello@foundation.org", phone: "454-565-6767", address: "14 Base St, Chicago, IL", gstin: "17AACDF4444N1Z4", createdAt: new Date("2023-08-05") },
  { id: "25", name: "Keystone Solutions", email: "admin@keystone.io", phone: "565-676-7878", address: "15 Arch Ave, St. Louis, MO", gstin: "29AABCK5555P1Z5", createdAt: new Date("2023-08-10") },
  { id: "26", name: "Omega Dynamics", email: "contact@omegadynamics.net", phone: "676-787-8989", address: "16 End Line, Terminus, GA", gstin: "13AAABO6666Q1Z6", createdAt: new Date("2023-08-15") },
  { id: "27", name: "Alpha Systems", email: "support@alphasys.com", phone: "787-898-9090", address: "17 Beginning Blvd, Genesis, NV", gstin: "32AAACA7777R1Z7", createdAt: new Date("2023-08-20") },
  { id: "28", name: "Beta Technologies", email: "info@betatech.com", phone: "898-909-0101", address: "18 Test Dr, Palo Alto, CA", gstin: "29AABCB8888S1Z8", createdAt: new Date("2023-08-25") },
  { id: "29", name: "Gamma Ray Media", email: "hello@gammaray.media", phone: "909-010-1212", address: "19 Wavelength Way, Burbank, CA", gstin: "29AABCG9999T1Z9", createdAt: new Date("2023-09-01") },
  { id: "30", name: "Delta Force Digital", email: "admin@deltaforce.digital", phone: "010-121-2323", address: "20 Triangle Terr, Raleigh, NC", gstin: "37AACDD0000U1Z0", createdAt: new Date("2023-09-05") },
  { id: "31", name: "Epsilon Esports", email: "contact@epsilonesports.com", phone: "111-333-5555", address: "21 Gamer Grove, Los Angeles, CA", gstin: "29AABCE1111V1Z1", createdAt: new Date("2023-09-10") },
  { id: "32", name: "Zeta Logistics", email: "support@zetalogistics.com", phone: "222-444-6666", address: "22 Shipping Ln, Memphis, TN", gstin: "47AACDZ2222W1Z2", createdAt: new Date("2023-09-15") },
  { id: "33", name: "Eta Engineering", email: "info@eta.eng", phone: "333-555-7777", address: "23 Blueprint Blvd, Detroit, MI", gstin: "26AABCE3333X1Z3", createdAt: new Date("2023-09-20") },
  { id: "34", name: "Theta Healing", email: "hello@thetahealing.com", phone: "444-666-8888", address: "24 Mindful Way, Sedona, AZ", gstin: "04AABCT4444Y1Z4", createdAt: new Date("2023-09-25") },
  { id: "35", name: "Iota Innovations", email: "admin@iotainnovations.io", phone: "555-777-9999", address: "25 Micro Dr, Cambridge, MA", gstin: "25AABCI5555Z1Z5", createdAt: new Date("2023-10-01") },
  { id: "36", name: "Kappa Consulting", email: "contact@kappaconsulting.com", phone: "666-888-0000", address: "26 Advisor Ave, Boston, MA", gstin: "25AABCK6666A1Z6", createdAt: new Date("2023-10-05") },
  { id: "37", name: "Lambda Legal", email: "support@lambdalegal.com", phone: "777-999-1111", address: "27 Justice Ct, Washington, DC", gstin: "11AABCL7777B1Z7", createdAt: new Date("2023-10-10") },
  { id: "38", name: "Mu Manufacturing", email: "info@mumanufacturing.com", phone: "888-000-2222", address: "28 Factory Floor, Pittsburgh, PA", gstin: "42AABCU8888C1Z8", createdAt: new Date("2023-10-15") },
  { id: "39", name: "Nu Networks", email: "hello@nunetworks.com", phone: "999-111-3333", address: "29 Connectivity Cres, San Jose, CA", gstin: "29AABCN9999D1Z9", createdAt: new Date("2023-10-20") },
  { id: "40", name: "Xi Exports", email: "admin@xiexports.com", phone: "000-222-4444", address: "30 Trade Wharf, Long Beach, CA", gstin: "29AABCX0000E1Z0", createdAt: new Date("2023-10-25") },
  { id: "41", name: "Omicron Security", email: "contact@omicronsec.com", phone: "123-123-1234", address: "31 Secure St, Fort Meade, MD", gstin: "24AAABO1111F1Z1", createdAt: new Date("2023-11-01") },
  { id: "42", name: "Pi Pizza", email: "support@pipizza.com", phone: "314-159-2653", address: "314 Circle Ave, Chicago, IL", gstin: "17AABCP2222G1Z2", createdAt: new Date("2023-11-05") },
  { id: "43", name: "Rho Resources", email: "info@rhoresources.com", phone: "234-234-2345", address: "32 Mining Way, Denver, CO", gstin: "08AACDR3333H1Z3", createdAt: new Date("2023-11-10") },
  { id: "44", name: "Sigma Six Solutions", email: "hello@sigmasix.com", phone: "345-345-3456", address: "33 Quality Quay, Detroit, MI", gstin: "26AABCS4444I1Z4", createdAt: new Date("2023-11-15") },
  { id: "45", name: "Tau Transport", email: "admin@tautransport.com", phone: "456-456-4567", address: "34 Freight Lane, Omaha, NE", gstin: "31AABCT5555J1Z5", createdAt: new Date("2023-11-20") },
  { id: "46", name: "Upsilon Unlimited", email: "contact@upsilon.com", phone: "567-567-5678", address: "35 Limitless Loop, Infinite, ID", gstin: "16AAABU6666K1Z6", createdAt: new Date("2023-11-25") },
  { id: "47", name: "Phi Philosophy", email: "support@phiphilosophy.com", phone: "678-678-6789", address: "36 Golden Ratio, Athens, GA", gstin: "13AABCP7777L1Z7", createdAt: new Date("2023-12-01") },
  { id: "48", name: "Chi Cosmetics", email: "info@chicosmetics.com", phone: "789-789-7890", address: "37 Beauty Blvd, Beverly Hills, CA", gstin: "29AABCC8888M1Z8", createdAt: new Date("2023-12-05") },
  { id: "49", name: "Psi Psychiatry", email: "hello@psipsych.com", phone: "890-890-8901", address: "38 Mindful St, Vienna, VA", gstin: "51AABCP9999N1Z9", createdAt: new Date("2023-12-10") },
  { id: "50", name: "Aura Aesthetics", email: "admin@aura.clinic", phone: "901-901-9012", address: "39 Glow Up Grove, Miami, FL", gstin: "12AAABA0000P1Z0", createdAt: new Date("2023-12-15") },
  { id: "51", name: "Echo Energy", email: "contact@echoenergy.com", phone: "112-211-3223", address: "40 Soundwave St, Austin, TX", gstin: "36AABCE1122Q1Z1", createdAt: new Date("2023-12-20") },
  { id: "52", name: "Orbit Optics", email: "support@orbitor.com", phone: "223-322-4334", address: "41 Telescope Terrace, Pasadena, CA", gstin: "29AABCO2233R1Z2", createdAt: new Date("2023-12-25") },
  { id: "53", name: "Pulsar Properties", email: "info@pulsarprop.com", phone: "334-433-5445", address: "42 Starburst St, Dallas, TX", gstin: "36AABCP3344S1Z3", createdAt: new Date("2024-01-01") },
  { id: "54", name: "Quasar Queries", email: "hello@quasar.ai", phone: "445-544-6556", address: "43 Data Drive, Reston, VA", gstin: "51AABCQ4455T1Z4", createdAt: new Date("2024-01-05") },
  { id: "55", name: "Vortex Ventures", email: "admin@vortex.vc", phone: "556-655-7667", address: "44 Cyclone Circle, Oklahoma City, OK", gstin: "40AABCV5566U1Z5", createdAt: new Date("2024-01-10") }
];

export const products: Product[] = [
  { id: "1", name: "Cloud Service Subscription", description: "1-year basic tier cloud service.", price: 1200, stock: 100 },
  { id: "2", name: "API Development", description: "Custom API integration service.", price: 5000, stock: 50 },
  { id: "3", name: "Website Maintenance", description: "Monthly website support package.", price: 300, stock: 200 },
  { id: "4", name: "UX/UI Design Package", description: "Complete design for a new application.", price: 8000, stock: 20 },
  { id: "5", name: "Consulting Hours", description: "10-hour block of technical consulting.", price: 1500, stock: 150 },
  { id: "6", name: "Enterprise Software License", description: "Per-seat license for our flagship software.", price: 2500, stock: 500 },
  { id: "7", name: "Data Analytics Dashboard", description: "Custom-built analytics and reporting tool.", price: 7500, stock: 30 },
  { id: "8", name: "IT Support Contract (Annual)", description: "24/7 IT support for a small business.", price: 10000, stock: 100 },
  { id: "9", name: "E-commerce Platform Setup", description: "Full setup and configuration of an online store.", price: 6000, stock: 40 },
  { id: "10", name: "SEO Optimization Package", description: "Monthly SEO services to improve search rankings.", price: 2000, stock: 80 },
  { id: "11", name: "Mobile App (iOS) Dev", description: "Full development cycle for a native iOS app.", price: 25000, stock: 10 },
  { id: "12", name: "Mobile App (Android) Dev", description: "Full development cycle for a native Android app.", price: 22000, stock: 12 },
  { id: "13", name: "Social Media Mgt. (Monthly)", description: "Content creation and management for 3 social channels.", price: 1800, stock: 60 },
  { id: "14", name: "Content Writing (10 articles)", description: "10 high-quality blog posts or articles.", price: 2200, stock: 100 },
  { id: "15", name: "Logo & Brand Guide", description: "Professional logo design and brand identity guide.", price: 3500, stock: 75 },
  { id: "16", name: "Video Production (Explainer)", description: "1-2 minute animated explainer video.", price: 4500, stock: 25 },
  { id: "17", name: "Cybersecurity Audit", description: "Comprehensive security assessment of digital assets.", price: 9000, stock: 15 },
  { id: "18", name: "Cloud Migration Service", description: "Migrate existing infrastructure to a cloud provider.", price: 12000, stock: 20 },
  { id: "19", name: "PPC Campaign Management", description: "Monthly management of pay-per-click advertising.", price: 1300, stock: 90 },
  { id: "20", name: "CRM Setup & Integration", description: "Setup and integration of a CRM like Salesforce or HubSpot.", price: 5500, stock: 35 },
  { id: "21", name: "HR Management Software", description: "SaaS for managing HR processes.", price: 850, stock: 300 },
  { id: "22", name: "Bookkeeping Service (Monthly)", description: "Monthly financial bookkeeping and reporting.", price: 600, stock: 120 },
  { id: "23", "name": "Graphic Design Retainer", description: "Retainer for ongoing graphic design needs.", price: 2800, stock: 50 },
  { id: "24", name: "QA Testing (Per Hour)", description: "Manual and automated software quality assurance testing.", price: 75, stock: 1000 },
  { id: "25", name: "Project Management Tool", description: "Annual subscription to our PM software.", price: 990, stock: 400 },
  { id: "26", name: "Custom Plugin Development", description: "Development of a custom plugin for WordPress/other platforms.", price: 1800, stock: 65 },
  { id: "27", name: "Web Hosting (Premium)", description: "Premium managed web hosting for one year.", price: 500, stock: 250 },
  { id: "28", name: "Domain Name Registration", description: "Registration of a .com domain for one year.", price: 20, stock: 10000 },
  { id: "29", name: "SSL Certificate (1-Year)", description: "Standard SSL certificate for website security.", price: 80, stock: 5000 },
  { id: "30", name: "Legal Consultation (1 Hour)", description: "1-hour legal consultation with a business lawyer.", price: 450, stock: 80 },
  { id: "31", name: "Virtual Assistant (20 Hours)", description: "20-hour block of virtual assistant services.", price: 700, stock: 100 },
  { id: "32", name: "Copywriting Service", description: "Professional copywriting for websites and marketing materials.", price: 1200, stock: 90 },
  { id: "33", name: "Stock Photo Bundle", description: "Bundle of 100 royalty-free stock photos.", price: 150, stock: 500 },
  { id: "34", name: "Music Production (Per Track)", description: "Custom music track production.", price: 3000, stock: 40 },
  { id: "35", name: "3D Modeling Service", description: "Custom 3D modeling for products or architectural visualization.", price: 2500, stock: 30 },
  { id: "36", name: "Architectural Plans", description: "Full set of architectural plans for a residential building.", price: 15000, stock: 10 },
  { id: "37", name: "Interior Design Consultation", description: "2-hour interior design consultation and mood board.", price: 800, stock: 60 },
  { id: "38", name: "Landscaping Design", description: "Custom landscape design for a residential property.", price: 1800, stock: 45 },
  { id: "39", name: "Event Planning Service", description: "Full-service planning for a corporate event.", price: 10000, stock: 15 },
  { id: "40", name: "Catering Service (per person)", description: "Catering for events, priced per person.", price: 150, stock: 2000 },
  { id: "41", name: "Photography Session (2 hours)", description: "2-hour professional photography session.", price: 900, stock: 70 },
  { id: "42", name: "Videography Service (Half Day)", description: "4-hour videography service for events or marketing.", price: 2000, stock: 50 },
  { id: "43", name: "Fitness Coaching (Monthly)", description: "Monthly personalized fitness coaching program.", price: 250, stock: 150 },
  { id: "44", name: "Nutrition Planning", description: "Customized weekly nutrition plan.", price: 180, stock: 200 },
  { id: "45", name: "Language Tutoring (10 hours)", description: "10-hour package of one-on-one language tutoring.", price: 600, stock: 100 },
  { id: "46", name: "Music Lessons (Monthly)", description: "4 one-hour music lessons per month.", price: 300, stock: 80 },
  { id: "47", name: "Career Coaching Package", description: "5-session career coaching package.", price: 1500, stock: 50 },
  { id: "48", name: "Resume Writing Service", description: "Professional resume and cover letter writing.", price: 400, stock: 120 },
  { id: "49", name: "Financial Advisory Service", description: "Comprehensive financial planning and advisory session.", price: 2500, stock: 40 },
  { id: "50", name: "Tax Preparation (Individual)", description: "Preparation and filing of individual tax returns.", price: 500, stock: 300 },
  { id: "51", name: "Tax Preparation (Business)", description: "Preparation and filing of business tax returns.", price: 1500, stock: 100 },
  { id: "52", name: "Real Estate Brokerage Fee", description: "Standard fee for real estate transaction.", price: 12000, stock: 30 },
  { id: "53", name: "Home Inspection Service", description: "Comprehensive inspection for a residential property.", price: 750, stock: 80 },
  { id: "54", name: "Moving Service (Local)", description: "Local moving service with a 2-person crew.", price: 1200, stock: 50 },
  { id: "55", name: "Translation Service (per word)", description: "Document translation service.", price: 0.20, stock: 100000 },
];


export const invoices: Invoice[] = [
  { id: "1", invoiceNumber: "INV-001", customer: customers[0], items: [{ product: products[0], quantity: 1 }, { product: products[2], quantity: 3 }], date: new Date("2023-06-01"), subtotal: 2100, tax: 378, discount: 100, total: 2378, amountPaid: 2378, status: "Paid" },
  { id: "2", invoiceNumber: "INV-002", customer: customers[1], items: [{ product: products[1], quantity: 1 }], date: new Date("2023-06-05"), subtotal: 5000, tax: 900, discount: 0, total: 5900, amountPaid: 2000, status: "Pending" },
  { id: "3", invoiceNumber: "INV-003", customer: customers[2], items: [{ product: products[3], quantity: 1 }, { product: products[4], quantity: 2 }], date: new Date("2023-05-10"), subtotal: 11000, tax: 1980, discount: 500, total: 12480, amountPaid: 10000, status: "Overdue" },
  { id: "4", invoiceNumber: "INV-004", customer: customers[3], items: [{ product: products[2], quantity: 12 }], date: new Date("2023-06-15"), subtotal: 3600, tax: 648, discount: 0, total: 4248, amountPaid: 4248, status: "Paid" },
  { id: "5", invoiceNumber: "INV-005", customer: customers[4], items: [{ product: products[0], quantity: 2 }], date: new Date("2023-06-20"), subtotal: 2400, tax: 432, discount: 200, total: 2632, amountPaid: 0, status: "Pending" },
  { id: "6", invoiceNumber: "INV-006", customer: customers[5], items: [{ product: products[5], quantity: 5 }], date: new Date("2023-07-01"), subtotal: 12500, tax: 2250, discount: 1000, total: 13750, amountPaid: 13750, status: "Paid" },
  { id: "7", invoiceNumber: "INV-007", customer: customers[6], items: [{ product: products[6], quantity: 1 }, { product: products[7], quantity: 1 }], date: new Date("2023-07-05"), subtotal: 17500, tax: 3150, discount: 0, total: 20650, amountPaid: 10000, status: "Pending" },
  { id: "8", invoiceNumber: "INV-008", customer: customers[7], items: [{ product: products[8], quantity: 1 }], date: new Date("2023-06-10"), subtotal: 6000, tax: 1080, discount: 200, total: 6880, amountPaid: 0, status: "Overdue" },
  { id: "9", invoiceNumber: "INV-009", customer: customers[8], items: [{ product: products[9], quantity: 6 }], date: new Date("2023-07-15"), subtotal: 12000, tax: 2160, discount: 0, total: 14160, amountPaid: 14160, status: "Paid" },
  { id: "10", invoiceNumber: "INV-010", customer: customers[9], items: [{ product: products[10], quantity: 1 }], date: new Date("2023-07-20"), subtotal: 25000, tax: 4500, discount: 1500, total: 28000, amountPaid: 20000, status: "Pending" },
  { id: "11", invoiceNumber: "INV-011", customer: customers[10], items: [{ product: products[11], quantity: 1 }], date: new Date("2023-08-01"), subtotal: 22000, tax: 3960, discount: 0, total: 25960, amountPaid: 25960, status: "Paid" },
  { id: "12", invoiceNumber: "INV-012", customer: customers[11], items: [{ product: products[12], quantity: 12 }], date: new Date("2023-08-05"), subtotal: 21600, tax: 3888, discount: 2000, total: 23488, amountPaid: 15000, status: "Pending" },
  { id: "13", invoiceNumber: "INV-013", customer: customers[12], items: [{ product: products[13], quantity: 1 }], date: new Date("2023-07-10"), subtotal: 2200, tax: 396, discount: 0, total: 2596, amountPaid: 0, status: "Overdue" },
  { id: "14", invoiceNumber: "INV-014", customer: customers[13], items: [{ product: products[14], quantity: 1 }], date: new Date("2023-08-15"), subtotal: 3500, tax: 630, discount: 0, total: 4130, amountPaid: 4130, status: "Paid" },
  { id: "15", invoiceNumber: "INV-015", customer: customers[14], items: [{ product: products[15], quantity: 2 }], date: new Date("2023-08-20"), subtotal: 9000, tax: 1620, discount: 500, total: 10120, amountPaid: 5000, status: "Pending" },
  { id: "16", invoiceNumber: "INV-016", customer: customers[15], items: [{ product: products[16], quantity: 1 }], date: new Date("2023-09-01"), subtotal: 9000, tax: 1620, discount: 0, total: 10620, amountPaid: 10620, status: "Paid" },
  { id: "17", invoiceNumber: "INV-017", customer: customers[16], items: [{ product: products[17], quantity: 1 }], date: new Date("2023-09-05"), subtotal: 12000, tax: 2160, discount: 1000, total: 13160, amountPaid: 0, status: "Pending" },
  { id: "18", invoiceNumber: "INV-018", customer: customers[17], items: [{ product: products[18], quantity: 3 }], date: new Date("2023-08-10"), subtotal: 3900, tax: 702, discount: 0, total: 4602, amountPaid: 4602, status: "Paid" },
  { id: "19", invoiceNumber: "INV-019", customer: customers[18], items: [{ product: products[19], quantity: 1 }], date: new Date("2023-09-15"), subtotal: 5500, tax: 990, discount: 0, total: 6490, amountPaid: 0, status: "Overdue" },
  { id: "20", invoiceNumber: "INV-020", customer: customers[19], items: [{ product: products[20], quantity: 10 }], date: new Date("2023-09-20"), subtotal: 8500, tax: 1530, discount: 300, total: 9730, amountPaid: 9730, status: "Paid" },
  { id: "21", invoiceNumber: "INV-021", customer: customers[20], items: [{ product: products[21], quantity: 24 }], date: new Date("2023-10-01"), subtotal: 14400, tax: 2592, discount: 1000, total: 15992, amountPaid: 10000, status: "Pending" },
  { id: "22", invoiceNumber: "INV-022", customer: customers[21], items: [{ product: products[22], quantity: 2 }], date: new Date("2023-10-05"), subtotal: 5600, tax: 1008, discount: 0, total: 6608, amountPaid: 6608, status: "Paid" },
  { id: "23", invoiceNumber: "INV-023", customer: customers[22], items: [{ product: products[23], quantity: 50 }], date: new Date("2023-09-10"), subtotal: 3750, tax: 675, discount: 0, total: 4425, amountPaid: 0, status: "Overdue" },
  { id: "24", invoiceNumber: "INV-024", customer: customers[23], items: [{ product: products[24], quantity: 15 }], date: new Date("2023-10-15"), subtotal: 14850, tax: 2673, discount: 850, total: 16673, amountPaid: 16673, status: "Paid" },
  { id: "25", invoiceNumber: "INV-025", customer: customers[24], items: [{ product: products[25], quantity: 3 }], date: new Date("2023-10-20"), subtotal: 5400, tax: 972, discount: 0, total: 6372, amountPaid: 0, status: "Pending" },
  { id: "26", invoiceNumber: "INV-026", customer: customers[25], items: [{ product: products[26], quantity: 20 }], date: new Date("2023-11-01"), subtotal: 10000, tax: 1800, discount: 500, total: 11300, amountPaid: 11300, status: "Paid" },
  { id: "27", invoiceNumber: "INV-027", customer: customers[26], items: [{ product: products[27], quantity: 100 }], date: new Date("2023-11-05"), subtotal: 2000, tax: 360, discount: 0, total: 2360, amountPaid: 1000, status: "Pending" },
  { id: "28", invoiceNumber: "INV-028", customer: customers[27], items: [{ product: products[28], quantity: 50 }], date: new Date("2023-10-10"), subtotal: 4000, tax: 720, discount: 0, total: 4720, amountPaid: 0, status: "Overdue" },
  { id: "29", invoiceNumber: "INV-029", customer: customers[28], items: [{ product: products[29], quantity: 1 }], date: new Date("2023-11-15"), subtotal: 450, tax: 81, discount: 0, total: 531, amountPaid: 531, status: "Paid" },
  { id: "30", invoiceNumber: "INV-030", customer: customers[29], items: [{ product: products[30], quantity: 3 }], date: new Date("2023-11-20"), subtotal: 2100, tax: 378, discount: 100, total: 2378, amountPaid: 0, status: "Pending" },
  { id: "31", invoiceNumber: "INV-031", customer: customers[30], items: [{ product: products[31], quantity: 1 }], date: new Date("2023-12-01"), subtotal: 1200, tax: 216, discount: 0, total: 1416, amountPaid: 1416, status: "Paid" },
  { id: "32", invoiceNumber: "INV-032", customer: customers[31], items: [{ product: products[32], quantity: 2 }], date: new Date("2023-12-05"), subtotal: 300, tax: 54, discount: 0, total: 354, amountPaid: 0, status: "Pending" },
  { id: "33", invoiceNumber: "INV-033", customer: customers[32], items: [{ product: products[33], quantity: 1 }], date: new Date("2023-11-10"), subtotal: 3000, tax: 540, discount: 200, total: 3340, amountPaid: 0, status: "Overdue" },
  { id: "34", invoiceNumber: "INV-034", customer: customers[33], items: [{ product: products[34], quantity: 1 }], date: new Date("2023-12-15"), subtotal: 2500, tax: 450, discount: 0, total: 2950, amountPaid: 2950, status: "Paid" },
  { id: "35", invoiceNumber: "INV-035", customer: customers[34], items: [{ product: products[35], quantity: 1 }], date: new Date("2023-12-20"), subtotal: 15000, tax: 2700, discount: 1000, total: 16700, amountPaid: 10000, status: "Pending" },
  { id: "36", invoiceNumber: "INV-036", customer: customers[35], items: [{ product: products[36], quantity: 2 }], date: new Date("2024-01-01"), subtotal: 1600, tax: 288, discount: 0, total: 1888, amountPaid: 1888, status: "Paid" },
  { id: "37", invoiceNumber: "INV-037", customer: customers[36], items: [{ product: products[37], quantity: 1 }], date: new Date("2024-01-05"), subtotal: 1800, tax: 324, discount: 0, total: 2124, amountPaid: 0, status: "Pending" },
  { id: "38", invoiceNumber: "INV-038", customer: customers[37], items: [{ product: products[38], quantity: 1 }], date: new Date("2023-12-10"), subtotal: 10000, tax: 1800, discount: 500, total: 11300, amountPaid: 0, status: "Overdue" },
  { id: "39", invoiceNumber: "INV-039", customer: customers[38], items: [{ product: products[39], quantity: 10 }], date: new Date("2024-01-15"), subtotal: 1500, tax: 270, discount: 0, total: 1770, amountPaid: 1770, status: "Paid" },
  { id: "40", invoiceNumber: "INV-040", customer: customers[39], items: [{ product: products[40], quantity: 5 }], date: new Date("2024-01-20"), subtotal: 4500, tax: 810, discount: 200, total: 5110, amountPaid: 2500, status: "Pending" },
  { id: "41", invoiceNumber: "INV-041", customer: customers[40], items: [{ product: products[41], quantity: 1 }], date: new Date("2024-02-01"), subtotal: 2000, tax: 360, discount: 0, total: 2360, amountPaid: 2360, status: "Paid" },
  { id: "42", invoiceNumber: "INV-042", customer: customers[41], items: [{ product: products[42], quantity: 1 }], date: new Date("2024-02-05"), subtotal: 250, tax: 45, discount: 0, total: 295, amountPaid: 0, status: "Pending" },
  { id: "43", invoiceNumber: "INV-043", customer: customers[42], items: [{ product: products[43], quantity: 2 }], date: new Date("2024-01-10"), subtotal: 360, tax: 64.8, discount: 0, total: 424.8, amountPaid: 0, status: "Overdue" },
  { id: "44", invoiceNumber: "INV-044", customer: customers[43], items: [{ product: products[44], quantity: 4 }], date: new Date("2024-02-15"), subtotal: 2400, tax: 432, discount: 150, total: 2682, amountPaid: 2682, status: "Paid" },
  { id: "45", invoiceNumber: "INV-045", customer: customers[44], items: [{ product: products[45], quantity: 1 }], date: new Date("2024-02-20"), subtotal: 300, tax: 54, discount: 0, total: 354, amountPaid: 0, status: "Pending" },
  { id: "46", invoiceNumber: "INV-046", customer: customers[45], items: [{ product: products[46], quantity: 3 }], date: new Date("2024-03-01"), subtotal: 4500, tax: 810, discount: 0, total: 5310, amountPaid: 5310, status: "Paid" },
  { id: "47", invoiceNumber: "INV-047", customer: customers[46], items: [{ product: products[47], quantity: 1 }], date: new Date("2024-03-05"), subtotal: 400, tax: 72, discount: 0, total: 472, amountPaid: 0, status: "Pending" },
  { id: "48", invoiceNumber: "INV-048", customer: customers[47], items: [{ product: products[48], quantity: 1 }], date: new Date("2024-02-10"), subtotal: 2500, tax: 450, discount: 0, total: 2950, amountPaid: 0, status: "Overdue" },
  { id: "49", invoiceNumber: "INV-049", customer: customers[48], items: [{ product: products[49], quantity: 1 }], date: new Date("2024-03-15"), subtotal: 500, tax: 90, discount: 50, total: 540, amountPaid: 540, status: "Paid" },
  { id: "50", invoiceNumber: "INV-050", customer: customers[49], items: [{ product: products[50], quantity: 2 }], date: new Date("2024-03-20"), subtotal: 3000, tax: 540, discount: 0, total: 3540, amountPaid: 1500, status: "Pending" },
  { id: "51", invoiceNumber: "INV-051", customer: customers[50], items: [{ product: products[51], quantity: 1 }], date: new Date("2024-04-01"), subtotal: 12000, tax: 2160, discount: 1000, total: 13160, amountPaid: 13160, status: "Paid" },
  { id: "52", invoiceNumber: "INV-052", customer: customers[51], items: [{ product: products[52], quantity: 1 }], date: new Date("2024-04-05"), subtotal: 750, tax: 135, discount: 0, total: 885, amountPaid: 0, status: "Pending" },
  { id: "53", invoiceNumber: "INV-053", customer: customers[52], items: [{ product: products[53], quantity: 1 }], date: new Date("2024-03-10"), subtotal: 1200, tax: 216, discount: 0, total: 1416, amountPaid: 0, status: "Overdue" },
  { id: "54", invoiceNumber: "INV-054", customer: customers[53], items: [{ product: products[54], quantity: 1 }], date: new Date("2024-04-15"), subtotal: 0.20 * 5000, tax: 180, discount: 0, total: 1180, amountPaid: 1180, status: "Paid" },
  { id: "55", invoiceNumber: "INV-055", customer: customers[54], items: [{ product: products[0], quantity: 10 }], date: new Date("2024-04-20"), subtotal: 12000, tax: 2160, discount: 500, total: 13660, amountPaid: 7000, status: "Pending" }
];


function getCustomerStatus(customerId: string): "Paid" | "Pending" | "Overdue" | "New" {
  const customerInvoices = invoices.filter(
    (invoice) => invoice.customer.id === customerId
  );

  if (customerInvoices.length === 0) {
    return "New"; 
  }

  const hasOverdue = customerInvoices.some(
    (invoice) => invoice.status === "Overdue"
  );
  if (hasOverdue) {
    return "Overdue";
  }

  const hasPending = customerInvoices.some(
    (invoice) => invoice.status === "Pending"
  );
  if (hasPending) {
    return "Pending";
  }
  
  const allPaid = customerInvoices.every(
      (invoice) => invoice.status === "Paid"
  );
  if(allPaid){
    return "Paid";
  }

  return "Pending"; // Default case if there are invoices but none are overdue/pending, and not all are paid (e.g. partial payments)
}


customers.forEach(customer => {
    customer.status = getCustomerStatus(customer.id);
});
