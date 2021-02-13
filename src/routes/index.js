import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import Boom from 'boom'
import MD5 from 'crypto-js/md5';
import Runnea from '../lib/runnea'
import config from '../config'
import authMiddleware from '../middlewares/auth'

const router = express.Router()

// router.use(bodyParser.json())

router.use(cors({
  optionsSuccessStatus: 200
}))

router.get('/', (req, res) => res.status(200).json({ status: 1, name: 'Webhook Runnea' }))

router.post('/webhooks/runnea', authMiddleware, async (req, res) => {
  let response = {}
  const body = req.body

  const promocion = config.runnea.promocion
  const password = config.runnea.password

  try {
    let codePromocion = {}

    const sendData = async () => {
      console.log(body.line_items)
      return Promise.all(body.line_items.map(async item => {
        if (item.title.indexOf('Inscripci') >= 0) {

          let emailCustomer = item.properties.length > 0 ? item.properties.filter(item => item.name === 'email')[0].value : body.customer.email
          let distance = item.properties.length > 0 ? item.properties.filter(item => item.name === 'Elige tu distancia')[0].value : ''
          
          if (!emailCustomer) {
            throw Boom.notFound('Email not found or invalid')
          }

          console.log(emailCustomer)
          console.log(distance)

          let control = await MD5(promocion + emailCustomer + password)
          control = control.toString()

          console.log(control)

          codePromocion = await Runnea.addOrder({
            promocion,
            email: emailCustomer,
            control
          })

          console.log(codePromocion)
        }
      }))
    }
    
    await sendData() 
   
    response = {
      data: codePromocion,
      statusCode: 200
    }
  } catch (e) {
    console.log(e)
    response = e.response ? e.response : { error: e, statusCode: 500 }
  }
  console.log('finish')
  res.sendStatus(200)
  // res.status(response.statusCode).json(response)
})


module.exports = router
