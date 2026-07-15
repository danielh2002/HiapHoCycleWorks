import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Added PUT to the allowed methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        const { data, error } = await supabase.from('workers').select('*');
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    if (req.method === 'POST') {
        const { data, error } = await supabase.from('workers').insert([req.body]);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true });
    }

    // NEW: Handle PUT requests for updating existing brands
    if (req.method === 'PUT') {
        const { id, name, category, imageUrl } = req.body;
        
        const { data, error } = await supabase
            .from('brands')
            .update({ name, category, imageUrl })
            .eq('id', id);
            
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;
        const { error } = await supabase.from('workers').delete().eq('id', id);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true });
    }

    // Fallback for unsupported methods
    return res.status(405).json({ error: 'Method Not Allowed' });
}