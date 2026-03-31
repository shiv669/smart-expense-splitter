const db = require('../db/db')

function createGroup(req, res){
    const { name } = req.body

    if(!name){
        return res.status(400).json({error: 'group name required'})

    }

    const query = `insert into groups (name) values (?)`

    db.run(query, [name], function(err){
        if(err){
            return res.status(500).json({error: err.message})
        }

        res.status(201).json({
            id: this.lastID,
            name: name
        })
    })
}

function getGroups(req, res){
    const query = `SELECT * FROM groups`

    db.all(query, [], (err, rows) => {
        if(err){
            return res.status(500).json({ error: err.message })
        }

        res.json(rows)
    })
}

module.exports = { createGroup, getGroups }