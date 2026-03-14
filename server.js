const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection (Neon PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_D4bExU3VNpXm@ep-crimson-art-am2kftpx-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

// POST /api/claim - Submit a claim for a listing
app.post('/api/claim', async (req, res) => {
  try {
    const { dealerSlug, stateSlug, citySlug, name, email, phone, message } = req.body;

    // Validate required fields
    if (!dealerSlug || !stateSlug || !citySlug || !name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: dealerSlug, stateSlug, citySlug, name, email'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    // Find the dealer
    const dealerResult = await pool.query(
      'SELECT id, name FROM dealers WHERE slug = $1 AND state_slug = $2 AND city_slug = $3',
      [dealerSlug, stateSlug, citySlug]
    );

    if (dealerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Dealer not found'
      });
    }

    const dealer = dealerResult.rows[0];

    // Check for existing pending claim
    const existingClaim = await pool.query(
      'SELECT id FROM claimed_listings WHERE dealer_id = $1 AND status = $2',
      [dealer.id, 'pending']
    );

    if (existingClaim.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'A claim is already pending for this listing'
      });
    }

    // Insert the claim
    const result = await pool.query(
      `INSERT INTO claimed_listings 
       (dealer_id, dealer_slug, state_slug, city_slug, claimant_name, claimant_email, claimant_phone, claimant_message, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
       RETURNING id, created_at`,
      [dealer.id, dealerSlug, stateSlug, citySlug, name, email, phone || '', message || '']
    );

    res.status(201).json({
      success: true,
      message: `Your claim for "${dealer.name}" has been submitted successfully. We will review it and contact you at ${email}.`,
      claimId: result.rows[0].id
    });

  } catch (error) {
    console.error('Claim submission error:', error);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred. Please try again later.'
    });
  }
});

// GET /api/claims - List all claims (admin endpoint)
app.get('/api/claims', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cl.*, d.name as dealer_name 
       FROM claimed_listings cl 
       LEFT JOIN dealers d ON cl.dealer_id = d.id 
       ORDER BY cl.created_at DESC 
       LIMIT 100`
    );
    res.json({ success: true, claims: result.rows });
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/dealers/stats - Get dealer statistics
app.get('/api/dealers/stats', async (req, res) => {
  try {
    const totalDealers = await pool.query('SELECT COUNT(*) FROM dealers');
    const totalLocations = await pool.query('SELECT COUNT(*) FROM locations');
    const totalClaims = await pool.query('SELECT COUNT(*) FROM claimed_listings');
    const stateStats = await pool.query(
      'SELECT state_name, COUNT(*) as count FROM dealers GROUP BY state_name ORDER BY count DESC LIMIT 10'
    );
    
    res.json({
      success: true,
      stats: {
        totalDealers: parseInt(totalDealers.rows[0].count),
        totalLocations: parseInt(totalLocations.rows[0].count),
        totalClaims: parseInt(totalClaims.rows[0].count),
        topStates: stateStats.rows
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Serve static files from the Next.js export
app.use(express.static(path.join(__dirname, 'out'), {
  extensions: ['html'],
  index: 'index.html'
}));

// Fallback: serve index.html for directory paths
app.get('/{*path}', (req, res) => {
  // Try to serve the path as a directory with index.html
  const filePath = path.join(__dirname, 'out', req.path, 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      // Fall back to 404 page
      res.status(404).sendFile(path.join(__dirname, 'out', '404.html'), (err2) => {
        if (err2) {
          res.status(404).send('Page not found');
        }
      });
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`BHPH Directory server running on http://0.0.0.0:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  POST /api/claim - Submit a listing claim`);
  console.log(`  GET  /api/claims - List all claims`);
  console.log(`  GET  /api/dealers/stats - Dealer statistics`);
});
