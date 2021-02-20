import Tumblr, { TumblrClient } from 'tumblr.js'

// @ts-ignore
import CONFIG from '../config/config.dev'

export const TumblrService = {
  auth: (): void => {
    const client: TumblrClient = Tumblr.createClient({
      consumer_key: CONFIG.tumblr.oauthKey,
      consumer_secret: CONFIG.tumblr.secretKey,
      token: '<oauth token>',
      token_secret: '<oauth token secret>',
    })
  },
}
