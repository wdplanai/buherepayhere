-- BHPH Directory Database Schema

-- Locations table (states and cities)
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL,
    state_slug VARCHAR(100) NOT NULL,
    state_abbreviation VARCHAR(5) NOT NULL,
    city_name VARCHAR(200) NOT NULL,
    city_slug VARCHAR(200) NOT NULL,
    dealer_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(state_slug, city_slug)
);

-- Dealers table
CREATE TABLE IF NOT EXISTS dealers (
    id SERIAL PRIMARY KEY,
    wp_id VARCHAR(50),
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    city_slug VARCHAR(200) NOT NULL,
    state_slug VARCHAR(200) NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    state_abbreviation VARCHAR(5) NOT NULL,
    city_name VARCHAR(200) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    website VARCHAR(500),
    email VARCHAR(300),
    description TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    business_hours TEXT,
    tagline TEXT,
    is_claimed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(state_slug, city_slug, slug)
);

-- Users table (for future auth)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(300) UNIQUE NOT NULL,
    name VARCHAR(300),
    phone VARCHAR(50),
    password_hash VARCHAR(500),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claimed listings table
CREATE TABLE IF NOT EXISTS claimed_listings (
    id SERIAL PRIMARY KEY,
    dealer_id INTEGER REFERENCES dealers(id) ON DELETE CASCADE,
    dealer_slug VARCHAR(500) NOT NULL,
    state_slug VARCHAR(200) NOT NULL,
    city_slug VARCHAR(200) NOT NULL,
    claimant_name VARCHAR(300) NOT NULL,
    claimant_email VARCHAR(300) NOT NULL,
    claimant_phone VARCHAR(50),
    claimant_message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dealers_state ON dealers(state_slug);
CREATE INDEX IF NOT EXISTS idx_dealers_city ON dealers(state_slug, city_slug);
CREATE INDEX IF NOT EXISTS idx_dealers_slug ON dealers(state_slug, city_slug, slug);
CREATE INDEX IF NOT EXISTS idx_locations_state ON locations(state_slug);
CREATE INDEX IF NOT EXISTS idx_claimed_status ON claimed_listings(status);
CREATE INDEX IF NOT EXISTS idx_claimed_dealer ON claimed_listings(dealer_id);
