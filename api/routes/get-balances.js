const { Router } = require('express')
var bodyParser = require('body-parser')
import axios from 'axios'
import { chains } from 'chain-registry'
let { bech32 } = require('bech32')

const router = Router()

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

/* GET balances. */
router.get('/get-balances', async function (req, res, next) {  
  let decode = bech32.decode(req.query.address) 
  const found = chains.find(element => element.bech32_prefix === decode.prefix)
  const returnBalance = await axios(found.apis.rest[0].address + '/cosmos/bank/v1beta1/balances/' + req.query.address)

  res.json(returnBalance.data)
})

module.exports = router
