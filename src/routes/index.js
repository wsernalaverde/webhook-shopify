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
  let emailCustomer = body.customer.email || body.email
  const password = config.runnea.password

  try {
    // body.line_items.map(item=> {
    //   console.log(item.title)
    // })

    // const getData = async () => {
    //   return Promise.all(body.line_items.map(item=> {
    //     console.log(item.title)
    //   }))
    // }
    
    // await sendData() 
   
    console.log(emailCustomer)

    if (!emailCustomer) {
      throw Boom.notFound('Email not found or invalid')
    }

    let control = await MD5(promocion + emailCustomer + password)
    control = control.toString()

    console.log(control)

    let codePromocion = await Runnea.addOrder({
      promocion,
      email: emailCustomer,
      control
    })

    console.log(codePromocion)
    
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
