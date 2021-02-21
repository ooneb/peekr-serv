import { doesNotMatch } from 'assert'
import passport from 'passport'
import { OAuthStrategy } from 'passport-oauth'

import CONFIG from '../config'

export const TumblrService = {
  initAuth: (): void => {
    passport.serializeUser(
      (
        user: unknown,
        done: (err: Error | string | null, id?: unknown) => void
      ) => {
        console.log('serializeUser: ', user)

        done(null, '1')
      }
    )

    passport.deserializeUser(
      (
        id: string,
        done: (
          err: Error | string | null,
          user?: false | Express.User | null
        ) => void
      ) => {
        console.log('deserializeUser: ' + id)
        done(null, { id })
      }
    )

    passport.use(
      'tumblr',
      new OAuthStrategy(
        {
          requestTokenURL: CONFIG.tumblr.tumblr_oauth_request,
          accessTokenURL: CONFIG.tumblr.tumblr_oauth_token,
          userAuthorizationURL: CONFIG.tumblr.tumblr_oauth_auth,
          consumerKey: CONFIG.tumblr.consumer_key,
          consumerSecret: CONFIG.tumblr.consumer_secret,
          callbackURL: CONFIG.tumblr.oauth_callback,
        },
        function (
          _token: unknown,
          _tokenSecret: unknown,
          profile: unknown,
          done: (err: Error | string | null, user?: unknown) => void
        ) {
          console.log('profile', profile)
          if (profile) {
            done(null, profile)
          } else {
            done('err profile')
          }
        }
      )
    )
  },

  requestToken: async (): Promise<void> => {
    console.log('res')
    console.log(CONFIG)
  },

  //   auth: (): void => {
  //     const client: TumblrClient = Tumblr.createClient({
  //       consumer_key: CONFIG.tumblr.oauthKey,
  //       consumer_secret: CONFIG.tumblr.secretKey,
  //       token: '<oauth token>',
  //       token_secret: '<oauth token secret>',
  //     })
  //   },
}
