const db = require('../db/db')

function getBalances(req, res){
    const { group_id } = req.params

    const usersQuery = `select * from users where group_id = ?`
    const expensesQuery = `select * from expenses where group_id = ?`
    const splitsQuery = `
        select es.* from expense_splits es
        join expenses e on es.expense_id = e.id
        where e.group_id = ?
    
    `

    db.all(usersQuery, [group_id], (err, users) => {
        if(err){
            return res.status(500).json({ error: err.message })
        }

        let balance = {}

        for(let u of users){
            balance[u.id] = 0
        }

        db.all(expensesQuery, [group_id], (err, expenses) => {
            if(err){
                return res.status(500).json({ error: err.message })
            }

            for(let e of expenses){
                balance[e.payer_id] = balance[e.payer_id] + e.amount
            }

            db.all(splitsQuery, [group_id], (err, splits) => {
                if(err){
                    return res.status(500).json({ error: err.message })
                }

                for(let s of splits){
                    balance[s.user_id] = balance[s.user_id] - s.amount_owed
                }

                res.json(balance)
            })
        })
    })
}

module.exports = { getBalances }