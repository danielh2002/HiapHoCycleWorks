import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_ANON_KEY
);


export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 1. GET: Allows your Admin Dashboard to read all messages
    if (req.method === 'GET') {
        const { data, error } = await supabase.from('inquiries').select('*');
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    // 2. POST: Allows your Contact Page to save a new message
    if (req.method === 'POST') {
        // Automatically generate today's date for the new inquiry
        const currentDate = new Date().toLocaleDateString('en-GB'); // Formats as DD/MM/YYYY

        // Combine the form data from the website with the current date
        const newInquiry = {
            ...req.body,
            date: currentDate
        };

        // Insert into Supabase
        const { error } = await supabase.from('inquiries').insert([newInquiry]);
        
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true });
    }

    // 3. DELETE: Just in case you want to delete messages from the admin panel later
    if (req.method === 'DELETE') {
        const { id } = req.query;
        const { error } = await supabase.from('inquiries').delete().eq('id', id);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true });
    }
}