import request from 'axios'
import qs from 'qs'
import config from '../config'

class Runnea {
  static async addOrder (data) {
    try {
      const promocion = await request({
        url: `${config.runnea.baseUrl}/php/codigos/promociones/`,
        headers: {
          'Cache-Control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: qs.stringify(data)
      })

      return Promise.resolve(promocion.data)
    } catch (e) {
      return Promise.reject(e)
    }
  }
}

module.exports = Runnea
