const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const createTables = require('./models/schema')
createTables()

const groupRoutes = require('./routes/groupRoutes')
app.use('/api/groups', groupRoutes)

const port = 5000

app.listen(port, () => {
    console.log('server running on port', port)
})