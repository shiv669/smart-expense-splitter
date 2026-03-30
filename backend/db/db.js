const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./expense.db', (err) => {
    if(err){
        console.log('error connecting db')
    }
    else{
        console.log('connected to sqlite database')
    }
})

module.exports = db