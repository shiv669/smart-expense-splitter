const express = require('express')
const router = express.Router()

const { getSettlements } = require('../controllers/settlementController')

router.get('/:group_id', getSettlements)

module.exports = router