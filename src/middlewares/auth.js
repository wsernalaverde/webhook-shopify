import verifyWebhook from 'verify-shopify-webhook'
import Boom from 'boom'
import config from '../config'
 
module.exports = async (req, res, next) => {
  let response = {}

  try {
    // const shopifySecret = process.env.SHOPIFY_SECRET;
    const shopifySecret = config.shopify.secret

    if(!(req.get('x-shopify-hmac-sha256'))) throw Boom.notFound('Not Shopify request')
    if (req.get('x-kotn-webhook-verified')) throw Boom.notFound('Not Shopify request')

    const { verified, topic, domain, body } = await verifyWebhook(
        req,
        shopifySecret
    )

    if (!verified) throw Boom.notFound('Not Shopify request')

    req.body = body

    return next() 
  } catch (e) {
    console.log(e)
    response = e.output ? e.output.payload : { error: e, statusCode: 500 }
    return res.status(response.statusCode).json(response)
  }
}
