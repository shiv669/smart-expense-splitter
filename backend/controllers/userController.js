const db = require('../db/db')

function addUser(req, res){
    const { name, group_id } = req.body

    if(!name || !group_id){
        return res.status(400).json({error: 'name and group_id required'})
    }

    const query = `insert into users (name, group_id) values (?, ?)`

    db.run(query, [name, group_id], function(err){
        if(err){
            return res.status(500).json({error: err.message})
        }

        res.status(201).json({
            id: this.lastID,
            name: name,
            group_id: group_id

        })
    })
}

function getUsers(req, res){
    const { group_id } = req.params

    const query = `select * from users where group_id = ?`

    db.all(query, [group_id], (err, rows) => {
        if(err){
            return res.status(500).json({ error: err.message })
        }

        res.json(rows)
    })
}

module.exports = { addUser, getUsers }