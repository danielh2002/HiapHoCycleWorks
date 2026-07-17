import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle Preflight Request
    if (req.method === 'OPTIONS') return res.status(200).end();

    // GET: Fetch all trails
    if (req.method === 'GET') {
        const { data, error } = await supabase.from('trails').select('*').order('id', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    // POST: Create a new trail
    if (req.method === 'POST') {
        // Destructure the incoming data from the admin dashboard
        const { name, category, difficulty, description, embedCode, locationLink, image1, image2 } = req.body;
        
        const { data, error } = await supabase.from('trails').insert([{ 
            name, 
            category, 
            difficulty, 
            description, 
            embedCode, 
            locationLink, 
            image1, 
            image2 
        }]);
        
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true, data });
    }

    // PUT: Update an existing trail
    if (req.method === 'PUT') {
        const { id } = req.query;
        const { name, category, difficulty, description, embedCode, locationLink, image1, image2 } = req.body;
        
        const { data, error } = await supabase.from('trails').update({ 
            name, 
            category, 
            difficulty, 
            description, 
            embedCode, 
            locationLink, 
            image1, 
            image2 
        }).eq('id', id);
        
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true, data });
    }

    // DELETE: Remove a trail
    if (req.method === 'DELETE') {
        const { id } = req.query;
        const { error } = await supabase.from('trails').delete().eq('id', id);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true });
    }

    // Method Not Allowed
    return res.status(405).json({ error: 'Method Not Allowed' });
}