const fetch = require('node-fetch')

function fallbackCategory(desc){
    const d = desc.toLowerCase()

    if(d.includes('food') || d.includes('dinner') || d.includes('lunch')) return 'Food'
    if(d.includes('uber') || d.includes('travel') || d.includes('bus')) return 'Travel'
    if(d.includes('rent') || d.includes('house')) return 'Housing'

    return 'Other'
}

async function categorizeExpense(req, res){
    const { description } = req.body

    if(!description){
        return res.status(400).json({ error: 'description required' })
    }

    console.log("AI CALLED:", description)

    if(!process.env.GROQ_API_KEY){
        const cat = fallbackCategory(description)
        console.log("FALLBACK USED:", cat)
        return res.json({ category: cat })
    }

    try{
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
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
        })

        if(!response.ok){
            const cat = fallbackCategory(description)
            console.log("API FAILED → FALLBACK:", cat)
            return res.json({ category: cat })
        }

        const data = await response.json()

        const category = data.choices?.[0]?.message?.content?.trim() || fallbackCategory(description)

        console.log("AI RESPONSE:", category)

        res.json({ category })
    }
    catch(err){
        console.log("ERROR → FALLBACK")

        const cat = fallbackCategory(description)

        console.log("FALLBACK:", cat)

        res.json({ category: cat })
    }
}

module.exports = { categorizeExpense }