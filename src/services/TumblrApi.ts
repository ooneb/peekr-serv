import Tumblr, { TumblrClient } from 'tumblr.js';

import CONFIG from '../config';

interface TumblrCredentials {
  token: string;
  tokenSecret: string;
}

// const promisify = (f: ): Function =>  {
//   const f = () => {
//     const p = new Promise((resolve, reject) => {

//   });
//   }
//   return f;
// }

const createClient = (credentials: TumblrCredentials): TumblrClient => {
  const client: TumblrClient = Tumblr.createClient({
    credentials: {
      consumer_key: CONFIG.tumblr.consumer_key,
      consumer_secret: CONFIG.tumblr.consumer_secret,
      token: credentials.token,
      token_secret: credentials.tokenSecret,
    },
    returnPromises: true,
  });

  return client;
};

const userInfo = async (credentials: TumblrCredentials): Promise<unknown> => {
  const p = new Promise((resolve, reject) => {
    createClient(credentials).userInfo((err: unknown, resp: unknown) => {
      if (err) reject(err);
      else resolve(resp);
    });
  });

  return p;
};

export default {
  userInfo,
};
