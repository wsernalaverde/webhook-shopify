import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import router from './routes'

const app = express()

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// app.use(cors({
//   optionsSuccessStatus: 200
// }))

app.use('/', router)

const PORT = process.env.PORT || 3000

module.exports = {
  async start (portCustom, host = 'localhost') {
    const port = (portCustom === 'test') ? null : portCustom || PORT
    const server = app.listen(port, () => console.log(`Servidor iniciado en el puerto ${port}`))
    return server
  }
}

