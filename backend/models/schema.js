const db = require('../db/db')

function createTables(){
    db.serialize(() => {

        db.run(`
            create table if not exists groups(
                id integer primary key autoincrement,
                name text not null
            )
        `)

        db.run(`
            create table if not exists users(
                id integer primary key autoincrement,
                name text not null,
                group_id integer
            )
        `)

        db.run(`
            create table if not exists expenses(
                id integer primary key autoincrement,
                group_id integer,
                payer_id integer,
                amount real,
                description text
            )
        `)

        db.run(`
            create table if not exists expense_splits(
                id integer primary key autoincrement,
                expense_id integer,
                user_id integer,
                amount_owed real
            )
        `)

    })
}

module.exports = createTables