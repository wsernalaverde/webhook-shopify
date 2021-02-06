const app = require('./dist/index.js')

const init = async () => {
  try {
    await app.start()
  } catch (e) {
    console.log(e)
  }
}

init()
