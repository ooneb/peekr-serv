import Tumblr, { TumblrClient } from '../lib/tumblr';
import passport from 'passport';
import { OAuthStrategy } from 'passport-oauth';

import CONFIG from '../config';

const initAuth = (): void => {
  passport.serializeUser((user: unknown, done: (err: Error | string | null, id?: unknown) => void) => {
    console.log('serializeUser: ', user);

    done(null, user);
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
        token: string,
        tokenSecret: string,
        profile: unknown, // useless
        done: (err: Error | string | null, user?: unknown) => void
      ) {
        console.log('profile ?', profile);

        getUserInfo(token, tokenSecret)
          .then((user) => {
            console.log('user', user);
            done(null, user);
          })
          .catch(done);
      }
    )
  );
};

const getUserInfo = async (token: string, tokenSecret: string): Promise<unknown> => {
  const client: TumblrClient = Tumblr.createClient({
    credentials: {
      consumer_key: CONFIG.tumblr.consumer_key,
      consumer_secret: CONFIG.tumblr.consumer_secret,
      token: token,
      token_secret: tokenSecret,
    },
    returnPromises: true,
  });

  const user = await client.userInfo();

  return user;
};

export const TumblrService = {
  initAuth,
  getUserInfo,
};
