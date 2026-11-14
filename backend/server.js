const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// IMPORTANT: Change this path to your actual Google Drive folder later!
const DRIVE_PATH = path.join(__dirname, 'drive_database');

// Ensure the Google Drive database and uploads folders exist
const DB_FOLDER = path.join(DRIVE_PATH, 'database');
const UPLOADS_FOLDER = path.join(DRIVE_PATH, 'manuscripts');

if (!fs.existsSync(DRIVE_PATH)) fs.mkdirSync(DRIVE_PATH, { recursive: true });
if (!fs.existsSync(DB_FOLDER)) fs.mkdirSync(DB_FOLDER, { recursive: true });
if (!fs.existsSync(UPLOADS_FOLDER)) fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });

// Initialize SQLite database
const dbFile = path.join(DB_FOLDER, 'vowles_database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) console.error('Error opening database:', err.message);
  else console.log('Successfully connected to SQLite database stored in:', dbFile);
});

// Setup & Migrate Database Tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS manuscripts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    authors TEXT,
    abstract TEXT,
    filename TEXT,
    status TEXT DEFAULT 'Under Review',
    submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    journal TEXT DEFAULT 'Vowles Journal of Artificial Intelligence & Autonomous Systems',
    subject TEXT DEFAULT 'Artificial Intelligence & Robotics',
    doi TEXT DEFAULT '',
    keywords TEXT DEFAULT 'machine learning, intelligence, automation',
    orcid TEXT DEFAULT '',
    affiliation TEXT DEFAULT 'Department of Computer Science',
    views INTEGER DEFAULT 420,
    downloads INTEGER DEFAULT 112,
    citations INTEGER DEFAULT 8,
    price REAL DEFAULT 0.0,
    accessType TEXT DEFAULT 'Open Access',
    reviewers TEXT DEFAULT '["Dr. Aris Thorne (Oxford)", "Prof. Li Wei (MIT)"]',
    reviewScores TEXT DEFAULT '{"originality": 4.8, "rigor": 4.7, "clarity": 4.9}',
    trackingNumber TEXT DEFAULT ''
  )`);

  // Run safe migrations for existing SQLite databases
  const columnsToAdd = [
    "ALTER TABLE manuscripts ADD COLUMN journal TEXT DEFAULT 'Vowles Journal of Artificial Intelligence & Autonomous Systems'",
    "ALTER TABLE manuscripts ADD COLUMN subject TEXT DEFAULT 'Artificial Intelligence & Robotics'",
    "ALTER TABLE manuscripts ADD COLUMN doi TEXT DEFAULT ''",
    "ALTER TABLE manuscripts ADD COLUMN keywords TEXT DEFAULT 'research, science'",
    "ALTER TABLE manuscripts ADD COLUMN orcid TEXT DEFAULT ''",
    "ALTER TABLE manuscripts ADD COLUMN affiliation TEXT DEFAULT ''",
    "ALTER TABLE manuscripts ADD COLUMN views INTEGER DEFAULT 420",
    "ALTER TABLE manuscripts ADD COLUMN downloads INTEGER DEFAULT 112",
    "ALTER TABLE manuscripts ADD COLUMN citations INTEGER DEFAULT 8",
    "ALTER TABLE manuscripts ADD COLUMN price REAL DEFAULT 0.0",
    "ALTER TABLE manuscripts ADD COLUMN accessType TEXT DEFAULT 'Open Access'",
    "ALTER TABLE manuscripts ADD COLUMN reviewers TEXT DEFAULT '[\"Dr. Aris Thorne (Oxford)\", \"Prof. Li Wei (MIT)\"]'",
    "ALTER TABLE manuscripts ADD COLUMN reviewScores TEXT DEFAULT '{\"originality\": 4.8, \"rigor\": 4.7, \"clarity\": 4.9}'",
    "ALTER TABLE manuscripts ADD COLUMN trackingNumber TEXT DEFAULT ''"
  ];

  columnsToAdd.forEach(sql => {
    db.run(sql, () => {}); // Silently ignore if column already exists
  });

  // Seed sample accepted papers if database only has 1 or fewer papers
  db.get('SELECT COUNT(*) as count FROM manuscripts', (err, row) => {
    if (!err && row && row.count <= 1) {
      console.log('Seeding initial flagship publications for Vowles Journals...');
      const seedPapers = [
        {
          title: 'Quantum Advantage in Autonomous Neural Navigation Systems',
          authors: 'Dr. Sarah Lin, Prof. Marcus Vance, Dr. Arthur Dent',
          abstract: 'We demonstrate an algorithmic breakthrough implementing quantum annealing to solve dynamic collision-avoidance graphs in swarm robotics. Testing across 10,000 multi-agent simulations showed a 42% latency reduction compared to standard Dijkstra and A* heuristics in high-density sensor networks.',
          filename: 'sample_quantum_neural.pdf',
          status: 'Accepted',
          journal: 'Vowles Journal of Artificial Intelligence & Autonomous Systems',
          subject: 'Artificial Intelligence & Robotics',
          doi: '10.5555/vowles.2026.0101',
          keywords: 'quantum computing, robotics, autonomous systems, graph theory',
          orcid: '0000-0002-1825-0097',
          affiliation: 'Quantum AI Laboratory, Stanford University',
          views: 1840,
          downloads: 412,
          citations: 28,
          price: 0.0,
          accessType: 'Open Access',
          trackingNumber: 'VP-2026-0101'
        },
        {
          title: 'CRISPR-Cas24 Precision Gene Editing in Targeted Oncology Therapeutics',
          authors: 'Prof. Elena Rostova, Dr. Kenji Takahashi, Dr. Miriam Vance',
          abstract: 'Targeted oncological therapy requires minimal off-target cleavage. Here we report an engineered CRISPR-Cas24 endonuclease variant exhibiting near-zero off-target degradation in mammalian lung carcinoma xenografts while retaining 96.4% on-target editing efficiency.',
          filename: 'sample_crispr_oncology.pdf',
          status: 'Accepted',
          journal: 'Vowles Biotechnology & Bioengineering Letters',
          subject: 'Biotechnology & Genetics',
          doi: '10.5555/vowles.2026.0102',
          keywords: 'CRISPR, gene therapy, oncology, molecular biology',
          orcid: '0000-0001-9214-4321',
          affiliation: 'Department of Bioengineering, Harvard Medical School',
          views: 2950,
          downloads: 870,
          citations: 45,
          price: 0.0,
          accessType: 'Open Access',
          trackingNumber: 'VP-2026-0102'
        },
        {
          title: 'Solid-State Electrolyte Degradation Kinetics in High-Capacity Lithium-Sulfur Cells',
          authors: 'Dr. Tariq Al-Mansoor, Prof. Julia Becker',
          abstract: 'High-energy-density solid-state batteries are hindered by dendrite infiltration at the ceramic electrolyte interface. Using in-situ synchrotron X-ray diffraction, we observe the exact electrochemical phase transition mechanisms and propose a fluorinated interphase that prolongs cell cycle life to 2,000 cycles with 88% capacity retention.',
          filename: 'sample_solid_state_battery.pdf',
          status: 'Accepted',
          journal: 'Vowles Advanced Materials & Nanotechnology',
          subject: 'Materials Science & Nanotechnology',
          doi: '10.5555/vowles.2026.0103',
          keywords: 'solid-state, lithium-sulfur, electrochemistry, energy storage',
          orcid: '0000-0003-4512-8876',
          affiliation: 'Institute of Nanotechnology, ETH Zurich',
          views: 1420,
          downloads: 320,
          citations: 19,
          price: 35.0,
          accessType: 'Subscription',
          trackingNumber: 'VP-2026-0103'
        },
        {
          title: 'Perovskite-Silicon Tandem Photovoltaic Cells with Over 34% Certified Efficiency',
          authors: 'Prof. David Chen, Dr. Ananya Sharma, Dr. Peter Lindholm',
          abstract: 'Tandem solar architectures overcome the Shockley-Queisser limit of silicon absorbers. We report a dual-junction monolithic cell pairing a wide-bandgap metal-halide perovskite with an n-type silicon heterojunction, achieving a certified 34.2% power conversion efficiency under standard 1-sun AM1.5G testing.',
          filename: 'sample_perovskite_photovoltaic.pdf',
          status: 'Accepted',
          journal: 'Vowles Renewable Energy & Sustainable Engineering',
          subject: 'Renewable Energy & Sustainability',
          doi: '10.5555/vowles.2026.0104',
          keywords: 'perovskite, photovoltaics, solar energy, semiconductor physics',
          orcid: '0000-0002-8843-1209',
          affiliation: 'Solar Energy Research Institute, National University of Singapore',
          views: 2100,
          downloads: 654,
          citations: 31,
          price: 0.0,
          accessType: 'Open Access',
          trackingNumber: 'VP-2026-0104'
        },
        {
          title: 'Synthetic Cannabinoid Receptor Agonists: Pharmacokinetics and Blood-Brain Permeability',
          authors: 'Dr. Rebecca O’Connor, Prof. Michael Chang',
          abstract: 'Evaluating central nervous system penetration of synthetic CB1/CB2 receptor ligands using microdialysis in rodent models. Results indicate biphasic absorption curves with lipophilic partition coefficients dictating rapid neuroreceptor occupancy within 12 minutes post-administration.',
          filename: 'sample_neuro_pharmacology.pdf',
          status: 'Accepted',
          journal: 'Vowles International Review of Pharmacological Sciences',
          subject: 'Pharmacology & Toxicology',
          doi: '10.5555/vowles.2026.0105',
          keywords: 'pharmacology, neuroreceptors, pharmacokinetics, drug delivery',
          orcid: '0000-0002-3310-7764',
          affiliation: 'School of Pharmacy, University College London',
          views: 980,
          downloads: 240,
          citations: 11,
          price: 35.0,
          accessType: 'Subscription',
          trackingNumber: 'VP-2026-0105'
        }
      ];

      const stmt = db.prepare(`INSERT INTO manuscripts 
        (title, authors, abstract, filename, status, journal, subject, doi, keywords, orcid, affiliation, views, downloads, citations, price, accessType, trackingNumber)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

      seedPapers.forEach(p => {
        stmt.run([p.title, p.authors, p.abstract, p.filename, p.status, p.journal, p.subject, p.doi, p.keywords, p.orcid, p.affiliation, p.views, p.downloads, p.citations, p.price, p.accessType, p.trackingNumber]);
      });
      stmt.finalize();

      // Ensure mock sample PDFs exist in UPLOADS_FOLDER so download/preview links work
      seedPapers.forEach(p => {
        const dummyPdfPath = path.join(UPLOADS_FOLDER, p.filename);
        if (!fs.existsSync(dummyPdfPath)) {
          fs.writeFileSync(dummyPdfPath, `%PDF-1.4\n%Vowles Publications Official Manuscript: ${p.title}\n%Authors: ${p.authors}\n%DOI: ${p.doi}\n\n1 0 obj\n<< /Title (${p.title}) /Author (${p.authors}) >>\nendobj\n%%EOF`);
        }
      });
    }
  });
});

