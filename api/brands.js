import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.wnfjwcwcswbkpupivnfi.supabase.co, 
  process.env.sb_publishable_AtX9PSZJlKyCkluez_Zofg_r5frIha9
);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        const { data, error } = await supabase.from('brands').select('*');
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    if (req.method === 'POST') {
        const { data, error } = await supabase.from('brands').insert([req.body]);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;
        const { error } = await supabase.from('brands').delete().eq('id', id);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true });
    }
}