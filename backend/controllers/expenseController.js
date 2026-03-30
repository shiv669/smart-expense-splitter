const db = require('../db/db')

function addExpense(req, res){
    const { group_id, payer_id, amount, description } = req.body

    if(!group_id || !payer_id || !amount){
        return res.status(400).json({ error: 'missing required fields' })
    }

    const getUsersQuery = `select * from users where group_id = ?`

    db.all(getUsersQuery, [group_id], (err, users) => {
        if(err){
            return res.status(500).json({ error: err.message })
        }

        if(users.length == 0){
            return res.status(400).json({ error: 'no users in group' })
        }

        const splitAmount = amount / users.length

        const insertExpense = `insert into expenses (group_id, payer_id, amount, description)
        values (?, ?, ?, ?)`

        db.run(insertExpense, [group_id, payer_id, amount, description], function(err){
            if(err){
                return res.status(500).json({ error: err.message })
            }

            const expense_id = this.lastID

            for(let u of users){
                const insertSplit = `
                    insert into expense_splits (expense_id, user_id, amount_owed)
                    values(?, ?, ?)
                `

                db.run(insertSplit, [expense_id, u.id, splitAmount])
            }

            res.status(201).json({
                message: 'expense added',
                expense_id: expense_id
            })
        })
    })
}

module.exports = { addExpense }