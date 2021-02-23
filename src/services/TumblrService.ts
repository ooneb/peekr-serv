import Tumblr, { TumblrClient } from '../lib/tumblr';
import passport from 'passport';
import { OAuthStrategy } from 'passport-oauth';

import CONFIG from '../config';

export const TumblrService = {
  initAuth: (): void => {
    passport.serializeUser((user: unknown, done: (err: Error | string | null, id?: unknown) => void) => {
      console.log('serializeUser: ', user);

      done(null, '1');
    });

    passport.deserializeUser(
      (id: string, done: (err: Error | string | null, user?: false | Express.User | null) => void) => {
        console.log('deserializeUser: ' + id);
        done(null, { id });
      }
    );

    passport.use(
      'tumblr',
      new OAuthStrategy(
        {
          requestTokenURL: CONFIG.tumblr.oauth_request,
          accessTokenURL: CONFIG.tumblr.oauth_token,
          userAuthorizationURL: CONFIG.tumblr.oauth_auth,
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
          console.log('profile', profile);
          if (profile) {
            done(null, profile);
          } else {
            done('err profile');
          }
        }
      )
    );
  },

  getUserInfo: async (token: string, tokenSecret: string): Promise<unknown> => {
    const client: TumblrClient = Tumblr.createClient({
      credentials: {
        consumer_key: CONFIG.tumblr.consumer_key,
        consumer_secret: CONFIG.tumblr.consumer_secret,
        token: token,
        token_secret: tokenSecret,
      },
      returnPromises: true,
    });
    console.log(client);

    const user = await client.userInfo();
    console.log(user);

    return user;
  },
};