const app = express();
app.use(cors());
app.use(express.json());

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_FOLDER);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
  }
});
const upload = multer({ storage: storage });

// API Route: Submit a new manuscript
app.post('/api/submit', upload.single('manuscriptFile'), (req, res) => {
  const { 
    title, 
    authors, 
    abstract, 
    journal = 'Vowles Journal of Artificial Intelligence & Autonomous Systems',
    subject = 'Artificial Intelligence & Robotics',
    keywords = '',
    orcid = '',
    affiliation = ''
  } = req.body;

  const filename = req.file ? req.file.filename : null;

  if (!filename) {
    return res.status(400).json({ error: 'Manuscript PDF is required.' });
  }

  const trackingNumber = 'VP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

  const stmt = db.prepare(`INSERT INTO manuscripts 
    (title, authors, abstract, filename, status, journal, subject, keywords, orcid, affiliation, trackingNumber) 
    VALUES (?, ?, ?, ?, 'Under Review', ?, ?, ?, ?, ?, ?)`);

  stmt.run([title, authors, abstract, filename, journal, subject, keywords, orcid, affiliation, trackingNumber], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ 
      message: 'Manuscript submitted successfully!', 
      id: this.lastID,
      trackingNumber: trackingNumber
    });
  });
  stmt.finalize();
});

