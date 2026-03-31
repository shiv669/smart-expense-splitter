const fetch = require('node-fetch');

function fallbackCategory(desc) {
    const d = desc.toLowerCase();

    if (d.includes('food') || d.includes('dinner') || d.includes('lunch')) return 'Food';
    if (d.includes('uber') || d.includes('travel') || d.includes('bus')) return 'Travel';
    if (d.includes('rent') || d.includes('house')) return 'Housing';

    return 'Other';
}

async function categorizeExpense(req, res) {
    const { description } = req.body;

    if (!description) {
        return res.status(400).json({ error: 'description required' });
    }

    if (!process.env.GROQ_API_KEY) {
        return res.json({ category: fallbackCategory(description) });
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [
                    {
                        role: 'system',
                        content: 'Classify expense into one word category like Food, Travel, Rent, Shopping, Other'
                    },
                    {
                        role: 'user',
                        content: description
                    }
                ]
            })
        });

        if (!response.ok) {
            return res.json({ category: fallbackCategory(description) });
        }

        const data = await response.json();
        const category = data.choices?.[0]?.message?.content?.trim() || fallbackCategory(description);

        res.json({ category });
    }
    catch (err) {
        console.error("AI Categorization Error:", err);
        res.json({ category: fallbackCategory(description) });
    }
}

module.exports = { categorizeExpense };