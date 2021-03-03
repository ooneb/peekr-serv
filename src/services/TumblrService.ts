import passport from 'passport';
import { OAuthStrategy } from 'passport-oauth';

import CONFIG from '../config';
import TumblrApi from './TumblrApi';

const initAuth = (): void => {
  passport.serializeUser((user: unknown, done: (err: Error | string | null, id?: unknown) => void) => {
    done(null, user);
  });

  // passport.deserializeUser(
  //   (id: string, done: (err: Error | string | null, user?: false | Express.User | null) => void) => {
  //     console.log('deserializeUser: ' + id);
  //     done(null, { id });
  //   }
  // );

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

        TumblrApi.userInfo({ token, tokenSecret })
          .then((user) => {
            console.log('user', user);
            done(null, user);
          })
          .catch(done);
      }
    )
  );
};

export const TumblrService = {
  initAuth,
};