// API Route: Get all manuscripts
app.get('/api/manuscripts', (req, res) => {
  db.all('SELECT * FROM manuscripts ORDER BY submittedAt DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// API Route: Track manuscript by tracking code or ID
app.get('/api/manuscripts/track/:code', (req, res) => {
  const code = req.params.code.trim();
  db.get('SELECT * FROM manuscripts WHERE trackingNumber = ? OR id = ?', [code, code], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Manuscript not found with tracking ID: ' + code });
    res.json(row);
  });
});

// API Route: Update manuscript status
app.put('/api/manuscripts/:id/status', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  
  // Auto-generate DOI upon acceptance if not present
  let generatedDoi = '';
  if (status === 'Accepted') {
    generatedDoi = `10.5555/vowles.${new Date().getFullYear()}.${1000 + parseInt(id)}`;
  }

  const query = generatedDoi 
    ? 'UPDATE manuscripts SET status = ?, doi = COALESCE(NULLIF(doi, ""), ?) WHERE id = ?'
    : 'UPDATE manuscripts SET status = ? WHERE id = ?';

  const params = generatedDoi ? [status, generatedDoi, id] : [status, id];

  const stmt = db.prepare(query);
  stmt.run(params, function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Status updated', doi: generatedDoi });
  });
  stmt.finalize();
});

// API Route: Assign reviewers & scores
app.put('/api/manuscripts/:id/reviewers', (req, res) => {
  const { reviewers, reviewScores } = req.body;
  const { id } = req.params;

  const stmt = db.prepare('UPDATE manuscripts SET reviewers = ?, reviewScores = ? WHERE id = ?');
  stmt.run([JSON.stringify(reviewers), JSON.stringify(reviewScores), id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Reviewers and scores updated' });
  });
  stmt.finalize();
});

// API Route: Increment view or download count
app.post('/api/manuscripts/:id/interaction', (req, res) => {
  const { type } = req.body; // 'view' or 'download'
  const column = type === 'download' ? 'downloads' : 'views';
  db.run(`UPDATE manuscripts SET ${column} = ${column} + 1 WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
});

// API Route: Process mock orders / cart checkout
app.post('/api/orders/checkout', (req, res) => {
  const { items, customerEmail, paymentMethod, total } = req.body;
  const orderId = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  res.json({
    success: true,
    orderId: orderId,
    message: 'Payment approved. Instant digital access granted.',
    itemsCount: items ? items.length : 0,
    total: total,
    timestamp: new Date().toISOString()
  });
});

// API Route: Serve uploaded PDFs for download & inline preview
app.use('/api/downloads', express.static(UPLOADS_FOLDER));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
  console.log(`Saving data directly to: ${DRIVE_PATH}`);
});