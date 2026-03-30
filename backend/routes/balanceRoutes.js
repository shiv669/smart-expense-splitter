const express =require('express')
const router = express.Router()

const { getBalances } = require('../controllers/balanceController')

router.get('/:group_id', getBalances)

module.exports = router