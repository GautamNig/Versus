-- Create celebrities table
CREATE TABLE IF NOT EXISTS celebrities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create counters table  
CREATE TABLE IF NOT EXISTS counters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  celebrity_id UUID REFERENCES celebrities(id) ON DELETE CASCADE,
  current_value INTEGER DEFAULT 0 NOT NULL,
  max_value INTEGER DEFAULT 100 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create active_state table for tracking which celebrity is counting
CREATE TABLE IF NOT EXISTS active_state (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  active_celebrity_id UUID REFERENCES celebrities(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial celebrity data (let DB generate UUIDs)
INSERT INTO celebrities (name, image_url) VALUES
  ('Celebrity A', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'),
  ('Celebrity B', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop');

-- Enable Row Level Security
ALTER TABLE celebrities ENABLE ROW LEVEL SECURITY;
ALTER TABLE counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_state ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (all users can read)
CREATE POLICY "Allow public read access for celebrities" ON celebrities FOR SELECT USING (true);
CREATE POLICY "Allow public read access for counters" ON counters FOR SELECT USING (true);
CREATE POLICY "Allow public read access for active_state" ON active_state FOR SELECT USING (true);

-- Create policies for authenticated users to update
CREATE POLICY "Allow authenticated users to update counters" ON counters FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to update active_state" ON active_state FOR UPDATE TO authenticated USING (true);

-- Insert counters for the celebrities (run this after the celebrities are inserted)
INSERT INTO counters (celebrity_id, current_value, max_value)
SELECT id, 0, 100 FROM celebrities;

-- Insert initial active state
INSERT INTO active_state (active_celebrity_id) VALUES (NULL);